import { Mic, Play, Calendar, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const interviewTypes = [
  { id: 1, title: "Technical - Data Structures", description: "Practice coding questions on arrays, trees, and graphs", duration: "30 min", difficulty: "Medium" },
  { id: 2, title: "Behavioral Interview", description: "Common behavioral questions using the STAR method", duration: "25 min", difficulty: "All levels" },
  { id: 3, title: "System Design", description: "Design scalable systems and discuss trade-offs", duration: "45 min", difficulty: "Advanced" },
];

const pastInterviews = [
  { id: 1, title: "Technical - Algorithms", date: "Apr 8, 2026", score: 4.2, feedback: "Strong problem-solving. Work on edge cases." },
  { id: 2, title: "Behavioral Interview", date: "Apr 5, 2026", score: 4.5, feedback: "Great STAR responses. Be more concise." },
  { id: 3, title: "Technical - OOP Concepts", date: "Apr 2, 2026", score: 3.8, feedback: "Good fundamentals. Practice design patterns more." },
];

const Interviews = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Mock Interviews</h1>
        <p className="text-muted-foreground mt-1">Practice with AI-powered mock interviews</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Start a New Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interviewTypes.map((type) => (
            <Card key={type.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                  <Mic className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground">{type.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex-1">{type.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />{type.duration}
                    <Badge variant="secondary" className="text-xs">{type.difficulty}</Badge>
                  </div>
                  <Button size="sm" className="gradient-gold text-secondary-foreground">
                    <Play className="h-3 w-3 mr-1" /> Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Past Interviews</h2>
        <div className="space-y-3">
          {pastInterviews.map((interview) => (
            <Card key={interview.id} className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{interview.title}</h3>
                    <p className="text-sm text-muted-foreground">{interview.date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-secondary">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{interview.score}</span>
                    <span className="text-muted-foreground text-sm">/5</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 ml-14">{interview.feedback}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interviews;
