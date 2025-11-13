import React from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const BlogDetail = () => {
  const { slug } = useParams();

  // For now, we'll show the first blog post content
  const blogPost = {
    id: 1,
    title: "The Future of Quantitative Finance: AI and Machine Learning",
    category: "Technology",
    publishDate: "2024-01-15",
    content: `
Despite being one of the most secretive industries in the world, quantitative finance comes to light in the various conferences, competitions, and events held throughout the year. These events bring quants from all over the world to work together on challenging problems and disseminate learnings and knowledge to one another. Not only are such events great for learning, but they also pose special opportunities to network with industry leaders who can help you accelerate your career.

In this article, we cover a handful of the most prominent quant conferences, competitions, and events taking place in 2024. Attending any of these events will give you a significant edge in career opportunities that may otherwise be flooded with competition.
    `
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Category Badge */}
        <Badge variant="outline" className="mb-4 text-primary border-primary border-2">
          {blogPost.category}
        </Badge>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {blogPost.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Exploring how artificial intelligence is revolutionizing quantitative finance and what it means for the industry's future through conferences, competitions, and cutting-edge applications.
        </p>

        {/* Meta Information */}
        <div className="border-t-2 border-b-2 border-border py-4 mb-8">
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(blogPost.publishDate)}
            </div>
            
            {/* Social Share Icons */}
            <div className="flex items-center gap-3 ml-auto">
              <Share2 className="w-6 h-6" />
              <Facebook className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
              <Mail className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {/* First instance of content */}
          {blogPost.content.split('\n\n').map((paragraph, index) => (
            <p key={`first-${index}`} className="text-white text-lg leading-relaxed mb-6">
              {paragraph.trim()}
            </p>
          ))}
          
          {/* Second instance of content */}
          {blogPost.content.split('\n\n').map((paragraph, index) => (
            <p key={`second-${index}`} className="text-white text-lg leading-relaxed mb-6">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;