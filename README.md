# Java System Design Course (Open Source)

An advanced, production-focused System Design course using Java.

This repository is designed to take engineers from backend fundamentals to real-world distributed system architecture.

This is NOT an interview-prep repository.

This is a production engineering roadmap.

---

## 🎯 Who is this for?

- Backend developers who want to understand how systems work internally.
- Engineers who want to scale services properly.
- Senior developers transitioning into architecture.
- Professionals building real distributed systems.

---

## 🧱 Course Structure

### 🔵 Level 1 – Foundations
- HTTP internals
- JVM & concurrency
- Database fundamentals
- Caching strategies

### 🟡 Level 2 – Scaling Services
- Load balancing
- Database scaling
- Messaging & event-driven systems
- CAP theorem & consistency

### 🔴 Level 3 – Distributed Systems in Practice
- SAGA pattern
- Resilience (retry, circuit breaker, backpressure)
- Observability (logs, metrics, traces)
- Rate limiting

### 🟣 Level 4 – Production Architecture
- Multi-region design
- Cost modeling & capacity planning
- Reliability engineering (SLA, SLO, Error Budgets)

---

## 📦 Repository Organization

Each module contains:

- Theory
- Exercises
- Solutions
- Mini-project
- Java examples

---

## 🛠 Requirements

- Java 17+
- Maven or Gradle
- Docker (for Kafka, Redis, etc.)

For the **web app** (optional): Node 18+, pnpm.

---

## 🌐 Web App (Standalone)

This repo includes a standalone web app to browse the course (levels, modules, links to theory, exercises, solutions).

**Run locally:**

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 (or the port shown). Content (markdown, code) is served from the `level-*` folders at `/course-content`.

**Build for production:**

```bash
pnpm build
pnpm start
```

The server serves the static app and course content. You can also use this repo as a **submodule** in the [System Design Roadmap](https://github.com/ghrs123/system-design-roadmap) so the course appears inside the roadmap site; see `docs/integration-with-roadmap.md`.

---

## 🚀 How to Use This Course

1. Start from Level 1.
2. Complete exercises before reading solutions.
3. Implement mini-projects fully.
4. Only move to next level when checklist is completed.

This course is structured progressively. Skipping levels reduces learning effectiveness.

---

## 🤝 Contributing

Contributions are welcome.

Before submitting:

- Follow module template structure.
- Include exercises and solutions.
- Keep focus on production engineering.
- Avoid superficial examples.

See `CONTRIBUTING.md` for details.

---

## 📄 License

MIT License.

