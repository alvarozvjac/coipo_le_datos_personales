"""Prueba v3.5: puntos numerados 1-10, Datos Personales lleva al punto 2, y «Volver al punto anterior» en cada punto."""
import pathlib, sys, re
from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
URL = (RAIZ / "index.html").as_uri()
fallos, errores = [], []

def check(cond, msg):
    print(("OK   " if cond else "FALLA") + " " + msg)
    if not cond:
        fallos.append(msg)

def activa(pg):
    return pg.evaluate("document.querySelector('.vista.activa').id")

ORDEN = ["v-sitio", "v-info", "v-ident", "v-form", "v-acuse", "v-bandeja", "v-caso", "v-flujo", "v-perfiles", "v-vias"]

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("console", lambda m: m.type == "error" and errores.append(m.text))
    pg.on("pageerror", lambda e: errores.append(str(e)))
    pg.goto(URL)

    nav = [t.strip() for t in pg.locator("nav.nav button").all_inner_texts()]
    nums = [int(re.match(r"(\d+) ·", t).group(1)) for t in nav if re.match(r"\d+ ·", t)]
    check(nums == list(range(1, 11)), f"puntos numerados 1 a 10 sin huecos: {nums}")
    check(len(nav) == 10, f"nav con 10 puntos (hay {len(nav)}: {nav})")

    pg.click("#v-sitio .cs-tile.nuevo")
    check(activa(pg) == "v-info", "«Datos Personales» en Portada y banner lleva al punto 2")
    check(pg.locator("#v-info .pd-item").count() == 11, "el punto 2 muestra los 11 ítems del art. 14 ter")

    pg.click("#v-info button:has-text('Continuar al punto 3')")
    check(activa(pg) == "v-ident", "desde el punto 2 se continúa al punto 3 · Quién solicita")

    # Volver al punto anterior en cada punto
    for k in range(1, len(ORDEN)):
        vid = ORDEN[k]
        pg.evaluate(f"ir('{vid}')")
        btn = pg.locator(f"#{vid} button:has-text('Volver al punto')")
        ok = btn.count() == 1
        if ok:
            btn.first.click()
            ok = activa(pg) == ORDEN[k - 1]
        check(ok, f"{vid}: «Volver al punto anterior» regresa a {ORDEN[k-1]}")

    check(pg.locator("#v-sitio button:has-text('Volver al punto')").count() == 0, "el punto 1 no tiene botón de volver")
    b.close()

check(not errores, "sin errores de consola: " + "; ".join(errores)[:200])
print("\nFALLAS:", len(fallos))
sys.exit(1 if fallos else 0)
