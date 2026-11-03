/* CON012 · datos de la maqueta. Todo es ficticio salvo lo marcado con su fuente.
   Fuentes verificadas: correo del delegado de protección de datos del 28-10-2026 (vías de ingreso: formulario web con
   Clave Única y formulario físico en Oficina de Partes; perfiles y flujos los levanta la contraparte);
   observaciones de la reunión del 15-10-2026 (poder notarial, detalle obligatorio, retiro sólo en Oficinas de Partes). */
"use strict";

/* ---------- Parámetros del canal (editables en Administración) ---------- */
const PARAM = {
  // Plazos legales, según lo que citaba la v3.7 (art. 11, 8° ter, 41 de la Ley N° 21.719). [VERIFICAR con el delegado]
  legal: [
    { k: "respuesta", n: "Respuesta a la solicitud", v: "30 días corridos desde el ingreso", art: "art. 11" },
    { k: "prorroga", n: "Prórroga", v: "Una vez, hasta 30 días corridos, comunicada antes del vencimiento", art: "art. 11" },
    { k: "bloqueo", n: "Bloqueo temporal", v: "2 días hábiles", art: "art. 8° ter" },
    { k: "antecedentes", n: "Plazo del titular para aportar antecedentes", v: "5 días hábiles", art: "propuesta, sin norma expresa" },
    { k: "reclamo", n: "Reclamo ante la Agencia", v: "30 días hábiles desde la denegación", art: "art. 11 y 41" }
  ],
  RESPUESTA: 30, PRORROGA: 30, BLOQUEO: 2, ANTECEDENTES: 5,
  // Plazos internos por etapa: vacíos hasta que la contraparte los defina (días hábiles).
  interno: { recepcion: null, admisibilidad: null, derivacion: null, analisis: null, revision: null, firma: null, respuesta: null },
  // A qué sede se asignan las solicitudes web: por definir. Mientras tanto, Oficina Central.
  sedeWeb: "pendiente",
  feriados: [
    { f: "2026-12-08", n: "Inmaculada Concepción" }, { f: "2026-12-25", n: "Navidad" }, { f: "2027-01-01", n: "Año Nuevo" }
  ]
};

/* ---------- Sedes: Oficina Central y 16 direcciones regionales ---------- */
const SEDES = ["Oficina Central"].concat(TERRITORIO.map(r => "Dirección Regional " + r.r));
const corta = s => s === "Oficina Central" ? "Oficina Central" : s.replace("Dirección Regional ", "DR ");

/* ---------- Etapas del flujo interno (procedimiento V1 tal como lo citaba la v3.7; responsables por definir) ---------- */
const ETAPAS = [
  { k: "recepcion", n: "Recepción y registro", col: "recibe", hace: "Registra la fecha de ingreso, verifica identidad y representación y acusa recibo." },
  { k: "admisibilidad", n: "Admisibilidad", col: "admisibilidad", hace: "Resuelve si la solicitud procede (Fiscalía, según la reunión del 08-09-2026)." },
  { k: "derivacion", n: "Derivación", col: "deriva", hace: "Asigna el caso al área que trata los datos." },
  { k: "analisis", n: "Análisis y propuesta", col: "ambito", hace: "Localiza los datos, decide y redacta la propuesta de respuesta." },
  { k: "revision", n: "Revisión jurídica", col: "revision", hace: "Revisa la propuesta antes de la firma." },
  { k: "firma", n: "Firma", col: "firma", hace: "Firma de la respuesta (quién firma en Oficina Central y en regiones: por definir)." },
  { k: "respuesta", n: "Respuesta y cierre", col: "responde", hace: "Envía la respuesta por el medio indicado y guarda el respaldo." }
];
const ETAPA = Object.fromEntries(ETAPAS.map(e => [e.k, e]));
const COLS = [["recibe", "Recibe y registra"], ["admisibilidad", "Admisibilidad"], ["deriva", "Deriva"], ["revision", "Revisión jurídica"], ["firma", "Firma"], ["responde", "Responde y cierra"]];

