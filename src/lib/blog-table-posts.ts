import { CATEGORIES, type BlogPost } from "@/lib/blog";

export interface BlogTablePost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  categoryLabel: string;
  imageUrl: string;
  readingTime: string;
  searchText: string;
}

export function toBlogTablePosts(posts: BlogPost[]): BlogTablePost[] {
  return posts.map((post) => {
    const title = post.title.replace(/\s*\|.*$/, "");
    const categoryLabel = CATEGORIES[post.category]?.label || post.category;

    return {
      slug: post.slug,
      title,
      excerpt: post.excerpt,
      date: post.date,
      category: post.category,
      categoryLabel,
      imageUrl: post.image_url,
      readingTime: post.reading_time,
      searchText: `${title} ${post.excerpt} ${categoryLabel} ${post.date}`.toLowerCase(),
    };
  });
}
