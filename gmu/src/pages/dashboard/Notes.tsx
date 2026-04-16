import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Trash2, Edit3, Tag, X, Calendar, Hash, Eye, ArrowLeft, Copy, Share2, Loader2, UploadCloud, Upload } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Note {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  subject: string;
  date: string;
  updated_at: string;
  type?: "text" | "pdf";
  file_url?: string;
}

const SUGGESTED_TAGS = ["Important", "Review", "Exam", "Concept", "Formula"];

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note> | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [editorPages, setEditorPages] = useState([{ id: 1, name: "Tab 1 (Main)" }]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to view notes");
        return;
      }

      const userId = user.id; // Fixed userId assignment

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast.error("Error fetching notes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewNote = () => {
    setCurrentNote({
      title: "",
      subject: "",
      content: "",
      type: "text"
    });
    setEditorPages([{ id: 1, name: "Tab 1 (Main)" }]);
    setIsDialogOpen(true);
  };
  
  const addEditorPage = () => {
    const newId = Date.now();
    setEditorPages([...editorPages, { id: newId, name: `Tab ${editorPages.length + 1} (Page)` }]);
    toast.success(`New page added to document`);
  };

  const removeEditorPage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editorPages.length <= 1) {
      toast.error("Document must have at least one tab");
      return;
    }
    setEditorPages(editorPages.filter(p => p.id !== id));
    toast.info("Tab removed");
  };

  const handleEditNote = (note: Note, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentNote(note);
    setIsDialogOpen(true);
    setIsViewDialogOpen(false);
  };

  const handleViewNote = (note: Note) => {
    setViewingNote(note);
    setIsViewDialogOpen(true);
  };

  const handleDeleteNote = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter((note) => note.id !== id));
      toast.error("Note deleted successfully");
      if (viewingNote?.id === id) setIsViewDialogOpen(false);
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data) {
        toast.error("User not authenticated");
        return;
      }

      const { data, error } = await supabase.from("notes").insert({
        user_id: user.data.user?.id,
        title: noteData.title,
        subject: noteData.subject,
        content: noteData.content,
        type: noteData.type,
        created_at: new Date(),
        updated_at: new Date().toISOString()
      });

      if (error) {
        toast.error("Error saving note: " + error.message);
      } else {
        toast.success("Note saved successfully");
        fetchNotes(); // Refresh the notes list
      }
    } catch (err) {
      toast.error("Unexpected error: " + err.message);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      const fileUrl = URL.createObjectURL(file);
      const fileName = file.name.split(".")[0];
      
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        title: fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, " "),
        subject: "PDF Library",
        content: "[PDF Document Metadata Content]",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updated_at: new Date().toISOString(),
        type: "pdf",
        file_url: fileUrl
      };
      
      setNotes([newNote, ...notes]);
      toast.success(`Successfully uploaded PDF: "${file.name}"`);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const fileName = file.name.split(".")[0];
        
        const newNote: Note = {
          id: Math.random().toString(36).substr(2, 9),
          title: fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, " "),
          subject: "Study Note",
          content: content,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          updated_at: new Date().toISOString(),
          type: "text"
        };
        
        setNotes([newNote, ...notes]);
        toast.success(`Successfully imported "${file.name}"`);
      };
      reader.readAsText(file);
    }
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag) {
      console.log("Tags feature removed");
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentNote({
      ...currentNote,
      tags: currentNote?.tags?.filter(t => t !== tagToRemove) || []
    });
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const cleanQuery = query.startsWith("search:") ? query.split(":")[1].trim() : query;
    
    return (
      note.title.toLowerCase().includes(cleanQuery) ||
      note.content.toLowerCase().includes(cleanQuery) ||
      note.subject.toLowerCase().includes(cleanQuery)
    );
  });

  return (
    <div>
      <h1>Notes Page</h1>
      <p>This is a placeholder for the Notes page.</p>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-secondary-foreground border-primary/20 bg-primary/5 px-3 py-0.5 rounded-full uppercase tracking-tighter font-bold">
              Note Repository
            </Badge>
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
              Smart <span className="text-primary">Notebook</span>
            </h1>
            <p className="text-muted-foreground text-lg">Create, organize, and view your study notes.</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              id="note-upload"
              type="file"
              accept=".txt,.md,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button 
              variant="outline"
              onClick={() => document.getElementById('note-upload')?.click()}
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/5 h-12 px-6 rounded-xl transition-all gap-2"
            >
              <Upload className="h-5 w-5" /> Upload Notes
            </Button>
            <Button 
              onClick={handleNewNote} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 h-12 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2"
            >
              <Plus className="h-5 w-5" /> Create Note
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder="Search by topic or subject (e.g. 'Search: DBMS')..."
            className="pl-12 h-14 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-lg shadow-sm backdrop-blur-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleViewNote(note)}
                className="cursor-pointer"
              >
                  <Card className="group h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card/30 backdrop-blur-md">
                    <CardHeader className="pb-3 pt-6 px-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-primary">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest">{note.subject}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full hover:bg-blue-500/10 hover:text-blue-500"
                            onClick={(e) => handleEditNote(note, e)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => handleDeleteNote(note.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold mt-3 leading-tight group-hover:text-primary transition-colors">
                        {note.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-4 flex-grow">
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {note.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 py-4 border-t border-border/10 bg-muted/20 mt-auto flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                        <Calendar className="h-3.3 w-3.5" />
                        {note.date}
                      </div>
                      <div className="p-1 px-2 rounded bg-primary/5 text-[10px] text-primary/70 font-semibold flex items-center gap-1">
                        <Eye className="h-3 w-3" /> View
                      </div>
                    </CardFooter>
                  </Card>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
                <div className="inline-block p-6 rounded-full bg-muted/30 mb-2">
                  <Search className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No notes found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  {searchQuery ? `We couldn't find anything matching "${searchQuery}"` : "Start by creating your first study note!"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleNewNote} variant="outline" className="mt-4">
                    Create First Note
                  </Button>
                )}
            </div>
          )}
        </div>

        {/* View Note Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="w-screen h-screen max-w-none m-0 p-0 flex flex-col overflow-hidden bg-white dark:bg-slate-950 border-none rounded-none shadow-none z-[100]">
            {/* Enhanced Fullscreen Header */}
            <div className="px-6 py-4 border-b bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsViewDialogOpen(false)}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Notes
                </Button>
                <div className="h-6 w-px bg-border hidden md:block" />
                <div className="flex flex-col">
                  <DialogTitle className="text-xl font-display font-bold truncate max-w-[300px] md:max-w-md">
                    {viewingNote?.title}
                  </DialogTitle>
                </div>
              </div>

            </div>

            <div className="flex-1 overflow-hidden relative">
              {viewingNote?.type === "pdf" || viewingNote?.content?.startsWith("%PDF") ? (
                viewingNote.file_url ? (
                  <iframe
                    src={viewingNote.file_url}
                    className="w-full h-full border-none"
                    title={viewingNote.title}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 px-10 text-center">
                    <div className="p-6 rounded-full bg-primary/10">
                      <BookOpen className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">PDF Refresh Required</h3>
                    <p className="text-muted-foreground max-w-md">
                      To keep the application fast, PDF files are held in temporary memory. 
                      Please re-upload your PDF to view it again in full-screen.
                    </p>
                    <Button 
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        document.getElementById('note-upload')?.click();
                      }}
                      className="mt-4"
                    >
                      Re-upload Document
                    </Button>
                  </div>
                )
              ) : (
                <ScrollArea className="h-full px-6 md:px-10 py-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-xl font-sans">
                      {viewingNote?.content}
                    </div>
                  </div>
                </ScrollArea>
              )}
            </div>

            {viewingNote?.type !== "pdf" && !viewingNote?.content?.startsWith("%PDF") && (
              <div className="px-8 py-4 bg-muted/30 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center mt-auto">
                <div className="flex flex-wrap gap-2">
                  {(viewingNote as any)?.tags?.map((tag: string) => (
                    <Badge key={tag} className="bg-muted hover:bg-muted text-muted-foreground border-none">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="destructive" 
                    className="flex-1 sm:flex-none gap-2"
                    onClick={() => viewingNote && handleDeleteNote(viewingNote.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                  <Button 
                    className="flex-1 sm:flex-none gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => viewingNote && handleEditNote(viewingNote)}
                  >
                    <Edit3 className="h-4 w-4" /> Edit Note
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Full-Screen Google Docs Style Editor */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-screen h-screen max-w-none m-0 p-0 flex flex-col bg-[#f8f9fa] dark:bg-slate-950 border-none rounded-none z-[150] [&>button]:hidden">
            {/* Top Navbar / Toolbar Area */}
            <div className="bg-white dark:bg-slate-900 border-b px-4 py-2 flex flex-col gap-1 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <Input
                      className="h-9 text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 w-[400px]"
                      placeholder="Untitled Note"
                      value={currentNote?.title || ""}
                      onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="rounded-full px-6 gap-2 border-primary/20 text-primary">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsDialogOpen(false);
                      document.getElementById('note-upload')?.click();
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-md"
                  >
                    Save Note
                  </Button>
                  <div className="w-4" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-full hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Google Docs Toolbar Simulator */}
              <div className="flex items-center gap-1 mt-1 py-1 px-2 bg-primary/5 rounded-lg border border-primary/10 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4"/></Button>
                </div>
                <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
                  <span className="text-[10px] font-bold px-2 text-muted-foreground w-16 truncate">Normal text</span>
                  <div className="h-4 w-px bg-border mx-1" />
                  <span className="text-[10px] font-bold px-2 text-muted-foreground">Arial</span>
                </div>
                <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 font-bold">B</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 italic">I</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 underline">U</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">A</Button>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Tag className="h-4 w-4"/></Button>
                  <Input 
                    placeholder="Subject..." 
                    className="h-8 w-32 bg-white/50 border-none text-xs"
                    value={currentNote?.subject || ""}
                    onChange={(e) => setCurrentNote({ ...currentNote, subject: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Main Editor Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - Tab Navigation */}
              <div className="w-[300px] bg-white dark:bg-slate-900 border-r flex flex-col py-6 px-4 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Document Tabs</h3>
                    <Plus className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" onClick={addEditorPage} />
                  </div>
                  <div className="space-y-1">
                    {editorPages.map((page, index) => (
                      <div 
                        key={page.id} 
                        className={`group flex items-center justify-between px-4 py-3 rounded-xl font-medium cursor-pointer transition-all border ${index === 0 ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-muted text-muted-foreground border-transparent'}`}
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4" /> {page.name}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                          onClick={(e) => removeEditorPage(page.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <div 
                      onClick={addEditorPage}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-muted-foreground rounded-xl font-medium cursor-pointer transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add Page
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                   <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <p className="text-xs font-bold text-primary uppercase mb-1">AI Assistant</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">I can help you summarize this document or find related research papers.</p>
                 </div>
              </div>
            </div>

            {/* Central Editor Page */}
            <ScrollArea className="flex-1 bg-[#f8f9fa] dark:bg-slate-950/50">
              <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white dark:bg-slate-900 shadow-2xl min-h-[1056px] w-full p-[80px] rounded-sm ring-1 ring-border shadow-black/5 flex flex-col gap-8">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentNote?.tags?.map((tag) => (
                        <Badge key={tag} className="gap-1 bg-muted hover:bg-muted group text-muted-foreground border-none">
                          #{tag}
                          <button onClick={() => removeTag(tag)} className="opacity-0 group-hover:opacity-100"><X className="h-3 w-3"/></button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Feature removed" 
                        className="h-8 w-32 text-xs border-dashed"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTag(tagInput)}
                      />
                      <div className="flex gap-1">
                        {SUGGESTED_TAGS.slice(0, 3).map(tag => (
                          <button key={tag} onClick={() => addTag(tag)} className="text-[9px] text-muted-foreground hover:text-primary">+{tag}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />

                  <Textarea
                    className="flex-1 text-lg leading-relaxed bg-transparent border-none focus-visible:ring-0 p-0 resize-none font-serif min-h-[800px]"
                    placeholder="Enter your content here..."
                    value={currentNote?.content || ""}
                    onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  />
                </div>
              </div>
            </ScrollArea>
            </div> {/* closes flex-1 flex overflow-hidden */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Notes;


