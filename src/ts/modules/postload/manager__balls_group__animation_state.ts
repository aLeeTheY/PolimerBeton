export function initBallsGroupsAnimationStateManager() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const groups = document.querySelectorAll('.my-balls-group')
    if (!groups.length) {
        return
    }

    const observers: IntersectionObserver[] = []

    groups.forEach((group) => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                group.classList.toggle('my-balls-group--is-paused', !entry.isIntersecting)
            },

            // * запуск анимации только если до компонента в пределах +/- 300px от границ viewport'а | работает в обе стороны
            { rootMargin: '300px 0px' },
        )
        observer.observe(group)
        observers.push(observer)
    })

    return () => {
        observers.forEach((obs) => obs.disconnect())
    }
}
