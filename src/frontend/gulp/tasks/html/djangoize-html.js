import gulp from 'gulp'
import gulpIf from 'gulp-if'
import gulpReplace from 'gulp-replace'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import { build } from '../../config/build.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'
import { injectDjangoLoadStatic, replaceHtmlPaths } from '../../helpers/path-resolver.js'
import { getDomainRegex, DJANGO_DOMAIN } from '../../helpers/django-domain.js'

export function djangoizeHtml() {
    if (!env.isDjangoBuild) {
        return Promise.resolve()
    }

    const domainRegex = getDomainRegex()
    const pathPrefix = env.assetPrefix
    const appPrefix = path.djangoAppName ? `${path.djangoAppName.replace(/\/$/, '')}/` : ''

    return (
        gulp
            .src([`${build.html}/**/*.html`], { base: build.html })
            .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.HTML))

            // 1. {% load static %}
            .pipe(injectDjangoLoadStatic())

            // 2. домен → {{ site_config.domain }}
            .pipe(gulpIf(Boolean(domainRegex), gulpReplace(domainRegex, DJANGO_DOMAIN)))

            // 3. @page/... → {% url %}
            .pipe(
                gulpReplace(/@page\/([a-zA-Z0-9_/-]+)\.(njk|html)/g, (match, pageName) => {
                    return `{% url '${pageName.replace(/\//g, '_')}' %}`
                }),
            )

            // 4. @scss/... @fonts/... @images/... @libs/... → {% static %}
            .pipe(replaceHtmlPaths(pathPrefix))

            // 5. @icons/... → {% static %}
            .pipe(
                gulpReplace(/@icons\/(.+?)\.svg/g, (match, p1) => {
                    const id = p1.replace(/\//g, '--')
                    if (env.isInlineSprite) {
                        return `#${id}`
                    }
                    return `{% static '${appPrefix}assets/icons/sprite.svg' %}#${id}`
                }),
            )

            // 6. @meta/... → {% static %} или URL
            .pipe(
                gulpReplace(/@meta\/([^"'\s,)]+)/g, (match, fullPath) => {
                    const isTechnicalFile = /\.(txt|xml|webmanifest)$/i.test(fullPath)

                    if (isTechnicalFile) {
                        const cleanPath = fullPath.replace(/^favicon\//, '')
                        return `/${cleanPath}`
                    }

                    return `{% static '${appPrefix}meta/${fullPath}' %}`
                }),
            )

            .pipe(gulp.dest(build.html))
    )
}

gulp.task('djangoize-html', djangoizeHtml)
