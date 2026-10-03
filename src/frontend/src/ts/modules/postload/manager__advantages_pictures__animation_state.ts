export function initAdvantagesPicturesAnimationStateManager() {
    const advantages = document.querySelectorAll<HTMLElement>('.my-advantages__advantage')
    if (!advantages.length) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const sections = new Set<HTMLElement>()
    advantages.forEach((advantage) => {
        const section = advantage.closest<HTMLElement>('section') || advantage.parentElement
        if (section) {
            sections.add(section)
        }
    })

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const section = entry.target as HTMLElement
                const isPaused = !entry.isIntersecting
                const items = section.querySelectorAll<HTMLElement>('.my-advantages__advantage')
                items.forEach((item) => {
                    item.classList.toggle('my-advantages__advantage--is-paused', isPaused)
                })
            })
        },
        { rootMargin: '200px 0px' },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
        observer.disconnect()
    }
}
