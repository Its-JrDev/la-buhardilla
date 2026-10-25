import type {IconName} from '~/components/brand/Icons';

export type Faq = {q: string; a: string};
export type HelpTopic = {handle: string; icon: IconName; title: string; desc: string; lead: string; faqs: Faq[]};

const TARDA: Faq = {
  q: '¿Cuánto tarda en llegar mi pedido?',
  a: 'El tiempo depende del método que elijas al sellar la transacción; lo ves antes de pagar. Las ediciones raras salen envueltas a mano, así que pueden tardar un día más en dejar la buhardilla.',
};
const RASTREO: Faq = {
  q: '¿Cómo rastreo mi paquete?',
  a: 'En cuanto sale, te enviamos un correo con la guía de la paquetería. Si tienes cuenta, también ves cada paso en el seguimiento de tu pedido.',
};

export const HELP_TOPICS: HelpTopic[] = [
  {
    handle: 'envios',
    icon: 'truck',
    title: 'Envíos y entregas',
    desc: 'Tiempos, costos y cómo rastrear tu paquete.',
    lead: 'Cuánto tarda, cuánto cuesta y dónde va tu paquete mientras baja de la buhardilla.',
    faqs: [
      TARDA,
      {q: '¿Cuánto cuesta el envío?', a: 'El costo exacto aparece antes de sellar la transacción, según tu dirección y el método que elijas. Recoger en la buhardilla es gratis.'},
      {q: '¿A dónde envían?', a: 'A los países que aparecen al elegir tu dirección en el checkout. Si el tuyo no está, escríbenos y vemos cómo hacerte llegar el libro.'},
      RASTREO,
      {q: '¿Puedo cambiar la dirección después de comprar?', a: 'Sí, mientras el pedido no haya salido. Escríbenos con tu número de pedido y la dirección nueva.'},
      {q: '¿Puedo recoger mi pedido en la buhardilla?', a: 'Sí. Elige «Recoger en la buhardilla» al sellar y te avisamos cuando esté listo en el mostrador.'},
      {q: '¿Qué pasa si no hay nadie para recibirlo?', a: 'La paquetería deja un aviso y vuelve a intentarlo. Si no logra entregarlo, el paquete regresa a la buhardilla y te escribimos para reenviarlo.'},
      {q: 'Mi paquete llegó dañado, ¿qué hago?', a: 'Toma fotos del paquete y del libro e inicia una devolución desde tu cuenta, o escríbenos. Te enviamos otro ejemplar o te devolvemos el dinero.'},
    ],
  },
  {
    handle: 'pedidos',
    icon: 'card',
    title: 'Pedidos y pagos',
    desc: 'Formas de pago, facturas y cambios a un pedido.',
    lead: 'Cómo pagar, qué pasa después de sellar la transacción y cómo cambiar un pedido.',
    faqs: [
      {q: '¿Qué formas de pago aceptan?', a: 'Las que ves en el checkout: tarjetas de crédito y débito y los métodos disponibles para tu país.'},
      {q: '¿Necesito una cuenta para comprar?', a: 'No. Puedes sellar tu transacción como invitado. Con una cuenta conservas tus pedidos y direcciones en un solo lugar.'},
      {q: '¿Puedo cambiar o cancelar un pedido?', a: 'Si todavía no sale, sí. Escríbenos cuanto antes con tu número de pedido.'},
      {q: 'Mi pago fue rechazado, ¿qué hago?', a: 'No se hizo ningún cargo. Revisa los datos de la tarjeta o prueba con otro método; tu selección sigue apartada.'},
      {q: '¿Dónde está mi comprobante?', a: 'Te llega por correo al sellar la transacción. Si tienes cuenta, también lo encuentras en el detalle de cada pedido.'},
    ],
  },
  {
    handle: 'devoluciones',
    icon: 'return',
    title: 'Cambios y devoluciones',
    desc: 'Si un libro llegó dañado o no era lo que esperabas.',
    lead: 'Si un libro llegó dañado o no coincide con su ficha, lo resolvemos.',
    faqs: [
      {q: '¿Puedo devolver un libro?', a: 'Sí, si llega dañado o no coincide con su ficha. Los plazos están en nuestra política de reembolsos; las ediciones raras se revisan caso por caso.'},
      {q: '¿Cómo inicio una devolución?', a: 'Desde tu cuenta, en el detalle del pedido, elige «Iniciar una devolución». Si compraste como invitado, escríbenos con tu número de pedido.'},
      {q: '¿Me devuelven el dinero o me mandan otro?', a: 'Tú eliges: otro ejemplar, si queda, o el reembolso al mismo método de pago.'},
      {q: '¿Quién paga el envío de la devolución?', a: 'Si el libro llegó dañado o no era el de la ficha, nosotros. Te enviamos la guía de devolución.'},
    ],
  },
  {
    handle: 'libros',
    icon: 'book',
    title: 'Libros y ediciones raras',
    desc: 'Estado de los usados, primeras ediciones y apartados.',
    lead: 'Cómo describimos cada ejemplar y qué esperar de una edición rara.',
    faqs: [
      {q: '¿Qué significa el estado de un libro usado?', a: 'Cada ficha dice si es nuevo o usado. En los usados describimos marcas, subrayados y dedicatorias antes de que lo apartes.'},
      {q: '¿Las ediciones raras son originales?', a: 'Sí. Las sacamos de la vitrina con guantes, las revisamos página por página y las enviamos con protección extra.'},
      {q: '¿Pueden conseguirme un libro que no tienen?', a: 'Lo intentamos. Escríbenos con el título y el autor y lo rastreamos con editoriales y librerías de viejo.'},
      {q: '¿Me avisan cuando vuelva un libro agotado?', a: 'Sí. En la ficha de cualquier libro agotado deja tu correo en «Avísame cuando vuelva».'},
    ],
  },
  {
    handle: 'cuenta',
    icon: 'user',
    title: 'Tu cuenta',
    desc: 'Entrar, guardados y los datos de tu cuenta.',
    lead: 'Cómo entrar, qué guarda tu cuenta y qué vive solo en tu dispositivo.',
    faqs: [
      {q: '¿Cómo entro a mi cuenta?', a: 'Con tu correo: te enviamos un código de un solo uso, sin contraseñas que recordar.'},
      {q: '¿Dónde quedan mis guardados?', a: 'En este dispositivo. Si cambias de navegador o borras sus datos, se pierden.'},
      {q: '¿Cómo cambio mis direcciones?', a: 'En tu cuenta, en «Direcciones y datos». La principal se usa por defecto al sellar.'},
    ],
  },
  {
    handle: 'club',
    icon: 'candle',
    title: 'Club de medianoche',
    desc: 'Reservas, acompañantes y fechas de las sesiones.',
    lead: 'Todo sobre las sesiones del último viernes de cada mes.',
    faqs: [
      {q: '¿Tengo que haber terminado el libro?', a: 'No. Basta con traer ganas de escuchar; nadie revela finales sin avisar.'},
      {q: '¿Puedo llevar a alguien?', a: 'Sí, a un acompañante como máximo. Apártale su lugar al reservar.'},
      {q: '¿Cómo cambio o cancelo mi reserva?', a: 'Desde tu cuenta, en «Reservas del club», hasta 24 h antes de la sesión. Si reservaste como invitado, escríbenos.'},
      {q: '¿Dónde es?', a: 'En la buhardilla. Los detalles llegan con la confirmación de tu reserva.'},
    ],
  },
];

export const POPULAR_FAQS: Faq[] = [
  TARDA,
  RASTREO,
  HELP_TOPICS[3].faqs[0],
  HELP_TOPICS[2].faqs[0],
  HELP_TOPICS[1].faqs[1],
];

export const topicByHandle = (h: string) => HELP_TOPICS.find((t) => t.handle === h);
