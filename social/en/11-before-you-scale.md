# 11 · Before you scale, do the math

Reference articles: `/en/docs/numeros-y-leyes-de-rendimiento`, `/en/docs/escalabilidad-casos-clasicos`

---

Your system doesn't need 50 servers. It needs an order-of-magnitude estimate.

Before scaling, do the math:

- **Little's Law:** concurrency = throughput × response time. At 200 requests per second and 0.5 s latency, there are about 100 requests in flight.
- **Amdahl's Law:** if 10% of the work is sequential, no matter how many cores you add, the speedup never exceeds 10×.
- **Queues:** as utilization approaches 100%, latency explodes.

Then the method: requirements, estimation, partitions and replicas. We applied it to three classic cases: a URL shortener, a rate limiter and a news feed.

And a simple rule: don't optimize what you haven't measured. Look at percentiles, not just averages.

Do you have a written estimate of your peak load anywhere?
