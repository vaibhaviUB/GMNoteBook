import { BookOpen, Brain, Mic, BarChart3, TrendingUp, Clock, Target, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const statCards = [
  { label: "Notes Created", value: "24", icon: BookOpen, change: "+3 this week", color: "text-blue-600" },
  { label: "Assessments Taken", value: "12", icon: Brain, change: "85% avg score", color: "text-emerald-600" },
  { label: "Mock Interviews", value: "6", icon: Mic, change: "2 scheduled", color: "text-purple-600" },
  { label: "Study Streak", value: "7 days", icon: Flame, change: "Personal best!", color: "text-orange-500" },
];

const quickActions = [
  { title: "Notes", description: "Create & organize your study notes", icon: BookOpen, to: "/dashboard/notes", gradient: "from-blue-500/10 to-blue-600/5" },
  { title: "Assessments", description: "Take adaptive quizzes", icon: Brain, to: "/dashboard/assessments", gradient: "from-emerald-500/10 to-emerald-600/5" },
  { title: "Mock Interviews", description: "Practice with AI interviewer", icon: Mic, to: "/dashboard/interviews", gradient: "from-purple-500/10 to-purple-600/5" },
  { title: "Progress", description: "View your analytics", icon: BarChart3, to: "/dashboard/progress", gradient: "from-orange-500/10 to-orange-600/5" },
];

const recentActivity = [
  { action: "Completed quiz", subject: "Data Structures - Chapter 5", time: "2 hours ago", icon: Brain },
  { action: "Created note", subject: "Algorithm Complexity Analysis", time: "5 hours ago", icon: BookOpen },
  { action: "Mock interview", subject: "Software Engineering - Behavioral", time: "1 day ago", icon: Mic },
  { action: "Completed quiz", subject: "Operating Systems - Memory", time: "2 days ago", icon: Brain },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome back! 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your study overview for today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Study Hours (15h goal)</span>
              <span className="font-medium text-foreground">10.5 / 15h</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quizzes Completed (5 goal)</span>
              <span className="font-medium text-foreground">3 / 5</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Notes Reviewed (10 goal)</span>
              <span className="font-medium text-foreground">8 / 10</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.to}>
              <Card className={`shadow-card hover:shadow-elevated transition-shadow cursor-pointer bg-gradient-to-br ${action.gradient}`}>
                <CardContent className="pt-6">
                  <action.icon className="h-8 w-8 text-foreground/70 mb-3" />
                  <h3 className="font-semibold text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground truncate">{activity.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
