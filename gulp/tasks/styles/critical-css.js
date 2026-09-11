import fs from 'fs'
import gulp from 'gulp'
import nodePath from 'path'
import fastGlob from 'fast-glob'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import { notify, NOTIFICATION_HANDLER_TITLES } from '../../helpers/error-handler.js'
import { startCriticalServer, stopCriticalServer } from '../core/dev/server.js'

import penthouse from 'penthouse'
// import puppeteer from 'puppeteer'

// * --- EXPORT GULP TASK FOR INLINE CRITICAL CSS TO HTML FILES
// * ----------------------------------------------------------
export async function criticalCss() {
    // * Пропускаем таску при локальной сборке или если включен полный инлайн CSS
    if (env.isInlineCSS) {
        notify.info(
            NOTIFICATION_HANDLER_TITLES.CRITICAL_CSS,
            'Skipped – full inline CSS is enabled.',
        )
        return
    }
    if (env.isLocal) {
        notify.info(NOTIFICATION_HANDLER_TITLES.CRITICAL_CSS, 'Skipped – local (file:///) build.')
        return
    }

    // ! ОБЯЗАТЕЛЬНО: задаем путь к Chrome в process.env ДО вызова penthouse
    // ! use system Google Chrome browser
    process.env.PUPPETEER_EXECUTABLE_PATH =
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

    // ! поиск html и css файлов
    const dir = nodePath.resolve(path.build.html)

    const htmlFiles = fastGlob.sync('**/*.html', {
        cwd: dir,
        absolute: true,
    })
    if (!htmlFiles.length) {
        notify.warn(
            NOTIFICATION_HANDLER_TITLES.CRITICAL_CSS,
            'No HTML files found in build directory!',
        )
        return
    }

    const cssFiles = fastGlob.sync('**/*.css', {
        cwd: path.build.styles,
        absolute: true,
    })
    if (!cssFiles.length) {
        notify.warn(
            NOTIFICATION_HANDLER_TITLES.CRITICAL_CSS,
            'No CSS files found in build directory!',
        )
        return
    }

    // ! Если css файлов несколько, читаем их и объедияем в одну строку для Penthouse
    const combinedCss = cssFiles.map((file) => fs.readFileSync(file, 'utf-8')).join('\n')

    // ! не нужно, penthouse захватывает media queries при генерации благодаря postcss-sort-media-queries
    // const viewports = [
    //     { width: 375, height: 667 }, // Mobile
    //     { width: 1920, height: 1080 }, // Desktop
    // ]

    const viewport = {
        width: 1920,
        height: 1080,
    }

    // Очищаем и пересоздаем директорию для скриншотов отладки
    const debugDir = nodePath.resolve('./debug__critical_css__screenshots')
    if (fs.existsSync(debugDir)) {
        fs.rmSync(debugDir, { recursive: true, force: true })
    }
    fs.mkdirSync(debugDir, { recursive: true })

    const TEMP_PORT = 7777
    const protocol = env.isHttps ? 'https' : 'http'

    // * Запускаем временный сервер перед генерацией
    await startCriticalServer(TEMP_PORT)

    try {
        for (const filePath of htmlFiles) {
            let html = fs.readFileSync(filePath, 'utf-8')

            if (
                !html.includes(
                    '<!-- ! DO NOT REMOVE THIS COMMENT !!! | CRITICAL CSS PLACEHOLDER -->',
                )
            ) {
                continue
            }

            // Формируем относительный путь от path.build.html к файлу
            const relativePath = nodePath.relative(dir, filePath).replace(/\\/g, '/')
            const httpUrl = `${protocol}://localhost:${TEMP_PORT}/${relativePath}`

            // Формирование имени скриншота
            const pageSlug = relativePath.replace(/\.html$/, '').replace(/[\\/]/g, '_')
            const screenshotBasePath = `${debugDir.replace(/\\/g, '/')}/${pageSlug}`

            try {
                const criticalCss = await penthouse({
                    // * html файл открытый но отдельном dev-сервере для Critical CSS
                    url: httpUrl,

                    // * css строка, из которой вырезаем critical-css
                    cssString: combinedCss,

                    // * размеры viewport
                    width: viewport.width,
                    height: viewport.height,

                    // ! принудительно оставляем все медиа-запросы, даже если они не подходят
                    keepLargerMediaQueries: true,

                    // * после загрузки страницы ждём 300ms пока всё прогрузится
                    // * и только после этого извлекаем Critical CSS
                    renderWaitTime: 300,

                    // ! INCLUDE SOME CSS CLASSES TO PENTHOUSE MANUALLY !!!
                    forceInclude: [
                        /@font-face/,
                        /data-theme/,
                        /^\.js/,
                        /^\.nojs/,
                        /^\.page-/,
                        /^\.avif/,
                        /^\.webp/,
                    ],

                    // * сохраняем скриншоты того, что увидел puppeteer
                    screenshots: {
                        basePath: screenshotBasePath,
                        type: 'jpeg',
                        quality: 80,
                    },

                    // * запрещаем исполнять JS
                    blockJSRequests: true,

                    // * puppeteer settings
                    puppeteer: {
                        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
                        headless: true,
                        args: [
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--allow-file-access-from-files',
                            '--disable-web-security',
                            '--ignore-certificate-errors',
                        ],
                    },
                })

                html = html.replace(
                    '<!-- ! DO NOT REMOVE THIS COMMENT !!! | CRITICAL CSS PLACEHOLDER -->',
                    `<style type="text/css" id="critical-css">${criticalCss}</style>`,
                )

                fs.writeFileSync(filePath, html)
            } catch (err) {
                notify.warn(
                    NOTIFICATION_HANDLER_TITLES.CRITICAL_CSS,
                    `${nodePath.basename(filePath)}: ${err.message}`,
                )
            }
        }
    } finally {
        // Гасим временный сервер в любом случае (даже при ошибке)
        stopCriticalServer()
    }

    // * update dev server
    browserSync.reload()
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('critical-css', criticalCss)