/* ---------- Perfiles y usuarios de prueba (ficticios) ---------- */
const PERFILES = {
  solicitante: { n: "Persona solicitante", ico: "user", d: "Sitio público: página de datos personales, solicitud y consulta de sus casos." },
  recepcion: { n: "Recepción", ico: "oficina", d: "Recibe, registra, verifica identidad, deriva y envía la respuesta." },
  fiscalia: { n: "Fiscalía", ico: "balanza", d: "Admisibilidad, bloqueo temporal y revisión jurídica." },
  gerencia: { n: "Área responsable de los datos", ico: "equipo", d: "Analiza y propone la respuesta de los casos de su ámbito." },
  admin: { n: "Administración del canal", ico: "config", d: "Responsables por etapa y sede, plazos internos, feriados y bitácora." }
};
const USUARIOS = [
  { id: "u1", perfil: "solicitante", nom: "Carolina Andrea Muñoz Pérez", run: runFicticio(16482337), cargo: "Titular de los datos" },
  { id: "u2", perfil: "recepcion", nom: "Paula Rojas Soto", cargo: "Oficina Central" },
  { id: "u3", perfil: "recepcion", nom: "Marcelo Fuentes Díaz", cargo: "Dirección Regional Biobío" },
  { id: "u4", perfil: "fiscalia", nom: "Andrés Contreras Silva", cargo: "Abogado de Fiscalía" },
  { id: "u5", perfil: "gerencia", nom: "Natalia Herrera Torres", cargo: "Analista del ámbito Personal y ex funcionarios" },
  { id: "u6", perfil: "admin", nom: "Valeria Soto Araya", cargo: "Usuario de prueba" }
];
const U = Object.fromEntries(USUARIOS.map(u => [u.id, u]));
const nomU = id => U[id] ? U[id].nom : "—";

/* ---------- Responsables por sede y etapa ----------
   Por definir (pendiente de la contraparte, correo del 28-10-2026).
   Oficina Central y Biobío llevan una asignación DE PRUEBA para que la maqueta se pueda recorrer. */
const RESP = Object.fromEntries(SEDES.map(s => [s, { recibe: null, admisibilidad: null, deriva: null, revision: null, firma: null, responde: null, prueba: false }]));
Object.assign(RESP["Oficina Central"], { recibe: "u2", admisibilidad: "u4", deriva: "u2", revision: "u4", responde: "u2", prueba: true });
Object.assign(RESP["Dirección Regional Biobío"], { recibe: "u3", admisibilidad: "u4", deriva: "u3", revision: "u4", responde: "u3", prueba: true });

/* Ámbitos de datos: EJEMPLO hasta cargar la matriz de datos personales que compartió el delegado el 28-10-2026. */
const AMBITOS = [
  { k: "personal", n: "Personal y ex funcionarios", resp: "u5" },
  { k: "asp", n: "Áreas Silvestres Protegidas", resp: null },
  { k: "fiscalizacion", n: "Fiscalización forestal", resp: null },
  { k: "programas", n: "Programas y beneficios", resp: null },
  { k: "tramites", n: "Trámites forestales", resp: null }
];
const AMB = k => AMBITOS.find(a => a.k === k);

