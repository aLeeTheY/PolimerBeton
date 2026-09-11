export async function initFooterPositionStateManager() {
    const footer = document.getElementById('footer')
    if (!footer) {
        return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        // ? лучше управлять этим через CSS
        // footer.style.setProperty('--footer__fade__opacity', '0')
        // footer.classList.add('my-footer--relative')
        return
    }

    // Проверяем поддержку CSS Scroll-Driven Animations (именно scroll, а не view)
    const supportsScrollDrivenAnimations = CSS.supports('animation-timeline', 'scroll()')

    let cachedFooterHeight = footer.offsetHeight
    let isOverflowing = false

    // Функция синхронизации габаритов: обновляет CSS-переменную высоты и переключает относительное позиционирование
    const syncFooterDimensions = () => {
        cachedFooterHeight = footer.offsetHeight
        const clientHeight = window.innerHeight

        // 1. Передаем точную высоту футера в CSS для animation-range
        footer.style.setProperty('--footer__current-height', `${cachedFooterHeight}px`)

        // 2. Если футер выше экрана — делаем его relative (отключаем эффекты)
        isOverflowing = cachedFooterHeight >= clientHeight
        footer.classList.toggle('my-footer--relative', isOverflowing)
    }

    // Функция расчёта прозрачности для JS-фоллбэка (старые браузеры)
    const updateOpacity = () => {
        if (isOverflowing) {
            return
        }

        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = window.innerHeight
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight)

        let afterOpacity = '0'
        if (cachedFooterHeight > 0) {
            const rawProgress = 1 - distanceToBottom / cachedFooterHeight
            const progress = Math.min(Math.max(rawProgress, 0), 1)
            afterOpacity = Math.max(0.87 - progress, 0).toString()
        }

        footer.style.setProperty('--footer__fade__opacity', afterOpacity)
    }

    // 1. ResizeObserver: отслеживает изменение размеров самóго футера
    const observer = new ResizeObserver(() => {
        syncFooterDimensions()

        if (!supportsScrollDrivenAnimations) {
            updateOpacity()
        }
    })
    observer.observe(footer)

    // 2. Слушатель resize окна (нужен для перерасчета isOverflowing, если меняется высота innerHeight)
    const handleWindowResize = () => {
        syncFooterDimensions()
        if (!supportsScrollDrivenAnimations) {
            updateOpacity()
        }
    }
    window.addEventListener('resize', handleWindowResize, { passive: true })

    // 3. Scroll Event: вешается ТОЛЬКО если нет CSS scroll-driven animations
    let ticking = false
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateOpacity()
                ticking = false
            })
            ticking = true
        }
    }

    if (!supportsScrollDrivenAnimations) {
        window.addEventListener('scroll', handleScroll, { passive: true })
        updateOpacity() // Первичный расчет для JS
    }

    // Первичный расчет высоты для всех режимов
    syncFooterDimensions()

    // 4. Accessibility Focus Event
    const handleFocusIn = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        })
    }
    footer.addEventListener('focusin', handleFocusIn)

    // 5. Очистка ресурсов при анмаунте
    return () => {
        observer.disconnect()
        window.removeEventListener('resize', handleWindowResize)
        footer.removeEventListener('focusin', handleFocusIn)

        if (!supportsScrollDrivenAnimations) {
            window.removeEventListener('scroll', handleScroll)
        }
    }
}
