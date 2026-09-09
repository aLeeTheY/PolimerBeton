// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------
/* eslint-disable no-console */

import path from 'path'
import fs from 'fs/promises'
import through2 from 'through2'
import render from 'dom-serializer'
import { DomHandler, Element } from 'domhandler'
import { Parser } from 'htmlparser2'
import * as DomUtils from 'domutils'
import sharp from 'sharp'

const FORMATS = ['image/avif', 'image/webp', 'image/jpeg', 'image/png']
const metadataCache = new Map()

export function htmlImg2PictureTransformer(assetsSrcDir, options = {}) {
    const config = {
        desktopFirst: true,
        setDimensions: true,
        setLazyLoading: true,
        setAsyncDecoding: true,

        // PRODUCTION-READY CONFIG
        breakpoints: [
            {
                media: 768, // Для экранов до 768px
                suffix: '-mobile',
                baseWidth: 400, // Ширина версии 1x будет ~400px
                densities: [1, 2], // Сгенерирует: 1x (400px), 2x (800px)
            },
            // Десктоп (натив) оставляем без медиа-запроса,
            // он пойдет в основной srcset без суффикса
        ],
        ...options,
    }

    return through2.obj(function (file, enc, callback) {
        if (file.isNull()) {
            return callback(null, file)
        }
        if (file.isStream()) {
            return callback(new Error('Streaming not supported'))
        }

        const asyncWork = async () => {
            const htmlContent = file.contents.toString()
            const handler = new DomHandler()
            const parser = new Parser(handler)
            parser.write(htmlContent)
            parser.end()
            const dom = handler.dom

            const images = DomUtils.getElementsByTagName('img', dom)

            for (const img of images) {
                const src = img.attribs.src

                if (
                    !src ||
                    src.match(/\.(svg|gif)$/i) ||
                    src.startsWith('http') ||
                    src.startsWith('data:')
                ) {
                    continue
                }
                if (!src.includes('@images/')) {
                    continue
                }

                const match = src.match(/(.*)\.(jpg|jpeg|png)$/i)
                if (!match) {
                    continue
                }

                const [, basePath, originalExt] = match
                const isPng = originalExt.toLowerCase() === 'png'

                const relativeImgPath = src.replace(/.*@images\//, '')
                const absoluteImgPath = path.join(assetsSrcDir, relativeImgPath)

                let originalWidth
                let metadata

                try {
                    if (metadataCache.has(absoluteImgPath)) {
                        // ? Берем из памяти (мгновенно)
                        metadata = metadataCache.get(absoluteImgPath)
                    } else {
                        // ? Читаем с диска один раз и сохраняем
                        await fs.access(absoluteImgPath)
                        metadata = await sharp(absoluteImgPath).metadata()
                        metadataCache.set(absoluteImgPath, metadata)
                    }

                    originalWidth = metadata.width
                } catch (err) {
                    console.warn(
                        `[html-transformer] Ошибка чтения: ${absoluteImgPath}\t${err.message}`,
                    )
                    continue
                }

                const allowedMimeTypes = FORMATS.filter((mime) => {
                    if (mime === 'image/jpeg' && isPng) {
                        return false
                    }
                    if (mime === 'image/png' && !isPng) {
                        return false
                    }
                    return true
                })

                const picture = new Element('picture', {})
                if (img.attribs['data-my-picture-class']) {
                    picture.attribs.class = img.attribs['data-my-picture-class']
                }

                // ГЕНЕРИРУЕМ <source> ТЕГИ
                allowedMimeTypes.forEach((mimeType) => {
                    const getExtension = (mime, origExt) => {
                        if (mime === 'image/jpeg') {
                            return origExt.toLowerCase() === 'jpeg' ? 'jpeg' : 'jpg'
                        }
                        return mime.split('/')[1] // для webp, avif, png работает корректно
                    }
                    const ext = getExtension(mimeType, originalExt)

                    // 1. Адаптивные брейкпоинты (Mobile, Tablet и т.д.)
                    config.breakpoints.forEach((bp) => {
                        // Рассчитываем, какие плотности (1x, 2x) мы реально можем создать
                        // исходя из размера оригинальной картинки
                        const validDensities = bp.densities.filter(
                            (d) => originalWidth >= bp.baseWidth * d || d === 1,
                        )

                        if (validDensities.length === 0) {
                            return
                        } // Картинка слишком мала даже для 1x

                        // Собираем строку srcset: "file-mobile.jpg 1x, file-mobile@2x.jpg 2x"
                        const srcsetString = validDensities
                            .map((d) => {
                                const densitySuffix = d === 1 ? '' : `@${d}x`
                                return `${basePath}${bp.suffix}${densitySuffix}.${ext} ${d}x`
                            })
                            .join(', ')

                        const mediaCondition = config.desktopFirst
                            ? `(max-width: ${bp.media}px)`
                            : `(min-width: ${bp.media}px)`

                        const source = new Element('source', {
                            type: mimeType,
                            media: mediaCondition,
                            srcset: srcsetString,
                        })
                        DomUtils.appendChild(picture, source)
                    })

                    // 2. Десктоп / Натив (без media-запроса)
                    // Мы не генерируем .jpg внутри webp, поэтому фильтруем
                    if (ext !== originalExt.toLowerCase()) {
                        const nativeSource = new Element('source', {
                            type: mimeType,
                            srcset: `${basePath}.${ext}`,
                        })
                        DomUtils.appendChild(picture, nativeSource)
                    }
                })

                // НАСТРАЙВАЕМ FALLBACK <img>
                const imgClone = img.cloneNode(true)
                if (imgClone.attribs['data-my-picture-class']) {
                    delete imgClone.attribs['data-my-picture-class']
                }

                // Для десктоп-first фоллбэком всегда является оригинальная картинка
                imgClone.attribs.src = src

                if (config.setLazyLoading) {
                    if (imgClone.attribs.fetchpriority === 'high') {
                        delete imgClone.attribs.loading
                    } else if (!imgClone.attribs.loading) {
                        imgClone.attribs.loading = 'lazy'
                    }
                }

                if (config.setAsyncDecoding && !imgClone.attribs.decoding) {
                    if (!imgClone.attribs.decoding) {
                        imgClone.attribs.decoding = 'async'
                    }
                }

                if (config.setDimensions && originalWidth && metadata?.height) {
                    if (!imgClone.attribs.width) {
                        imgClone.attribs.width = String(originalWidth)
                    }
                    if (!imgClone.attribs.height) {
                        imgClone.attribs.height = String(metadata.height)
                    }
                }

                DomUtils.appendChild(picture, imgClone)
                DomUtils.replaceElement(img, picture)
            }

            file.contents = Buffer.from(render(dom, { decodeEntities: false }))
        }

        asyncWork()
            .then(() => callback(null, file))
            .catch((err) => callback(err))
    })
}
