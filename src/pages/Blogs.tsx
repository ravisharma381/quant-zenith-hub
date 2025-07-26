import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, User, TrendingUp, Bookmark } from "lucide-react";

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Quantitative Finance: AI and Machine Learning",
      excerpt: "Exploring how artificial intelligence is revolutionizing quantitative finance and what it means for the industry's future.",
      category: "Technology",
      author: "Dr. Sarah Chen",
      publishDate: "2024-01-15",
      readTime: "8 min read",
      featured: true,
      tags: ["AI", "Machine Learning", "Future"]
    },
    {
      id: 2,
      title: "Understanding Volatility Clustering in Financial Markets",
      excerpt: "A deep dive into the phenomenon of volatility clustering and its implications for risk management strategies.",
      category: "Risk Management",
      author: "Prof. Michael Rodriguez",
      publishDate: "2024-01-12",
      readTime: "12 min read",
      featured: false,
      tags: ["Volatility", "Risk", "Markets"]
    },
    {
      id: 3,
      title: "Building Robust Backtesting Frameworks",
      excerpt: "Best practices for creating reliable backtesting systems that avoid common pitfalls and biases.",
      category: "Algorithmic Trading",
      author: "Emma Thompson",
      publishDate: "2024-01-10",
      readTime: "15 min read",
      featured: true,
      tags: ["Backtesting", "Trading", "Strategy"]
    },
    {
      id: 4,
      title: "ESG Integration in Quantitative Investment Strategies",
      excerpt: "How environmental, social, and governance factors are being incorporated into systematic investment approaches.",
      category: "Investment",
      author: "Dr. James Liu",
      publishDate: "2024-01-08",
      readTime: "10 min read",
      featured: false,
      tags: ["ESG", "Investment", "Strategy"]
    },
    {
      id: 5,
      title: "Cryptocurrency Market Microstructure Analysis",
      excerpt: "Examining the unique characteristics of crypto markets and their implications for quantitative strategies.",
      category: "Cryptocurrency",
      author: "Dr. Anna Petrov",
      publishDate: "2024-01-05",
      readTime: "11 min read",
      featured: false,
      tags: ["Crypto", "Microstructure", "Analysis"]
    },
    {
      id: 6,
      title: "Advanced Portfolio Optimization Techniques",
      excerpt: "Moving beyond mean-variance optimization to explore robust and alternative portfolio construction methods.",
      category: "Portfolio Management",
      author: "Dr. Robert Kim",
      publishDate: "2024-01-03",
      readTime: "14 min read",
      featured: false,
      tags: ["Portfolio", "Optimization", "Advanced"]
    }
  ];

  const categories = ["All", "Technology", "Risk Management", "Algorithmic Trading", "Investment", "Cryptocurrency", "Portfolio Management"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            An all-in-one quant blog teaching quantitative finance concepts, featuring quant interview guides, and detailing the latest industry news.
          </p>
        </div>

        {/* All Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-card hover:shadow-card transition-all duration-300 hover:scale-105 border-border">
              <div className="aspect-video bg-gradient-to-br from-muted to-background rounded-t-lg"></div>
              <CardHeader>
                <Badge variant="outline" className="text-xs w-fit mb-2">
                  {post.category}
                </Badge>
                <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;