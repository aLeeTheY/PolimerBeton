/* eslint-disable no-console */
import fs from 'fs'
import gulp from 'gulp'
import nodePath from 'path'
import fastGlob from 'fast-glob'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
// import { path } from '../../config/path.js'
import { build } from '../../config/build.js'
import { notify, NOTIFICATION_HANDLER_TITLES } from '../../helpers/error-handler.js'
import { startCriticalServer, stopCriticalServer } from '../core/dev/server.js'

import penthouse from 'penthouse'
// import puppeteer from 'puppeteer'

// ! Превращает алиасы в рабочие URL для penthouse.
// ! После резолва penthouse увидит /css/main.min.css и запросит
// ! его через server.js routes → получит настоящий CSS.
// ! НЕ трогает оригинал — оригинал сохраняется и в него инжектится <style>.
function resolveAliasesForCritical(html) {
    return html
        .replace(
            /@(scss|css)\/([^"'\s)]+)/g,
            (m, t, p) => `/css/${p.replace(/\.scss$/, '.min.css')}`,
        )
        .replace(/@(ts|js)\/([^"'\s)]+)/g, (m, t, p) => `/js/${p.replace(/\.ts$/, '.min.js')}`)
        .replace(
            /@(fonts|images|videos|audio|misc)\/([^"'\s)]+)/g,
            (m, t, p) => `/assets/${t}/${p}`,
        )
        .replace(/@libs\/([^"'\s)]+)/g, (m, p) => `/libs/${p}`)
        .replace(
            /@icons\/(.+?)\.svg/g,
            (m, p) => `/assets/icons/sprite.svg#${p.replace(/\//g, '--')}`,
        )
        .replace(/@meta\/favicon\/([^"'\s)]+)/g, (m, p) => `/${p}`)
        .replace(/@meta\/([^"'\s)]+)/g, (m, p) => `/${p}`)
}

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
    const dir = nodePath.resolve(build.html)

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
        cwd: build.styles,
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

    if (env.isVerbose) {
        console.log('════════════ CRITICAL-CSS DEBUG ════════════')
        console.log('build.html       :', build.html)
        console.log('build.styles     :', build.styles)
        console.log('htmlFiles length :', htmlFiles.length)
        console.log('htmlFiles        :', htmlFiles)
        console.log('cssFiles length  :', cssFiles.length)
        console.log('cssFiles         :', cssFiles)
        console.log('combinedCss.size :', combinedCss.length, 'chars')

        if (combinedCss.length < 1000) {
            console.log('combinedCss (full, because too short):')
            console.log(combinedCss)
        } else {
            console.log('combinedCss (first 500 chars):')
            console.log(combinedCss.slice(0, 500))
        }
        console.log('════════════════════════════════════════════')
    }

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
            // ! ОРИГИНАЛ с алиасами (в него потом инжектим <style>)
            const originalHtml = fs.readFileSync(filePath, 'utf-8')

            if (
                !originalHtml.includes(
                    '<!-- ! DO NOT REMOVE THIS COMMENT !!! | CRITICAL CSS PLACEHOLDER -->',
                )
            ) {
                continue
            }

            // ! Пишем ВРЕМЕННУЮ resolved-версию → её увидит penthouse
            fs.writeFileSync(filePath, resolveAliasesForCritical(originalHtml))

            const relativePath = nodePath.relative(dir, filePath).replace(/\\/g, '/')
            const httpUrl = `${protocol}://localhost:${TEMP_PORT}/${relativePath}`
            const pageSlug = relativePath.replace(/\.html$/, '').replace(/[\\/]/g, '_')
            const screenshotBasePath = `${debugDir.replace(/\\/g, '/')}/${pageSlug}`

            try {
                const criticalCss = await penthouse({
                    url: httpUrl,
                    cssString: combinedCss,
                    width: viewport.width,
                    height: viewport.height,
                    keepLargerMediaQueries: true,
                    renderWaitTime: 300,
                    forceInclude: [
                        /@font-face/,
                        /data-theme/,
                        /^\.js/,
                        /^\.nojs/,
                        /^\.page-/,
                        /^\.avif/,
                        /^\.webp/,

                        // ! Скрытые элементы: penthouse их выкидывает (не видны в рендере),
                        // ! но без правил они станут ВИДИМЫМИ после инжекта critical CSS
                        /my-header__hidden-part/,
                        /offcanvas/,
                        /my-cookie-consent-banner/,
                    ],
                    screenshots: { basePath: screenshotBasePath, type: 'jpeg', quality: 80 },
                    blockJSRequests: true,
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

                // ! Инжектим critical CSS в ОРИГИНАЛ (с алиасами).
                // ! Так djangoizeHtml сможет потом превратить @scss → {% static %}
                const finalHtml = originalHtml.replace(
                    '<!-- ! DO NOT REMOVE THIS COMMENT !!! | CRITICAL CSS PLACEHOLDER -->',
                    `<style type="text/css" id="critical-css">${criticalCss}</style>`,
                )
                fs.writeFileSync(filePath, finalHtml)
            } catch (err) {
                // ! Восстанавливаем оригинал, чтобы не оставить resolved-версию без CSS
                fs.writeFileSync(filePath, originalHtml)

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
