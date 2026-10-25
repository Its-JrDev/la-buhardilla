/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /**
     * Opcional. URL que recibe por POST (JSON) los formularios que Shopify no cubre:
     * contacto, devoluciones, «Avísame cuando vuelva» y cambios de reserva del club.
     */
    FORMS_WEBHOOK_URL?: string;
  }
}
