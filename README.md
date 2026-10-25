# La Buhardilla — Headless Editorial Bookstore

> Tienda editorial de libros raros, primeras ediciones y tesoros de colección. Desarrollada con **Shopify Hydrogen**, **React Router**, **Tailwind CSS** y desplegada en la infraestructura global de edge computing **Shopify Oxygen**.

[![CI](https://github.com/Its-JrDev/la-buhardilla/actions/workflows/ci.yml/badge.svg)](https://github.com/Its-JrDev/la-buhardilla/actions/workflows/ci.yml)
[![Shopify Oxygen](https://img.shields.io/badge/Deployed%20on-Shopify%20Oxygen-95BF47?logo=shopify&logoColor=white)](https://hydrogen-test-store-56170d706e8dbf0e0644.o2.myshopify.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%200%20Errors-3178C6?logo=typescript&logoColor=white)](#)
[![Design System](https://img.shields.io/badge/Design%20System-Editorial%20Buhardilla-ea580c)](#)

---

## 🌟 Características Destacadas

- **Diseño Editorial Inmersivo**: Sistema de diseño a medida inspirado en tipografías serif clásicas (*Merriweather*), lectura fluida (*Nunito*) y paleta evocadora (*Papel Hueso `#fdfbf7`*, *Calabaza `#ea580c`*, *Medianoche `#0f172a`* y *Púrpura Hechicera `#7e22ce`*).
- **Navegación Prioritaria Dinámica (*Greedy Nav*)**: Barra de navegación que mide en tiempo real mediante `ResizeObserver` los ítems que caben sin salto de línea, desplegando dinámicamente un menú *"Más ▾"* al final.
- **Búsqueda Predictiva en Tiempo Real**: Autocompletado reactivo sobre la Storefront API con resaltado de términos, accesibilidad por teclado y control de estados vacíos.
- **Vista Previa Rápida (*QuickView Modal*)**: Ficha modal desacoplada con buy box completa, control de variantes y adición asíncrona fluida que transiciona al drawer del carrito sin solapamientos.
- **Wishlist Nativa Modular (*Guardados*)**: Sistema de listas de deseos con almacenamiento reactivo (`localStorage`), selector de colecciones temáticas y generación de enlaces públicos compartibles (`/wishlist/:token`).
- **Carrito Optimista y Checkout Extensible**: Carrito asíncrono con `useOptimisticCart`, notas de aquelarre, controles de cantidad clampleados a mínimo 1 y personalización de marca aplicada al Checkout de Shopify.
- **Club de Medianoche**: Sección de comunidad literaria con fichas de lectura mensual y reservas presenciales con validación estricta de formularios.
- **Rutas de Cuenta Blindadas**: Protección y redirección `302` en subrutas de cuenta hacia el formulario editorial de acceso.

---

## 🏗️ Arquitectura Técnica

```
├── app/
│   ├── components/            # Componentes modulares de interfaz
│   │   ├── brand/             # Identidad, logos y sellos editoriales
│   │   ├── wishlist/          # Vistas modulares de listas de deseos
│   │   ├── Bookcase.tsx       # Estanterías y retículas de libros
│   │   ├── BuyBox.tsx         # Bloque de compra reactivo y variantes
│   │   ├── Header.tsx         # Cabecera con Greedy Navigation
│   │   └── QuickView.tsx      # Modal de inspección rápida
│   ├── graphql/               # Consultas Storefront y Customer Account API
│   ├── lib/                   # Utilidades de catálogo, club, ayuda y filtros
│   ├── routes/                # Enrutador basado en convenciones (React Router v7)
│   └── styles/                # Tailwind CSS v4 y tokens de diseño
├── .github/
│   └── workflows/
│       ├── ci.yml             # Typecheck, validación y build en PRs
│       └── deploy.yml         # Despliegue continuo a Shopify Oxygen
└── scripts/                   # Suites de pruebas CDP y comprobación "a prueba de tontos"
```

---

## 🚀 Puesta en Marcha Local

### Requisitos Previos

- **Node.js**: v20.x o superior
- **npm**: v10.x o superior
- **Shopify CLI**: Incluido en dependencias (`npx shopify`)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Its-JrDev/la-buhardilla.git
cd la-buhardilla

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (.env)
cp .env.example .env

# 4. Iniciar servidor de desarrollo en Oxygen Worker
npm run dev
```

---

## 🧪 Pruebas y Control de Calidad

```bash
# Comprobación de tipos TypeScript
npm run typecheck

# Compilación de producción
npm run build

# Suite de verificación de 21 flujos integrales (Chromium CDP)
npm run test:flows

# Suite de blindaje ante fallos y casos límite (Foolproof)
npm run test:foolproof
```

---

## 📦 CI / CD

El repositorio cuenta con integración y despliegue continuo a través de **GitHub Actions**:

- **CI (`.github/workflows/ci.yml`)**: Valida tipado estricto y compilación en cada `push` y `pull_request` a `main`.
- **Deploy (`.github/workflows/deploy.yml`)**: Despliega automáticamente a **Shopify Oxygen** en cada cambio promovido a la rama principal.

---

## ✒️ Autor

Desarrollado por **Jose Romero ([@Its-JrDev](https://github.com/Its-JrDev))** como parte de su catálogo de proyectos de comercio electrónico de alto rendimiento.
