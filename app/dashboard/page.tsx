"use client";

import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlan } from "@/lib/contexts/PlanContext";
import { useBoards } from "@/lib/hooks/useBoards";
import { Board } from "@/lib/supabase/models";
import { useUser } from "@clerk/nextjs";
import {
  Activity,
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  Grid3x3,
  Kanban,
  List,
  Loader2,
  Plus,
  Rocket,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

const COLOR_PRESETS = [
  { name: "Indigo", value: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-50" },
  { name: "Emerald", value: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
  { name: "Amber", value: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50" },
  { name: "Rose", value: "bg-rose-500", text: "text-rose-600", light: "bg-rose-50" },
  { name: "Violet", value: "bg-violet-500", text: "text-violet-600", light: "bg-violet-50" },
  { name: "Sky", value: "bg-sky-500", text: "text-sky-600", light: "bg-sky-50" },
  { name: "Zinc", value: "bg-zinc-700", text: "text-zinc-700", light: "bg-zinc-100" },
  { name: "Teal", value: "bg-teal-500", text: "text-teal-600", light: "bg-teal-50" },
];

const TEMPLATES = [
  {
    title: "Sprint Backlog",
    description: "Manage weekly sprint tasks, user stories, and code reviews.",
    color: "bg-indigo-500",
  },
  {
    title: "Product Roadmap",
    description: "Track upcoming features, customer requests, and quarterly launches.",
    color: "bg-violet-500",
  },
  {
    title: "Content & Marketing",
    description: "Plan blog posts, product announcements, and social releases.",
    color: "bg-amber-500",
  },
  {
    title: "Bug & Issue Tracker",
    description: "Triage reported bugs, assign owners, and track resolutions.",
    color: "bg-rose-500",
  },
];

export default function DashboardPage() {
  const { user } = useUser();
  const { createBoard, boards, loading, error } = useBoards();
  const router = useRouter();
  const { isFreeUser } = usePlan();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  // Create board form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-indigo-500");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
    filterRecentOnly: false,
  });

  const canCreateBoard = !isFreeUser || boards.length < 1;

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const recentlyUpdatedCount = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return boards.filter((b) => new Date(b.updated_at) > oneWeekAgo).length;
  }, [boards]);

  const filteredBoards = useMemo(() => {
    return boards.filter((board: Board) => {
      const matchesSearch =
        board.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (board.description &&
          board.description.toLowerCase().includes(filters.search.toLowerCase()));

      const matchesDateRange =
        (!filters.dateRange.start ||
          new Date(board.created_at) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end ||
          new Date(board.created_at) <= new Date(filters.dateRange.end));

      const matchesRecent =
        !filters.filterRecentOnly ||
        new Date(board.updated_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      return matchesSearch && matchesDateRange && matchesRecent;
    });
  }, [boards, filters]);

  function clearFilters() {
    setFilters({
      search: "",
      dateRange: {
        start: null,
        end: null,
      },
      filterRecentOnly: false,
    });
  }

  const handleOpenCreateModal = () => {
    if (!canCreateBoard) {
      setShowUpgradeDialog(true);
      return;
    }
    setNewTitle("");
    setNewDescription("");
    setSelectedColor("bg-indigo-500");
    setShowCreateDialog(true);
  };

  const handleCreateBoardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setIsSubmitting(true);
      await createBoard({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        color: selectedColor,
      });
      setShowCreateDialog(false);
    } catch {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyTemplate = (template: (typeof TEMPLATES)[number]) => {
    setNewTitle(template.title);
    setNewDescription(template.description);
    setSelectedColor(template.color);
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0) +
    (filters.filterRecentOnly ? 1 : 0);

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafb]">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
            <h2 className="text-lg font-bold text-rose-900 mb-2">
              Something went wrong loading your boards
            </h2>
            <p className="text-sm text-rose-700 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-rose-300 hover:bg-rose-100"
            >
              Try reloading
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafb] text-zinc-900">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                {greeting},{" "}
                {user?.firstName ??
                  user?.emailAddresses[0]?.emailAddress?.split("@")[0] ??
                  "Maker"}
              </h1>
              <span className="text-2xl">☕</span>
            </div>
            <p className="text-sm text-zinc-500">
              Here is your project workspace and momentum overview for today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleOpenCreateModal}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 gap-2 cursor-pointer transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Board</span>
            </Button>
          </div>
        </div>

        {/* Workspace Health Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-xs p-0 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Total Boards
                </span>
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Kanban className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                  {boards.length}
                </span>
                <span className="text-xs text-zinc-400">boards active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-xs p-0 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Active Projects
                </span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Rocket className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                  {boards.length > 0 ? boards.length : 0}
                </span>
                <span className="text-xs text-emerald-600 font-medium">
                  In progress
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-xs p-0 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Recent Velocity
                </span>
                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                  {recentlyUpdatedCount}
                </span>
                <span className="text-xs text-zinc-400">updated this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-xs p-0 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Plan Status
                </span>
                <div className="h-8 w-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base sm:text-lg font-bold text-zinc-900">
                    {isFreeUser ? "Free Tier" : "Pro Plan"}
                  </span>
                  <p className="text-xs text-zinc-400">
                    {isFreeUser
                      ? `${boards.length}/1 boards used`
                      : "Unlimited boards"}
                  </p>
                </div>
                {isFreeUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-1"
                    onClick={() => router.push("/pricing")}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search boards or descriptions..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-9 h-9 bg-white border-zinc-200/80 rounded-xl text-xs sm:text-sm focus-visible:ring-indigo-500/20"
              />
              {filters.search && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: "" }))
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick Filter toggle */}
            <Button
              variant={filters.filterRecentOnly ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  filterRecentOnly: !prev.filterRecentOnly,
                }))
              }
              className={`h-9 rounded-xl text-xs font-medium transition-all ${
                filters.filterRecentOnly
                  ? "bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Recent (7d)
            </Button>

            {/* Filter Dialog trigger */}
            <Button
              variant={activeFilterCount > 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className={`h-9 rounded-xl text-xs font-medium ${
                activeFilterCount > 0
                  ? "bg-indigo-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1.5 h-4 px-1 text-[10px] bg-white/20 text-white"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-white border border-zinc-200 p-0.5 shadow-xs">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-7 w-7 p-0 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                title="Grid view"
              >
                <Grid3x3 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-7 w-7 p-0 rounded-lg ${
                  viewMode === "list"
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                title="List view"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Boards Display */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-sm font-medium">Loading your workspaces...</p>
          </div>
        ) : filteredBoards.length === 0 ? (
          /* Human-crafted empty state */
          <div className="rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center max-w-xl mx-auto my-8">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
              <Kanban className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1.5">
              {filters.search || activeFilterCount > 0
                ? "No matching boards found"
                : "No project boards yet"}
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6 leading-relaxed">
              {filters.search || activeFilterCount > 0
                ? "Try adjusting your search terms or clearing filters to see all your workspaces."
                : "Create your first board to start organizing tasks, sprint backlogs, or product roadmaps."}
            </p>
            {filters.search || activeFilterCount > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="rounded-xl border-zinc-200"
              >
                Clear all filters
              </Button>
            ) : (
              <Button
                onClick={handleOpenCreateModal}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Create your first board
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredBoards.map((board) => (
              <Link href={`/boards/${board.id}`} key={board.id} className="group">
                <Card className="h-full rounded-2xl border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer p-0">
                  <div>
                    {/* Header accent strip */}
                    <div
                      className={`h-2.5 w-full ${board.color || "bg-indigo-500"}`}
                    />
                    <CardHeader className="p-4 sm:p-5 pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`h-6 px-2 rounded-md ${
                            board.color || "bg-indigo-500"
                          } text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center shadow-xs`}
                        >
                          Board
                        </div>
                        <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(board.updated_at).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {board.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-zinc-500 line-clamp-2 mt-1 min-h-[2rem]">
                        {board.description || "No description provided."}
                      </CardDescription>
                    </CardHeader>
                  </div>

                  <CardContent className="p-4 sm:p-5 pt-0 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Calendar className="h-3.5 w-3.5" />
                      Created {new Date(board.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Quick Add Board Card in Grid */}
            <button
              onClick={handleOpenCreateModal}
              className="rounded-2xl border-2 border-dashed border-zinc-200 hover:border-indigo-400 hover:bg-indigo-50/20 bg-white/50 p-6 flex flex-col items-center justify-center min-h-[190px] transition-all group cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-zinc-100 group-hover:bg-indigo-100 text-zinc-400 group-hover:text-indigo-600 flex items-center justify-center mb-3 transition-colors">
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-700 group-hover:text-indigo-600 transition-colors">
                New Project Board
              </p>
              <span className="text-xs text-zinc-400 mt-1">
                From scratch or template
              </span>
            </button>
          </div>
        ) : (
          /* List View */
          <div className="space-y-2.5">
            {filteredBoards.map((board) => (
              <Link href={`/boards/${board.id}`} key={board.id} className="block group">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-4 hover:border-zinc-300 hover:shadow-md transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-lg ${
                        board.color || "bg-indigo-500"
                      } text-white flex items-center justify-center flex-shrink-0 shadow-xs`}
                    >
                      <Kanban className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                        {board.title}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate max-w-md">
                        {board.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-zinc-400 flex-shrink-0">
                    <span className="hidden md:inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(board.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            <button
              onClick={handleOpenCreateModal}
              className="w-full rounded-xl border-2 border-dashed border-zinc-200 hover:border-indigo-400 hover:bg-indigo-50/20 p-3.5 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-600 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create another board</span>
            </button>
          </div>
        )}
      </main>

      {/* Create Board Modal with Templates & Color Swatches */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="w-[95vw] max-w-lg rounded-2xl p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold text-zinc-900">
              Create New Board
            </DialogTitle>
            <p className="text-xs text-zinc-500">
              Pick a quick starter template or create a custom board from scratch.
            </p>
          </DialogHeader>

          {/* Quick starter template chips */}
          <div className="mb-4">
            <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
              Quick Starter Templates
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                    newTitle === tmpl.title
                      ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500"
                      : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-800 mb-0.5">
                    <div className={`h-2 w-2 rounded-full ${tmpl.color}`} />
                    {tmpl.title}
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">
                    {tmpl.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateBoardSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="board-title" className="text-xs font-medium text-zinc-700">
                Board Title *
              </Label>
              <Input
                id="board-title"
                required
                placeholder="e.g. Q4 Platform Sprint"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-10 rounded-xl border-zinc-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="board-desc" className="text-xs font-medium text-zinc-700">
                Description (optional)
              </Label>
              <Input
                id="board-desc"
                placeholder="Brief summary of this board's purpose..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="h-10 rounded-xl border-zinc-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">
                Accent Theme
              </Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLOR_PRESETS.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`h-7 w-7 rounded-full ${color.value} transition-all cursor-pointer ${
                      selectedColor === color.value
                        ? "ring-2 ring-offset-2 ring-zinc-900 scale-110"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="rounded-xl border-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newTitle.trim() || isSubmitting}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
              >
                {isSubmitting ? "Creating..." : "Create Board"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              Filter Boards
            </DialogTitle>
            <p className="text-xs text-zinc-500">
              Narrow down your workspace by date or keywords.
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">Search</Label>
              <Input
                placeholder="Search board titles & descriptions..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">Created Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-zinc-400">From</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.start || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value || null,
                        },
                      }))
                    }
                    className="rounded-xl text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-zinc-400">To</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.end || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value || null,
                        },
                      }))
                    }
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-zinc-500 hover:text-zinc-900"
              >
                Reset filters
              </Button>
              <Button
                size="sm"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-xl bg-zinc-900 text-white font-medium"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-zinc-900 mb-2">
            Unlock Unlimited Boards
          </DialogTitle>
          <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
            Free users can create 1 active board. Upgrade to Kando Pro or
            Enterprise for unlimited boards, real-time team collaboration, and
            advanced views.
          </p>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
              className="rounded-xl border-zinc-200"
            >
              Maybe later
            </Button>
            <Button
              onClick={() => router.push("/pricing")}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
            >
              Explore Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
