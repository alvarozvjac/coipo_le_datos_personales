"""Prueba de la cascada Región → Provincia → Comuna (v3.3) con Playwright (Chromium, sin red)."""
import pathlib, sys
from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
URL = (RAIZ / "index.html").as_uri()
fallos, errores = [], []

def check(cond, msg):
    print(("OK   " if cond else "FALLA") + " " + msg)
    if not cond:
        fallos.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("console", lambda m: m.type == "error" and errores.append(m.text))
    pg.on("pageerror", lambda e: errores.append(str(e)))
    pg.goto(URL)
    pg.evaluate("ir('v-form');muestraPaso(3)")
    pg.select_option("#medio", "carta")

    check(pg.locator("#selRegion option").count() == 17, "16 regiones + placeholder en Región")
    check(pg.is_disabled("#selProvincia") and pg.is_disabled("#selComuna"), "Provincia y Comuna deshabilitadas al inicio")

    pg.select_option("#selRegion", label="Coquimbo")
    prov = [o.inner_text() for o in pg.locator("#selProvincia option").all()][1:]
    check(prov == ["Elqui", "Choapa", "Limarí"], f"Coquimbo → provincias {prov}")
    check(not pg.is_disabled("#selProvincia") and pg.is_disabled("#selComuna"), "Comuna espera a la provincia")

    pg.select_option("#selProvincia", label="Limarí")
    com = [o.inner_text() for o in pg.locator("#selComuna option").all()][1:]
    check(len(com) == 5 and "Ovalle" in com and "La Serena" not in com, f"Limarí → comunas {com}")

    pg.select_option("#selRegion", label="Metropolitana de Santiago")
    prov2 = [o.inner_text() for o in pg.locator("#selProvincia option").all()][1:]
    check("Santiago" in prov2 and "Elqui" not in prov2, "cambiar región reemplaza provincias")
    check(pg.is_disabled("#selComuna"), "cambiar región limpia y bloquea la comuna")

    pg.select_option("#selRegion", label="Metropolitana de Santiago")
    pg.select_option("#selProvincia", label="Santiago")
    check(pg.locator("#selComuna option").count() > 2 and "Providencia" in [o.inner_text() for o in pg.locator("#selComuna option").all()], "Santiago → comuna Providencia disponible")

    total = pg.evaluate("TERRITORIO.reduce((a,r)=>a+r.p.reduce((b,x)=>b+x[1].length,0),0)")
    check(total == 346, f"346 comunas en los datos ({total})")

    b.close()

check(not errores, "sin errores de consola: " + "; ".join(errores)[:200])
print("\nFALLAS:", len(fallos))
sys.exit(1 if fallos else 0)
