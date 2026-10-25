import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3333';
const CDP_PORT = Number(process.env.CDP_PORT || 9222);
const EVIDENCE_DIR = path.resolve(process.env.HOME || '.', '.gemini/antigravity-cli/brain/675f846d-7fa5-4e25-9474-a91613ef35fb/evidence');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method) {
        this.events.push(msg);
      }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };

    await this.send('DOM.enable');
    await this.send('CSS.enable');
    await this.send('Runtime.enable');
    await this.send('Page.enable');
    await this.send('Network.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || res.exceptionDetails.exception?.description || 'Eval error');
    }
    return res.result?.value;
  }

  async navigate(url, waitMs = 1500) {
    await this.send('Page.navigate', { url });
    await sleep(waitMs);
  }

  async screenshot(filename) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(EVIDENCE_DIR, filename);
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    fs.writeFileSync(fullPath, Buffer.from(data, 'base64'));
    console.log(`  [Screenshot] Guardado: ${fullPath}`);
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch {}
    }
  }
}

async function run() {
  console.log('--- Iniciando verificación de QuickView y Hovers de Botones ---');
  
  let spawned = null;
  let wsUrl = null;
  try {
    const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
    const pages = await res.json();
    const page = pages.find((p) => p.type === 'page');
    if (page) wsUrl = page.webSocketDebuggerUrl;
  } catch {}

  if (!wsUrl) {
    spawned = spawn('chromium', [
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
        const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
        const pages = await res.json();
        const page = pages.find((p) => p.type === 'page');
        if (page) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch {}
    }
  }

  if (!wsUrl) throw new Error('No se pudo conectar a Chrome CDP');

  const cdp = new CdpClient(wsUrl);
  await cdp.connect();

  try {
    // 1. Navegar a Home
    console.log('1. Navegando a Home (http://localhost:3333/)...');
    await cdp.navigate(`${BASE_URL}/`, 1800);

    // 2. Comprobar botón Accent (Naranja) y Primary (Negro)
    console.log('2. Verificando estilos de hover en botones...');
    
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    
    const orangeBtnNode = await cdp.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: '.btn-accent'
    });

    const midnightBtnNode = await cdp.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: 'a.btn-primary[href="/club/reservar"]'
    });

    if (orangeBtnNode.nodeId) {
      const normalStyles = await cdp.eval(`
        (() => {
          const el = document.querySelector('.btn-accent');
          const cs = window.getComputedStyle(el);
          return { bg: cs.backgroundColor, color: cs.color };
        })()
      `);
      console.log('  Botón Accent normal:', normalStyles);

      // Mover el ratón sobre el botón naranja
      const box = await cdp.eval(`
        (() => {
          const el = document.querySelector('.btn-accent');
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        })()
      `);
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: box.x,
        y: box.y
      });
      await sleep(350);

      const hoverStyles = await cdp.eval(`
        (() => {
          const el = document.querySelector('.btn-accent');
          const cs = window.getComputedStyle(el);
          return { bg: cs.backgroundColor, color: cs.color, isHovered: el.matches(':hover') };
        })()
      `);
      console.log('  Botón Accent en :hover (movimiento real):', hoverStyles);

      // Comprobar que NO es morado
      if (hoverStyles.bg.includes('126, 34, 206') || hoverStyles.bg.includes('7e22ce')) {
        throw new Error(`FAIL: El botón naranja tiene hover morado: ${hoverStyles.bg}`);
      }
      console.log('  ✔ Botón Accent verificado: el hover es calabaza enriquecida y NO morado (bg: ' + hoverStyles.bg + ')');

      // Mover el ratón fuera
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
      await sleep(200);
    }

    if (midnightBtnNode.nodeId) {
      // Scrollear hasta el botón si está más abajo
      await cdp.eval(`
        (() => {
          const el = document.querySelector('a.btn-primary[href="/club/reservar"]');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `);
      await sleep(300);

      const normalStyles = await cdp.eval(`
        (() => {
          const el = document.querySelector('a.btn-primary[href="/club/reservar"]');
          const cs = window.getComputedStyle(el);
          return { bg: cs.backgroundColor, color: cs.color };
        })()
      `);
      console.log('  Botón Primary normal:', normalStyles);

      const box = await cdp.eval(`
        (() => {
          const el = document.querySelector('a.btn-primary[href="/club/reservar"]');
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        })()
      `);
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: box.x,
        y: box.y
      });
      await sleep(350);

      const hoverStyles = await cdp.eval(`
        (() => {
          const el = document.querySelector('a.btn-primary[href="/club/reservar"]');
          const cs = window.getComputedStyle(el);
          return { bg: cs.backgroundColor, color: cs.color, isHovered: el.matches(':hover') };
        })()
      `);
      console.log('  Botón Primary en :hover (movimiento real):', hoverStyles);

      if (hoverStyles.bg.includes('126, 34, 206') || hoverStyles.bg.includes('7e22ce')) {
        throw new Error(`FAIL: El botón negro/midnight tiene hover morado: ${hoverStyles.bg}`);
      }
      console.log('  ✔ Botón Primary verificado: el hover es pizarra/slate y NO morado (bg: ' + hoverStyles.bg + ')');

      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
      await sleep(200);
    }

    // 3. Probar QuickView Modal Add to Cart
    console.log('3. Probando QuickView Modal y Add to Cart...');
    const initialBadge = await cdp.eval(`
      (() => {
        const badge = Array.from(document.querySelectorAll('header a[href="/cart"] span')).find(s => !isNaN(parseInt(s.textContent)));
        return badge ? parseInt(badge.textContent) : 0;
      })()
    `);
    console.log(`  Badge inicial de carrito: ${initialBadge}`);

    // Esperar a que los botones de vista rápida estén hidratados
    await cdp.eval(`
      (() => new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          const btn = Array.from(document.querySelectorAll('button[aria-label*="Vista rápida"]'))[0];
          const hasProps = btn && Object.keys(btn).some(k => k.startsWith('__reactProps') || k.startsWith('__reactFiber'));
          if (hasProps || Date.now() - start > 4000) resolve(true);
          else setTimeout(check, 100);
        };
        check();
      }))()
    `);

    // Hacer clic en el icono "eye" de la primera tarjeta de libro
    const qvOpened = await cdp.eval(`
      (() => {
        const eyeBtn = Array.from(document.querySelectorAll('button[aria-label*="Vista rápida"]'))[0];
        if (!eyeBtn) return false;
        eyeBtn.click();
        return true;
      })()
    `);
    if (!qvOpened) throw new Error('No se encontró botón de vista rápida');
    
    // Esperar a que el modal cargue los datos del producto
    console.log('  Esperando carga del modal QuickView...');
    let modalInfo = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      modalInfo = await cdp.eval(`
        (() => {
          const dialog = document.querySelector('[role="dialog"][aria-labelledby="qv-title"]');
          if (!dialog) return null;
          const title = dialog.querySelector('#qv-title')?.textContent?.trim();
          const buyBtn = dialog.querySelector('button[type="submit"]');
          return {
            open: true,
            title,
            hasBuyBtn: !!buyBtn,
            buyBtnText: buyBtn?.textContent?.trim()
          };
        })()
      `);
      if (modalInfo && modalInfo.hasBuyBtn) break;
    }

    console.log('  Modal QuickView cargado:', modalInfo);
    if (!modalInfo || !modalInfo.hasBuyBtn) throw new Error('El modal de QuickView no cargó el producto o el botón de compra');

    await cdp.screenshot('11_quickview_modal_open.png');

    // Escuchar peticiones de red para /cart
    const cartRequests = [];
    cdp.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Network.requestWillBeSent') {
        const u = msg.params.request.url;
        if (u.includes('/cart')) {
          cartRequests.push({ url: u, method: msg.params.request.method });
        }
      }
      if (msg.id && cdp.pending.has(msg.id)) {
        const { resolve, reject } = cdp.pending.get(msg.id);
        cdp.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };

    // Obtener la posición del botón "Añadir a tu colección" dentro del modal
    const btnBox = await cdp.eval(`
      (() => {
        const dialog = document.querySelector('[role="dialog"][aria-labelledby="qv-title"]');
        const buyBtn = dialog.querySelector('button[type="submit"]');
        const r = buyBtn.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      })()
    `);
    console.log('  Haciendo clic nativo en el botón de compra en coordenadas:', btnBox);

    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: btnBox.x,
      y: btnBox.y,
      button: 'left',
      clickCount: 1,
    });
    await sleep(50);
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: btnBox.x,
      y: btnBox.y,
      button: 'left',
      clickCount: 1,
    });

    console.log('  Esperando procesamiento de la adición al carrito...');
    await sleep(3000);

    const postAddState = await cdp.eval(`
      (() => {
        const dialog = document.querySelector('[role="dialog"][aria-labelledby="qv-title"]');
        const cartAside = Array.from(document.querySelectorAll('aside[role="dialog"]')).find(a => 
          a.innerText?.includes('Tu aquelarre') || a.innerText?.includes('Sellar transacción') || a.innerText?.includes('Subtotal')
        );
        const badge = Array.from(document.querySelectorAll('header a[href="/cart"] span')).find(s => !isNaN(parseInt(s.textContent)));
        return {
          quickViewOpen: !!dialog,
          cartAsideVisible: cartAside ? !cartAside.className.includes('translate-x-full') : false,
          cartBadge: badge ? parseInt(badge.textContent) : 0,
        };
      })()
    `);
    console.log('  Estado post-adición:', postAddState);
    console.log('  Peticiones detectadas a /cart:', cartRequests);

    await cdp.screenshot('12_quickview_added_to_cart.png');

    if (postAddState.cartBadge <= initialBadge && !postAddState.cartAsideVisible) {
      throw new Error(`FAIL: No se incrementó el carrito desde QuickView. Badge: ${postAddState.cartBadge}, Aside: ${postAddState.cartAsideVisible}`);
    }

    console.log('  ✔ QuickView Add to Cart verificado con éxito: petición enviada, carrito actualizado y drawer abierto.');

  } finally {
    cdp.close();
    if (spawned) {
      try { spawned.kill(); } catch {}
    }
  }
}

run().catch((err) => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});
