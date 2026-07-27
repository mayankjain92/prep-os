export const DSA_TOPICS = [
  "Array",
  "String",
  "Hash Table",
  "Two Pointers",
  "Sliding Window",
  "Linked List",
  "Stack",
  "Queue",
  "Tree",
  "Graph",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Binary Search",
  "Sorting",
  "Recursion",
  "Bit Manipulation",
  "Math",
  "Segment Tree",
] as const;

export type DsaTopic = (typeof DSA_TOPICS)[number];

export interface StandardDsaProblem {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  url: string;
}

export interface DsaSubtopic {
  id: string;
  name: string;
  description: string;
}

export interface DsaTopicCategory {
  category: string;
  subtopics: DsaSubtopic[];
}

export const STANDARD_DSA_SYLLABUS: DsaTopicCategory[] = [
  {
    category: "Arrays & Hashing",
    subtopics: [
      { id: "arr-1", name: "1D & 2D Array Traversal & Matrix Manipulations", description: "Row/Column traversals, matrix rotations, transpositions & spiral matrix." },
      { id: "arr-2", name: "Prefix Sum & Difference Array", description: "Range sum queries, 2D prefix sums, and difference array updates." },
      { id: "arr-3", name: "Hash Maps & Hash Sets Lookup", description: "Constant time lookup, frequency counting, and two-pass hashing techniques." },
      { id: "arr-4", name: "Subarray Sums & Anagram Grouping", description: "Subarrays with sum K, zero sum subarrays, and anagram grouping." },
      { id: "arr-5", name: "Kadane's Algorithm & Dutch National Flag", description: "Maximum subarray sum, 3-way partitioning (Sort 0s, 1s, 2s)." },
      { id: "arr-6", name: "Boyer-Moore Majority Vote", description: "Finding majority elements in O(N) time and O(1) space." },
    ],
  },
  {
    category: "Two Pointers & Sliding Window",
    subtopics: [
      { id: "tp-1", name: "Opposite-Direction Two Pointers", description: "Palindromes, sorted array two sum, trapping rain water." },
      { id: "tp-2", name: "Fast & Slow Pointers (Floyd Cycle)", description: "Middle of linked list, cycle detection, duplicate number." },
      { id: "tp-3", name: "Fixed-Size Sliding Window", description: "Subarray averages, maximum sum of K size subarray." },
      { id: "tp-4", name: "Variable-Size Sliding Window", description: "Longest substring without repeating characters, min window substring." },
      { id: "tp-5", name: "Sliding Window Maximum", description: "Using Monotonic Deque for O(N) window max queries." },
    ],
  },
  {
    category: "Binary Search",
    subtopics: [
      { id: "bs-1", name: "Lower Bound & Upper Bound Binary Search", description: "Searching target index, first & last position in sorted array." },
      { id: "bs-2", name: "Search in Rotated Sorted Arrays", description: "Rotated arrays, finding minimum element, handling duplicates." },
      { id: "bs-3", name: "Binary Search on Search Space / Answer", description: "Koko eating bananas, capacity to ship packages, aggressive cows." },
      { id: "bs-4", name: "2D Matrix Binary Search", description: "Search in row-wise and column-wise sorted matrix." },
      { id: "bs-5", name: "Median of Two Sorted Arrays", description: "O(log(min(M,N))) partitioning algorithm." },
    ],
  },
  {
    category: "Stack & Queue",
    subtopics: [
      { id: "stk-1", name: "Monotonic Stack", description: "Next Greater Element, Next Smaller Element, Stock Span, Histogram area." },
      { id: "stk-2", name: "Expression Parsing & Parentheses", description: "Valid parentheses matching, Infix to Postfix, Postfix evaluation." },
      { id: "stk-3", name: "Min Stack & Max Stack Design", description: "O(1) auxiliary stack for getting minimum/maximum element." },
      { id: "stk-4", name: "Queue & Deque Applications", description: "Sliding window maximum using Deque, queue using stacks." },
    ],
  },
  {
    category: "Linked List",
    subtopics: [
      { id: "ll-1", name: "Singly & Doubly Linked List Traversal & Modification", description: "Insertion, deletion, reversing linked list iteratively and recursively." },
      { id: "ll-2", name: "Linked List Merge & Sort", description: "Merge two sorted lists, Merge Sort on Linked List, Reorder List." },
      { id: "ll-3", name: "Cycle Detection & Node Removal", description: "Floyd cycle detection, removing N-th node from end, Palindrome list." },
      { id: "ll-4", name: "LRU & LFU Cache Design", description: "Doubly linked list + Hash Map for O(1) cache get and put." },
      { id: "ll-5", name: "Deep Copy with Random Pointers", description: "O(N) time and O(1) space duplication trick." },
    ],
  },
  {
    category: "Trees & Binary Search Trees (BST)",
    subtopics: [
      { id: "tree-1", name: "Tree Traversals (DFS & BFS)", description: "In-order, Pre-order, Post-order, Level-order BFS, Zigzag traversal." },
      { id: "tree-2", name: "Tree Properties (Height, Diameter, Balance)", description: "Max depth, diameter, checking balanced binary tree, same tree." },
      { id: "tree-3", name: "BST Operations & Ancestors", description: "Insert, Search, Delete in BST, Lowest Common Ancestor (LCA)." },
      { id: "tree-4", name: "Morris Traversal", description: "In-order tree traversal in O(N) time and O(1) space without recursion stack." },
      { id: "tree-5", name: "Trie (Prefix Tree) & Variants", description: "Insert, search, prefix matching, word search dictionary, Maximum XOR pairs." },
      { id: "tree-6", name: "Serialization & Deserialization", description: "Encoding and decoding tree structures into strings." },
    ],
  },
  {
    category: "Heap / Priority Queue",
    subtopics: [
      { id: "hp-1", name: "Min-Heap & Max-Heap Basics", description: "Heapify, Push, Pop, building heap in O(N)." },
      { id: "hp-2", name: "Top K Elements Pattern", description: "Kth largest element, Top K frequent elements, K closest points." },
      { id: "hp-3", name: "Two Heaps Pattern", description: "Find median from data stream using Min-Heap and Max-Heap." },
      { id: "hp-4", name: "Merge K Sorted Lists", description: "Using Priority Queue to efficiently merge multiple streams." },
    ],
  },
  {
    category: "Graphs",
    subtopics: [
      { id: "grp-1", name: "Graph Representations & BFS / DFS", description: "Adjacency matrix & list, Connected components, Bipartite graph validation." },
      { id: "grp-2", name: "Cycle Detection (Directed & Undirected)", description: "DFS back-edge detection & Kahn's BFS in-degree cycle detection." },
      { id: "grp-3", name: "Topological Sorting & Dependency Resolution", description: "Kahn's BFS algorithm, DFS post-order topological sort, Course Schedule." },
      { id: "grp-4", name: "Disjoint Set Union (DSU / Union-Find)", description: "Path compression & rank optimization, Kruskal's MST." },
      { id: "grp-5", name: "Shortest Path Algorithms", description: "Dijkstra's Priority Queue, Bellman-Ford, Floyd-Warshall." },
      { id: "grp-6", name: "Strongly Connected Components", description: "Kosaraju's Algorithm and Tarjan's SCC Algorithm." },
      { id: "grp-7", name: "Bridges & Articulation Points", description: "Tarjan's offline lowest common ancestor and critical network paths." },
    ],
  },
  {
    category: "Dynamic Programming (DP)",
    subtopics: [
      { id: "dp-1", name: "1D DP (Memoization & Tabulation)", description: "Fibonacci, Climbing Stairs, House Robber, Min Cost Climbing." },
      { id: "dp-2", name: "2D Grid / Matrix DP", description: "Unique Paths, Minimum Path Sum, Dungeon Game." },
      { id: "dp-3", name: "Knapsack Variants (0/1 & Unbounded)", description: "Subset Sum, Partition Equal Subset, Coin Change, Rod Cutting." },
      { id: "dp-4", name: "String DP (LCS & Edit Distance)", description: "Longest Common Subsequence, Edit Distance, Longest Palindromic Substring." },
      { id: "dp-5", name: "Longest Increasing Subsequence (LIS)", description: "O(N^2) DP & O(N log N) Binary Search Patient Sort." },
      { id: "dp-6", name: "DP on Trees", description: "In-time and Out-time DP, Maximum path sum in a tree." },
      { id: "dp-7", name: "Bitmask DP & Digit DP", description: "Traveling Salesperson Problem, Counting numbers without specific digits." },
    ],
  },
  {
    category: "Greedy, Backtracking & Math",
    subtopics: [
      { id: "gb-1", name: "Greedy Interval Scheduling", description: "Non-overlapping intervals, meeting rooms, activity selection." },
      { id: "gb-2", name: "Backtracking Search", description: "Subsets, Permutations, Combination Sum, N-Queens, Sudoku Solver." },
      { id: "gb-3", name: "Bit Manipulation Mastery", description: "Brian Kernighan's Algorithm, XOR properties, subsets via bitmasking." },
      { id: "gb-4", name: "Number Theory & Math", description: "Sieve of Eratosthenes, Modular Exponentiation, GCD/LCM, Fermat's Little Theorem." },
    ],
  },
  {
    category: "Advanced Data Structures (Segment/Fenwick Trees)",
    subtopics: [
      { id: "adv-1", name: "Segment Tree Basics", description: "Point updates and Range Sum/Min/Max queries in O(log N)." },
      { id: "adv-2", name: "Lazy Propagation in Segment Trees", description: "Efficient range updates." },
      { id: "adv-3", name: "Fenwick Tree (Binary Indexed Tree)", description: "Simpler implementation for prefix sums and point updates." },
    ],
  },
];

