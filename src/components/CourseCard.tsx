import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const CourseCard = ({ course, isEnrolled }) => {
    const navigate = useNavigate();
    const getLevelColor = (level: string) => {
        switch (level) {
            case "Beginner": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div
            key={course.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300 group flex flex-col md:flex-row"
            onClick={() => navigate(`/course/${course.id}`)}
        >
            {/* Gradient Header with Instructor Photo */}
            {/* <div className={`w-full md:w-64 h-52 md:h-auto bg-gradient-to-br ${course.gradient} relative flex items-center justify-center flex-shrink-0`}>
                <img
                    src={course.thumbnailURL}
                    alt={course.title}
                    className="w-full h-full object-fill"
                />
            </div> */}
            <div className={`w-full md:w-64 h-52 md:h-auto bg-gradient-to-br ${course.gradient} relative flex items-center justify-center flex-shrink-0`}>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                            {course.author.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">
                        {course.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {course.description}
                    </p>

                    {/* Rating and Stats */}
                    <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium text-foreground">{course.rating}</span>
                        </div>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-muted-foreground">100+ chapters</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-muted-foreground">1200+ problems</span>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center mt-4 pt-4 border-t border-border">
                    {/* Start Learning Button */}
                    <Button
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                                isEnrolled
                                    ? `/course/${course.id}/learn`
                                    : `/course/${course.slug}/checkout`,
                            )
                        }
                        }
                    >
                        {isEnrolled ? "Start Learning" : "Enroll Now"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CourseCard