/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

export async function initHoudiniSquircle() {
    try {
        const ua = navigator.userAgent.toLowerCase()
        const isFirefox = ua.includes('firefox')
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

        if (isFirefox || isSafari) {
            return
        }

        if ('paintWorklet' in CSS) {
            const workletUrl = new URL('../libs/squircle.min.js', import.meta.url).href

            await (CSS as any).paintWorklet.addModule(workletUrl)
            document.documentElement.classList.add('houdini-squircle-ready')
        }
    } catch (error) {
        console.error('Houdini Squircle loading error:', error)
    }
}
