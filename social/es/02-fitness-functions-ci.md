# 02 · Tu arquitectura debería fallar en el CI

Artículo de referencia: `/es/docs/fitness-functions`

---

Un diagrama no protege nada. Una regla ejecutable sí.

Una fitness function es una comprobación automática que vigila una característica de tu arquitectura. Por ejemplo: «el dominio no importa infraestructura».

Un caso real de este repositorio: con ESLint y la regla `import-x/no-restricted-paths`, se bloquean los imports que rompen el orden de capas. `lib` no puede importar componentes, y los átomos no pueden importar moléculas. Si alguien lo rompe, `bun run check` falla en el pipeline de despliegue y el cambio no sale a producción.

Tu primera fitness function, en cuatro pasos:

1. Elige una característica que te importe: una frontera, un ciclo, un tamaño máximo.
2. Escríbela como regla medible.
3. Ejecútala en CI, no en un documento.
4. Si la regla estorba, cambia la decisión con un ADR. No la desactives en silencio.

Las buenas fitness functions son pocas. Protegen lo que ya te dolió una vez.
