# Instrucciones Operativas & Reglas de Agente — MPOX Brasil

## 1. Despliegue Exclusivo por Git (Prevención de Rollbacks)
- **CI/CD como Fuente Única de Verdad:** GitHub Actions (`.github/workflows/auto_update_and_deploy.yml`) ejecuta periódicamente (cron horario) y en cada `push` a la rama `main` un pipeline automatizado de recolección, build y despliegue hacia Google Firebase Hosting.
- **Prohibido el Despliegue Manual Aislado:** Nunca ejecutar `firebase deploy` directamente desde local si los cambios no están confirmados y subidos a `origin/main`. Cualquier deploy manual desincronizado con el repositorio remoto es sobreescrito y revertido automáticamente por GitHub Actions.
- **Cadencia Obligatoria:**
  1. Validar compilación local (`npm run build`).
  2. Confirmar cambios (`git add ... && git commit -m "..."`).
  3. Sincronizar y subir a remoto (`git pull --rebase origin main && git push origin main`).
  4. Dejar que GitHub Actions despliegue, o si se requiere verificación inmediata de hosting, confirmar que git working tree está 100% limpio y sincronizado con `origin/main`.

---

## 2. Verificación Visual Obligatoria con Playwright (Snapshots en Chat)
- **Evidencia Visual Obligatoria:** Siempre que se mencione o use Playwright para validar el estado de la UI o de producción (`https://mpox-tracker-br.web.app/`), se DEBE capturar una captura de pantalla real (`page.screenshot`) y adjuntarla directamente en el mensaje de respuesta mediante markdown: `![Prueba](file:///path/to/snapshot.png)`.
- **Prohibido Afirmar sin Mostrar:** Nunca emitir respuestas en prosa afirmando que la web "ya fue verificada" sin incluir la imagen real capturada.
- **Bypass de Caché CDN:** Siempre cargar las URLs de verificación con parámetro de cache-busting (ej. `?nocache=${Date.now()}`).

---

## 3. Reglas 100% Agénticas (Cero Reglas Fijas)
- **Interpretación por Contexto:** Prohibido programar listas negras de palabras excluidas (ej. "carioca"), reglas regex rígidas o tablas fijas de decisión de disponibilidad.
- **Tres Requisitos Obligatorios:** Para que una noticia altere el stock de un centro, debe contener explícitamente:
  1. Vacuna de Mpox (MVA-BN, Jynneos, etc.).
  2. Centro o red municipal claramente identificada.
  3. Situación explícita de disponibilidad o esgotamento.
- **Regla de Descarte Estricto:** Si falta cualquiera de las 3 informaciones, la noticia se descarta sin inventar o suponer datos.

---

## 4. Precedencia Temporal Estricta
- **Orden Cronológico Inverso:** Los feeds y comunicados se procesan ordenados de más reciente a más antiguo (`reverse=True`).
- **Soberanía del Primer Hallazgo (`processed_site_ids`):** La noticia más reciente que asigne estado a un centro bloquea dicho centro para ese ciclo. Noticias más antiguas del mismo día no pueden revertir la situación informada más recientemente.

---

## 5. Sincronización Dual de Datos
- Mantener siempre sincronizados en tándem los archivos de producción en `public/data/` y los tipos/datos en `src/data/` (`alerts.json` <-> `alerts.ts`, `vaccination_sites.json` <-> `vaccination_sites.ts`).
- `scripts/export_json.js` debe preservar y fusionar siempre los datos dinámicos generados por el agente sin sobreescribirlos ciegamente.
