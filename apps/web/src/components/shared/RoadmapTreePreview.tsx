"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CircleDashed,
  Compass,
  ArrowRight,
  GitBranch,
  Sparkles,
  ExternalLink,
  Tag,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TreeNode {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "done" | "in-progress" | "pending";
  description: string;
  companies: string[];
  subProblems?: {
    name: string;
    difficulty: "Easy" | "Medium" | "Hard";
    solved: boolean;
  }[];
}

interface TreeSection {
  id: string;
  phase: string;
  title: string;
  summary: string;
  leftNodes: TreeNode[];
  rightNodes: TreeNode[];
}

const TREE_SECTIONS: TreeSection[] = [
  {
    id: "arrays-window",
    phase: "Phase 01 • Core Fundamentals",
    title: "Arrays, Two Pointers & Sliding Window",
    summary:
      "Master sequential memory traversal, two-pointer convergence, and dynamic window boundaries.",
    leftNodes: [
      {
        id: "two-pointers",
        title: "Two Pointer Convergence",
        difficulty: "Medium",
        status: "done",
        description: "Pointers moving from opposing ends towards the center in O(N) time.",
        companies: ["Amazon", "Google", "Meta"],
        subProblems: [
          { name: "Valid Palindrome", difficulty: "Easy", solved: true },
          { name: "Two Sum II (Sorted)", difficulty: "Medium", solved: true },
          { name: "Container With Most Water", difficulty: "Medium", solved: true },
        ],
      },
      {
        id: "prefix-sums",
        title: "Prefix Sum & Hash Maps",
        difficulty: "Medium",
        status: "done",
        description: "Accumulated sums to answer range query problems in O(1) time.",
        companies: ["Microsoft", "Uber", "Apple"],
        subProblems: [
          { name: "Subarray Sum Equals K", difficulty: "Medium", solved: true },
          { name: "Product of Array Except Self", difficulty: "Medium", solved: true },
        ],
      },
    ],
    rightNodes: [
      {
        id: "sliding-window",
        title: "Dynamic Sliding Window",
        difficulty: "Medium",
        status: "in-progress",
        description: "Expand right bound and contract left bound to maintain problem constraints.",
        companies: ["Google", "Bloomberg", "Atlassian"],
        subProblems: [
          { name: "Best Time to Buy & Sell Stock", difficulty: "Easy", solved: true },
          { name: "Longest Substring Without Repeating", difficulty: "Medium", solved: true },
          { name: "Minimum Window Substring", difficulty: "Hard", solved: false },
        ],
      },
      {
        id: "fast-slow",
        title: "Fast & Slow Pointers",
        difficulty: "Easy",
        status: "pending",
        description: "Floyd's cycle-finding algorithm for cyclic arrays and linked lists.",
        companies: ["Adobe", "Oracle", "Cisco"],
        subProblems: [
          { name: "Linked List Cycle", difficulty: "Easy", solved: false },
          { name: "Find the Duplicate Number", difficulty: "Medium", solved: false },
        ],
      },
    ],
  },
  {
    id: "trees-graphs",
    phase: "Phase 02 • Hierarchical Structures",
    title: "Binary Trees, BST & Graph Traversals",
    summary:
      "Deep-dive into recursive tree traversals, BST balancing, BFS level-order queues, and DFS backtracking.",
    leftNodes: [
      {
        id: "tree-dfs",
        title: "Tree DFS & Recursion",
        difficulty: "Medium",
        status: "done",
        description: "In-order, pre-order, and post-order traversals computing depths and subtrees.",
        companies: ["Google", "Microsoft", "Meta"],
        subProblems: [
          { name: "Maximum Depth of Binary Tree", difficulty: "Easy", solved: true },
          { name: "Invert Binary Tree", difficulty: "Easy", solved: true },
          { name: "Lowest Common Ancestor of BST", difficulty: "Medium", solved: true },
        ],
      },
      {
        id: "graph-bfs",
        title: "Graph BFS & Shortest Paths",
        difficulty: "Medium",
        status: "pending",
        description: "Queue-based level traversal on unweighted cyclic and acyclic graphs.",
        companies: ["Uber", "Amazon", "LinkedIn"],
        subProblems: [
          { name: "Number of Islands", difficulty: "Medium", solved: false },
          { name: "Rotting Oranges", difficulty: "Medium", solved: false },
        ],
      },
    ],
    rightNodes: [
      {
        id: "tree-bfs",
        title: "Level Order Traversal",
        difficulty: "Medium",
        status: "in-progress",
        description: "Queue-driven breadth-first traversal per tree level with width tracking.",
        companies: ["Apple", "Salesforce", "DoorDash"],
        subProblems: [
          { name: "Binary Tree Level Order Traversal", difficulty: "Medium", solved: true },
          { name: "Binary Tree Right Side View", difficulty: "Medium", solved: false },
        ],
      },
      {
        id: "topological-sort",
        title: "Topological Sort & Kahn's",
        difficulty: "Hard",
        status: "pending",
        description: "Linear ordering of vertices in Directed Acyclic Graphs (DAG).",
        companies: ["Google", "Meta", "Palantir"],
        subProblems: [
          { name: "Course Schedule I & II", difficulty: "Medium", solved: false },
          { name: "Alien Dictionary", difficulty: "Hard", solved: false },
        ],
      },
    ],
  },
  {
    id: "dp-optimization",
    phase: "Phase 03 • Advanced Mastery",
    title: "Dynamic Programming & State Transitions",
    summary:
      "Master overlapping subproblems, memoization vs bottom-up tabulation, 0/1 knapsack, and sequence matching.",
    leftNodes: [
      {
        id: "dp-1d",
        title: "1-D Dynamic Programming",
        difficulty: "Medium",
        status: "done",
        description: "Linear state transitions with memoized subproblems and base cases.",
        companies: ["Amazon", "Google", "Adobe"],
        subProblems: [
          { name: "Climbing Stairs", difficulty: "Easy", solved: true },
          { name: "House Robber I & II", difficulty: "Medium", solved: true },
          { name: "Coin Change", difficulty: "Medium", solved: true },
        ],
      },
      {
        id: "dp-lcs",
        title: "Longest Common Subsequence",
        difficulty: "Medium",
        status: "pending",
        description: "2D grid state transitions matching substrings and character sequences.",
        companies: ["Microsoft", "Meta", "Goldman Sachs"],
        subProblems: [
          { name: "Longest Common Subsequence", difficulty: "Medium", solved: false },
          { name: "Edit Distance", difficulty: "Hard", solved: false },
        ],
      },
    ],
    rightNodes: [
      {
        id: "dp-knapsack",
        title: "0/1 Knapsack & Partitions",
        difficulty: "Hard",
        status: "in-progress",
        description: "Decision tree optimization picking or skipping weights with bound limits.",
        companies: ["Google", "Uber", "Netflix"],
        subProblems: [
          { name: "Partition Equal Subset Sum", difficulty: "Medium", solved: true },
          { name: "Target Sum", difficulty: "Medium", solved: false },
        ],
      },
      {
        id: "dp-intervals",
        title: "Interval & Buy-Sell States",
        difficulty: "Hard",
        status: "pending",
        description: "State machines tracking transaction cooldowns and holding fees.",
        companies: ["Jane Street", "Citadel", "Meta"],
        subProblems: [
          { name: "Best Time with Cooldown", difficulty: "Medium", solved: false },
          { name: "Burst Balloons", difficulty: "Hard", solved: false },
        ],
      },
    ],
  },
];

