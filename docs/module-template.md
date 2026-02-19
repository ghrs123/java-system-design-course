# Module X — [Module Name]

**Level:** [1–4]  
**Category:** [Foundations / Scaling / Distributed / Production]

---

Use this document as the **content** standard for every module. The **file** structure (README, theory.md, exercises.md, etc.) is defined in [module-template/README.md](module-template/README.md) and [module-template/module-skeleton/](module-template/module-skeleton/). The content you put into those files must follow the 10 sections and rules below.

---

## 1. Production Context

Describe a realistic production scenario where this topic becomes critical.

- What breaks?
- What symptoms appear?
- Why does this module matter?

Avoid abstract intros. Ground the module in a situation an engineer would recognize (e.g. "Payment service starts responding slowly; order service keeps calling it; thread pool saturates...").

---

## 2. Technical Deep Dive

Explain the concept in depth.

Include:

- Internal mechanics (how it works, not just what it does).
- Edge cases.
- Failure modes.
- Comparison with alternatives.

Avoid superficial explanation. A reader should be able to reason about the topic and explain it to someone else after this section.

---

## 3. Java Implementation

Provide minimal but realistic Java examples.

**Rules:**

- No pseudo-code; use real, compilable Java.
- Runnable code when possible (or clearly marked as "concept only" if not).
- Show common mistakes (e.g. retry without backoff, no circuit breaker).
- Show correct implementation (or the recommended pattern).

Place code in `theory.md` and/or in the `code/` directory; keep `code/` runnable and documented in `code/README.md`.

---

## 4. Failure Scenarios

List at least **3** realistic failure situations.

For each:

- **What happens** – symptom or outcome.
- **Why it happens** – root cause or trigger.
- **How to detect it** – metrics, logs, traces, or operational signals.

These should be scenarios a team might see in production, not theoretical edge cases only.

---

## 5. Trade-offs

Provide a comparison table.

**Example format:**

| Strategy       | Performance | Complexity | Consistency | Cost |
|----------------|-------------|------------|-------------|------|
| Option A       | …           | …          | …           | …    |
| Option B       | …           | …          | …           | …    |

Explain **when to choose each option** (e.g. "Use Option A when latency is critical and you can accept eventual consistency.").

---

## 6. Exercises

At least **3** exercises.

**Rules:**

- Increasing difficulty (e.g. 1 = basic, 2 = integration, 3 = design or failure analysis).
- Real engineering scenarios (e.g. "Simulate a slow dependency and observe thread pool behavior").
- No trivial questions (e.g. avoid "What is a circuit breaker?" as the only exercise).

Put exercise statements in `exercises.md`; do not include solutions there.

---

## 7. Solutions

Provide **full** solutions to every exercise.

**Rules:**

- Explain reasoning (why this approach, what trade-off was considered).
- Explain trade-offs (e.g. "We chose X over Y because …").
- Include code where applicable.
- Avoid only pasting the final answer; a reader should learn from the solution.

Put solutions in `solutions.md`, with headings that match the exercises (e.g. "## Solution 1", "## Solution 2").

---

## 8. Mini Project

Design a small but realistic system or extension.

Must include:

- **Architecture goal** – what the learner will build or extend.
- **Implementation scope** – what is in scope and what is out of scope.
- **Expected outcome** – what "done" looks like (e.g. "API with rate limit per user and global limit; metrics for blocked requests").
- **Evaluation criteria** – checklist or criteria to verify completion (e.g. "Rate limit returns 429 when exceeded; dashboard shows blocked count").

Put this in `project.md`. The project should be doable after completing the theory and exercises but should require applying the module concepts.

---

## 9. Architecture Reflection

Provide **5** reflection questions.

These should force **trade-off analysis**, not recall. Examples:

- "When would you choose X over Y?"
- "How would you detect [failure mode] in production?"
- "What is the cost of increasing [reliability/consistency] here?"

Learners should be able to answer these after completing the module; they can be used for self-assessment or discussion.

---

## 10. Maturity Checklist

Clear criteria to consider the module **completed**.

**Example:**

- [ ] Can explain the concept without notes.
- [ ] Can implement the core pattern from scratch (or with minimal reference).
- [ ] Can analyze trade-offs (e.g. when to use which strategy).
- [ ] Can detect related production failures (symptoms and likely causes).
- [ ] Can justify an architectural decision using the concepts of this module.

Adapt the checklist to the topic; keep it objective and verifiable.

---

## Mapping to files

When splitting content across the repo layout:

- **theory.md** – Sections 1 (Production Context), 2 (Technical Deep Dive), 3 (Java Implementation, or link to code/), 4 (Failure Scenarios), 5 (Trade-offs), 9 (Architecture Reflection), 10 (Maturity Checklist).
- **exercises.md** – Section 6 (Exercises).
- **solutions.md** – Section 7 (Solutions).
- **project.md** – Section 8 (Mini Project).
- **code/** – Runnable Java for Section 3 and for exercises/project when applicable.

You can also keep a single long document (e.g. one `theory.md` with all 10 sections) and split later; the important part is that every module **contains** all 10 sections and follows the rules above.
