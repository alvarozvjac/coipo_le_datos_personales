# coipo_le_datos_personales — Maqueta del canal de ejercicio de derechos (Ley N° 21.719)

Maqueta de validación del canal por el que las personas ejercen ante CONAF sus derechos
sobre datos personales (acceso, rectificación, supresión, oposición, portabilidad y
bloqueo temporal), según la Ley N° 21.719. Iniciativa CON012, elaborada por la Unidad de
Información y Análisis (UIA), línea de Gobernanza de Datos.

**Ver la maqueta publicada (v3.7, rama `main`):** https://alvarozvjac.github.io/coipo_le_datos_personales/

> Demostración no operacional. Personas, RUN, casos y responsables son ficticios; los RUN
> tienen dígito verificador inválido a propósito. Fecha simulada: lunes 11-01-2027. Nada se
> envía a un servidor. El ingreso con Clave Única está simulado: CONAF hoy no cuenta con la
> integración.

## Versión 4.0 (rama `v4-formato-flota`, borrador sin aprobar)

Rehecha con el formato de la maqueta de gestión de flota (`coipo_gestion_flota_vehiculos`
v0.4): banner de gerencia, ingreso con usuarios de prueba, Inicio por perfil con tarjetas
«¿Qué necesitas hacer?», detalle de cada caso en un panel lateral y cabecera compacta en el
teléfono. Conserva sólo lo verificado de la v3.7; lo no confirmado aparece como «Por definir».

### Perfiles de prueba

| Perfil | Qué se puede probar |
|---|---|
| Persona solicitante | Portada simulada de conaf.cl → página de datos personales (11 ítems del art. 14 ter) → solicitud en 4 pasos con Clave Única simulada → acuse con número de caso → **Mis solicitudes**: estado del caso y envío de antecedentes pedidos |
| Recepción (Oficina Central y Biobío) | Verificar identidad, pedir antecedentes, pasar a admisibilidad, derivar, registrar la firma, enviar la respuesta, prorrogar; **registrar un formulario físico de Oficina de Partes** con la fecha del timbre |
| Fiscalía | Admisibilidad, bloqueo temporal (2 días hábiles) y revisión jurídica |
| Área responsable de los datos | Análisis y propuesta de respuesta; pedir prórroga |
| Administración del canal | **Responsables por etapa y sede**, asignación de las solicitudes web, plazos internos, feriados y bitácora |

Todos los perfiles internos tienen **calendario de vencimientos** y, salvo el área, **reportes
con descarga en Excel** (sin RUN ni nombres).

### Lo que la v4 no decide (pendiente de la contraparte)

- Quién recibe, revisa, deriva, firma y responde en Oficina Central y en cada región. En la
  maqueta sólo Oficina Central y Biobío llevan una asignación de prueba; el resto queda por
  definir y sus casos aparecen en «Casos sin responsable».
- A qué sede se asignan las solicitudes web.
- Los plazos internos por etapa (vacíos; el canal controla sólo los plazos legales).
- Quién firma la respuesta y si la firma se tramita en la plataforma, en Cero Papel o en ambos.
- Los ámbitos de datos: los de la maqueta son de ejemplo hasta cargar la matriz de datos personales.
- Los plazos legales se muestran como los citaba la v3.7 y están por validar con el delegado.
- Representante legal, política de protección de datos y política de seguridad.
- El origen del catálogo de regiones, provincias y comunas, que trae nombres mal escritos.

### Qué cambió respecto de la v3.7

- Se retiraron el nombre del delegado, los correos `@conaf.cl`, la casilla `datospersonales@`
  (que la v3.7 decía retirada y seguía en el pie), el chip «Etapa SF-02», la matriz de ejemplo
  y los plazos internos propuestos (1-2-8-2-2 días hábiles), por no estar verificados.
- Se retiraron los puntos explicativos (flujo, perfiles y permisos, vías de ingreso).
- En el teléfono, el contenido empieza bajo una cabecera compacta: la v3.7 lo empezaba en
  y = 628 de 844 px.

## Pruebas

```bash
python -X utf8 pruebas/probar_v4.py            # 47 comprobaciones, escritorio y teléfono
```

Requiere `playwright` para Python con Chromium. Las capturas quedan en `pruebas/capturas/`
(no se versionan). Las pruebas de la v3.x (`recorrido_caso.py`, `probar_v3*.py`) corresponden
a la rama `main`.

## Contenido del repositorio (rama v4)

- `index.html`: estructura de la página.
- `css/base-flota.css`: estilos de la maqueta de flota v0.4, sin cambios (siguen
  `identidad/ESTANDAR_UI.md` de coipo_master_produccion). `css/con012.css`: estilos propios.
- `js/`: `comun.js` (fechas y plazos), `datos.js` (datos ficticios), `casos.js` (reglas del caso),
  `publico.js`, `interno.js`, `admin.js`, `app.js` y `territorio.js`.
- `img/`: banner de la Secretaría de Asuntos Institucionales, de `identidad/` de coipo_master_produccion.
- `CON012_maqueta_canal_ley21719_2.html`: versión v0.5, conservada como referencia.

Norma de referencia: Ley N° 21.719 (vigencia 01-12-2026) y el procedimiento institucional V1
de atención de solicitudes de derechos.
