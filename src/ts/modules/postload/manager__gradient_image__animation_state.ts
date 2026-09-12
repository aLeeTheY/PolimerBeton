export function initGradientImageAnimationStateManager() {
    const images = document.querySelectorAll('.my-gradient-image')
    if (!images.length) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const observers: IntersectionObserver[] = []

    images.forEach((image) => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                image.classList.toggle('my-gradient-image--is-paused', !entry.isIntersecting)
            },

            // * запуск анимации только если до компонента в пределах +/- 300px от границ viewport'а | работает в обе стороны
            { rootMargin: '300px 0px' },
        )
        observer.observe(image)
        observers.push(observer)
    })

    return () => {
        observers.forEach((obs) => obs.disconnect())
    }
}
