import fs from 'fs'
import nodePath from 'node:path'

import gulp from 'gulp'
import browserSync from 'browser-sync'

import { env } from '../../../config/env.js'
import { path } from '../../../config/path.js'
import { build } from '../../../config/build.js'

// * Создаем изолированный инстанс специально для Critical CSS
const criticalBsInstance = browserSync.create('critical-css-server')

// * Middleware для автоматического отсечения сабфолдера из конфига
function subfolderMiddleware(req, res, next) {
    const prefix = (env.assetPrefix || '').replace(/\/$/, '')

    if (prefix && (req.url === prefix || req.url.startsWith(prefix + '/'))) {
        req.url = req.url.slice(prefix.length) || '/'
    }

    next()
}

// * Общий middleware для убирания .html из URL
function cleanUrlMiddleware(req, res, next) {
    const [urlPath, queryString] = req.url.split('?')
    const suffix = queryString ? '?' + queryString : ''

    if (urlPath !== '/' && !urlPath.includes('.')) {
        if (urlPath.endsWith('/')) {
            // '/en/' → '/en/index.html'
            req.url = urlPath + 'index.html' + suffix
        } else {
            // '/about' → '/about.html'
            req.url = urlPath + '.html' + suffix
        }
    } else {
        req.url = urlPath + suffix
    }

    next()
}

// function charsetMiddleware(req, res, next) {
//     // Проверяем, что запрашивается именно HTML (или путь без расширения, который станет HTML)
//     const isHtml =
//         req.url.endsWith('.html') ||
//         (!req.url.includes('.') &&
//             !req.url.startsWith('/assets') &&
//             !req.url.startsWith('/css') &&
//             !req.url.startsWith('/js'))

//     if (isHtml) {
//         res.setHeader('Content-Type', 'text/html; charset=utf-8')
//     }
//     next()
// }

// ! Обход бага BrowserSync: HTML читается чанками по 64KB, ломая multi-byte UTF-8
// ! + fallback (/privacy/ → /privacy/index.html || /privacy.html)
// ! + защита от path traversal
function serveHtmlDirectly(req, res, next) {
    const accept = req.headers.accept || ''
    const wantsHtml = accept.includes('text/html')

    const urlPath = req.url.split('?')[0]

    // Отсекаем статику
    const isStaticAsset = /^\/(assets|css|js|libs)\//.test(urlPath)
    const isHtmlUrl = !isStaticAsset && (urlPath.endsWith('.html') || !urlPath.includes('.'))

    if (!wantsHtml || !isHtmlUrl) {
        return next()
    }

    const BASE_DIR = nodePath.resolve(build.html)

    // Кандидаты в порядке приоритета
    const candidates = []
    if (urlPath === '/' || urlPath === '') {
        candidates.push(nodePath.join(BASE_DIR, 'index.html'))
    } else if (urlPath.endsWith('.html')) {
        // /privacy.html → /privacy.html
        candidates.push(nodePath.join(BASE_DIR, urlPath))
    } else if (urlPath.endsWith('/')) {
        // /en/ → /en/index.html, затем /en.html
        candidates.push(nodePath.join(BASE_DIR, urlPath, 'index.html'))
        candidates.push(nodePath.join(BASE_DIR, urlPath.slice(0, -1) + '.html'))
    } else {
        // /en → /en.html, затем /en/index.html
        candidates.push(nodePath.join(BASE_DIR, urlPath + '.html'))
        candidates.push(nodePath.join(BASE_DIR, urlPath, 'index.html'))
    }

    // Берём первый существующий файл, который лежит ВНУТРИ build.html
    let filePath = null
    for (const candidate of candidates) {
        const resolved = nodePath.resolve(candidate)
        const relative = nodePath.relative(BASE_DIR, resolved)
        // Защита от выхода за пределы build.html
        if (relative.startsWith('..') || nodePath.isAbsolute(relative)) {
            continue
        }
        if (fs.existsSync(resolved)) {
            filePath = resolved
            break
        }
    }

    if (!filePath) {
        return next() // пусть BrowserSync отдаст 404
    }

    const content = fs.readFileSync(filePath)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Length', content.length)
    res.setHeader('Cache-Control', 'no-cache')
    res.end(content)
}

// const middlewares = [subfolderMiddleware, cleanUrlMiddleware]
const middlewares = [subfolderMiddleware, cleanUrlMiddleware, serveHtmlDirectly] // !!! ONLY FOR DEV

// * --- EXPORT GULP TASK FOR START DEV SERVER
// * -----------------------------------------
export function server(cb) {
    browserSync.init({
        server: {
            baseDir: build.html,
            directory: false,
        },

        https: env.isHttps,
        ghostMode: {
            clicks: false,
            scroll: false,
            forms: false,
        },

        open: 'local',
        browser: 'chrome',
        port: 3000,
        notify: false,
        reloadDelay: 500,

        snippet: true,
        injectChanges: true,
        rewriteRules: false,
        minify: false,

        middleware: middlewares,
    })
    cb()
}

// * --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ВРЕМЕННОГО СЕРВЕРА CRITICAL CSS
// * ----------------------------------------------------------------
export function startCriticalServer(port = 8080) {
    return new Promise((resolve) => {
        // Базовые директории для поиска файлов
        const routes = {}

        // Если это Django-сборка — прокидываем пути к папке static
        if (env.isDjangoBuild) {
            const djangoStaticDir = `${path.djangoBuild.base}/static/${path.djangoAppName}`

            // ! BrowserSync routes: URL-префикс → физическая папка.
            // ! Нужно, чтобы penthouse мог загрузить CSS/шрифты/картинки,
            // ! которые физически лежат НЕ рядом с HTML-шаблонами.
            routes['/css'] = path.djangoBuild.styles.replace(/\/$/, '')

            routes['/libs'] = `${djangoStaticDir}/libs` // * js libs
            routes['/js'] = path.djangoBuild.scripts.replace(/\/$/, '')

            routes['/assets'] = `${djangoStaticDir}/assets`
        }

        criticalBsInstance.init(
            {
                server: {
                    baseDir: build.html,
                    routes: Object.keys(routes).length ? routes : undefined,
                },
                port,
                open: false,
                notify: false,
                ui: false,
                ghostMode: false,
                logLevel: 'silent',
                https: env.isHttps,
                middleware: middlewares,
            },
            resolve,
        )
    })
}

export function stopCriticalServer() {
    criticalBsInstance.exit()
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('server', server)
