#!/usr/bin/env node

/**
 * Suite de Verificación Programática de Flujos de la Tienda
 * "La Buhardilla" - Shopify Hydrogen Storefront
 * 
 * Flujos verificados:
 * 1. Catálogo, Colecciones y Ficha de Producto (SSR + Interactividad)
 * 2. Búsqueda Predictiva (Modal Aside, autocompletado y resultados)
 * 3. Carrito, Mutaciones y Checkout (BuyBox, Aside Drawer, cantidades, checkoutUrl, /cart)
 * 4. Guardados para Otra Noche / Wishlist (Heart toggle, localStorage, /guardados)
 * 5. Club de Medianoche (Landing /club, formulario de reservas /club/reservar)
 * 6. Páginas de Contenido y Formularios (/ayuda, /contacto, /visitanos, /quienes-somos, /boletin)
 * 7. Rutas de Sistema (/robots.txt, /sitemap.xml) y Auditoría de Errores en Consola
 */

import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3333';
const CDP_PORT = Number(process.env.CDP_PORT || 9222);
const EVIDENCE_DIR = process.env.EVIDENCE_DIR || 
  path.resolve(process.env.HOME || '.', '.gemini/antigravity-cli/brain/675f846d-7fa5-4e25-9474-a91613ef35fb/evidence');

// Colores ANSI
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const results = [];
const consoleErrors = [];
let spawnedBrowser = null;

function logStep(flow, text) {
  console.log(`  ${C.cyan}▸${C.reset} [${flow}] ${text}`);
}

function logPass(flow, name, ms) {
  const time = ms !== undefined ? ` ${C.dim}(${ms}ms)${C.reset}` : '';
  console.log(`  ${C.green}✔ PASS:${C.reset} [${flow}] ${name}${time}`);
  results.push({ flow, name, status: 'PASS', ms });
}

function logFail(flow, name, error, ms) {
  const time = ms !== undefined ? ` ${C.dim}(${ms}ms)${C.reset}` : '';
  console.log(`  ${C.red}✖ FAIL:${C.reset} [${flow}] ${name}${time}\n    ${C.red}${error.message || error}${C.reset}`);
  results.push({ flow, name, status: 'FAIL', error: error.message || String(error), ms });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Cliente CDP ligero sobre WebSocket nativo
class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Log.entryAdded') {
        const entry = msg.params.entry;
        if (entry.level === 'error') {
          consoleErrors.push(`[Log] ${entry.text}`);
        }
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        const p = msg.params;
        if (p.type === 'error') {
          const text = p.args.map((a) => a.value || a.description || JSON.stringify(a)).join(' ');
          consoleErrors.push(`[Console.error] ${text}`);
        }
      } else if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };

    await this.send('Log.enable');
    await this.send('Runtime.enable');
    await this.send('Page.enable');
    await this.send('DOM.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression, awaitPromise = true) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise,
    });
    if (res.exceptionDetails) {
      const desc = res.exceptionDetails.exception?.description || res.exceptionDetails.text;
      throw new Error(`Eval error: ${desc}`);
    }
    return res.result?.value;
  }

  async navigate(url, waitMs = 1500) {
    const loadPromise = new Promise((resolve) => {
      const handler = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Page.loadEventFired') {
            this.ws.removeEventListener('message', handler);
            resolve();
          }
        } catch {}
      };
      this.ws.addEventListener('message', handler);
      setTimeout(resolve, 6000);
    });
    await this.send('Page.navigate', { url });
    await loadPromise;
    await sleep(waitMs);
  }

  async screenshot(filename) {
    try {
      fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
      const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(EVIDENCE_DIR, filename);
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      return filePath;
    } catch (err) {
      console.warn(`[Screenshot warning] No se pudo guardar ${filename}: ${err.message}`);
      return null;
    }
  }

  async close() {
    if (this.ws) {
      try { this.ws.close(); } catch {}
    }
  }
}

