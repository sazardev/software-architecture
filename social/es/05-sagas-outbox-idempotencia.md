# 05 · Sin transacciones distribuidas, ¿cómo coordinas servicios?

Artículo de referencia: `/es/docs/sagas-outbox-idempotencia`

---

Dos microservicios. Una operación. Un fallo a mitad de camino.

Cobraste al cliente, pero el pedido nunca se confirmó. ¿Y ahora qué?

Las transacciones distribuidas (2PC) existen, pero rara vez son la respuesta práctica. Las alternativas:

- **Sagas:** una secuencia de transacciones locales, cada una con su compensación. Si falla un paso, se deshacen los anteriores. Compensar no es borrar: el reembolso es un evento nuevo, no un registro eliminado.
- **Transactional outbox:** guardas el evento en la misma transacción que el cambio de estado, y un relay lo publica después. Así eliminas la doble escritura.
- **Inbox e idempotencia:** el consumidor descarta duplicados. Los reintentos son normales.

Cuidado con la doble escritura: «guardo en la base y publico en el broker» puede perder o duplicar mensajes.

¿Tu sistema sabe qué pasa si el paso 3 falla después de que el paso 2 se completó?
