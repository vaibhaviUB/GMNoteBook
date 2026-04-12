import { BarChart3, TrendingUp, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const subjectProgress = [
  { subject: "Data Structures", progress: 85, quizzes: 8, avgScore: 88 },
  { subject: "Algorithms", progress: 72, quizzes: 6, avgScore: 82 },
  { subject: "Operating Systems", progress: 60, quizzes: 4, avgScore: 76 },
  { subject: "Database Systems", progress: 90, quizzes: 10, avgScore: 91 },
  { subject: "Networking", progress: 45, quizzes: 3, avgScore: 70 },
];

const weeklyData = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 2 },
  { day: "Wed", hours: 4 },
  { day: "Thu", hours: 1.5 },
  { day: "Fri", hours: 3 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 2.5 },
];

const maxHours = Math.max(...weeklyData.map((d) => d.hours));

const ProgressPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Progress & Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your study performance over time</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">84%</p>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">31</p>
            <p className="text-sm text-muted-foreground">Quizzes Completed</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">21.5h</p>
            <p className="text-sm text-muted-foreground">Study Time This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly study chart (simple bar chart) */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Study Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-foreground">{d.hours}h</span>
                <div
                  className="w-full rounded-t-md gradient-gold transition-all"
                  style={{ height: `${(d.hours / maxHours) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Subject Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {subjectProgress.map((sub) => (
            <div key={sub.subject} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{sub.subject}</span>
                <span className="text-muted-foreground">{sub.quizzes} quizzes · {sub.avgScore}% avg</span>
              </div>
              <Progress value={sub.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressPage;