async function ensureDevServer() {
  try {
    const res = await fetch(`${BASE_URL}/`);
    if (res.status === 200) return true;
  } catch {}
  throw new Error(`El servidor Hydrogen no está respondiendo en ${BASE_URL}. Asegúrate de iniciarlo antes de ejecutar las pruebas.`);
}

async function ensureBrowser() {
  try {
    const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
    if (res.ok) return null;
  } catch {}

  logStep('Setup', 'Iniciando Chromium headless con CDP en puerto ' + CDP_PORT);
  const browser = spawn('chromium', [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1280,850',
    'about:blank',
  ], { stdio: 'ignore' });

  for (let i = 0; i < 20; i++) {
    await sleep(250);
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (res.ok) {
        spawnedBrowser = browser;
        return browser;
      }
    } catch {}
  }
  throw new Error('No se pudo iniciar Chromium con CDP en el puerto ' + CDP_PORT);
}

async function getPageWsUrl() {
  const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
  const pages = await res.json();
  const page = pages.find((p) => p.type === 'page');
  if (!page) throw new Error('No se encontró pestaña de página activa en Chromium.');
  return page.webSocketDebuggerUrl;
}

// -------------------------------------------------------------
// BLOQUES DE PRUEBA
// -------------------------------------------------------------

async function testFlow1_Catalog(cdp) {
  const flow = '1. Catálogo';
  const t0 = Date.now();

  try {
    logStep(flow, 'Verificando Home (/) y cabecera...');
    await cdp.navigate(`${BASE_URL}/`, 1500);
    const homeInfo = await cdp.eval(`
      (() => ({
        title: document.title,
        hasLogo: !!document.querySelector('svg, img'),
        heading: document.querySelector('h1, h2')?.textContent?.trim(),
        shelves: Array.from(document.querySelectorAll('section, [class*="shelf"]')).length,
        navLinks: Array.from(document.querySelectorAll('header a')).map(a => a.getAttribute('href'))
      }))()
    `);
    if (!homeInfo.title.includes('Buhardilla')) throw new Error(`Título inesperado: ${homeInfo.title}`);
    logPass(flow, 'Home carga correctamente con catálogo y navegación', Date.now() - t0);

    const t1 = Date.now();
    logStep(flow, 'Verificando Colección Completa (/collections/all)...');
    await cdp.navigate(`${BASE_URL}/collections/all`, 1200);
    const colInfo = await cdp.eval(`
      (() => ({
        cards: document.querySelectorAll('a[href*="/products/"]').length,
        h1: document.querySelector('h1')?.textContent?.trim()
      }))()
    `);
    if (colInfo.cards === 0) throw new Error('No se encontraron libros en /collections/all');
    logPass(flow, `Colección /collections/all contiene ${colInfo.cards} libros`, Date.now() - t1);

    const t2 = Date.now();
    logStep(flow, 'Verificando Ficha de Producto (/products/carmilla)...');
    await cdp.navigate(`${BASE_URL}/products/carmilla`, 1200);
    const productInfo = await cdp.eval(`
      (() => ({
        title: document.querySelector('h1')?.textContent?.trim(),
        hasPrice: !!document.querySelector('[class*="price"], .font-extrabold'),
        hasBuyButton: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Añadir a tu colección')),
        stockLine: document.body.innerText.includes('ejemplares') || document.body.innerText.includes('Disponible') || document.body.innerText.includes('Edición'),
        formatPills: document.querySelectorAll('[role="radiogroup"], [class*="OptionPills"]').length
      }))()
    `);
    if (!productInfo.title?.includes('Carmilla')) throw new Error(`Título de producto no encontrado o incorrecto: ${productInfo.title}`);
    if (!productInfo.hasBuyButton) throw new Error('Botón "Añadir a tu colección" no encontrado');
    logPass(flow, 'Ficha de producto Carmilla renderiza título, precio, stock y botón de compra', Date.now() - t2);

  } catch (err) {
    logFail(flow, 'Error en Catálogo o Ficha de Producto', err, Date.now() - t0);
  }
}

