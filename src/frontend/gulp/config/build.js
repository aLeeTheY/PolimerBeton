import { path } from './path.js'
import { env } from './env.js'

// * --- Прокидываем папку билда в зависимости от режима сборки | DEFAULT or DJANGO
// * ------------------------------------------------------------------------------
export const build = env.isDjangoBuild ? path.djangoBuild : path.build
export const buildClean = env.isDjangoBuild ? path.djangoClean : path.clean
