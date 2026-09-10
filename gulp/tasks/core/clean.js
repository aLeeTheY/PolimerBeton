import gulp from 'gulp'
import { deleteAsync } from 'del'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'

// * --- EXPORT GULP TASK CLEAN BUILD DIRECTORY (KEEPING ASSETS)
// * -----------------------------------------------------------
export async function clean() {
    if (env.isForceClean) {
        // Полное удаление всей папки dist
        await deleteAsync([path.zip, path.build.base])
    } else {
        await deleteAsync([
            // * select all files in dist/ folder first
            `${path.build.base}/**`,

            // * select archive folder
            path.zip,

            // ! keep folders dist/, assets/** и libs/**
            // * keep dist/ folder
            `!${path.build.base}`,

            // * keep assets/ folder
            `!${path.build.base}/assets`,

            // * keep any folder inside assets/ folder
            `!${path.build.base}/assets/**`,

            // * keep libs/ folder
            `!${path.build.base}/libs`,

            // * keep any folder inside libs/ folder
            `!${path.build.base}/libs/**`,

            // ! keep rev-manifest.json
            `!${path.build.base}/rev-manifest.json`,
        ])
    }

    // * It's okay
    Promise.resolve()
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('clean', clean)
