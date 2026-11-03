/* CON012 · utilidades comunes de la maqueta (fechas, plazos, chips, capas).
   Formato tomado de coipo_gestion_flota_vehiculos v0.4 (navegación por perfil, Inicio con tarjetas, panel lateral). */
"use strict";

/* ---------- Fecha simulada ---------- */
const HOY = "2027-01-11"; // lunes; la ley rige desde el 01-12-2026 [VERIFICAR con el delegado]

const $ = s => document.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const DSL = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const F = s => { const [a, m, d] = s.slice(0, 10).split("-").map(Number); return new Date(a, m - 1, d, 12); };
const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const fF = s => s ? s.slice(8, 10) + "-" + s.slice(5, 7) + "-" + s.slice(0, 4) : "—";
const fLarga = s => { const d = F(s); return DSL[d.getDay()] + " " + fF(s); };
const fCorta = s => { const d = F(s); return DS[d.getDay()] + " " + d.getDate() + " " + MESES[d.getMonth()].slice(0, 3); };
const sumaCorridos = (s, n) => { const d = F(s); d.setDate(d.getDate() + n); return iso(d); };
const corridosEntre = (a, b) => Math.round((F(b) - F(a)) / 86400000);
const esFeriado = s => PARAM.feriados.some(f => f.f === s);
const esHabil = s => { const g = F(s).getDay(); return g !== 0 && g !== 6 && !esFeriado(s); };
function sumaHabiles(s, n) { let d = s, k = 0; while (k < n) { d = sumaCorridos(d, 1); if (esHabil(d)) k++; } return d; }
function habilesEntre(a, b) { // días hábiles desde a (exclusive) hasta b (inclusive); negativo si b < a
  if (a === b) return 0;
  const sg = a < b ? 1 : -1; let d = a, k = 0;
  while (d !== b) { d = sumaCorridos(d, sg); if (esHabil(d)) k += sg; }
  return k;
}

/* ---------- RUN ficticio: dígito verificador inválido a propósito ---------- */
function dvValido(n) { let s = 0, m = 2; for (const c of String(n).split("").reverse()) { s += +c * m; m = m === 7 ? 2 : m + 1; } const r = 11 - (s % 11); return r === 11 ? "0" : r === 10 ? "K" : String(r); }
function runFicticio(n) {
  const v = dvValido(n), orden = "0123456789K", malo = orden[(orden.indexOf(v) + 3) % 11];
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + malo;
}
const runMascara = r => r ? r.replace(/^(\d{1,2})\.(\d{3})\.(\d{3})/, "$1.•••.•••") : "—";

/* ---------- Chips: forma + etiqueta + color (UI-13) ---------- */
// Componente Estado de la semilla (UI-13/UI-14): glifo + etiqueta + tono. Los nombres c-* son tonos de la maqueta.
const TONO = { "c-disp": "correcto", "c-malo": "error", "c-pend": "aviso", "c-res": "info", "c-terr": "info", "c-tall": "aviso", "c-excl": "neutro", "c-neu": "neutro" };
const chip = (txt, cls, ico) => `<span class="estado ${TONO[cls] || "neutro"}"><span class="estado-glifo" aria-hidden="true">${ico}</span>${esc(txt)}</span>`;
const porDefinir = (txt = "Por definir") => chip(txt, "c-pend", "?");
const ico = (n, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;

/* ---------- Capas ---------- */
function tostada(t) { const c = $("#tostadas"); while (c.children.length >= 2) c.firstChild.remove(); const d = document.createElement("div"); d.className = "tostada"; d.textContent = t; c.appendChild(d); setTimeout(() => d.remove(), 4200); }
function cerrarCapa() { $("#capa").innerHTML = ""; }
let alCerrarCajon = null;
function cajon(titulo, sub, cuerpo, alCerrar) {
  alCerrarCajon = alCerrar || null;
  const yaAbierto = !!$("#capa .cajon"); // al repintar el mismo panel no se repite la entrada
  $("#capa").innerHTML = `<div class="velo" id="velo"><div class="cajon" role="dialog" aria-modal="true" aria-labelledby="t-cajon"><header><div style="display:flex;gap:var(--e-3);align-items:center;flex-wrap:wrap;min-width:0"><h2 id="t-cajon" style="font-size:var(--f-xl)">${titulo}</h2>${sub ? `<span class="sub">${sub}</span>` : ""}</div><button class="boton secundario chico" type="button" id="cerrar">Cerrar</button></header><div class="cuerpo">${cuerpo}</div></div></div>`;
  if (yaAbierto) $("#capa .cajon").classList.add("sin-entrada");
  const fin = () => { cerrarCapa(); if (alCerrarCajon) alCerrarCajon(); };
  $("#cerrar").onclick = fin; $("#velo").onclick = e => { if (e.target.id === "velo") fin(); };
  $("#cerrar").focus();
}
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#capa").innerHTML) { cerrarCapa(); if (alCerrarCajon) alCerrarCajon(); } });

const POST = {}; // acciones que cada vista engancha después de pintarse

/* ---------- Piezas de vista ---------- */
const cab = (t, d, ref) => `<div class="cab-vista"><div><h1>${t}</h1>${d ? `<p>${d}</p>` : ""}</div>${ref ? `<span class="ref-ers">${ref}</span>` : ""}</div>`;
const vacio = (t, d) => `<div class="vacio">${ico("check")}<h3>${esc(t)}</h3>${d ? `<p>${esc(d)}</p>` : ""}</div>`;
const tabsHTML = (lista, act, attr) => `<div class="subtabs" role="tablist">${lista.map(([k, t]) => `<button type="button" role="tab" ${attr}="${k}" aria-selected="${act === k}">${t}</button>`).join("")}</div>`;
const filtrosHTML = (lista, act, attr) => `<div class="filtros" role="group">${lista.map(([k, t, n]) => `<button type="button" class="filtro" ${attr}="${k}" aria-pressed="${act === k}">${t}${n != null ? `<span class="n">${n}</span>` : ""}</button>`).join("")}</div>`;
function heroHTML(eyebrow, saludo, txt) {
  return `<section class="hero"><div style="position:relative;z-index:1"><span class="eyebrow">${ico("escudo")}${esc(eyebrow)}</span><h1>${esc(saludo)}</h1><p>${txt}</p></div><span class="fecha">${ico("calendario")}${fLarga(HOY)}</span></section>`;
}
let ACCESOS = [];
function accesosHTML(lista, agregar) { // agregar: suma a los accesos ya pintados (segunda sección del inicio)
  const base = agregar ? ACCESOS.length : 0;
  ACCESOS = agregar ? ACCESOS.concat(lista) : lista;
  return `<div class="accesos">${lista.map((a, k) => { const i = base + k; return `<button type="button" class="acceso ${a.principal ? "principal" : ""}" data-acc="${i}">${a.n ? `<span class="a-cuenta num ${a.aviso ? "aviso" : ""}" aria-label="${a.n} ${esc(a.nl || "pendientes")}">${a.n}</span>` : ""}<span class="a-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-${a.ico}"/></svg></span><h3>${a.t}</h3><p>${a.d}</p><span class="a-pie">${a.cta}${ico("flecha")}</span></button>`; }).join("")}</div>`;
}
function postAccesos() { $$("#vista [data-acc]").forEach(b => b.onclick = () => { const a = ACCESOS[+b.dataset.acc]; if (a.pre) a.pre(); ir(a.v); }); }
const volverHTML = (txt = "Volver al inicio") => `<div class="acciones" style="margin-bottom:var(--e-4)"><button class="boton secundario chico" type="button" data-ir="inicio">${ico("home")}${txt}</button></div>`;
