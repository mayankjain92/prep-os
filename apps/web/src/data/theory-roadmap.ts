import { RoadmapSection } from "@/components/shared/RoadmapFlowChart";

export const THEORY_ROADMAP_SECTIONS: RoadmapSection[] = [
  {
    mainId: "theory-os",
    mainTitle: "Operating Systems (OS)",
    description: "Core principles of process scheduling, synchronization, virtual memory, and file systems.",
    leftNodes: [
      { 
        id: "os-intro", 
        title: "Process & Thread Management", 
        description: "Execution contexts.",
        subNodes: [
          { 
            id: "os-pcb", 
            title: "Process Control Block (PCB)",
            subNodes: [
              { id: "os-pcb-states", title: "Process States" },
              { id: "os-pcb-ctx", title: "Context Switching" },
              { id: "os-pcb-fork", title: "Fork & Exec" },
            ]
          },
          { 
            id: "os-threads", 
            title: "Threads & Concurrency",
            subNodes: [
              { id: "os-th-usr", title: "User vs Kernel Threads" },
              { id: "os-th-mod", title: "Multithreading Models" },
            ]
          },
          { 
            id: "os-scheduling", 
            title: "CPU Scheduling",
            subNodes: [
              { id: "os-sch-fcfs", title: "FCFS & SJF" },
              { id: "os-sch-rr", title: "SRTF & Round Robin" },
              { id: "os-sch-prio", title: "Priority Scheduling" },
            ]
          },
        ]
      },
      { 
        id: "os-sync", 
        title: "Process Synchronization", 
        description: "Coordinating concurrent execution.",
        subNodes: [
          { 
            id: "os-mutex", 
            title: "Mutex & Semaphores",
            subNodes: [
              { id: "os-mx-spin", title: "Spinlocks & Monitors" },
              { id: "os-mx-sem", title: "Binary vs Counting Semaphores" },
            ]
          },
          { 
            id: "os-classic", 
            title: "Classical Problems",
            subNodes: [
              { id: "os-cp-prod", title: "Producer-Consumer" },
              { id: "os-cp-read", title: "Reader-Writer" },
              { id: "os-cp-dine", title: "Dining Philosophers" },
            ]
          },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "os-deadlock", 
        title: "Deadlocks", 
        description: "Resource allocation issues.",
        subNodes: [
          { 
            id: "os-coffman", 
            title: "Coffman Conditions",
            subNodes: [
              { id: "os-cf-mut", title: "Mutual Exclusion" },
              { id: "os-cf-hold", title: "Hold & Wait" },
              { id: "os-cf-nopre", title: "No Preemption" },
              { id: "os-cf-circ", title: "Circular Wait" },
            ]
          },
          { 
            id: "os-banker", 
            title: "Banker's Algorithm",
            subNodes: [
              { id: "os-ba-avoid", title: "Deadlock Avoidance" },
              { id: "os-ba-rag", title: "Resource Allocation Graphs (RAG)" },
            ]
          },
        ]
      },
      { 
        id: "os-memory", 
        title: "Memory Management", 
        description: "RAM and Virtual Memory.",
        subNodes: [
          { 
            id: "os-paging", 
            title: "Paging & Segmentation",
            subNodes: [
              { id: "os-pg-cont", title: "Contiguous vs Non-contiguous" },
              { id: "os-pg-tlb", title: "Translation Lookaside Buffer (TLB)" },
              { id: "os-pg-frag", title: "Fragmentation (Internal & External)" },
            ]
          },
          { 
            id: "os-virtual", 
            title: "Virtual Memory",
            subNodes: [
              { id: "os-vm-dem", title: "Demand Paging" },
              { id: "os-vm-fault", title: "Page Faults" },
              { id: "os-vm-thrash", title: "Thrashing" },
            ]
          },
          { 
            id: "os-replace", 
            title: "Page Replacement",
            subNodes: [
              { id: "os-rp-fifo", title: "FIFO & LRU" },
              { id: "os-rp-opt", title: "Optimal Page Replacement" },
              { id: "os-rp-bel", title: "Belady's Anomaly" },
            ]
          },
        ]
      },
      { 
        id: "os-storage", 
        title: "Storage & File Systems", 
        description: "Disk management.",
        subNodes: [
          { 
            id: "os-fs", 
            title: "File Systems",
            subNodes: [
              { id: "os-fs-inode", title: "Inodes & Directory Structures" },
              { id: "os-fs-alloc", title: "File Allocation Methods" },
            ]
          },
          { 
            id: "os-disk", 
            title: "Disk Scheduling",
            subNodes: [
              { id: "os-ds-fcfs", title: "FCFS & SSTF" },
              { id: "os-ds-scan", title: "SCAN & C-SCAN" },
              { id: "os-ds-look", title: "LOOK & C-LOOK" },
            ]
          },
        ]
      },
    ],
  },
  {
    mainId: "theory-dbms",
    mainTitle: "Database Management Systems (DBMS)",
    description: "Relational database architecture, SQL optimization, ACID guarantees, and normalization.",
    leftNodes: [
      { 
        id: "db-design", 
        title: "Architecture & Design", 
        description: "Database schemas and models.",
        subNodes: [
          { 
            id: "db-arch", 
            title: "DBMS Architecture",
            subNodes: [
              { id: "db-ar-1t", title: "1-tier Architecture" },
              { id: "db-ar-2t", title: "2-tier Architecture" },
              { id: "db-ar-3t", title: "3-tier Architecture" },
            ]
          },
          { 
            id: "db-er", 
            title: "ER Model",
            subNodes: [
              { id: "db-er-ent", title: "Entities & Relationships" },
              { id: "db-er-card", title: "Cardinality & Weak Entities" },
            ]
          },
          { 
            id: "db-rel", 
            title: "Relational Algebra",
            subNodes: [
              { id: "db-ra-spc", title: "Select, Project, Cartesian" },
              { id: "db-ra-join", title: "Joins" },
              { id: "db-ra-calc", title: "Relational Tuple Calculus" },
            ]
          },
        ]
      },
      { 
        id: "db-sql", 
        title: "SQL Mastery", 
        description: "Data query language.",
        subNodes: [
          { 
            id: "db-queries", 
            title: "Advanced Queries",
            subNodes: [
              { id: "db-aq-io", title: "Inner & Outer Joins" },
              { id: "db-aq-cr", title: "Cross Joins" },
              { id: "db-aq-sub", title: "Subqueries & Correlated" },
            ]
          },
          { 
            id: "db-window", 
            title: "Window Functions",
            subNodes: [
              { id: "db-wf-rank", title: "RANK & DENSE_RANK" },
              { id: "db-wf-row", title: "ROW_NUMBER" },
            ]
          },
          { 
            id: "db-triggers", 
            title: "Triggers & Procedures",
            subNodes: [
              { id: "db-tr-act", title: "Triggers (Automated Actions)" },
              { id: "db-tr-proc", title: "Stored Procedures" },
            ]
          },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "db-norm", 
        title: "Normalization & Indexing", 
        description: "Optimizing structure and access.",
        subNodes: [
          { 
            id: "db-nf", 
            title: "Normal Forms",
            subNodes: [
              { id: "db-nf-anom", title: "Anomalies & Dependencies" },
              { id: "db-nf-12", title: "1NF & 2NF" },
              { id: "db-nf-3b", title: "3NF & BCNF" },
            ]
          },
          { 
            id: "db-index", 
            title: "Indexing Strategies",
            subNodes: [
              { id: "db-ix-ps", title: "Primary & Secondary Indexing" },
              { id: "db-ix-cu", title: "Clustered & Unclustered" },
            ]
          },
          { 
            id: "db-btree", 
            title: "B-Trees & B+ Trees",
            subNodes: [
              { id: "db-bt-b", title: "B-Trees" },
              { id: "db-bt-bp", title: "B+ Trees" },
            ]
          },
        ]
      },
      { 
        id: "db-trans", 
        title: "Transactions & Concurrency", 
        description: "Data integrity.",
        subNodes: [
          { 
            id: "db-acid", 
            title: "ACID Properties",
            subNodes: [
              { id: "db-ac-ac", title: "Atomicity & Consistency" },
              { id: "db-ac-id", title: "Isolation & Durability" },
            ]
          },
          { 
            id: "db-serial", 
            title: "Serializability",
            subNodes: [
              { id: "db-sr-conf", title: "Conflict Serializability" },
              { id: "db-sr-view", title: "View Serializability" },
            ]
          },
          { 
            id: "db-lock", 
            title: "Concurrency Control",
            subNodes: [
              { id: "db-cc-2pl", title: "2-Phase Locking (2PL)" },
              { id: "db-cc-ts", title: "Timestamp Ordering" },
              { id: "db-cc-dead", title: "Deadlocks in DBMS" },
            ]
          },
        ]
      },
      { 
        id: "db-nosql", 
        title: "Distributed DBs & NoSQL", 
        description: "Modern data storage.",
        subNodes: [
          { 
            id: "db-cap", 
            title: "CAP Theorem",
            subNodes: [
              { id: "db-ca-ca", title: "Consistency & Availability" },
              { id: "db-ca-pt", title: "Partition Tolerance" },
            ]
          },
          { 
            id: "db-nosql-types", 
            title: "NoSQL Types",
            subNodes: [
              { id: "db-nq-kv", title: "Key-Value & Document DBs" },
              { id: "db-nq-cg", title: "Column-Family & Graph DBs" },
            ]
          },
          { 
            id: "db-shard", 
            title: "Sharding",
            subNodes: [
              { id: "db-sh-part", title: "Partitioning & Replication" },
              { id: "db-sh-2pc", title: "2-Phase Commit (2PC)" },
            ]
          },
        ]
      },
    ],
  },
  {
    mainId: "theory-cn",
    mainTitle: "Computer Networks (CN)",
    description: "Layered protocol stack, routing algorithms, transport mechanisms, and web security.",
    leftNodes: [
      { 
        id: "cn-models", 
        title: "Network Models & Lower Layers", 
        description: "Physical to Network layer.",
        subNodes: [
          { 
            id: "cn-osi", 
            title: "OSI & TCP/IP Models",
            subNodes: [
              { id: "cn-os-7l", title: "OSI 7-Layer Model" },
              { id: "cn-os-4l", title: "TCP/IP 4-Layer Model" },
            ]
          },
          { 
            id: "cn-datalink", 
            title: "Data Link Layer",
            subNodes: [
              { id: "cn-dl-err", title: "Framing & Error Detection" },
              { id: "cn-dl-mac", title: "CSMA/CD & MAC Addressing" },
            ]
          },
          { 
            id: "cn-network", 
            title: "Network Layer",
            subNodes: [
              { id: "cn-nw-ip", title: "IPv4 vs IPv6" },
              { id: "cn-nw-arp", title: "ARP/RARP & ICMP" },
            ]
          },
          { 
            id: "cn-subnet", 
            title: "Subnetting",
            subNodes: [
              { id: "cn-sn-cidr", title: "CIDR & Subnet Masks" },
              { id: "cn-sn-vlsm", title: "Variable Length Subnet Mask (VLSM)" },
            ]
          },
          { 
            id: "cn-routing", 
            title: "Routing Algorithms",
            subNodes: [
              { id: "cn-rt-rip", title: "Distance Vector (RIP)" },
              { id: "cn-rt-ospf", title: "Link State (OSPF)" },
              { id: "cn-rt-bgp", title: "Border Gateway Protocol (BGP)" },
            ]
          },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "cn-upper", 
        title: "Upper Layers & Security", 
        description: "Transport to Application.",
        subNodes: [
          { 
            id: "cn-transport", 
            title: "Transport Layer",
            subNodes: [
              { id: "cn-tp-tu", title: "TCP vs UDP" },
              { id: "cn-tp-3w", title: "3-Way Handshake" },
              { id: "cn-tp-port", title: "Ports & Sockets" },
            ]
          },
          { 
            id: "cn-tcp", 
            title: "TCP Control",
            subNodes: [
              { id: "cn-tc-flow", title: "Flow Control (Sliding Window)" },
              { id: "cn-tc-cong", title: "Congestion Control (Slow Start)" },
            ]
          },
          { 
            id: "cn-app", 
            title: "Application Layer",
            subNodes: [
              { id: "cn-ap-http", title: "HTTP/1.1 vs HTTP/2 & HTTPS" },
              { id: "cn-ap-dns", title: "DNS & FTP" },
              { id: "cn-ap-smtp", title: "SMTP & POP3 (Email)" },
            ]
          },
          { 
            id: "cn-sockets", 
            title: "WebSockets",
            subNodes: [
              { id: "cn-ws-poll", title: "HTTP Polling & Long-Polling" },
              { id: "cn-ws-proto", title: "WebSocket Protocol" },
            ]
          },
          { 
            id: "cn-sec", 
            title: "Network Security",
            subNodes: [
              { id: "cn-sc-cryp", title: "Symmetric & Asymmetric Crypto" },
              { id: "cn-sc-ssl", title: "SSL/TLS Handshake" },
              { id: "cn-sc-fw", title: "Firewalls & IDS" },
            ]
          },
        ]
      },
    ],
  },
  {
    mainId: "theory-oop",
    mainTitle: "Object-Oriented Programming (OOP)",
    description: "Core OOP paradigms, clean design patterns, SOLID principles, and software architecture.",
    leftNodes: [
      { 
        id: "oop-core", 
        title: "Core Concepts", 
        description: "The foundations of object design.",
        subNodes: [
          { 
            id: "oop-pillars", 
            title: "The 4 Pillars",
            subNodes: [
              { id: "oop-pl-enc", title: "Encapsulation" },
              { id: "oop-pl-abs", title: "Abstraction" },
              { id: "oop-pl-inh", title: "Inheritance" },
              { id: "oop-pl-poly", title: "Polymorphism" },
            ]
          },
          { 
            id: "oop-classes", 
            title: "Classes & Objects",
            subNodes: [
              { id: "oop-cl-cons", title: "Constructors & Destructors" },
              { id: "oop-cl-abs", title: "Abstract Classes & Interfaces" },
            ]
          },
        ]
      },
      { 
        id: "oop-solid", 
        title: "SOLID Principles", 
        description: "Writing maintainable code.",
        subNodes: [
          { 
            id: "oop-s", 
            title: "Single Responsibility",
            subNodes: [
              { id: "oop-so-srp", title: "Single Responsibility Principle" },
            ]
          },
          { 
            id: "oop-o", 
            title: "Open/Closed",
            subNodes: [
              { id: "oop-so-ocp", title: "Open/Closed Principle" },
            ]
          },
          { 
            id: "oop-l", 
            title: "Liskov Substitution",
            subNodes: [
              { id: "oop-so-lsp", title: "Liskov Substitution Principle" },
            ]
          },
          { 
            id: "oop-i", 
            title: "Interface Segregation",
            subNodes: [
              { id: "oop-so-isp", title: "Interface Segregation Principle" },
            ]
          },
          { 
            id: "oop-d", 
            title: "Dependency Inversion",
            subNodes: [
              { id: "oop-so-dip", title: "Dependency Inversion Principle" },
            ]
          },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "oop-patterns", 
        title: "Design Patterns (GoF)", 
        description: "Proven solutions to common design problems.",
        subNodes: [
          { 
            id: "pat-create", 
            title: "Creational Patterns",
            subNodes: [
              { id: "oop-pt-sing", title: "Singleton Pattern" },
              { id: "oop-pt-fact", title: "Factory Method & Abstract Factory" },
              { id: "oop-pt-build", title: "Builder Pattern" },
            ]
          },
          { 
            id: "pat-struct", 
            title: "Structural Patterns",
            subNodes: [
              { id: "oop-pt-adap", title: "Adapter Pattern" },
              { id: "oop-pt-deco", title: "Decorator Pattern" },
              { id: "oop-pt-fac", title: "Facade & Proxy" },
            ]
          },
          { 
            id: "pat-behav", 
            title: "Behavioral Patterns",
            subNodes: [
              { id: "oop-pt-obs", title: "Observer Pattern" },
              { id: "oop-pt-strat", title: "Strategy Pattern" },
              { id: "oop-pt-cmd", title: "Command & Iterator" },
            ]
          },
        ]
      },
    ],
  },
  {
    mainId: "theory-aptitude",
    mainTitle: "Quantitative Aptitude & Logical Reasoning",
    description: "Problem-solving techniques, numerical analysis, spatial reasoning, and interview mathematics.",
    leftNodes: [
      { 
        id: "apt-arithmetic", 
        title: "Arithmetic & Core Concepts", 
        description: "Fundamental mathematics.",
        subNodes: [
          { 
            id: "apt-num-sys", 
            title: "Number System",
            subNodes: [
              { id: "apt-ns-prop", title: "Properties of Numbers" },
              { id: "apt-ns-div", title: "Divisibility Rules" },
              { id: "apt-ns-rem", title: "Remainders Theorem" }
            ]
          },
          { 
            id: "apt-hcf-lcm", 
            title: "HCF & LCM",
            subNodes: [
              { id: "apt-hl-hcf", title: "Highest Common Factor" },
              { id: "apt-hl-lcm", title: "Lowest Common Multiple" },
              { id: "apt-hl-app", title: "Applications of HCF & LCM" }
            ]
          },
          { 
            id: "apt-percent", 
            title: "Percentages",
            subNodes: [
              { id: "apt-pc-frac", title: "Fractions to Percentages" },
              { id: "apt-pc-succ", title: "Successive Percentage Change" }
            ]
          },
          { 
            id: "apt-profit-loss", 
            title: "Profit & Loss",
            subNodes: [
              { id: "apt-pl-cp", title: "Cost Price & Selling Price" },
              { id: "apt-pl-mark", title: "Markups & Discounts" },
              { id: "apt-pl-faulty", title: "Faulty Weights" }
            ]
          },
          { 
            id: "apt-si-ci", 
            title: "Simple & Compound Interest",
            subNodes: [
              { id: "apt-int-si", title: "Simple Interest" },
              { id: "apt-int-ci", title: "Compound Interest" }
            ]
          },
        ]
      },
      { 
        id: "apt-commercial", 
        title: "Ratios & Mixtures", 
        description: "Proportionality and comparisons.",
        subNodes: [
          { 
            id: "apt-ratio", 
            title: "Ratio & Proportion",
            subNodes: [
              { id: "apt-rp-dir", title: "Direct Proportion" },
              { id: "apt-rp-inv", title: "Inverse Proportion" }
            ]
          },
          { 
            id: "apt-avg", 
            title: "Averages",
            subNodes: [
              { id: "apt-av-mean", title: "Mean Calculations" },
              { id: "apt-av-weight", title: "Weighted Averages" }
            ]
          },
          { 
            id: "apt-partnership", 
            title: "Partnership & Ages",
            subNodes: [
              { id: "apt-pa-bus", title: "Business Investments" },
              { id: "apt-pa-age", title: "Age-related Equations" }
            ]
          },
          { 
            id: "apt-mixture", 
            title: "Mixture & Allegation",
            subNodes: [
              { id: "apt-ma-mix", title: "Mixing Quantities" },
              { id: "apt-ma-rep", title: "Replacement Problems" }
            ]
          },
        ]
      },
      { 
        id: "apt-speed-work", 
        title: "Time, Speed & Work", 
        description: "Rates of work and travel.",
        subNodes: [
          { 
            id: "apt-time-work", 
            title: "Time & Work",
            subNodes: [
              { id: "apt-tw-eff", title: "Efficiency & Man-days" },
              { id: "apt-tw-pipe", title: "Pipes and Cisterns" }
            ]
          },
          { 
            id: "apt-tsd", 
            title: "Time, Speed & Distance",
            subNodes: [
              { id: "apt-ts-rel", title: "Relative Speed" },
              { id: "apt-ts-train", title: "Problems on Trains" },
              { id: "apt-ts-boat", title: "Boats and Streams" }
            ]
          },
        ]
      },
      { 
        id: "apt-modern", 
        title: "Modern Math & Geometry", 
        description: "Counting, probability, and shapes.",
        subNodes: [
          { 
            id: "apt-pnc", 
            title: "Permutation & Combination",
            subNodes: [
              { id: "apt-pc-perm", title: "Permutations (Arrangements)" },
              { id: "apt-pc-comb", title: "Combinations (Selections)" }
            ]
          },
          { 
            id: "apt-prob", 
            title: "Probability",
            subNodes: [
              { id: "apt-pr-evt", title: "Events & Outcomes" },
              { id: "apt-pr-cond", title: "Conditional Probability" }
            ]
          },
          { 
            id: "apt-mensuration", 
            title: "Mensuration",
            subNodes: [
              { id: "apt-me-2d", title: "2D Geometry & Areas" },
              { id: "apt-me-3d", title: "3D Geometry & Volumes" }
            ]
          },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "apt-analytical", 
        title: "Analytical Reasoning", 
        description: "Visualizing and relating concepts.",
        subNodes: [
          { 
            id: "apt-clocks", 
            title: "Clocks",
            subNodes: [
              { id: "apt-ck-ang", title: "Angles between Hands" },
              { id: "apt-ck-gain", title: "Gaining/Losing Time" }
            ]
          },
          { 
            id: "apt-calendar", 
            title: "Calendar",
            subNodes: [
              { id: "apt-ca-odd", title: "Odd Days Concept" },
              { id: "apt-ca-day", title: "Finding the Day of the Week" }
            ]
          },
          { 
            id: "apt-cubes", 
            title: "Cubes",
            subNodes: [
              { id: "apt-cb-paint", title: "Painted Faces" },
              { id: "apt-cb-cut", title: "Cutting Cubes" }
            ]
          },
          { 
            id: "apt-dice", 
            title: "Dice",
            subNodes: [
              { id: "apt-dc-opp", title: "Opposite Faces" },
              { id: "apt-dc-unfold", title: "Unfolding Dice" }
            ]
          },
          { 
            id: "apt-direction", 
            title: "Direction Sense",
            subNodes: [
              { id: "apt-dr-card", title: "Cardinal Directions" },
              { id: "apt-dr-path", title: "Shortest Paths" }
            ]
          },
          { 
            id: "apt-blood", 
            title: "Blood Relations",
            subNodes: [
              { id: "apt-br-tree", title: "Family Trees" },
              { id: "apt-br-code", title: "Coded Relations" }
            ]
          },
        ]
      },
      { 
        id: "apt-logical", 
        title: "Logical & Pattern Reasoning", 
        description: "Decoding patterns and structures.",
        subNodes: [
          { 
            id: "apt-arrangement", 
            title: "Data Arrangement",
            subNodes: [
              { id: "apt-ar-lin", title: "Linear Seating" },
              { id: "apt-ar-circ", title: "Circular Seating" }
            ]
          },
          { 
            id: "apt-series", 
            title: "Series",
            subNodes: [
              { id: "apt-sr-num", title: "Number Series" },
              { id: "apt-sr-alpha", title: "Letter & Alphanumeric Series" }
            ]
          },
          { 
            id: "apt-coding", 
            title: "Coding-Decoding",
            subNodes: [
              { id: "apt-cd-shift", title: "Letter Shifting" },
              { id: "apt-cd-sub", title: "Substitution Ciphers" }
            ]
          },
          { 
            id: "apt-syllogism", 
            title: "Syllogism",
            subNodes: [
              { id: "apt-sy-deduct", title: "Deductive Logic" },
              { id: "apt-sy-venn", title: "Venn Diagrams" }
            ]
          },
        ]
      },
      { 
        id: "apt-advanced", 
        title: "Data, Critical & Verbal", 
        description: "Language and data analysis.",
        subNodes: [
          { 
            id: "apt-data-suff", 
            title: "Data Sufficiency",
            subNodes: [
              { id: "apt-ds-math", title: "Mathematical Sufficiency" },
              { id: "apt-ds-logic", title: "Logical Sufficiency" }
            ]
          },
          { 
            id: "apt-di", 
            title: "Data Interpretation",
            subNodes: [
              { id: "apt-di-chart", title: "Bar & Pie Charts" },
              { id: "apt-di-table", title: "Tables & Line Graphs" }
            ]
          },
          { 
            id: "apt-non-verbal", 
            title: "Non-Verbal Reasoning",
            subNodes: [
              { id: "apt-nv-vis", title: "Visual Patterns" },
              { id: "apt-nv-mat", title: "Figure Matrices" }
            ]
          },
          { 
            id: "apt-critical", 
            title: "Critical Reasoning",
            subNodes: [
              { id: "apt-cr-arg", title: "Arguments & Assumptions" },
              { id: "apt-cr-inf", title: "Inferences & Conclusions" }
            ]
          },
          { 
            id: "apt-verbal", 
            title: "Verbal Ability",
            subNodes: [
              { id: "apt-va-gram", title: "Grammar & Vocabulary" },
              { id: "apt-va-read", title: "Reading Comprehension" }
            ]
          },
        ]
      },
    ],
  },
];
