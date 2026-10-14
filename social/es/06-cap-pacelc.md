# 06 · CAP es más sutil de lo que te enseñaron

Artículo de referencia: `/es/docs/cap-pacelc`

---

CAP es más sutil de lo que te enseñaron.

Partición: la red se corta entre nodos. Ahí eliges: responder con datos posiblemente viejos (disponibilidad) o rechazar la petición (consistencia).

Pero hay tres malentendidos frecuentes:

- La C de CAP no es la C de ACID. Trata de lo que ve una lectura en una réplica frente a una escritura, no de las reglas de integridad de tu base.
- No es una elección global para todo el sistema. Puedes elegir por operación: el saldo de una cuenta puede ser estricto y el contador de likes no.
- CAP solo habla de particiones. PACELC añade: sin partición, ¿qué cambias entre latencia y consistencia?

Esa «E» (else) es la que pagas todos los días.

Una pregunta práctica para cada operación: ¿qué pasa si leo algo viejo? ¿Qué pasa si espero 300 ms más?

¿Qué operación de tu sistema toleraría un dato de hace cinco segundos?
