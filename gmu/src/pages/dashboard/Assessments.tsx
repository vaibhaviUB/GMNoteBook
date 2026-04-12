import { Brain, Play, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const assessments = [
  { id: 1, title: "Data Structures Final Review", questions: 30, difficulty: "Adaptive", status: "available", bestScore: null, time: "45 min" },
  { id: 2, title: "Algorithm Analysis Quiz", questions: 15, difficulty: "Intermediate", status: "completed", bestScore: 92, time: "20 min" },
  { id: 3, title: "Operating Systems - Midterm Prep", questions: 25, difficulty: "Adaptive", status: "available", bestScore: null, time: "35 min" },
  { id: 4, title: "Database Systems Quiz 3", questions: 10, difficulty: "Beginner", status: "completed", bestScore: 88, time: "15 min" },
  { id: 5, title: "Networking Fundamentals", questions: 20, difficulty: "Adaptive", status: "in-progress", bestScore: null, time: "30 min" },
];

const Assessments = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Assessments</h1>
        <p className="text-muted-foreground mt-1">Take adaptive quizzes that adjust to your level</p>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Brain className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{assessment.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{assessment.questions} questions</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{assessment.time}</span>
                    <span>·</span>
                    <Badge variant="secondary" className="text-xs">{assessment.difficulty}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {assessment.status === "completed" && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{assessment.bestScore}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Best score</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant={assessment.status === "completed" ? "outline" : "default"}
                    className={assessment.status === "completed" ? "" : "gradient-gold text-secondary-foreground"}
                  >
                    {assessment.status === "completed" ? "Retry" : assessment.status === "in-progress" ? "Continue" : "Start"}
                    <Play className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assessments;
