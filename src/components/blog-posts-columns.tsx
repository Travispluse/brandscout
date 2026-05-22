"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogTablePost } from "@/lib/blog-table-posts";

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export const blogPostsColumns: ColumnDef<BlogTablePost>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="h-8 px-2 text-xs font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Article
        <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const post = row.original;

      return (
        <div className="flex min-w-[360px] max-w-[620px] items-center gap-3 whitespace-normal py-1">
          <div
            aria-hidden="true"
            className="hidden h-14 w-20 shrink-0 rounded-md border border-gray-200 bg-cover bg-center sm:block"
            style={{ backgroundImage: `url(${post.imageUrl || "/brandscout-hero.svg"})` }}
          />
          <div className="min-w-0">
            <Link href={`/blog/${post.slug}`} className="font-medium text-gray-900 hover:underline">
              {post.title}
            </Link>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{post.excerpt}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "categoryLabel",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="border-gray-200 bg-white text-gray-600">
        {row.original.categoryLabel}
      </Badge>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="h-8 px-2 text-xs font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Published
        <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-gray-600">{formatDate(row.original.date)}</span>,
  },
  {
    accessorKey: "readingTime",
    header: "Read",
    cell: ({ row }) => <span className="text-gray-500">{row.original.readingTime || "1 min read"}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild className="gap-1">
        <Link href={`/blog/${row.original.slug}`}>
          Open
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    ),
  },
];
