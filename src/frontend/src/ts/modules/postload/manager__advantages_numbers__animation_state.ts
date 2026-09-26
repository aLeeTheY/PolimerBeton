export function initAdvantagesNumbersAnimationStateManager() {
    const subtitles = document.querySelectorAll('.my-subtitle--advantage')
    if (!subtitles.length) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const observers: IntersectionObserver[] = []

    subtitles.forEach((subtitle) => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                subtitle.classList.toggle('my-subtitle--is-paused', !entry.isIntersecting)
            },

            // * запуск анимации только если до компонента в пределах +/- 200px от границ viewport'а | работает в обе стороны
            { rootMargin: '200px 0px' },
        )
        observer.observe(subtitle)
        observers.push(observer)
    })

    return () => {
        observers.forEach((obs) => obs.disconnect())
    }
}
