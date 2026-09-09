// ! --- БАЗОВЫЕ ИМПОРТЫ
// ! -------------------
// * --- vendors scripts
import 'bootstrap'
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
    setTimeout(async () => {
        const { initFeedbackFormInputMask } =
            await import('modules/postload/init__feedback_form__inputmask')

        const { initVanillaTilt } = await import('modules/postload/init__vanilla_tilt')
        const { init3DBalls } = await import('modules/ball-viewer')

        initFeedbackFormInputMask()

        initVanillaTilt()
        init3DBalls()
    }, 1000)
})