export function RoadmapTreePreview() {
  const [activeTab, setActiveTab] = useState<string>("arrays-window");
  const [selectedNode, setSelectedNode] = useState<TreeNode>(
    TREE_SECTIONS[0].leftNodes[0]
  );

  const currentSection =
    TREE_SECTIONS.find((s) => s.id === activeTab) || TREE_SECTIONS[0];

  return (
    <div className="space-y-6">
      {/* Interactive Topic Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-[#121212]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-md max-w-2xl mx-auto shadow-xs">
        {TREE_SECTIONS.map((sec) => {
          const isActive = sec.id === activeTab;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setActiveTab(sec.id);
                setSelectedNode(sec.leftNodes[0]);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                  : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
              }`}
            >
              {sec.title.split(",")[0]}
            </button>
          );
        })}
      </div>

      {/* Main Roadmap Tree Canvas */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0A0A0A]/90 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-8">
        {/* Subtle Tree Background Grid Lines */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

        {/* Central Milestone Spine Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <GitBranch className="w-3.5 h-3.5" /> {currentSection.phase}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#EDEDED]">
            {currentSection.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA] leading-relaxed">
            {currentSection.summary}
          </p>
        </div>

        {/* Tree Layout: Left Nodes | Central Spine | Right Nodes */}
        <div className="relative">
          {/* Vertical Central Trunk Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-sky-500/30 via-indigo-500/20 to-slate-200 dark:to-neutral-800" />

          {/* Node Grid Pairs */}
          <div className="space-y-6 sm:space-y-8">
            {currentSection.leftNodes.map((leftNode, idx) => {
              const rightNode = currentSection.rightNodes[idx];
              const isLeftSelected = selectedNode.id === leftNode.id;
              const isRightSelected = rightNode && selectedNode.id === rightNode.id;

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center relative"
                >
                  {/* Central Spine Node Circle (Desktop only) */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white dark:bg-[#121212] border-2 border-sky-500 items-center justify-center text-[10px] font-black text-sky-500 z-10 shadow-xs">
                    0{idx + 1}
                  </div>

                  {/* LEFT BRANCH NODE */}
                  <div className="relative flex justify-end">
                    {/* Horizontal Connector Line (Desktop) */}
                    <div className="hidden md:block absolute right-0 top-1/2 translate-x-full w-8 h-0.5 bg-slate-300 dark:bg-neutral-800" />

                    <div
                      onClick={() => setSelectedNode(leftNode)}
                      className={`w-full max-w-md p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none space-y-2.5 ${
                        isLeftSelected
                          ? "border-sky-500 bg-sky-50/40 dark:bg-[#121212] shadow-md shadow-sky-500/10 ring-1 ring-sky-500/50"
                          : leftNode.status === "done"
                          ? "border-emerald-500/30 bg-white dark:bg-[#121212]/80 hover:border-emerald-500/60"
                          : "border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#121212]/80 hover:border-slate-300 dark:hover:border-white/[0.16]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {leftNode.status === "done" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : leftNode.status === "in-progress" ? (
                            <CircleDashed className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-400 dark:border-neutral-600 shrink-0 inline-block" />
                          )}
                          <span className="text-xs font-extrabold text-slate-900 dark:text-[#EDEDED]">
                            {leftNode.title}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            leftNode.difficulty === "Easy"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : leftNode.difficulty === "Medium"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {leftNode.difficulty}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA] leading-relaxed">
                        {leftNode.description}
                      </p>

                      {/* Sub-problem chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {leftNode.subProblems?.map((sp, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 ${
                              sp.solved
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-neutral-400"
                            }`}
                          >
                            {sp.solved && "✓"} {sp.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT BRANCH NODE */}
                  {rightNode && (
                    <div className="relative flex justify-start">
                      {/* Horizontal Connector Line (Desktop) */}
                      <div className="hidden md:block absolute left-0 top-1/2 -translate-x-full w-8 h-0.5 bg-slate-300 dark:bg-neutral-800" />

                      <div
                        onClick={() => setSelectedNode(rightNode)}
                        className={`w-full max-w-md p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none space-y-2.5 ${
                          isRightSelected
                            ? "border-sky-500 bg-sky-50/40 dark:bg-[#121212] shadow-md shadow-sky-500/10 ring-1 ring-sky-500/50"
                            : rightNode.status === "done"
                            ? "border-emerald-500/30 bg-white dark:bg-[#121212]/80 hover:border-emerald-500/60"
                            : rightNode.status === "in-progress"
                            ? "border-sky-500/30 bg-white dark:bg-[#121212]/80 hover:border-sky-500/60"
                            : "border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#121212]/80 hover:border-slate-300 dark:hover:border-white/[0.16]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {rightNode.status === "done" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : rightNode.status === "in-progress" ? (
                              <CircleDashed className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-400 dark:border-neutral-600 shrink-0 inline-block" />
                            )}
                            <span className="text-xs font-extrabold text-slate-900 dark:text-[#EDEDED]">
                              {rightNode.title}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              rightNode.difficulty === "Easy"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : rightNode.difficulty === "Medium"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {rightNode.difficulty}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA] leading-relaxed">
                          {rightNode.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {rightNode.subProblems?.map((sp, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 ${
                                sp.solved
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-neutral-400"
                              }`}
                            >
                              {sp.solved && "✓"} {sp.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Drawer Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                Selected Topic: {selectedNode.title}
              </span>
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {selectedNode.difficulty} Track
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#A1A1AA]">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>Commonly Asked At: {selectedNode.companies.join(", ")}</span>
            </div>
          </div>

          <Link href="/dashboard/dsa" className="shrink-0">
            <Button size="sm" className="rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-4 h-9 gap-1.5">
              Launch Full Roadmap in Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
