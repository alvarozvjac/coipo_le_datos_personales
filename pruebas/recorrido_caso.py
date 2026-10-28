"""Recorrido completo de una solicitud (puntos 1 a 10) para las tres figuras de solicitante:
titular, representante con poder notarial y heredero. Playwright, Chromium, sin red.
Genera capturas en pruebas/capturas/recorrido_<figura>_<punto>.png"""
import pathlib, sys
from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
URL = (RAIZ / "index.html").as_uri()
CAPT = RAIZ / "pruebas" / "capturas"
CAPT.mkdir(parents=True, exist_ok=True)
FOTO = str(RAIZ / "pruebas" / "cedula_ficticia.png")
ORDEN = ["v-sitio", "v-info", "v-ident", "v-form", "v-acuse", "v-bandeja", "v-caso", "v-flujo", "v-perfiles", "v-vias"]

fallos, errores = [], []
resumen = []

def check(cond, msg):
    print(("OK   " if cond else "FALLA") + " " + msg)
    if not cond:
        fallos.append(msg)

def activa(pg):
    return pg.evaluate("document.querySelector('.vista.activa').id")

def captura(pg, figura, punto):
    pg.wait_for_timeout(120)
    pg.screenshot(path=str(CAPT / f"recorrido_{figura}_{punto}.png"), full_page=True)

def perfil(pg, v):
    pg.evaluate(f"cambiaPerfil('{v}');muestraSub('tareas')")

def accion(pg, code):
    pg.click(f"#detalle button[onclick*=\"'{code}'\"]")

def abrir(pg, n):
    pg.evaluate(f"ver('{n}')")

