export interface NeetcodeProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  url: string;
}

export const NEETCODE_150_PROBLEMS: NeetcodeProblem[] = [
  // Arrays & Hashing (9)
  { id: "nc-1", title: "Contains Duplicate", difficulty: "Easy", category: "Arrays & Hashing", url: "https://leetcode.com/problems/contains-duplicate/" },
  { id: "nc-2", title: "Valid Anagram", difficulty: "Easy", category: "Arrays & Hashing", url: "https://leetcode.com/problems/valid-anagram/" },
  { id: "nc-3", title: "Two Sum", difficulty: "Easy", category: "Arrays & Hashing", url: "https://leetcode.com/problems/two-sum/" },
  { id: "nc-4", title: "Group Anagrams", difficulty: "Medium", category: "Arrays & Hashing", url: "https://leetcode.com/problems/group-anagrams/" },
  { id: "nc-5", title: "Top K Frequent Elements", difficulty: "Medium", category: "Arrays & Hashing", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: "nc-6", title: "Product of Array Except Self", difficulty: "Medium", category: "Arrays & Hashing", url: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: "nc-7", title: "Valid Sudoku", difficulty: "Medium", category: "Arrays & Hashing", url: "https://leetcode.com/problems/valid-sudoku/" },
  { id: "nc-8", title: "Encode and Decode Strings", difficulty: "Medium", category: "Arrays & Hashing", url: "https://leetcode.com/problems/encode-and-decode-strings/" },
  { id: "nc-9", title: "Longest Consecutive Sequence", difficulty: "Medium", category: "Arrays & Hashing", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },

  // Two Pointers (5)
  { id: "nc-10", title: "Valid Palindrome", difficulty: "Easy", category: "Two Pointers", url: "https://leetcode.com/problems/valid-palindrome/" },
  { id: "nc-11", title: "Two Sum II Input Array Is Sorted", difficulty: "Medium", category: "Two Pointers", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { id: "nc-12", title: "3Sum", difficulty: "Medium", category: "Two Pointers", url: "https://leetcode.com/problems/3sum/" },
  { id: "nc-13", title: "Container With Most Water", difficulty: "Medium", category: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/" },
  { id: "nc-14", title: "Trapping Rain Water", difficulty: "Hard", category: "Two Pointers", url: "https://leetcode.com/problems/trapping-rain-water/" },

  // Sliding Window (6)
  { id: "nc-15", title: "Best Time to Buy And Sell Stock", difficulty: "Easy", category: "Sliding Window", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: "nc-16", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: "nc-17", title: "Longest Repeating Character Replacement", difficulty: "Medium", category: "Sliding Window", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
  { id: "nc-18", title: "Permutation In String", difficulty: "Medium", category: "Sliding Window", url: "https://leetcode.com/problems/permutation-in-string/" },
  { id: "nc-19", title: "Minimum Window Substring", difficulty: "Hard", category: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: "nc-20", title: "Sliding Window Maximum", difficulty: "Hard", category: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/" },

  // Stack (7)
  { id: "nc-21", title: "Valid Parentheses", difficulty: "Easy", category: "Stack", url: "https://leetcode.com/problems/valid-parentheses/" },
  { id: "nc-22", title: "Min Stack", difficulty: "Medium", category: "Stack", url: "https://leetcode.com/problems/min-stack/" },
  { id: "nc-23", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", category: "Stack", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { id: "nc-24", title: "Generate Parentheses", difficulty: "Medium", category: "Stack", url: "https://leetcode.com/problems/generate-parentheses/" },
  { id: "nc-25", title: "Daily Temperatures", difficulty: "Medium", category: "Stack", url: "https://leetcode.com/problems/daily-temperatures/" },
  { id: "nc-26", title: "Car Fleet", difficulty: "Medium", category: "Stack", url: "https://leetcode.com/problems/car-fleet/" },
  { id: "nc-27", title: "Largest Rectangle In Histogram", difficulty: "Hard", category: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },

  // Binary Search (7)
  { id: "nc-28", title: "Binary Search", difficulty: "Easy", category: "Binary Search", url: "https://leetcode.com/problems/binary-search/" },
  { id: "nc-29", title: "Search a 2D Matrix", difficulty: "Medium", category: "Binary Search", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { id: "nc-30", title: "Koko Eating Bananas", difficulty: "Medium", category: "Binary Search", url: "https://leetcode.com/problems/koko-eating-bananas/" },
  { id: "nc-31", title: "Find Minimum In Rotated Sorted Array", difficulty: "Medium", category: "Binary Search", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: "nc-32", title: "Search In Rotated Sorted Array", difficulty: "Medium", category: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: "nc-33", title: "Time Based Key-Value Store", difficulty: "Medium", category: "Binary Search", url: "https://leetcode.com/problems/time-based-key-value-store/" },
  { id: "nc-34", title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },

  // Linked List (11)
  { id: "nc-35", title: "Reverse Linked List", difficulty: "Easy", category: "Linked List", url: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: "nc-36", title: "Merge Two Sorted Lists", difficulty: "Easy", category: "Linked List", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: "nc-37", title: "Reorder List", difficulty: "Medium", category: "Linked List", url: "https://leetcode.com/problems/reorder-list/" },
  { id: "nc-38", title: "Remove Nth Node From End of List", difficulty: "Medium", category: "Linked List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: "nc-39", title: "Copy List With Random Pointer", difficulty: "Medium", category: "Linked List", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
  { id: "nc-40", title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", url: "https://leetcode.com/problems/add-two-numbers/" },
  { id: "nc-41", title: "Linked List Cycle", difficulty: "Easy", category: "Linked List", url: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: "nc-42", title: "Find The Duplicate Number", difficulty: "Medium", category: "Linked List", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
  { id: "nc-43", title: "LRU Cache", difficulty: "Medium", category: "Linked List", url: "https://leetcode.com/problems/lru-cache/" },
  { id: "nc-44", title: "Merge K Sorted Lists", difficulty: "Hard", category: "Linked List", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  { id: "nc-45", title: "Reverse Nodes In K-Group", difficulty: "Hard", category: "Linked List", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },

  // Trees (15)
  { id: "nc-46", title: "Invert Binary Tree", difficulty: "Easy", category: "Trees", url: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: "nc-47", title: "Maximum Depth of Binary Tree", difficulty: "Easy", category: "Trees", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: "nc-48", title: "Diameter of Binary Tree", difficulty: "Easy", category: "Trees", url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
  { id: "nc-49", title: "Balanced Binary Tree", difficulty: "Easy", category: "Trees", url: "https://leetcode.com/problems/balanced-binary-tree/" },
  { id: "nc-50", title: "Same Tree", difficulty: "Easy", category: "Trees", url: "https://leetcode.com/problems/same-tree/" },
  { id: "nc-51", title: "Subtree of Another Tree", difficulty: "Easy", category: "Trees", url: "https://leetcode.com/problems/subtree-of-another-tree/" },
  { id: "nc-52", title: "Lowest Common Ancestor of a BST", difficulty: "Medium", category: "Trees", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
  { id: "nc-53", title: "Binary Tree Level Order Traversal", difficulty: "Medium", category: "Trees", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: "nc-54", title: "Binary Tree Right Side View", difficulty: "Medium", category: "Trees", url: "https://leetcode.com/problems/binary-tree-right-side-view/" },
  { id: "nc-55", title: "Count Good Nodes In Binary Tree", difficulty: "Medium", category: "Trees", url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
  { id: "nc-56", title: "Validate Binary Search Tree", difficulty: "Medium", category: "Trees", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: "nc-57", title: "Kth Smallest Element In a BST", difficulty: "Medium", category: "Trees", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id: "nc-58", title: "Construct Binary Tree From Preorder And Inorder", difficulty: "Medium", category: "Trees", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id: "nc-59", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", category: "Trees", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { id: "nc-60", title: "Serialize And Deserialize Binary Tree", difficulty: "Hard", category: "Trees", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },

  // Tries (3)
  { id: "nc-61", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", category: "Tries", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { id: "nc-62", title: "Design Add And Search Words Data Structure", difficulty: "Medium", category: "Tries", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
  { id: "nc-63", title: "Word Search II", difficulty: "Hard", category: "Tries", url: "https://leetcode.com/problems/word-search-ii/" },

  // Heap / Priority Queue (7)
  { id: "nc-64", title: "Kth Largest Element In a Stream", difficulty: "Easy", category: "Heap / Priority Queue", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
  { id: "nc-65", title: "Last Stone Weight", difficulty: "Easy", category: "Heap / Priority Queue", url: "https://leetcode.com/problems/last-stone-weight/" },
  { id: "nc-66", title: "K Closest Points to Origin", difficulty: "Medium", category: "Heap / Priority Queue", url: "https://leetcode.com/problems/k-closest-points-to-origin/" },
  { id: "nc-67", title: "Kth Largest Element In An Array", difficulty: "Medium", category: "Heap / Priority Queue", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { id: "nc-68", title: "Task Scheduler", difficulty: "Medium", category: "Heap / Priority Queue", url: "https://leetcode.com/problems/task-scheduler/" },
  { id: "nc-69", title: "Design Twitter", difficulty: "Medium", category: "Heap / Priority Queue", url: "https://leetcode.com/problems/design-twitter/" },
  { id: "nc-70", title: "Find Median From Data Stream", difficulty: "Hard", category: "Heap / Priority Queue", url: "https://leetcode.com/problems/find-median-from-data-stream/" },

  // Backtracking (9)
  { id: "nc-71", title: "Subsets", difficulty: "Medium", category: "Backtracking", url: "https://leetcode.com/problems/subsets/" },
  { id: "nc-72", title: "Combination Sum", difficulty: "Medium", category: "Backtracking", url: "https://leetcode.com/problems/combination-sum/" },
  { id: "nc-73", title: "Permutations", difficulty: "Medium", category: "Backtracking", url: "https://leetcode.com/problems/permutations/" },
  { id: "nc-74", title: "Subsets II", difficulty: "Medium", category: "Backtracking", url: "https://leetcode.com/problems/subsets-ii/" },
  { id: "nc-75", title: "Combination Sum II", difficulty: "Medium", category: "Backtracking", url: "https://leetcode.com/problems/combination-sum-ii/" },
  { id: "nc-76", title: "Word Search", difficulty: "Medium", category: "Backtracking", url: "https://leetcode.com/problems/word-search/" },
  { id: "nc-77", title: "Palindrome Partitioning", difficulty: "Medium", category: "Backtracking", url: "https://leetcode.com/problems/palindrome-partitioning/" },
  { id: "nc-78", title: "Letter Combinations of a Phone Number", difficulty: "Medium", category: "Backtracking", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
  { id: "nc-79", title: "N-Queens", difficulty: "Hard", category: "Backtracking", url: "https://leetcode.com/problems/n-queens/" },

  // Graphs (13)
  { id: "nc-80", title: "Number of Islands", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/number-of-islands/" },
  { id: "nc-81", title: "Max Area of Island", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/max-area-of-island/" },
  { id: "nc-82", title: "Clone Graph", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/clone-graph/" },
  { id: "nc-83", title: "Walls And Gates", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/walls-and-gates/" },
  { id: "nc-84", title: "Rotting Oranges", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/rotting-oranges/" },
  { id: "nc-85", title: "Pacific Atlantic Water Flow", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: "nc-86", title: "Surrounded Regions", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/surrounded-regions/" },
  { id: "nc-87", title: "Course Schedule", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/course-schedule/" },
  { id: "nc-88", title: "Course Schedule II", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/course-schedule-ii/" },
  { id: "nc-89", title: "Graph Valid Tree", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/graph-valid-tree/" },
  { id: "nc-90", title: "Number of Connected Components", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
  { id: "nc-91", title: "Redundant Connection", difficulty: "Medium", category: "Graphs", url: "https://leetcode.com/problems/redundant-connection/" },
  { id: "nc-92", title: "Word Ladder", difficulty: "Hard", category: "Graphs", url: "https://leetcode.com/problems/word-ladder/" },

  // Advanced Graphs (5)
  { id: "nc-93", title: "Reconstruct Itinerary", difficulty: "Hard", category: "Advanced Graphs", url: "https://leetcode.com/problems/reconstruct-itinerary/" },
  { id: "nc-94", title: "Min Cost to Connect All Points", difficulty: "Medium", category: "Advanced Graphs", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
  { id: "nc-95", title: "Swim In Rising Water", difficulty: "Hard", category: "Advanced Graphs", url: "https://leetcode.com/problems/swim-in-rising-water/" },
  { id: "nc-96", title: "Alien Dictionary", difficulty: "Hard", category: "Advanced Graphs", url: "https://leetcode.com/problems/alien-dictionary/" },
  { id: "nc-97", title: "Cheapest Flights Within K Stops", difficulty: "Medium", category: "Advanced Graphs", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },

  // 1D Dynamic Programming (12)
  { id: "nc-98", title: "Climbing Stairs", difficulty: "Easy", category: "1D DP", url: "https://leetcode.com/problems/climbing-stairs/" },
  { id: "nc-99", title: "Min Cost Climbing Stairs", difficulty: "Easy", category: "1D DP", url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
  { id: "nc-100", title: "House Robber", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/house-robber/" },
  { id: "nc-101", title: "House Robber II", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/house-robber-ii/" },
  { id: "nc-102", title: "Longest Palindromic Substring", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: "nc-103", title: "Palindromic Substrings", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/palindromic-substrings/" },
  { id: "nc-104", title: "Decode Ways", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/decode-ways/" },
  { id: "nc-105", title: "Coin Change", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/coin-change/" },
  { id: "nc-106", title: "Maximum Product Subarray", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/maximum-product-subarray/" },
  { id: "nc-107", title: "Word Break", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/word-break/" },
  { id: "nc-108", title: "Longest Increasing Subsequence", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id: "nc-109", title: "Partition Equal Subset Sum", difficulty: "Medium", category: "1D DP", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },

  // 2D Dynamic Programming (11)
  { id: "nc-110", title: "Unique Paths", difficulty: "Medium", category: "2D DP", url: "https://leetcode.com/problems/unique-paths/" },
  { id: "nc-111", title: "Longest Common Subsequence", difficulty: "Medium", category: "2D DP", url: "https://leetcode.com/problems/longest-common-subsequence/" },
  { id: "nc-112", title: "Best Time to Buy And Sell Stock With Cooldown", difficulty: "Medium", category: "2D DP", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
  { id: "nc-113", title: "Coin Change II", difficulty: "Medium", category: "2D DP", url: "https://leetcode.com/problems/coin-change-ii/" },
  { id: "nc-114", title: "Target Sum", difficulty: "Medium", category: "2D DP", url: "https://leetcode.com/problems/target-sum/" },
  { id: "nc-115", title: "Interleaving String", difficulty: "Medium", category: "2D DP", url: "https://leetcode.com/problems/interleaving-string/" },
  { id: "nc-116", title: "Longest Increasing Path In a Matrix", difficulty: "Hard", category: "2D DP", url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/" },
  { id: "nc-117", title: "Distinct Subsequences", difficulty: "Hard", category: "2D DP", url: "https://leetcode.com/problems/distinct-subsequences/" },
  { id: "nc-118", title: "Edit Distance", difficulty: "Hard", category: "2D DP", url: "https://leetcode.com/problems/edit-distance/" },
  { id: "nc-119", title: "Burst Balloons", difficulty: "Hard", category: "2D DP", url: "https://leetcode.com/problems/burst-balloons/" },
  { id: "nc-120", title: "Regular Expression Matching", difficulty: "Hard", category: "2D DP", url: "https://leetcode.com/problems/regular-expression-matching/" },

  // Greedy (8)
  { id: "nc-121", title: "Maximum Subarray", difficulty: "Medium", category: "Greedy", url: "https://leetcode.com/problems/maximum-subarray/" },
  { id: "nc-122", title: "Jump Game", difficulty: "Medium", category: "Greedy", url: "https://leetcode.com/problems/jump-game/" },
  { id: "nc-123", title: "Jump Game II", difficulty: "Medium", category: "Greedy", url: "https://leetcode.com/problems/jump-game-ii/" },
  { id: "nc-124", title: "Gas Station", difficulty: "Medium", category: "Greedy", url: "https://leetcode.com/problems/gas-station/" },
  { id: "nc-125", title: "Hand of Straights", difficulty: "Medium", category: "Greedy", url: "https://leetcode.com/problems/hand-of-straights/" },
  { id: "nc-126", title: "Merge Triplets to Form Target Triplet", difficulty: "Medium", category: "Greedy", url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
  { id: "nc-127", title: "Partition Labels", difficulty: "Medium", category: "Greedy", url: "https://leetcode.com/problems/partition-labels/" },
  { id: "nc-128", title: "Valid Parenthesis String", difficulty: "Medium", category: "Greedy", url: "https://leetcode.com/problems/valid-parenthesis-string/" },

  // Intervals (6)
  { id: "nc-129", title: "Insert Interval", difficulty: "Medium", category: "Intervals", url: "https://leetcode.com/problems/insert-interval/" },
  { id: "nc-130", title: "Merge Intervals", difficulty: "Medium", category: "Intervals", url: "https://leetcode.com/problems/merge-intervals/" },
  { id: "nc-131", title: "Non-overlapping Intervals", difficulty: "Medium", category: "Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
  { id: "nc-132", title: "Meeting Rooms", difficulty: "Easy", category: "Intervals", url: "https://leetcode.com/problems/meeting-rooms/" },
  { id: "nc-133", title: "Meeting Rooms II", difficulty: "Medium", category: "Intervals", url: "https://leetcode.com/problems/meeting-rooms-ii/" },
  { id: "nc-134", title: "Minimum Interval to Include Each Query", difficulty: "Hard", category: "Intervals", url: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },

  // Math & Geometry (7)
  { id: "nc-135", title: "Rotate Image", difficulty: "Medium", category: "Math & Geometry", url: "https://leetcode.com/problems/rotate-image/" },
  { id: "nc-136", title: "Spiral Matrix", difficulty: "Medium", category: "Math & Geometry", url: "https://leetcode.com/problems/spiral-matrix/" },
  { id: "nc-137", title: "Set Matrix Zeroes", difficulty: "Medium", category: "Math & Geometry", url: "https://leetcode.com/problems/set-matrix-zeroes/" },
  { id: "nc-138", title: "Happy Number", difficulty: "Easy", category: "Math & Geometry", url: "https://leetcode.com/problems/happy-number/" },
  { id: "nc-139", title: "Pow(x, n)", difficulty: "Medium", category: "Math & Geometry", url: "https://leetcode.com/problems/powx-n/" },
  { id: "nc-140", title: "Multiply Strings", difficulty: "Medium", category: "Math & Geometry", url: "https://leetcode.com/problems/multiply-strings/" },
  { id: "nc-141", title: "Detect Squares", difficulty: "Medium", category: "Math & Geometry", url: "https://leetcode.com/problems/detect-squares/" },

  // Bit Manipulation (9)
  { id: "nc-142", title: "Single Number", difficulty: "Easy", category: "Bit Manipulation", url: "https://leetcode.com/problems/single-number/" },
  { id: "nc-143", title: "Number of 1 Bits", difficulty: "Easy", category: "Bit Manipulation", url: "https://leetcode.com/problems/number-of-1-bits/" },
  { id: "nc-144", title: "Counting Bits", difficulty: "Easy", category: "Bit Manipulation", url: "https://leetcode.com/problems/counting-bits/" },
  { id: "nc-145", title: "Reverse Bits", difficulty: "Easy", category: "Bit Manipulation", url: "https://leetcode.com/problems/reverse-bits/" },
  { id: "nc-146", title: "Missing Number", difficulty: "Easy", category: "Bit Manipulation", url: "https://leetcode.com/problems/missing-number/" },
  { id: "nc-147", title: "Sum of Two Integers", difficulty: "Medium", category: "Bit Manipulation", url: "https://leetcode.com/problems/sum-of-two-integers/" },
  { id: "nc-148", title: "Reverse Integer", difficulty: "Medium", category: "Bit Manipulation", url: "https://leetcode.com/problems/reverse-integer/" },
  { id: "nc-149", title: "Bitwise AND of Numbers Range", difficulty: "Medium", category: "Bit Manipulation", url: "https://leetcode.com/problems/bitwise-and-of-numbers-range/" },
  { id: "nc-150", title: "UTF-8 Validation", difficulty: "Medium", category: "Bit Manipulation", url: "https://leetcode.com/problems/utf-8-validation/" }
];
