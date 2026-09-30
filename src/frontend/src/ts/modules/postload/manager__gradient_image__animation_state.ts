export function initGradientImageAnimationStateManager() {
    const images = document.querySelectorAll<HTMLElement>('.my-gradient-image')
    if (!images.length) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const sections = new Set<HTMLElement>()
    images.forEach((image) => {
        const section = image.closest<HTMLElement>('section') || image.parentElement
        if (section) {
            sections.add(section)
        }
    })

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const section = entry.target as HTMLElement
                const isPaused = !entry.isIntersecting
                const items = section.querySelectorAll<HTMLElement>('.my-gradient-image')
                items.forEach((item) => {
                    item.classList.toggle('my-gradient-image--is-paused', isPaused)
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
