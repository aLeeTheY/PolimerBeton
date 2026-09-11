import gulp from 'gulp'
import browserSync from 'browser-sync'

import { env } from '../../../config/env.js'
import { path } from '../../../config/path.js'

// Создаем изолированный инстанс специально для Critical CSS
const criticalBsInstance = browserSync.create('critical-css-server')

// Общий middleware для убирания .html из URL
function cleanUrlMiddleware(req, res, next) {
    const [urlPath, queryString] = req.url.split('?')

    if (urlPath !== '/' && !urlPath.includes('.')) {
        let cleanPath = urlPath

        if (cleanPath.endsWith('/')) {
            cleanPath = cleanPath.slice(0, -1)
        }

        req.url = cleanPath + '.html' + (queryString ? '?' + queryString : '')
    }

    next()
}

// * --- EXPORT GULP TASK FOR START DEV SERVER
// * -----------------------------------------
export function server(cb) {
    browserSync.init({
        // * serve files from the app directory with directory listing
        server: {
            baseDir: path.build.html,
            directory: false,
        },
        // * control `http` or `https` mode
        https: env.isHttps,
        // ? ghost mode | enabled by default
        ghostMode: {
            clicks: false,
            scroll: false,
            forms: false,
        },
        // ? online mode
        // online: false,
        // * open localhost url
        open: 'local',
        // * open page in google chrome by default
        browser: 'chrome',
        // * hide notification in browser
        notify: false,
        // * server port
        port: 3000,
        // * задержка при вызове reload в 500 мс
        reloadDelay: 500,
        // * красивые пути в строке браузера
        middleware: [cleanUrlMiddleware],
    })
    cb()
}

// * --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ВРЕМЕННОГО СЕРВЕРА CRITICAL CSS
// * ----------------------------------------------------------------
export function startCriticalServer(port = 8080) {
    return new Promise((resolve) => {
        criticalBsInstance.init(
            {
                server: {
                    baseDir: path.build.html,
                },
                port,
                open: false,
                notify: false,
                ui: false,
                ghostMode: false,
                logLevel: 'silent',
                https: env.isHttps,
                middleware: [cleanUrlMiddleware],
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
