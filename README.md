# coipo_ley_datos_personales — Maqueta del canal de ejercicio de derechos (Ley N° 21.719)

Maqueta de validación del canal por el que las personas ejercen ante CONAF sus derechos
sobre datos personales (acceso, rectificación, supresión, oposición, portabilidad y
bloqueo temporal), según la Ley N° 21.719. Iniciativa CON012, elaborada por la Unidad de
Información y Análisis (UIA), línea de Gobernanza de Datos.

**Ver la maqueta:** https://alvarozvjac.github.io/coipo_le_datos_personales/

> Demostración no operacional. Personas, RUN, casos y fechas son ficticios (fecha simulada:
> 20-10-2026) y nada se envía a un servidor. El ingreso con Clave Única está simulado; CONAF no cuenta hoy con ClaveÚnica, que queda
> como etapa posterior. La maqueta sirve para validar el flujo y el alcance con la contraparte, Fiscalía y el
> Departamento de Informática.

## Cómo probarla

La maqueta se recorre por pestañas, en el orden en que avanza una solicitud:

| Pestaña | Qué se puede probar |
|---|---|
| 1 · Banner en conaf.cl | Simulación de la portada de conaf.cl con el banner, el enlace del pie y la casilla propuestos (destacados en amarillo), y la página general de protección de datos personales con los contenidos del art. 14 ter |
| 2 · Identificación | Ingreso con Clave Única (simulado); quien no la tenga presenta la solicitud en Oficina de Partes; actuar como titular, representante (con poder notarial) o heredero |
| 3 · Formulario | Elegir uno o más derechos (los campos cambian según el derecho), adjuntar antecedentes y elegir el medio de respuesta |
| 4 · Acuse de recibo | Número de caso, plazos que se activan y derechos de la persona durante el trámite |
| 5 · Gestión interna | **Tablero de control** (casos abiertos, cumplimiento de plazos, riesgo de vencimiento, etapas donde se demoran los casos, solicitudes por mes y por derecho, vía y ámbito) y **Mis tareas** (lo que le toca a cada perfil, ordenado por urgencia, con el expediente y sus acciones; registro manual de solicitudes recibidas por otras vías para el encargado de recepción) |
| 6 · Flujo y plazos | Etapas de gestión, responsables, contenido de la Carta Oficial, reglas de plazo y requisitos para la versión institucional |
| 7 · Perfiles | Los seis perfiles propuestos y su matriz de permisos |
| 8 · Vías de ingreso | Formulario web, correo de Oficina de Partes, casilla dedicada, carta y OIRS llegando al mismo registro; botón «Simular registro» por vía |

Para ver el flujo completo, envíe una solicitud desde la pestaña 3 (o use el caso de
ejemplo **DP-2026-000123**) y luego, en la pestaña 5 · Gestión interna, abra **Mis tareas** y
elija el perfil que trabaja: Jefatura receptora, Encargado/a de recepción, Fiscalía, Gerencia
(GEDEP) o Administrador. Cada perfil ve solo sus tareas, ordenadas por urgencia. El historial
de solicitudes desde mayo de 2026 que alimenta el tablero es ficticio.

## Contenido del repositorio

- `index.html`: la maqueta completa en un solo archivo (código y estilos incluidos). Es
  la versión publicada en GitHub Pages (v1.2, 27-10-2026: observaciones de Fiscalía del
  15-10-2026, ingreso con Clave Única, vías de ingreso, tablero de control y Mis tareas). Las definiciones jurídicas pendientes se tratan con Fiscalía en un
  documento aparte.
- `CON012_maqueta_canal_ley21719_2.html`: versión anterior de la maqueta (v0.5), con su
  nombre de archivo original. Se conserva como referencia.

Norma de referencia: Ley N° 21.719, que regula la protección y el tratamiento de los
datos personales (vigencia 01-12-2026), y el procedimiento institucional V1 de atención
de solicitudes de derechos.