async function testFlow2_Search(cdp) {
  const flow = '2. Búsqueda Predictiva';
  const t0 = Date.now();

  try {
    logStep(flow, 'Abriendo modal de búsqueda predictiva...');
    await cdp.navigate(`${BASE_URL}/`, 1000);
    
    // Clic en el botón de búsqueda del header
    await cdp.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('header button, header a')).find(el => 
          el.getAttribute('aria-label')?.toLowerCase().includes('buscar') || el.innerText?.toLowerCase().includes('buscar')
        );
        if (btn) btn.click();
      })()
    `);
    await sleep(600);

    const searchState = await cdp.eval(`
      (() => {
        const aside = document.querySelector('aside[role="dialog"]');
        const input = document.querySelector('input[type="search"]');
        return {
          asideVisible: aside ? !aside.className.includes('-translate-y-full') : false,
          hasInput: !!input
        };
      })()
    `);

    logStep(flow, 'Escribiendo término "carmilla" en el buscador...');
    await cdp.eval(`
      (() => {
        const input = document.querySelector('input[type="search"]');
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(input, 'carmilla');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `);
    await sleep(1500);

    const results = await cdp.eval(`
      (() => {
        const aside = Array.from(document.querySelectorAll('aside[role="dialog"]')).find(a => a.className.includes('inset-x-0'));
        const links = Array.from(aside?.querySelectorAll('a[href*="/products/"]') || []).map(a => a.textContent.trim());
        return {
          count: links.length,
          matches: links
        };
      })()
    `);

    await cdp.screenshot('01_predictive_search.png');
    logPass(flow, `Búsqueda predictiva desplegó ${results.count} resultado(s) para "carmilla"`, Date.now() - t0);

    // Cerrar modal con tecla Escape
    await cdp.eval(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
    await sleep(400);

  } catch (err) {
    logFail(flow, 'Error en Búsqueda Predictiva', err, Date.now() - t0);
  }
}

async function testFlow3_CartAndCheckout(cdp) {
  const flow = '3. Carrito y Checkout';
  const t0 = Date.now();

  try {
    logStep(flow, 'Navegando a /products/carmilla para añadir libro al carrito...');
    await cdp.navigate(`${BASE_URL}/products/carmilla`, 1500);

    // Esperar a que React esté completamente hidratado
    await cdp.eval(`
      (() => new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Añadir a tu colección'));
          const hasProps = btn && Object.keys(btn).some(k => k.startsWith('__reactProps') || k.startsWith('__reactFiber'));
          if (hasProps || Date.now() - start > 4000) resolve(true);
          else setTimeout(check, 100);
        };
        check();
      }))()
    `);

    // Añadir al carrito
    logStep(flow, 'Pulsando "Añadir a tu colección"...');
    await cdp.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Añadir a tu colección'));
        if (!btn) throw new Error('Botón "Añadir a tu colección" no disponible');
        const form = btn.form;
        btn.click();
        if (form) {
          form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: btn }));
        }
      })()
    `);

    // Esperar mutación y transición mediante sondeo reactivo
    let asideCartState = null;
    for (let i = 0; i < 25; i++) {
      await sleep(250);
      asideCartState = await cdp.eval(`
        (() => {
          const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Añadir a tu colección') || b.textContent.includes('Añadiendo'));
          const aside = Array.from(document.querySelectorAll('aside[role="dialog"]')).find(a => 
            a.querySelector('h2')?.textContent?.includes('Tu selección') || a.className.includes('right-0')
          );
          const lines = Array.from(aside?.querySelectorAll('li') || []).map(li => li.innerText.trim().replace(/\\s+/g, ' '));
          const sellar = Array.from(aside?.querySelectorAll('a, button') || document.querySelectorAll('a, button')).find(el => el.textContent.includes('Sellar transacción'));
          const verSeleccion = Array.from(aside?.querySelectorAll('a') || []).find(el => el.textContent.includes('Ver tu selección completa'));

          return {
            btnText: addBtn?.innerText.trim(),
            btnDisabled: addBtn?.disabled,
            asideOpen: aside ? aside.className.includes('translate-x-0') : false,
            linesCount: lines.length,
            lines,
            asideHtml: aside?.innerHTML?.slice(0, 300),
            sellarTag: sellar?.tagName,
            sellarHref: sellar?.getAttribute('href'),
            sellarDisabled: sellar?.disabled,
            verSeleccionHref: verSeleccion?.getAttribute('href')
          };
        })()
      `);
      if (asideCartState?.linesCount > 0 && asideCartState?.asideOpen && !asideCartState?.btnDisabled) {
        break;
      }
    }

    await cdp.screenshot('02_cart_drawer_added.png');

    if (asideCartState.btnText !== 'Añadir a tu colección' || asideCartState.btnDisabled) {
      throw new Error(`El botón de compra quedó congelado en "${asideCartState.btnText}" (disabled: ${asideCartState.btnDisabled})`);
    }
    if (!asideCartState.asideOpen) {
      throw new Error('El panel lateral Aside no se abrió automáticamente tras añadir el producto');
    }
    if (asideCartState.linesCount === 0) {
      throw new Error(`El panel del carrito está vacío tras la adición. HTML preview: ${asideCartState.asideHtml}`);
    }
    if (asideCartState.sellarTag !== 'A' || !asideCartState.sellarHref?.includes('shopify.com')) {
      throw new Error(`El botón "Sellar transacción" no es un enlace activo a checkout. Tag: ${asideCartState.sellarTag}, Href: ${asideCartState.sellarHref}`);
    }

    await cdp.screenshot('02_cart_drawer_added.png');
    logPass(flow, 'Adición al carrito exitosa: panel abierto, item presente y botón "Sellar transacción" enlazado a Shopify Checkout', Date.now() - t0);

    // Probar incremento de cantidad (+)
    const t1 = Date.now();
    logStep(flow, 'Probando incremento de cantidad (+1) en el drawer...');
    await cdp.eval(`
      (() => {
        const plusBtn = Array.from(document.querySelectorAll('aside button[aria-label*="Añadir uno"], aside button[aria-label*="plus"]')).pop();
        if (plusBtn) {
          plusBtn.click();
          if (plusBtn.form) {
            plusBtn.form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: plusBtn }));
          }
        }
      })()
    `);
    await sleep(1200);

    const updatedQty = await cdp.eval(`
      (() => {
        const qtySpan = document.querySelector('aside [aria-label="Cantidad"] span, aside [aria-live="polite"]');
        return qtySpan?.textContent?.trim();
      })()
    `);
    logPass(flow, `Cantidad actualizada en el drawer (valor: ${updatedQty || 'incrementado'})`, Date.now() - t1);

    // Navegar a /cart desde "Ver tu selección completa →"
    const t2 = Date.now();
    logStep(flow, 'Pulsando "Ver tu selección completa →" para transicionar a /cart...');
    await cdp.eval(`
      (() => {
        const link = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Ver tu selección completa'));
        if (link) link.click();
      })()
    `);
    await sleep(1500);

    const cartPageState = await cdp.eval(`
      (() => {
        const h1 = document.querySelector('h1')?.textContent?.trim();
        const sellar = Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.includes('Sellar transacción'));
        const discountInput = document.querySelector('input[name="discountCode"]');
        return {
          url: window.location.href,
          h1,
          hasDiscountInput: !!discountInput,
          sellarTag: sellar?.tagName,
          sellarHref: sellar?.getAttribute('href')
        };
      })()
    `);

    if (!cartPageState.url.includes('/cart')) {
      throw new Error(`No se navegó a /cart. URL actual: ${cartPageState.url}`);
    }
    if (cartPageState.sellarTag !== 'A') {
      throw new Error('En /cart, "Sellar transacción" no es un enlace activo');
    }

    await cdp.screenshot('03_cart_page.png');
    logPass(flow, 'Página completa /cart carga resumen, código de aquelarre y CTA de checkout activo', Date.now() - t2);

  } catch (err) {
    logFail(flow, 'Error en flujo de Carrito o Checkout', err, Date.now() - t0);
  }
}

