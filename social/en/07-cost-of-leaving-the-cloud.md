# 07 · The cost of leaving the cloud is an architecture decision

Reference articles: `/en/docs/casado-a-un-proveedor`, `/en/docs/finops-costo-como-atributo`

---

How much would it cost you to move to another provider tomorrow?

If the answer is "I don't know", you have lock-in you never decided on.

Lock-in isn't just proprietary APIs. There are several kinds: API and programming model, data, operations, contracts and licensing, and talent. The most expensive is often data: exporting is easy, rebuilding its meaning isn't.

Three practical ideas:

- Estimate exit cost with real data: volume, integrations, cutover time.
- Decide consciously: is this service a differentiator or a commodity? Spend lock-in only where it pays off.
- Write an exit plan and test it. A plan that was never executed is just an intention.

And cloud cost is one more quality attribute: cost per business unit, tags and budgets from the design stage, not a surprise on the end-of-month bill.

Could your team say today how much it would cost to leave your main provider?
