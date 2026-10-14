# 05 · No distributed transactions? How do you coordinate services?

Reference article: `/en/docs/sagas-outbox-idempotencia`

---

Two microservices. One operation. A failure halfway through.

You charged the customer, but the order was never confirmed. Now what?

Distributed transactions (2PC) exist, but they're rarely the practical answer. The alternatives:

- **Sagas:** a sequence of local transactions, each with a compensation. If a step fails, the earlier ones are undone. Compensating isn't deleting: a refund is a new event, not an erased record.
- **Transactional outbox:** save the event in the same transaction as the state change, and a relay publishes it afterwards. This removes the dual write.
- **Inbox and idempotency:** the consumer discards duplicates. Retries are normal.

Watch out for the dual write: "save to the database, then publish to the broker" can lose or duplicate messages.

Does your system know what happens if step 3 fails after step 2 has completed?
