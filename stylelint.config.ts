import type { Config } from 'stylelint'

export default {
    extends: ['stylelint-config-standard-scss'],
    plugins: ['stylelint-no-unsupported-browser-features'],
    rules: {
        // 'plugin/selector-bem-pattern': {
        //     componentName: '[a-z0-9]+(?:-[a-z0-9]+)*',
        //     componentSelectors: { initial: '^\\.{componentName}(?:__[a-z0-9]+)?(?:--[a-z0-9]+)?$' },
        //     utilitySelectors: '^\\.util-[a-z]+$',
        // },
        'plugin/no-unsupported-browser-features': [
            true,
            {
                // * plugin reads 'production' section by default from .browserslistrc
                // browsers: ['last 4 versions', '> 0.2%', 'not dead'],
                ignore: [
                    'css-nesting',
                    'multicolumn',

                    // * не критично
                    'css-text-indent',

                    // * есть fallback, не критично
                    'css-text-box-trim',
                    'css-text-box-edge',

                    // * не критично
                    'css-scrollbar',

                    // * не поддерживает UC Browser
                    'css-focus-visible',

                    // * не поддерживает старый Safari
                    'css3-cursors',
                    'css3-cursors-grab',

                    // todo: можно поднять версии браузеров в .browserslistrc
                    'css-has',

                    // * houdini squircle, отсутствие поддержки не страшно, есть fallback
                    'css-masks',
                    'css-paint-api',

                    // * поддержка размеров от размера контейнера
                    // todo: можно сделать fallback через JS
                    'css-container-query-units',

                    // * feature "css-overflow" is only partially supported by Safari 15.6, Safari on iOS 15.6-15.8, UC Browser for Android 15.5
                    // ? в дефолтном исполнении поддерживается без проблем
                    'css-overflow',

                    // * в Safari лишь частичная поддержка
                    'css-marker-pseudo',

                    // * поддежка dvh ед. измерения
                    // * не критично, обернуты в @supports
                    'viewport-unit-variants',

                    // ? частичная поддержка во многих браузерах
                    // ? не критично, относится к хелперу .my-visually-hidden
                    'css-clip-path',
                ],
                severity: 'warning',
                // * disabled by default
                // ignorePartialSupport: true,
            },
        ],

        'scss/double-slash-comment-empty-line-before': null,
        'scss/dollar-variable-empty-line-before': null,
        'media-feature-range-notation': 'prefix',
        'declaration-empty-line-before': null,
        'at-rule-empty-line-before': null,
        'selector-class-pattern': null,
        'custom-property-pattern': null,
        // 'length-zero-no-unit': null,
        'number-max-precision': 5,
        'font-family-name-quotes': 'always-unless-keyword',
        // 'scss/double-slash-comment-whitespace-inside': '^\\/\\/[!*?todo] ([a-z0-9])*$',
        'scss/at-mixin-pattern': '^([a-z0-9]+(-[a-z0-9]+)*)(--[a-z0-9]+)?$',
    },
} satisfies Config
