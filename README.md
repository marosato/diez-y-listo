# Diez y listo

Un juego de lógica para navegador de **Macarena Rosato**. Elegí parejas que sumen diez y planificá qué cartas liberar de las capas inferiores.

## Jugar y desarrollar

Sin instalación de paquetes:

```sh
python -m http.server 8080 --directory dist
```

Abrí `http://localhost:8080`. Incluye doce niveles, desafío diario, guardado local, copias exportables, deshacer y pistas opcionales. Elegir una carta no revela su pareja. La interfaz móvil centra las cartas sin moverlas después de cada jugada.

## Distribuciones

```sh
node build.cjs web
node build.cjs crazygames
```

- `build/web`: versión independiente sin red de anuncios activa, lista para hosting estático. No necesita servicios de OpenAI.
- `build/crazygames`: integración SDK v3, eventos de partida y anuncios entre rondas. La publicidad depende del entorno y de la aprobación del portal. No implica publicación ni ingresos activos.

En Cloudflare Pages: conectar este repositorio, rama `main`, comando `node build.cjs web`, directorio de salida `build/web`. Cloudflare asigna un subdominio `pages.dev`; un dominio propio requiere registro aparte. No hay credenciales en el repositorio.

## Publicidad

Se solicita un anuncio únicamente al elegir siguiente nivel o repetir tras una victoria, a partir de dos partidas completadas y con al menos dos minutos entre solicitudes. Durante la solicitud se bloquea la interacción y se suspende el audio; un error o falta de inventario permite continuar. Las pistas y deshacer siguen siendo gratuitos. Fuera de CrazyGames el SDK no se carga en la distribución web.

La integración tiene pruebas automáticas con SDK simulado y una comprobación local con SDK real: anuncio de prueba entre rondas y continuación al siguiente nivel. Falta validación en la herramienta de previsualización del portal antes de solicitar aprobación comercial. No se promete un ingreso mínimo ni aceptación.

## Pruebas

```sh
node test.cjs
node progression.test.cjs
node backup.test.cjs
node lifecycle.test.cjs
node platform.test.cjs
```

GitHub Actions ejecuta las pruebas y construye ambas distribuciones. Las pruebas de interfaz simulada no reemplazan dispositivos físicos ni QA del portal.

## Datos y propiedad

El juego guarda avances y hasta 1.000 eventos localmente, sin telemetría central propia. Las copias solo se comparten si la persona las entrega. La versión para portales usa servicios de terceros regidos por sus avisos y mecanismos de consentimiento. La versión web no solicita fuentes externas.

Al cambiar de dominio, el navegador no transfiere el progreso automáticamente: descargar una copia en el origen y recuperarla desde «Ver mi progreso» en el destino.

Código original con derechos reservados; ver `LICENSE`. Phaser 3.90.0 conserva su licencia MIT en `dist/vendor/PHASER-LICENSE.txt`.
