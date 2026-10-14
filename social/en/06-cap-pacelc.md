# 06 · CAP is subtler than you were taught

Reference article: `/en/docs/cap-pacelc`

---

CAP is subtler than you were taught.

Partition: the network splits between nodes. Then you choose: answer with possibly stale data (availability) or reject the request (consistency).

But three misreadings are common:

- The C in CAP is not the C in ACID. It's about what a read sees on a replica relative to a write, not your database's integrity rules.
- It's not one global choice for the whole system. You choose per operation: an account balance can be strict while a like counter isn't.
- CAP only covers partitions. PACELC adds: without a partition, what do you trade between latency and consistency?

That "E" (else) is the one you pay every day.

A practical question for each operation: what happens if I read something stale? What happens if I wait 300 ms longer?

Which operation in your system would tolerate data that's five seconds old?
