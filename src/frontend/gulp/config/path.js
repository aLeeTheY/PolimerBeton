import * as nodePath from 'path'

// * --- BASE FOLDERS
// * ----------------
const rootFolderName = nodePath.basename(nodePath.resolve())
const rootFolder = './'

const srcFolder = './src'

// * --- DEFAULT BUILD TARGETS
// * -------------------------
const buildFolder = './dist'
// const tempFolder = './temp'
const zipFolder = './archive'

// * --- DJANGO BUILD TARGETS
// * ------------------------
const djangoApp = '../backend/apps/MainApp'

const djangoStatic = `${djangoApp}/static/MainApp`

const djangoTemplates = `${djangoApp}/templates/MainApp`
const djangoMetaTemplates = `${djangoApp}/templates/meta`

// * --- EXPORT GULP PATHS
// * ---------------------
export const path = {
    projectRootFolderName: rootFolderName,

    clean: buildFolder,
    djangoClean: [
        // * --- Очистка Django Static
        `${djangoStatic}/**`,
        `!${djangoStatic}`,
        `!${djangoStatic}/**/`, // Сохраняем все директории
        `!${djangoStatic}/**/*.gitkeep`, // Сохраняем .gitkeep

        // * --- Очистка Django Templates
        `${djangoTemplates}/**`,
        `!${djangoTemplates}`,
        `!${djangoTemplates}/**/`,
        `!${djangoTemplates}/**/*.gitkeep`,

        // * --- Очистка Django Meta Templates
        `${djangoMetaTemplates}/**`,
        `!${djangoMetaTemplates}`,
        `!${djangoMetaTemplates}/**/`,
        `!${djangoMetaTemplates}/**/*.gitkeep`,
    ],

    build: {
        base: buildFolder,
        html: `${buildFolder}/`,
        meta: {
            favicon: `${buildFolder}/`,
            text: `${buildFolder}/`,
        },
        styles: `${buildFolder}/css/`,
        scripts: `${buildFolder}/js/`,
        audio: `${buildFolder}/assets/audio/`,
        fonts: `${buildFolder}/assets/fonts/`,
        icons: `${buildFolder}/assets/icons/`,
        images: `${buildFolder}/assets/images/`,
        videos: `${buildFolder}/assets/videos/`,
        misc: `${buildFolder}/assets/misc/`,
        libs: `${buildFolder}/libs/`,
    },

    djangoBuild: {
        base: djangoApp,
        html: `${djangoTemplates}/`,
        meta: {
            favicon: `${djangoStatic}/meta/favicon/`,
            text: `${djangoMetaTemplates}/`,
        },
        styles: `${djangoStatic}/css/`,
        scripts: `${djangoStatic}/js/`,
        audio: `${djangoStatic}/assets/audio/`,
        fonts: `${djangoStatic}/assets/fonts/`,
        icons: `${djangoStatic}/assets/icons/`,
        images: `${djangoStatic}/assets/images/`,
        videos: `${djangoStatic}/assets/videos/`,
        misc: `${djangoStatic}/assets/misc/`,
        libs: `${djangoStatic}/libs/`,
    },

    // temp: {
    //     base: `${tempFolder}`,
    //     meta: `${tempFolder}/`,
    //     audio: `${tempFolder}/assets/audio/`,
    //     fonts: `${tempFolder}/assets/fonts/`,
    //     icons: `${tempFolder}/assets/icons/`,
    //     images: `${tempFolder}/assets/images/`,
    //     videos: `${tempFolder}/assets/videos/`,
    //     misc: `${tempFolder}/assets/misc/`,
    //     libs: `${tempFolder}/libs/`,
    // },

    src: {
        base: `${srcFolder}`,
        html: `${srcFolder}/html/*.html`,
        njk: `${srcFolder}/html/*.{nj,njk,nunjucks}`,
        meta: {
            favicon: {
                images: `${srcFolder}/meta/favicon/**/*.{ico,svg,png}`,
                webManifest: `${srcFolder}/meta/favicon/**/*.{webmanifest,json}`,
            },
            text: `${srcFolder}/meta/**/*.{txt,xml}`,
        },
        // styles: {
        //     base: `${srcFolder}/scss`,
        //     files: `${srcFolder}/scss/*.scss`,
        // },
        getStyles(mode) {
            return { base: `${srcFolder}/${mode}`, files: `${srcFolder}/${mode}/*.${mode}` }
        },
        // scripts: {
        //     js: `${srcFolder}/js/*.{js,mjs,cjs}`,
        //     ts: `${srcFolder}/ts/*.{ts,mts,cts}`,
        // },
        getScripts(mode) {
            // const extensions = mode === 'ts' ? 'ts,mts,cts' : 'js,mjs,cjs'
            // return `${srcFolder}/${mode}/*.{${extensions}}`

            const extensions = mode === 'ts' ? ['ts', 'mts', 'cts'] : ['js', 'mjs', 'cjs']
            return extensions.map((ext) => `${srcFolder}/${mode}/*.${ext}`)
        },
        audio: `${srcFolder}/assets/audio/**/*.{mp3,webm}`,
        fonts: `${srcFolder}/assets/fonts/**/*.{eot,ttf,otf,woff,woff2}`,
        icons: `${srcFolder}/assets/icons/**/*.svg`,
        images: {
            base: `${srcFolder}/assets/images`,
            files: `${srcFolder}/assets/images/**/*.{avif,webp,jpg,jpeg,png,gif}`,
        },
        videos: `${srcFolder}/assets/videos/**/*.{webm,mp4,mov,avi,mkv,flv,m4v}`,
        misc: `${srcFolder}/assets/misc/**/*.*`,
        libs: `${srcFolder}/libs/**/*.{js,mjs,cjs,ts,mts,cts,wasm}`,
        i18n: {
            base: `${srcFolder}/i18n`,
            files: `${srcFolder}/i18n/**/*.json`,
        },
        node_modules: `${rootFolder}/node_modules`,
    },

    watch: {
        base: `${srcFolder}`,
        html: `${srcFolder}/html/**/*.html`,
        njk: `${srcFolder}/html/**/*.{nj,njk,nunjucks}`,
        meta: {
            favicon: {
                images: `${srcFolder}/meta/favicon/**/*.{ico,svg,png}`,
                webManifest: `${srcFolder}/meta/favicon/**/*.{webmanifest,json}`,
            },
            text: `${srcFolder}/meta/**/*.{txt,xml}`,
        },
        // styles: {
        //     base: `${srcFolder}/scss`,
        //     files: `${srcFolder}/scss/**/*.scss`,
        // },
        getStyles(mode) {
            return { base: `${srcFolder}/${mode}`, files: `${srcFolder}/${mode}/**/*.${mode}` }
        },
        // scripts: {
        //     js: `${srcFolder}/js/**/*.{js,mjs,cjs}`,
        //     ts: `${srcFolder}/ts/**/*.{ts,mts,cts}`,
        // },
        getScripts(mode) {
            // const extensions = mode === 'ts' ? 'ts,mts,cts' : 'js,mjs,cjs'
            // return `${srcFolder}/${mode}/**/*.{${extensions}}`

            const extensions = mode === 'ts' ? ['ts', 'mts', 'cts'] : ['js', 'mjs', 'cjs']
            return extensions.map((ext) => `${srcFolder}/${mode}/**/*.${ext}`)
        },
        audio: `${srcFolder}/assets/audio/**/*.{mp3,webm}`,
        fonts: `${srcFolder}/assets/fonts/**/*.{eot,ttf,otf,woff,woff2}`,
        icons: `${srcFolder}/assets/icons/**/*.svg`,
        images: {
            base: `${srcFolder}/assets/images`,
            files: `${srcFolder}/assets/images/**/*.{avif,webp,jpg,jpeg,png,gif}`,
        },
        videos: `${srcFolder}/assets/videos/**/*.{webm,mp4,mov,avi,mkv,flv,m4v}`,
        misc: `${srcFolder}/assets/misc/**/*.*`,
        libs: `${srcFolder}/libs/**/*.{js,mjs,cjs,ts,mts,cts,wasm}`,
        i18n: {
            base: `${srcFolder}/i18n`,
            files: `${srcFolder}/i18n/**/*.json`,
        },
    },

    zip: `${zipFolder}`,
}