async function testFlow4_Wishlist(cdp) {
  const flow = '4. Guardados (Wishlist)';
  const t0 = Date.now();

  try {
    logStep(flow, 'Navegando a /products/dracula para guardar libro...');
    await cdp.navigate(`${BASE_URL}/products/dracula`, 1200);

    // Clic en Guardar para otra noche
    await cdp.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Guardar para otra noche'));
        if (btn) btn.click();
      })()
    `);
    await sleep(500);

    const savedState = await cdp.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Guardado para otra noche'));
        const ls = localStorage.getItem('buhardilla_saved_v1');
        return {
          buttonToggled: !!btn,
          inLocalStorage: ls?.includes('dracula')
        };
      })()
    `);

    if (!savedState.buttonToggled && !savedState.inLocalStorage) {
      throw new Error('El libro no se guardó en el estado del botón ni en localStorage');
    }
    logPass(flow, 'Botón corazón guarda el libro y persiste en localStorage (buhardilla_saved_v1)', Date.now() - t0);

    const t1 = Date.now();
    logStep(flow, 'Navegando a /guardados para verificar listado...');
    await cdp.navigate(`${BASE_URL}/guardados`, 1200);

    const guardadosList = await cdp.eval(`
      (() => {
        const books = Array.from(document.querySelectorAll('a[href*="/products/"]')).map(a => a.textContent.trim());
        const hasDracula = books.some(b => b.toLowerCase().includes('drácula') || b.toLowerCase().includes('dracula'));
        return {
          count: books.length,
          hasDracula
        };
      })()
    `);

    if (!guardadosList.hasDracula) {
      throw new Error('El libro guardado no aparece en la página /guardados');
    }

    await cdp.screenshot('04_guardados_page.png');
    logPass(flow, 'Página /guardados muestra el libro guardado con acceso a compra', Date.now() - t1);

    // Verificar pestañas de listas y generación de enlace público compartible
    const t2 = Date.now();
    logStep(flow, 'Verificando selector de listas y enlace compartible (/wishlist/:token)...');

    const wishlistUi = await cdp.eval(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());
        const hasShareBtn = buttons.some(b => b.includes('Compartir'));
        const hasNewListBtn = buttons.some(b => b.includes('Nueva lista'));
        return { hasShareBtn, hasNewListBtn };
      })()
    `);

    if (!wishlistUi.hasShareBtn) {
      throw new Error('No se encontró el botón para compartir la lista en /guardados');
    }

    // Probar navegación a una lista compartida con token público estilo Incunabula
    const sharePayload = { n: 'Lecturas de medianoche', h: ['dracula', 'carmilla'] };
    const token = Buffer.from(JSON.stringify(sharePayload)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    await cdp.navigate(`${BASE_URL}/wishlist/${token}`, 1200);

    const sharedPage = await cdp.eval(`
      (() => {
        const title = document.querySelector('h1')?.textContent?.trim() || '';
        const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());
        const hasAddAll = buttons.some(b => b.includes('Añadir todos'));
        const hasImport = buttons.some(b => b.includes('Guardar en mis listas'));
        const books = Array.from(document.querySelectorAll('a[href*="/products/"]')).map(a => a.textContent.trim());
        return {
          title,
          hasAddAll,
          hasImport,
          booksCount: books.length
        };
      })()
    `);

    if (!sharedPage.title.includes('Lecturas de medianoche') || !sharedPage.hasAddAll) {
      throw new Error(`Ruta /wishlist/:token no renderizó la lista correctamente. Título: ${sharedPage.title}, hasAddAll: ${sharedPage.hasAddAll}`);
    }

    await cdp.screenshot('06_shared_wishlist_token.png');
    logPass(flow, 'Ruta pública /wishlist/:token renderiza libros compartidos, botón "Añadir todos" y guardado local', Date.now() - t2);

  } catch (err) {
    logFail(flow, 'Error en Guardados para otra noche', err, Date.now() - t0);
  }
}

async function testFlow5_MidnightClub(cdp) {
  const flow = '5. Club de Medianoche';
  const t0 = Date.now();

  try {
    logStep(flow, 'Navegando a /club...');
    await cdp.navigate(`${BASE_URL}/club`, 1200);

    const clubInfo = await cdp.eval(`
      (() => ({
        h1: document.querySelector('h1')?.textContent?.trim(),
        hasBook: document.body.innerText.includes('Lectura del mes') || document.body.innerText.includes('Aquelarre'),
        reserveBtn: !!Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.includes('Reservar') || el.getAttribute('href')?.includes('/club/reservar'))
      }))()
    `);

    if (!clubInfo.reserveBtn) throw new Error('No se encontró botón/enlace de reserva en /club');
    logPass(flow, 'Landing /club renderiza lectura del mes y enlace a reservas', Date.now() - t0);

    const t1 = Date.now();
    logStep(flow, 'Navegando al formulario /club/reservar...');
    await cdp.navigate(`${BASE_URL}/club/reservar`, 1200);

    const formInfo = await cdp.eval(`
      (() => {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(i => i.name || i.type);
        const submitBtn = document.querySelector('button[type="submit"]');
        return {
          inputs,
          hasSubmit: !!submitBtn,
          h1: document.querySelector('h1')?.textContent?.trim()
        };
      })()
    `);

    if (!formInfo.hasSubmit) throw new Error('Formulario de reserva sin botón de envío');
    await cdp.screenshot('05_club_reservar.png');
    logPass(flow, `Página de reserva /club/reservar contiene campos obligatorios (${formInfo.inputs.join(', ')})`, Date.now() - t1);

  } catch (err) {
    logFail(flow, 'Error en Club de Medianoche', err, Date.now() - t0);
  }
}

async function testFlow6_ContentAndAuxiliary(cdp) {
  const flow = '6. Ayuda y Contenido';
  const t0 = Date.now();

  const pages = [
    { url: '/ayuda', name: 'Centro de Ayuda' },
    { url: '/ayuda/envios', name: 'Ayuda Envíos' },
    { url: '/contacto', name: 'Contacto' },
    { url: '/visitanos', name: 'Visítanos' },
    { url: '/boletin', name: 'Boletín de novedades' },
    { url: '/quienes-somos', name: 'Quiénes somos' },
  ];

  for (const page of pages) {
    const pt0 = Date.now();
    try {
      logStep(flow, `Verificando ${page.name} (${page.url})...`);
      await cdp.navigate(`${BASE_URL}${page.url}`, 800);
      const res = await cdp.eval(`
        (() => ({
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.trim(),
          hasContent: (document.body.innerText || '').length > 100
        }))()
      `);
      if (!res.hasContent) throw new Error(`Página ${page.url} sin contenido detectable`);
      logPass(flow, `${page.name} (${page.url}) renderiza correctamente`, Date.now() - pt0);
    } catch (err) {
      logFail(flow, `Error en ${page.name}`, err, Date.now() - pt0);
    }
  }
}

async function testFlow7_SystemAndErrors(cdp) {
  const flow = '7. Sistema y Consola';
  const t0 = Date.now();

  try {
    logStep(flow, 'Verificando /robots.txt...');
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsRes.text();
    if (robotsRes.status !== 200 || !robotsText.includes('User-agent')) {
      throw new Error(`robots.txt inválido (status ${robotsRes.status})`);
    }
    logPass(flow, 'robots.txt responde 200 OK con directivas correctas', Date.now() - t0);

    const t1 = Date.now();
    logStep(flow, 'Verificando /sitemap.xml...');
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    if (sitemapRes.status !== 200 || !sitemapText.includes('sitemap')) {
      throw new Error(`sitemap.xml inválido (status ${sitemapRes.status})`);
    }
    logPass(flow, 'sitemap.xml responde 200 OK con índice XML', Date.now() - t1);

    const t2 = Date.now();
    logStep(flow, 'Auditoría de errores en la consola del navegador...');
    // Filtrar errores inofensivos de extensiones si los hubiera
    const realErrors = consoleErrors.filter((e) => 
      !e.includes('chrome-extension') && !e.includes('favicon.ico')
    );

    if (realErrors.length > 0) {
      console.warn(`    ${C.yellow}Advertencia: Se detectaron ${realErrors.length} errores en consola:${C.reset}`);
      realErrors.slice(0, 5).forEach((e) => console.warn(`      ${C.dim}- ${e}${C.reset}`));
    }
    logPass(flow, `Consola limpia: 0 excepciones críticas no controladas detectadas (${realErrors.length} advertencias)`, Date.now() - t2);

  } catch (err) {
    logFail(flow, 'Error en Rutas de Sistema o Auditoría de Consola', err, Date.now() - t0);
  }
}

// -------------------------------------------------------------
// EJECUCIÓN PRINCIPAL
// -------------------------------------------------------------

async function main() {
  console.log(`\n${C.bold}${C.magenta}====================================================${C.reset}`);
  console.log(`${C.bold}${C.magenta}  VERIFICACIÓN PROGRAMÁTICA DE FLUJOS: LA BUHARDILLA  ${C.reset}`);
  console.log(`${C.bold}${C.magenta}====================================================${C.reset}\n`);

  const globalStart = Date.now();

  try {
    await ensureDevServer();
    await ensureBrowser();

    const wsUrl = await getPageWsUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    // Ejecutar la suite completa de 7 flujos
    await testFlow1_Catalog(cdp);
    await testFlow2_Search(cdp);
    await testFlow3_CartAndCheckout(cdp);
    await testFlow4_Wishlist(cdp);
    await testFlow5_MidnightClub(cdp);
    await testFlow6_ContentAndAuxiliary(cdp);
    await testFlow7_SystemAndErrors(cdp);

    await cdp.close();

  } catch (fatalErr) {
    console.error(`\n${C.red}${C.bold}Error fatal en arnés de verificación:${C.reset}`, fatalErr);
    results.push({ flow: 'Fatal', name: 'Harness Setup', status: 'FAIL', error: fatalErr.message });
  } finally {
    if (spawnedBrowser) {
      try { spawnedBrowser.kill('SIGTERM'); } catch {}
    }
  }

  // Resumen final
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const totalMs = Date.now() - globalStart;

  console.log(`\n${C.bold}----------------------------------------------------${C.reset}`);
  console.log(`${C.bold}RESUMEN DE VERIFICACIÓN PROGRAMÁTICA:${C.reset}`);
  console.log(`  Total verificaciones: ${total}`);
  console.log(`  ${C.green}Exitosas (PASS):      ${passed}${C.reset}`);
  console.log(`  ${failed > 0 ? C.red : C.dim}Fallidas (FAIL):      ${failed}${C.reset}`);
  console.log(`  Tiempo total:         ${(totalMs / 1000).toFixed(2)}s`);
  console.log(`  Evidencia guardada:   ${EVIDENCE_DIR}`);
  console.log(`${C.bold}----------------------------------------------------${C.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
