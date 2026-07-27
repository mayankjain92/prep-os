"use client";

import { useState } from "react";
import {
  useTheoryTopics,
  useTheoryStats,
  useCreateTheoryTopic,
  useUpdateTheoryTopic,
  useDeleteTheoryTopic,
} from "@/features/theory/useTheory";
import { RoadmapFlowChart } from "@/components/shared/RoadmapFlowChart";
import { THEORY_ROADMAP_SECTIONS } from "@/data/theory-roadmap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, CheckCircle2, Circle, Clock, Plus, Trash2, CheckSquare, GitBranch, RefreshCw } from "lucide-react";

const SUBJECTS = ["OS", "DBMS", "CN", "Aptitude"] as const;

export default function TheoryDashboardPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("OS");
  const [newTopicName, setNewTopicName] = useState("");
  const [activeTab, setActiveTab] = useState<"flowchart" | "syllabus">("flowchart");

  const { data: stats = [], refetch } = useTheoryStats();
  const { data: topics = [], isPending } = useTheoryTopics(selectedSubject);

  const createMutation = useCreateTheoryTopic();
  const updateMutation = useUpdateTheoryTopic();
  const deleteMutation = useDeleteTheoryTopic();

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    createMutation.mutate({
      subject: selectedSubject as any,
      topicName: newTopicName.trim(),
      status: "not-started",
    });
    setNewTopicName("");
  };

  const handleCheckboxToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "completed" ? "not-started" : "completed";
    updateMutation.mutate({ id, data: { status: nextStatus as any } });
  };

  const handleStatusCycle = (id: string, currentStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus =
      currentStatus === "not-started"
        ? "in-progress"
        : currentStatus === "in-progress"
        ? "completed"
        : "not-started";

    updateMutation.mutate({ id, data: { status: nextStatus as any } });
  };

  // Calculate total theory progress from the stats
  const totalCompleted = stats.reduce((acc, curr) => acc + curr.completed, 0);
  const totalTopics = stats.reduce((acc, curr) => acc + curr.total, 0);
  const syllabusPercentage = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-6 sm:p-10 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-xblue" /> CS Theory & Aptitude Roadmap
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Master core computer science concepts across Operating Systems, DBMS, Networks, and Aptitude.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-full border-border text-foreground hover:bg-card">
              <RefreshCw className="mr-2 h-4 w-4 text-xblue" /> Refresh Stats
            </Button>
          </div>
        </div>

        {/* Section Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((sub) => {
            const stat = stats.find((s) => s.subject === sub) || {
              subject: sub,
              total: 0,
              completed: 0,
              percentage: 0,
            };

            const isSelected = selectedSubject === sub;

            return (
              <div
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all shadow-sm ${
                  isSelected
                    ? "border-xblue bg-xblue/10 shadow-xblue/10"
                    : "border-border bg-card hover:border-xblue/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-lg text-foreground">{sub}</span>
                  <Badge variant="outline" className="border-xblue/40 text-xblue bg-xblue/10 rounded-full text-xs font-bold">
                    {stat.percentage}% Done
                  </Badge>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  {stat.completed} of {stat.total} topics completed
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-background border border-border">
                  <div
                    className="h-full bg-xblue transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("flowchart")}
            className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "flowchart"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <GitBranch className="h-3.5 w-3.5 inline mr-1.5" /> Visual Theory Flowchart
          </button>
          <button
            onClick={() => setActiveTab("syllabus")}
            className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "syllabus"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 inline mr-1.5" /> Subject Topic Checklist ({syllabusPercentage}%)
          </button>
        </div>

        {/* Content Views */}
        {activeTab === "flowchart" ? (
          <RoadmapFlowChart 
            title="Computer Science Core & Aptitude Flowchart" 
            sections={THEORY_ROADMAP_SECTIONS} 
            storageKey="prep_os_theory_roadmap" 
          />
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm animate-in fade-in zoom-in-95">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-xblue" />
                  <span className="text-xblue font-black">{selectedSubject}</span> Concept Syllabus Checklist
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Click any checkbox to mark a topic complete</p>
              </div>

              {/* Custom Topic Form */}
              <form onSubmit={handleAddCustomTopic} className="flex gap-2">
                <Input
                  placeholder={`Add extra ${selectedSubject} topic...`}
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="bg-background text-foreground border-border sm:w-72 text-xs rounded-full px-4"
                />
                <Button type="submit" size="sm" className="rounded-full bg-xblue hover:bg-xhover text-white text-xs font-bold px-4">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </form>
            </div>

            {/* Interactive Concept List */}
            {isPending ? (
              <div className="py-12 text-center text-sm text-muted-foreground flex justify-center items-center">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Loading roadmap topics...
              </div>
            ) : topics.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Initializing pre-made roadmap...</div>
            ) : (
              <div className="space-y-3">
                {topics.map((t) => {
                  const isDone = t.status === "completed";
                  const isInProgress = t.status === "in-progress";

                  return (
                    <div
                      key={t._id}
                      onClick={() => handleCheckboxToggle(t._id, t.status)}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                        isDone
                          ? "border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500/60"
                          : isInProgress
                          ? "border-xblue/40 bg-xblue/10 hover:border-xblue/60"
                          : "border-border bg-background hover:border-xblue/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Interactive Checkbox */}
                        <div className="flex items-center justify-center">
                          {isDone ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-500 transition transform scale-105" />
                          ) : isInProgress ? (
                            <Clock className="h-6 w-6 text-xblue" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground hover:text-xblue transition" />
                          )}
                        </div>

                        <span
                          className={`text-sm font-black ${
                            isDone ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {t.topicName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Tag */}
                        <button
                          onClick={(e) => handleStatusCycle(t._id, t.status, e)}
                          className="cursor-pointer"
                        >
                          <Badge
                            variant="outline"
                            className={`rounded-full px-2 py-1 font-bold text-[10px] ${
                              isDone
                                ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/10"
                                : isInProgress
                                ? "border-xblue/40 text-xblue bg-xblue/10"
                                : "border-border text-muted-foreground bg-background hover:bg-card"
                            }`}
                          >
                            {t.status === "completed" ? "Done" : t.status === "in-progress" ? "Learning" : "Pending"}
                          </Badge>
                        </button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(t._id);
                          }}
                          className="rounded-full text-muted-foreground hover:text-rose-500 hover:bg-card px-2 h-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
