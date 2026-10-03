export function initDecorativeBubblesAnimationStateManager() {
    const bubblesContainer = document.querySelector('.my-background-bubbles')
    if (!bubblesContainer) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const bubbles = bubblesContainer.querySelectorAll('.my-bubble')
    if (!bubbles.length) {
        return
    }

    const observers: IntersectionObserver[] = []

    bubbles.forEach((bubble) => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                bubble.classList.toggle('my-bubble--is-paused', !entry.isIntersecting)
            },

            // * запуск анимации только если до компонента в пределах +/- 300px от границ viewport'а | работает в обе стороны
            { rootMargin: '300px 0px' },
        )
        observer.observe(bubble)
        observers.push(observer)
    })

    return () => {
        observers.forEach((obs) => obs.disconnect())
    }
}