export const STANDARD_DSA_ROADMAP: StandardDsaProblem[] = [
  { title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/" },
  { title: "Contains Duplicate", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/contains-duplicate/" },
  { title: "Valid Anagram", difficulty: "Easy", topic: "Hash Table", url: "https://leetcode.com/problems/valid-anagram/" },
  { title: "Group Anagrams", difficulty: "Medium", topic: "Hash Table", url: "https://leetcode.com/problems/group-anagrams/" },
  { title: "Top K Frequent Elements", difficulty: "Medium", topic: "Hash Table", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { title: "Product of Array Except Self", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/product-of-array-except-self/" },
  { title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
];

export const STANDARD_THEORY_ROADMAPS: Record<string, string[]> = {
  OS: [
    "Processes vs Threads, PCB & Process Lifecycle",
    "CPU Scheduling Algorithms (FCFS, SJF, SRTF, RR, Priority)",
    "Process Synchronization (Mutex, Semaphore, Monitors, Spinlocks)",
    "Classical Sync Problems (Producer-Consumer, Reader-Writer, Dining Philosophers)",
    "Deadlocks (Coffman Conditions, Banker's Algorithm, Detection & Recovery)",
    "Memory Management (Paging, Segmentation, TLB, Fragmentation)",
    "Virtual Memory (Demand Paging, Page Faults, Thrashing, Belady's Anomaly)",
    "Page Replacement Algorithms (FIFO, LRU, Optimal)",
    "File Systems, Inodes, & Directory Structures",
    "Disk Scheduling Algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK)",
  ],
  DBMS: [
    "DBMS Architecture (1-tier, 2-tier, 3-tier) & Schemas",
    "ER Diagram Concepts, Cardinality, Weak Entities",
    "Relational Algebra (Select, Project, Cartesian, Joins) & Tuple Calculus",
    "Normalization (Anomalies, Functional Dependencies, 1NF, 2NF, 3NF, BCNF)",
    "Advanced SQL (Joins, Aggregation, Subqueries, Window Functions, Triggers)",
    "Indexing Strategies (Primary, Secondary, Clustered, Unclustered)",
    "B-Trees & B+ Trees Internals (Splitting, Merging)",
    "ACID Properties & Transaction States",
    "Concurrency Control & Serializability (Conflict vs View)",
    "Locking Protocols (2PL, Strict 2PL, Timestamp Ordering)",
    "NoSQL Types (Key-Value, Document, Column, Graph) & CAP Theorem",
    "Distributed DBs (Sharding, Partitioning, 2-Phase Commit)",
  ],
  CN: [
    "OSI vs TCP/IP 7-Layer Reference Models",
    "Physical Layer & Transmission Media (Topologies, Multiplexing)",
    "Data Link Layer (Framing, Error Detection, CSMA/CD, MAC Addressing)",
    "Network Layer (IPv4 vs IPv6, ARP/RARP, ICMP)",
    "IP Addressing & Subnetting (CIDR, Subnet Masks, VLSM)",
    "Routing Algorithms (Distance Vector/RIP, Link State/OSPF, BGP)",
    "Transport Layer (TCP vs UDP, 3-Way Handshake, Ports)",
    "TCP Flow Control vs Congestion Control (Slow Start, Congestion Avoidance)",
    "Application Protocols (HTTP/1.1 vs HTTP/2, HTTPS, DNS, FTP, SMTP/POP3)",
    "WebSockets vs HTTP Polling/Long-Polling",
    "Network Security (Symmetric/Asymmetric Cryptography, SSL/TLS, Firewalls)",
  ],
  Aptitude: [
    "Quantitative: Number Systems, HCF/LCM, Percentages, Profit & Loss",
    "Quantitative: Time, Speed & Distance, Boats & Streams",
    "Quantitative: Time & Work, Pipes & Cisterns",
    "Quantitative: Permutations, Combinations & Probability",
    "Data Interpretation (Bar Charts, Pie Charts, Tables, Line Graphs)",
    "Logical Reasoning (Syllogisms, Blood Relations, Seating Arrangements)",
    "Logical Reasoning (Coding-Decoding, Clocks & Calendars, Number Series)",
    "Verbal Ability (Reading Comprehension, Sentence Correction, Para Jumbles)",
  ],
};