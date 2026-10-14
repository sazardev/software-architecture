# 12 · Your accidental complexity comes from your tools

Reference article: `/en/docs/complejidad-esencial-y-accidental`

---

In "No Silver Bullet" (1986), Fred Brooks separated the essential complexity of a problem from the accidental complexity we add while solving it.

Signs of accidental complexity:

- A tool imposes its model and you bend the problem to fit it.
- Infrastructure added "just in case", before you needed it.
- Your own decisions that nobody reviewed.
- Dependencies that linger although nothing uses them.

Questions to tell them apart:

- If we removed this, would the user's real problem change, or only our code?
- How many layers exist only because the tool asks for them?

Two traps: taking accidental complexity for essential ("we've always done it this way"), and taking essential complexity for accidental (ignoring a business rule that really is hard).

To reduce it: eliminate it, hide it behind a boundary, buy it already solved, or postpone it. And keep a minimal log of the decisions that add complexity.

Which part of your stack did you add without the problem ever asking for it?
