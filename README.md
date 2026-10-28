# coipo_ley_datos_personales — Maqueta del canal de ejercicio de derechos (Ley N° 21.719)

Maqueta de validación del canal por el que las personas ejercen ante CONAF sus derechos
sobre datos personales (acceso, rectificación, supresión, oposición, portabilidad y
bloqueo temporal), según la Ley N° 21.719. Iniciativa CON012, elaborada por la Unidad de
Información y Análisis (UIA), línea de Gobernanza de Datos.

**Ver la maqueta:** https://alvarozvjac.github.io/coipo_le_datos_personales/

> Demostración no operacional. Personas, RUN, casos y fechas son ficticios (fecha simulada:
> 28-10-2026) y nada se envía a un servidor. El ingreso con Clave Única está simulado; CONAF no cuenta hoy con ClaveÚnica, que queda
> como etapa posterior. La maqueta sirve para validar el flujo y el alcance con la contraparte, Fiscalía y el
> Departamento de Informática.

## Versión actual: v3.7 (28-10-2026)

Lo que hace la versión actual, en orden:

- **Recorrido externo en 10 puntos numerados**, que se pueden recorrer en orden o volver al punto
  anterior con su botón «← Volver al punto…».
- **Punto 1 · Portada y banner:** la portada simulada de conaf.cl. «Datos Personales» lleva al punto 2.
- **Punto 2 · Página de datos personales:** los 11 ítems que exige el art. 14 ter (política, responsable
  y representante legal, domicilio y canales, seguridad, derechos y reclamo ante la Agencia, categorías,
  conservación, decisiones automatizadas, entre otros). Los ítems sin dato confirmado figuran como
  «Por confirmar», «Por aprobar» o «Por completar».
- **Punto 3 · Quién solicita:** ingreso con Clave Única (simulado). Poder notarial para actuar por otro;
  no se acepta poder simple.
- **Punto 4 · Presentar solicitud:** elección de derechos, con detalle obligatorio; documentos
  opcionales. Medio de respuesta: correo, carta al domicilio o retiro presencial en Oficina de Partes
  de Oficina Central o de una dirección regional. Región, provincia y comuna se eligen en desplegables.
- **Punto 5 · Acuse y plazo.**
- **Punto 6 a 10:** gestión interna (mi panel, flujo de un caso, flujo y plazos, perfiles y permisos,
  vías de ingreso).
- **Vías de ingreso confirmadas por la contraparte:** formulario web con Clave Única y formulario físico
  en Oficina de Partes.
- **Delegado de protección de datos:** designado, Ignacio Valenzuela Isla.
- **Perfiles:** la persona solicitante y tres perfiles internos (jefatura de la unidad receptora,
  Fiscalía y Gerencia responsable).

## Historial de cambios

- **v3.7 (28-10-2026):** vías de ingreso reducidas a las dos confirmadas (se retiran correo de Oficina de
  Partes, casilla dedicada y OIRS); delegado designado; casos de ejemplo de otras vías reasignados a la
  vía física.
- **v3.6 (28-10-2026):** la página de datos personales incorpora los 11 ítems del art. 14 ter, según la
  guía de implementación de la Ley N° 21.719.
- **v3.5 (27-10-2026):** puntos numerados del 1 al 10; «Datos Personales» lleva a la página de datos
  personales como punto 2; cada punto tiene «Volver al punto anterior».
- **v3.4 y v3.3:** paso informativo previo al formulario; comuna por región y provincia (16 regiones,
  56 provincias y 346 comunas).
- **v3.2 a v3.0:** flujo de un caso; formateo de RUN; formulario por pasos.
- **v1.x:** observaciones de la reunión del 15-10-2026 (poder notarial, detalle obligatorio, retiro
  presencial solo en Oficinas de Partes de Oficina Central y regiones, tránsito entre unidades
  pendiente con Informática), y sus versiones previas.

## Pendientes

- Definiciones de la contraparte sobre perfiles de gestión en Oficina Central y en regiones, flujos de
  ingreso, validación, derivación y respuesta, y firma de las respuestas (la Directora Ejecutiva en
  Oficina Central y los directores regionales en regiones). Comprometidas por Galit y Leslie.
- Matriz de datos personales: la contraparte la compartió en un documento de Google Sheets y en un
  archivo Excel consolidado. La maqueta muestra cuatro filas de ejemplo.
- Representante legal y política de seguridad de la información (ítems 5 y 7 de la página de datos
  personales).
- Identificación con número de carnet en lugar de fotocopia de la cédula (observación de la reunión
  del 15-10-2026).
- Precisar el plazo cuando la solicitud se deniega por falta de antecedentes.

## Pruebas

La carpeta `pruebas/` contiene pruebas funcionales con Playwright (Chromium, sin red) que recorren
`index.html`:

- `recorrido_caso.py`: recorrido completo de una solicitud, de punto 1 a punto 10, para titular,
  representante con poder notarial y heredero. Genera capturas en `pruebas/capturas/` (no se versionan).
- `probar_v35.py`: numeración de los puntos, «Datos Personales» como punto 2 y «Volver al punto anterior».
- `probar_v33.py`: cascada Región → Provincia → Comuna.
- `probar_v3.py` y `probar_v31.py`: flujo del formulario, gestión interna, tablero y vías de ingreso.

Ejecución (desde la raíz del repositorio):

```bash
python3 pruebas/recorrido_caso.py
```

Requiere `playwright` para Python con Chromium instalado.

## Contenido del repositorio

- `index.html`: la maqueta completa en un solo archivo (código y estilos incluidos). Es la versión
  publicada en GitHub Pages.
- `CON012_maqueta_canal_ley21719_2.html`: versión anterior de la maqueta (v0.5), con su nombre de archivo
  original. Se conserva como referencia.

Norma de referencia: Ley N° 21.719, que regula la protección y el tratamiento de los datos personales
(vigencia 01-12-2026), y el procedimiento institucional V1 de atención de solicitudes de derechos. La
guía de implementación de la Secretaría General de Gobierno se usó para el contenido del art. 14 ter.
