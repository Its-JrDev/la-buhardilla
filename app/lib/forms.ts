/**
 * Entrega de formularios sin backend propio. Si `FORMS_WEBHOOK_URL` está configurada,
 * el formulario se envía como JSON a esa URL. Para test store/portfolio, si no hay URL
 * se simula un envío exitoso para no romper los flujos.
 */
export type FormKind = 'contacto' | 'avisame' | 'devolucion' | 'club-cambio' | 'club-cancelacion';

export async function deliverForm(env: Env, kind: FormKind, payload: Record<string, string>) {
  const url = env.FORMS_WEBHOOK_URL;
  if (!url) {
    console.log(`[forms:test] Simulando envío exitoso «${kind}»`, JSON.stringify({kind, sentAt: new Date().toISOString(), ...payload}));
    return {ok: true as const};
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({kind, sentAt: new Date().toISOString(), ...payload}),
    });
    return res.ok ? {ok: true as const} : {ok: false as const, reason: 'failed' as const};
  } catch (error) {
    console.error(error);
    return {ok: false as const, reason: 'failed' as const};
  }
}

export const isEmail = (v: unknown): v is string => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function folio() {
  return `LB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
