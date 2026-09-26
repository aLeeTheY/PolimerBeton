export function initServerResponseTitleAnimationStateManager() {
    const titles = document.querySelectorAll('.my-title--server-response')
    if (!titles.length) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const observers: IntersectionObserver[] = []

    titles.forEach((title) => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                title.classList.toggle('my-title--is-paused', !entry.isIntersecting)
            },

            // * запуск анимации только если до компонента в пределах +/- 200px от границ viewport'а | работает в обе стороны
            { rootMargin: '200px 0px' },
        )
        observer.observe(title)
        observers.push(observer)
    })

    return () => {
        observers.forEach((obs) => obs.disconnect())
    }
}
