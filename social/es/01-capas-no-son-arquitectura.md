# 01 · Las capas no son la arquitectura

Artículo de referencia: `/es/docs/arquitectura-en-capas-clean-onion`

---

¿Tu proyecto tiene carpetas `controllers/`, `services/` y `repositories/`? ¿Eso es arquitectura?

No necesariamente. Las carpetas por capa son una etiqueta, no una regla.

Lo que de verdad importa es la regla de dependencia: las dependencias apuntan hacia el dominio, nunca al revés. Si tu lógica de reembolsos importa un ORM o un cliente HTTP, da igual cuántas capas tengas: sigues acoplado.

Cada frontera debería responder:

- ¿Qué datos cruzan? Tipos simples o DTOs, no entidades del ORM.
- ¿Quién llama a quién? El caso de uso define el puerto; la infraestructura lo implementa.
- ¿Qué NO cruza? Detalles de transporte, excepciones de la base de datos, objetos del framework.

Y cuidado con el extremo contrario: las capas que solo pasan datos de un lado a otro añaden ruido, no protección. Un CRUD con ocho capas es complejidad accidental.

¿En tu proyecto, las dependencias apuntan hacia el dominio o hacia la base de datos?
