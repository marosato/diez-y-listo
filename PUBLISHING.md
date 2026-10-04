# Publicación y monetización

Estado: beta independiente publicada; presentación en CrazyGames pendiente. Información consultada el 4 de octubre de 2026.

## Alojamiento independiente

Cuenta de Cloudflare disponible. Publicado por carga directa el 4 de octubre de 2026 en https://diez-y-listo.pages.dev . Actualizado a la versión 2.5.0; diez archivos cargados y publicación confirmada en el panel. Ambos idiomas y recuperación de la partida anterior comprobados en la dirección pública. El código está en https://github.com/marosato/diez-y-listo y los paquetes en https://github.com/marosato/diez-y-listo/releases/tag/v2.5.0 . GitHub Actions aprobó el commit 2a3b1d3. Para una futura conexión Git, conectar únicamente este repositorio desde Workers & Pages. Usar `node build.cjs web` y `build/web`. La propietaria debe revisar permisos y aceptar los términos. No configurar servicios de pago ni comprar un dominio sin presupuesto explícito.

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

Portadas originales preparadas y revisadas en `media/`: horizontal 1920 × 1080, vertical 800 × 1200 y cuadrada 800 × 800. No contienen marcas de otras plataformas ni material de terceros. Las tres se cargaron y confirmaron en el formulario el 4 de octubre de 2026. También se cargaron dos videos MP4 de partidas reales en inglés: `preview-landscape.mp4` (1920 × 1080, 17,47 segundos) y `preview-portrait.mp4` (720 × 1080, 17,50 segundos). Sin audio, con portada como primer fotograma y tiempos de juego conservados. Se verificó la decodificación completa y se inspeccionaron fotogramas del juego. Referencia: https://docs.crazygames.com/requirements/game-covers/ .

Prueba del 4 de octubre de 2026: se cerraron las vistas duplicadas. La previsualización 2.4.1 permitió completar el primer nivel y continuar al segundo. Su registro detectó `sdkInit`, `gameLoaded`, `gameFinishedLoading`, `gameplayStart` y `gameplayStop`. Indicó carga inicial de 0,3 MB y 1,9 segundos. Una recarga posterior no terminó de cargar el iframe; la recuperación del guardado en el portal sigue pendiente de verificación.

Al revisar los requisitos se confirmó que el inglés es obligatorio. Se preparó la versión 2.5.0 bilingüe, con pruebas automáticas y revisión local del cambio de idioma, victoria, niveles, capas y recuperación de progreso. Se revisó la distribución móvil en ventanas 390 × 844 y 360 × 640 sin desplazamiento horizontal.

La versión 2.5.0 se cargó y guardó en CrazyGames el 4 de octubre de 2026. La carga manual había mezclado nueve archivos de la versión anterior con los diez de la carpeta nueva; se retiraron los archivos viejos de la selección antes de guardar. El portal normalizó la carpeta y creó el build `f2645435-9a4d-4ab2-a1af-825d73324632`, asociado al juego `743f6b95-055d-4519-ae28-8d782164389c`.

QA de esta versión: cargó en Chrome en 2,3 segundos, con carga inicial de 0,3 MB y tamaño total indicado de 1,2 MB. Se recuperó el nivel completado en la versión anterior, se cambió a inglés y se completó el nivel 2 sin pistas ni deshacer. Al seleccionar una carta, el mensaje fue únicamente «Card 1 selected.». La victoria indicó que el resultado se había guardado. El registro confirmó `sdkInit`, `gameLoaded`, `gameFinishedLoading`, `gameplayStart` y `gameplayStop`; la checklist detectó Get Item, Set Item, Gameplay Start y Gameplay Stop y aprobó automáticamente el tamaño inicial y el primer inicio de juego.

La titular respondió «Listo» a la solicitud de pruebas en Edge y un celular físico; se registró esa respuesta como confirmación de funcionamiento, distinguiéndola de las pruebas en Chrome realizadas por el agente. Se completó la declaración de QA y se guardó la ficha: categoría Puzzle, etiquetas Brain, Logic, Math, Relaxing y 1 Player, descripción y controles en inglés, tres portadas y dos videos. No se certificó Safari. El portal llegó a Finalize submission. La declaración de contenido apropiado para jugadores de 12 años o más está marcada; la casilla de términos sigue sin marcar y el envío no se realizó. Se solicitó autorización específica para aceptar el contrato del Developer Portal del 14/04/2026 y enviar el juego. La vista previa es privada de QA y no debe compartirse con jugadores finales.

## Segundo canal: Poki

Enviar primero el proyecto mediante https://developers.poki.com/guide/share . El acceso y la aceptación no son automáticos. No reutilizar la versión con SDK CrazyGames: usar la web para evaluación y preparar una integración Poki separada si lo aceptan. Revisar condiciones y cualquier exclusividad antes de aceptar contratos o distribuir en otros portales.

Formulario de carga guardado: Diez y listo, HTML5, Data Module y soporte móvil en ambas orientaciones. El build anterior `dd882313-0879-4e97-a812-edec39c77109` fue reemplazado por el build 2.5.0 indicado arriba. QA y detalles completos; pendiente aceptación contractual y envío final. No hay envío a revisión confirmado ni cuenta de cobro configurada.
