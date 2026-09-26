import gulpReplace from 'gulp-replace'
import through2 from 'through2'
import { env } from '../config/env.js'

const DJANGO_APP_NAME = 'MainApp'

// * Вспомогательная функция формирования подпути
function getStaticSubPath(type, filePath) {
    const processedPath = filePath.replace(/\.scss$/, '.min.css').replace(/\.ts$/, '.min.js')

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

// * Формирование путей для HTML-файлов (Django / Static)
export function resolveHtmlAssetRoute(type, filePath, pathPrefix) {
    const staticSubPath = getStaticSubPath(type, filePath)

    if (env.isDjangoBuild) {
        return `{% static '${DJANGO_APP_NAME}/${staticSubPath}' %}`
    }

    return `${pathPrefix}${staticSubPath}`
}

// * Плагин для автоматической вставки {% load static %} в HTML
export function injectDjangoLoadStatic() {
    return through2.obj(function (file, enc, callback) {
        if (env.isDjangoBuild) {
            let html = file.contents.toString('utf-8')
            if (!html.includes('{% load static %}')) {
                html = `{% load static %}\n${html}`
            }
            file.contents = Buffer.from(html, 'utf-8')
        }
        callback(null, file)
    })
}

// * Замена алиасов в HTML
export function replaceHtmlPaths(pathPrefix) {
    return gulpReplace(
        /@(scss|css|ts|js|audio|fonts|images|videos|misc|libs)\/([^"'\s)]+)/g,
        (match, type, filePath) => resolveHtmlAssetRoute(type, filePath, pathPrefix),
    )
}

// * Замена алиасов в CSS (через относительные пути cssToAssets)
export function replaceCssPaths(cssToAssets) {
    return gulpReplace(
        /@(scss|css|audio|fonts|images|videos|misc|libs)\/([^"'\s)]+)/g,
        (match, type, filePath) => {
            if (type === 'scss' || type === 'css') {
                return './'
            }
            if (type === 'libs') {
                return `${cssToAssets}../libs/${filePath}`
            }
            return `${cssToAssets}${type}/${filePath}`
        },
    )
}
