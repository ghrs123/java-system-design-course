/**
 * ─── Blueprint Engineering Theme ───
 * Design: Dark navy blueprint with cyan wireframe lines and amber accents
 * Typography: JetBrains Mono (display) + IBM Plex Sans (body)
 * Colors: Navy #0a1628, Cyan oklch(0.75 0.16 200), Amber #f59e0b
 * Course: Java System Design — Production Engineering Roadmap
 */

export interface Exercise {
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  solution: string;
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
  concepts: string[];
  codeExamples: CodeExample[];
  exercises: Exercise[];
  warnings: string[];
  references: { title: string; url: string }[];
}

export interface Level {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  topics: Topic[];
}

export const levels: Level[] = [
  {
    id: 1,
    slug: "fundamentos",
    title: "Fundamentos Essenciais",
    subtitle: "Iniciante",
    description: "Compreenda os alicerces de qualquer sistema distribuído: HTTP internals, JVM e concorrência, fundamentos de base de dados e estratégias de caching. Estes conceitos são a base sobre a qual toda a arquitetura de produção é construída.",
    accentColor: "cyan",
    topics: [
      {
        id: "1-1",
        title: "HTTP Internals",
        description: "Compreenda o ciclo completo de uma requisição HTTP — desde o cliente até ao servidor — e onde a latência aparece em aplicações Java.",
        content: `O **HTTP (HyperText Transfer Protocol)** é o protocolo sobre o qual toda a web moderna é construída. Para um engenheiro de sistemas, compreender os seus internals é fundamental para diagnosticar problemas de performance, latência e fiabilidade.

**Ciclo de Vida de uma Requisição**

Quando um cliente faz uma requisição HTTP, o fluxo completo é:

1. **Resolução DNS**: O cliente resolve o hostname para um endereço IP. Esta operação pode levar dezenas de milissegundos e tem implicações de caching (TTL).
2. **TCP Handshake**: Estabelecimento da conexão TCP — 3-way handshake (SYN, SYN-ACK, ACK). Para HTTPS, acrescenta-se o TLS handshake que pode adicionar 1-2 RTTs adicionais.
3. **Envio do Request**: O cliente envia os headers e o body da requisição.
4. **Processamento no Servidor**: O servidor processa a requisição — este é o tempo que está sob o nosso controlo.
5. **Envio da Response**: O servidor envia os headers e o body da resposta.

**HTTP/1.1 vs HTTP/2 vs HTTP/3**

O **HTTP/1.1** sofre do problema de **Head-of-Line Blocking** — num pipeline, uma requisição lenta bloqueia todas as subsequentes na mesma conexão TCP. A solução era abrir múltiplas conexões TCP (tipicamente 6 por domínio), o que é dispendioso.

O **HTTP/2** resolve este problema com **multiplexing** — múltiplos streams independentes sobre uma única conexão TCP. Introduz também header compression (HPACK) e server push. Contudo, mantém o Head-of-Line Blocking ao nível TCP.

O **HTTP/3** substitui TCP por **QUIC** (baseado em UDP), eliminando o Head-of-Line Blocking completamente. Melhora dramaticamente a performance em redes com packet loss.

**Como os Servidores Java Aceitam Conexões**

Um servidor Java (Tomcat, Netty, Undertow) usa o modelo de **thread-per-request** ou o modelo **event-loop** (reactive/NIO).

No modelo thread-per-request, cada conexão tem uma thread dedicada — simples de programar mas não escala bem (cada thread consome ~1MB de stack). Com 10.000 conexões concorrentes, o servidor precisaria de ~10GB só para as stacks.

No modelo NIO (Non-blocking I/O) / event-loop, um número reduzido de threads (geralmente igual ao número de CPUs) gere múltiplas conexões. Quando uma I/O operation bloqueia, a thread liberta-se para servir outra conexão.

**Onde Aparece a Latência**

- **Network RTT**: 1-300ms dependendo da localização geográfica
- **DNS Resolution**: 10-100ms (mitigado por caching)
- **TLS Handshake**: 1-2 RTTs adicionais (mitigado por session resumption)
- **Queuing no Load Balancer**: microsegundos a milissegundos
- **Application Processing**: variável — é aqui que o código importa
- **Database queries**: tipicamente o maior culpado (1ms a segundos)
- **Serialization/Deserialization**: JSON é lento; considere protobuf para alta performance`,
        concepts: ["HTTP/1.1", "HTTP/2 Multiplexing", "HTTP/3 / QUIC", "TCP Handshake", "TLS Handshake", "Head-of-Line Blocking", "Thread-per-Request", "NIO / Event-Loop", "Latência de Rede", "DNS TTL", "Connection Pooling", "Keep-Alive"],
        codeExamples: [
          {
            title: "Servidor HTTP com Java NIO (Netty)",
            language: "java",
            code: `@SpringBootApplication
public class HttpServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(HttpServerApplication.class, args);
    }
}

// Controller que demonstra latência em diferentes pontos
@RestController
@RequestMapping("/api")
public class LatencyDemoController {

    private final DataService dataService;

    public LatencyDemoController(DataService dataService) {
        this.dataService = dataService;
    }

    // Requisição simples — latência mínima
    @GetMapping("/ping")
    public Map<String, Object> ping() {
        long start = System.currentTimeMillis();
        return Map.of(
            "status", "ok",
            "timestamp", System.currentTimeMillis(),
            "processingMs", System.currentTimeMillis() - start
        );
    }

    // Requisição com I/O — onde a latência real aparece
    @GetMapping("/data/{id}")
    public ResponseEntity<DataResponse> getData(@PathVariable Long id) {
        long start = System.currentTimeMillis();

        // Esta chamada pode ser 1ms (cache hit) ou 50ms (DB query)
        DataResponse data = dataService.findById(id);

        long elapsed = System.currentTimeMillis() - start;

        return ResponseEntity.ok()
            .header("X-Processing-Time", elapsed + "ms")
            .body(data);
    }
}`,
            explanation: "O header X-Processing-Time é uma técnica simples mas poderosa para medir latência de servidor. Em produção, use distributed tracing (Micrometer + Zipkin) para visibilidade completa."
          },
          {
            title: "Configuração HTTP/2 no Spring Boot",
            language: "yaml",
            code: `# application.yml
server:
  http2:
    enabled: true
  # Usar SSL (obrigatório para HTTP/2 em browsers)
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: changeit
    key-store-type: PKCS12
  # Connection pool settings
  tomcat:
    max-connections: 10000
    accept-count: 100
    max-threads: 200
    min-spare-threads: 10
    connection-timeout: 20000

# Para Undertow (melhor performance que Tomcat)
# server:
#   undertow:
#     io-threads: 4        # = nCPUs
#     worker-threads: 32   # = nCPUs * 8`,
            explanation: "HTTP/2 requer HTTPS. O Undertow é geralmente mais performante que Tomcat para cargas de trabalho I/O-bound, pois usa um modelo de I/O não-bloqueante por defeito."
          }
        ],
        exercises: [
          {
            title: "Medir Latência de uma Requisição",
            difficulty: "beginner",
            description: "Crie um endpoint Spring Boot que retorna no body o tempo de processamento, o tempo de DNS lookup (simulado), e o tamanho do response em bytes. Use curl com --trace-time para verificar os tempos reais.",
            solution: `@GetMapping("/benchmark")
public Map<String, Object> benchmark(HttpServletRequest request) {
    long start = System.nanoTime();

    // Simular algum processamento
    Map<String, Object> result = new LinkedHashMap<>();
    result.put("method", request.getMethod());
    result.put("uri", request.getRequestURI());
    result.put("protocol", request.getProtocol());
    result.put("remoteAddr", request.getRemoteAddr());

    long elapsed = System.nanoTime() - start;
    result.put("processingNanos", elapsed);
    result.put("processingMicros", elapsed / 1000);

    return result;
}`
          },
          {
            title: "Comparar HTTP/1.1 vs HTTP/2 com k6",
            difficulty: "intermediate",
            description: "Configure um servidor com HTTP/2 ativado. Use k6 (ferramenta de load testing) para enviar 100 requisições concorrentes com HTTP/1.1 e HTTP/2. Compare o throughput e a latência média. Documente as diferenças observadas.",
            solution: `// k6 script (http2_test.js)
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50,        // 50 virtual users
  duration: '30s',
};

export default function() {
  // k6 usa HTTP/2 automaticamente se o servidor suportar
  let res = http.get('https://localhost:8443/api/ping');

  check(res, {
    'status 200': (r) => r.status === 200,
    'latência < 100ms': (r) => r.timings.duration < 100,
  });

  sleep(0.1);
}`
          }
        ],
        warnings: [
          "Keep-Alive é crucial: Sem Keep-Alive, cada requisição abre e fecha uma conexão TCP — overhead significativo. Verifique que o seu servidor e cliente têm Keep-Alive ativado.",
          "TLS tem custo: TLS 1.3 é mais rápido que TLS 1.2 (1-RTT vs 2-RTT handshake). Use session resumption para clientes que voltam a conectar.",
          "Timeouts em toda a stack: Configure connection timeout, read timeout e write timeout. Sem timeouts, uma conexão lenta pode manter recursos ocupados indefinidamente."
        ],
        references: [
          { title: "High Performance Browser Networking — Ilya Grigorik", url: "https://hpbn.co/" },
          { title: "HTTP/2 RFC 7540", url: "https://httpwg.org/specs/rfc7540.html" },
          { title: "Spring Boot Undertow Configuration", url: "https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#application-properties.server" }
        ]
      },
      {
        id: "1-2",
        title: "JVM & Concorrência",
        description: "Domine os fundamentos da JVM e os modelos de concorrência em Java — threads, executors, e as novas virtual threads do Java 21.",
        content: `A **JVM (Java Virtual Machine)** é o ambiente de execução de todas as aplicações Java. Compreender o seu funcionamento interno é essencial para construir sistemas de alta performance e diagnosticar problemas de produção.

**Memory Model da JVM**

A memória da JVM divide-se em:

- **Heap**: Onde vivem os objetos criados com \`new\`. Gerido pelo Garbage Collector. Dividido em Young Generation (Eden + Survivor) e Old Generation (Tenured).
- **Stack**: Uma por thread. Contém frames de método com variáveis locais e referências. Stack overflow ocorre quando a recursão é muito profunda.
- **Metaspace** (Java 8+): Substitui o PermGen. Armazena metadata de classes. Crescimento dinâmico por defeito.
- **Off-Heap / Direct Memory**: Usado por NIO buffers e frameworks como Netty para I/O de alta performance.

**Garbage Collection**

O GC é o componente mais crítico para a latência das aplicações Java. Os principais coletores modernos são:

- **G1GC** (padrão desde Java 9): Baixa latência, bom para heaps grandes (4GB+). Divide o heap em regiões.
- **ZGC** (Java 15+): Latência ultra-baixa (< 1ms pause). Ideal para sistemas real-time. Funciona concorrentemente com a aplicação.
- **Shenandoah**: Similar ao ZGC, desenvolvido pela Red Hat. Pausas sub-milissegundo.

**Modelos de Concorrência em Java**

**Platform Threads** (tradicionais): Mapeiam 1:1 para threads do OS. Cada thread consome ~1MB de stack. Limite prático de ~10.000 threads por JVM.

**Virtual Threads** (Java 21 — Project Loom): Threads levíssimas geridas pela JVM. Milhões de virtual threads são possíveis. Quando uma virtual thread bloqueia em I/O, a platform thread subjacente é libertada para executar outra virtual thread. Ideal para workloads I/O-bound.

**CompletableFuture / Reactive**: Para programação assíncrona sem bloquear threads. Útil mas complexo de debugar e raciocinar.

**Thread Safety**

- \`synchronized\`: Exclusão mútua simples. Boa opção para código simples.
- \`ReentrantLock\`: Mais flexível que synchronized — tryLock(), lockInterruptibly(), fairness.
- \`volatile\`: Garante visibilidade entre threads mas não atomicidade.
- Classes \`Atomic*\`: AtomicInteger, AtomicLong — operações atômicas sem locks.
- \`ConcurrentHashMap\`, \`CopyOnWriteArrayList\`: Coleções thread-safe de alta performance.`,
        concepts: ["JVM Heap", "Young/Old Generation", "G1GC", "ZGC", "Shenandoah", "Platform Threads", "Virtual Threads (Loom)", "CompletableFuture", "synchronized", "ReentrantLock", "volatile", "AtomicInteger", "ThreadLocal", "ExecutorService", "Fork/Join Pool"],
        codeExamples: [
          {
            title: "Virtual Threads com Java 21",
            language: "java",
            code: `// Java 21 — Virtual Threads (Project Loom)
public class VirtualThreadsDemo {

    public static void main(String[] args) throws Exception {

        // 1. Criar virtual thread diretamente
        Thread vt = Thread.ofVirtual()
            .name("my-virtual-thread")
            .start(() -> System.out.println("Olá de uma virtual thread!"));
        vt.join();

        // 2. Executor com virtual threads — ideal para I/O-bound
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // Lançar 100.000 tasks — impossível com platform threads
            var futures = IntStream.range(0, 100_000)
                .mapToObj(i -> executor.submit(() -> {
                    // Simular I/O blocking (não bloqueia platform thread!)
                    Thread.sleep(Duration.ofMillis(100));
                    return i * 2;
                }))
                .toList();

            long sum = futures.stream()
                .mapToLong(f -> {
                    try { return f.get(); }
                    catch (Exception e) { return 0; }
                })
                .sum();

            System.out.println("Soma: " + sum);
        }
    }
}

// Spring Boot — ativar virtual threads para todos os requests
@Configuration
public class VirtualThreadConfig {

    @Bean
    public TomcatProtocolHandlerCustomizer<?> protocolHandlerVirtualThreadExecutor() {
        return protocolHandler -> {
            protocolHandler.setExecutor(
                Executors.newVirtualThreadPerTaskExecutor()
            );
        };
    }
}`,
            explanation: "Virtual Threads são a maior mudança em concorrência Java desde o Java 5. Para aplicações I/O-bound (99% das aplicações web), eliminam a necessidade de programação reativa complexa."
          },
          {
            title: "Configurar GC para Baixa Latência",
            language: "bash",
            code: `# Flags de JVM para produção com ZGC (Java 21)
java \\
  -XX:+UseZGC \\
  -XX:MaxGCPauseMillis=10 \\
  -Xms4g \\
  -Xmx4g \\
  # Heap igual ao máximo evita resize do heap (GC extra)

  -XX:+HeapDumpOnOutOfMemoryError \\
  -XX:HeapDumpPath=/tmp/heap-dump.hprof \\

  # Monitoring
  -XX:+PrintGCDetails \\
  -XX:+PrintGCDateStamps \\
  -Xloggc:/var/log/app/gc.log \\

  # Para Virtual Threads + ZGC (Java 21)
  --enable-preview \\
  -jar app.jar

# Verificar qual GC está a ser usado
java -XX:+PrintCommandLineFlags -version | grep GC`,
            explanation: "Fixar -Xms igual a -Xmx evita que o heap cresça e encolha, o que causaria GC extra. ZGC é a melhor escolha para sistemas com requisitos de latência P99 < 10ms."
          }
        ],
        exercises: [
          {
            title: "Benchmark: Platform Threads vs Virtual Threads",
            difficulty: "intermediate",
            description: "Crie dois serviços Spring Boot idênticos: um usando platform threads (Tomcat padrão) e outro usando virtual threads. Envie 10.000 requisições concorrentes que fazem um Thread.sleep(50ms) cada. Compare throughput e latência P50/P95/P99.",
            solution: `// Serviço com Virtual Threads
@Configuration
public class VirtualThreadConfig {
    @Bean
    public TomcatProtocolHandlerCustomizer<?> virtualThreads() {
        return handler -> handler.setExecutor(
            Executors.newVirtualThreadPerTaskExecutor()
        );
    }
}

@GetMapping("/simulate-io")
public String simulateIO() throws InterruptedException {
    Thread.sleep(50); // Simula I/O blocking
    return "thread: " + Thread.currentThread().isVirtual()
        ? "virtual" : "platform";
}

// Resultado esperado:
// Platform threads: ~200 req/s (limitado pelo pool de 200 threads)
// Virtual threads: ~10.000+ req/s`
          }
        ],
        warnings: [
          "Virtual Threads e synchronized: Código que usa synchronized dentro de uma virtual thread pode causar 'pinning' — a virtual thread fica presa a uma platform thread. Use ReentrantLock em vez de synchronized em código que bloqueia.",
          "GC tuning é específico ao workload: Não existe configuração universal. Meça sempre com o workload real antes de mudar flags de GC.",
          "Thread.sleep() vs blocking I/O: Virtual Threads funcionam bem com blocking I/O (JDBC, HTTP). Não funcionam com código que usa busy-waiting ou CPU-bound loops."
        ],
        references: [
          { title: "JEP 444: Virtual Threads", url: "https://openjdk.org/jeps/444" },
          { title: "ZGC Wiki", url: "https://wiki.openjdk.org/display/zgc" },
          { title: "Java Memory Model — Brian Goetz", url: "https://www.cs.umd.edu/~pugh/java/memoryModel/" }
        ]
      },
      {
        id: "1-3",
        title: "Fundamentos de Base de Dados",
        description: "Domine os conceitos fundamentais de bases de dados relacionais — ACID, índices, query planning — que determinam a performance da maioria das aplicações.",
        content: `A base de dados é frequentemente o gargalo principal das aplicações web. Compreender os seus fundamentos é essencial para construir sistemas que escalam.

**ACID: A Base das Transações**

- **Atomicidade**: Uma transação é tudo-ou-nada. Se qualquer parte falha, toda a transação é revertida (rollback).
- **Consistência**: A transação leva a base de dados de um estado válido para outro estado válido, respeitando todas as constraints.
- **Isolamento**: Transações concorrentes não interferem entre si. O nível de isolamento controla o trade-off entre consistência e performance.
- **Durabilidade**: Após o commit, os dados persistem mesmo em caso de falha do sistema (garantido pelo WAL — Write-Ahead Log).

**Níveis de Isolamento**

Do mais relaxado ao mais estrito:
- **Read Uncommitted**: Vê dados de transações não committed (dirty reads). Raramente usado.
- **Read Committed** (padrão em PostgreSQL): Vê apenas dados committed. Evita dirty reads mas permite non-repeatable reads.
- **Repeatable Read** (padrão em MySQL): Garante que leituras repetidas na mesma transação retornam os mesmos dados. Pode sofrer de phantom reads.
- **Serializable**: Isolamento total — como se as transações executassem sequencialmente. Maior custo de performance.

**Índices: A Chave da Performance**

Um índice é uma estrutura de dados separada (geralmente B-Tree) que permite localizar registos rapidamente sem fazer um full table scan.

- **B-Tree Index**: Adequado para queries de igualdade, range queries e ordenação. O tipo padrão.
- **Hash Index**: Apenas para igualdade exata. Mais rápido que B-Tree para lookups simples.
- **Partial Index**: Índice sobre um subconjunto de linhas. Ex: CREATE INDEX ON orders(created_at) WHERE status = 'PENDING'.
- **Composite Index**: Índice sobre múltiplas colunas. A ordem das colunas importa!

**Query Planning e EXPLAIN**

O query planner do PostgreSQL/MySQL escolhe o plano de execução mais eficiente para cada query. Use EXPLAIN ANALYZE para ver o plano real.

Indicadores de problemas:
- \`Seq Scan\` numa tabela grande: Falta de índice
- \`Nested Loop\` com muitas iterações: Join sem índice
- \`Hash Join\` com muito memory: Query pode beneficiar de um índice`,
        concepts: ["ACID", "Atomicidade", "Consistência", "Isolamento", "Durabilidade", "WAL (Write-Ahead Log)", "B-Tree Index", "Hash Index", "Partial Index", "Composite Index", "EXPLAIN ANALYZE", "Query Planner", "N+1 Problem", "Connection Pool", "Deadlock", "Optimistic Locking"],
        codeExamples: [
          {
            title: "Transações e Isolamento com Spring/JPA",
            language: "java",
            code: `@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;

    // Read Committed — padrão, adequado para a maioria dos casos
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Order createOrder(CreateOrderRequest request) {
        // 1. Verificar stock
        Inventory inventory = inventoryRepository
            .findByProductIdWithLock(request.productId())
            .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        if (inventory.getQuantity() < request.quantity()) {
            throw new InsufficientStockException();
        }

        // 2. Decrementar stock (dentro da mesma transação)
        inventory.setQuantity(inventory.getQuantity() - request.quantity());
        inventoryRepository.save(inventory);

        // 3. Criar pedido
        Order order = Order.builder()
            .productId(request.productId())
            .quantity(request.quantity())
            .status(OrderStatus.CONFIRMED)
            .build();

        return orderRepository.save(order);
        // Se qualquer coisa falhar aqui, o stock é restaurado (rollback)
    }

    // Pessimistic locking — evita race conditions em stock
    @Transactional
    public Inventory reserveStock(Long productId, int quantity) {
        // SELECT ... FOR UPDATE — bloqueia a linha até commit/rollback
        return inventoryRepository.findByProductIdWithLock(productId)
            .map(inv -> {
                if (inv.getQuantity() < quantity) {
                    throw new InsufficientStockException();
                }
                inv.setQuantity(inv.getQuantity() - quantity);
                return inventoryRepository.save(inv);
            })
            .orElseThrow();
    }
}

// Repository com lock
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.productId = :productId")
    Optional<Inventory> findByProductIdWithLock(@Param("productId") Long productId);
}`,
            explanation: "PESSIMISTIC_WRITE usa SELECT FOR UPDATE, que bloqueia a linha na base de dados. Garante que apenas uma transação modifica o stock de cada vez. Cuidado com deadlocks ao bloquear múltiplas linhas."
          },
          {
            title: "Índices e EXPLAIN em PostgreSQL",
            language: "sql",
            code: `-- ❌ Query lenta — Seq Scan em orders (10M rows)
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 123
  AND status = 'PENDING'
ORDER BY created_at DESC;

-- Seq Scan on orders (cost=0.00..250000.00 rows=50 width=120)
--   Filter: (customer_id = 123 AND status = 'PENDING')
-- Planning Time: 0.5 ms
-- Execution Time: 8500 ms  ← 8.5 segundos!

-- ✅ Criar índice composto (ordem importa!)
CREATE INDEX CONCURRENTLY idx_orders_customer_status_date
ON orders(customer_id, status, created_at DESC);

-- Agora com índice:
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 123
  AND status = 'PENDING'
ORDER BY created_at DESC;

-- Index Scan using idx_orders_customer_status_date (cost=0.43..10.50 rows=50)
-- Planning Time: 0.3 ms
-- Execution Time: 0.8 ms  ← 0.8ms! Melhoria de 10.000x

-- Partial index para queries de casos comuns
CREATE INDEX CONCURRENTLY idx_orders_pending
ON orders(customer_id, created_at DESC)
WHERE status = 'PENDING';
-- Mais pequeno e mais rápido quando a maioria dos orders não é PENDING`,
            explanation: "CONCURRENTLY cria o índice sem bloquear escritas. A ordem das colunas no índice composto deve corresponder à ordem de filtragem/ordenação da query. Colunas de alta selectividade primeiro."
          }
        ],
        exercises: [
          {
            title: "Resolver o N+1 Problem",
            difficulty: "beginner",
            description: "Dado um endpoint que lista orders com os seus items, identifique o N+1 problem usando Hibernate statistics. Resolva usando JOIN FETCH ou batch fetching. Compare o número de queries antes e depois.",
            solution: `// ❌ N+1: 1 query para orders + N queries para items
List<Order> orders = orderRepository.findAll();
orders.forEach(o -> o.getItems().size()); // Lazy load por cada order

// ✅ JOIN FETCH: 1 única query
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.customerId = :id")
List<Order> findByCustomerIdWithItems(@Param("id") Long customerId);

// ✅ @BatchSize: Load em batches de 20
@OneToMany(mappedBy = "order")
@BatchSize(size = 20)
private List<OrderItem> items;

// application.yml — ativar statistics
spring.jpa.properties.hibernate.generate_statistics: true`
          }
        ],
        warnings: [
          "Nunca use Isolation.SERIALIZABLE em produção sem medir o impacto: Pode reduzir o throughput em 10x ou mais. Use apenas onde a corretude absoluta é necessária.",
          "Índices têm custo em escritas: Cada índice adicional atrasa INSERTs e UPDATEs. Não crie índices desnecessários — meça sempre.",
          "Connection Pool é crítico: Sem pool (ou com pool demasiado pequeno), cada request abre uma nova conexão à BD — overhead de 20-50ms. Use HikariCP com pool size = nCPUs * 2."
        ],
        references: [
          { title: "PostgreSQL Documentation — Indexes", url: "https://www.postgresql.org/docs/current/indexes.html" },
          { title: "Use the Index, Luke — SQL Performance", url: "https://use-the-index-luke.com/" },
          { title: "HikariCP — Pool Sizing", url: "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing" }
        ]
      },
      {
        id: "1-4",
        title: "Estratégias de Caching",
        description: "Implemente caching eficiente em múltiplas camadas para reduzir latência e aliviar a base de dados.",
        content: `O **caching** é uma das técnicas mais impactantes de otimização de sistemas. Um cache bem implementado pode reduzir a latência de centenas de milissegundos para microsegundos e aliviar dramaticamente a pressão sobre a base de dados.

**Camadas de Cache**

Os caches existem em múltiplas camadas:
- **L1/L2/L3 Cache**: Cache do CPU — microsegundos. Automático, mas relevante para hot paths.
- **In-Memory Application Cache**: Dentro do processo Java (Caffeine, Guava). Nanossegundos a microsegundos.
- **Distributed Cache**: Redis, Memcached. Microsegundos a milissegundos. Partilhado entre instâncias.
- **CDN Cache**: CloudFront, Cloudflare. Para conteúdo estático e respostas HTTP cacheáveis.
- **Database Query Cache**: Alguns DBs (MySQL) têm query cache, mas geralmente é melhor gerir explicitamente.

**Padrões de Cache**

**Cache-Aside (Lazy Loading)**: A aplicação verifica o cache; se miss, lê da BD e popula o cache. Padrão mais comum. O dado no cache pode ficar stale.

**Write-Through**: Cada escrita na BD também atualiza o cache. Dados sempre frescos mas latência de escrita maior.

**Write-Behind (Write-Back)**: Escritas vão primeiro para o cache, que as persiste na BD de forma assíncrona. Alta performance mas risco de perda de dados.

**Read-Through**: O cache está entre a aplicação e a BD. Se miss, o próprio cache busca da BD. Simplifica o código da aplicação.

**Problemas a Evitar**

- **Cache Stampede (Thundering Herd)**: Múltiplas requisições simultâneas para uma chave expirada, todas a tentar popular o cache ao mesmo tempo. Solução: probabilistic early expiration ou mutex.
- **Cache Penetration**: Queries para chaves que nunca existem (possível ataque DDoS). Solução: cache negative results ou Bloom Filter.
- **Cache Avalanche**: Muitas chaves expiram ao mesmo tempo, criando pico de carga na BD. Solução: jitter no TTL (TTL + random(0, 30s)).`,
        concepts: ["Cache-Aside", "Write-Through", "Write-Behind", "Read-Through", "TTL", "Cache Invalidation", "Cache Stampede", "Cache Penetration", "Cache Avalanche", "Bloom Filter", "Caffeine", "Redis", "Eviction Policies (LRU, LFU)", "Cache Warming", "Distributed Lock"],
        codeExamples: [
          {
            title: "Caffeine (In-Process) + Redis (Distributed)",
            language: "java",
            code: `// Configuração de cache multi-camada
@Configuration
@EnableCaching
public class CacheConfig {

    // Nível 1: Caffeine (in-process, ultra-rápido)
    @Bean
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(10_000)           // Máx 10k entradas
            .expireAfterWrite(30, SECONDS) // TTL de 30 segundos
            .recordStats()                 // Para métricas
        );
        return manager;
    }

    // Nível 2: Redis (distributed)
    @Bean
    public RedisCacheManager redisCacheManager(RedisConnectionFactory cf) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()
                )
            );

        return RedisCacheManager.builder(cf)
            .cacheDefaults(config)
            .build();
    }
}

// Serviço com Cache-Aside pattern
@Service
public class ProductService {

    private final ProductRepository repository;
    private final RedisTemplate<String, Product> redisTemplate;

    // @Cacheable — Spring gere o cache automaticamente
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public Product findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
    }

    // @CacheEvict — invalida cache ao atualizar
    @CacheEvict(value = "products", key = "#product.id")
    public Product update(Product product) {
        return repository.save(product);
    }

    // Cache manual com TTL variável (evitar avalanche)
    public Product findByIdWithJitter(Long id) {
        String key = "product:" + id;
        Product cached = (Product) redisTemplate.opsForValue().get(key);

        if (cached != null) return cached;

        Product product = repository.findById(id).orElseThrow();

        // TTL com jitter: 5min + random(0, 60s) — evita cache avalanche
        long jitter = ThreadLocalRandom.current().nextLong(60);
        redisTemplate.opsForValue().set(key, product,
            Duration.ofSeconds(300 + jitter));

        return product;
    }
}`,
            explanation: "A combinação Caffeine (L1) + Redis (L2) é ideal: Caffeine serve hits em <1ms sem rede, Redis serve hits partilhados entre instâncias em ~1ms. O jitter no TTL previne cache avalanche."
          }
        ],
        exercises: [
          {
            title: "Implementar Cache com Mutex para evitar Stampede",
            difficulty: "advanced",
            description: "Implemente um cache com Redis onde apenas uma thread/processo popula o cache em caso de miss (usando Redis SETNX como distributed lock). As outras threads devem aguardar brevemente e tentar novamente.",
            solution: `public Product findWithMutex(Long id) {
    String cacheKey = "product:" + id;
    String lockKey = "lock:product:" + id;

    // 1. Tentar ler do cache
    Product cached = redisTemplate.opsForValue().<Product>get(cacheKey);
    if (cached != null) return cached;

    // 2. Tentar adquirir lock
    Boolean acquired = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, "1", Duration.ofSeconds(10));

    if (Boolean.TRUE.equals(acquired)) {
        try {
            // 3. Populamos o cache
            Product product = repository.findById(id).orElseThrow();
            redisTemplate.opsForValue().set(cacheKey, product,
                Duration.ofMinutes(5));
            return product;
        } finally {
            redisTemplate.delete(lockKey);
        }
    } else {
        // 4. Outro processo está a popular — esperar e tentar
        Thread.sleep(50);
        return findWithMutex(id); // retry
    }
}`
          }
        ],
        warnings: [
          "Cache invalidation é difícil: 'There are only two hard things in Computer Science: cache invalidation and naming things.' — Phil Karlton. Prefira TTLs curtos a invalidação complexa.",
          "Não cache tudo: Dados que mudam frequentemente ou são altamente personalizados têm baixo cache hit rate. Meça o hit rate antes de assumir que o cache está a ajudar.",
          "Redis não é durável por defeito: Com o Redis padrão, um restart perde todos os dados. Para cache isso está bem; para dados críticos, use AOF ou RDB persistence."
        ],
        references: [
          { title: "Caffeine Cache — GitHub", url: "https://github.com/ben-manes/caffeine" },
          { title: "Redis Documentation — Data Types", url: "https://redis.io/docs/data-types/" },
          { title: "AWS — Caching Best Practices", url: "https://aws.amazon.com/caching/best-practices/" }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "escalando-servicos",
    title: "Escalando Serviços",
    subtitle: "Intermediário",
    description: "Aprenda a escalar aplicações Java para suportar milhões de utilizadores: load balancing, database scaling, messaging assíncrono e os fundamentos teóricos do CAP Theorem e consistência distribuída.",
    accentColor: "cyan",
    topics: [
      {
        id: "2-1",
        title: "Load Balancing",
        description: "Distribua o tráfego eficientemente entre instâncias com algoritmos de balanceamento e estratégias de health checking.",
        content: `O **load balancing** distribui o tráfego de rede entre múltiplos servidores, permitindo que aplicações sirvam mais utilizadores do que uma única instância conseguiria.

**Algoritmos de Load Balancing**

- **Round Robin**: Distribui sequencialmente pelas instâncias. Simples mas não considera capacidade.
- **Weighted Round Robin**: Round robin com pesos — instâncias mais poderosas recebem mais tráfego.
- **Least Connections**: Redireciona para a instância com menos conexões ativas. Melhor para requests de duração variável.
- **IP Hash**: A instância é determinada pelo IP do cliente. Garante que o mesmo cliente vai sempre para a mesma instância (session affinity). Mas limita a escalabilidade e pode criar hot spots.
- **Random**: Escolhe aleatoriamente. Surpreendentemente bom na prática — lei dos grandes números garante distribuição uniforme.
- **Least Response Time**: Combina conexões ativas e tempo de resposta médio. Melhor resultado prático mas mais complexo.

**L4 vs L7 Load Balancing**

**L4 (Transport Layer)**: Opera ao nível TCP/UDP. Rápido e eficiente. Não vê conteúdo da requisição. AWS NLB, HAProxy em modo TCP.

**L7 (Application Layer)**: Opera ao nível HTTP. Pode tomar decisões baseadas em URL, headers, cookies. Mais flexível mas mais overhead. Nginx, AWS ALB, HAProxy em modo HTTP.

**Health Checks**

Um load balancer só é útil se dirigir tráfego para instâncias saudáveis. Health checks podem ser:
- **Passive**: O LB observa falhas nas respostas normais (timeout, 5xx).
- **Active**: O LB envia periodicamente requisições específicas de health check (GET /health).

**Session Affinity (Sticky Sessions)**

Quando a aplicação guarda estado na memória da instância (sessões HTTP), o mesmo utilizador deve ir sempre para a mesma instância. Solução: cookie de sessão com o ID da instância. Mas isto limita a escalabilidade — melhor é não ter estado na instância e usar Redis para sessões.`,
        concepts: ["Round Robin", "Least Connections", "IP Hash", "L4 vs L7", "Health Check", "Session Affinity", "Sticky Sessions", "Blue-Green Deployment", "Canary Release", "Circuit Breaker", "Nginx", "AWS ALB/NLB", "Rate Limiting no LB"],
        codeExamples: [
          {
            title: "Nginx como L7 Load Balancer",
            language: "bash",
            code: `# nginx.conf — L7 Load Balancer com health checks
upstream java_backend {
    # Least connections — melhor para requests de duração variável
    least_conn;

    server app1:8080 weight=3 max_fails=3 fail_timeout=30s;
    server app2:8080 weight=3 max_fails=3 fail_timeout=30s;
    server app3:8080 weight=1 max_fails=3 fail_timeout=30s;  # Instância mais fraca

    keepalive 32;  # Pool de conexões keep-alive para o backend
}

server {
    listen 80;
    server_name api.example.com;

    # Rate limiting — 100 req/s por IP
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_req zone=api_limit burst=200 nodelay;

    location /api/ {
        proxy_pass http://java_backend;

        proxy_http_version 1.1;
        proxy_set_header Connection "";  # Keep-alive
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Health check endpoint — não faz log para não poluir
    location /health {
        proxy_pass http://java_backend/actuator/health;
        access_log off;
    }
}`,
            explanation: "max_fails e fail_timeout controlam quando uma instância é marcada como 'down'. keepalive mantém conexões abertas para o backend, evitando o overhead de TCP handshake em cada requisição."
          },
          {
            title: "Spring Boot — Actuator Health Endpoint",
            language: "java",
            code: `// Health indicator personalizado para o load balancer
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;

    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("SELECT 1");
            return Health.up()
                .withDetail("database", "PostgreSQL")
                .withDetail("status", "connected")
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}

// application.yml
// management:
//   endpoints:
//     web:
//       exposure:
//         include: health, info, metrics
//   endpoint:
//     health:
//       show-details: when-authorized
//       probes:
//         enabled: true  # Kubernetes readiness/liveness probes`,
            explanation: "O Actuator expõe /actuator/health que o load balancer usa como health check. Com probes.enabled=true, adiciona /actuator/health/readiness e /actuator/health/liveness para Kubernetes."
          }
        ],
        exercises: [
          {
            title: "Configurar Load Balancer com Docker Compose",
            difficulty: "intermediate",
            description: "Crie um docker-compose.yml com 3 instâncias de uma aplicação Spring Boot atrás de um Nginx load balancer. Configure health checks e verifique que o Nginx remove automaticamente uma instância que falha.",
            solution: `# docker-compose.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app1
      - app2
      - app3

  app1:
    image: my-spring-app
    environment:
      - INSTANCE_ID=1
  app2:
    image: my-spring-app
    environment:
      - INSTANCE_ID=2
  app3:
    image: my-spring-app
    environment:
      - INSTANCE_ID=3`
          }
        ],
        warnings: [
          "Sticky sessions limitam a escalabilidade: Se precisar de sessões, armazene-as no Redis — não na memória da instância. Assim qualquer instância pode servir qualquer utilizador.",
          "Health checks muito frequentes sobrecarregam a instância: Um health check a cada segundo em 100 instâncias são 100 req/s extras. Configure intervalos razoáveis (10-30s).",
          "DNS-based load balancing tem limitações: DNS TTL limita a velocidade de failover. Para failover rápido, use um load balancer dedicado."
        ],
        references: [
          { title: "Nginx Load Balancing", url: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/" },
          { title: "AWS Elastic Load Balancing", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html" },
          { title: "Spring Boot Actuator", url: "https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html" }
        ]
      },
      {
        id: "2-2",
        title: "Database Scaling",
        description: "Escale bases de dados através de replicação, sharding e estratégias de particionamento para suportar cargas de produção.",
        content: `Escalar a base de dados é frequentemente o maior desafio em sistemas de alta escala. Ao contrário das aplicações stateless que escalam horizontalmente com facilidade, as bases de dados têm estado e isso complica tudo.

**Read Replicas**

A estratégia mais simples: ter uma instância primária que aceita escritas e N réplicas que aceitam leituras. A replicação é assíncrona (ou síncrona para maior consistência mas maior latência).

Benefícios: Escala leituras linearmente, isola queries pesadas das escritas, pode ser usada para backups.

Limitações: As réplicas têm replication lag (atraso) — typically 1-100ms. Leituras após escritas podem ver dados desatualizados (eventual consistency).

**Connection Pooling com PgBouncer**

Cada conexão PostgreSQL consome ~5MB de memória e uma process. Com 1000 aplicações, isso são 1000 conexões — o Postgres fica sobrecarregado só com a gestão das conexões.

PgBouncer é um connection pooler: as aplicações conectam ao PgBouncer (que suporta milhares de conexões), e ele mantém um pool pequeno de conexões reais ao PostgreSQL.

**Sharding (Horizontal Partitioning)**

Divide os dados entre múltiplos nós da BD baseando-se numa shard key. Cada shard contém um subconjunto dos dados.

- **Hash-based sharding**: \`shard = hash(userId) % numShards\`. Distribuição uniforme mas difícil de rebalancear.
- **Range-based sharding**: Ex: Users A-M no shard 1, N-Z no shard 2. Permite range queries mas pode criar hot spots.
- **Directory-based sharding**: Uma tabela de lookup decide em que shard cada entidade está. Flexível mas a tabela de lookup é um bottleneck.

**CQRS (Command Query Responsibility Segregation)**

Separa completamente o modelo de leitura do modelo de escrita. As escritas (Commands) atualizam o modelo normalizado; as leituras (Queries) usam modelos desnormalizados otimizados para cada caso de uso.`,
        concepts: ["Read Replicas", "Replication Lag", "PgBouncer", "Connection Pooling", "Sharding", "Shard Key", "Hash Sharding", "Range Sharding", "CQRS", "Vertical Scaling", "Horizontal Scaling", "Database Proxy", "Read/Write Splitting", "Partitioning"],
        codeExamples: [
          {
            title: "Read/Write Splitting com Spring",
            language: "java",
            code: `// Routing DataSource para separar reads/writes
@Configuration
public class DatabaseRoutingConfig {

    @Bean
    @Primary
    public DataSource routingDataSource(
            @Qualifier("primaryDataSource") DataSource primary,
            @Qualifier("replicaDataSource") DataSource replica) {

        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put(DatabaseType.PRIMARY, primary);
        targetDataSources.put(DatabaseType.REPLICA, replica);

        AbstractRoutingDataSource routing = new AbstractRoutingDataSource() {
            @Override
            protected Object determineCurrentLookupKey() {
                return TransactionSynchronizationManager.isCurrentTransactionReadOnly()
                    ? DatabaseType.REPLICA
                    : DatabaseType.PRIMARY;
            }
        };

        routing.setDefaultTargetDataSource(primary);
        routing.setTargetDataSources(targetDataSources);
        return routing;
    }
}

// Uso no serviço
@Service
public class ProductService {

    // @Transactional(readOnly = true) redireciona para a réplica
    @Transactional(readOnly = true)
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    // @Transactional redireciona para o primário
    @Transactional
    public Product create(Product product) {
        return productRepository.save(product);
    }
}`,
            explanation: "readOnly=true redireciona automaticamente para a réplica. Simples e transparente para o código de negócio. Atenção ao replication lag — não faça uma escrita e uma leitura imediata na réplica."
          }
        ],
        exercises: [
          {
            title: "Implementar Sharding Simples",
            difficulty: "advanced",
            description: "Implemente hash-based sharding para uma entidade User em 4 shards (bases de dados diferentes). O shard é determinado por userId % 4. Implemente findById que determina automaticamente o shard correto.",
            solution: `public class ShardedUserRepository {
    private final Map<Integer, UserRepository> shards;

    private int getShardIndex(Long userId) {
        return (int) (userId % shards.size());
    }

    public User findById(Long userId) {
        return shards.get(getShardIndex(userId))
            .findById(userId)
            .orElseThrow();
    }

    public User save(User user) {
        return shards.get(getShardIndex(user.getId())).save(user);
    }
}`
          }
        ],
        warnings: [
          "Sharding é uma decisão irreversível: Uma vez que os dados estão shardados, rebalancear ou mudar a shard key é extremamente difícil. Considere bem antes de implementar.",
          "Replication lag pode causar bugs: Se ler da réplica imediatamente após escrever no primário, pode não ver a escrita. Implemente 'read your own writes' lendo do primário quando necessário.",
          "Cross-shard queries são muito caras: Se precisar fazer joins ou queries entre shards, está a perder os benefícios do sharding."
        ],
        references: [
          { title: "PgBouncer Documentation", url: "https://www.pgbouncer.org/config.html" },
          { title: "PostgreSQL Partitioning", url: "https://www.postgresql.org/docs/current/ddl-partitioning.html" },
          { title: "Martin Fowler — CQRS", url: "https://martinfowler.com/bliki/CQRS.html" }
        ]
      },
      {
        id: "2-3",
        title: "Messaging & Event-Driven Systems",
        description: "Desacople serviços e escale workloads assíncronos com Kafka e RabbitMQ.",
        content: `Os sistemas orientados a eventos permitem **desacoplar** produtores e consumidores, suportar **workloads assíncronos**, e construir pipelines de dados escaláveis.

**Quando usar Messaging**

- **Processamento assíncrono**: Envio de emails, geração de relatórios, notificações push — operações que não precisam de resposta imediata.
- **Pico de tráfego (buffering)**: O message broker absorve picos de tráfego, protegendo o sistema downstream de sobrecarga.
- **Integração entre serviços**: Cada serviço emite eventos ao invés de chamar diretamente o serviço destino.
- **Event Sourcing**: O estado da aplicação é derivado de um log de eventos.

**Kafka vs RabbitMQ**

**Kafka**: Log distribuído, altamente durável e escalável. Mensagens persistidas para N dias (configurable). Múltiplos consumers podem ler o mesmo tópico independentemente (consumer groups). Ideal para event streaming, event sourcing, e processamento de dados em larga escala.

**RabbitMQ**: Message broker tradicional. Quando a mensagem é consumida, é eliminada. Suporta routing complexo (exchanges, bindings). Mais simples de operar para casos de uso simples. Ideal para task queues e RPC assíncrono.

**Garantias de Entrega**

- **At-most-once**: A mensagem pode ser perdida mas nunca entregue duas vezes. Sem ACK.
- **At-least-once**: A mensagem é entregue pelo menos uma vez. Pode haver duplicados. O consumidor precisa de ser **idempotente**.
- **Exactly-once**: Semanticamente uma única entrega. Difícil de implementar, com overhead. Kafka suporta com transactions.

**Idempotência**

Um handler idempotente produz o mesmo resultado mesmo que seja chamado múltiplas vezes com a mesma mensagem. Estratégia: guardar o message ID numa tabela de processed_messages antes de processar. Se o ID já existe, ignorar.`,
        concepts: ["Kafka Topics", "Partitions", "Consumer Groups", "At-Least-Once", "Exactly-Once", "Idempotência", "Dead Letter Queue", "RabbitMQ Exchanges", "Backpressure", "Event Sourcing", "Outbox Pattern", "Schema Registry", "Avro / Protobuf"],
        codeExamples: [
          {
            title: "Kafka Producer e Consumer com Spring",
            language: "java",
            code: `// Producer — publica evento quando pedido é criado
@Service
public class OrderEventPublisher {

    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getCustomerId(),
            order.getTotalAmount(),
            Instant.now()
        );

        // Chave = customerId — garante ordem para o mesmo customer
        kafkaTemplate.send("orders.created", order.getCustomerId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Falha ao publicar evento para order {}", order.getId(), ex);
                    // Em produção: salvar em outbox table para retry
                } else {
                    log.info("Evento publicado: partition={}, offset={}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
                }
            });
    }
}

// Consumer — processa evento de forma idempotente
@Service
public class OrderNotificationConsumer {

    private final ProcessedMessageRepository processedMessages;
    private final NotificationService notificationService;

    @KafkaListener(
        topics = "orders.created",
        groupId = "notification-service",
        concurrency = "3"  // 3 threads para processar em paralelo
    )
    public void onOrderCreated(
            @Payload OrderCreatedEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        String messageKey = "orders.created:" + partition + ":" + offset;

        // Idempotência: verificar se já processámos esta mensagem
        if (processedMessages.exists(messageKey)) {
            log.warn("Mensagem duplicada ignorada: {}", messageKey);
            return;
        }

        try {
            notificationService.sendOrderConfirmation(event);
            processedMessages.markProcessed(messageKey);
        } catch (Exception e) {
            // Se falhar, a mensagem será reentregue (at-least-once)
            throw new RuntimeException("Falha ao processar evento", e);
        }
    }
}`,
            explanation: "A chave de partição (customerId) garante que eventos do mesmo customer vão sempre para a mesma partition e são processados em ordem. concurrency=3 cria 3 consumer threads no mesmo consumer group."
          }
        ],
        exercises: [
          {
            title: "Implementar o Outbox Pattern",
            difficulty: "advanced",
            description: "Implemente o Outbox Pattern para garantir que eventos são publicados mesmo que o serviço falhe após o commit na BD: salvar o evento numa tabela 'outbox' na mesma transação, e ter um worker que periodicamente lê e publica os eventos pendentes.",
            solution: `// Na mesma transação que salva a order
@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepository.save(new Order(req));

    // Salvar evento na tabela outbox na mesma transação
    outboxRepository.save(new OutboxEvent(
        "orders.created",
        order.getCustomerId().toString(),
        toJson(new OrderCreatedEvent(order))
    ));

    return order;
}

// Worker que publica eventos pendentes
@Scheduled(fixedDelay = 1000)
public void publishPendingEvents() {
    List<OutboxEvent> pending = outboxRepository.findPending(100);
    pending.forEach(event -> {
        kafkaTemplate.send(event.getTopic(), event.getKey(), event.getPayload());
        event.markPublished();
        outboxRepository.save(event);
    });
}`
          }
        ],
        warnings: [
          "At-least-once significa duplicados: Sempre que usar Kafka ou RabbitMQ com at-least-once delivery, os consumers devem ser idempotentes. Não assuma que uma mensagem só chega uma vez.",
          "Dead Letter Queue é essencial em produção: Mensagens que falham repetidamente devem ir para uma DLQ (Dead Letter Queue) para análise manual, não desaparecer silenciosamente.",
          "Backpressure pode matar o broker: Se os consumers são muito lentos, as mensagens acumulam no broker. Configure retention adequada e monitore consumer lag."
        ],
        references: [
          { title: "Confluent Kafka Documentation", url: "https://docs.confluent.io/kafka/introduction.html" },
          { title: "Martin Fowler — Outbox Pattern", url: "https://microservices.io/patterns/data/transactional-outbox.html" },
          { title: "Spring Kafka Reference", url: "https://docs.spring.io/spring-kafka/docs/current/reference/html/" }
        ]
      },
      {
        id: "2-4",
        title: "CAP Theorem & Consistência",
        description: "Compreenda os trade-offs fundamentais de sistemas distribuídos e como escolher o modelo de consistência adequado.",
        content: `O **CAP Theorem** (Brewer's Theorem) afirma que um sistema distribuído não pode garantir simultaneamente as três propriedades: Consistency, Availability, e Partition Tolerance.

**C — Consistency (Consistência)**
Todos os nós veem os mesmos dados ao mesmo tempo. Uma leitura retorna sempre o valor mais recente ou um erro.

**A — Availability (Disponibilidade)**
Cada pedido recebe uma resposta (não necessariamente o dado mais recente). O sistema responde sempre, mesmo que alguns nós estejam em baixo.

**P — Partition Tolerance (Tolerância a Partições)**
O sistema continua a funcionar mesmo com partições de rede (mensagens perdidas ou atrasadas entre nós).

**O dilema:** Em qualquer sistema distribuído real, as partições de rede são inevitáveis. Portanto, P não é opcional — tem de ser sempre garantido. O verdadeiro trade-off é entre C e A durante uma partição.

**CP vs AP**

**CP Systems**: Durante uma partição, preferem retornar erro a retornar dados possivelmente stale. Ex: ZooKeeper, HBase, etcd.

**AP Systems**: Durante uma partição, preferem retornar dados possivelmente stale a retornar erro. Ex: Cassandra, DynamoDB, CouchDB.

**PACELC — Uma Extensão do CAP**

O PACELC Model é mais realista: quando não há partição (else), existe um trade-off entre Latency e Consistency. Sistemas com replicação síncrona têm maior consistência mas maior latência.

**Modelos de Consistência**

- **Strong Consistency**: Linearizability — todas as operações parecem executar atomicamente num único ponto no tempo.
- **Sequential Consistency**: Operações de cada processo aparecem em ordem, mas não há garantia de ordem global.
- **Eventual Consistency**: Dado tempo suficiente sem escritas, todos os nós convergem para o mesmo valor.
- **Read-Your-Own-Writes**: Um cliente vê sempre as suas próprias escritas, mesmo que outros clientes possam não as ver imediatamente.`,
        concepts: ["CAP Theorem", "Consistency", "Availability", "Partition Tolerance", "CP vs AP", "PACELC", "Strong Consistency", "Eventual Consistency", "Read-Your-Own-Writes", "Monotonic Reads", "Vector Clocks", "CRDT", "Two-Phase Commit", "Saga Pattern"],
        codeExamples: [
          {
            title: "Eventual Consistency com Versioning",
            language: "java",
            code: `// Entidade com versão para detetar conflitos (Optimistic Locking)
@Entity
public class Account {

    @Id
    private Long id;

    private BigDecimal balance;

    @Version  // JPA/Hibernate gere automaticamente
    private Long version;
}

// Conflict resolution — Last-Write-Wins com timestamp
@Service
public class AccountSyncService {

    // Simular eventual consistency entre instâncias/regiões
    public Account merge(Account local, Account remote) {
        if (remote.getUpdatedAt().isAfter(local.getUpdatedAt())) {
            // Remote é mais recente — aceitar
            return remote;
        }

        if (local.getUpdatedAt().isAfter(remote.getUpdatedAt())) {
            // Local é mais recente — manter
            return local;
        }

        // Conflito simultâneo — estratégia depende do domínio
        // Para saldos: somar as diferenças (CRDT approach)
        BigDecimal localDelta = local.getBalance().subtract(local.getBaseBalance());
        BigDecimal remoteDelta = remote.getBalance().subtract(remote.getBaseBalance());

        Account merged = new Account(local);
        merged.setBalance(local.getBaseBalance()
            .add(localDelta)
            .add(remoteDelta));

        return merged;
    }
}`,
            explanation: "Optimistic Locking (@Version) deteta conflitos em tempo de commit. Para sistemas multi-região com eventual consistency, precisamos de estratégias de merge explícitas ou CRDTs."
          }
        ],
        exercises: [
          {
            title: "Escolher o Modelo de Consistência Correto",
            difficulty: "intermediate",
            description: "Para cada cenário, justifique se deve usar Strong Consistency ou Eventual Consistency: (1) saldo bancário, (2) contador de likes, (3) inventário de stock, (4) feed de redes sociais, (5) sessão de utilizador.",
            solution: `// Respostas:
// 1. Saldo bancário → Strong Consistency
//    Dinheiro não pode ser criado do nada por conflitos.
//    Use 2PC ou Saga com rollback.

// 2. Contador de likes → Eventual Consistency
//    Não é crítico se o contador estiver ligeiramente errado.
//    Use CRDT (Counter) para convergência automática.

// 3. Inventário → Strong Consistency ou Pessimistic Lock
//    Overselling é um problema de negócio. Use SELECT FOR UPDATE.

// 4. Feed de redes sociais → Eventual Consistency
//    Posts aparecer com ligeiro atraso é aceitável.
//    Use fan-out assíncrono via Kafka.

// 5. Sessão → Read-Your-Own-Writes
//    O utilizador deve ver o seu próprio login imediatamente.
//    Pode usar réplica com sticky reads para sessões recentes.`
          }
        ],
        warnings: [
          "Eventual consistency não significa 'inconsistente': Significa que o sistema converge para um estado consistente, dado tempo suficiente. A questão é: quanto tempo é aceitável para o seu caso de uso?",
          "Strong consistency tem custo de latência: Replicação síncrona adiciona a latência da rede entre os nós ao tempo de resposta. Para sistemas multi-região, isso pode ser 100ms+.",
          "BASE não é a resposta para tudo: ACID pode ser mais simples de implementar e mais correto para muitos casos. Não adopte eventual consistency por ser 'moderno' — adote quando for necessário."
        ],
        references: [
          { title: "Brewer's CAP Theorem (original paper)", url: "https://people.eecs.berkeley.edu/~brewer/cs262b-2004/PODC-keynote.pdf" },
          { title: "Martin Kleppmann — Designing Data-Intensive Applications", url: "https://dataintensive.net/" },
          { title: "Jepsen — Database Consistency Analysis", url: "https://jepsen.io/" }
        ]
      }
    ]
  },
  {
    id: 3,
    slug: "sistemas-distribuidos",
    title: "Sistemas Distribuídos na Prática",
    subtitle: "Avançado",
    description: "Domine os padrões e técnicas essenciais para sistemas distribuídos robustos: SAGA pattern, resiliência com circuit breakers, observabilidade completa e rate limiting.",
    accentColor: "amber",
    topics: [
      {
        id: "3-1",
        title: "SAGA Pattern",
        description: "Implemente transações distribuídas sem 2PC usando coreografia e orquestração.",
        content: `O **SAGA Pattern** resolve o problema de manter consistência de dados entre múltiplos serviços sem usar transações distribuídas (2PC), que são lentas e frágeis.

Uma SAGA é uma sequência de transações locais. Se uma transação falha, uma série de **compensating transactions** revertem as transações anteriores.

**Orquestração vs Coreografia**

**Coreografia**: Cada serviço conhece o próximo passo e emite eventos diretamente. Não existe coordenador central. Mais simples para fluxos pequenos mas difícil de visualizar e debugar à medida que cresce.

**Orquestração**: Um **orquestrador central** (Saga Orchestrator) coordena os passos, enviando comandos a cada serviço e esperando respostas. Mais complexo mas mais fácil de visualizar, monitorar e gerir erros.

**Compensating Transactions**

São operações que desfazem o efeito de uma transação. Exemplo:
- Transação: Reservar stock → Compensação: Libertar stock
- Transação: Debitar conta → Compensação: Creditar conta

Nota: As compensações são semanticamente inversas mas podem não ser tecnicamente reversíveis (ex: enviar um email não pode ser desfeito).

**Problemas do SAGA**

- **Dirty Reads**: Um serviço pode ler dados de uma SAGA que depois é revertida. Use countermeasures (semáforos, estado de saga).
- **Lost Updates**: Quando SAGAs concorrentes atualizam a mesma entidade. Use versioning.
- **Complexidade**: SAGAs são mais complexas que transações locais. Pese o custo.`,
        concepts: ["SAGA Pattern", "Compensating Transaction", "Orquestração", "Coreografia", "Saga Orchestrator", "Dirty Reads em SAGA", "Semantic Lock", "Countermeasure", "Temporal Coupling", "Saga State Machine", "Step Functions"],
        codeExamples: [
          {
            title: "Saga Orchestrator para Order Processing",
            language: "java",
            code: `// Orquestrador de SAGA para criar uma order
@Service
public class CreateOrderSaga {

    private final InventoryService inventoryService;
    private final PaymentService paymentService;
    private final ShippingService shippingService;
    private final OrderRepository orderRepository;

    @Transactional
    public OrderResult execute(CreateOrderRequest request) {
        Order order = null;
        String reservationId = null;
        String paymentId = null;

        try {
            // Passo 1: Criar order em estado PENDING
            order = orderRepository.save(Order.pending(request));

            // Passo 2: Reservar stock
            reservationId = inventoryService.reserve(
                request.productId(), request.quantity()
            );

            // Passo 3: Processar pagamento
            paymentId = paymentService.charge(
                request.customerId(), request.amount()
            );

            // Passo 4: Criar envio
            String shippingId = shippingService.schedule(
                request.customerId(), request.address()
            );

            // Todos os passos OK — confirmar order
            order.confirm(reservationId, paymentId, shippingId);
            return OrderResult.success(orderRepository.save(order));

        } catch (InventoryException e) {
            // Stock insuficiente — não há compensações necessárias
            if (order != null) order.fail("INSUFFICIENT_STOCK");
            return OrderResult.failure(e.getMessage());

        } catch (PaymentException e) {
            // Pagamento falhou — compensar: libertar stock
            if (reservationId != null) {
                inventoryService.release(reservationId); // compensação
            }
            if (order != null) order.fail("PAYMENT_FAILED");
            return OrderResult.failure(e.getMessage());

        } catch (ShippingException e) {
            // Envio falhou — compensar: reembolsar + libertar stock
            if (paymentId != null) {
                paymentService.refund(paymentId); // compensação
            }
            if (reservationId != null) {
                inventoryService.release(reservationId); // compensação
            }
            if (order != null) order.fail("SHIPPING_FAILED");
            return OrderResult.failure(e.getMessage());
        }
    }
}`,
            explanation: "O orquestrador executa cada passo em sequência. Se um passo falha, executa as compensações dos passos anteriores. O estado da order é mantido persistido para recovery em caso de falha do orquestrador."
          }
        ],
        exercises: [
          {
            title: "Implementar Saga com Coreografia via Kafka",
            difficulty: "advanced",
            description: "Implemente o fluxo de criação de order usando coreografia: OrderService emite OrderCreated → InventoryService consome e emite StockReserved ou StockFailed → PaymentService consome StockReserved e emite PaymentProcessed ou PaymentFailed → cada serviço reage aos eventos de falha com compensações.",
            solution: `// OrderService
@KafkaListener(topics = "stock.failed")
public void onStockFailed(StockFailedEvent event) {
    orderRepository.findById(event.orderId())
        .ifPresent(order -> {
            order.fail("INSUFFICIENT_STOCK");
            orderRepository.save(order);
        });
}

// InventoryService
@KafkaListener(topics = "payment.failed")
public void onPaymentFailed(PaymentFailedEvent event) {
    // Compensar: libertar o stock reservado
    reservationRepository.findByOrderId(event.orderId())
        .ifPresent(reservation -> {
            inventory.release(reservation);
            kafkaTemplate.send("stock.released", event.orderId());
        });
}`
          }
        ],
        warnings: [
          "SAGAs não são transações ACID: Uma SAGA garante eventual consistency, não isolamento. Durante a execução, outros serviços podem ver estados intermédios.",
          "Compensações devem ser idempotentes: A compensação pode ser chamada múltiplas vezes em caso de retry. Garanta que compensar duas vezes não causa problemas.",
          "Gerir o estado da SAGA é crítico: Em caso de falha do orquestrador a meio da SAGA, precisa de saber em que passo estava para continuar ou compensar corretamente."
        ],
        references: [
          { title: "Microservices Patterns — Chris Richardson", url: "https://microservices.io/patterns/data/saga.html" },
          { title: "AWS Step Functions — Saga Example", url: "https://docs.aws.amazon.com/step-functions/latest/dg/sample-saga-lambda.html" },
          { title: "Eventuate Tram — SAGA Framework", url: "https://eventuate.io/docs/manual/eventuate-tram/latest/getting-started-eventuate-tram.html" }
        ]
      },
      {
        id: "3-2",
        title: "Resiliência: Retry, Circuit Breaker, Backpressure",
        description: "Construa sistemas que sobrevivem a falhas parciais com padrões de resiliência testados em produção.",
        content: `Em sistemas distribuídos, as falhas parciais são inevitáveis. A questão não é se o serviço externo vai falhar, mas quando. Padrões de resiliência permitem que o sistema continue a funcionar mesmo quando partes dele falham.

**Retry com Backoff Exponencial**

Quando uma operação falha, tentar novamente imediatamente raramente ajuda — o sistema downstream provavelmente continua a estar sobrecarregado. Retry com **exponential backoff** espaça os tentativas: 1s, 2s, 4s, 8s... com **jitter** (componente aleatório) para evitar que múltiplos clientes façam retry ao mesmo tempo (retry storm).

**Circuit Breaker**

O Circuit Breaker monitoriza as falhas de um serviço externo. Quando as falhas excedem um threshold, o circuito "abre" — as chamadas subsequentes falham imediatamente (fail-fast) sem tentar contactar o serviço. Após um timeout, o circuito tenta novamente (half-open). Se tiver sucesso, fecha; se falhar, volta a abrir.

Estados: CLOSED (normal) → OPEN (curto-circuito) → HALF_OPEN (a testar) → CLOSED

**Bulkhead (Isolamento)**

Isolamento de recursos entre diferentes partes do sistema. Por exemplo, ter thread pools separados para chamadas a serviços diferentes. Se o serviço A fica lento e esgota o seu pool, o serviço B continua a funcionar normalmente.

**Timeout**

Toda a chamada externa deve ter um timeout. Sem timeout, uma chamada lenta pode bloquear uma thread indefinidamente, esgotando o pool de threads.

**Backpressure**

Quando um consumer não consegue processar tão rápido quanto o produtor produz, o sistema deve aplicar **backpressure** — sinais que propagam para trás para abrandar a produção. Em reactive systems (Reactor, RxJava), o backpressure é built-in.`,
        concepts: ["Retry", "Exponential Backoff", "Jitter", "Circuit Breaker", "CLOSED/OPEN/HALF_OPEN", "Bulkhead", "Timeout", "Backpressure", "Fail-Fast", "Fallback", "Resilience4j", "Rate Limiting", "Shed Load"],
        codeExamples: [
          {
            title: "Resilience4j — Circuit Breaker + Retry + Bulkhead",
            language: "java",
            code: `// Configuração Resilience4j
@Configuration
public class ResilienceConfig {

    @Bean
    public CircuitBreakerConfig circuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
            .failureRateThreshold(50)          // Abre com 50% de falhas
            .waitDurationInOpenState(Duration.ofSeconds(30))  // 30s em OPEN
            .slidingWindowSize(10)             // Janela de 10 chamadas
            .minimumNumberOfCalls(5)           // Mínimo 5 chamadas antes de avaliar
            .permittedNumberOfCallsInHalfOpenState(3)
            .build();
    }

    @Bean
    public RetryConfig retryConfig() {
        return RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(500))
            // Exponential backoff: 500ms, 1000ms, 2000ms
            .intervalFunction(IntervalFunction.ofExponentialRandomBackoff(
                Duration.ofMillis(500), 2.0, Duration.ofSeconds(5)
            ))
            .retryOnException(e -> e instanceof IOException
                || e instanceof TimeoutException)
            .build();
    }
}

// Serviço com resiliência
@Service
public class PaymentGatewayService {

    private final CircuitBreaker circuitBreaker;
    private final Retry retry;
    private final PaymentGatewayClient client;

    public PaymentResult charge(PaymentRequest request) {
        // Decorar a chamada com circuit breaker + retry
        Supplier<PaymentResult> decoratedCall = Decorators
            .ofSupplier(() -> client.charge(request))
            .withCircuitBreaker(circuitBreaker)
            .withRetry(retry)
            .withFallback(
                List.of(CallNotPermittedException.class),  // CB aberto
                ex -> PaymentResult.fallback("Circuit breaker open — tente mais tarde")
            )
            .decorate();

        return decoratedCall.get();
    }
}`,
            explanation: "Resilience4j é a biblioteca de resiliência padrão para Java moderno (substituiu Hystrix). A ordem de decoração importa: o retry é interno ao circuit breaker — se o circuito abrir, o retry não é tentado."
          }
        ],
        exercises: [
          {
            title: "Testar o Circuit Breaker",
            difficulty: "intermediate",
            description: "Configure um serviço com Circuit Breaker e escreva testes que: (1) verificam que as 5 primeiras falhas são retried, (2) após 50% de falhas o circuito abre, (3) o fallback é invocado quando o circuito está aberto, (4) após 30s em HALF_OPEN o circuito fecha com uma chamada bem-sucedida.",
            solution: `@Test
void shouldOpenCircuitAfterThreshold() {
    // Simular 10 falhas consecutivas
    when(mockClient.charge(any())).thenThrow(new IOException("timeout"));

    for (int i = 0; i < 10; i++) {
        assertThatThrownBy(() -> service.charge(request));
    }

    // Circuito deve estar OPEN
    assertThat(circuitBreaker.getState())
        .isEqualTo(CircuitBreaker.State.OPEN);

    // Chamada com circuito aberto deve usar fallback
    PaymentResult result = service.charge(request);
    assertThat(result.isFallback()).isTrue();
}`
          }
        ],
        warnings: [
          "Retry pode amplificar o problema: Se muitos clientes fazem retry ao mesmo tempo, o servidor sobrecarregado fica ainda mais sobrecarregado. Use jitter e respeite Retry-After headers.",
          "Circuit Breaker per-instance vs shared: Em aplicações com múltiplas instâncias, o circuit breaker de cada instância é independente. Um circuito pode estar aberto numa instância e fechado em outra.",
          "Timeout curto demais pode causar mais falhas: Um timeout de 100ms pode ser demasiado curto para operações normalmente rápidas que ocasionalmente demoram 150ms. Meça os percentis P95/P99 primeiro."
        ],
        references: [
          { title: "Resilience4j Documentation", url: "https://resilience4j.readme.io/docs" },
          { title: "Netflix — Hystrix Wiki (arquivado)", url: "https://github.com/Netflix/Hystrix/wiki" },
          { title: "Release It! — Michael Nygard", url: "https://pragprog.com/titles/mnee2/release-it-second-edition/" }
        ]
      },
      {
        id: "3-3",
        title: "Observabilidade: Logs, Métricas e Traces",
        description: "Implemente os três pilares da observabilidade para entender o comportamento de sistemas distribuídos em produção.",
        content: `**Observabilidade** é a capacidade de inferir o estado interno de um sistema a partir dos seus outputs externos. Os três pilares são logs, métricas e traces — cada um responde a diferentes questões.

**Logs: O Que Aconteceu**

Registos discretos de eventos. São essenciais para debugging mas podem ser caros em volume. Boas práticas:
- Use estrutured logging (JSON) em vez de texto livre — facilita parsing e indexação.
- Inclua context relevante: userId, requestId, correlationId.
- Use níveis adequados: DEBUG para desenvolvimento, INFO para eventos de negócio, WARN para situações inesperadas mas não críticas, ERROR para falhas.
- Centralize com ELK Stack (Elasticsearch + Logstash + Kibana) ou equivalente.

**Métricas: Quão Bem Está**

Dados numéricos agregados ao longo do tempo. Permitem alertas e dashboards. Tipos:
- **Counter**: Só aumenta. Ex: número de requests, erros.
- **Gauge**: Pode subir e descer. Ex: conexões ativas, tamanho da queue.
- **Histogram**: Distribuição de valores. Ex: latência por percentil.
- **Summary**: Similar ao histogram mas calculado no cliente.

Os **RED Method** e **USE Method** são frameworks para definir métricas:
- **RED**: Rate (req/s), Errors (erros/s), Duration (latência) — para services.
- **USE**: Utilization, Saturation, Errors — para resources (CPU, memória, I/O).

**Traces: Como Chegou Lá**

Rastreiam o percurso de um request através de múltiplos serviços. Cada operação é um **span** com timestamp de início/fim. Os spans são ligados por um **trace ID** que percorre toda a cadeia.

**OpenTelemetry** é o standard open-source para instrumentação. Gera logs, métricas e traces com uma única API.`,
        concepts: ["Structured Logging", "MDC (Mapped Diagnostic Context)", "ELK Stack", "Prometheus", "Grafana", "Counter / Gauge / Histogram", "RED Method", "USE Method", "Distributed Tracing", "Span", "Trace ID", "OpenTelemetry", "Micrometer", "SLO / SLI / SLA"],
        codeExamples: [
          {
            title: "Structured Logging + Micrometer + OpenTelemetry",
            language: "java",
            code: `// Structured logging com Logback + MDC
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final MeterRegistry meterRegistry;
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody CreateOrderRequest request,
            @RequestHeader("X-Correlation-ID") String correlationId) {

        // MDC propaga contexto para todos os logs neste thread
        MDC.put("correlationId", correlationId);
        MDC.put("customerId", request.customerId().toString());
        MDC.put("endpoint", "POST /api/orders");

        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            log.info("Criando order para customer {}",
                request.customerId()); // JSON: {"message": "...", "correlationId": "...", "customerId": "..."}

            Order order = orderService.create(request);

            // Métricas de sucesso
            meterRegistry.counter("orders.created",
                "customerId", request.customerId().toString()
            ).increment();

            log.info("Order criada com sucesso: orderId={}", order.getId());
            return ResponseEntity.status(201).body(order);

        } catch (InsufficientStockException e) {
            meterRegistry.counter("orders.failed",
                "reason", "INSUFFICIENT_STOCK"
            ).increment();

            log.warn("Falha ao criar order: stock insuficiente");
            return ResponseEntity.status(409).build();

        } finally {
            // Registar duração total
            sample.stop(meterRegistry.timer("orders.create.duration",
                "status", "success"
            ));
            MDC.clear(); // Limpar MDC para evitar leak entre requests
        }
    }
}`,
            explanation: "MDC (Mapped Diagnostic Context) propaga automaticamente contexto para todos os logs gerados durante o processamento do request. Com structured logging (JSON), estes campos são indexáveis no ELK."
          }
        ],
        exercises: [
          {
            title: "Configurar Dashboard Grafana com RED Metrics",
            difficulty: "intermediate",
            description: "Configure um endpoint Spring Boot com Micrometer para expor métricas em formato Prometheus. Crie um dashboard Grafana com: request rate (req/s), error rate (%), e latência P50/P95/P99 para o endpoint /api/orders.",
            solution: `# application.yml
management:
  endpoints:
    web:
      exposure:
        include: prometheus, health, info
  metrics:
    distribution:
      percentiles-histogram:
        http.server.requests: true
      percentiles:
        http.server.requests: 0.5, 0.95, 0.99

# Queries Prometheus para Grafana:
# Request Rate:
# rate(http_server_requests_seconds_count{uri="/api/orders"}[1m])

# Error Rate:
# rate(http_server_requests_seconds_count{uri="/api/orders",status=~"5.."}[1m])
# / rate(http_server_requests_seconds_count{uri="/api/orders"}[1m])

# P99 Latency:
# histogram_quantile(0.99, rate(http_server_requests_seconds_bucket{uri="/api/orders"}[5m]))`
          }
        ],
        warnings: [
          "Logs são caros: Em alta escala, logging em nível DEBUG pode gerar centenas de GB por dia. Use log sampling para DEBUG/INFO em produção e guarde apenas WARN/ERROR por defeito.",
          "Nunca log dados sensíveis: Passwords, tokens, dados pessoais (PII) não devem aparecer em logs. Use masking para campos sensíveis.",
          "Traces têm overhead de sampling: Traçar 100% dos requests é demasiado caro. Configure sampling rate (ex: 1% em produção, 100% em erros)."
        ],
        references: [
          { title: "OpenTelemetry Documentation", url: "https://opentelemetry.io/docs/" },
          { title: "Micrometer Documentation", url: "https://micrometer.io/docs" },
          { title: "Google SRE Book — Monitoring Distributed Systems", url: "https://sre.google/sre-book/monitoring-distributed-systems/" }
        ]
      },
      {
        id: "3-4",
        title: "Rate Limiting",
        description: "Proteja os seus serviços de sobrecarga e abuse com estratégias de rate limiting eficientes.",
        content: `O **rate limiting** controla o número de requests que um cliente pode fazer num determinado período de tempo. É essencial para proteger APIs de abuso, garantir fair use entre clientes, e prevenir que clientes com bugs destroem os serviços.

**Algoritmos de Rate Limiting**

**Token Bucket**: O bucket tem uma capacidade máxima de tokens. Tokens são adicionados a uma rate constante. Cada request consome um token. Se o bucket estiver vazio, o request é rejeitado. Permite bursts (útil para tráfego legítimo com picos).

**Leaky Bucket**: Requests são processados a uma rate constante, independentemente do ritmo de chegada. Suaviza bursts mas pode causar latência adicional.

**Fixed Window Counter**: Contar requests numa janela de tempo fixa (ex: 100 req/min). Simples mas sofre de race condition na fronteira da janela.

**Sliding Window Log**: Guarda o timestamp de cada request e conta quantos ocorreram na última janela. Mais preciso mas mais consumidor de memória.

**Sliding Window Counter**: Compromise entre Fixed Window e Sliding Window Log. Combina o contador da janela atual e anterior com interpolação.

**Rate Limiting Distribuído com Redis**

Em sistemas com múltiplas instâncias, o rate limiting deve ser centralizado. Redis é a solução padrão — usa operações atômicas (INCR, SET com TTL) para contar requests de forma thread-safe entre instâncias.

**Limites por Tier**

Diferentes clientes podem ter limites diferentes (rate limit tiers): free tier (100 req/min), basic (1000 req/min), premium (10000 req/min). O tier é determinado pelo API key ou JWT token.`,
        concepts: ["Token Bucket", "Leaky Bucket", "Fixed Window", "Sliding Window", "Rate Limit Headers", "429 Too Many Requests", "Retry-After", "Distributed Rate Limiting", "Redis Lua Scripts", "Rate Limit Tiers", "Per-IP vs Per-User", "API Gateway Rate Limiting"],
        codeExamples: [
          {
            title: "Rate Limiter com Redis (Sliding Window)",
            language: "java",
            code: `@Component
public class RedisRateLimiter {

    private final RedisTemplate<String, String> redis;
    private final long windowSizeMs;
    private final long maxRequests;

    // Sliding Window com Redis Sorted Set
    public RateLimitResult isAllowed(String clientId) {
        String key = "rate_limit:" + clientId;
        long now = System.currentTimeMillis();
        long windowStart = now - windowSizeMs;

        // Script Lua para atomicidade
        String luaScript = """
            local key = KEYS[1]
            local now = tonumber(ARGV[1])
            local window_start = tonumber(ARGV[2])
            local max_requests = tonumber(ARGV[3])
            local ttl = tonumber(ARGV[4])

            -- Remover requests antigos
            redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)

            -- Contar requests na janela
            local count = redis.call('ZCARD', key)

            if count < max_requests then
                -- Adicionar este request
                redis.call('ZADD', key, now, now .. '-' .. math.random(1000000))
                redis.call('EXPIRE', key, ttl)
                return {1, count + 1, max_requests}  -- allowed, current, max
            else
                return {0, count, max_requests}  -- denied
            end
            """;

        List<Object> result = redis.execute(
            RedisScript.of(luaScript, List.class),
            List.of(key),
            String.valueOf(now),
            String.valueOf(windowStart),
            String.valueOf(maxRequests),
            String.valueOf(windowSizeMs / 1000 + 1)
        );

        boolean allowed = ((Number) result.get(0)).intValue() == 1;
        long current = ((Number) result.get(1)).longValue();
        long remaining = Math.max(0, maxRequests - current);

        return new RateLimitResult(allowed, remaining, maxRequests);
    }
}

// Filter que aplica rate limiting
@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String clientId = extractClientId(request);
        RateLimitResult result = rateLimiter.isAllowed(clientId);

        // Headers padrão de rate limiting
        response.setHeader("X-RateLimit-Limit", String.valueOf(result.getLimit()));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(result.getRemaining()));
        response.setHeader("X-RateLimit-Reset",
            String.valueOf(System.currentTimeMillis() + 60_000));

        if (!result.isAllowed()) {
            response.setStatus(429); // Too Many Requests
            response.setHeader("Retry-After", "60");
            response.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
            return;
        }

        chain.doFilter(request, response);
    }
}`,
            explanation: "O script Lua é executado atomicamente no Redis — não há race conditions entre instâncias. O Sliding Window é mais justo que Fixed Window porque não permite burst na fronteira da janela."
          }
        ],
        exercises: [
          {
            title: "Implementar Rate Limiting por Tier",
            difficulty: "intermediate",
            description: "Implemente rate limiting com 3 tiers: FREE (100 req/min), BASIC (1000 req/min), PREMIUM (sem limite). O tier é determinado pelo header Authorization (JWT com campo 'tier'). Clientes sem token têm limite de 10 req/min.",
            solution: `@Component
public class TieredRateLimiter {
    private final Map<String, Long> tierLimits = Map.of(
        "FREE", 100L,
        "BASIC", 1000L,
        "PREMIUM", Long.MAX_VALUE
    );

    public RateLimitResult isAllowed(HttpServletRequest request) {
        String tier = extractTierFromJwt(request);
        long limit = tierLimits.getOrDefault(tier, 10L);

        if (limit == Long.MAX_VALUE) {
            return RateLimitResult.allowed();
        }

        String clientId = extractClientId(request);
        return rateLimiter.isAllowed(clientId, limit);
    }
}`
          }
        ],
        warnings: [
          "Rate limit por IP pode bloquear utilizadores legítimos: Em corporate networks, muitos utilizadores partilham um IP (NAT). Use API keys ou User IDs como identificador quando possível.",
          "Comunique os limites com clareza: Os headers X-RateLimit-Limit, X-RateLimit-Remaining e Retry-After são standards. Clientes bem comportados respeitam o Retry-After.",
          "Rate limiting no API Gateway é mais eficiente: Implementar no API Gateway (Kong, AWS API Gateway) evita que requests cheguem às aplicações, poupando recursos."
        ],
        references: [
          { title: "IETF Rate Limit Headers RFC", url: "https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/" },
          { title: "Stripe — Rate Limiting", url: "https://stripe.com/blog/rate-limiters" },
          { title: "Cloudflare — Rate Limiting", url: "https://developers.cloudflare.com/waf/rate-limiting-rules/" }
        ]
      }
    ]
  },
  {
    id: 4,
    slug: "arquitetura-producao",
    title: "Arquitetura de Produção",
    subtitle: "Arquiteto de Software",
    description: "Domine as decisões de arquitetura de alto nível: design multi-região, modelagem de custos, e reliability engineering com SLOs e error budgets.",
    accentColor: "amber",
    topics: [
      {
        id: "4-1",
        title: "Design Multi-Região",
        description: "Arquitete sistemas globalmente distribuídos com estratégias de replicação de dados e routing de tráfego.",
        content: `O design multi-região permite servir utilizadores globais com baixa latência e garante alta disponibilidade mesmo em caso de falha de uma região inteira (region outage).

**Active-Active vs Active-Passive**

**Active-Passive**: Uma região serve 100% do tráfego (active), a outra está em standby (passive). Failover ocorre quando a região active falha. Simples mas desperdiça capacidade e tem downtime durante o failover.

**Active-Active**: Ambas as regiões servem tráfego em simultâneo. Sem downtime em caso de falha de uma região. Mais complexo — requer sincronização de dados entre regiões.

**Data Replication Strategies**

Para bases de dados SQL:
- **Single-writer replication**: Apenas uma região aceita escritas. Escritas chegam à outra região com latência.
- **Multi-master**: Ambas as regiões aceitam escritas. Conflitos possíveis — necessitam de resolução.

Para bases de dados NoSQL:
- **DynamoDB Global Tables**: Multi-master, eventual consistency, last-write-wins.
- **Cassandra**: Distribuído por design, topology-aware, tunable consistency.

**Traffic Routing**

- **Latency-based routing**: DNS direciona utilizador para a região mais próxima (AWS Route 53).
- **Geolocation routing**: Baseado na localização geográfica do utilizador.
- **Failover routing**: Em caso de falha, DNS redireciona para região secundária.

**Data Residency & Compliance**

GDPR, LGPD e outras leis de privacidade podem exigir que dados de cidadãos europeus fiquem na Europa. Isto limita as estratégias de replicação — dados não podem ser replicados para regiões fora da jurisdição.`,
        concepts: ["Active-Active", "Active-Passive", "Failover", "Multi-Master", "Eventual Consistency", "Latency-based Routing", "GeoDNS", "Data Residency", "RPO / RTO", "Cross-Region Replication", "Global Load Balancer", "Anycast"],
        codeExamples: [
          {
            title: "Configuração Multi-Região com AWS SDK",
            language: "java",
            code: `// DynamoDB Global Table — Multi-Região
@Configuration
public class DynamoDbConfig {

    @Bean
    public DynamoDbEnhancedClient dynamoDbClient(
            @Value("${aws.region}") String region) {

        // SDK escolhe automaticamente a região mais próxima
        DynamoDbClient client = DynamoDbClient.builder()
            .region(Region.of(region))
            .credentialsProvider(DefaultCredentialsProvider.create())
            .endpointOverride(null) // null = usar endpoint regional
            .build();

        return DynamoDbEnhancedClient.builder()
            .dynamoDbClient(client)
            .build();
    }
}

// Escrever com consistent writes para a região local
@Service
public class SessionService {

    private final DynamoDbTable<UserSession> sessionTable;

    public void saveSession(UserSession session) {
        // Escreve na região local — replicado automaticamente para outras regiões
        // Last-Write-Wins em caso de conflito simultâneo
        sessionTable.putItem(
            PutItemEnhancedRequest.builder(UserSession.class)
                .item(session)
                .conditionExpression(Expression.builder()
                    .expression("attribute_not_exists(sessionId) OR version < :v")
                    .putExpressionValue(":v", AttributeValue.fromN(
                        String.valueOf(session.getVersion())))
                    .build())
                .build()
        );
    }

    public Optional<UserSession> getSession(String sessionId) {
        // Leitura eventual — pode ver sessão ligeiramente desatualizada
        return Optional.ofNullable(
            sessionTable.getItem(r -> r.key(k ->
                k.partitionValue(sessionId)))
        );
    }
}`,
            explanation: "DynamoDB Global Tables replicam automaticamente entre regiões com latência de 1-2 segundos tipicamente. A condição de escrita (version <) implementa optimistic locking para evitar conflitos."
          }
        ],
        exercises: [
          {
            title: "Calcular RPO e RTO para cada estratégia",
            difficulty: "intermediate",
            description: "Para um sistema e-commerce com bd PostgreSQL: calcule o RPO e RTO para: (1) single-region com backups diários, (2) active-passive com replicação síncrona, (3) active-active multi-região. Justifique os valores.",
            solution: `// RPO (Recovery Point Objective): Quanto de dados pode perder
// RTO (Recovery Time Objective): Quanto tempo para recuperar

// 1. Single-region com backups diários
// RPO: até 24h de dados perdidos (desde o último backup)
// RTO: horas (tempo de restore do backup)

// 2. Active-Passive com replicação síncrona
// RPO: ~0 (replicação síncrona = sem perda de dados)
// RTO: 5-15 minutos (failover de DNS + warm-up da instância passiva)

// 3. Active-Active multi-região
// RPO: ~0 com replicação síncrona; ~1s com assíncrona
// RTO: ~0 (tráfego já está a ser servido pela outra região)
// Trade-off: latência maior para escritas síncronas cross-region`
          }
        ],
        warnings: [
          "Latência de rede cross-region é elevada: Entre AWS us-east-1 e eu-west-1, a latência de rede é ~80ms. Para replicação síncrona, isso adiciona 80ms a cada escrita — avalie se é aceitável.",
          "Custos de data transfer cross-region: A AWS cobra por data transfer entre regiões (~$0.02/GB). Para sistemas com alto volume de dados, isto pode ser significativo.",
          "Test your failover: Um sistema de failover que nunca foi testado pode não funcionar quando precisar. Execute game days regulares para simular falhas de região."
        ],
        references: [
          { title: "AWS Well-Architected — Reliability Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html" },
          { title: "Google — Site Reliability Engineering", url: "https://sre.google/sre-book/table-of-contents/" },
          { title: "DynamoDB Global Tables", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html" }
        ]
      },
      {
        id: "4-2",
        title: "Modelagem de Custos & Capacity Planning",
        description: "Estime e controle custos de infraestrutura e planei capacidade para crescimento.",
        content: `A arquitetura de sistemas não é apenas sobre performance e fiabilidade — também é sobre custo. Um sistema que performa excelentemente mas custa 10x mais do que o necessário não é uma boa arquitetura.

**Capacity Planning**

O processo de estimar os recursos necessários para suportar a carga futura.

Passos:
1. **Medir** a carga atual (requests/s, CPU%, memória, IOPS)
2. **Projetar** o crescimento (ex: 20% de crescimento/mês)
3. **Estimar** os recursos para N vezes a carga atual
4. **Provisionar** com margem de segurança (tipicamente 30-50%)
5. **Monitorar** e ajustar regularmente

**Cost Modeling**

Para cada componente de arquitetura, estime o custo:
- **Compute**: EC2/ECS/EKS — $X por vCPU/hora
- **Database**: RDS/Aurora — $X por instância + $X por GB armazenado
- **Storage**: S3 — $X por GB + $X por milhão de requests
- **Network**: $X por GB de data transfer
- **Caching**: ElastiCache/Redis — $X por nó
- **Messaging**: Kafka/SQS — $X por mensagem ou por GB

**Reserved Instances vs On-Demand vs Spot**

- **On-Demand**: Sem compromisso, preço cheio. Ideal para cargas imprevisíveis.
- **Reserved Instances** (1 ou 3 anos): 40-70% de desconto. Ideal para baseline load.
- **Spot Instances**: 70-90% de desconto, mas podem ser terminadas com 2 minutos de aviso. Ideal para batch jobs, processamento tolerante a interrupções.

**FinOps Practices**

- Rightsizing: Identificar instâncias oversized e downgrade.
- Tagging: Marcar recursos com owner, projeto, ambiente para alocação de custos.
- Savings Plans: Compromisso com quantidade de compute, maior flexibilidade que Reserved Instances.
- Auto Scaling: Escalar para baixo em períodos de baixa carga.`,
        concepts: ["Capacity Planning", "Cost Modeling", "Reserved Instances", "Spot Instances", "Rightsizing", "Auto Scaling", "FinOps", "COGS", "Cost per Transaction", "Tagging Strategy", "Savings Plans", "Waste Identification"],
        codeExamples: [
          {
            title: "Auto Scaling com Spring Boot + Kubernetes HPA",
            language: "yaml",
            code: `# Kubernetes HPA — Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 2      # Mínimo para alta disponibilidade
  maxReplicas: 50     # Máximo para controlar custos
  metrics:
  # Scale up quando CPU > 70%
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70

  # Scale up quando memória > 80%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80

  # Custom metric: requests per second
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"  # 1000 req/s por pod

  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60   # Esperar 60s antes de escalar
      policies:
      - type: Percent
        value: 100    # Dobrar os pods de cada vez
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300  # 5min antes de escalar para baixo
      policies:
      - type: Percent
        value: 10     # Reduzir 10% de cada vez — mais conservador`,
            explanation: "O stabilizationWindowSeconds de scaleDown (300s) evita flapping — escalar para baixo e logo para cima por variações momentâneas de carga. Scale-up é mais agressivo para responder rapidamente a picos."
          }
        ],
        exercises: [
          {
            title: "Estimar Custo Mensal de uma Arquitetura",
            difficulty: "intermediate",
            description: "Para um serviço com 1000 req/s, latência P95 de 50ms, e 10GB de dados: estime o custo mensal em AWS us-east-1 para: EC2 (quantos e que tamanho), RDS PostgreSQL (que tier), ElastiCache Redis (que tier), e ALB. Compare com preços reais no AWS Pricing Calculator.",
            solution: `// Estimativa de capacidade:
// 1000 req/s × 50ms médio = ~50 requests concorrentes
// Com 70% CPU target: precisamos de capacidade para ~70 requests concorrentes

// EC2:
// t3.medium (2 vCPU, 4GB RAM) → ~25 req/s cada
// 3× t3.medium On-Demand: 3 × $0.0416/h × 730h = ~$91/mês
// (+ 2 para HA, 1 extra para picos)

// RDS PostgreSQL:
// db.t3.medium (2 vCPU, 4GB): $0.068/h × 730h = ~$50/mês
// Storage 10GB: $0.115/GB × 10 = $1.15/mês
// Read replica: +$50/mês

// ElastiCache Redis:
// cache.t3.micro (2 vCPU, 1.37GB): $0.017/h × 730h = ~$12/mês

// ALB: $0.008/h × 730h + $0.008/LCU = ~$25/mês

// Total estimado: ~$229/mês
// Com 1-year reserved (~40% desconto): ~$137/mês`
          }
        ],
        warnings: [
          "Rightsizing > Over-provisioning: É tentador provisionar mais para ter margem. Mas over-provisioning desnecessário pode duplicar ou triplicar os custos. Monitorize utilização e rightsize.",
          "Data transfer costs são escondidos: AWS não cobra inbound data transfer, mas cobra outbound. Para APIs com respostas grandes (downloads, reports), o data transfer pode ser a maior linha de custo.",
          "Logs e métricas também custam: CloudWatch Logs, Prometheus + Grafana com muito dados — os custos de observabilidade podem ser 20-30% do custo total. Filtre e sample agressivamente."
        ],
        references: [
          { title: "AWS Pricing Calculator", url: "https://calculator.aws/pricing/2/home" },
          { title: "FinOps Foundation", url: "https://www.finops.org/introduction/what-is-finops/" },
          { title: "Kubernetes HPA Documentation", url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" }
        ]
      },
      {
        id: "4-3",
        title: "Reliability Engineering: SLA, SLO, Error Budgets",
        description: "Defina e meça a fiabilidade dos seus serviços com a framework SRE da Google.",
        content: `A **Reliability Engineering** (ou Site Reliability Engineering — SRE) é a disciplina de construir e operar sistemas altamente fiáveis. A framework SRE da Google introduziu conceitos fundamentais: SLA, SLI, SLO, e Error Budgets.

**SLI — Service Level Indicator**

Uma métrica que mede a qualidade do serviço do ponto de vista do utilizador. Exemplos:
- Availability: % de requests bem-sucedidos (status < 500)
- Latência: % de requests com duração < 200ms
- Error Rate: % de requests com erro

**SLO — Service Level Objective**

Um objetivo para um SLI. Um target que o serviço deve cumprir. Ex: "99.9% de requests devem ser bem-sucedidos" ou "P99 latência < 500ms".

**SLA — Service Level Agreement**

Um contrato formal com o cliente que define as consequências (geralmente reembolsos/créditos) se os SLOs não forem cumpridos.

**Error Budget**

Se o SLO é 99.9% availability, o error budget é 0.1% — ou seja, ~43 minutos de downtime/mês são "permitidos". Este budget é partilhado entre deployments, incidents, e mudanças.

O Error Budget muda a conversa: "Podemos fazer deploy hoje?" → "Quanto do nosso error budget temos disponível?" Se o budget está esgotado, freeze de deploys.

**Reliability vs Velocity**

O Error Budget cria um incentivo perfeito: se há muito budget disponível, podem fazer features rapidamente com algum risco. Se o budget está a esgotar, devem abrandar e focar em reliability. Equilibra velocity e stability sem julgamentos.

**Toil**

Trabalho operacional repetitivo que escala com o tamanho do sistema — manual, automável, sem valor duradouro. SRE teams devem manter toil < 50% do seu tempo. Toil = oportunidade de automação.`,
        concepts: ["SLI", "SLO", "SLA", "Error Budget", "Availability Nines", "P50/P95/P99", "MTTR", "MTBF", "Toil", "Runbook", "Postmortem", "Blameless Culture", "Chaos Engineering", "Game Days", "On-Call Rotation"],
        codeExamples: [
          {
            title: "Calcular e Alertar sobre Error Budget",
            language: "java",
            code: `// Serviço que calcula e monitoriza o Error Budget
@Service
public class ErrorBudgetService {

    // SLO: 99.9% availability = 0.1% error rate permitida
    private static final double SLO_TARGET = 0.999;
    private static final double ERROR_BUDGET = 1.0 - SLO_TARGET; // 0.001

    private final MetricsRepository metricsRepository;
    private final AlertService alertService;

    @Scheduled(fixedDelay = 60_000) // A cada minuto
    public void checkErrorBudget() {
        // Calcular error rate das últimas 30 dias
        Instant windowStart = Instant.now().minus(Duration.ofDays(30));
        Instant windowEnd = Instant.now();

        long totalRequests = metricsRepository.countRequests(windowStart, windowEnd);
        long errorRequests = metricsRepository.countErrors(windowStart, windowEnd);

        if (totalRequests == 0) return;

        double actualErrorRate = (double) errorRequests / totalRequests;
        double errorBudgetConsumed = actualErrorRate / ERROR_BUDGET;

        ErrorBudgetStatus status = new ErrorBudgetStatus(
            SLO_TARGET,
            actualErrorRate,
            errorBudgetConsumed,
            ERROR_BUDGET - actualErrorRate, // remaining
            totalRequests,
            errorRequests
        );

        log.info("Error Budget Status: consumed={}%, remaining={}%",
            String.format("%.2f", errorBudgetConsumed * 100),
            String.format("%.4f", (ERROR_BUDGET - actualErrorRate) * 100)
        );

        // Alertar se > 50% do budget consumido
        if (errorBudgetConsumed > 0.5 && errorBudgetConsumed <= 0.8) {
            alertService.warn("Error budget 50%+ consumido",
                "Considerar abrandar deployments");
        }

        // Alertar se > 80% do budget consumido
        if (errorBudgetConsumed > 0.8) {
            alertService.critical("Error budget crítico: " +
                String.format("%.0f", errorBudgetConsumed * 100) + "% consumido",
                "FREEZE DE DEPLOYMENTS recomendado");
        }
    }

    // Calcular SLO compliance
    public SloCompliance calculateSloCompliance(Duration window) {
        Instant start = Instant.now().minus(window);

        long total = metricsRepository.countRequests(start, Instant.now());
        long successful = metricsRepository.countSuccesses(start, Instant.now());

        double availability = total > 0 ? (double) successful / total : 1.0;
        boolean sloMet = availability >= SLO_TARGET;

        return new SloCompliance(availability, SLO_TARGET, sloMet, window);
    }
}`,
            explanation: "O Error Budget é calculado como a diferença entre o target (99.9%) e o atual. Quando >80% está consumido, deve-se freezar deployments e focar em reliability. O ciclo de 30 dias é comum — resetar mensalmente."
          }
        ],
        exercises: [
          {
            title: "Definir SLOs para um Serviço de E-commerce",
            difficulty: "intermediate",
            description: "Para um serviço de checkout (o mais crítico): defina SLIs relevantes, escolha targets de SLO adequados (99.9%? 99.99%? 99.999%?), calcule o error budget em minutos/mês para cada, e justifique as escolhas considerando o custo de cada nível de reliability.",
            solution: `// SLIs para checkout:
// 1. Availability: % requests com status < 500
// 2. Latência: % requests com duração < 2s (utilizador espera max 2s)
// 3. Correctness: % transações processadas corretamente

// SLOs e Error Budgets:
// 99.9% availability = 43.8 min downtime/mês
// Custo: razoável com 3 réplicas + RDS Multi-AZ

// 99.95% availability = 21.9 min downtime/mês
// Custo: requer mais redundância, ~2x mais caro

// 99.99% availability = 4.4 min downtime/mês
// Custo: muito mais complexo (multi-região ativo-ativo), 5-10x mais caro

// Recomendação: 99.95% para checkout
// Justificação: 99.9% tem muitos incidentes aceitáveis,
// 99.99% tem custo desproporcional para este tipo de negócio

// Latência SLO: P99 < 2s
// Error budget: 1% dos requests podem demorar > 2s`
          }
        ],
        warnings: [
          "100% availability não existe: Tentar atingir 99.999% (5 nines) tem custo exponencialmente maior que 99.9%. Avalie se o negócio realmente precisa disso e se os clientes notariam a diferença.",
          "SLOs sem consequence são inúteis: Se o SLO não tiver nenhum efeito quando violado (sem error budget policy, sem freeze de features), deixa de ser um objetivo real.",
          "Meça do ponto de vista do utilizador: Um SLO baseado em health checks internos pode mostrar 100% disponível enquanto os utilizadores estão a ver erros. Use synthetic monitoring (test requests reais do exterior)."
        ],
        references: [
          { title: "Google SRE Book — Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/" },
          { title: "SRE Workbook — Implementing SLOs", url: "https://sre.google/workbook/implementing-slos/" },
          { title: "Alex Ewerlöf — Error Budget Policy", url: "https://alexewerlof.medium.com/my-take-on-the-error-budget-policy-99b4dcc73d3" }
        ]
      }
    ]
  }
];
