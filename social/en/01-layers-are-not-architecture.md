# 01 · Layers are not architecture

Reference article: `/en/docs/arquitectura-en-capas-clean-onion`

---

Does your project have `controllers/`, `services/` and `repositories/` folders? Is that architecture?

Not necessarily. Folders named after layers are a label, not a rule.

What matters is the dependency rule: dependencies point toward the domain, never the other way around. If your refund logic imports an ORM or an HTTP client, it doesn't matter how many layers you have: you're still coupled.

Every boundary should answer:

- What data crosses it? Simple types or DTOs, not ORM entities.
- Who calls whom? The use case defines the port; infrastructure implements it.
- What must NOT cross? Transport details, database exceptions, framework objects.

Watch the opposite extreme too: layers that only pass data along add noise, not protection. A CRUD app with eight layers is accidental complexity.

In your project, do dependencies point toward the domain or toward the database?
