"use client";

import { SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Kanban,
  MousePointer2,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function HomePage() {
  const { isSignedIn } = useUser();

  const mockColumns = [
    {
      title: "Backlog",
      count: 3,
      color: "bg-zinc-400",
      tasks: [
        {
          title: "Audit web accessibility (a11y)",
          tag: "Frontend",
          priority: "medium",
          assignee: "Elena R.",
          dueDate: "Nov 6",
        },
        {
          title: "Implement Webhook endpoints",
          tag: "API",
          priority: "low",
          assignee: "Sam K.",
          dueDate: "Nov 12",
        },
      ],
    },
    {
      title: "In Progress",
      count: 2,
      color: "bg-indigo-500",
      tasks: [
        {
          title: "Redesign checkout drawer & Apple Pay",
          tag: "Design",
          priority: "high",
          assignee: "Maya T.",
          dueDate: "Tomorrow",
        },
        {
          title: "Supabase real-time sync optimization",
          tag: "Database",
          priority: "medium",
          assignee: "Alex M.",
          dueDate: "Friday",
        },
      ],
    },
    {
      title: "In Review",
      count: 1,
      color: "bg-amber-500",
      tasks: [
        {
          title: "Mobile drag-and-drop touch response",
          tag: "UX",
          priority: "high",
          assignee: "Chris D.",
          dueDate: "Today",
        },
      ],
    },
    {
      title: "Done",
      count: 14,
      color: "bg-emerald-500",
      tasks: [
        {
          title: "Q4 Roadmap prioritization meeting",
          tag: "Planning",
          priority: "low",
          assignee: "Team",
          dueDate: "Done",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafb] text-zinc-900 selection:bg-indigo-500/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/40 via-violet-100/30 to-amber-100/20 blur-3xl" />

        <div className="container mx-auto px-4 text-center">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3.5 py-1 text-xs font-medium text-indigo-700 shadow-xs backdrop-blur-sm mb-6 hover:border-indigo-300 transition-all cursor-pointer">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Kando 2.0 is live</span>
            <span className="text-zinc-300">•</span>
            <span className="font-semibold text-zinc-600 flex items-center gap-1">
              Fluid boards, zero clutter <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 max-w-4xl mx-auto leading-[1.1] mb-6">
            Where messy ideas become{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              shipped projects.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-10">
            A tactile, lightweight project board that gets out of your way. Drag
            cards, organize backlogs, and track team velocity in real time
            without the enterprise bloat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-12">
            {isSignedIn ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold shadow-md gap-2"
                >
                  Open Your Workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <SignUpButton>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 gap-2 cursor-pointer"
                  >
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </SignUpButton>
                <Link href="#demo" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-6 rounded-xl border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-sm font-medium"
                  >
                    Explore preview
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-zinc-500">
            <div className="flex -space-x-2">
              {["avatar1", "avatar2", "avatar3", "avatar4"].map((item, idx) => (
                <div
                  key={idx}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white bg-gradient-to-tr from-indigo-400 to-violet-400 text-[10px] font-bold text-white shadow-xs"
                >
                  {["JD", "MK", "AL", "ST"][idx]}
                </div>
              ))}
            </div>
            <span>
              Loved by <strong className="text-zinc-800 font-semibold">12,000+</strong> makers, engineering leads, and fast-moving teams.
            </span>
          </div>
        </div>

        {/* Live Interactive Board Mockup Showcase */}
        <div id="demo" className="container mx-auto px-4 mt-16 max-w-6xl">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-2.5 sm:p-4 shadow-xl shadow-zinc-200/50">
            {/* Mock Window Controls */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4 px-2">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-rose-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 text-xs font-semibold text-zinc-600">
                  Sprint 34 • Core Platform Roadmap
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-[11px] bg-zinc-100 text-zinc-600 font-medium"
                >
                  <Clock className="h-3 w-3 mr-1 text-zinc-400" /> 20 tasks
                </Badge>
                <Badge className="text-[11px] bg-indigo-50 text-indigo-700 border-indigo-100 font-medium">
                  Live View
                </Badge>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 bg-zinc-50/80 p-3 rounded-xl border border-zinc-100">
              {mockColumns.map((col, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-zinc-200/70 p-3 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${col.color}`} />
                        <span className="text-xs font-bold text-zinc-800">
                          {col.title}
                        </span>
                      </div>
                      <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600">
                        {col.count}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {col.tasks.map((task, tIdx) => (
                        <div
                          key={tIdx}
                          className="rounded-lg border border-zinc-200/80 bg-white p-3 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-600">
                              {task.tag}
                            </span>
                            {task.priority === "high" && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                                <Flame className="h-3 w-3" /> High
                              </span>
                            )}
                            {task.priority === "medium" && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                                <Clock className="h-3 w-3" /> Med
                              </span>
                            )}
                            {task.priority === "low" && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <CheckCircle2 className="h-3 w-3" /> Low
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-zinc-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {task.title}
                          </p>
                          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3 text-zinc-400" />
                              {task.assignee}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3 text-zinc-400" />
                              {task.dueDate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-center border-t border-dashed border-zinc-200 text-[11px] text-zinc-400 font-medium">
                    + Add task
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-zinc-200/70">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="mb-3 text-indigo-700 bg-indigo-50 border-indigo-200 text-xs font-semibold"
          >
            Thoughtfully Crafted
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
            Everything you need. Nothing to slow you down.
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg">
            We stripped away complex configuration dashboards, nested menus, and
            pointless toggles. What remains is pure productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <MousePointer2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              Tactile Drag & Drop
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Reorder tasks and shift columns with smooth physics. Designed for
              speed so moving tasks feels as fast as thought.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              Priority & Due Date Focus
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Smart visual tags help your team instantly identify urgent items,
              bottlenecks, and approaching deadlines at a single glance.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              Zero Configuration
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              No three-day onboarding or complex setup wizards. Create a board in
              under five seconds and start shipping immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Human Testimonial Quote */}
      <section className="bg-zinc-100/60 py-16 border-y border-zinc-200/70">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <blockquote className="text-lg sm:text-xl font-medium text-zinc-800 leading-relaxed mb-6">
            “Most project management tools feel like tax software. Kando is the
            first tool that feels lightweight enough for our daily work without
            drowning us in tickets, alerts, and submenus.”
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              MR
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-zinc-900">
                Marcus Rivera
              </div>
              <div className="text-xs text-zinc-500">
                Head of Product at Northwind Labs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-8 sm:p-14 text-center text-white shadow-2xl max-w-5xl mx-auto">
          {/* Ambient inner glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Ready to clear your backlog?
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg mb-8 leading-relaxed">
              Create your first board in seconds. Free for solo makers, with
              flexible upgrades when your team grows.
            </p>

            {!isSignedIn ? (
              <SignUpButton>
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-sm font-semibold shadow-lg gap-2 cursor-pointer"
                >
                  Create your free account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
            ) : (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-sm font-semibold shadow-lg gap-2"
                >
                  Go to your boards
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Free
                forever plan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> No
                credit card needed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 text-sm text-zinc-500">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Kanban className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-zinc-900">Kando</span>
              <span className="text-zinc-400">© 2025</span>
            </div>

            <div className="flex items-center space-x-6 text-xs">
              <Link
                href="/pricing"
                className="hover:text-zinc-900 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-zinc-900 transition-colors"
              >
                Boards
              </Link>
              <span className="text-zinc-400">
                Crafted with care for productive teams
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
