import gulp from 'gulp'
import { deleteAsync } from 'del'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import { build } from '../../config/build.js'

// * Вспомогательная функция для приведения Windows-путей (C:\...) к POSIX-формату (C:/...)
const toPosix = (p) => (p ? String(p).replace(/\\/g, '/') : '')

// * --- EXPORT GULP TASK CLEAN BUILD DIRECTORY (KEEPING ASSETS)
// * -----------------------------------------------------------
export async function clean() {
    // ! debug-папка от criticalCss — сносим всегда
    await deleteAsync(['./debug__critical_css__screenshots'], { force: true })

    // ! --- DJANGO BUILD BEHAVIOUR
    // ! --------------------------
    if (env.isDjangoBuild) {
        const djangoStatic = toPosix(`${path.djangoBuild.base}/static/${path.djangoAppName}`)
        const djangoTemplates = toPosix(`${path.djangoBuild.base}/templates/${path.djangoAppName}`)
        const djangoMetaTemplates = toPosix(`${path.djangoBuild.base}/templates/meta`)

        if (env.isForceClean) {
            // ! Полный снос собранных артефактов (сохраняем только .gitkeep файлы)
            await deleteAsync(
                [
                    `${djangoStatic}/**/*`,
                    `!${djangoStatic}/**/.gitkeep`,

                    `${djangoTemplates}/**/*`,
                    `!${djangoTemplates}/**/.gitkeep`,

                    `${djangoMetaTemplates}/**/*`,
                    `!${djangoMetaTemplates}/**/.gitkeep`,
                ],
                { force: true, dryRun: false },
            )
        } else {
            // ! Обычная очистка — удаляем по путям из конфига (с нормализацией путей)
            const cleanPaths = Array.isArray(path.djangoClean)
                ? path.djangoClean.map(toPosix)
                : [toPosix(path.djangoClean)]

            await deleteAsync(cleanPaths, { force: true })
        }
        return
    }

    // ! --- DEFAULT BEHAVIOUR
    // ! ---------------------
    const buildBase = toPosix(build.base)
    const zipPath = toPosix(path.zip)

    if (env.isForceClean) {
        // * Полное удаление всей папки dist и архива
        await deleteAsync([zipPath, buildBase].filter(Boolean), { force: true })
    } else {
        await deleteAsync(
            [
                // * все файлы и подпапки в dist/
                `${buildBase}/**`,

                // * архив
                zipPath,

                // ! сохраняем директории и их содержимое
                `!${buildBase}`,
                `!${buildBase}/assets`,
                `!${buildBase}/assets/**`,
                `!${buildBase}/libs`,
                `!${buildBase}/libs/**`,
                `!${buildBase}/rev-manifest.json`,
            ].filter(Boolean),
            { force: true },
        )
    }
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('clean', clean)
