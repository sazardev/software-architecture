---
description: Revisa el diff actual contra AGENTS.md como auditor estricto, sin modificar código.
---

Actúa con el criterio del agente `rule-auditor`: lee `AGENTS.md`, inspecciona
`git status`, `git diff` y `git log --oneline -10`, ejecuta `bun run audit` y los tests
afectados, y entrega un veredicto `APTO` / `NO APTO` con violaciones localizadas como
`ruta/al/archivo:línea`. No modifiques ningún archivo.
