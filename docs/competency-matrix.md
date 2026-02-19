# Competency Matrix

This matrix defines the primary competencies for each level of the **Java System Design Course**.

---

## Level 1 – Foundations (Understand Internals)

By the end of Level 1, the learner should be able to:

- Explain how an HTTP request flows from socket to application code.
- Describe JVM threading, memory model (heap/stack) and basic concurrency issues.
- Understand transactional guarantees (ACID) and basic indexing in relational databases.
- Use caching effectively (in-memory vs distributed, invalidation, TTL).

---

## Level 2 – Scaling Services (Scale Services)

By the end of Level 2, the learner should be able to:

- Design horizontally scalable services behind load balancers.
- Explain and apply database scaling strategies (read replicas, sharding, partitioning).
- Use messaging / event-driven patterns to decouple services.
- Reason about CAP theorem and different consistency models in distributed systems.

---

## Level 3 – Distributed Systems in Practice (Coordinate Systems)

By the end of Level 3, the learner should be able to:

- Model distributed transactions using the SAGA pattern (orchestration/coreography, compensations).
- Design resilient systems using retry, circuit breaker and backpressure patterns.
- Implement observability using structured logs, metrics (p95/p99) and traces.
- Apply rate limiting and traffic shaping to protect services under load.

---

## Level 4 – Production Architecture (Architect & Govern Production)

By the end of Level 4, the learner should be able to:

- Design and reason about multi-region architectures and failover strategies.
- Perform basic cost modeling and capacity planning (RPS, vCPU, storage, egress).
- Define and operate with SLAs, SLOs, SLIs and error budgets to govern reliability.
- Balance cost, reliability and performance when making architectural decisions.

