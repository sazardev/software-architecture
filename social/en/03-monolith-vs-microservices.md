# 03 · Monolith vs microservices: the wrong question

Reference article: `/en/docs/monolito-vs-microservicios`

---

Monolith or microservices is the wrong question.

The useful one: where are my boundaries, and what does it cost to move them?

A well-built monolith can be modular: modules with a public API, controlled dependencies and data with an owner. A badly built one is a distributed monolith: microservices that call each other in chains, share a database and deploy together. The worst of both worlds.

Before splitting a system, ask:

- Do we have independent teams that need to deploy without coordinating?
- Do modules have different scaling or reliability requirements?
- Do we know where the boundaries are, or are we guessing?

If the answer is no, start with a modular monolith. Correcting a boundary inside one process is far cheaper than correcting it between services.

Does your monolith have real boundaries, or just folders?
