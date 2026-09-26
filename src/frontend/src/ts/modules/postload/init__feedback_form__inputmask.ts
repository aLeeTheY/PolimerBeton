/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MaskedTextChangedListener } from 'ts-input-mask'

export function initFeedbackFormInputMask() {
    const phoneInput = document.getElementById('client_phone') as HTMLInputElement | null
    const nameInput = document.getElementById('client_name') as HTMLInputElement | null

    // Защита: если на текущей странице нет ни инпута телефона, ни инпута имени,
    // значит формы здесь нет — сразу выходим.
    if (!phoneInput && !nameInput) {
        return
    }

    // --- Телефон ---
    if (phoneInput) {
        // Создаем локальную константу без null для вложенного класса маски
        const phone: HTMLInputElement = phoneInput
        const phoneFormat = '+7 ([000]) [000]-[00]-[00]'

        // Устанавливаем placeholder
        phone.placeholder = '+7 (___) ___-__-__'

        MaskedTextChangedListener.installOn(
            phoneFormat,
            phone,
            new (class implements MaskedTextChangedListener.ValueListener {
                onTextChanged(
                    _maskFilled: boolean,
                    _extractedValue: string,
                    _formattedText: string,
                ): void {
                    // Твоя логика при изменении текста (если нужна)
                }
            })(),
            undefined, // affineFormats
            undefined, // customNotations
            undefined, // affinityCalculationStrategy
            true, // autocomplete
        )
    }

    // --- Имя ---
    if (nameInput) {
        // Жестко фиксируем тип для внутренних коллбэков (blur и input)
        const name: HTMLInputElement = nameInput

        // Маска для имени: только буквы, до 100 символов
        name.addEventListener('blur', () => {
            const value = name.value.trim()
            if (value) {
                name.value = value.replace(/(?:^|[\s-])\S/g, (char) => char.toUpperCase())
            }
        })

        // Фильтрация не-букв на лету
        name.addEventListener('input', () => {
            name.value = name.value.replace(/[^A-Za-zА-Яа-яЁё\s-]/g, '')
            if (name.value.length > 100) {
                name.value = name.value.slice(0, 100)
            }
        })
    }
}
