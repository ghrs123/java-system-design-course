/*
 * Course data: Java System Design Course
 * moduleBasePath = path under course content root (e.g. level-1-foundations/module-1-http).
 */

export interface CourseTopic {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  resources: string[];
  moduleSlug: string;
  moduleBasePath: string;
}

export interface CourseLevel {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accentColor: "cyan" | "amber";
  topics: CourseTopic[];
}

export const COURSE_HERO_IMAGE = "";

export const courseLevels: CourseLevel[] = [
  {
    id: 1,
    slug: "level-1-foundations",
    title: "Fundamentos Essenciais",
    subtitle: "Foundations",
    description:
      "Entenda os internals e como as coisas realmente funcionam: HTTP, JVM, concorrência, bases de dados e cache.",
    image: COURSE_HERO_IMAGE,
    accentColor: "cyan",
    topics: [
      {
        id: "1-1",
        title: "HTTP Internals",
        description: "Protocolo HTTP, requisições, respostas, métodos, status e conexões.",
        concepts: ["HTTP/1.1", "Request/Response", "REST", "Headers"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-1-http",
        moduleBasePath: "level-1-foundations/module-1-http",
      },
      {
        id: "1-2",
        title: "JVM & Concurrency",
        description: "JVM, threads, executors e padrões de concorrência em Java.",
        concepts: ["JVM", "Threads", "Executors", "Concurrency"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-2-jvm-concurrency",
        moduleBasePath: "level-1-foundations/module-2-jvm-concurrency",
      },
      {
        id: "1-3",
        title: "Database Fundamentals",
        description: "Fundamentos de bancos de dados, SQL, transações e índices.",
        concepts: ["SQL", "ACID", "Indexes", "Transactions"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-3-database-fundamentals",
        moduleBasePath: "level-1-foundations/module-3-database-fundamentals",
      },
      {
        id: "1-4",
        title: "Caching Strategies",
        description: "Estratégias de cache, invalidação e trade-offs.",
        concepts: ["Cache", "TTL", "Invalidation", "Consistency"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-4-caching",
        moduleBasePath: "level-1-foundations/module-4-caching",
      },
    ],
  },
  {
    id: 2,
    slug: "level-2-scaling",
    title: "Escalando Serviços",
    subtitle: "Scaling Services",
    description:
      "Escale serviços e armazenamentos: load balancing, escalabilidade de banco, mensageria e CAP.",
    image: COURSE_HERO_IMAGE,
    accentColor: "cyan",
    topics: [
      {
        id: "2-1",
        title: "Load Balancing",
        description: "Balanceamento de carga, algoritmos e health checks.",
        concepts: ["LB", "Round-robin", "Health checks", "Session affinity"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-1-load-balancing",
        moduleBasePath: "level-2-scaling/module-1-load-balancing",
      },
      {
        id: "2-2",
        title: "Database Scaling",
        description: "Replicação, sharding e leitura/escrita em escala.",
        concepts: ["Replication", "Sharding", "Read replicas", "Partitioning"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-2-database-scaling",
        moduleBasePath: "level-2-scaling/module-2-database-scaling",
      },
      {
        id: "2-3",
        title: "Messaging & Event-Driven Systems",
        description: "Filas, pub/sub e arquitetura orientada a eventos.",
        concepts: ["Message queues", "Pub/Sub", "Events", "Async"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-3-messaging",
        moduleBasePath: "level-2-scaling/module-3-messaging",
      },
      {
        id: "2-4",
        title: "CAP Theorem & Consistency",
        description: "Teorema CAP, consistência e trade-offs em sistemas distribuídos.",
        concepts: ["CAP", "Consistency", "Availability", "Partition tolerance"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-4-cap-theorem",
        moduleBasePath: "level-2-scaling/module-4-cap-theorem",
      },
    ],
  },
  {
    id: 3,
    slug: "level-3-distributed-systems",
    title: "Sistemas Distribuídos na Prática",
    subtitle: "Distributed Systems",
    description:
      "Coordenação, resiliência e observabilidade: SAGA, retry, circuit breaker, logs, métricas e rate limiting.",
    image: COURSE_HERO_IMAGE,
    accentColor: "amber",
    topics: [
      {
        id: "3-1",
        title: "SAGA Pattern",
        description: "Transações distribuídas e padrão SAGA.",
        concepts: ["SAGA", "Compensation", "Choreography", "Orchestration"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-1-saga",
        moduleBasePath: "level-3-distributed-systems/module-1-saga",
      },
      {
        id: "3-2",
        title: "Resilience (Retry, Circuit Breaker, Backpressure)",
        description: "Resiliência com retry, circuit breaker e backpressure.",
        concepts: ["Retry", "Circuit breaker", "Backpressure", "Resilience4j"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-2-resilience",
        moduleBasePath: "level-3-distributed-systems/module-2-resilience",
      },
      {
        id: "3-3",
        title: "Observability (Logs, Metrics, Traces)",
        description: "Observabilidade com logs, métricas e traces.",
        concepts: ["Logs", "Metrics", "Traces", "OpenTelemetry"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-3-observability",
        moduleBasePath: "level-3-distributed-systems/module-3-observability",
      },
      {
        id: "3-4",
        title: "Rate Limiting & Traffic Shaping",
        description: "Limitação de taxa e modelagem de tráfego.",
        concepts: ["Rate limiting", "Token bucket", "Sliding window", "Traffic shaping"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-4-rate-limiting",
        moduleBasePath: "level-3-distributed-systems/module-4-rate-limiting",
      },
    ],
  },
  {
    id: 4,
    slug: "level-4-production-architecture",
    title: "Arquitetura de Produção",
    subtitle: "Production Architecture",
    description:
      "Arquitetura global, custo e confiabilidade: multi-região, modelagem de custos e engenharia de confiabilidade (SLA, SLO, error budgets).",
    image: COURSE_HERO_IMAGE,
    accentColor: "amber",
    topics: [
      {
        id: "4-1",
        title: "Multi-Region Architecture & Failover",
        description: "Arquitetura multi-região e failover.",
        concepts: ["Multi-region", "Failover", "DR", "Latency"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-1-multi-region",
        moduleBasePath: "level-4-production-architecture/module-1-multi-region",
      },
      {
        id: "4-2",
        title: "Cost Modeling & Capacity Planning",
        description: "Modelagem de custos e planejamento de capacidade.",
        concepts: ["Cost modeling", "Capacity", "Forecasting", "Optimization"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-2-cost-modeling",
        moduleBasePath: "level-4-production-architecture/module-2-cost-modeling",
      },
      {
        id: "4-3",
        title: "Reliability Engineering (SLA, SLO & Error Budgets)",
        description: "SLA, SLO, error budgets e encerramento do curso.",
        concepts: ["SLA", "SLO", "Error budget", "Reliability"],
        resources: ["theory.md", "exercises.md", "code/"],
        moduleSlug: "module-3-reliability-engineering",
        moduleBasePath: "level-4-production-architecture/module-3-reliability-engineering",
      },
    ],
  },
];

export const levels = courseLevels;
