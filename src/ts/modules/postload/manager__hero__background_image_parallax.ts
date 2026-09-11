export function initHeroBackgroundImageParallaxManager() {
    // ! если юзер отключил анимации -> запретить инициализацию
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    // ! ПРОВЕРКА ПОДДЕРЖКИ CSS SCROLL-DRIVEN ANIMATIONS
    // Если браузер поддерживает нативный скролл (Chrome 115+),
    // вырубаем JS логику, всё сделает CSS (см. изменения в SCSS ниже)
    const supportsScrollDrivenAnimations = CSS.supports('animation-timeline', 'view()')
    if (supportsScrollDrivenAnimations) {
        return
    }

    // --- Дальше идет твой оригинальный рилтайм код как фоллбэк для Safari/старых браузеров ---
    const hero = document.querySelector('.my-hero') as HTMLElement | null
    const heroBgWrapper = document.querySelector('.my-hero__bg-wrapper') as HTMLElement | null
    if (!hero || !heroBgWrapper) {
        return
    }

    let ticking = false
    let isInView = false

    let heroTop = 0
    let heroHeight = 0
    let windowHeight = 0

    const updateMetrics = () => {
        const rect = hero.getBoundingClientRect()
        windowHeight = window.innerHeight
        heroHeight = rect.height
        heroTop = rect.top + window.scrollY
    }

    const updateParallax = () => {
        if (!isInView) {
            ticking = false
            return
        }

        const scrollY = window.scrollY
        const progress = (scrollY + windowHeight - heroTop) / (windowHeight + heroHeight)
        const clampedProgress = Math.min(Math.max(progress, 0), 1)

        const currentPercent = (-35 + clampedProgress * 70).toString()

        heroBgWrapper.style.transform = `translate3d(0, ${currentPercent}%, 0)`
        ticking = false
    }

    const observer = new IntersectionObserver(([entry]) => {
        isInView = entry.isIntersecting

        if (isInView) {
            updateMetrics()
            updateParallax()
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
    }
}
