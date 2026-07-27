import { RoadmapSection } from "@/components/shared/RoadmapFlowChart";

export const DSA_ROADMAP_SECTIONS: RoadmapSection[] = [
  {
    mainId: "dsa-lang-fund",
    mainTitle: "1. Language & CS Fundamentals",
    description: "Master a primary language (C++, Java, or Python) and core computer science concepts.",
    leftNodes: [
      { 
        id: "lang-cpp", 
        title: "C++ Masterclass", 
        description: "Pointers, References, Memory Management, STL (Vectors, Maps, Sets)." 
      },
      { 
        id: "lang-java", 
        title: "Java Masterclass", 
        description: "OOP, JVM, Garbage Collection, Collections Framework." 
      },
      { 
        id: "lang-python", 
        title: "Python Masterclass", 
        description: "List Comprehensions, Dictionaries, Sets, Global Interpreter Lock (GIL)." 
      },
    ],
    rightNodes: [
      { 
        id: "fund-time-space", 
        title: "Time & Space Complexity", 
        description: "Big O, Omega, Theta notation.",
        subNodes: [
          { id: "fund-master", title: "Master Theorem", description: "Solving recurrence relations." },
          { id: "fund-amortized", title: "Amortized Analysis", description: "Average time taken per operation (e.g. dynamic arrays)." },
        ]
      },
      { 
        id: "fund-memory", 
        title: "Stack vs Heap Memory", 
        description: "Call stack execution, dynamic memory allocation, pointers." 
      },
      { 
        id: "fund-math", 
        title: "Math & Bit Manipulation", 
        description: "Core math and bitwise tricks.",
        subNodes: [
          { id: "math-sieve", title: "Sieve of Eratosthenes", description: "O(N log(log N)) prime generation." },
          { id: "math-gcd", title: "Euclidean GCD", description: "O(log(min(A,B))) greatest common divisor." },
          { id: "bit-brian", title: "Brian Kernighan's Algorithm", description: "Count set bits in O(set bits) time." },
          { id: "bit-mask", title: "Bitmasking Techniques", description: "Using integers to represent sets/subsets." },
        ]
      },
    ],
  },
  {
    mainId: "dsa-arrays-strings",
    mainTitle: "2. Arrays & Strings",
    description: "The foundation of all data structures. Focus on memory layout and traversal techniques.",
    leftNodes: [
      { 
        id: "arr-basics", 
        title: "Array & Matrix Manipulations", 
        description: "Contiguous memory, static vs dynamic arrays.",
        subNodes: [
          { id: "arr-spiral", title: "Spiral/Diagonal Traversal", description: "Common matrix traversal problems." },
          { id: "arr-rotate", title: "Matrix Rotation", description: "Rotate image in-place." },
        ]
      },
      { 
        id: "arr-prefix", 
        title: "Prefix Sum & Difference Arrays", 
        description: "Fast range sum queries and range update tracking." 
      },
      { 
        id: "arr-kadane", 
        title: "Kadane's Algorithm", 
        description: "Maximum subarray sum in O(N) time." 
      },
    ],
    rightNodes: [
      { 
        id: "str-basics", 
        title: "String Manipulation", 
        description: "ASCII, String immutability, Substrings, Palindromes." 
      },
      { 
        id: "str-kmp", 
        title: "Pattern Matching", 
        description: "Efficient substring search algorithms.",
        subNodes: [
          { id: "str-rabin", title: "Rabin-Karp", description: "Rolling hash based substring search." },
          { id: "str-kmp-algo", title: "KMP Algorithm", description: "Longest Prefix Suffix (LPS) array approach." },
        ]
      },
      { 
        id: "arr-majority", 
        title: "Moore's Voting Algorithm", 
        description: "Finding majority element in O(N) time and O(1) space." 
      },
    ],
  },
  {
    mainId: "dsa-pointers-window",
    mainTitle: "3. Two Pointers & Sliding Window",
    description: "Crucial patterns for optimizing O(N^2) array/string problems down to O(N).",
    leftNodes: [
      { 
        id: "tp-algos", 
        title: "Two Pointers Patterns", 
        description: "Optimizing array traversals.",
        subNodes: [
          { id: "tp-opposite", title: "Opposite Ends", description: "Two Sum II, Container With Most Water, Palindromes." },
          { id: "tp-fast-slow", title: "Fast & Slow (Floyd's)", description: "Cycle detection, Middle of linked list." },
          { id: "tp-merge", title: "Merge/Intersection", description: "Merging sorted arrays, finding common elements." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "sw-algos", 
        title: "Sliding Window Patterns", 
        description: "Maintaining state over a contiguous subset of elements.",
        subNodes: [
          { id: "sw-fixed", title: "Fixed Window", description: "Max sum subarray of size K, Permutation in String." },
          { id: "sw-variable", title: "Variable Window", description: "Longest substring without repeating characters." },
          { id: "sw-deque", title: "Monotonic Deque Window", description: "Sliding Window Maximum in O(N)." },
        ]
      },
    ],
  },
  {
    mainId: "dsa-search-sort",
    mainTitle: "4. Searching & Sorting",
    description: "Finding elements and ordering data efficiently.",
    leftNodes: [
      { 
        id: "sort-algos", 
        title: "Sorting Algorithms", 
        description: "Fundamental sorting techniques and their complexities.",
        subNodes: [
          { id: "sort-bubble", title: "Bubble Sort", description: "O(N²) - Simple comparisons" },
          { id: "sort-selection", title: "Selection Sort", description: "O(N²) - Find minimum iteratively" },
          { id: "sort-insertion", title: "Insertion Sort", description: "O(N²) - Build sorted array one by one" },
          { id: "sort-merge", title: "Merge Sort", description: "O(N log N) - Divide and Conquer" },
          { id: "sort-quick", title: "Quick Sort", description: "O(N log N) - Partitioning" },
          { id: "sort-heap", title: "Heap Sort", description: "O(N log N) - Using max/min heaps" },
        ]
      },
      { id: "sort-linear", title: "Linear Sorts", description: "Counting Sort, Radix Sort, Bucket Sort (O(N))." },
    ],
    rightNodes: [
      { 
        id: "search-algos", 
        title: "Search Algorithms", 
        description: "Techniques to find elements efficiently.",
        subNodes: [
          { id: "search-linear", title: "Linear Search", description: "O(N) - Scan each element sequentially" },
          { id: "search-binary", title: "Binary Search Basics", description: "O(log N) - Divide and conquer on sorted arrays" },
          { id: "search-bs-answer", title: "Binary Search on Answer", description: "Minimizing the maximum (e.g., Allocate Books, Aggressive Cows)." },
          { id: "search-bs-rotated", title: "Rotated Sorted Arrays", description: "Finding pivot, searching in rotated or infinite arrays." },
        ]
      },
    ],
  },
  {
    mainId: "dsa-linkedlist-stack-queue",
    mainTitle: "5. Linked Lists, Stacks & Queues",
    description: "Linear data structures emphasizing pointer manipulation and LIFO/FIFO mechanics.",
    leftNodes: [
      { 
        id: "ll-algos", 
        title: "Linked List Operations", 
        description: "Singly & Doubly Linked Lists.",
        subNodes: [
          { id: "ll-basics", title: "Traversal & Reversal", description: "Reverse a linked list iteratively and recursively." },
          { id: "ll-merge", title: "Merge & Sort", description: "Merge K sorted lists, Merge Sort on LL." },
          { id: "ll-copy", title: "Deep Copy with Random Pointers", description: "O(N) time and O(1) space duplication trick." },
          { id: "ll-lru", title: "LRU / LFU Cache Design", description: "Combining Hash Map with Doubly Linked List." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "sq-algos", 
        title: "Stacks & Queues", 
        description: "LIFO vs FIFO mechanics.",
        subNodes: [
          { id: "sq-basics", title: "Implementation Basics", description: "Circular Queue, Queue using Stacks, Min Stack." },
          { id: "sq-parse", title: "Expression Parsing", description: "Valid Parentheses, Infix to Postfix evaluation." },
          { id: "sq-mono", title: "Monotonic Stack", description: "Next Greater Element, Largest Rectangle in Histogram." },
        ]
      },
    ],
  },
  {
    mainId: "dsa-trees",
    mainTitle: "6. Trees & Binary Search Trees (BST)",
    description: "Hierarchical data structures, recursion, and traversal.",
    leftNodes: [
      { 
        id: "tree-algos", 
        title: "Binary Trees", 
        description: "Tree structure and properties.",
        subNodes: [
          { id: "tree-dfs", title: "DFS Traversals", description: "Pre-order, In-order, Post-order." },
          { id: "tree-bfs", title: "Level Order (BFS)", description: "Queue-based traversal, Zigzag level order." },
          { id: "tree-morris", title: "Morris Traversal", description: "O(N) time, O(1) space tree traversal using threaded trees." },
          { id: "tree-lca", title: "Lowest Common Ancestor (LCA)", description: "Finding common ancestors in O(N)." },
          { id: "tree-serial", title: "Serialization", description: "Convert tree to string and back." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "bst-algos", 
        title: "Binary Search Trees (BST)", 
        description: "Ordered trees for fast lookups.",
        subNodes: [
          { id: "bst-props", title: "BST Properties", description: "In-order traversal yields sorted array." },
          { id: "bst-validate", title: "Validate BST", description: "Checking upper/lower bounds recursively." },
          { id: "bst-construct", title: "Construct BST", description: "Build from preorder or sorted array." },
        ]
      },
    ],
  },
  {
    mainId: "dsa-heaps-hashing",
    mainTitle: "7. Heaps & Hashing",
    description: "Fast retrievals, priority management, and frequency counting.",
    leftNodes: [
      { 
        id: "hash-algos", 
        title: "Hashing Techniques", 
        description: "O(1) lookups and collision handling.",
        subNodes: [
          { id: "hash-maps", title: "Hash Maps & Sets", description: "Frequency counting, Two Sum." },
          { id: "hash-col", title: "Collision Resolution", description: "Chaining vs Open Addressing (Linear Probing)." },
          { id: "hash-rolling", title: "Rolling Hash", description: "Rabin-Karp substring matching." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "heap-algos", 
        title: "Heaps & Priority Queues", 
        description: "Managing elements by priority.",
        subNodes: [
          { id: "heap-basics", title: "Min/Max Heap", description: "Array representation, Heapify, Insert, Extract (O(log N))." },
          { id: "heap-topk", title: "Top K Elements", description: "Kth largest element, K frequent elements." },
          { id: "heap-two", title: "Two Heaps Pattern", description: "Find median from data stream." },
        ]
      },
    ],
  },
  {
    mainId: "dsa-graphs",
    mainTitle: "8. Graph Algorithms",
    description: "Network traversal, shortest paths, and connectivity. Crucial for high LPA companies.",
    leftNodes: [
      { 
        id: "graph-basics", 
        title: "Graph Fundamentals & Traversal", 
        description: "Representations and core algorithms.",
        subNodes: [
          { id: "graph-rep", title: "Representations", description: "Adjacency Matrix vs Adjacency List." },
          { id: "graph-bfs-dfs", title: "BFS & DFS", description: "Connected components, Bipartite graph check." },
          { id: "graph-cycle", title: "Cycle Detection", description: "Directed (DFS back-edge) vs Undirected." },
          { id: "graph-topo", title: "Topological Sort", description: "Kahn's BFS Algorithm & DFS post-order (Course Schedule)." },
        ]
      },
      { 
        id: "graph-dsu", 
        title: "Disjoint Set Union (DSU)", 
        description: "Union-Find with Path Compression and Rank Optimization." 
      },
    ],
    rightNodes: [
      { 
        id: "graph-adv", 
        title: "Advanced Graph Algorithms", 
        description: "Shortest paths and connectivity.",
        subNodes: [
          { id: "graph-dijkstra", title: "Dijkstra's Algorithm", description: "Single-source shortest path (no negative weights)." },
          { id: "graph-bellman", title: "Bellman-Ford", description: "Shortest path with negative weight cycle detection." },
          { id: "graph-floyd", title: "Floyd-Warshall", description: "All-pairs shortest path in O(V³)." },
          { id: "graph-mst", title: "Minimum Spanning Tree", description: "Kruskal's (DSU) and Prim's (PQ) algorithms." },
          { id: "graph-scc", title: "Strongly Connected Components", description: "Kosaraju's and Tarjan's Algorithms." },
          { id: "graph-bridges", title: "Bridges & Articulation Points", description: "Tarjan's offline lowest common ancestor." },
        ]
      },
    ],
  },
  {
    mainId: "dsa-dp-backtracking",
    mainTitle: "9. Dynamic Programming & Backtracking",
    description: "Exhaustive search spaces and overlapping subproblems.",
    leftNodes: [
      { 
        id: "dp-patterns", 
        title: "Dynamic Programming Patterns", 
        description: "Memoization vs Tabulation.",
        subNodes: [
          { id: "dp-1d", title: "1D DP", description: "Fibonacci, Climbing Stairs, House Robber." },
          { id: "dp-2d", title: "2D Grid DP", description: "Unique Paths, Minimum Path Sum." },
          { id: "dp-knapsack", title: "Knapsack Variants", description: "0/1 Knapsack, Subset Sum, Coin Change." },
          { id: "dp-string", title: "String DP", description: "Longest Common Subsequence (LCS), Edit Distance." },
          { id: "dp-lis", title: "Longest Increasing Subsequence", description: "O(N²) DP & O(N log N) Binary Search variants." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "dp-adv", 
        title: "Advanced DP & Backtracking", 
        description: "Complex state spaces.",
        subNodes: [
          { id: "dp-trees", title: "DP on Trees", description: "In-time/Out-time DP, Max path sum in tree." },
          { id: "dp-bitmask", title: "Bitmask DP", description: "Traveling Salesperson Problem (TSP)." },
          { id: "dp-digit", title: "Digit DP", description: "Counting numbers matching criteria." },
          { id: "bt-basics", title: "Backtracking", description: "Permutations, N-Queens, Sudoku Solver." },
          { id: "greedy", title: "Greedy Algorithms", description: "Interval Scheduling, Huffman Coding." },
        ]
      },
    ],
  },
  {
    mainId: "dsa-specialized",
    mainTitle: "10. Specialized Data Structures",
    description: "For cracking the absolute hardest competitive programming/interview questions.",
    leftNodes: [
      { 
        id: "spec-trie", 
        title: "Trie (Prefix Trees)", 
        description: "Autocomplete systems.",
        subNodes: [
          { id: "trie-basic", title: "Basic Trie", description: "Insert, Search, StartsWith." },
          { id: "trie-xor", title: "Bitwise Trie", description: "Maximum XOR of two numbers in an array." },
          { id: "trie-aho", title: "Aho-Corasick", description: "Multiple pattern string matching (Optional/Hard)." },
        ]
      },
    ],
    rightNodes: [
      { 
        id: "spec-trees", 
        title: "Range Query Trees", 
        description: "Efficient range operations.",
        subNodes: [
          { id: "spec-segment", title: "Segment Trees", description: "Range Sum/Min/Max Queries." },
          { id: "spec-lazy", title: "Lazy Propagation", description: "O(log N) Range Updates on Segment Trees." },
          { id: "spec-fenwick", title: "Fenwick Trees (BIT)", description: "Point update and prefix sum queries." },
        ]
      },
    ],
  },
];
