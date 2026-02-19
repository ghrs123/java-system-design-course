# Glossary (Initial)

Short definitions for key concepts used throughout the course.

---

## A–C

- **CAP Theorem**: States that in the presence of a network partition, a distributed system can provide at most two of the following: Consistency, Availability, Partition tolerance.
- **Circuit Breaker**: Pattern that prevents a client from repeatedly calling a failing dependency by \"opening\" after a threshold of failures and then periodically testing recovery.

---

## D–L

- **Error Budget**: The maximum allowed unreliability over a period (e.g. minutes of downtime per month) derived from an SLO or SLA.
- **HTTP**: Hypertext Transfer Protocol, the application protocol used for most web traffic.
- **JVM (Java Virtual Machine)**: The runtime that executes compiled Java bytecode and manages memory, threads and other low-level concerns.

---

## M–S

- **SAGA**: A pattern for managing distributed transactions using a sequence of local transactions with compensating actions on failure instead of a global ACID transaction.
- **SLA (Service Level Agreement)**: External contract specifying the expected level of service (e.g. 99.9% availability), often with penalties if violated.
- **SLI (Service Level Indicator)**: A measured metric (e.g. % of successful requests, p95 latency) used to evaluate an SLO or SLA.
- **SLO (Service Level Objective)**: Internal target for a service's reliability (e.g. 99.95% success rate).

---

## T–Z

- **Trace**: End-to-end representation of a request across multiple services, composed of spans with timing information.

