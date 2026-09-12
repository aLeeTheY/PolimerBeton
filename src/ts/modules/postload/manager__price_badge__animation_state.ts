export function initPriceBadgeAnimationStateManager() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const badges = document.querySelectorAll('.my-price-badge')
    if (!badges.length) {
        return
    }

    const observers: IntersectionObserver[] = []

    badges.forEach((badge) => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                badge.classList.toggle('my-price-badge--is-paused', !entry.isIntersecting)
            },

            // * запуск анимации только если до компонента в пределах +/- 500px от границ viewport'а | работает в обе стороны
            // * широкий rootMargin: badge высокий, нужно разморозить заранее
            { rootMargin: '500px 0px' },
        )
        observer.observe(badge)
        observers.push(observer)
    })

    return () => {
        observers.forEach((obs) => obs.disconnect())
    }
}
