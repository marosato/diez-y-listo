# Derechos de los recursos y control de gastos

## Prioridad de la titular

Macarena Rosato pidió el 4 de octubre de 2026 reducir al mínimo los posibles
reclamos de propiedad intelectual, los descuentos y los gastos. Presupuesto
para nuevos gastos: **cero hasta autorización específica**. No contratar,
comprar ni activar servicios de pago por iniciativa del agente.

Esto es un requisito permanente y un registro de evidencias; no una declaración
de que el juego está legalmente libre de cualquier reclamo. Tampoco modifica
los contratos aceptados ni elimina obligaciones, comisiones o impuestos.

## Revisión técnica de la versión 2.5.0

Revisión del repositorio realizada el 4 de octubre de 2026. Los archivos
identificados se enumeran con SHA-256 en `rights-inventory.json`.

| Elemento | Origen y uso observado | Evidencia y tratamiento |
| --- | --- | --- |
| Código, textos, niveles e interfaz propios | Desarrollados para este proyecto; los archivos propios no cargan bibliotecas adicionales de recursos gráficos o musicales | Conservar historial y `LICENSE`. Esta observación no certifica originalidad jurídica ni derechos exclusivos sobre código asistido por IA. |
| Cartas, formas, partículas y favicon | Dibujados con primitivas de Phaser, CSS y SVG en `dist/app.js`, `dist/style.css` y `dist/index.html`; no hay imágenes descargadas en el juego | Conservar fuentes editables. Los símbolos son caracteres de texto renderizados por las fuentes del dispositivo. |
| Sonidos | Osciladores de Web Audio en `beep()`; no hay archivos de canciones o grabaciones | Conservar la implementación; no añadir música externa sin licencia documentada. |
| Phaser 3.90.0 | Dependencia de terceros incluida en `dist/vendor/phaser.min.js` | Licencia MIT conservada en `dist/vendor/PHASER-LICENSE.txt`; permite uso comercial y distribución con su aviso. `build.cjs` copia ese archivo a ambas distribuciones. La MIT no garantiza ausencia de infracciones. |
| Tipografías del juego | Nombres de fuentes en CSS y Canvas, con sustitución del dispositivo; sin archivos TTF/OTF/WOFF, `@font-face` ni descargas de fuentes | No se distribuyen las fuentes. No confundir nombrar una fuente con tener permiso para empaquetar su archivo. |
| Tres portadas PNG | Composición generada por `media/generate_covers.py`, sin imágenes de stock; el texto usa Arial Bold de Windows | Microsoft permite imágenes de texto y videos renderizados con sus fuentes bajo las condiciones de su FAQ, siempre que el software no tenga restricciones de uso no comercial. No distribuir `arialbd.ttf` ni convertirlo en un atlas de glifos. Ver fuentes al pie. |
| Dos videos MP4 | Capturas de partidas del propio juego, con la portada inicial, sin música ni audio | Procedencia y características registradas en `media/README.md`. No incluyen archivos de fuentes ni grabaciones de terceros. |
| SDK y anuncios de CrazyGames | El build de portal añade el SDK remoto oficial; no se incluye en el build web | Servicio sujeto al contrato del portal, no material propio. Revisar condiciones comerciales por separado; la aprobación y los ingresos no están garantizados. |

No se identificaron archivos de fuentes, imágenes de stock, canciones,
personajes ajenos o bibliotecas de iconos adicionales en el contenido revisado.
La inspección no determina si existen derechos o reclamos externos desconocidos.

## Evidencias oficiales consultadas

- Phaser, licencia de la versión 3.90.0:
  https://github.com/phaserjs/phaser/blob/v3.90.0/LICENSE.md
- Microsoft, uso y redistribución de fuentes de Windows:
  https://learn.microsoft.com/en-us/typography/fonts/font-faq
- CrazyGames/Maxflow, contrato del 14 de abril de 2026, especialmente artículos
  7.1 y 7.4 sobre derechos e indemnización:
  https://files.crazygames.com/documents/developer_terms_20260414.pdf

## Límites y pendientes

- No se realizó una búsqueda exhaustiva de marcas para «Diez y listo» ni una
  revisión jurídica de todo el código, diseño, reglas o posibles patentes.
  El nombre no se registra como «marca disponible» ni el proyecto como
  «legalmente aprobado». Una búsqueda web simple tampoco probaría eso.
- No se auditó la licencia individual del sistema operativo de la titular.
  Las condiciones de Microsoft citadas son la evidencia de permiso general,
  no una certificación de esa instalación.
- La titular informó haber aceptado los términos; su aceptación no elimina
  las obligaciones de indemnización. La revisión de recursos ayuda a reducir
  riesgo, pero no limita por sí misma una responsabilidad contractual.
- Comisiones de cobro, cambio de moneda, retenciones, impuestos y deducciones
  contractuales pueden existir aunque todos los recursos tengan autorización.
  No se garantiza ingreso neto ni ausencia de descuentos. Confirmar opciones
  y costos antes de habilitar o cambiar el método de cobro; no contratar una
  alternativa de pago sin presupuesto aprobado.

## Para cada recurso nuevo y cada publicación

1. Registrar autor/proveedor, dirección de origen, archivo, versión, licencia,
   fecha y evidencia del permiso comercial y de distribución aplicable.
2. Verificar atribución, avisos, restricciones y posibles pagos; rechazar o
   sustituir recursos sin autorización suficiente para el uso previsto.
3. Conservar avisos en los paquetes y actualizar el inventario. No afirmar
   exclusividad de una biblioteca o recurso compartido de terceros.
4. Revisar que no se incorporen servicios pagos ni cambien las condiciones
   de cobro/monetización sin autorización específica.
5. Registrar verificaciones pendientes con precisión; no convertir la
   preferencia de minimizar riesgos en una garantía de ausencia de reclamos.
