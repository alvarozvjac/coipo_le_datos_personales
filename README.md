# coipo_ley_datos_personales — Maqueta del canal de ejercicio de derechos (Ley N° 21.719)

Maqueta de validación del canal por el que las personas ejercen ante CONAF sus derechos
sobre datos personales (acceso, rectificación, supresión, oposición, portabilidad y
bloqueo temporal), según la Ley N° 21.719. Iniciativa CON012, elaborada por la Unidad de
Información y Análisis (UIA), línea de Gobernanza de Datos.

**Ver la maqueta:** https://alvarozvjac.github.io/coipo_le_datos_personales/

> Demostración no operacional. Personas, RUN, casos y fechas son ficticios (fecha simulada:
> 20-10-2026) y nada se envía a un servidor. La verificación de identidad (copia de cédula o
> correo verificado con código) está simulada; CONAF no cuenta hoy con ClaveÚnica, que queda
> como etapa posterior. La maqueta sirve para validar el flujo, el alcance y las definiciones
> jurídicas con la contraparte, Fiscalía y el Departamento de Informática.

## Cómo probarla

La maqueta se recorre por pestañas, en el orden en que avanza una solicitud:

| Pestaña | Qué se puede probar |
|---|---|
| 1 · Banner en conaf.cl | Simulación de la portada de conaf.cl con el banner, el enlace del pie y la casilla propuestos (destacados en amarillo), y los contenidos del art. 14 ter |
| 2 · Identificación | Identificación con copia de cédula (vía principal) o con correo verificado, acreditando la identidad antes de entregar la respuesta; actuar como titular, representante o heredero |
| 3 · Formulario | Elegir uno o más derechos (los campos cambian según el derecho), adjuntar antecedentes y elegir el medio de respuesta |
| 4 · Acuse de recibo | Número de caso, plazos que se activan y derechos de la persona durante el trámite |
| 5 · Bandeja interna | Gestión de casos con semáforo de plazos; selector **«Ver como»** para actuar con cada perfil interno; registro manual de solicitudes recibidas por otras vías (perfil Encargado/a de recepción) |
| 6 · Flujo y plazos | Etapas de gestión, responsables, contenido de la Carta Oficial y reglas de plazo |
| 7 · Perfiles | Los seis perfiles propuestos y su matriz de permisos |
| 8 · Vías de ingreso | Formulario web, correo de Oficina de Partes, casilla dedicada, carta y OIRS llegando al mismo registro; botón «Simular registro» por vía |
| 9 · Definiciones Fiscalía | Preguntas jurídicas con su efecto inmediato en el canal y acta de definiciones copiable |

Para ver el flujo completo, envíe una solicitud desde la pestaña 3 (o use el caso de
ejemplo **DP-2026-000123**) y luego, en la bandeja interna, cambie de perfil con
**«Ver como»**: Jefatura de la unidad receptora, Encargado/a de recepción, Fiscalía,
Gerencia responsable (GEDEP) y Administrador de plataforma. El panel indica en cada
momento qué perfil debe actuar.

## Contenido del repositorio

- `index.html`: la maqueta completa en un solo archivo (código y estilos incluidos). Es
  la versión publicada en GitHub Pages (v0.8, 27-10-2026: identificación sin ClaveÚnica,
  vías de ingreso y definiciones para Fiscalía).
- `CON012_maqueta_canal_ley21719_2.html`: versión anterior de la maqueta (v0.5), con su
  nombre de archivo original. Se conserva como referencia.

Norma de referencia: Ley N° 21.719, que regula la protección y el tratamiento de los
datos personales (vigencia 01-12-2026), y el procedimiento institucional V1 de atención
de solicitudes de derechos.
