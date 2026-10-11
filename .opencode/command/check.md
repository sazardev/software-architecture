---
description: Ejecuta la verificación completa del repo (content:index si hubo cambios de contenido + bun run check).
---

Si el diff incluye `src/content/docs/**`, ejecuta primero `bun run content:index`.
Después ejecuta `bun run check` y reporta el resultado gate por gate (format, lint,
types, audit, tests, knip). Si algún gate falla, muestra el error y detente: el éxito
parcial no existe.
