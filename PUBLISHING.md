# Publicación y monetización

Estado: preparación técnica, no aprobación comercial. Información consultada el 3 de octubre de 2026.

## Alojamiento independiente

Cuenta de Cloudflare disponible. Proyecto Pages `diez-y-listo` creado; carga directa pendiente del permiso de archivos de la extensión. El código está en https://github.com/marosato/diez-y-listo . Para una futura conexión Git, conectar únicamente este repositorio desde Workers & Pages. Usar `node build.cjs web` y `build/web`. La propietaria debe revisar permisos y aceptar los términos. No configurar servicios de pago ni comprar un dominio sin presupuesto explícito.

## CrazyGames

Cuenta de desarrolladora disponible en https://developer.crazygames.com/ . Completar el perfil y Billing. Estos datos y los términos debe completarlos la titular, sin compartir contraseñas ni datos bancarios en el chat.

Subir el contenido de `build/crazygames`, con `index.html` en la raíz. Validar SDK real en la herramienta Preview: inicialización, eventos de juego, pausa/silencio durante anuncios, continuación tras error, persistencia y uso móvil. La versión española y sus portadas quedan sujetas a revisión del portal.

Basic Launch no genera ingresos publicitarios. Full Launch requiere aprobación y habilita monetización. El pago requiere datos de cobro y un saldo mínimo de 100 EUR según la documentación consultada; plazos, métodos y cargos dependen del portal y del país. Ninguna integración garantiza aceptación o ingresos.

Fuentes: https://docs.crazygames.com/ — https://docs.crazygames.com/requirements/ads/ — https://docs.crazygames.com/payouts/ — https://docs.crazygames.com/sdk/video-ads/

## Ficha de presentación

Título: Diez y listo

Autora: Macarena Rosato

Género: puzle de lógica y cartas. Plataforma: HTML5. Idioma actual: español.

Descripción breve: Combiná cartas que suman diez y elegí qué capas liberar. Doce desafíos de lógica y un tablero diario, sin reloj y con ayudas opcionales.

English pitch: A calm number-card puzzle about planning the order of your moves. Match exposed cards that add up to ten to reveal deeper layers. Includes twelve handcrafted levels, a seeded daily challenge, optional hints, undo, local saves and a mobile-friendly layout. Current interface language: Spanish.

Controles: tocar o hacer clic en dos cartas. Teclado: Tab, flechas y Enter/Espacio.

Capturas y portadas: preparar en las dimensiones vigentes solicitadas por cada plataforma, sin inventar imágenes de una jugabilidad diferente.

## Segundo canal: Poki

Enviar primero el proyecto mediante https://developers.poki.com/guide/share . El acceso y la aceptación no son automáticos. No reutilizar la versión con SDK CrazyGames: usar la web para evaluación y preparar una integración Poki separada si lo aceptan. Revisar condiciones y cualquier exclusividad antes de aceptar contratos o distribuir en otros portales.

Formulario de carga preparado: Diez y listo, HTML5, Data Module y soporte móvil. Falta cargar archivos, validar Preview, completar detalles y enviar. No se ha enviado aún ninguna solicitud ni configurado una cuenta de cobro.
