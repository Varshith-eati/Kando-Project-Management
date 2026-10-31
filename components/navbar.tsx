"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  Kanban,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";

interface Props {
  boardTitle?: string;
  onEditBoard?: () => void;
  onFilterClick?: () => void;
  filterCount?: number;
}

export default function Navbar({
  boardTitle,
  onEditBoard,
  onFilterClick,
  filterCount = 0,
}: Props) {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/boards/");

  // Shared brand logo component
  const BrandLogo = () => (
    <Link
      href="/"
      className="group flex items-center space-x-2.5 transition-transform active:scale-95"
    >
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all">
        <Kanban className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-indigo-600 transition-colors">
            Kando
          </span>
          <span className="rounded-full bg-indigo-50 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-700 border border-indigo-100">
            beta
          </span>
        </div>
      </div>
    </Link>
  );

  if (isDashboardPage) {
    return (
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-6">
            <BrandLogo />
            <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-zinc-200 text-sm font-medium text-zinc-600">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100/80 text-zinc-800 text-xs font-semibold">
                Personal Workspace
              </span>
              <Link
                href="/pricing"
                className="px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Plans
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/pricing" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Upgrade
              </Button>
            </Link>
            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 ring-2 ring-indigo-500/10",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isBoardPage) {
    return (
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <Link
              href="/dashboard"
              className="group flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 transition-all flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Boards</span>
            </Link>

            <span className="text-zinc-300">/</span>

            <div className="flex items-center space-x-2 min-w-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 flex-shrink-0">
                <Kanban className="h-3.5 w-3.5" />
              </div>
              <h1 className="text-sm sm:text-base font-semibold text-zinc-900 truncate max-w-[180px] sm:max-w-md">
                {boardTitle || "Untitled Board"}
              </h1>

              {onEditBoard && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 rounded-md p-0 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  onClick={onEditBoard}
                  title="Board settings"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {onFilterClick && (
              <Button
                variant={filterCount > 0 ? "default" : "outline"}
                size="sm"
                className={`h-8 gap-1.5 text-xs font-medium transition-all ${
                  filterCount > 0
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
                onClick={onFilterClick}
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
                {filterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 min-w-4 px-1 text-[10px] bg-white/20 text-white border-0"
                  >
                    {filterCount}
                  </Badge>
                )}
              </Button>
            )}

            <div className="h-4 w-px bg-zinc-200" />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
    );
  }

  // Public / Landing / Pricing navbar
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-8">
          <BrandLogo />
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-600">
            <Link
              href="#features"
              className="hover:text-zinc-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="hover:text-zinc-900 transition-colors"
            >
              Preview
            </Link>
            <Link
              href="/pricing"
              className="hover:text-zinc-900 transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {isSignedIn ? (
            <div className="flex items-center space-x-3">
              <span className="hidden md:inline-block text-xs text-zinc-500">
                Signed in as{" "}
                <span className="font-semibold text-zinc-800">
                  {user.firstName || user.emailAddresses[0]?.emailAddress}
                </span>
              </span>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="h-8 gap-1.5 bg-zinc-900 text-xs font-medium text-white hover:bg-zinc-800 shadow-xs"
                >
                  Go to Boards
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-medium text-white hover:from-indigo-500 hover:to-violet-500 shadow-sm shadow-indigo-500/20"
                >
                  Get started free
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
