import React from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();

  // For now, we'll show the first blog post content
  const blogPost = {
    id: 1,
    title: "The Future of Quantitative Finance: AI and Machine Learning",
    category: "Technology",
    author: "Dr. Sarah Chen",
    publishDate: "2024-01-15",
    content: `
Despite being one of the most secretive industries in the world, quantitative finance comes to light in the various conferences, competitions, and events held throughout the year. These events bring quants from all over the world to work together on challenging problems and disseminate learnings and knowledge to one another. Not only are such events great for learning, but they also pose special opportunities to network with industry leaders who can help you accelerate your career.

In this article, we cover a handful of the most prominent quant conferences, competitions, and events taking place in 2024. Attending any of these events will give you a significant edge in career opportunities that may otherwise be flooded with competition.

## AI and Machine Learning Applications

**4/8** - **Jane Street Electronic Trading Challenge** - a global trading competition in which you and your team will use your python skills to create a trading strategy to out-trade your competition on a virtual market. Winners will receive rewards from a $50,000 prize pool.

**TBD** - **Optiver Ready Trader Go** - a student coding competition that dives into the world of algorithmic trading. Build a trading algo in Optiver's simulated market exchange and have a chance to win large cash prizes.

**Now** - **Citadel Terminal AI Competition** - an AI programming game in which players code algorithms to compete head-to-head, tower-defense style. Winners get access to job opportunities with Citadel and large cash prizes.

**4/2** - **Citadel Datathon** - a global competition in which participants work in teams to solve a financial puzzle in a large complex dataset. Winners get fast-tracked to employment opportunities with Citadel.

## Machine Learning Conferences

**TBD** - **Cornell ML Finance Conference** - compete in your choice of an options, crypto, or equities trading challenge and get the opportunity to win up to $9,000 in cash prizes. The Cornell Trading Competition will be live in Fall 2024.

**TBD** - **MIT FinTech Conference** - an event held in NYC where students compete to build models from publicly available datasets from NYC's Open Data Project. Winner's get exclusive employment opportunities with major systematic strategies.

**8/28** - **Duke FinTech Trading Competition** - a 3-month long event in which student traders from around the world create paper trading accounts and compete in a bracket system for the #1 overall spot. Winners will get recognized by the event's sponsors, including the quantitative finance hedge fund called Schonfeld.

## Industry Applications

**4/13** - **University of Washington - AI Trading Challenge** - a competition in which teams code autonomous trading bots that face off in a strategic clash of algorithms and chance. Players compete for a chance to win from a $3,000 prize pool.

**1/30** - **MIT International Trading Competition** - an annual event that brings teams of students and their faculty advisors for a unique 3-day simulated market challenge. This event is sponsored by the Bank of Montreal (BMO).

**TBD** - **Goldman Sachs Algorithmic Trading Challenge** - go head to head against fellow traders in a cryptocurrency futures and options trading challenge. Top three traders at the end of the challenge will win cash prizes.

**4/12-13** - **University of Chicago Trading Competition** - a competition for undergraduate students in which they compete in simulated trading, connect with each other, and network with sponsor firms and employers. This is one of the oldest, and most-respected trading competitions in the U.S.
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
        <Badge variant="outline" className="mb-4 text-primary border-primary">
          {blogPost.category}
        </Badge>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          {blogPost.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Exploring how artificial intelligence is revolutionizing quantitative finance and what it means for the industry's future through conferences, competitions, and cutting-edge applications.
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            {blogPost.author}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(blogPost.publishDate)}
          </div>
          
          {/* Social Share Icons */}
          <div className="flex items-center gap-3 ml-auto">
            <Share2 className="w-4 h-4" />
            <Facebook className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
            <Linkedin className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
            <Mail className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {blogPost.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('##')) {
              return (
                <h2 key={index} className="text-2xl font-bold text-foreground mt-12 mb-6 border-b border-border pb-3">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            } else if (paragraph.includes('**') && paragraph.includes(' - ')) {
              // Format event listings
              const parts = paragraph.split(' - ');
              const datePart = parts[0];
              const titlePart = parts[1]?.split('**')[1] || '';
              const descriptionPart = parts[1]?.split('**')[2]?.replace(' - ', '') || '';
              
              return (
                <div key={index} className="mb-6 p-4 bg-card rounded-lg border border-border">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-primary font-semibold">{datePart.replace('**', '')}</span>
                    <span className="text-foreground font-bold">{titlePart}</span>
                  </div>
                  {descriptionPart && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {descriptionPart}
                    </p>
                  )}
                </div>
              );
            } else {
              return (
                <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;