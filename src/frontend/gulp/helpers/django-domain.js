import { env } from '../config/env.js'

// * 'https://polimerbeton-vrn.ru' → 'polimerbeton-vrn.ru'
function extractDomain(siteUrl) {
    if (!siteUrl) {
        return null
    }
    return siteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
}

// * Regex из домена (точки экранированы) | null если не Django
export function getDomainRegex() {
    if (!env.isDjangoBuild) {
        return null
    }

    const domain = extractDomain(env.siteUrl)
    if (!domain) {
        return null
    }

    const escaped = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(escaped, 'g')
}

// * Что подставляем на место домена
export const DJANGO_DOMAIN = '{{ site_config.domain }}'
