# Publicación y monetización

Estado: preparación técnica, no aprobación comercial. Información consultada el 3 de octubre de 2026.

## Alojamiento independiente

Cuenta de Cloudflare disponible. Publicado por carga directa el 4 de octubre de 2026 en https://diez-y-listo.pages.dev . Versión 2.4.1; nueve archivos cargados. Página y jugada de pareja comprobadas en navegador. El código está en https://github.com/marosato/diez-y-listo . Para una futura conexión Git, conectar únicamente este repositorio desde Workers & Pages. Usar `node build.cjs web` y `build/web`. La propietaria debe revisar permisos y aceptar los términos. No configurar servicios de pago ni comprar un dominio sin presupuesto explícito.

## CrazyGames

Cuenta de desarrolladora disponible en https://developer.crazygames.com/ . Completar el perfil y Billing. Estos datos y los términos debe completarlos la titular, sin compartir contraseñas ni datos bancarios en el chat.

Subir el contenido de `build/crazygames`, con `index.html` en la raíz. Validar SDK real en la herramienta Preview: inicialización, eventos de juego, pausa/silencio durante anuncios, continuación tras error, persistencia y uso móvil. La versión española y sus portadas quedan sujetas a revisión del portal.

Basic Launch no genera ingresos publicitarios. Full Launch requiere aprobación y habilita monetización. El pago requiere datos de cobro y un saldo mínimo de 100 EUR según la documentación consultada; plazos, métodos y cargos dependen del portal y del país. Ninguna integración garantiza aceptación o ingresos.

Fuentes: https://docs.crazygames.com/ — https://docs.crazygames.com/requirements/ads/ — https://docs.crazygames.com/payouts/ — https://docs.crazygames.com/sdk/video-ads/

## Ficha de presentación

Título: Diez y listo

Autora: Macarena Rosato

Género: puzle de lógica y cartas. Plataforma: HTML5. Idiomas desde la versión 2.5.0: español e inglés.

Descripción breve: Combiná cartas que suman diez y elegí qué capas liberar. Doce desafíos de lógica y un tablero diario, sin reloj y con ayudas opcionales.

English pitch: A calm number-card puzzle about planning the order of your moves. Match exposed cards that add up to ten to reveal deeper layers. Includes twelve handcrafted levels, a seeded daily challenge, optional hints, undo, saved progress and a mobile-friendly layout. Interface languages: English and Spanish.

Controles: tocar o hacer clic en dos cartas. Teclado: Tab, flechas y Enter/Espacio.

Portadas originales preparadas y revisadas en `media/`: horizontal 1920 × 1080, vertical 800 × 1200 y cuadrada 800 × 800. No contienen marcas de otras plataformas ni material de terceros. Aún no están cargadas en el formulario. Referencia: https://docs.crazygames.com/requirements/game-covers/ .

Prueba del 4 de octubre de 2026: se cerraron las vistas duplicadas. La previsualización 2.4.1 permitió completar el primer nivel y continuar al segundo. Su registro detectó `sdkInit`, `gameLoaded`, `gameFinishedLoading`, `gameplayStart` y `gameplayStop`. Indicó carga inicial de 0,3 MB y 1,9 segundos. Una recarga posterior no terminó de cargar el iframe; la recuperación del guardado en el portal sigue pendiente de verificación.

Al revisar los requisitos se confirmó que el inglés es obligatorio. Se preparó la versión 2.5.0 bilingüe, con pruebas automáticas y revisión local del cambio de idioma, victoria, niveles, capas y recuperación de progreso. Se revisó la distribución móvil en ventanas 390 × 844 y 360 × 640 sin desplazamiento horizontal. Falta cargar esta versión en CrazyGames y repetir QA. No se certificaron dispositivos físicos ni Edge/Safari.

## Segundo canal: Poki

Enviar primero el proyecto mediante https://developers.poki.com/guide/share . El acceso y la aceptación no son automáticos. No reutilizar la versión con SDK CrazyGames: usar la web para evaluación y preparar una integración Poki separada si lo aceptan. Revisar condiciones y cualquier exclusividad antes de aceptar contratos o distribuir en otros portales.

Formulario de carga preparado: Diez y listo, HTML5, Data Module y soporte móvil. Archivos cargados el 4 de octubre de 2026. CrazyGames creó la previsualización 743f6b95-055d-4519-ae28-8d782164389c y el build dd882313-0879-4e97-a812-edec39c77109. Falta completar QA, detalles y envío final. No hay envío a revisión confirmado. No se ha enviado aún ninguna solicitud ni configurado una cuenta de cobro.
