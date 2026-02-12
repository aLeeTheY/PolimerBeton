<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">PolimerBeton</h1>

  <p align="center">
    Multi-page responsive promotional website with a contact form and client database.
    <br />
    <br />
    <!-- <a href="ZAPOLNIT">Дизайн (макет)</a>
    &middot; -->
    <a href="https://polimerbeton-vrn.ru/"">Live Demo</a>
    &middot;
    <a href="https://github.com/aLeeTheY/PolimerBeton/issues/new?labels=bug&template=bug-report---.md">Report a bug</a>
  </p>

[![Русский](https://img.shields.io/badge/Русский-blue)](README.md)
[![English](https://img.shields.io/badge/English-blue)](README.ENG.md)

</div>

<!-- TABLE OF CONTENTS -->
<br />
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#preview">Preview</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#supported-browsers">Supported Browsers</a></li>
        <li><a href="#development-challenges">Development Challenges</a></li>
        <li><a href="#key-skills">Key Skills</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li>
          <a href="#build-and-deployment">Build and Deployment</a>
          <ul>
            <li><a href="#creating-a-superuser">Creating a Superuser</a></li>
            <li><a href="#troubleshooting-optional">Troubleshooting (optional)</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#admin-panel">Admin Panel</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About the Project

The main goal of this project is to create a fast promotional landing page with a contact form. The website allows clients to submit requests, while the owner instantly receives notifications about new orders.

### Key Features

**Design and Interface**

- **Exclusive Design**: Fully custom-designed pages created in **Figma**.
- **Responsiveness**: Interface built with **Bootstrap** and **Bootstrap Icons**, fully optimized for mobile devices.
- **Dark Mode**: Dark theme support (automatic switching + manual toggle).
- **UX/UI Enhancements**: Smooth animations to enhance visual experience.

**Security and Data Protection**

- **Encryption**: Field-level encryption of client data in the database.
- **Environment Protection**: Strict configuration separation using `.env` files.

**Deployment and Infrastructure**

- **Containerization**: Full isolation with **Docker**, allowing the project to be deployed within 15 minutes.
- **CI/CD Workflow**: Automated project updates via **GitHub Actions** and **SSH**.

**Performance and Scalability**

- **Static Optimization**: Use of `.webp` format and adaptive image loading depending on screen resolution.
- **Backend**: **Django + Nginx** stack for stable and high-performance server operation.
- **Business Logic**: Automatic order notifications via **SMTP** (optionally — [**Mailjet**][Mailjet-url]).

### Preview

Below you can see a **website preview** (_click the image to open the live demo_):

<div align="center">

[![Website Preview - PolimerBeton][website-preview]](https://polimerbeton-vrn.ru/)

</div>

### Built With

The project was built using the following tools and technologies:

- **FRONTEND**:
  - [![HTML][HTML-logo]][HTML-url]
  - [![Sass][Sass-logo]][Sass-url]
  - [![TypeScript][TypeScript-logo]][TypeScript-url]
  - [![Bootstrap][Bootstrap-logo]][Bootstrap-url]

  - **BUILD TOOLS**:
    - [![Node.js][NodeJS-logo]][NodeJS-url]
    - [![Npm][Npm-logo]][Npm-url]

- **BACKEND**:
  - [![Python][Python-logo]][Python-url]
  - [![Django][Django-logo]][Django-url]

  - **BUILD TOOLS**:
    - [![Poetry][Poetry-logo]][Poetry-url]

- **DATABASE**:
  - [![Postgres][Postgres-logo]][Postgres-url]

- **VERSION CONTROL SYSTEM**:
  - [![Git][Git-logo]][Git-url]

- **DEPLOYMENT**:
  - [![Docker][Docker-logo]][Docker-url]

- **WEB SERVER**:
  - [![Nginx][Nginx-logo]][Nginx-url]

- **CI/CD**:
  - [![GitHub Actions][GitHubActions-logo]][GitHubActions-url]

### Supported Browsers

The project has been tested for correct rendering and script stability in the latest stable versions of the following browsers:

- [![Google Chrome][GoogleChrome-logo]][GoogleChrome-url]
- [![Microsoft Edge][MicrosoftEdge-logo]][MicrosoftEdge-url]
- [![Yandex][Yandex-logo]][Yandex-url]
- [![Firefox][Firefox-logo]][Firefox-url]
- [![Opera][Opera-logo]][Opera-url]

> [!IMPORTANT]
> This information applies to version **[2.0.4](https://github.com/aLeeTheY/PolimerBeton/releases/tag/2.0.4)**. At the time of verification, the project was rendered correctly in the latest stable versions of all [supported browsers](#supported-browsers).
>
> **Last verification date: February 13, 2026**

### Development Challenges

- **Microservice Orchestration**: Designing fault-tolerant interaction between Django, PostgreSQL, Nginx, and Let's Encrypt containers within a unified isolated Docker network.
- **Django Deployment Automation**: A CI/CD script in GitHub Actions updates the `main` branch and rebuilds the Django container without affecting other services (_automatic execution can be enabled if needed_).
- **SEO and Accessibility**: Conducting audits and optimizing the HTML structure to achieve 100/100 scores in Google Lighthouse for Accessibility and SEO.
- **Flexible Notification Delivery**: Primary channel — SMTP; if SMTP ports are blocked, notifications can be sent via the Mailjet API over HTTPS.

### Key Skills

- **UI/UX Design**: Designing user interfaces in Figma, preparing layouts for development, creating adaptive graphical assets.
- **Fullstack Development**: Designing relational databases in PostgreSQL, implementing backend logic in Django, building a strictly typed frontend using Sass, Bootstrap, and TypeScript.
- **DevOps & Infrastructure**: Containerizing applications with Docker, managing environment configurations (development/staging/production), configuring container networking.
- **System Administration**: Deploying applications on Linux servers, configuring Nginx or Apache as a reverse proxy, implementing SSL certificates via Let's Encrypt for secure communication.
- **Performance Optimization**: Minifying HTML, CSS, and JS using `django-htmlmin` and `django-compressor`, implementing modern image formats to reduce loading and rendering time (LCP/FCP).
- **CI/CD**: Setting up automated deployment with GitHub Actions, managing remote servers via SSH.
- **Documentation and GitHub**: Writing documentation and README.md files using Markdown, maintaining version control with Git.
- **Dependency Management & Build Process**: Using [Npm][Npm-url] and [Poetry][Poetry-url] to install, update, and lock dependency versions via lock files, ensuring reproducible development environments.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

_Follow the instructions below to properly deploy the project._

### Prerequisites

Install [Docker][Docker-url] and the [Docker Compose][Docker-Compose-url] plugin. Then download this repository as a ZIP archive or clone it via [Git][Git-url]:

```sh
git clone https://github.com/aLeeTheY/PolimerBeton
```

Navigate to the project directory. Open the `env/` folder and create configuration files based on the corresponding `.template` files. Three environments are supported: **development**, **staging** and **production**.
<br/>
For example, for the **production** environment:

```sh
cp .env.prod.template .env.prod
cp .env.prod.db.template .env.prod.db
cp .env.prod.proxy-companion.template .env.prod.proxy-companion
```

After that, in **each** of the created files, replace all placeholder values in the format `<...>` with your own values.
<br/>
For example, for the `.env.prod.db` file:

<div align="center">

| Original Value                               | Example Value                                  | Requirement  |
| :------------------------------------------- | :--------------------------------------------- | :----------: |
| `POSTGRES_USER=<YOUR_DATABASE_USER>`         | `POSTGRES_USER=db_username_for_dummy_guys`     | **Required** |
| `POSTGRES_PASSWORD=<YOUR_DATABASE_PASSWORD>` | `POSTGRES_PASSWORD=db_password_for_dummy_guys` | **Required** |
| `POSTGRES_DB=polimerbeton_db_prod`           | `POSTGRES_DB=polimerbeton_db_prod`             |   Optional   |

</div>

### Build and Deployment

Select the appropriate configuration file (`docker-compose.*.yml`) and run the build followed by container startup:

```sh
docker compose -f docker-compose.prod.yml up -d --build
```

#### Creating a Superuser

After the containers have successfully started, create a **superuser** for the Django admin panel:

```sh
docker exec -it polimerbeton-web python manage.py createsuperuser
```

Follow the console instructions. After completing these steps, the project is considered successfully deployed.

#### Troubleshooting (optional)

_If the build fails due to insufficient RAM or disk space, it is recommended **to increase** the available resources. If this is not possible, you can try building step by step._

> [!CAUTION]
> Execute the commands below at your own risk!<br />
> If you are unsure about your actions, consult a system administrator.

Clean up old images and builder cache:

```sh
docker image prune
docker builder prune
```

Build the main **web** container:

```sh
docker compose -f docker-compose.prod.yml build web
```

Clean up again:

```sh
docker image prune
docker builder prune
```

Build the remaining containers and start the application:

```sh
docker compose -f docker-compose.prod.yml up -d
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

After completing the [Getting Started](#getting-started) stage, the project will be available via your domain name (or at `localhost` if using the development configuration).

### Admin Panel

To access the administrative interface, navigate to the `admin/` page.
<br/>
For example:

```
https://your-domain/admin/
```

Log in using your superuser credentials. If a superuser has not yet been created, run the [corresponding command](#creating-a-superuser) inside the running container.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] UI design in **Figma**:
  - [x] Home page (`index.html`)
  - [x] Privacy Policy (`privacy.html`)
  - [x] Success page (`success.html`)
  - [x] Error page (`error.html`)
- [x] Responsive layout using **Bootstrap** with **Dark Mode** support
- [x] Integration with **Django** templates
- [x] **PostgreSQL** database architecture design (clients and orders)
- [x] Configuration of `django-admin` interaction with data models
- [x] Form handling and client registration system
- [x] **SMTP** notification service implementation
- [x] Alternative notification service via **Mailjet** API
- [x] Implementation of **personal data encryption and protection** mechanisms
- [x] **Docker** containerization and deployment:
  - [x] Environment configuration (`.env.dev`, `.env.staging`, `.env.prod`)
  - [x] **Docker image optimization** (`Dockerfile` and `Dockerfile.prod`)
  - [x] Microservice orchestration (**Django**, **PostgreSQL**, **Let's Encrypt**, **Nginx**) via `docker-compose`
- [x] **CI/CD** automation via **GitHub Actions**:
  - [x] Automatic build and deployment on `main` branch updates
- [ ] Internationalization (i18n):
  - [ ] English language support

The full list of planned features and known issues is available in the [Issues][issues-url] section.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Copyright © 2025 [aLeeTheY](https://github.com/aLeeTheY)
<br/>
Distributed under the [MIT][license-url] License. See `LICENSE` file for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

GitHub: [aLeeTheY](https://github.com/aLeeTheY)
<br/>
Email: [aleethey@gmail.com](mailto:aleethey@gmail.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

[aLeeTheY](https://github.com/aLeeTheY) expresses gratitude to the developers and communities of the following projects:

- [Figma](https://www.figma.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Django](https://www.djangoproject.com/)
- [Python](https://www.python.org/)
- [Poetry](https://python-poetry.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Sass](https://sass-lang.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker](https://www.docker.com/)
- [Nginx](https://nginx.org/)
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)
- [GitHub Actions](https://github.com/features/actions)
- [Mailjet](https://www.mailjet.com/)
- [Chocolatey](https://chocolatey.org/)

Without these tools, the development of this project would have been **impossible**.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[contributors-url]: https://github.com/aLeeTheY/PolimerBeton/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[forks-url]: https://github.com/aLeeTheY/PolimerBeton/network/members
[stars-shield]: https://img.shields.io/github/stars/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[stars-url]: https://github.com/aLeeTheY/PolimerBeton/stargazers
[issues-shield]: https://img.shields.io/github/issues/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[issues-url]: https://github.com/aLeeTheY/PolimerBeton/issues
[license-shield]: https://img.shields.io/github/license/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[license-url]: https://github.com/aLeeTheY/PolimerBeton/blob/main/LICENSE
[HTML-logo]: https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white&style=for-the-badge
[HTML-url]: https://html.spec.whatwg.org/
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
[Opera-logo]: https://img.shields.io/badge/Opera-FF1B2D?logo=Opera&logoColor=white&style=for-the-badge
[Opera-url]: https://www.opera.com/
[GoogleChrome-logo]: https://img.shields.io/badge/Google%20Chrome-4285F4?logo=GoogleChrome&logoColor=white&style=for-the-badge
[GoogleChrome-url]: https://www.google.com/chrome/
[MicrosoftEdge-logo]: https://custom-icon-badges.demolab.com/badge/Microsoft%20Edge-2771D8?logo=edge-white&logoColor=white&style=for-the-badge
[MicrosoftEdge-url]: https://www.microsoft.com/en-us/edge/
[Firefox-logo]: https://img.shields.io/badge/Firefox-FF7139?logo=firefoxbrowser&logoColor=white&style=for-the-badge
[Firefox-url]: https://www.firefox.com/

<!-- [Yandex-logo]: https://img.shields.io/badge/Yandex_Browser-D1300D?style=for-the-badge -->

[Yandex-logo]: https://custom-icon-badges.demolab.com/badge/Yandex%20Browser-F03911?logo=yandex-browser&style=for-the-badge
[Yandex-url]: https://browser.yandex.com/

<!-- [VCS-url]: https://en.wikipedia.org/wiki/Version_control -->

[Mailjet-url]: https://www.mailjet.com/
[website-preview]: project/preview/website_preview.gif
