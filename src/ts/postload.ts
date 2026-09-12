// ! --- БАЗОВЫЕ ИМПОРТЫ
// ! -------------------
// * --- vendors scripts
// import 'bootstrap'
import 'bootstrap/js/dist/offcanvas'
// * -------------------

// * --- my scripts
import { initCookieConsentBannerManager } from 'modules/postload/manager__cookies_consent_banner'

import { initMenuButtonStateManager } from 'modules/postload/manager__menu_button_state'
import { initOffcanvasScrollStateManager } from 'modules/postload/manager__offcanvas_scroll_state'
import { initHeroBackgroundImageParallaxManager } from 'modules/postload/manager__hero__background_image_parallax'
import { initFooterPositionStateManager } from 'modules/postload/manager__footer_position_state'
// * --------------

// ! --- БАЗОВЫЙ UI СТРАНИЦЫ | СТАРТУЕТ МГНОВЕННО ПОСЛЕ ЗАГРУЗКИ
// ! -----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // ! --- вызываются первыми !!!
    // ! --------------------------
    initCookieConsentBannerManager()
    initHeroBackgroundImageParallaxManager()
    // ! --------------------------

    initMenuButtonStateManager()
    initOffcanvasScrollStateManager()
    initFooterPositionStateManager()
})

// ! --- ТЯЖЕЛЫЙ UI СТРАНИЦЫ | КАЧАЮТСЯ И ВЫПОЛНЯЮТСЯ В САМОМ КОНЦЕ
// ! --------------------------------------------------------------
window.addEventListener('load', () => {
    const isMobile = window.matchMedia('(max-width: 767.98px)').matches
    // const isDesktop = !isMobile
    const isSlowDevice = (navigator.hardwareConcurrency ?? 4) < 4

    // * на мобилке/слабом девайсе ждём дольше, чтобы LCP успел
    const smallDelay = 1000
    const heavyDelay = isMobile || isSlowDevice ? 2500 : smallDelay

    // * inputmask — грузим быстро, чтобы UX формы не страдал
    setTimeout(async () => {
        if (document.querySelector('my-custom-feedback-form')) {
            const { initFeedbackFormInputMask } =
                await import('modules/postload/init__feedback_form__inputmask')
            initFeedbackFormInputMask()
        }
    }, smallDelay)

    // * 3D и tilt — можно и подождать
    setTimeout(async () => {
        // * только на устройствах с мышкой
        if (window.matchMedia('(pointer: fine)').matches) {
            const { initVanillaTilt } = await import('modules/postload/init__vanilla_tilt')
            initVanillaTilt()
        }

        // * только если это ПК и девайс НЕ ГАВНО
        // const canRun3D = isDesktop && (navigator.hardwareConcurrency ?? 4) >= 4
        const canRun3D = (navigator.hardwareConcurrency ?? 4) >= 4

        if (canRun3D) {
            const { init3DBalls } = await import('modules/ball-viewer')
            init3DBalls()
        }
    }, heavyDelay)
})
