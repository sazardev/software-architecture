# 10 · How much autonomy are you giving your AI system?

Reference articles: `/en/docs/disenar-flujos-con-agentes`, `/en/docs/controlar-la-ia-gobierno-y-autonomia`

---

How much autonomy are you giving your AI system?

An agent is a probabilistic system that acts. That changes the architecture rules.

First, decide step by step: what does deterministic code do, and what does the model do? Validating a JSON payload doesn't need an LLM.

Second, put control points in place:

- **Validate:** schemas and rules before acting.
- **Approve:** a human in the loop for costly or irreversible actions.
- **Stop:** limits on steps, cost and time.

Third, trace everything: what it decided, on what data, what it cost, and whether a retry could duplicate a payment. Idempotency is still your responsibility.

Fourth, define autonomy levels. Not every agent should act unsupervised. For example, a support agent may suggest replies, issue refunds up to a set amount, and escalate the rest.

Frameworks like the NIST AI RMF, the EU AI Act and OWASP's LLM guidance give legal and security teams a common ground to discuss this.

Which action in your AI system would run without asking anyone? Should it?