FIGURAS = [
    # figura, rol, RUN del solicitante, medio, datos extra
    ("titular", "titular", None, "correo"),
    ("representante", "rep", "9.876.543-3", "carta"),
    ("heredero", "her", "15.123.456-9", "pres"),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    for figura, rol, run, medio in FIGURAS:
        print(f"\n=== Figura: {figura} ===")
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.on("console", lambda m: m.type == "error" and errores.append(f"{figura}: {m.text}"))
        pg.on("pageerror", lambda e: errores.append(f"{figura}: {e}"))
        pg.on("dialog", lambda d: d.accept("Nota de prueba"))
        pg.goto(URL)

        # Punto 1 → 2: portada, «Datos Personales»
        captura(pg, figura, "1")
        pg.click("#v-sitio .cs-tile.nuevo")
        check(activa(pg) == "v-info", f"{figura}: punto 1 lleva al punto 2")
        check(pg.locator("#v-info .pd-item").count() == 11, f"{figura}: punto 2 muestra los 11 ítems")
        captura(pg, figura, "2")

        # Punto 2 → 3: identificación
        pg.click("#v-info button:has-text('Continuar al punto 3')")
        check(activa(pg) == "v-ident", f"{figura}: punto 2 continúa al punto 3")
        pg.click("#v-ident button:has-text('Volver al punto 2')")
        check(activa(pg) == "v-info", f"{figura}: «Volver al punto 2» regresa a la página de datos personales")
        pg.click("#v-info button:has-text('Continuar al punto 3')")

        pg.click("#btnCU")
        pg.wait_for_timeout(900)
        check(pg.is_visible("#cuOk"), f"{figura}: identificado con Clave Única (simulada)")
        pg.select_option("#rol", rol)
        if rol == "rep":
            check("notarial" in pg.inner_text("#lblRepDoc"), f"{figura}: pide poder notarial")
            pg.fill("#repRun", run)
            pg.fill("#repNombre", "Carolina Muñoz Soto")
            pg.set_input_files("#repDoc", FOTO)
        if rol == "her":
            check("Posesión efectiva" in pg.inner_text("#lblRepDoc") or "posesión efectiva" in pg.inner_text("#lblRepDoc").lower(), f"{figura}: pide posesión efectiva")
            pg.fill("#repRun", run)
            pg.fill("#repNombre", "Tomás Herrera Pino")
            pg.set_input_files("#repDoc", FOTO)
        captura(pg, figura, "3")
        pg.click("section#v-ident button[onclick*='muestraPaso(2)']")
        check(activa(pg) == "v-form", f"{figura}: punto 3 continúa al punto 4")

        # Punto 4 · Paso 2: derechos (dos derechos para ejercer el caso con varios)
        pg.click(".derecho[data-d='acceso']")
        pg.click(".derecho[data-d='rect']")
        pg.fill("#bd-acceso textarea", f"Antecedentes de {figura}: registros de trámites 2015-2020")
        pg.fill("#bd-rect textarea", f"Corrección de domicilio registrado en {figura}")
        pg.locator("#bd-rect input").nth(0).fill("Av. Antigua 100, Ovalle")
        pg.locator("#bd-rect input").nth(1).fill("Av. Nueva 200, Ovalle")
        pg.click("#btnSig")

        # Paso 3: medio de respuesta
        pg.select_option("#medio", medio)
        if medio == "correo":
            pg.fill("#correo", "persona@correo.cl")
        if medio == "carta":
            pg.select_option("#selRegion", label="Coquimbo")
            pg.select_option("#selProvincia", label="Limarí")
            pg.select_option("#selComuna", label="Ovalle")
            pg.fill("#dom input", "Av. Ejemplo 123")
            check(pg.locator("#selComuna option").count() > 2, f"{figura}: comuna depende de región y provincia")
        if medio == "pres":
            pg.select_option("#ofi select", label="Oficina de Partes · Dirección Regional Coquimbo")
        captura(pg, figura, "4")
        pg.click("#btnSig")

        # Paso 4: declaración y envío
        pg.check("#decl")
        pg.click("#btnEnviar")
        pg.wait_for_timeout(1000)
        check(activa(pg) == "v-acuse", f"{figura}: el envío lleva al punto 5 · Acuse")
        num = pg.inner_text("#acNum")
        check(num.startswith("DP-2026-"), f"{figura}: número de caso {num}")
        captura(pg, figura, "5")
        resumen.append((figura, num))

        # Punto 6 · Mi panel (equipo interno)
        pg.click("#v-acuse button:has-text('Volver al punto')")
        pg.click("nav button[data-v='v-bandeja']")
        check(activa(pg) == "v-bandeja", f"{figura}: punto 6 · Mi panel")
        pg.evaluate(f"ir('v-bandeja')")
        perfil(pg, "jefatura")
        abrir(pg, num)
        check(num in pg.inner_text("#detalle"), f"{figura}: el caso aparece en la bandeja de la jefatura")
        captura(pg, figura, "6")

        # Ciclo de gestión: jefatura → Fiscalía → Gerencia → Fiscalía → firma → envío
        accion(pg, "verif")
        check("Verificada" in pg.inner_text("#detalle") or "verific" in pg.inner_text("#detalle").lower(), f"{figura}: identidad verificada")
        perfil(pg, "fiscalia"); abrir(pg, num); accion(pg, "adm")
        check("Admisible" in pg.inner_text("#detalle"), f"{figura}: admisibilidad resuelta por Fiscalía")
        perfil(pg, "jefatura"); abrir(pg, num); accion(pg, "derivar")
        perfil(pg, "gerencia"); abrir(pg, num); accion(pg, "acoge")
        perfil(pg, "fiscalia"); abrir(pg, num); accion(pg, "conforme")
        perfil(pg, "jefatura"); abrir(pg, num); accion(pg, "firma")
        perfil(pg, "jefatura"); abrir(pg, num)
        accion(pg, "enviar")
        check("Respondida" in pg.inner_text("#detalle"), f"{figura}: caso termina en Respondida")

        # Punto 7 · Flujo de un caso: el caso aparece en el recorrido
        pg.click("nav button[data-v='v-caso']")
        check(activa(pg) == "v-caso", f"{figura}: punto 7 · Flujo de un caso")
        captura(pg, figura, "7")
        pg.click("#v-caso button:has-text('Volver al punto')")
        check(activa(pg) == "v-bandeja", f"{figura}: «Volver al punto 6» desde el punto 7")
        pg.click("nav button[data-v='v-caso']")

        # Punto 8 · Flujo y plazos
        pg.click("nav button[data-v='v-flujo']")
        check("Requisitos para la versión institucional" in pg.text_content("#v-flujo"), f"{figura}: punto 8 · Flujo y plazos")
        captura(pg, figura, "8")

        # Punto 9 · Perfiles y permisos
        pg.click("nav button[data-v='v-perfiles']")
        perfiles_txt = pg.inner_text("#v-perfiles")
        check("Unidad receptora" in perfiles_txt and "Fiscalía" in perfiles_txt and "Gerencia" in perfiles_txt, f"{figura}: punto 9 · perfiles")
        captura(pg, figura, "9")

        # Punto 10 · Vías de ingreso
        pg.click("nav button[data-v='v-vias']")
        check(pg.locator("#v-vias .via").count() == 2, f"{figura}: punto 10 muestra dos vías confirmadas")
        captura(pg, figura, "10")

        # Volver al punto anterior en cada punto (del 10 al 2)
        for k in range(len(ORDEN) - 1, 1, -1):
            vid = ORDEN[k]
            pg.evaluate(f"ir('{vid}')")
            btn = pg.locator(f"#{vid} button:has-text('Volver al punto')")
            if btn.count() == 1:
                btn.first.click()
                check(activa(pg) == ORDEN[k - 1], f"{figura}: volver de {vid} a {ORDEN[k-1]}")
            else:
                check(False, f"{figura}: {vid} no tiene botón de volver")

        pg.close()

    b.close()

print("\nCasos creados:", resumen)
check(not errores, "sin errores de consola: " + "; ".join(errores[:4]))
print(f"\n{len(fallos)} fallas")
sys.exit(1 if fallos else 0)
