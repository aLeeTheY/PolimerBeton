export function initAdvantagesNumbersAnimationStateManager() {
    const subtitles = document.querySelectorAll<HTMLElement>('.my-subtitle--advantage')
    if (!subtitles.length) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    // Собираем уникальные родительские секции
    const sections = new Set<HTMLElement>()
    subtitles.forEach((subtitle) => {
        const section = subtitle.closest<HTMLElement>('section') || subtitle.parentElement
        if (section) {
            sections.add(section)
        }
    })

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const section = entry.target as HTMLElement
                const isPaused = !entry.isIntersecting
                const items = section.querySelectorAll<HTMLElement>('.my-subtitle--advantage')
                items.forEach((item) => {
                    item.classList.toggle('my-subtitle--is-paused', isPaused)
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
