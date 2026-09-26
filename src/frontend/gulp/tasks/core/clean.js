import gulp from 'gulp'
import { deleteAsync } from 'del'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import { build } from '../../config/build.js'

// * --- EXPORT GULP TASK CLEAN BUILD DIRECTORY (KEEPING ASSETS)
// * -----------------------------------------------------------
export async function clean() {
    // ! --- DJANGO BUILD BEHAVIOUR
    // ! --------------------------
    if (env.isDjangoBuild) {
        await deleteAsync(path.djangoClean, { force: true })
        return
    }

    // ! --- DEFAULT BEHAVIOUR
    // ! ---------------------
    if (env.isForceClean) {
        // Полное удаление всей папки dist
        await deleteAsync([path.zip, build.base], { force: true })
    } else {
        await deleteAsync(
            [
                // * select all files in dist/ folder first
                `${build.base}/**`,

                // * select archive folder
                path.zip,

                // ! keep folders dist/, assets/** и libs/**
                // * keep dist/ folder
                `!${build.base}`,

                // * keep assets/ folder
                `!${build.base}/assets`,

                // * keep any folder inside assets/ folder
                `!${build.base}/assets/**`,

                // * keep libs/ folder
                `!${build.base}/libs`,

                // * keep any folder inside libs/ folder
                `!${build.base}/libs/**`,

                // ! keep rev-manifest.json
                `!${build.base}/rev-manifest.json`,
            ],
            { force: true },
        )
    }
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('clean', clean)