/* ---------- Derechos (Ley N° 21.719, según la v3.7) ---------- */
const DERECHOS = [
  { k: "acceso", n: "Acceso", d: "Saber si CONAF trata sus datos, cuáles, con qué fin y a quién los comunica." },
  { k: "rectificacion", n: "Rectificación", d: "Corregir datos inexactos, desactualizados o incompletos." },
  { k: "supresion", n: "Supresión", d: "Eliminar sus datos, en los casos que la ley permite." },
  { k: "oposicion", n: "Oposición", d: "Que CONAF no realice un tratamiento específico de sus datos." },
  { k: "portabilidad", n: "Portabilidad", d: "Recibir una copia de sus datos en formato estructurado." },
  { k: "bloqueo", n: "Bloqueo temporal", d: "Suspender el tratamiento mientras se resuelve otra solicitud. Se resuelve en 2 días hábiles." }
];
const DER = Object.fromEntries(DERECHOS.map(d => [d.k, d.n]));
const VIAS = { web: "Formulario web", fisica: "Formulario físico · Oficina de Partes" };
const MEDIOS = { correo: "Correo electrónico", carta: "Carta al domicilio", retiro: "Retiro en Oficina de Partes" };
const CALIDAD = { titular: "Titular", representante: "Representante con poder notarial", heredero: "Heredero de titular fallecido" };

