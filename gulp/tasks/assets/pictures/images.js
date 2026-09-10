// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------
/* eslint-disable no-console */

import gulp from 'gulp'
import nodePath from 'path'
import through2 from 'through2'
import browserSync from 'browser-sync'

import { env } from '../../../config/env.js'
import { path } from '../../../config/path.js'
import {
    notify,
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../../helpers/error-handler.js'
import { assetFamilyExists } from '../../../helpers/asset-exists.js'

// import Vinyl from 'vinyl'
import sharp from 'sharp'
// import sharpOptimizeImages from 'gulp-sharp-optimize-images'

// ! --- CONFIGURATION (MUST MATCH WITH HTML TRANSFORMER!)
// ! -----------------------------------------------------
const IMAGE_CONFIG = [
    {
        suffix: '-mobile',
        baseWidth: 375,
        densities: [1, 2], // Сгенерирует: 768w, 1536w
    },
    // Десктоп / Натив (без суффикса) сгенерируется автоматически ниже
]

// ! Список папок (или частей пути), для которых не нужно генерировать адаптивные версии
const IGNORE_RESPONSIVE_FOLDERS = ['open_graph']

// * --- PROCESS AND OPTIMIZE WITH SHARP DIRECTLY
// * --------------------------------------------
function processAndOptimizeImages() {
    let updated = 0
    let skipped = 0
    let generatedCount = 0

    return through2.obj(
        async function (file) {
            if (file.isNull()) {
                return
            }
            if (file.isStream()) {
                this.emit('error', new Error('Streaming not supported'))
                return
            }

            const ext = file.extname.toLowerCase()
            if (ext === '.gif') {
                this.push(file)
                generatedCount++
                updated++
                return
            }

            // Определяем подпапку в dist, куда попадёт файл
            const outSubDir = nodePath.join(
                nodePath.resolve(path.build.images),
                nodePath.dirname(file.relative),
            )
            const rawBaseName = file.stem

            // Получаем относительный путь папки (например, 'assets/icons')
            const relativeDir = nodePath.dirname(file.relative)

            // Проверяем, совпадает ли путь с какой-либо из папок в игнор-листе
            const shouldIgnoreResponsive = IGNORE_RESPONSIVE_FOLDERS.some((folder) =>
                relativeDir.split(nodePath.sep).includes(folder),
            )

            if (env.isVerbose) {
                console.log(`[images] checking ${file.relative}`)
            }

            try {
                // Если исходник уже обрабатывался — пропускаем
                if (assetFamilyExists(outSubDir, rawBaseName, file.stat)) {
                    skipped++
                    if (env.isVerbose) {
                        console.log(`[images] skipping (up-to-date): ${file.relative}`)
                    }
                    return
                }

                updated++
                if (env.isVerbose) {
                    console.log(`[images] processing: ${file.relative}`)
                }

                const metadata = await sharp(file.contents).metadata()
                const originalWidth = metadata.width

                // * 1. СОБИРАЕМ СПИСОК ЗАДАЧ (КАКИЕ РАЗМЕРЫ РЕЗАТЬ)
                const renderTasks = []

                // * Задача А: Оригинальная (нативная) картинка без суффикса
                renderTasks.push({ suffix: '', targetWidth: null })

                // * Задача Б: Адаптивные версии и их Retina-копии
                if (!shouldIgnoreResponsive) {
                    for (const bp of IMAGE_CONFIG) {
                        for (const density of bp.densities) {
                            const targetWidth = bp.baseWidth * density

                            // ! ВАЖНО: Если оригинал меньше, чем нужен для @2x/@3x — пропускаем!
                            // ! Но 1x генерируем всегда (sharp просто не будет её увеличивать благодаря withoutEnlargement)
                            if (density > 1 && originalWidth < targetWidth) {
                                continue
                            }

                            const densitySuffix = density === 1 ? '' : `@${density}x`
                            renderTasks.push({
                                suffix: `${bp.suffix}${densitySuffix}`,
                                targetWidth: targetWidth,
                            })
                        }
                    }
                }

                // * 2. ГЕНЕРИРУЕМ ФАЙЛЫ ДЛЯ КАЖДОЙ ЗАДАЧИ | МНОГОПОТОК

                // ? Читаем исходник в Sharp ровно один раз
                const baseSharpInstance = sharp(file.contents)
                const renderPromises = []

                for (const task of renderTasks) {
                    let pipeline = baseSharpInstance.clone()

                    if (task.targetWidth) {
                        // ? withoutEnlargement не даст "растянуть" картинку,
                        // ? если она меньше targetWidth (например, для 1x)
                        pipeline = pipeline.resize({
                            width: task.targetWidth,
                            withoutEnlargement: true,
                        })
                    }

                    // ? Базовый (нативный) формат
                    const formatsToGenerate = [{ ext: ext, type: ext.replace('.', '') }]

                    // ? Добавляем современные форматы, только если исходник ими не является
                    if (ext !== '.webp') {
                        formatsToGenerate.push({ ext: '.webp', type: 'webp' })
                    }
                    if (ext !== '.avif') {
                        formatsToGenerate.push({ ext: '.avif', type: 'avif' })
                    }

                    for (const format of formatsToGenerate) {
                        let formatPipeline = pipeline.clone()

                        // * Настройки компрессии
                        if (format.type === 'jpg' || format.type === 'jpeg') {
                            formatPipeline = formatPipeline.jpeg({
                                quality: env.buildMode.isDev ? 100 : 80,
                                mozjpeg: env.buildMode.isStaging || env.buildMode.isProd,
                                progressive: true,
                            })
                        } else if (format.type === 'png') {
                            formatPipeline = formatPipeline.png({
                                effort: env.buildMode.isDev ? 1 : 10,
                                quality: env.buildMode.isDev ? 100 : 80,
                                compressionLevel: env.buildMode.isDev ? 0 : 9,
                                palette: true,
                            })
                        } else if (format.type === 'webp') {
                            formatPipeline = formatPipeline.webp({
                                effort: env.buildMode.isDev ? 0 : 6,
                                quality: env.buildMode.isDev ? 100 : 60,
                            })
                        } else if (format.type === 'avif') {
                            formatPipeline = formatPipeline.avif({
                                effort: env.buildMode.isDev ? 0 : 9,
                                quality: env.buildMode.isDev ? 100 : 50,
                                bitdepth: 8,
                            })
                        }

                        // ? Асинхронно запускаем рендер и кладем промис в массив
                        const processTask = async () => {
                            const outputBuffer = await formatPipeline.toBuffer()
                            const newFile = file.clone({ contents: false })

                            // * Добавляем суффикс (например: -mobile@2x)
                            newFile.stem = rawBaseName + task.suffix

                            newFile.extname = format.ext
                            newFile.contents = outputBuffer
                            this.push(newFile)
                        }

                        renderPromises.push(processTask())
                    }
                }

                await Promise.all(renderPromises)
                generatedCount += renderPromises.length
            } catch (err) {
                this.emit('error', err)
                throw err
            }
        },
        function (cb) {
            notify.success(
                NOTIFICATION_HANDLER_TITLES.IMAGES,
                `Images: ${updated} updated, ${skipped} skipped (${generatedCount} files)`,
            )
            cb()
        },
    )
}

// * --- EXPORT GULP TASK FOR IMAGES (RASTER) FILES
// * ----------------------------------------------
export function images() {
    return (
        gulp
            .src(path.src.images.files, { encoding: false })
            .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.IMAGES))
            // * генерируем адаптивные копии (они получат суффиксы -mobile, -tablet и т.д.)
            // .pipe(generateResponsiveImages())
            // * генерируем avif/webp и оптимизируем изображения
            // .pipe(
            //     sharpOptimizeImages({
            //         // * format {from}_to_{to}
            //         jpg_to_jpg: {
            //             quality: env.buildMode.isDev ? 100 : 80,
            //             mozjpeg: env.buildMode.isStaging || env.buildMode.isProd,
            //             progressive: true,
            //         },
            //         png_to_png: {
            //             effort: env.buildMode.isDev ? 1 : 10,
            //             quality: env.buildMode.isDev ? 100 : 80,
            //             progressive: true,
            //             compressionLevel: env.buildMode.isDev ? 0 : 9,
            //         },
            //         webp: {
            //             effort: env.buildMode.isDev ? 0 : 6,
            //             quality: env.buildMode.isDev ? 100 : 60,
            //             // lossless: true,
            //             // nearLossless: true,
            //         },
            //         avif: {
            //             effort: env.buildMode.isDev ? 0 : 9,
            //             quality: env.buildMode.isDev ? 100 : 50,
            //             bitdepth: 8,
            //             // lossless: false,
            //         },
            //         // gif: {},
            //     }),
            // )
            // * генерируем адаптивные размеры + конвертируем в форматы + сжимаем
            .pipe(processAndOptimizeImages())
            .pipe(gulp.dest(path.build.images))
            .on('end', () => {
                // * update dev server
                browserSync.reload()
            })
    )
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('images', images)
