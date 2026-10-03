import gulp from 'gulp'
import gulpIf from 'gulp-if'
import gulpReplace from 'gulp-replace'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import { build } from '../../config/build.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'
import { getDomainRegex, DJANGO_DOMAIN } from '../../helpers/django-domain.js'
import { injectDjangoLoadStatic } from '../../helpers/path-resolver.js'

// * --- PROCESSING WEBMANIFEST
// * --------------------------
function metaWebManifest() {
    const domainRegex = getDomainRegex()

    return (
        gulp
            .src(path.src.meta.favicon.webManifest)
            .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.META.FAVICON.WEB_MANIFEST))

            // ! {% load static %} в начало файла для Django-билда.
            // ! Без него {% static %} в манифесте не распарсится.
            // ! Для non-Django — no-op (внутри есть guard env.isDjangoBuild).
            .pipe(injectDjangoLoadStatic())

            // * @meta/favicon/... → путь к иконке (разный для двух билдов)
            .pipe(
                gulpReplace(/@meta\/([^"'\s)]+)/g, (match, fullPath) => {
                    if (env.isDjangoBuild) {
                        return `{% static '${path.djangoAppName}/meta/${fullPath}' %}`
                    }
                    // Non-Django: иконки в корне dist/, срезаем favicon/
                    return `/${fullPath.replace(/^favicon\//, '')}`
                }),
            )

            // * домен → {{ site_config.domain }} (только Django)
            .pipe(gulpIf(Boolean(domainRegex), gulpReplace(domainRegex, DJANGO_DOMAIN)))

            .pipe(gulp.dest(build.meta.text))
            .on('end', () => {
                // * update dev server
                browserSync.reload()
            })
    )
}

// * --- FAVICON COPY
// * ----------------
function metaFavicon() {
    return gulp
        .src(path.src.meta.favicon.images, { encoding: false })
        .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.META.FAVICON.IMAGES))
        .pipe(gulp.dest(build.meta.favicon))
        .on('end', () => {
            // * update dev server
            browserSync.reload()
        })
}

// * --- TEXT META FILES COPY
// * ------------------------
function metaText() {
    const formattedDate = new Date().toISOString().split('T')[0]
    const domainRegex = getDomainRegex()

    return gulp
        .src(path.src.meta.text)
        .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.META.TEXT))

        .pipe(gulpReplace(/@meta__site-url/g, env.siteUrl))
        .pipe(gulpReplace(/@meta__date/g, formattedDate))
        .pipe(gulpIf(Boolean(domainRegex), gulpReplace(domainRegex, DJANGO_DOMAIN)))

        .pipe(gulp.dest(build.meta.text))
        .on('end', () => {
            // * update dev server
            browserSync.reload()
        })
}

// * --- EXPORT GULP TASK FOR META FILES
// * -----------------------------------
export const meta = gulp.parallel(metaWebManifest, metaFavicon, metaText)

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('meta', meta)
