<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<span id="readme-top"></span>

<!-- ! --- PROJECT SHIELDS --->
<!-- ! ------------------- --->

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

![GitHub Last Commit][last-commit-shield]
![GitHub Repo Size][repo-size-shield]

</div>

<!-- ! --- PROJECT HEADER --->
<!-- ! ------------------ --->

<br />
<div align="center">
  <h1 align="center">PolimerBeton</h1>

  <p align="center">
    📬 A multi-page responsive marketing site with a contact form and a customer database.
    <br />
    <br />
    <a href="https://aleethey.github.io/PolimerBeton/">Demo</a>
    &middot;
    <a href="https://github.com/aLeeTheY/PolimerBeton/issues/new?labels=bug&template=bug-report---.md">Report a Bug</a>
  </p>

[![Russian](https://img.shields.io/badge/Русский-blue)](README.md)
[![English](https://img.shields.io/badge/English-blue)](README.ENG.md)

</div>

<!-- ! --- TABLE OF CONTENTS --->
<!-- ! --------------------- --->

<br />
<details>
  <summary>📦 Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">ℹ️ About the Project</a>
      <ul>
        <li>
          <a href="#showcase">🎬 Showcase</a>
          <ul>
            <li><a href="#landing-showcase">📱 Landing Page Walkthrough (Desktop &amp; Mobile)</a></li>
            <li><a href="#pages-showcase">🔔 Utility Pages</a></li>
            <li><a href="#threejs-showcase">🪐 Interactive 3D Spheres (Three.js)</a></li>
            <li><a href="#vanilla-tilt-showcase">🃏 3D Card Tilt Effect (Vanilla Tilt)</a></li>
            <li><a href="#fullstack-showcase">🔄 End-to-End Request Flow (Form ➔ DB ➔ Email)</a></li>
          </ul>
        </li>
        <li>
          <a href="#key-features">✨ Key Features</a>
          <ul>
            <li><a href="#google-lighthouse-benchmark">⚡ Google Lighthouse Benchmark</a></li>
          </ul>
        </li>
        <li><a href="#built-with">🧰 Built With</a></li>
        <li><a href="#project-structure">📂 Project Structure</a></li>
        <li><a href="#supported-browsers">🌐 Supported Browsers</a></li>
      </ul>
    </li>
    <li>
      <a href="#quick-start">🚀 Quick Start</a>
      <ul>
        <li><a href="#clone-repository">1. 📥 Clone the Repository</a></li>
        <li><a href="#env-setup">2. 🔐 Environment Configuration</a></li>
        <li>
          <a href="#deployment-methods">3. 🏗️ Choosing a Deployment Method</a>
          <ul>
            <li>
              <a href="#docker-method">🐳 Option 1: Deployment via Docker Compose (Recommended)</a>
              <ul>
                <li><a href="#docker-prerequisites">📋 Prerequisites</a></li>
                <li>
                  <a href="#docker-build-launch">⚙️ Building and Running the Containers</a>
                  <ul>
                    <li><a href="#docker-create-superuser">👤 Creating a Superuser</a></li>
                    <li><a href="#docker-troubleshooting">🛠️ Troubleshooting (Optional)</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="#native-method">💻 Option 2: Manual Deployment (Native / Without Docker)</a>
              <ul>
                <li><a href="#native-prerequisites">📋 Prerequisites</a></li>
                <li><a href="#native-build-frontend">🎨 Building the Frontend</a></li>
                <li><a href="#native-build-backend">🐍 Setting Up the Backend and Starting the Server</a></li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#usage">💡 Usage</a>
      <ul>
        <li><a href="#admin-panel">🎛️ Admin Panel</a></li>
      </ul>
    </li>
    <li><a href="#development-challenges">🧠 Development Challenges</a></li>
    <li><a href="#key-skills">📈 Key Skills</a></li>
    <li><a href="#roadmap">🗺️ Roadmap</a></li>
    <li><a href="#license">📄 License</a></li>
    <li><a href="#contact">🤝 Contact</a></li>
    <li><a href="#acknowledgments">💖 Acknowledgments</a></li>
  </ol>
</details>

<!-- ! --- ABOUT THE PROJECT --->
<!-- ! --------------------- --->

## ℹ️ About the Project <span id="about-the-project"></span>

The goal of this project is to build a marketing landing page with a contact form. The site lets customers submit callback requests, while the owner receives instant notifications about new orders.

> [!NOTE]
> The frontend is built on top of a custom Gulp-based pipeline. Detailed documentation on the pipeline architecture, configurations, and tasks is available in a separate repository:
>
> [**Wishbone-plus-Partners**](https://github.com/aLeeTheY/Wishbone-plus-Partners)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- DEMO / SHOWCASE --->
<!-- ! ------------------- --->

### 🎬 Showcase <span id="showcase"></span>

Below is a video walkthrough of the site's key features (_click any image to open the live demo_):

<div align="center">

#### 📱 Landing Page Walkthrough (Desktop & Mobile) <span id="landing-showcase"></span>

[![Landing page walkthrough][01-website-walkthrough]](https://aleethey.github.io/PolimerBeton/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### 🔔 Utility Pages <span id="pages-showcase"></span>

[![Utility pages][02-pages-walkthrough]](https://aleethey.github.io/PolimerBeton/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### 🪐 Interactive 3D Spheres (Three.js) <span id="threejs-showcase"></span>

[![Interactive 3D spheres][03-threejs-interactivity]](https://aleethey.github.io/PolimerBeton/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### 🃏 3D Card Tilt Effect (Vanilla Tilt) <span id="vanilla-tilt-showcase"></span>

[![3D card tilt effect][04-vanilla-tilt-effects]](https://aleethey.github.io/PolimerBeton/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### 🔄 End-to-End Request Flow (Form ➔ DB ➔ Email) <span id="fullstack-showcase"></span>

[![End-to-end request flow][05-fullstack-workflow]](https://aleethey.github.io/PolimerBeton/)

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- KEY FEATURES --->
<!-- ! ---------------- --->

### ✨ Key Features <span id="key-features"></span>

_For convenience, everything is grouped by category._

<details>
  <summary>🎨 Frontend, UI & Client-Side Interactivity</summary>

- **Custom UI/UX Design System:** Hand-crafted page layouts designed in **Figma** using a component-based system and a responsive grid.
- **Fluid & Responsive Layout:** Responsive markup built on **Bootstrap** and **Bootstrap Icons** with custom SCSS modules for correct rendering across all device types.
- **Dark Mode Ecosystem:** Declarative dark theme support with manual toggle and automatic syncing to the OS-level preference (<code encoded-by-transform-md="true">prefers&#8209;color&#8209;scheme</code>).
- **3D WebGL Graphics (Blender & Three.js):** 3D spheres modeled and UV-textured in **Blender** (<code encoded-by-transform-md="true">.glb</code>), then assembled asynchronously into an interactive **Three.js** scene rendered on a Canvas in the Hero section.
- **Micro-interactions & CSS Animations:** Volumetric 3D card tilt via **vanilla-tilt.js**, self-contained looping decorative CSS animations (<code encoded-by-transform-md="true">@keyframes</code>), custom GPU-accelerated UI transitions (<code encoded-by-transform-md="true">transform</code>, <code encoded-by-transform-md="true">will&#8209;change</code>), parallax effects, and an animated gradient on accent elements. Decorative animations automatically pause when an element leaves the viewport, reducing CPU load and saving battery on mobile devices.
- **Input Masking & Error Pages:** Client-side user input validation via **inputmask**, plus styled custom **404** and **500** error pages matching the site's visual language.
- **Cookie Consent & Analytics:** Custom cookie-consent banner. Third-party analytics (**Google Analytics + Yandex Metrica**) are only loaded after the user explicitly opts in.

</details>

<details>
  <summary>⚙️ Backend & Database Architecture</summary>

- **Django Core Architecture:** Modular backend structure (<code encoded-by-transform-md="true">MainApp</code>), dependency management via **Poetry**, and a customized admin panel.
- **Database Field-Level Encryption:** Sensitive customer data is encrypted at the individual model-field level in the **ORM** (_Object-Relational Mapping_) before being persisted to the database.
- **Admin Panel Localization (i18n):** Admin UI localization based on the system-level **GNU Gettext** mechanism (<code encoded-by-transform-md="true">.po</code>/<code encoded-by-transform-md="true">.mo</code>). Translations cover the admin panel only — the public site is monolingual (Russian), as it targets the Russian market.
- **Resilient Fallback Form Validation:** Two-tier validation — the client-side input mask is backed by strict Django-side validation, so forms are still processed even with JavaScript disabled.
- **Flexible Transactional Mail Pipeline:** Order notifications can be sent through two independently configurable channels — the standard **SMTP** protocol and the **Mailjet HTTP API** (an HTTPS transport for VPS hosts with blocked SMTP ports). Channels are toggled via environment variables and can run independently, in parallel, or both disabled.
- **Rate-Limited Form Submission:** Anti-spam protection on the contact form — no more than 3 submissions per client per hour. The counter resets hourly; once the limit is exceeded, the user is served a dedicated <code encoded-by-transform-md="true">limit&#8209;exceeded.html</code> page. Protects against floods and automated spam without external CAPTCHA services.
- **Admin-Controlled Site Configuration:** A <code encoded-by-transform-md="true">SiteConfig</code> model with parameters editable through django-admin — the official site domain and the current polymer-concrete price. Values are passed into templates via a context processor, letting the owner update them without touching code or rebuilding the frontend.

</details>

<details>
  <summary>🐳 Infrastructure, Docker & CI/CD</summary>

- **Containerized Environments:** Multi-stage isolation via **Docker** and **Docker Compose**, with separate configurations for <code encoded-by-transform-md="true">dev</code>, <code encoded-by-transform-md="true">staging</code>, and <code encoded-by-transform-md="true">prod</code> (including a <code encoded-by-transform-md="true">SELinux</code>-compatible profile).
- **Nginx Reverse Proxy Stack & Automated SSL:** Dynamic virtual host routing and automated issuance/renewal of Let's Encrypt SSL certificates through the **nginx-proxy**, **acme-companion**, and **docker-gen** stack.
- **Environment Configuration Blueprints:** <code encoded-by-transform-md="true">.env.*.template</code> files that define the variable layout for generating concrete <code encoded-by-transform-md="true">.env</code> configs for a given build scenario.
- **Automated SSH Deployment Workflow:** A preconfigured auto-deploy pipeline via **GitHub Actions** and **SSH** to automatically update containers on a VPS on pushes to <code encoded-by-transform-md="true">main</code> _(disabled by default in the current repository configuration)_.

</details>

<details>
  <summary>⚡ Performance & Asset Optimization</summary>

- **Progressive WebGL Initialization:** LCP optimization by splitting UI initialization from Three.js: the 3D scene is lazily bootstrapped via dynamic imports (<code encoded-by-transform-md="true">import()</code>), <code encoded-by-transform-md="true">requestIdleCallback</code>, and lightweight 2D-sprite placeholders before the Canvas is mounted.
- **Next-Gen Media Pipeline:** Automatic conversion and delivery of images in <code encoded-by-transform-md="true">.avif</code> and <code encoded-by-transform-md="true">.webp</code> with fallbacks via semantic <code encoded-by-transform-md="true">&lt;picture&gt;</code>/<code encoded-by-transform-md="true">&lt;source&gt;</code> structures.
- **Critical CSS & Resource Prioritization:** Critical CSS injection for instant first-paint, preloading of key <code encoded-by-transform-md="true">.woff2</code> fonts, and Hero graphics with the <code encoded-by-transform-md="true">fetchpriority="high"</code> attribute.
- **Automated Gulp Pipeline & Nunjucks:** Frontend builds powered by Gulp, compiling **Nunjucks** (<code encoded-by-transform-md="true">.njk</code>) templates into minified HTML/Django templates, with fast TypeScript bundling via **Esbuild**, SCSS preprocessing, image optimization (**Sharp**, **SVGO**), and HTML post-processing through PostHTML.

</details>

<details>
  <summary>🛡️ Code Quality & Automated Linting</summary>

- **Cross-Browser Layout Inspection:** **Playwright** integration to spin up isolated browser engines (Chromium, WebKit, Firefox) on demand for manual responsiveness and layout QA during development.
- **Targeted Browser Compatibility Guard:** <code encoded-by-transform-md="true">.browserslistrc</code> wired into **Stylelint** (via the <code encoded-by-transform-md="true">stylelint&#8209;no&#8209;unsupported&#8209;browser&#8209;features</code> plugin), blocking commits that introduce CSS properties unsupported by the target browser versions.
- **Strict Linting & Formatting Standards:** Pre-commit code checks via **Husky**, **lint-staged**, **ESLint**, **Stylelint**, and **Prettier**.
- **Conventional Commits:** Strict enforcement of commit message format via **commitlint**.

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### ⚡ Google Lighthouse Benchmark <span id="google-lighthouse-benchmark"></span>

To back up the site's high level of optimization, below are the **Google Lighthouse** benchmark results for both desktop and mobile:

<div align="center">

|                          🖥️ Desktop Version                           |                          📱 Mobile Version                          |
| :-------------------------------------------------------------------: | :-----------------------------------------------------------------: |
| ![Lighthouse Desktop](docs/assets/benchmark/lighthouse__desktop.avif) | ![Lighthouse Mobile](docs/assets/benchmark/lighthouse__mobile.avif) |

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- BUILT WITH --->
<!-- ! -------------- --->

### 🧰 Built With <span id="built-with"></span>

_For convenience, everything is grouped by category._

<details>
<summary>🎨 Frontend & Build Infrastructure</summary>

- [![HTML5][HTML-logo]][HTML-url] <sup>— semantic markup and page structure</sup>
- [![Nunjucks][Nunjucks-logo]][Nunjucks-url] <sup>— component-based templating engine used at build time (Gulp) to generate final HTML/Django templates</sup>
- [![TypeScript][TypeScript-logo]][TypeScript-url] <sup>— strict typing for interactive client-side logic</sup>
- [![Three.js][ThreeJS-logo]][ThreeJS-url] <sup>— WebGL rendering of the interactive 3D scene</sup>
- [![Sass][Sass-logo]][Sass-url] <sup>— CSS preprocessor for BEM-style stylesheet architecture</sup>
- [![Bootstrap][Bootstrap-logo]][Bootstrap-url] <sup>— UI framework for the responsive grid and base components</sup>
- [![Node.js][NodeJS-logo]][NodeJS-url] <sup>— runtime for the build tooling</sup>
  - [![Npm][Npm-logo]][Npm-url] <sup>— frontend dependency management</sup>
  - [![Gulp][Gulp-logo]][Gulp-url] <sup>— orchestration of build, minification, and asset-optimization tasks (PostCSS, Esbuild, Sharp, SVGO)</sup>

</details>

<details>
<summary>🐍 Backend & Database</summary>

- [![Python][Python-logo]][Python-url] <sup>— primary server-side language</sup>
- [![Poetry][Poetry-logo]][Poetry-url] <sup>— deterministic management of Python dependencies and the virtual environment</sup>
- [![Django][Django-logo]][Django-url] <sup>— web framework for business logic, ORM, and the admin panel</sup>
- [![PostgreSQL][Postgres-logo]][Postgres-url] <sup>— relational database management system</sup>

</details>

<details>
<summary>🐳 Docker & Deployment Infrastructure</summary>

- [![Docker][Docker-logo]][Docker-url] <sup>— containerization of application services</sup>
- [![Docker Compose][Docker-Compose-logo]][Docker-Compose-url] <sup>— orchestration of multi-container environments (<code encoded-by-transform-md="true">dev</code>, <code encoded-by-transform-md="true">staging</code>, <code encoded-by-transform-md="true">prod</code>)</sup>
- [![Nginx][Nginx-logo]][Nginx-url] <sup>— reverse proxy (**nginx-proxy**) for traffic routing</sup>
- **ACME Companion** <sup>— automated issuance and renewal of Let's Encrypt SSL certificates</sup>

</details>

<details>
<summary>🛡️ Code Quality (QA & Linters)</summary>

- [![EditorConfig][EditorConfig-logo]][EditorConfig-url] <sup>— unified code-formatting standards across the team</sup>
- [![Browserslist][Browserslist-logo]][Browserslist-url] <sup>— single source of truth for target browsers, used for autoprefixing and CSS validation</sup>
- [![ESLint][ESLint-logo]][ESLint-url] <sup>— static analysis and linting for TypeScript/JavaScript</sup>
- [![Stylelint][Stylelint-logo]][Stylelint-url] <sup>— linting and validation of SCSS/CSS rules</sup>
- [![Prettier][Prettier-logo]][Prettier-url] <sup>— automatic code formatting</sup>
- [![Husky][Husky-logo]][Husky-url] <sup>— Git hooks management and automation</sup>
- [![lint-staged][lint-staged-logo]][lint-staged-url] <sup>— runs linters on staged Git files only, before each commit</sup>
- [![Commitlint][Commitlint-logo]][Commitlint-url] <sup>— enforces the Conventional Commits message format</sup>
- [![Playwright][Playwright-logo]][Playwright-url] <sup>— cross-browser UI testing</sup>

</details>

<details>
<summary>🌿 Version Control & Infrastructure</summary>

- [![Git][Git-logo]][Git-url] <sup>— distributed version control system</sup>
- [![GitHub Actions][GitHubActions-logo]][GitHubActions-url] <sup>— CI/CD pipeline automation</sup>

</details>

<details>
<summary>🖥️ Environment, IDE & Design</summary>

- [![Blender][Blender-logo]][Blender-url] <sup>— 3D modeling, material/UV map setup, and <code encoded-by-transform-md="true">.glb</code> export for Three.js</sup>
- [![Figma][Figma-logo]][Figma-url] <sup>— UI/UX design and export of vector/raster assets</sup>
- [![Visual Studio Code][VSCode-logo]][VSCode-url] <sup>— primary IDE</sup>

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- PROJECT STRUCTURE --->
<!-- ! --------------------- --->

### 📂 Project Structure <span id="project-structure"></span>

Key project directories and files:

```text
PolimerBeton/
│
├── .github/
│   └── workflows/
│       └── update_website_by_ssh.prod.yml          # GitHub CI/CD workflow: update the site on the host on pushes to `main`
│
├── .husky/                                         # Git hooks
├── .vscode/
│
├── deploy/                                         # web server configuration files
│   ├── apache/                                     # Apache configs (if needed for compatibility)
│   │   └── .htaccess
│   │
│   ├── nginx/                                      # main nginx configuration
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   │
│   ├── nginx-proxy/                                # nginx-proxy (automatic SSL / reverse proxy)
│   │   ├── vhost.d/
│   │   │   └── default
│   │   │
│   │   ├── .dockerignore
│   │   ├── custom.conf
│   │   └── Dockerfile
│   │
│   └── templates/                                  # docker-gen templates (used by nginx-proxy)
│       └── docker-gen/
│
├── docs/                                           # miscellaneous project files
│   ├── assets/                                     # assets for README.md
│   ├── database/                                   # database schema
│   └── utils/                                      # utility scripts for processing README.md
│
├── env/                                            # environment variable (.env) file templates for different build scenarios (dev, prod, staging)
│   ├── .env.dev.template
│   ├── .env.prod.db.template
│   ├── .env.prod.proxy-companion.template
│   ├── .env.prod.template
│   ├── .env.staging.db.template
│   ├── .env.staging.proxy-companion.template
│   └── .env.staging.template
│
├── src/
│   ├── backend/
│   │   ├── apps/
│   │   │   └── MainApp/                            # source code of the main Django app
│   │   │       ├── migrations/                     # database migrations
│   │   │       │
│   │   │       ├── static/
│   │   │       │   └── MainApp/                    # site static files | generated at build time
│   │   │       │       └── .gitkeep
│   │   │       │
│   │   │       ├── templates/
│   │   │       │   ├── email/
│   │   │       │   │   └── message_template.html   # email template
│   │   │       │   │
│   │   │       │   ├── MainApp/                    # main site page templates (index.html, 404.html, ..., etc.) | generated at build time
│   │   │       │   │   └── .gitkeep
│   │   │       │   │
│   │   │       │   └── meta/                       # site meta files (robots.txt, humans.txt, ..., etc.) | generated at build time
│   │   │       │       └── .gitkeep
│   │   │       │
│   │   │       ├── __init__.py
│   │   │       ├── admin.py                        # admin panel customization
│   │   │       ├── apps.py
│   │   │       ├── context_processors.py           # context processors used in templates
│   │   │       ├── forms.py                        # form validator
│   │   │       ├── models.py                       # database models
│   │   │       ├── sitemaps.py                     # sitemap.xml generator
│   │   │       ├── tests.py                        # unit tests
│   │   │       ├── urls.py                         # main site URL routes (MainApp only)
│   │   │       └── views.py                        # request handling (business logic)
│   │   │
│   │   ├── config/                                 # global Django project configuration
│   │   │   ├── settings/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py                         # shared settings for dev & prod
│   │   │   │   ├── dev.py                          # settings for dev-mode builds
│   │   │   │   └── prod.py                         # settings for prod-mode builds
│   │   │   │
│   │   │   ├── __init__.py
│   │   │   ├── asgi.py
│   │   │   ├── urls.py                             # global site URL routes
│   │   │   └── wsgi.py
│   │   │
│   │   ├── locale/                                 # translation files for the admin
│   │   │   └── ru/
│   │   │       └── LC_MESSAGES
│   │   │           ├── django.mo                   # compiled translations (gettext)
│   │   │           └── django.po                   # translation source (gettext)
│   │   │
│   │   ├── scripts/                                # Django app startup scripts for Docker (dev & prod)
│   │   │   ├── entrypoint.prod.sh
│   │   │   └── entrypoint.sh
│   │   │
│   │   ├── manage.py                               # CLI for managing the Django project
│   │   ├── poetry.lock                             # locked dependencies for the Python virtual env (.venv)
│   │   └── pyproject.toml                          # Python project description and dependencies for the Python virtual env (.venv)
│   │
│   ├── frontend/
│   │   ├── gulp/                                   # Gulp bundler configuration
│   │   │   ├── config/                             # config files (CLI keys, src/ & build/ paths, FTP)
│   │   │   ├── helpers/                            # helper scripts
│   │   │   │
│   │   │   └── tasks/                              # main Gulp scripts
│   │   │       ├── assets/                         # asset-processing scripts (fonts, vector icons, raster images, etc.)
│   │   │       │
│   │   │       ├── core/
│   │   │       │   ├── dev/
│   │   │       │   │   ├── server.js               # dev server launcher
│   │   │       │   │   └── watch.js                # watchers launcher
│   │   │       │   │
│   │   │       │   ├── clean.js                    # build cleanup script
│   │   │       │   └── main-tasks.js               # main build pipelines
│   │   │       │
│   │   │       ├── html/
│   │   │       ├── meta/
│   │   │       ├── scripts/
│   │   │       ├── styles/
│   │   │       └── utils/                          # scripts with extra functionality (revision, zip, etc.)
│   │   │
│   │   ├── src/                                    # frontend source code
│   │   │   ├── assets/                             # assets
│   │   │   │   ├── audio/
│   │   │   │   ├── fonts/
│   │   │   │   ├── icons/
│   │   │   │   ├── images/
│   │   │   │   ├── misc/
│   │   │   │   └── videos/
│   │   │   │
│   │   │   ├── html/                               # page templates
│   │   │   ├── i18n/                               # internationalization / translations
│   │   │   ├── libs/                               # JS libraries
│   │   │   ├── meta/                               # meta file templates (robots.txt, sitemap.xml, ..., etc.)
│   │   │   ├── scss/                               # styles (Sass)
│   │   │   ├── ts/                                 # scripts (TypeScript)
│   │   │   │
│   │   │   └── site.config.json                    # URL configs for different build scenarios
│   │   │
│   │   ├── tests/
│   │   │   └── playwright/                         # Playwright script to launch browsers for manual layout QA (Chrome, Firefox & Safari)
│   │   │       ├── example.spec.ts
│   │   │       └── start_manual_website_test_in_playwright_browsers.ts
│   │   │
│   │   ├── .browserslistrc
│   │   ├── .npmrc
│   │   ├── .stylelintignore
│   │   ├── eslint.config.ts
│   │   ├── gulpfile.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── playwright.config.ts
│   │   ├── postcss.config.js
│   │   ├── posthtml.config.js
│   │   ├── stylelint.config.ts
│   │   ├── svgo.config.mjs
│   │   └── tsconfig.json
│   │
│   ├── Dockerfile                                  # Docker image build script (dev mode)
│   └── Dockerfile.prod                             # Docker image build script (prod mode)
│
├── .dockerignore
├── .editorconfig
├── .editorconfig-checker.json
├── .gitattributes
├── .gitignore
├── .lintstagedrc.yml
├── .npmrc
├── .prettierignore
├── .commitlint.config.ts
├── docker-compose.prod-selinux.yml
├── docker-compose.prod.yml                         # production deployment
├── docker-compose.staging.yml                      # pre-production (staging) deployment
├── docker-compose.yml                              # development deployment
├── LICENSE
├── package-lock.json
├── package.json
├── prettier.config.mts
├── README.ENG.md
├── README.md
└── tsconfig.json
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- SUPPORTED BROWSERS --->
<!-- ! ---------------------- --->

### 🌐 Supported Browsers <span id="supported-browsers"></span>

The site has been verified for correct rendering and stable script behavior in the latest versions of the following browsers:

- [![Google Chrome][GoogleChrome-logo]][GoogleChrome-url]
- [![Microsoft Edge][MicrosoftEdge-logo]][MicrosoftEdge-url]
- [![Yandex][Yandex-logo]][Yandex-url]
- [![Firefox][Firefox-logo]][Firefox-url]
- [![Opera][Opera-logo]][Opera-url]

> [!IMPORTANT]
> Verified in the latest stable versions of all browsers listed above, as of **[3.0.0](https://github.com/aLeeTheY/PolimerBeton/releases/tag/3.0.0)**.
>
> **Last verified: October 9, 2026**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- QUICK START --->
<!-- ! --------------- --->

## 🚀 Quick Start <span id="quick-start"></span>

_Follow the instructions below to deploy the project correctly._

### 1. 📥 Clone the Repository <span id="clone-repository"></span>

Download the repository as a ZIP archive or clone it using [Git][Git-url], then move into the project directory:

```sh
git clone https://github.com/aLeeTheY/PolimerBeton
cd PolimerBeton/
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 2. 🔐 Environment Configuration <span id="env-setup"></span>

Create the configuration files in the <code encoded-by-transform-md="true">env/</code> directory from the corresponding <code encoded-by-transform-md="true">.env.*.template</code> files. The project supports three environment profiles: **development**, **staging**, and **production**.

> [!IMPORTANT]
> The <code encoded-by-transform-md="true">staging</code> and <code encoded-by-transform-md="true">prod</code> builds are intended for deployment on a public server (VPS/VDS) with a bound domain name, since they include a reverse proxy (**nginx-proxy**) and automated SSL issuance (**acme-companion**).
> For local development on your PC, use the <code encoded-by-transform-md="true">dev</code> profile (<code encoded-by-transform-md="true">docker&#8209;compose.yml</code>).

For example, to prepare the **production** environment, navigate to the <code encoded-by-transform-md="true">env/</code> directory and copy the templates:

```sh
cd env/

cp .env.prod.template .env.prod
cp .env.prod.db.template .env.prod.db
cp .env.prod.proxy-companion.template .env.prod.proxy-companion
```

Then, in **each** of the created files, replace every placeholder value of the form <code encoded-by-transform-md="true">&lt;...&gt;</code> with your own parameters (the names of the placeholders inside the templates explain what each variable is for).

Example for the <code encoded-by-transform-md="true">.env.prod.db</code> file:

<div align="center">

| Original value                                                                                                         | Example value                                                                 |   Required   |
| :--------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- | :----------: |
| <code encoded-by-transform-md="true">POSTGRES_DB=polimerbeton_db__prod</code>                                          | <code encoded-by-transform-md="true">POSTGRES_DB=polimerbeton_db__prod</code> |   optional   |
| <code encoded-by-transform-md="true">POSTGRES_USER=&lt;YOUR_DATABASE_USERNAME&gt;</code>                               | <code encoded-by-transform-md="true">POSTGRES_USER=admin</code>               | **required** |
| <code encoded-by-transform-md="true">POSTGRES_PASSWORD=&lt;YOUR_DATABASE_PASSWORD__DONT_MATCH_WITH_USERNAME&gt;</code> | <code encoded-by-transform-md="true">POSTGRES_PASSWORD=qwerty123456</code>    | **required** |

</div>

Then return to the project root to continue the build:

```sh
# Return to the project root to continue the build
cd ..
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 3. 🏗️ Choosing a Deployment Method <span id="deployment-methods"></span>

_The next step depends on your goals: you can deploy the project in isolated **Docker** containers, or run it **natively** on your host machine._

#### 🐳 Option 1: Deployment via Docker Compose (Recommended) <span id="docker-method"></span>

##### 📋 Prerequisites <span id="docker-prerequisites"></span>

Install [Docker][Docker-url] and the [Docker Compose][Docker-Compose-url] plugin.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### ⚙️ Building and Running the Containers <span id="docker-build-launch"></span>

Pick the compose file that suits your scenario (<code encoded-by-transform-md="true">docker&#8209;compose.*.yml</code>) and start the build:

```sh
# Example for the dev configuration:
docker compose up -d --build

# Example for the prod configuration:
docker compose -f docker-compose.prod.yml up -d --build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### 👤 Creating a Superuser <span id="docker-create-superuser"></span>

> [!NOTE]
> In <code encoded-by-transform-md="true">dev</code> mode, the admin account is created automatically on container startup from the <code encoded-by-transform-md="true">DJANGO_SUPERUSER_*</code> variables.

For <code encoded-by-transform-md="true">staging</code> and <code encoded-by-transform-md="true">prod</code> builds, create the Django **superuser** manually after the containers are up:

```sh
# Via the Docker CLI by container name (prod configuration):
docker exec -it polimerbeton-app--prod python manage.py createsuperuser

# Or via Docker Compose by service name (prod configuration):
docker compose -f docker-compose.prod.yml exec app python manage.py createsuperuser
```

Then follow the on-screen prompts. Once done, the project is considered fully deployed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

###### 🛠️ Troubleshooting (Optional) <span id="docker-troubleshooting"></span>

_On a VPS with limited RAM or disk space, the build may fail. In that case, try a staged build with a preliminary Docker cache cleanup._

> [!CAUTION]
> The commands below delete unused Docker images and the build cache.

1. Clean up unused images and the builder cache:

```sh
docker image prune -f
docker builder prune -f
```

2. Build the main application service (<code encoded-by-transform-md="true">app</code>) separately:

```sh
docker compose -f docker-compose.prod.yml build app
```

3. Clean the intermediate cache again, then start the remaining services:

```sh
docker builder prune -f
docker compose -f docker-compose.prod.yml up -d
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### 💻 Option 2: Manual Deployment (Native / Without Docker) <span id="native-method"></span>

##### 📋 Prerequisites <span id="native-prerequisites"></span>

Make sure [Node.js][NodeJS-url], [Python][Python-url], and [Poetry][Poetry-url] are installed on your system.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### 🎨 Building the Frontend <span id="native-build-frontend"></span>

From the project root, install the NPM dependencies and compile the frontend into the Django static directory:

```sh
# Install NPM dependencies
npm install

# Compile assets and templates for Django
npm run django -w @polimerbeton/frontend
```

> [!IMPORTANT]
> Detailed documentation on CLI commands, tasks, and pipeline structure is available in a separate repository:
>
> [**Wishbone-plus-Partners**](https://github.com/aLeeTheY/Wishbone-plus-Partners).
>
> For Hot Reload frontend work, run <code encoded-by-transform-md="true">npm run dev &#8209;w @polimerbeton/frontend</code> in a separate terminal.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### 🐍 Setting Up the Backend and Starting the Server <span id="native-build-backend"></span>

Move into <code encoded-by-transform-md="true">src/backend/</code>, install the Python dependencies, and activate the virtual environment:

```sh
cd src/backend/

# Install dependencies via Poetry and activate .venv
poetry install
poetry shell
```

Initialize the database and build the static files:

```sh
# Create database migrations (if needed)
python manage.py makemigrations

# Apply database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput
```

Create a Django admin account:

```sh
python manage.py createsuperuser
```

Start the local development server:

```sh
python manage.py runserver
```

By default, the test server is available at <code encoded-by-transform-md="true">http://localhost:8000/</code> (<code encoded-by-transform-md="true">http://127.0.0.1:8000/</code>).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- USAGE --->
<!-- ! --------- --->

## 💡 Usage <span id="usage"></span>

Once you've completed the [**Quick Start**](#quick-start) steps, the project will be available at your domain name (or at <code encoded-by-transform-md="true">http://localhost:8000/</code> if you're using the development configuration).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 🎛️ Admin Panel <span id="admin-panel"></span>

To access the admin interface, open <code encoded-by-transform-md="true">/admin/</code>:

```
https://your-domain.com/admin/
```

Log in with the superuser credentials. If no superuser has been created yet, follow the instructions in the [Creating a Superuser](#docker-create-superuser) section.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- DEVELOPMENT CHALLENGES --->
<!-- ! -------------------------- --->

## 🧠 Development Challenges <span id="development-challenges"></span>

- **Integrating the Gulp pipeline with Django:** Building an end-to-end frontend pipeline (SCSS, TypeScript, Nunjucks, asset optimization) that emits valid Django templates. Isolating Django control constructs via escape mechanisms (<code encoded-by-transform-md="true">{% raw %}</code>) and wiring the compiled assets seamlessly into <code encoded-by-transform-md="true">MainApp/static/</code> and <code encoded-by-transform-md="true">MainApp/templates/</code>.
- **Progressive WebGL initialization and LCP optimization:** Splitting the UI lifecycle into critical and heavy phases. Base UI boots on <code encoded-by-transform-md="true">DOMContentLoaded</code>; the Three.js scene is lazily loaded via dynamic imports (<code encoded-by-transform-md="true">import()</code>) with adaptive delays after <code encoded-by-transform-md="true">window.load</code> (2500 ms on Mobile to preserve LCP, 1000 ms on Desktop), and modules are prefetched in the background via <code encoded-by-transform-md="true">requestIdleCallback</code>. Lightweight 2D-sprite placeholders are shown until the Canvas is mounted.
- **Container orchestration and network isolation:** Designing resilient communication between isolated services (Django, PostgreSQL, Nginx-proxy, ACME Companion) on a single Docker network, with proper volume allocation for certificates and static files.
- **Selective CI/CD deployment:** Setting up a GitHub Actions pipeline for seamless updates to <code encoded-by-transform-md="true">main</code> that rebuild _only_ the Django container, leaving the database and reverse proxy untouched.
- **SEO and performance (Google Lighthouse):** A deep audit and optimization pass on HTML structure, critical CSS, and assets. Result: **Accessibility / Best Practices / SEO — 100/100** on both platforms, **Performance — 97 (Desktop) and 83 (Mobile)**.
- **Flexible mail delivery:** A notification module with two independently configurable channels — standard **SMTP** and the **Mailjet HTTP API**. Each channel is toggled separately via environment variables at build time: they can be used on their own, in parallel, or both disabled. The Mailjet channel (over HTTPS) solves the problem of VPS hosts with blocked SMTP ports (25 / 465 / 587).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- KEY SKILLS --->
<!-- ! -------------- --->

## 📈 Key Skills <span id="key-skills"></span>

- **UI/UX design and responsive layout:** Designing component-based layouts in **Figma**, building a scalable CSS architecture following the **BEM** methodology, and creating responsive interfaces on **Bootstrap** with dark theme support.
- **Full-stack development:** Building server-side logic in **Django**, integrating with **PostgreSQL**, implementing sensitive-data encryption at the ORM-model level, and writing strictly typed client-side code in **TypeScript**.
- **3D modeling and WebGL (Blender & Three.js):** Modeling sphere geometry, applying UV textures, and exporting <code encoded-by-transform-md="true">.glb</code> files from **Blender**; asynchronously assembling a 3D scene in Three.js using dynamic imports (<code encoded-by-transform-md="true">import()</code>), <code encoded-by-transform-md="true">requestIdleCallback</code>, and adaptive timeouts to protect loading metrics (LCP/FCP).
- **Build automation (Gulp pipeline):** Building a comprehensive Gulp bundler from scratch to compile **Nunjucks** templates into Django templates, bundle TS with **Esbuild**, optimize raster/vector graphics (**Sharp**, **SVGO**), and generate <code encoded-by-transform-md="true">.avif</code>/<code encoded-by-transform-md="true">.webp</code> variants.
- **DevOps and containerization:** Designing multi-container environments in **Docker** and **Docker Compose** (<code encoded-by-transform-md="true">dev</code>, <code encoded-by-transform-md="true">staging</code>, <code encoded-by-transform-md="true">prod</code>), configuring isolated networks, mounting volumes, and supporting <code encoded-by-transform-md="true">SELinux</code>-compatible configs.
- **Reverse proxy and SSL:** Setting up **Nginx-proxy** for traffic routing and automating issuance/renewal of Let's Encrypt SSL certificates via **ACME Companion**.
- **CI/CD automation:** Configuring selective auto-deploy via **GitHub Actions** and **SSH** to update the Django container on a VPS without downtime for the database or reverse proxy.
- **Performance optimization (Lighthouse):** Implementing Critical CSS, preloading key resources (<code encoded-by-transform-md="true">fetchpriority</code>, <code encoded-by-transform-md="true">.woff2</code>), and optimizing assets. Metrics: **Accessibility / Best Practices / SEO — 100/100** on both platforms, **Performance — 97 (Desktop) and 83 (Mobile)**.
- **Code quality (QA & DX):** Setting up a unified target-browser configuration (**Browserslist**) for end-to-end CSS/JS validation, running pre-commit checks (**Husky**, **lint-staged**, **ESLint**, **Stylelint**, **Prettier**, **Commitlint**), and integrating **Playwright** for cross-browser layout QA.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- ROADMAP --->
<!-- ! ----------- --->

## 🗺️ Roadmap <span id="roadmap"></span>

- [x] Interface design and markup in **Figma:**
  - [x] Main pages (<code encoded-by-transform-md="true">index.html</code>, <code encoded-by-transform-md="true">privacy.html</code>)
  - [x] Server response pages (<code encoded-by-transform-md="true">404.html</code>, <code encoded-by-transform-md="true">500.html</code>)
  - [x] Form status pages (<code encoded-by-transform-md="true">success.html</code>, <code encoded-by-transform-md="true">fail.html</code>, <code encoded-by-transform-md="true">updated.html</code>, <code encoded-by-transform-md="true">limit&#8209;exceeded.html</code>)
  - [x] HTML email template for notifications
- [x] Responsive layout on **Bootstrap** (**BEM** methodology, dark theme support, CSS animations)
- [x] Dynamic UI components:
  - [x] Interactive 3D sphere scene on **Three.js** with lazy initialization
  - [x] Hover-triggered 3D effects on cards in the _Examples_ and _Legal_ sections (**Vanilla Tilt**)
- [x] Frontend build automation on **Gulp 5** (Nunjucks, Sass, TypeScript, asset optimization)
- [x] Code-quality infrastructure (Code Quality & DX):
  - [x] Automated commit checks via Git hooks (**Husky**, **lint-staged**, **commitlint**)
  - [x] Static analysis and code formatting (**ESLint**, **Stylelint** + **Browserslist**, **Prettier**, **EditorConfig**)
  - [x] Manual and automated cross-browser UI testing with **Playwright**
- [x] Integrating the markup into **Django** templates
- [x] **PostgreSQL** database architecture (customers and callback requests)
- [x] Admin panel (**django-admin**) customization for the current data models
- [x] Admin panel internationalization and localization
- [x] SEO: dynamic sitemap generation (**Django Sitemaps**) and search-engine files (<code encoded-by-transform-md="true">robots.txt</code>, <code encoded-by-transform-md="true">humans.txt</code>)
- [x] Form handling subsystem: client-side input mask (**Inputmask**), Django server-side validation, loading indicators (UI-states), and submission-status notifications
- [x] Form anti-spam mechanism: 3 submissions per hour with automatic counter reset
- [x] HTML email notification service over the **SMTP** protocol via Django templates
- [x] Alternative notification service via the **Mailjet** API
- [x] **Encryption and personal-data protection** mechanisms
- [x] User-consent management (**Cookie Consent**)
- [x] Third-party analytics (**Google Analytics + Yandex Metrica**) with cookie-policy compliance
- [x] Containerization and deployment with **Docker:**
  - [x] Environment configuration (<code encoded-by-transform-md="true">.env.dev</code>, <code encoded-by-transform-md="true">.env.staging</code>, <code encoded-by-transform-md="true">.env.prod</code>, with DB and Proxy-companion templates)
  - [x] **Dockerfile** and **Dockerfile.prod** configs for dev and prod builds
  - [x] Container orchestration (**Django**, **PostgreSQL**, **Nginx-proxy**, **ACME Companion**) via <code encoded-by-transform-md="true">docker&#8209;compose</code> (supporting <code encoded-by-transform-md="true">dev</code>, <code encoded-by-transform-md="true">staging</code>, <code encoded-by-transform-md="true">prod</code>, and **SELinux** modes)
  - [x] **Nginx** reverse-proxy configuration and automated SSL certificates via **ACME Companion** (Let's Encrypt)
- [x] **CI/CD** automation via **GitHub Actions:**
  - [x] Automatic build and deploy on <code encoded-by-transform-md="true">main</code> pushes (disabled by default, see above)

The full list of planned features and known issues is available in the [Issues][issues-url] section.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- LICENSE --->
<!-- ! ----------- --->

## 📄 License <span id="license"></span>

Copyright © 2024–2026 [aLeeTheY](https://github.com/aLeeTheY)

The project is distributed under the [**PolyForm Noncommercial License 1.0.0**](https://polyformproject.org/licenses/noncommercial/1.0.0) and is open for personal use, learning, research, and non-commercial purposes. Commercial use, resale, or use in commercial products is prohibited.

The full terms and restrictions are described in the [<code encoded-by-transform-md="true">LICENSE</code>][license-url] file.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- CONTACT --->
<!-- ! ----------- --->

## 🤝 Contact <span id="contact"></span>

<!-- [![GitHub][GitHub-logo]](https://github.com/aLeeTheY)
[![Telegram][Telegram-logo]](https://t.me/aLeeTheY)
[![Gmail][Gmail-logo]](mailto:aleethey@gmail.com) -->

GitHub: [aLeeTheY](https://github.com/aLeeTheY)
<br/>
Telegram: [@aLeeTheY](https://t.me/aLeeTheY)
<br/>
Email: [aleethey@gmail.com](mailto:aleethey@gmail.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- ACKNOWLEDGMENTS --->
<!-- ! ------------------- --->

## 💖 Acknowledgments <span id="acknowledgments"></span>

[aLeeTheY](https://github.com/aLeeTheY) thanks the developers and communities behind the following projects:

- [Blender](https://www.blender.org/)
- [Figma](https://www.figma.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Python](https://www.python.org/)
- [Poetry](https://python-poetry.org/)
- [Django](https://www.djangoproject.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/)
- [Sass](https://sass-lang.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Node.js](https://nodejs.org/)
- [Npm](https://www.npmjs.com/)
- [Gulp](https://gulpjs.com/)
- [Esbuild](https://esbuild.github.io/)
- [Sharp](https://sharp.pixelplumbing.com/)
- [SVGO](https://github.com/svg/svgo)
- [PostCSS](https://postcss.org/)
- [PostHTML](https://github.com/posthtml/posthtml)
- [EditorConfig](https://editorconfig.org/)
- [Browserslist](https://github.com/browserslist/browserslist)
- [ESLint](https://eslint.org/)
- [Stylelint](https://stylelint.io/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Commitlint](https://commitlint.js.org/)
- [Playwright](https://playwright.dev/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx](https://nginx.org/)
- [nginx-proxy](https://github.com/nginx-proxy/nginx-proxy)
- [docker-gen](https://github.com/nginx-proxy/docker-gen)
- [ACME Companion](https://github.com/nginx-proxy/acme-companion)
- [Let's Encrypt](https://letsencrypt.org/)
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)
- [GitHub Actions](https://github.com/features/actions)
- [PolyForm Project](https://polyformproject.org/)
- [Mailjet](https://www.mailjet.com/)
- [Chocolatey](https://chocolatey.org/)
- [FFmpeg](https://www.ffmpeg.org/)
- [gifsicle](https://github.com/kohler/gifsicle)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)

Without these tools, this project would have been **impossible** to build.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ! --- MARKDOWN LINKS --->
<!-- ! ------------------ --->

<!-- * shields -->

[contributors-shield]: https://img.shields.io/github/contributors/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[contributors-url]: https://github.com/aLeeTheY/PolimerBeton/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[forks-url]: https://github.com/aLeeTheY/PolimerBeton/network/members
[stars-shield]: https://img.shields.io/github/stars/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[stars-url]: https://github.com/aLeeTheY/PolimerBeton/stargazers
[issues-shield]: https://img.shields.io/github/issues/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[issues-url]: https://github.com/aLeeTheY/PolimerBeton/issues
[last-commit-shield]: https://img.shields.io/github/last-commit/aLeeTheY/PolimerBeton?style=for-the-badge
[repo-size-shield]: https://img.shields.io/github/repo-size/aLeeTheY/PolimerBeton?style=for-the-badge

<!-- [license-shield]: https://img.shields.io/github/license/aLeeTheY/PolimerBeton.svg?style=for-the-badge -->

[license-shield]: https://img.shields.io/badge/License-PolyForm_Noncommercial-critical?style=for-the-badge
[license-url]: https://github.com/aLeeTheY/PolimerBeton/blob/main/LICENSE

<!-- * techologies --->

[HTML-logo]: https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white&style=for-the-badge
[HTML-url]: https://html.spec.whatwg.org/
[Nunjucks-logo]: https://custom-icon-badges.demolab.com/badge/Nunjucks-3d8137?logo=nunjucks&style=for-the-badge
[Nunjucks-url]: https://mozilla.github.io/nunjucks/
[Sass-logo]: https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff&style=for-the-badge
[Sass-url]: https://sass-lang.com/
[Bootstrap-logo]: https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=fff&style=for-the-badge
[Bootstrap-url]: https://getbootstrap.com/
[TypeScript-logo]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge
[TypeScript-url]: https://www.typescriptlang.org/
[Python-logo]: https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff&style=for-the-badge
[Python-url]: https://www.python.org/
[Django-logo]: https://img.shields.io/badge/Django-%23092E20.svg?logo=django&logoColor=white&style=for-the-badge
[Django-url]: https://www.djangoproject.com/
[Poetry-logo]: https://custom-icon-badges.demolab.com/badge/Poetry-1F293A?logo=poetry&style=for-the-badge
[Poetry-url]: https://python-poetry.org/
[Docker-logo]: https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=for-the-badge
[Docker-url]: https://www.docker.com/
[Docker-Compose-logo]: https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker&logoColor=white
[Docker-Compose-url]: https://docs.docker.com/compose/
[Postgres-logo]: https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white&style=for-the-badge
[Postgres-url]: https://www.postgresql.org/
[Git-logo]: https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff&style=for-the-badge
[Git-url]: https://git-scm.com/
[Nginx-logo]: https://img.shields.io/badge/nginx-009639?logo=nginx&logoColor=fff&style=for-the-badge
[Nginx-url]: https://nginx.org/
[GitHubActions-logo]: https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white&style=for-the-badge
[GitHubActions-url]: https://github.com/features/actions
[NodeJS-logo]: https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white&style=for-the-badge
[NodeJS-url]: https://nodejs.org/
[Npm-logo]: https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff&style=for-the-badge
[Npm-url]: https://www.npmjs.com/
[Gulp-logo]: https://img.shields.io/badge/GULP-%23CF4647.svg?style=for-the-badge&logo=gulp&logoColor=white
[Gulp-url]: https://gulpjs.com/
[Browserslist-logo]: https://custom-icon-badges.demolab.com/badge/browserslist-1d1d1d?logo=browserslist&style=for-the-badge
[Browserslist-url]: https://github.com/browserslist/browserslist
[ThreeJS-logo]: https://img.shields.io/badge/threedotjs-%23000000.svg?style=for-the-badge&logo=threedotjs&logoColor=white
[ThreeJS-url]: https://threejs.org/

<!-- * linters & code format --->

[ESLint-logo]: https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white
[ESLint-url]: https://eslint.org/
[Stylelint-logo]: https://custom-icon-badges.demolab.com/badge/Stylelint-1b1b1d?logo=stylelint&style=for-the-badge
[Stylelint-url]: https://stylelint.io/
[Prettier-logo]: https://img.shields.io/badge/prettier-%23192a32?style=for-the-badge&logo=prettier&logoColor=dc524a
[Prettier-url]: https://prettier.io/
[EditorConfig-logo]: https://custom-icon-badges.demolab.com/badge/EditorConfig-010101?logo=editorconfig&style=for-the-badge
[EditorConfig-url]: https://editorconfig.org/
[Commitlint-logo]: https://custom-icon-badges.demolab.com/badge/Commitlint-1b1b1f?logo=commitlint&style=for-the-badge
[Commitlint-url]: https://commitlint.js.org/
[lint-staged-logo]: https://custom-icon-badges.demolab.com/badge/Lint--Staged-ffffff?logo=lintstaged&style=for-the-badge
[lint-staged-url]: https://github.com/lint-staged/lint-staged
[Husky-logo]: https://custom-icon-badges.demolab.com/badge/Husky-607d8b?logo=husky-vscode&style=for-the-badge
[Husky-url]: https://typicode.github.io/husky/
[Playwright-logo]: https://custom-icon-badges.demolab.com/badge/Playwright-242526?logo=playwright&style=for-the-badge
[Playwright-url]: https://playwright.dev/

<!-- * ide & workspace --->

[VSCode-logo]: https://custom-icon-badges.demolab.com/badge/VSCODE-0d1014?logo=vscode&logoColor=white&style=for-the-badge
[VSCode-url]: https://code.visualstudio.com/
[Figma-logo]: https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white
[Figma-url]: https://www.figma.com/
[Blender-logo]: https://img.shields.io/badge/blender-%23F5792A.svg?style=for-the-badge&logo=blender&logoColor=white
[Blender-url]: https://www.blender.org/

<!-- * browsers --->

[Opera-logo]: https://img.shields.io/badge/Opera-FF1B2D?logo=Opera&logoColor=white&style=for-the-badge
[Opera-url]: https://www.opera.com/
[GoogleChrome-logo]: https://img.shields.io/badge/Google%20Chrome-4285F4?logo=GoogleChrome&logoColor=white&style=for-the-badge
[GoogleChrome-url]: https://www.google.com/chrome/
[MicrosoftEdge-logo]: https://custom-icon-badges.demolab.com/badge/Microsoft%20Edge-2771D8?logo=edge-white&logoColor=white&style=for-the-badge
[MicrosoftEdge-url]: https://www.microsoft.com/en-us/edge/
[Firefox-logo]: https://img.shields.io/badge/Firefox-FF7139?logo=firefoxbrowser&logoColor=white&style=for-the-badge
[Firefox-url]: https://www.firefox.com/
[Yandex-logo]: https://custom-icon-badges.demolab.com/badge/Yandex%20Browser-F03911?logo=yandex-browser&style=for-the-badge
[Yandex-url]: https://browser.yandex.com/

<!-- * other --->

<!-- [Mailjet-url]: https://www.mailjet.com/
[Vanilla-Tilt-url]: https://github.com/micku7zu/vanilla-tilt.js/ -->

<!-- * contacts --->

<!-- [GitHub-logo]: https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white
[Telegram-logo]: https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white
[Gmail-logo]: https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white -->

<!-- ! --- MARKDOWN ASSETS --->
<!-- ! ------------------- --->

[01-website-walkthrough]: docs/assets/01__website_walkthrough.gif
[02-pages-walkthrough]: docs/assets/02__pages_walkthrough.gif
[03-threejs-interactivity]: docs/assets/03__threejs_interactivity.gif
[04-vanilla-tilt-effects]: docs/assets/04__vanilla_tilt_effects.gif
[05-fullstack-workflow]: docs/assets/05__fullstack_workflow.gif
