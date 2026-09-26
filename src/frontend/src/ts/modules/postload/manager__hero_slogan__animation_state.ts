export function initHeroSloganAnimationStateManager() {
    const slogan = document.querySelector('.my-paragraph--hero-slogan')
    if (!slogan) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const observer = new IntersectionObserver(
        ([entry]) => {
            slogan.classList.toggle('my-paragraph--is-paused', !entry.isIntersecting)
        },

        // * запуск анимации только если до компонента в пределах +/- 200px от границ viewport'а | работает в обе стороны
        { rootMargin: '200px 0px' },
    )
    observer.observe(slogan)

    return () => {
        observer.disconnect()
    }
}
