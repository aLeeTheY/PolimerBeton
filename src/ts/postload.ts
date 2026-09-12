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
const runWhenIdle = (task: () => void, fallbackDelay = 1500) => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(task, { timeout: 3000 })
    } else {
        setTimeout(task, fallbackDelay)
    }
}

window.addEventListener('load', () => {
    const isMobile = window.matchMedia('(max-width: 767.98px)').matches
    const heavyDelay = isMobile ? 2500 : 1000 // * на мобилке/слабом девайсе ждём дольше, чтобы LCP успел

    // * inputmask — грузим быстро, когда браузер свободен, чтобы UX формы не страдал
    runWhenIdle(async () => {
        if (document.querySelector('my-custom-feedback-form')) {
            const { initFeedbackFormInputMask } =
                await import('modules/postload/init__feedback_form__inputmask')
            initFeedbackFormInputMask()
        }
    })

    // * 3D и tilt — с фиксированной задержкой, чтобы дать LCP фору
    setTimeout(async () => {
        // * только на устройствах с мышкой
        if (window.matchMedia('(pointer: fine)').matches) {
            const { initVanillaTilt } = await import('modules/postload/init__vanilla_tilt')
            initVanillaTilt()
        }

        const { init3DBalls } = await import('modules/ball-viewer')
        init3DBalls()
    }, heavyDelay)
})
