# 12 · Tu complejidad accidental viene de tus herramientas

Artículo de referencia: `/es/docs/complejidad-esencial-y-accidental`

---

Fred Brooks, en «No Silver Bullet» (1986), separó la complejidad esencial del problema de la accidental, la que añadimos al resolverlo.

Señales de complejidad accidental:

- Una herramienta impone su modelo y tú adaptas el problema a ella.
- Infraestructura añadida «por si acaso», antes de necesitarla.
- Decisiones propias que nadie revisó.
- Dependencias que se arrastran aunque nada las use.

Preguntas para separarlas:

- Si quitamos esto, ¿cambia el problema real del usuario o solo nuestro código?
- ¿Cuántas capas existen solo porque la herramienta las pide?

Dos trampas: tomar por esencial lo accidental («siempre lo hemos hecho así») y tomar por accidental lo esencial (ignorar una regla de negocio que de verdad es difícil).

Para reducirla: elimínala, ocúltala tras un límite, cómprala ya resuelta o pospónla. Y lleva un registro mínimo de las decisiones que añaden complejidad.

¿Qué parte de tu stack añadiste sin que el problema lo pidiera?
