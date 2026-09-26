import gulp from 'gulp'
import through2 from 'through2'
import { readFileSync } from 'node:fs'

import rev from 'gulp-rev'
import revRewrite from 'gulp-rev-rewrite'
import revDel from 'gulp-rev-delete-original'

// import { path } from '../../config/path.js'
import { build } from '../../config/build.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// Проверка: не является ли имя файла уже ревизованным (содержит хеш)
const isAlreadyHashed = (file) => {
    const base = file.stem // имя без расширения
    return /-[a-f0-9]{10,}$/.test(base)
}

// * --- ASSET REVISIONING
// * ---------------------
function revision() {
    return (
        gulp
            // * берем готовые собранные ассеты
            // ! НЕ БЕРЕМ favicon.ico, robots.txt и sitemap.xml
            .src(
                [
                    `${build.base}/**/*.{css,js,woff,woff2,ttf,svg,avif,webp,png,jpeg,jpg,webm,mp4,mp3,webmanifest}`,

                    // ! не создавать ревизии для JS библиотек и JS-чанков !!!
                    `!${build.libs}**/*`,
                    `!${build.scripts}chunks/**/*`,
                ],
                {
                    base: build.base,
                    encoding: false,
                },
            )
            // * подключаем plumber
            .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.REVISION.DEFAULT))
            // * добавляем ревизию к имени файлов
            .pipe(
                through2.obj(function (file, enc, callback) {
                    // Пропускаем уже хешированные файлы
                    if (isAlreadyHashed(file)) {
                        // Просто передаём дальше без обработки rev()
                        this.push(file)
                        return callback()
                    }
                    // Иначе обрабатываем через rev
                    const revStream = rev()
                    revStream.on('data', (f) => this.push(f))
                    revStream.on('end', callback)
                    revStream.write(file)
                    revStream.end()
                }),
            )
            // * удаляем оригинальные файлы до ревизии
            .pipe(revDel())
            // * перезаписываем файлы с новым именем
            .pipe(gulp.dest(build.base))
            // * генерируем rev-manifest.json
            .pipe(
                rev.manifest(`${build.base}/rev-manifest.json`, {
                    base: `${build.base}/`,
                    merge: true,
                }),
            )
            // * перезаписываем rev-manifest.json
            .pipe(gulp.dest(build.base))
    )
}

// * --- REWRITING REFERENCES
// * ------------------------
function rewrite() {
    const manifest = readFileSync(`${build.base}/rev-manifest.json`)

    return (
        gulp
            // * берем готовые собранные html
            .src(`${build.base}/**/*.{html,css,webmanifest}`)
            // * подключаем plumber
            .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.REVISION.REWRITE))
            // * перезаписываем пути к новым ассетам с ревизиями
            .pipe(revRewrite({ manifest }))
            // * сохраняем обновленный html
            .pipe(gulp.dest(build.base))
    )
}

// * --- DELETE REVISION MANIFEST FILE
// * ---------------------------------
// deleteManifest больше не нужен, оставляем пустую функцию для совместимости
function deleteManifest(done) {
    done()
}

// function deleteManifest(done) {
//     if (env.buildMode.isProd) {
//         deleteAsync(`${build.base}/rev-manifest.json`).then(() => {
//             done()
//         })
//     } else {
//         done()
//     }
// }

// * --- EXPORT GULP TASK
// * --------------------
export const revise = gulp.series(revision, rewrite, deleteManifest)

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('revise', revise)
