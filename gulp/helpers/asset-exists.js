// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------

import fs from 'fs'
import path from 'path'

/**
 * Извлекает время модификации исходника (ms).
 * Поддерживает: Vinyl file, Vinyl file.stat, путь к файлу, путь к папке и глоб-пути.
 */
function getSrcMtime(src) {
    if (!src) {
        return null
    }

    // Если передан путь (строка)
    if (typeof src === 'string') {
        try {
            const normalized = src.replace(/\\/g, '/')
            const cleanPath = normalized.replace(/[*?{[()].*$/, '').replace(/\/+$/, '') || '.'

            const stat = fs.statSync(cleanPath)

            if (stat.isDirectory()) {
                const files = fs.readdirSync(cleanPath, { recursive: true })
                let maxMtime = stat.mtimeMs

                for (const file of files) {
                    try {
                        const filePath = path.join(cleanPath, file)
                        const fileStat = fs.statSync(filePath)
                        if (fileStat.isFile() && fileStat.mtimeMs > maxMtime) {
                            maxMtime = fileStat.mtimeMs
                        }
                    } catch {
                        // Игнорируем ошибки доступа
                    }
                }
                return maxMtime
            }

            return stat.mtimeMs
        } catch {
            return null
        }
    }

    // Поддержка Vinyl file и fs.Stats
    const statObj = src.stat || src
    if (statObj.mtimeMs) {
        return statObj.mtimeMs
    }
    if (statObj.mtime instanceof Date) {
        return statObj.mtime.getTime()
    }

    return null
}

/**
 * Проверяет, является ли суффикс после дефиса хешем ревизии (например, -a1b2c3d4)
 */
function isRevisionHash(suffix) {
    // Хеши ревизий обычно состоят из 6-16 буквенно-цифровых символов без дополнительных дефисов
    return /^[a-f0-9]{6,16}$/i.test(suffix)
}

/**
 * Проверяет наличие и актуальность файла в `dir` с именем `baseName` и расширением `ext`.
 * Учитывает хеши ревизий (baseName-*.ext), регистр и дату модификации `src`.
 */
export function assetExists(dir, baseName, ext, src = null) {
    try {
        const files = fs.readdirSync(dir)
        const lowerBase = baseName.toLowerCase()
        const targetExt = (ext.startsWith('.') ? ext : `.${ext}`).toLowerCase()

        const matchingFiles = files.filter((file) => {
            const lowerFile = file.toLowerCase()
            if (!lowerFile.endsWith(targetExt)) {
                return false
            }

            const nameWithoutExt = lowerFile.slice(0, -targetExt.length)
            if (nameWithoutExt === lowerBase) {
                return true
            }

            // Проверяем, что после дефиса идёт именно хеш ревизии, а не подстиль (например, -bold)
            if (nameWithoutExt.startsWith(lowerBase + '-')) {
                const suffix = nameWithoutExt.slice(lowerBase.length + 1)
                return isRevisionHash(suffix)
            }

            return false
        })

        if (matchingFiles.length === 0) {
            return false
        }

        const srcMtime = getSrcMtime(src)
        if (!srcMtime) {
            return true
        }

        return matchingFiles.some((file) => {
            const outPath = path.join(dir, file)
            return fs.statSync(outPath).mtimeMs >= srcMtime
        })
    } catch {
        return false
    }
}

/**
 * Проверяет наличие и актуальность семейства файлов (картинки с суффиксами/разрешениями, `.webp`, `.avif`).
 * Учитывает дату модификации `src`.
 */
export function assetFamilyExists(dir, baseName, src = null) {
    try {
        const files = fs.readdirSync(dir)
        const lowerBase = baseName.toLowerCase()

        const matchingFiles = files.filter((fileName) => {
            const lastDot = fileName.lastIndexOf('.')
            const nameWithoutExt =
                lastDot > 0 ? fileName.substring(0, lastDot).toLowerCase() : fileName.toLowerCase()

            if (nameWithoutExt === lowerBase) {
                return true
            }

            if (nameWithoutExt.startsWith(lowerBase + '-')) {
                const suffix = nameWithoutExt.slice(lowerBase.length + 1)
                // Разрешаем суффиксы ширины (320w, 2x) или хеши ревизий
                return /^\d+[wx]$/i.test(suffix) || isRevisionHash(suffix)
            }

            return false
        })

        if (matchingFiles.length === 0) {
            return false
        }

        const srcMtime = getSrcMtime(src)
        if (!srcMtime) {
            return true
        }

        return matchingFiles.some((file) => {
            const outPath = path.join(dir, file)
            return fs.statSync(outPath).mtimeMs >= srcMtime
        })
    } catch {
        return false
    }
}
