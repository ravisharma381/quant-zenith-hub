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

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Latest Articles */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 6).map((post) => (
              <Card key={post.id} className="hover:shadow-card transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
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
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.publishDate)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-accent border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest insights and analysis delivered to your inbox weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" />
              <Button variant="premium" className="sm:w-auto">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blogs;