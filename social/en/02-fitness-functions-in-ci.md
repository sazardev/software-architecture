# 02 · Your architecture should fail in CI

Reference article: `/en/docs/fitness-functions`

---

A diagram protects nothing. An executable rule does.

A fitness function is an automated check that guards one characteristic of your architecture. For example: "the domain doesn't import infrastructure."

A real case from this repository: with ESLint and `import-x/no-restricted-paths`, imports that break the layer order are blocked. `lib` cannot import components, and atoms cannot import molecules. If someone breaks the rule, `bun run check` fails in the deploy pipeline and the change never reaches production.

Your first fitness function, in four steps:

1. Pick a characteristic you care about: a boundary, a cycle, a size limit.
2. Write it as a measurable rule.
3. Run it in CI, not in a document.
4. If the rule gets in the way, change the decision with an ADR. Don't disable it silently.

Good fitness functions are few. They protect what already hurt you once.
