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

const middlewares = [subfolderMiddleware, cleanUrlMiddleware]

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
        notify: false,
        port: 3000,
        reloadDelay: 500,
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
