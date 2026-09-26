export function initAdvantagesPicturesAnimationStateManager() {
    const advantages = document.querySelectorAll('.my-advantages__advantage')
    if (!advantages.length) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const observers: IntersectionObserver[] = []

    advantages.forEach((advantage) => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                advantage.classList.toggle(
                    'my-advantages__advantage--is-paused',
                    !entry.isIntersecting,
                )
            },

            // * запуск анимации только если до компонента в пределах +/- 300px от границ viewport'а | работает в обе стороны
            { rootMargin: '300px 0px' },
        )
        observer.observe(advantage)
        observers.push(observer)
    })

    return () => {
        observers.forEach((obs) => obs.disconnect())
    }
}
