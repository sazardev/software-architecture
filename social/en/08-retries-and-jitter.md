# 08 · Retries without jitter are an attack on yourself

Reference article: `/en/docs/resiliencia-sistemas-distribuidos`

---

Imagine a service that stutters for a second. A thousand clients retry at the same moment, all on the same schedule. The service, which had just recovered, gets a thousand requests again. And again. That's a retry storm.

Five basic protections:

1. A timeout on every remote call. No timeout, no deadline.
2. Exponential backoff with jitter: each retry waits a random, spread-out amount of time.
3. A retry budget: don't retry at every layer of the chain.
4. Circuit breaker: stop calling a dependency that doesn't answer and fail fast.
5. Bulkheads: isolate resources so one slow dependency can't sink everything else.

And an uncomfortable idea: slow is worse than down. A dead service is detected quickly; a slow one piles up threads, connections and queues.

Do all of your system's remote calls have timeouts, or only the ones someone reviewed?
