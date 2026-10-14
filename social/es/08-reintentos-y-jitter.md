# 08 · Los reintentos sin jitter son un ataque contra ti mismo

Artículo de referencia: `/es/docs/resiliencia-sistemas-distribuidos`

---

Imagina un servicio que tiembla un segundo. Mil clientes reintentan a la vez, cada uno con el mismo calendario. El servicio, que acababa de recuperarse, recibe mil peticiones otra vez. Y otra vez. Eso es una tormenta de reintentos.

Cinco protecciones básicas:

1. Timeout en toda llamada remota. Sin timeout no hay plazo.
2. Backoff exponencial con jitter: cada reintento espera un tiempo aleatorio y repartido.
3. Presupuesto de reintentos: no reintentes en cada capa de la cadena.
4. Circuit breaker: deja de llamar a quien no responde y falla rápido.
5. Bulkheads: aísla recursos para que una dependencia lenta no hunda todo lo demás.

Y una idea incómoda: lento es peor que caído. Un servicio caído se detecta rápido; uno lento acumula hilos, conexiones y colas.

¿Todas las llamadas de tu sistema tienen timeout, o solo las que alguien revisó?
