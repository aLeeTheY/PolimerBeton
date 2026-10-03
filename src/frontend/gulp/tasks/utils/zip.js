/* eslint-disable no-console */
import fs from 'fs'

import gulp from 'gulp'
import gulpZip from 'gulp-zip'
import { deleteAsync } from 'del'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import { build } from '../../config/build.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// * --- EXPORT GULP TASK FOR PUSH PROJECT BUILD TO ZIP ARCHIVE
// * ----------------------------------------------------------
export async function zip() {
    // if (env.isDjangoBuild) {
    //     console.error('\n\x1b[31m%s\x1b[0m\n', `❌ Error: Zip is not available for django builds.`)
    //     process.exit(1)
    // }

    // ошибка если папки `./dist` нету
    if (!fs.existsSync(build.base)) {
        console.error(
            '\n\x1b[31m%s\x1b[0m\n',
            `❌ Error: Build directory "${build.base}" does not exist. Run "gulp prod" or "gulp dev" first.`,
        )
        process.exit(1) // Ломаем процесс с кодом ошибки, чтобы дальнейший пайплайн не выполнялся
    }

    // удаляем старый архив
    await deleteAsync(`${path.zip}/${path.projectRootFolderName}.zip`)

    // основной пайплайн
    return gulp
        .src(`${build.base}/**/*.*`, { encoding: false })
        .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.ZIP))
        .pipe(gulpZip(`${path.projectRootFolderName}.zip`))
        .pipe(gulp.dest(`${path.zip}/`))
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('zip', zip)
