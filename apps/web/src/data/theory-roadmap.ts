import { RoadmapSection } from "@/components/shared/RoadmapFlowChart";

export const THEORY_ROADMAP_SECTIONS: RoadmapSection[] = [
  {
    mainId: "theory-os",
    mainTitle: "1. Operating Systems (OS)",
    description: "Core concepts of how software interacts with hardware and manages resources.",
    leftNodes: [
      { 
        id: "os-intro", 
        title: "Process & Thread Management", 
        description: "Execution contexts.",
        subNodes: [
          { id: "os-pcb", title: "Process Control Block (PCB)", description: "States, Context Switching, Fork/Exec." },
          { id: "os-threads", title: "Threads & Concurrency", description: "User vs Kernel threads, Multithreading models." },
          { id: "os-scheduling", title: "CPU Scheduling", description: "FCFS, SJF, SRTF, Round Robin, Priority." },
        ]
      },
      { 
        id: "os-sync", 
        title: "Process Synchronization", 
        description: "Coordinating concurrent execution.",
        subNodes: [
          { id: "os-mutex", title: "Mutex & Semaphores", description: "Spinlocks, Monitors, binary vs counting semaphores." },
          { id: "os-classic", title: "Classical Problems", description: "Producer-Consumer, Reader-Writer, Dining Philosophers." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "os-deadlock", 
        title: "Deadlocks", 
        description: "Resource allocation issues.",
        subNodes: [
          { id: "os-coffman", title: "Coffman Conditions", description: "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait." },
          { id: "os-banker", title: "Banker's Algorithm", description: "Deadlock Avoidance & Resource Allocation Graphs." },
        ]
      },
      { 
        id: "os-memory", 
        title: "Memory Management", 
        description: "RAM and Virtual Memory.",
        subNodes: [
          { id: "os-paging", title: "Paging & Segmentation", description: "Contiguous vs Non-contiguous, TLB, Fragmentation." },
          { id: "os-virtual", title: "Virtual Memory", description: "Demand Paging, Page Faults, Thrashing." },
          { id: "os-replace", title: "Page Replacement", description: "FIFO, LRU, Optimal, Belady's Anomaly." },
        ]
      },
      { 
        id: "os-storage", 
        title: "Storage & File Systems", 
        description: "Disk management.",
        subNodes: [
          { id: "os-fs", title: "File Systems", description: "Inodes, Directory structures, File allocation." },
          { id: "os-disk", title: "Disk Scheduling", description: "FCFS, SSTF, SCAN, C-SCAN, LOOK." },
        ]
      },
    ],
  },
  {
    mainId: "theory-dbms",
    mainTitle: "2. Database Management Systems (DBMS)",
    description: "Data modeling, storage, retrieval, and transaction management.",
    leftNodes: [
      { 
        id: "db-design", 
        title: "Architecture & Design", 
        description: "Database schemas and models.",
        subNodes: [
          { id: "db-arch", title: "DBMS Architecture", description: "1-tier, 2-tier, 3-tier architectures." },
          { id: "db-er", title: "ER Model", description: "Entities, Relationships, Cardinality, Weak Entities." },
          { id: "db-rel", title: "Relational Algebra", description: "Select, Project, Cartesian, Joins, Tuple Calculus." },
        ]
      },
      { 
        id: "db-sql", 
        title: "SQL Mastery", 
        description: "Data query language.",
        subNodes: [
          { id: "db-queries", title: "Advanced Queries", description: "Joins (Inner, Outer, Cross), Subqueries, Correlated." },
          { id: "db-window", title: "Window Functions", description: "RANK, DENSE_RANK, ROW_NUMBER." },
          { id: "db-triggers", title: "Triggers & Procedures", description: "Automated actions and stored programs." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "db-norm", 
        title: "Normalization & Indexing", 
        description: "Optimizing structure and access.",
        subNodes: [
          { id: "db-nf", title: "Normal Forms", description: "Anomalies, Functional Dependencies, 1NF, 2NF, 3NF, BCNF." },
          { id: "db-index", title: "Indexing Strategies", description: "Primary, Secondary, Clustered, Unclustered." },
          { id: "db-btree", title: "B-Trees & B+ Trees", description: "Internals of database indexing engines." },
        ]
      },
      { 
        id: "db-trans", 
        title: "Transactions & Concurrency", 
        description: "Data integrity.",
        subNodes: [
          { id: "db-acid", title: "ACID Properties", description: "Atomicity, Consistency, Isolation, Durability." },
          { id: "db-serial", title: "Serializability", description: "Conflict vs View Serializability." },
          { id: "db-lock", title: "Concurrency Control", description: "2PL, Strict 2PL, Timestamp Ordering, Deadlocks." },
        ]
      },
      { 
        id: "db-nosql", 
        title: "Distributed DBs & NoSQL", 
        description: "Modern data storage.",
        subNodes: [
          { id: "db-cap", title: "CAP Theorem", description: "Consistency, Availability, Partition Tolerance." },
          { id: "db-nosql-types", title: "NoSQL Types", description: "Key-Value, Document, Column-Family, Graph." },
          { id: "db-shard", title: "Sharding", description: "Partitioning, Replication, 2-Phase Commit (2PC)." },
        ]
      },
    ],
  },
  {
    mainId: "theory-cn",
    mainTitle: "3. Computer Networks (CN)",
    description: "How data is transmitted reliably and securely across global networks.",
    leftNodes: [
      { 
        id: "cn-models", 
        title: "Network Models & Lower Layers", 
        description: "Physical to Network layer.",
        subNodes: [
          { id: "cn-osi", title: "OSI & TCP/IP Models", description: "The 7 layers vs the 4 layers." },
          { id: "cn-datalink", title: "Data Link Layer", description: "Framing, Error Detection, CSMA/CD, MAC Addressing." },
          { id: "cn-network", title: "Network Layer", description: "IPv4 vs IPv6, ARP/RARP, ICMP." },
          { id: "cn-subnet", title: "Subnetting", description: "CIDR, Subnet Masks, VLSM." },
          { id: "cn-routing", title: "Routing Algorithms", description: "Distance Vector (RIP), Link State (OSPF), BGP." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "cn-upper", 
        title: "Upper Layers & Security", 
        description: "Transport to Application.",
        subNodes: [
          { id: "cn-transport", title: "Transport Layer", description: "TCP vs UDP, 3-Way Handshake, Ports." },
          { id: "cn-tcp", title: "TCP Control", description: "Flow Control vs Congestion Control (Slow Start)." },
          { id: "cn-app", title: "Application Layer", description: "HTTP/1.1 vs HTTP/2, HTTPS, DNS, FTP, SMTP/POP3." },
          { id: "cn-sockets", title: "WebSockets", description: "vs HTTP Polling/Long-Polling." },
          { id: "cn-sec", title: "Network Security", description: "Symmetric/Asymmetric Cryptography, SSL/TLS, Firewalls." },
        ]
      },
    ],
  },
  {
    mainId: "theory-oop",
    mainTitle: "4. Object Oriented Programming (OOP)",
    description: "Software design principles and paradigms.",
    leftNodes: [
      { 
        id: "oop-core", 
        title: "Core Concepts", 
        description: "The foundations of object design.",
        subNodes: [
          { id: "oop-pillars", title: "The 4 Pillars", description: "Encapsulation, Abstraction, Inheritance, Polymorphism." },
          { id: "oop-classes", title: "Classes & Objects", description: "Constructors, Destructors, Abstract Classes, Interfaces." },
        ]
      },
      { 
        id: "oop-solid", 
        title: "SOLID Principles", 
        description: "Writing maintainable code.",
        subNodes: [
          { id: "oop-s", title: "Single Responsibility", description: "A class should have one reason to change." },
          { id: "oop-o", title: "Open/Closed", description: "Open for extension, closed for modification." },
          { id: "oop-l", title: "Liskov Substitution", description: "Subtypes must be substitutable for base types." },
          { id: "oop-i", title: "Interface Segregation", description: "Many client-specific interfaces." },
          { id: "oop-d", title: "Dependency Inversion", description: "Depend on abstractions, not concretions." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "oop-patterns", 
        title: "Design Patterns (GoF)", 
        description: "Proven solutions to common design problems.",
        subNodes: [
          { id: "pat-create", title: "Creational Patterns", description: "Singleton, Factory Method, Abstract Factory, Builder." },
          { id: "pat-struct", title: "Structural Patterns", description: "Adapter, Decorator, Facade, Proxy." },
          { id: "pat-behav", title: "Behavioral Patterns", description: "Observer, Strategy, Command, Iterator." },
        ]
      },
    ],
  },
  {
    mainId: "theory-aptitude",
    mainTitle: "5. Aptitude & Logical Reasoning",
    description: "Standard screening topics for most placement exams.",
    leftNodes: [
      { 
        id: "apt-quant", 
        title: "Quantitative Aptitude", 
        description: "Mathematical problem solving.",
        subNodes: [
          { id: "apt-q1", title: "Basic Arithmetic", description: "Number Systems, HCF/LCM, Percentages, Profit & Loss." },
          { id: "apt-q2", title: "Speed & Work", description: "Time/Speed/Distance, Boats/Streams, Time/Work, Pipes/Cisterns." },
          { id: "apt-q3", title: "Advanced Math", description: "Permutations, Combinations, Probability." },
          { id: "apt-q4", title: "Data Interpretation", description: "Bar Charts, Pie Charts, Tables, Line Graphs." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "apt-logic", 
        title: "Logical & Verbal Reasoning", 
        description: "Pattern recognition and language comprehension.",
        subNodes: [
          { id: "apt-l1", title: "Deductive Logic", description: "Syllogisms, Blood Relations, Seating Arrangements." },
          { id: "apt-l2", title: "Pattern Logic", description: "Coding-Decoding, Clocks & Calendars, Number Series." },
          { id: "apt-v1", title: "Verbal Ability", description: "Reading Comprehension, Sentence Correction, Para Jumbles." },
        ]
      },
    ],
  },
];
