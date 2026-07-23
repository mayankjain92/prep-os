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
] as const;

export type DsaTopic = (typeof DSA_TOPICS)[number];