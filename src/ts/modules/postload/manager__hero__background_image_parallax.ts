export function initHeroBackgroundImageParallaxManager() {
    // ! если юзер отключил анимации -> запретить инициализацию
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    // ! ПРОВЕРКА ПОДДЕРЖКИ CSS SCROLL-DRIVEN ANIMATIONS
    // Если браузер поддерживает нативный скролл (Chrome 115+),
    // вырубаем JS логику, всё сделает CSS
    const supportsScrollDrivenAnimations = CSS.supports('animation-timeline', 'view()')
    if (supportsScrollDrivenAnimations) {
        return
    }

    // --- JS-фоллбэк для Safari / старых браузеров ---
    const hero = document.querySelector('.my-hero') as HTMLElement | null
    const heroBgWrapper = document.querySelector('.my-hero__bg-wrapper') as HTMLElement | null
    if (!hero || !heroBgWrapper) {
        return
    }

    // ? диапазон движения в процентах от высоты wrapper-а
    // ? (должен совпадать с keyframes в SCSS)
    const PARALLAX_FROM_PERCENT = -35
    const PARALLAX_TO_PERCENT = 35

    let ticking = false
    let isInView = false

    let heroTop = 0
    let heroHeight = 0
    let windowHeight = 0
    let wrapperHeightPx = 0

    const updateMetrics = () => {
        const rect = hero.getBoundingClientRect()
        windowHeight = window.innerHeight
        heroHeight = rect.height
        heroTop = rect.top + window.scrollY
        // ? высота в px — чтобы transform считался без % и слой кэшировался GPU
        wrapperHeightPx = heroBgWrapper.offsetHeight
    }

    const updateParallax = () => {
        if (!isInView) {
            ticking = false
            return
        }

        const scrollY = window.scrollY
        const progress = (scrollY + windowHeight - heroTop) / (windowHeight + heroHeight)
        const clampedProgress = Math.min(Math.max(progress, 0), 1)

        const percent =
            PARALLAX_FROM_PERCENT + clampedProgress * (PARALLAX_TO_PERCENT - PARALLAX_FROM_PERCENT)
        const offsetPx = (percent / 100) * wrapperHeightPx

        heroBgWrapper.style.transform = `translate3d(0, ${offsetPx}px, 0)`
        ticking = false
    }

    const observer = new IntersectionObserver(([entry]) => {
        isInView = entry.isIntersecting

        if (isInView) {
            updateMetrics()
            // ? откладываем в rAF, чтобы не мешать observer callback-у
            window.requestAnimationFrame(updateParallax)
        }
    })
    observer.observe(hero)

    let resizeTimer: number
    const handleResize = () => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(() => {
            if (isInView) {
                updateMetrics()
                updateParallax()
            }
        }, 150)
    }

    const handleOrientationChange = () => {
        if (isInView) {
            updateMetrics()
            updateParallax()
        }
    }

    const handleScroll = () => {
        if (!ticking && isInView) {
            window.requestAnimationFrame(updateParallax)
            ticking = true
        }
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    updateMetrics()

    return () => {
        observer.disconnect()
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('orientationchange', handleOrientationChange)
        window.removeEventListener('resize', handleResize)
        window.clearTimeout(resizeTimer)

        heroBgWrapper.style.willChange = 'auto'
    }
}