/* ---------- Casos ficticios ---------- */
const NOMBRES = ["Javiera Soto Rivas", "Felipe Araya Morales", "Rosa Contreras León", "Tomás Sepúlveda Vera", "Elena Díaz Bravo", "Héctor Pinto Lagos", "Sofía Torres Garrido", "Diego Fuentes Lara", "Patricia Vidal Cáceres", "Luis Molina Reyes", "Francisca Navarro Gómez", "Jorge Espinoza Toro", "Camila Ortiz Vargas", "Matías Castro Peña"];
function nuevoCaso(o) {
  return Object.assign({ via: "web", sede: "Oficina Central", calidad: "titular", derechos: ["acceso"], detalle: "", medio: "correo", correo: "correo@ejemplo.cl", etapa: "recepcion", desde: o.ingreso, identidad: false, ambito: null, prorroga: null, ant: null, bloq: null, decision: null, propuesta: "", firma: null, cierre: null, bit: [] }, o);
}
let n0 = 0;
const T = (num, ingreso, o) => { const i = n0++; return nuevoCaso(Object.assign({ num, ingreso, tit: { nom: NOMBRES[i % NOMBRES.length], run: runFicticio(9100000 + i * 731177) } }, o)); };
const CASOS = [
  T("DP-2026-000101", "2026-12-02", { etapa: "cerrado", identidad: true, ambito: "personal", desde: "2026-12-28", detalle: "Antecedentes de mi hoja de vida funcionaria entre 2015 y 2019.", cierre: { f: "2026-12-28", res: "Acogida", medio: "correo" }, tit: { nom: USUARIOS[0].nom, run: USUARIOS[0].run } }),
  T("DP-2026-000102", "2026-12-03", { via: "fisica", folio: "OP-OC-4410", derechos: ["rectificacion"], etapa: "cerrado", identidad: true, ambito: "personal", desde: "2027-01-04", detalle: "Corregir mi domicilio registrado.", medio: "carta", cierre: { f: "2027-01-04", res: "Acogida", medio: "carta" } }),
  T("DP-2026-000103", "2026-12-04", { derechos: ["supresion"], etapa: "cerrado", identidad: true, desde: "2026-12-10", detalle: "Eliminar mis datos de una denuncia.", cierre: { f: "2026-12-10", res: "No admitida", causal: "Los datos se tratan en cumplimiento de una función pública" } }),
  T("DP-2026-000104", "2026-12-09", { etapa: "firma", identidad: true, ambito: "personal", desde: "2027-01-05", detalle: "Copia de los datos de mi postulación a un concurso.", decision: "Acoge", propuesta: "Se entregan los datos solicitados." }),
  T("DP-2026-000105", "2026-12-11", { via: "fisica", folio: "OP-OC-4471", derechos: ["oposicion"], etapa: "revision", identidad: true, ambito: "programas", desde: "2027-01-07", prorroga: "2027-01-06", detalle: "Oponerme al uso de mi teléfono para encuestas.", decision: "Acoge parcialmente", propuesta: "Se suspende el uso para encuestas; se mantiene para el programa." }),
  T("DP-2026-000106", "2026-12-14", { derechos: ["acceso", "rectificacion"], etapa: "analisis", identidad: true, ambito: "personal", desde: "2026-12-21", detalle: "Revisar mis datos previsionales y corregir la AFP registrada." }),
  T("DP-2026-000107", "2026-12-15", { via: "fisica", folio: "OP-BIO-0218", sede: "Dirección Regional Biobío", etapa: "analisis", identidad: true, ambito: "asp", desde: "2026-12-22", detalle: "Saber qué datos guardan de mis visitas a un parque.", medio: "retiro", retiro: "Dirección Regional Biobío" }),
  T("DP-2026-000108", "2026-12-21", { derechos: ["rectificacion", "bloqueo"], etapa: "analisis", identidad: true, ambito: "personal", desde: "2026-12-28", bloq: { pide: "2026-12-21", res: "Acogido", f: "2026-12-22" }, detalle: "Mi nombre figura mal escrito en un certificado." }),
  T("DP-2026-000109", "2026-12-22", { via: "fisica", folio: "OP-VAL-0094", sede: "Dirección Regional Valparaíso", etapa: "recepcion", desde: "2026-12-22", detalle: "Acceso a los datos de mi permiso de corta.", medio: "carta" }),
  T("DP-2026-000110", "2026-12-28", { derechos: ["portabilidad"], etapa: "derivacion", identidad: true, desde: "2027-01-05", detalle: "Copia de mis datos de un trámite en línea en formato CSV." }),
  T("DP-2026-000111", "2026-12-29", { via: "fisica", folio: "OP-OC-4502", etapa: "respuesta", identidad: true, ambito: "personal", desde: "2027-01-08", decision: "Acoge", propuesta: "Se entregan los datos solicitados.", firma: { f: "2027-01-08", doc: "Carta Oficial N° 18 (ficticia)" }, detalle: "Datos de mis licencias médicas registradas.", medio: "retiro", retiro: "Oficina Central" }),
  T("DP-2027-000001", "2027-01-04", { etapa: "admisibilidad", identidad: true, desde: "2027-01-05", ant: { pide: "2027-01-05", que: "Indique el año aproximado y la oficina donde realizó el trámite." }, detalle: "Datos de un trámite que hice en una oficina.", tit: { nom: USUARIOS[0].nom, run: USUARIOS[0].run } }),
  T("DP-2027-000002", "2027-01-06", { via: "fisica", folio: "OP-BIO-0231", sede: "Dirección Regional Biobío", derechos: ["supresion"], etapa: "admisibilidad", identidad: true, desde: "2027-01-07", detalle: "Eliminar mi correo de una lista de difusión." }),
  T("DP-2027-000003", "2027-01-08", { derechos: ["oposicion", "bloqueo"], etapa: "admisibilidad", identidad: true, desde: "2027-01-08", bloq: { pide: "2027-01-08", res: null }, detalle: "Oponerme a que mis datos se usen en un estudio." }),
  T("DP-2027-000004", "2027-01-11", { etapa: "recepcion", desde: "2027-01-11", detalle: "Saber qué datos personales tiene CONAF de mí." }),
  T("DP-2027-000005", "2027-01-07", { via: "fisica", folio: "OP-LAG-0057", sede: "Dirección Regional Los Lagos", derechos: ["rectificacion"], etapa: "recepcion", desde: "2027-01-07", detalle: "Corregir mi fecha de nacimiento.", medio: "carta" })
];
CASOS.forEach(c => {
  c.bit.push({ f: c.ingreso, u: c.via === "web" ? "Sistema" : "Recepción", a: c.via === "web" ? "Ingreso por formulario web · acuse enviado" : "Registro manual · formulario físico " + (c.folio || "") });
  if (c.etapa !== "recepcion") c.bit.push({ f: c.desde, u: "—", a: "En etapa: " + (ETAPA[c.etapa] ? ETAPA[c.etapa].n : "cerrado") });
});
const BIT = []; // bitácora global (Administración)
let correlativo = { "2027": 6 };
