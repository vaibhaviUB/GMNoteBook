import { BookOpen, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const notes = [
  { id: 1, title: "Data Structures - Trees & Graphs", subject: "Computer Science", date: "Apr 10, 2026", preview: "Binary trees, AVL trees, graph traversal algorithms..." },
  { id: 2, title: "Algorithm Complexity Analysis", subject: "Computer Science", date: "Apr 9, 2026", preview: "Big-O notation, space vs time complexity trade-offs..." },
  { id: 3, title: "Operating Systems - Memory Management", subject: "Computer Science", date: "Apr 8, 2026", preview: "Virtual memory, paging, segmentation, TLB..." },
  { id: 4, title: "Database Normalization", subject: "Database Systems", date: "Apr 7, 2026", preview: "1NF, 2NF, 3NF, BCNF, denormalization strategies..." },
  { id: 5, title: "Software Design Patterns", subject: "Software Engineering", date: "Apr 6, 2026", preview: "Singleton, Observer, Factory, Strategy patterns..." },
  { id: 6, title: "Network Protocols - TCP/IP", subject: "Networking", date: "Apr 5, 2026", preview: "OSI model, TCP handshake, UDP, routing protocols..." },
];

const Notes = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-1">Create and organize your study notes</p>
        </div>
        <Button className="gradient-gold text-secondary-foreground gap-2">
          <Plus className="h-4 w-4" /> New Note
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search notes..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground">{note.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{note.subject} · {note.date}</p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{note.preview}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notes;
