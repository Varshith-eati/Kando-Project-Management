"use client";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBoard } from "@/lib/hooks/useBoards";
import { ColumnWithTasks, Task } from "@/lib/supabase/models";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Color presets for board settings
const COLOR_PRESETS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-zinc-700",
  "bg-teal-500",
  "bg-pink-500",
  "bg-blue-600",
  "bg-orange-500",
  "bg-purple-600",
];

// Helper for priority badge styling
function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" }) {
  switch (priority) {
    case "high":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200/70">
          <Flame className="h-3 w-3" />
          High
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/70">
          <Clock className="h-3 w-3" />
          Med
        </span>
      );
    case "low":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/70">
          <CheckCircle2 className="h-3 w-3" />
          Low
        </span>
      );
  }
}

// Droppable Column Component
function DroppableColumn({
  column,
  index,
  children,
  onOpenCreateTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  index: number;
  children: React.ReactNode;
  onOpenCreateTask: (columnId: string) => void;
  onEditColumn: (column: ColumnWithTasks) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  // Column status indicator dot color
  const statusColors = [
    "bg-sky-500",
    "bg-amber-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-indigo-500",
  ];
  const dotColor = statusColors[index % statusColors.length];

  return (
    <div
      ref={setNodeRef}
      className={`w-full lg:flex-shrink-0 lg:w-80 flex flex-col rounded-2xl transition-all duration-200 ${
        isOver
          ? "bg-indigo-50/70 ring-2 ring-indigo-400/50 shadow-md"
          : "bg-zinc-100/70 border border-zinc-200/60"
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0">
          <div className={`h-2.5 w-2.5 rounded-full ${dotColor} flex-shrink-0`} />
          <h3 className="font-bold text-zinc-900 text-sm tracking-tight truncate">
            {column.title}
          </h3>
          <span className="rounded-full bg-white border border-zinc-200/80 px-2 py-0.5 text-[11px] font-bold text-zinc-600 shadow-xs flex-shrink-0">
            {column.tasks.length}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900 hover:bg-white/80 rounded-lg"
            onClick={() => onOpenCreateTask(column.id)}
            title="Add task to column"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900 hover:bg-white/80 rounded-lg"
            onClick={() => onEditColumn(column)}
            title="Column actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tasks container */}
      <div className="p-2.5 pt-1 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5 min-h-[50px]">
          {children}
          {column.tasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-200/90 bg-white/40 py-6 text-center text-xs text-zinc-400">
              No tasks yet • Drag a card or click + to add
            </div>
          )}
        </div>

        {/* Quick add card trigger */}
        <button
          type="button"
          onClick={() => onOpenCreateTask(column.id)}
          className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 hover:bg-white/80 border border-transparent hover:border-zinc-200/60 transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add task</span>
        </button>
      </div>
    </div>
  );
}

// Sortable Task Card
function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={styles} {...listeners} {...attributes}>
      <Card className="cursor-grab active:cursor-grabbing rounded-xl border border-zinc-200/80 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-150 p-3.5 space-y-2.5 group">
        <div className="flex items-start justify-between gap-2">
          <PriorityBadge priority={task.priority} />
          <GripVertical className="h-3.5 w-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>

        <div>
          <h4 className="font-semibold text-zinc-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mt-1">
              {task.description}
            </p>
          )}
        </div>

        {(task.assignee || task.due_date) && (
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
            {task.assignee ? (
              <span className="flex items-center gap-1.5 font-medium truncate max-w-[130px]">
                <span className="h-4 w-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[9px] font-bold">
                  {task.assignee.slice(0, 2).toUpperCase()}
                </span>
                <span className="truncate">{task.assignee}</span>
              </span>
            ) : (
              <span />
            )}

            {task.due_date && (
              <span className="flex items-center gap-1 text-zinc-400 font-medium flex-shrink-0">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(task.due_date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// Drag Overlay for visual feedback during dragging
function TaskOverlay({ task }: { task: Task }) {
  return (
    <Card className="rounded-xl border border-indigo-300 bg-white shadow-2xl p-3.5 space-y-2.5 rotate-2 scale-105 cursor-grabbing ring-2 ring-indigo-500/20">
      <div className="flex items-start justify-between gap-2">
        <PriorityBadge priority={task.priority} />
      </div>
      <div>
        <h4 className="font-semibold text-zinc-900 text-sm">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
            {task.description}
          </p>
        )}
      </div>
    </Card>
  );
}

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const {
    board,
    createColumn,
    updateBoard,
    columns,
    createRealTask,
    setColumns,
    moveTask,
    updateColumn,
  } = useBoard(id);

  // Board settings state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  // Column dialog states
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(
    null
  );

  // Task creation modal state with target column
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [taskDueDate, setTaskDueDate] = useState("");
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  // Open Create Task modal for a specific column
  const handleOpenCreateTask = (colId: string) => {
    setTargetColumnId(colId || (columns[0]?.id ?? ""));
    setTaskTitle("");
    setTaskDescription("");
    setTaskAssignee("");
    setTaskPriority("medium");
    setTaskDueDate("");
    setIsCreateTaskOpen(true);
  };

  // Submit task creation
  const handleTaskFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const columnId = targetColumnId || columns[0]?.id;
    if (!columnId) return;

    try {
      setIsSubmittingTask(true);
      await createRealTask(columnId, {
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        assignee: taskAssignee.trim() || undefined,
        dueDate: taskDueDate || undefined,
        priority: taskPriority,
      });
      setIsCreateTaskOpen(false);
    } catch {
      // handled in hook
    } finally {
      setIsSubmittingTask(false);
    }
  };

  async function handleUpdateBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false);
    } catch {}
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === taskId);

    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = columns.find((col) =>
      col.tasks.some((t) => t.id === activeId)
    );

    const targetColumn = columns.find((col) =>
      col.tasks.some((t) => t.id === overId)
    );

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn.id === targetColumn.id) {
      const activeIndex = sourceColumn.tasks.findIndex(
        (t) => t.id === activeId
      );
      const overIndex = targetColumn.tasks.findIndex((t) => t.id === overId);

      if (activeIndex !== overIndex) {
        setColumns((prev: ColumnWithTasks[]) => {
          const newColumns = [...prev];
          const column = newColumns.find((col) => col.id === sourceColumn.id);
          if (column) {
            const tasks = [...column.tasks];
            const [removed] = tasks.splice(activeIndex, 1);
            tasks.splice(overIndex, 0, removed);
            column.tasks = tasks;
          }
          return newColumns;
        });
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((t) => t.id === taskId)
      );

      if (sourceColumn && sourceColumn.id !== targetColumn.id) {
        await moveTask(taskId, targetColumn.id, targetColumn.tasks.length);
      }
    } else {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((t) => t.id === taskId)
      );
      const targetCol = columns.find((col) =>
        col.tasks.some((t) => t.id === overId)
      );

      if (sourceColumn && targetCol) {
        const oldIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);
        const newIndex = targetCol.tasks.findIndex((t) => t.id === overId);

        if (oldIndex !== newIndex || sourceColumn.id !== targetCol.id) {
          await moveTask(taskId, targetCol.id, newIndex);
        }
      }
    }
  }

  async function handleCreateColumn(e: React.FormEvent) {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    await createColumn(newColumnTitle.trim());
    setNewColumnTitle("");
    setIsCreatingColumn(false);
  }

  async function handleUpdateColumn(e: React.FormEvent) {
    e.preventDefault();
    if (!editingColumnTitle.trim() || !editingColumn) return;

    await updateColumn(editingColumn.id, editingColumnTitle.trim());
    setEditingColumnTitle("");
    setIsEditingColumn(false);
    setEditingColumn(null);
  }

  function handleEditColumn(column: ColumnWithTasks) {
    setIsEditingColumn(true);
    setEditingColumn(column);
    setEditingColumnTitle(column.title);
  }

  // Filter tasks in columns by search, priority, and due date
  const filteredColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc =
            task.description?.toLowerCase().includes(q) ?? false;
          const matchesAssignee =
            task.assignee?.toLowerCase().includes(q) ?? false;
          if (!matchesTitle && !matchesDesc && !matchesAssignee) return false;
        }

        // Priority filter
        if (priorityFilter !== "all" && task.priority !== priorityFilter) {
          return false;
        }

        // Due date filter
        if (dueDateFilter && task.due_date) {
          const taskDate = new Date(task.due_date).toDateString();
          const filterDate = new Date(dueDateFilter).toDateString();
          if (taskDate !== filterDate) return false;
        }

        return true;
      }),
    }));
  }, [columns, searchQuery, priorityFilter, dueDateFilter]);

  const totalTasks = useMemo(() => {
    return columns.reduce((acc, col) => acc + col.tasks.length, 0);
  }, [columns]);

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (priorityFilter !== "all" ? 1 : 0) +
    (dueDateFilter ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#fafafb] text-zinc-900 flex flex-col">
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() => {
          setNewTitle(board?.title ?? "");
          setNewColor(board?.color ?? "");
          setIsEditingTitle(true);
        }}
        onFilterClick={() => setIsFilterOpen(true)}
        filterCount={activeFilterCount}
      />

      {/* Board Secondary Bar / Subheader */}
      <div className="border-b border-zinc-200/80 bg-white py-3 px-4 sm:px-6">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Board Title & Edit */}
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                board?.color || "bg-indigo-500"
              }`}
            />
            <button
              onClick={() => {
                setNewTitle(board?.title ?? "");
                setNewColor(board?.color ?? "");
                setIsEditingTitle(true);
              }}
              className="group flex items-center gap-1.5 text-lg font-bold text-zinc-900 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <span>{board?.title || "Board"}</span>
              <Pencil className="h-3.5 w-3.5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
            </button>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
            </span>
          </div>

          {/* Quick Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search filter input on the board */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <Input
                placeholder="Find in cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-7 text-xs rounded-xl bg-zinc-50 border-zinc-200 w-36 sm:w-44 focus-visible:ring-indigo-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Quick Priority Filter Pills */}
            <div className="hidden sm:flex items-center rounded-xl bg-zinc-100 p-0.5 text-xs font-medium">
              <button
                onClick={() => setPriorityFilter("all")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  priorityFilter === "all"
                    ? "bg-white text-zinc-900 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriorityFilter("high")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  priorityFilter === "high"
                    ? "bg-rose-50 text-rose-700 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                🔥 High
              </button>
              <button
                onClick={() => setPriorityFilter("medium")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  priorityFilter === "medium"
                    ? "bg-amber-50 text-amber-700 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                ⚡ Med
              </button>
              <button
                onClick={() => setPriorityFilter("low")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  priorityFilter === "low"
                    ? "bg-emerald-50 text-emerald-700 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                🌱 Low
              </button>
            </div>

            {/* Add Task Primary Action */}
            <Button
              size="sm"
              onClick={() => handleOpenCreateTask(columns[0]?.id ?? "")}
              className="h-8 gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-xs shadow-indigo-500/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Card</span>
            </Button>

            {/* Add Column Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreatingColumn(true)}
              className="h-8 gap-1.5 rounded-xl border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Column</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Board Kanban Canvas */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col lg:flex-row items-start gap-5 min-w-full pb-8">
            {filteredColumns.map((column, idx) => (
              <DroppableColumn
                key={column.id}
                index={idx}
                column={column}
                onOpenCreateTask={handleOpenCreateTask}
                onEditColumn={handleEditColumn}
              >
                <SortableContext
                  items={column.tasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2.5">
                    {column.tasks.map((task) => (
                      <SortableTask task={task} key={task.id} />
                    ))}
                  </div>
                </SortableContext>
              </DroppableColumn>
            ))}

            {/* Add another list button column */}
            <div className="w-full lg:flex-shrink-0 lg:w-80">
              <button
                type="button"
                onClick={() => setIsCreatingColumn(true)}
                className="w-full rounded-2xl border-2 border-dashed border-zinc-200 hover:border-indigo-400 hover:bg-indigo-50/20 p-6 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition-all cursor-pointer bg-white/40"
              >
                <Plus className="h-4 w-4" />
                <span>Add new column</span>
              </button>
            </div>

            <DragOverlay>
              {activeTask ? <TaskOverlay task={activeTask} /> : null}
            </DragOverlay>
          </div>
        </DndContext>
      </main>

      {/* Create Task Dialog */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              Create New Task
            </DialogTitle>
            <p className="text-xs text-zinc-500">
              Add details, set a priority, and assign ownership.
            </p>
          </DialogHeader>

          <form onSubmit={handleTaskFormSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">Column</Label>
              <Select
                value={targetColumnId}
                onValueChange={(val) => setTargetColumnId(val)}
              >
                <SelectTrigger className="h-9 rounded-xl border-zinc-200 text-xs">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {columns.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">
                Title *
              </Label>
              <Input
                required
                placeholder="What needs to get done?"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="h-10 rounded-xl border-zinc-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">
                Description
              </Label>
              <Textarea
                placeholder="Add context, acceptance criteria, or links..."
                rows={3}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="rounded-xl border-zinc-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">
                  Assignee
                </Label>
                <Input
                  placeholder="e.g. Alex M."
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="h-9 rounded-xl border-zinc-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">
                  Due Date
                </Label>
                <Input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="h-9 rounded-xl border-zinc-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">
                Priority
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={`py-1.5 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                      taskPriority === p
                        ? p === "high"
                          ? "bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-400"
                          : p === "medium"
                          ? "bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-400"
                          : "bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateTaskOpen(false)}
                className="rounded-xl border-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!taskTitle.trim() || isSubmittingTask}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
              >
                {isSubmittingTask ? "Adding..." : "Add Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Board Dialog */}
      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              Board Settings
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4 pt-1" onSubmit={handleUpdateBoard}>
            <div className="space-y-1.5">
              <Label htmlFor="editBoardTitle" className="text-xs font-medium text-zinc-700">
                Board Title
              </Label>
              <Input
                id="editBoardTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter board title..."
                required
                className="h-10 rounded-xl border-zinc-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">
                Accent Color
              </Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLOR_PRESETS.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`h-7 w-7 rounded-full ${color} transition-all cursor-pointer ${
                      color === newColor
                        ? "ring-2 ring-offset-2 ring-zinc-900 scale-110"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingTitle(false)}
                className="rounded-xl border-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
              >
                Save Changes
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
              Filter Tasks
            </DialogTitle>
            <p className="text-xs text-zinc-500">
              Filter visible tasks on this board.
            </p>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">Keyword</Label>
              <Input
                placeholder="Search titles, descriptions, assignees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">Priority</Label>
              <div className="flex flex-wrap gap-2">
                {["all", "high", "medium", "low"].map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={priorityFilter === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriorityFilter(p)}
                    className="capitalize rounded-xl text-xs"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">Due Date</Label>
              <Input
                type="date"
                value={dueDateFilter || ""}
                onChange={(e) => setDueDateFilter(e.target.value || null)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setPriorityFilter("all");
                  setDueDateFilter(null);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-900"
              >
                Reset filters
              </Button>
              <Button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-xl bg-zinc-900 text-white font-medium text-xs"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Column Dialog */}
      <Dialog open={isCreatingColumn} onOpenChange={setIsCreatingColumn}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              Add New Column
            </DialogTitle>
            <p className="text-xs text-zinc-500">
              Organize your board workflow into distinct stages.
            </p>
          </DialogHeader>
          <form className="space-y-4 pt-1" onSubmit={handleCreateColumn}>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">Column Title</Label>
              <Input
                id="columnTitle"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="e.g. In Review, QA, Deployed..."
                required
                className="h-10 rounded-xl border-zinc-200"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
              <Button
                type="button"
                onClick={() => setIsCreatingColumn(false)}
                variant="outline"
                className="rounded-xl border-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newColumnTitle.trim()}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
              >
                Create Column
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Column Dialog */}
      <Dialog open={isEditingColumn} onOpenChange={setIsEditingColumn}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              Edit Column
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4 pt-1" onSubmit={handleUpdateColumn}>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">Column Title</Label>
              <Input
                id="editColumnTitle"
                value={editingColumnTitle}
                onChange={(e) => setEditingColumnTitle(e.target.value)}
                placeholder="Enter column title..."
                required
                className="h-10 rounded-xl border-zinc-200"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
              <Button
                type="button"
                onClick={() => {
                  setIsEditingColumn(false);
                  setEditingColumnTitle("");
                  setEditingColumn(null);
                }}
                variant="outline"
                className="rounded-xl border-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
