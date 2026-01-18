import { Link } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// todo: remove mock data
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Must-Have Gadgets for 2024",
    excerpt: "Discover the latest tech innovations that are changing the way we live and work. From smart home devices to wearable technology.",
    image: "https://placehold.co/600x400/64748b/ffffff?text=Tech+Gadgets",
    category: "Technology",
    author: "John Smith",
    date: "Dec 10, 2024",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Sustainable Fashion: A Guide to Eco-Friendly Shopping",
    excerpt: "Learn how to build a wardrobe that's both stylish and environmentally conscious. Tips for sustainable fashion choices.",
    image: "https://placehold.co/600x400/78716c/ffffff?text=Fashion",
    category: "Fashion",
    author: "Emma Davis",
    date: "Dec 8, 2024",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Home Office Setup: Creating the Perfect Workspace",
    excerpt: "Transform your home office into a productive sanctuary. Essential furniture, lighting, and organization tips.",
    image: "https://placehold.co/600x400/6b7280/ffffff?text=Home+Office",
    category: "Home & Living",
    author: "Mike Johnson",
    date: "Dec 5, 2024",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Fitness Equipment Guide for Home Workouts",
    excerpt: "Build your perfect home gym without breaking the bank. Reviews of essential fitness equipment for every budget.",
    image: "https://placehold.co/600x400/71717a/ffffff?text=Fitness",
    category: "Sports",
    author: "Sarah Wilson",
    date: "Dec 3, 2024",
    readTime: "8 min read",
  },
  {
    id: 5,
    title: "Gift Guide: Perfect Presents for Everyone",
    excerpt: "Stuck on what to gift? Our curated guide covers presents for tech lovers, fashionistas, home enthusiasts, and more.",
    image: "https://placehold.co/600x400/94a3b8/ffffff?text=Gifts",
    category: "Shopping",
    author: "Lisa Brown",
    date: "Dec 1, 2024",
    readTime: "10 min read",
  },
  {
    id: 6,
    title: "Smart Home 101: Getting Started with Automation",
    excerpt: "A beginner's guide to making your home smarter. Learn about devices, ecosystems, and setup tips.",
    image: "https://placehold.co/600x400/475569/ffffff?text=Smart+Home",
    category: "Technology",
    author: "Tom Anderson",
    date: "Nov 28, 2024",
    readTime: "9 min read",
  },
];

const categories = ["All", "Technology", "Fashion", "Home & Living", "Sports", "Shopping"];

export default function Blogs() {
  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Our Blog</h1>
          <p className="text-muted-foreground mt-2 text-center max-w-2xl mx-auto">
            Tips, guides, and inspiration for smart shopping and lifestyle.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={cat === "All" ? "secondary" : "ghost"}
                size="sm"
                data-testid={`button-blog-category-${cat}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-visible hover-elevate group" data-testid={`card-blog-${post.id}`}>
              <div className="aspect-[3/2] overflow-hidden rounded-t-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-5 space-y-3">
                <Badge variant="secondary">{post.category}</Badge>
                <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
                <Button variant="ghost" className="gap-1 p-0 h-auto" data-testid={`button-read-more-${post.id}`}>
                  Read More <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" data-testid="button-load-more">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
}
