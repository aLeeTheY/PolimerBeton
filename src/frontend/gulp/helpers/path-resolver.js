import through2 from 'through2'
import gulpReplace from 'gulp-replace'

import { env } from '../config/env.js'
import { path } from '../config/path.js'

// * Вспомогательная функция формирования подпути
function getStaticSubPath(type, filePath) {
    const processedPath = filePath
        .replace(/\.(scss|sass)$/i, '.min.css')
        .replace(/\.(ts|tsx)$/i, '.min.js')

    switch (type) {
        case 'scss':
        case 'css':
            return `css/${processedPath}`
        case 'ts':
        case 'js':
            return `js/${processedPath}`
        case 'audio':
        case 'fonts':
        case 'images':
        case 'videos':
        case 'misc':
            return `assets/${type}/${processedPath}`
        case 'libs':
            return `libs/${processedPath}`
        default:
            return processedPath
    }
}

// * Формирование путей для HTML-файлов (относительные/абсолютные пути или {% static %})
export function resolveHtmlAssetRoute(type, filePath, pathPrefix) {
    const staticSubPath = getStaticSubPath(type, filePath)

    // ! Если идет сборка под Django — оборачиваем в {% static %}
    if (env.isDjangoBuild) {
        const appPrefix = path.djangoAppName ? `${path.djangoAppName.replace(/\/$/, '')}/` : ''
        return `{% static '${appPrefix}${staticSubPath}' %}`
    }

    return `${pathPrefix}${staticSubPath}`
}

// * Плагин для автоматической вставки {% load static %} в HTML
export function injectDjangoLoadStatic() {
    return through2.obj(function (file, enc, callback) {
        if (!env.isDjangoBuild || file.isNull()) {
            return callback(null, file)
        }

        if (file.isStream()) {
            return callback(new Error('Streaming is not supported in injectDjangoLoadStatic'))
        }

        let html = file.contents.toString('utf-8')

        // ! Проверяем, есть ли уже load static в любой форме:
        // !   {% load static %}
        // !   {% load static i18n %}
        // !   {% load i18n static %}
        const hasLoadStatic = /{%\s*load\s+[^%]*\bstatic\b[^%]*%}/.test(html)

        if (!hasLoadStatic) {
            // ! Ищем {% extends %} — если есть, {% load %} должен идти после него
            const extendsRegex = /{%\s*extends\s+["'][^"']+["']\s*%}/
            const extendsMatch = html.match(extendsRegex)

            if (extendsMatch) {
                // * Вставляем {% load static %} СРАЗУ после {% extends %}
                const extendsEnd = extendsMatch.index + extendsMatch[0].length
                html = html.slice(0, extendsEnd) + '\n{% load static %}' + html.slice(extendsEnd)
            } else {
                // ! Вставляем ПОСЛЕ <!doctype html>, чтобы НЕ включать quirks mode.
                const doctypeRegex = /<!doctype\s+html[^>]*>/i
                const doctypeMatch = html.match(doctypeRegex)

                if (doctypeMatch) {
                    const doctypeEnd = doctypeMatch.index + doctypeMatch[0].length
                    html =
                        html.slice(0, doctypeEnd) + '\n{% load static %}' + html.slice(doctypeEnd)
                } else {
                    // * Fallback — если вдруг нет doctype
                    html = `{% load static %}\n${html}`
                }
            }
        }

        file.contents = Buffer.from(html, 'utf-8')
        callback(null, file)
    })
}

// * Замена алиасов в HTML
export function replaceHtmlPaths(pathPrefix) {
    return gulpReplace(
        /@(scss|css|ts|js|audio|fonts|images|videos|misc|libs)\/([^"'\s,)]+)/g,
        (match, type, filePath) => resolveHtmlAssetRoute(type, filePath, pathPrefix),
    )
}

// * Замена алиасов в CSS (через относительные пути cssToAssets)
export function replaceCssPaths(cssToAssets) {
    return gulpReplace(
        /@(scss|css|audio|fonts|images|videos|misc|libs)\/([^"'\s,)]+)/g,
        (match, type, filePath) => {
            if (type === 'scss' || type === 'css') {
                const processed = filePath.replace(/\.(scss|sass)$/i, '.css')
                return `./${processed}`
            }

            // * Если собираем под Django, формируем абсолютный путь через /static/appName/
            if (env.isDjangoBuild) {
                const appName = path.djangoAppName
                    ? path.djangoAppName.replace(/^\/+|\/+$/g, '')
                    : ''
                const appPrefix = appName ? `${appName}/` : ''
                const prefix = `/static/${appPrefix}` // Получится /static/MainApp/

                if (type === 'libs') {
                    return `${prefix}libs/${filePath}`
                }
                return `${prefix}assets/${type}/${filePath}`
            }

            // * Обычная сборка для локального dev-сервера Gulp
            if (type === 'libs') {
                return `${cssToAssets}../libs/${filePath}`
            }
            return `${cssToAssets}${type}/${filePath}`
        },
    )
}
