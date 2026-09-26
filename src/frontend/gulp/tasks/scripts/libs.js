import gulp from 'gulp'
import browserSync from 'browser-sync'

import { path } from '../../config/path.js'
import { build } from '../../config/build.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// * --- EXPORT GULP TASK FOR (JS/TS) LIBS FILES
// * -------------------------------------------
export function libs() {
    return gulp
        .src(path.src.libs)
        .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.LIBS))
        .pipe(gulp.dest(build.libs))
        .on('end', () => {
            // * update dev server
            browserSync.reload()
        })
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('libs', libs)
