// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE
// ! Refactored for stability, cache invalidation, and CPU safety.
// ! ------------------------------------------------------------

import fs from 'fs'
import gulp from 'gulp'
import nodePath from 'path'
import browserSync from 'browser-sync'
import spawn from 'cross-spawn'

import { env } from '../../../config/env.js'
import { path as appPath } from '../../../config/path.js'
import { assetExists } from '../../../helpers/asset-exists.js'
import { notify, NOTIFICATION_HANDLER_TITLES } from '../../../helpers/error-handler.js'

const RAW = 'src/assets/fonts'
const OUT = appPath.build.fonts
const REQUIRED_TOOLS = ['ftcli']

// * Настройка целевых форматов
const TARGET_FORMATS = env.fontFormats || ['woff2', 'woff', 'ttf']

// ------------------- Helpers -------------------

async function checkRequiredTools() {
    for (const tool of REQUIRED_TOOLS) {
        try {
            await spawnPromise(tool, ['--version'], { verbose: false })
        } catch {
            throw new Error(
                `CLI tool "${tool}" is not installed or not accessible. Install it globally or as dev dependency.`,
            )
        }
    }
}

function spawnPromise(cmd, args, { verbose = false } = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, {
            stdio: verbose ? 'inherit' : 'pipe',
        })

        let stderr = ''

        if (!verbose) {
            proc.stderr.on('data', (data) => {
                stderr += data
            })
        }

        proc.on('close', (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(stderr || `Command failed with code ${code}`))
            }
        })
        proc.on('error', reject)
    })
}

function getRawFontFiles() {
    if (!fs.existsSync(RAW)) {
        return []
    }

    const files = fs.readdirSync(RAW, { recursive: true, withFileTypes: true })
    return files
        .filter((dirent) => dirent.isFile() && /\.(ttf|otf|woff|woff2)$/i.test(dirent.name))
        .map((dirent) => {
            // Поддержка Node.js < 20 (dirent.path) и >= 21 (dirent.parentPath)
            const dirPath = dirent.parentPath || dirent.path || RAW
            return nodePath.relative(RAW, nodePath.join(dirPath, dirent.name))
        })
        .sort()
}

/**
 * Проверяет наличие форматов И актуальность по дате модификации
 */
function isUpToDate(rawInput, outBase) {
    const outDir = nodePath.dirname(outBase)
    const baseName = nodePath.basename(outBase)

    return TARGET_FORMATS.every((ext) => assetExists(outDir, baseName, `.${ext}`, rawInput))
}

// ------------------- Font conversion -------------------

async function convertRawFonts() {
    await checkRequiredTools()

    const rawFiles = getRawFontFiles()
    if (rawFiles.length === 0) {
        notify.warn(NOTIFICATION_HANDLER_TITLES.FONTS, 'No fonts to convert.')
        return { updated: 0, skipped: 0, failures: [] }
    }

    let updated = 0
    let skipped = 0
    const failures = []

    // * ИСПОЛЬЗУЕМ FOR...OF ВМЕСТО PROMISE.ALL ДЛЯ ЗАЩИТЫ CPU И ПАМЯТИ
    for (const relPath of rawFiles) {
        const rawInput = nodePath.join(RAW, relPath)
        const parsed = nodePath.parse(relPath)
        const outDir = nodePath.join(OUT, parsed.dir)
        const outBase = nodePath.join(outDir, parsed.name)

        // Проверяем наличие файлов и их актуальность
        if (isUpToDate(rawInput, outBase)) {
            skipped++
            continue
        }

        try {
            fs.mkdirSync(outDir, { recursive: true })
            const ext = parsed.ext.toLowerCase()
            const tempTtf = `${outBase}.ttf`

            // 1. Приводим исходник к промежуточному TTF
            if (ext === '.ttf') {
                fs.copyFileSync(rawInput, tempTtf)
            } else if (ext === '.otf') {
                await spawnPromise(
                    'ftcli',
                    ['converter', 'otf2ttf', rawInput, '--output-dir', outDir],
                    { verbose: env.isVerbose },
                )
            } else if (ext === '.woff' || ext === '.woff2') {
                await spawnPromise(
                    'ftcli',
                    ['converter', 'wf2ft', rawInput, '--output-dir', outDir],
                    { verbose: env.isVerbose },
                )
            }

            // 2. Генерируем WOFF / WOFF2 напрямую
            const needsWoff = TARGET_FORMATS.includes('woff')
            const needsWoff2 = TARGET_FORMATS.includes('woff2')

            if ((needsWoff || needsWoff2) && fs.existsSync(tempTtf)) {
                await spawnPromise(
                    'ftcli',
                    ['converter', 'ft2wf', tempTtf, '--output-dir', outDir, '--overwrite'],
                    { verbose: env.isVerbose },
                )

                // ftcli генерирует name.ttf.woff и name.ttf.woff2
                // Переименовываем в name.woff / name.woff2 или удаляем ненужные
                const genWoff = `${tempTtf}.woff`
                const genWoff2 = `${tempTtf}.woff2`
                const targetWoff = `${outBase}.woff`
                const targetWoff2 = `${outBase}.woff2`

                if (fs.existsSync(genWoff)) {
                    if (needsWoff) {
                        fs.renameSync(genWoff, targetWoff)
                    } else {
                        fs.unlinkSync(genWoff)
                    }
                }

                if (fs.existsSync(genWoff2)) {
                    if (needsWoff2) {
                        fs.renameSync(genWoff2, targetWoff2)
                    } else {
                        fs.unlinkSync(genWoff2)
                    }
                }
            }

            // 3. Очищаем промежуточный TTF, если он не нужен в итоговом билде
            if (!TARGET_FORMATS.includes('ttf') && fs.existsSync(tempTtf)) {
                fs.unlinkSync(tempTtf)
            }

            updated++
        } catch (err) {
            failures.push({ file: relPath, error: err.message })
        }
    }

    // Логирование итогов
    if (failures.length > 0) {
        notify.warn(
            NOTIFICATION_HANDLER_TITLES.FONTS,
            `Fonts: ${updated} updated, ${skipped} skipped, ${failures.length} failed. \nFirst error: ${failures[0].error}`,
        )
    } else if (updated > 0) {
        notify.success(
            NOTIFICATION_HANDLER_TITLES.FONTS,
            `Fonts: ${updated} updated, ${skipped} skipped.`,
        )
    }

    return { updated, skipped, failures }
}

// ------------------- Main Gulp task -------------------

export async function fonts() {
    try {
        const { updated, failures } = await convertRawFonts()

        // Перезагружаем браузер только если были реальные изменения и не всё упало
        if (updated > 0 || failures.length > 0) {
            browserSync.reload()
        }
    } catch (error) {
        // Защищаем Gulp watch от падения при фатальных ошибках (например, нет ftcli)
        notify.warn(NOTIFICATION_HANDLER_TITLES.FONTS, `Fatal Error: ${error.message}`)
    }
}

gulp.task('fonts', fonts)
