import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import blogAiMl from "@/assets/blog-ai-ml.png";
import blogVolatility from "@/assets/blog-volatility.png";
import blogBacktesting from "@/assets/blog-backtesting.png";

const BlogImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative h-48 w-full">
      {!loaded && <Skeleton className="absolute inset-0 rounded-t-lg" />}
      <img 
        src={src} 
        alt={alt} 
        className={`h-48 w-full object-cover rounded-t-lg transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Quantitative Finance: AI and Machine Learning",
      excerpt: "Exploring how artificial intelligence is revolutionizing quantitative finance and what it means for the industry's future.",
      category: "Technology",
      publishDate: "2024-01-15",
      readTime: "8 min read",
      featured: true,
      tags: ["AI", "Machine Learning", "Future"],
      image: blogAiMl
    },
    {
      id: 2,
      title: "Understanding Volatility Clustering in Financial Markets",
      excerpt: "A deep dive into the phenomenon of volatility clustering and its implications for risk management strategies.",
      category: "Risk Management",
      publishDate: "2024-01-12",
      readTime: "12 min read",
      featured: false,
      tags: ["Volatility", "Risk", "Markets"],
      image: blogVolatility
    },
    {
      id: 3,
      title: "Building Robust Backtesting Frameworks",
      excerpt: "Best practices for creating reliable backtesting systems that avoid common pitfalls and biases.",
      category: "Algorithmic Trading",
      publishDate: "2024-01-10",
      readTime: "15 min read",
      featured: true,
      tags: ["Backtesting", "Trading", "Strategy"],
      image: blogBacktesting
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* All Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card 
              key={post.id} 
              className="bg-card hover:shadow-card transition-all duration-300 hover:scale-105 border-border cursor-pointer flex flex-col h-full"
              onClick={() => {
                if (post.id === 1) {
                  window.location.href = '/blogs/first';
                }
              }}
            >
              <BlogImage src={post.image} alt={post.title} />
              <CardHeader>
                <Badge variant="outline" className="text-xs w-fit mb-2">
                  {post.category}
                </Badge>
                <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(post.publishDate)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <div className="mt-auto">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (post.id === 1) {
                        window.location.href = '/blogs/first';
                      }
                    }}
                  >
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;