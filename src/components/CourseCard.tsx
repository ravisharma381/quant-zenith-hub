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
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300 hover:scale-105 cursor-pointer group"
            onClick={() => navigate(`/course/${course.slug}`)}
        >
            {/* Gradient Header with Instructor Photo */}
            <div className="h-52 relative flex items-center justify-center overflow-hidden rounded-2xl">
                <img
                    src={course.thumbnailURL}
                    alt={course.title}
                    className="h-full w-full"
                />
            </div>


            {/* Content */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{course.author}</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {course.description}
                </p>

                {/* Rating and Stats */}
                <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium text-foreground">{course.rating}</span>
                    </div>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">{course.noOfRatings}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">{course.courseDuration}</span>
                </div>

                {/* Level Badge */}
                <div className="flex items-center justify-between">
                    <Badge className={getLevelColor(course.level)} variant="outline">
                        {course.level}
                    </Badge>
                    <span className="text-lg font-bold text-primary">{`${course.currencySymbol} ${course.price.yearly}`}</span>
                </div>

                {/* Enroll Button */}
                <Button
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                            isEnrolled
                                ? `/course/${course.slug}/learn`
                                : `/course/${course.slug}/checkout`,
                        )
                    }
                    }
                >
                    {isEnrolled ? "Continue Learning" : "Enroll Now"}
                </Button>
            </div>
        </div>
    )
}

export default CourseCard