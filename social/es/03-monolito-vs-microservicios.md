# 03 · Monolito vs microservicios: la pregunta equivocada

Artículo de referencia: `/es/docs/monolito-vs-microservicios`

---

Monolito o microservicios es la pregunta equivocada.

La útil es: ¿dónde están mis fronteras y cuánto cuesta moverlas?

Un monolito bien hecho puede ser modular: módulos con API pública, dependencias controladas y datos con dueño. Uno mal hecho es un monolito distribuido: microservicios que se llaman en cadena, comparten base de datos y se despliegan juntos. Es el peor de los dos mundos.

Antes de partir un sistema, pregúntate:

- ¿Tenemos equipos independientes que necesitan desplegar sin coordinarse?
- ¿Los módulos tienen requisitos distintos de escala o fiabilidad?
- ¿Sabemos dónde están las fronteras, o las adivinamos?

Si la respuesta es no, empieza por el monolito modular. Corregir una frontera dentro de un proceso es mucho más barato que hacerlo entre servicios.

¿Tu monolito tiene fronteras reales, o solo carpetas?
