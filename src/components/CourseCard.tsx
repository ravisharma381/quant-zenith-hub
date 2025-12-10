import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const CourseCard = ({ course, isEnrolled }) => {
    const navigate = useNavigate();

    return (
        <div
            key={course.id}
            className="cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300 group flex flex-col md:flex-row"
            onClick={() => course.isComingSoon ? null : navigate(`/course/${course.slug}`)}
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
                    {!course.isComingSoon && <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium text-foreground">{course.rating}</span>
                        </div>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-muted-foreground">100+ chapters</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-muted-foreground">1200+ problems</span>
                    </div>}
                </div>

                {/* Bottom Section */}
                <div className="flex items-center mt-4 pt-4 border-t border-border">
                    {/* Start Learning Button */}
                    {course.isComingSoon ?
                        <Badge className="bg-muted text-muted-foreground border-border" variant="outline">
                            Coming Soon
                        </Badge>
                        : <Button
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    isEnrolled
                                        ? `/course/${course.id}/learn`
                                        : `/premium`,
                                )
                            }
                            }
                        >
                            {isEnrolled ? "Start Learning" : "Get Premium"}
                        </Button>}
                </div>
            </div>
        </div>
    )
}

export default CourseCard