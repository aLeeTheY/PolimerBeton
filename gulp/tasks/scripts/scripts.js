import gulp from 'gulp'
import gulpReplace from 'gulp-replace'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// ! build mode
import { gulpEsbuild } from 'gulp-esbuild'

// ! watch mode
// import { createGulpEsbuild } from 'gulp-esbuild'
// const gulpEsbuild = createGulpEsbuild({ incremental: true })

// * --- EXPORT GULP TASK FOR JS/TS FILES
// * ------------------------------------
export function scripts() {
    // // ! для файлов JS из libs/, если они подключены внутри другого JS
    // const libsPrefix = env.isLocal ? '../libs/' : `${env.assetPrefix}libs/`

    return (
        gulp
            // * берем исходники
            // .src(path.src.getScripts(env.jsMode), { sourcemaps: env.buildMode.isDev || env.buildMode.isStaging })
            .src(path.src.getScripts(env.jsMode))
            // * подключаем plumber, чтобы gulp не падал при ошибке
            .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.SCRIPTS))
            // * билдим JS с помощью Esbuild
            .pipe(
                gulpEsbuild({
                    bundle: true,
                    format: 'esm',
                    platform: 'browser',
                    splitting: true,
                    chunkNames: 'chunks/[name]-[hash]',
                    outExtension: { '.js': '.min.js' },
                    entryPoints: path.src.getScripts(env.jsMode),
                    // ! файл не один
                    // outfile: 'main.min.js',
                    // * сохранить в корень выходной папки
                    outdir: '.',
                    sourcemap: env.buildMode.isDev || env.buildMode.isStaging ? 'linked' : false,
                    minify: env.buildMode.isStaging || env.buildMode.isProd,
                    target: ['es2020'],
                    drop: env.buildMode.isProd ? ['console', 'debugger'] : [],
                    treeShaking: true,
                    define: {
                        'process.env.buildMode.NODE_ENV': JSON.stringify(
                            env.buildMode.isDev ? 'development' : 'production',
                        ),
                    },
                }),
            )

            // // ! для файлов JS из libs/, если они подключены внутри другого JS
            // .pipe(gulpReplace(/@libs\//g, libsPrefix))

            // * кладем результат в папку сборки
            .pipe(gulp.dest(path.build.scripts))
            // * обновляем сервер разработки
            .on('end', () => {
                // * update dev server
                browserSync.reload()
            })
    )
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('scripts', scripts)
