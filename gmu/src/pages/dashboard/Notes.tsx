import { useState, useEffect, useRef } from "react";
import {
  BookOpen, Plus, Search, Trash2, Upload, X,
  FileText, File, Calendar, Loader2, FolderOpen,
  ExternalLink, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Note {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
}

type ModalMode = "create" | "upload" | null;

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fileIcon(fileType: string | null) {
  if (!fileType) return <FileText className="h-4 w-4" />;
  if (fileType.includes("pdf")) return <File className="h-4 w-4 text-red-500" />;
  return <FileText className="h-4 w-4 text-blue-500" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  // Modal form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Auth helper ─────────────────────────────────────────────────
  async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) { toast.error("Please log in to access Notes."); return null; }
    return user;
  }

  // ── Fetch ────────────────────────────────────────────────────────
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data ?? []);
    } catch (err: any) {
      toast.error("Failed to load notes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  // ── Open modals ──────────────────────────────────────────────────
  const openModal = (mode: ModalMode) => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setModalMode(mode);
  };

  const closeModal = () => setModalMode(null);

  // ── File selection ───────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  // ── Save note ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim()) { toast.error("Please enter a title."); return; }

    setSaving(true);
    try {
      const user = await getCurrentUser();
      if (!user) return;

      let file_url: string | null = null;
      let file_type: string | null = null;

      // Upload file if present
      if (modalMode === "upload" && selectedFile) {
        const ext = selectedFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("notes")
          .upload(path, selectedFile, { upsert: false });

        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from("notes")
          .getPublicUrl(path);

        file_url = urlData.publicUrl;
        file_type = selectedFile.type || ext || null;
      }

      // Insert record
      const { error: insertErr } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          file_url,
          file_type,
          created_at: new Date().toISOString(),
        });

      if (insertErr) throw insertErr;

      toast.success(
        modalMode === "upload"
          ? "Note uploaded successfully!"
          : "Note created successfully!"
      );
      closeModal();
      fetchNotes();
    } catch (err: any) {
      toast.error("Error saving note: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (note: Note) => {
    if (!confirm(`Delete "${note.title}"? This cannot be undone.`)) return;
    try {
      if (note.file_url) {
        // Extract storage path from URL and delete from bucket
        const url = new URL(note.file_url);
        const pathSegments = url.pathname.split("/notes/");
        if (pathSegments[1]) {
          await supabase.storage.from("notes").remove([pathSegments[1]]);
        }
      }

      const { error } = await supabase.from("notes").delete().eq("id", note.id);
      if (error) throw error;

      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      toast.success("Note deleted.");
    } catch (err: any) {
      toast.error("Delete failed: " + err.message);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────
  const filtered = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      (n.description ?? "").toLowerCase().includes(q)
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <Badge
            variant="outline"
            className="text-[#c08d4c] border-[#c08d4c]/30 bg-[#c08d4c]/5 px-3 py-0.5 rounded-full uppercase tracking-tighter font-bold text-[10px]"
          >
            Note Repository
          </Badge>
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
            Smart <span className="text-[#c08d4c]">Notebook</span>
          </h1>
          <p className="text-muted-foreground text-base">
            Create, upload, and search your study notes — all in one place.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => openModal("upload")}
            className="border-[#c08d4c]/30 text-[#c08d4c] hover:bg-[#c08d4c]/10 hover:border-[#c08d4c]/60 h-11 px-5 rounded-xl gap-2 transition-all"
          >
            <Upload className="h-4 w-4" />
            Upload Notes
          </Button>
          <Button
            onClick={() => openModal("create")}
            className="bg-gradient-to-r from-[#6b1016] to-[#4a0e0e] hover:from-[#4a0e0e] hover:to-[#2d090a] text-white h-11 px-5 rounded-xl gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Note
          </Button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-[#c08d4c] transition-colors" />
        </div>
        <Input
          placeholder="Search by title or description..."
          className="pl-12 h-13 border-border/50 focus:border-[#c08d4c]/50 focus:ring-[#c08d4c]/20 rounded-2xl text-base shadow-sm transition-all bg-background"
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

      {/* ── Notes Grid ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-10 w-10 text-[#c08d4c] animate-spin" />
          <p className="text-muted-foreground font-medium">Loading your notes…</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          query={searchQuery}
          onCreateClick={() => openModal("create")}
        />
      )}

      {/* ── Modal ── */}
      {modalMode && (
        <NoteModal
          mode={modalMode}
          title={title}
          description={description}
          selectedFile={selectedFile}
          dragOver={dragOver}
          saving={saving}
          fileInputRef={fileInputRef}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onFileChange={handleFileChange}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClearFile={() => setSelectedFile(null)}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Note Card ──────────────────────────────────────────────────────────────────
function NoteCard({ note, onDelete }: { note: Note; onDelete: (n: Note) => void }) {
  return (
    <Card className="group flex flex-col overflow-hidden border border-border/50 hover:border-[#c08d4c]/30 hover:shadow-xl hover:shadow-[#c08d4c]/5 transition-all duration-300 bg-card/60 backdrop-blur-md rounded-2xl">
      <CardHeader className="pb-2 pt-5 px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-lg bg-[#c08d4c]/10 shrink-0">
              <BookOpen className="h-4 w-4 text-[#c08d4c]" />
            </div>
            <h3 className="font-bold text-foreground text-base leading-tight truncate group-hover:text-[#c08d4c] transition-colors">
              {note.title}
            </h3>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note); }}
            className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-3 flex-grow">
        {note.description ? (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {note.description}
          </p>
        ) : (
          <p className="text-muted-foreground/40 text-sm italic">No description</p>
        )}

        {note.file_url && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#c08d4c]/8 border border-[#c08d4c]/20 text-[#c08d4c] text-xs font-semibold">
              {fileIcon(note.file_type)}
              <span className="capitalize">
                {note.file_type?.split("/").pop()?.toUpperCase() ?? "File"}
              </span>
            </div>
            <a
              href={note.file_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-[#c08d4c]/10 text-muted-foreground hover:text-[#c08d4c] transition-colors"
              title="Open file"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 py-3 border-t border-border/20 bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(note.created_at)}
        </div>
        {note.file_url ? (
          <Badge className="text-[10px] bg-green-500/10 text-green-700 border-green-500/20 border rounded-full px-2 py-0.5 font-semibold">
            Has File
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[10px] rounded-full px-2 py-0.5 font-semibold text-muted-foreground border-border/40">
            Text Only
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ query, onCreateClick }: { query: string; onCreateClick: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28 space-y-5">
      <div className="p-6 rounded-full bg-[#c08d4c]/8 border border-[#c08d4c]/15">
        <FolderOpen className="h-14 w-14 text-[#c08d4c]/50" />
      </div>
      <div className="text-center space-y-1.5">
        <h3 className="text-xl font-semibold text-foreground">No notes found</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          {query
            ? `No results for "${query}". Try a different search term.`
            : "You haven't created any notes yet. Start by creating your first note!"}
        </p>
      </div>
      {!query && (
        <Button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-[#6b1016] to-[#4a0e0e] hover:opacity-90 text-white rounded-xl px-8 h-11 gap-2 shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          Create First Note
        </Button>
      )}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  mode: "create" | "upload";
  title: string;
  description: string;
  selectedFile: File | null;
  dragOver: boolean;
  saving: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClearFile: () => void;
  onSave: () => void;
  onClose: () => void;
}

function NoteModal({
  mode, title, description, selectedFile, dragOver, saving,
  fileInputRef, onTitleChange, onDescriptionChange, onFileChange,
  onDragOver, onDragLeave, onDrop, onClearFile, onSave, onClose,
}: ModalProps) {
  const isUpload = mode === "upload";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-border/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border/30 bg-gradient-to-r from-[#c08d4c]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#c08d4c]/10">
              {isUpload ? (
                <Upload className="h-5 w-5 text-[#c08d4c]" />
              ) : (
                <Plus className="h-5 w-5 text-[#c08d4c]" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {isUpload ? "Upload Note" : "Create Note"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isUpload
                  ? "Upload a PDF or file with a title"
                  : "Write a note with title and description"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-5">

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={isUpload ? "e.g., DBMS Unit 3 Notes" : "e.g., Linked List Summary"}
              className="h-11 rounded-xl border-border/60 focus:border-[#c08d4c]/50 focus:ring-[#c08d4c]/20 text-sm"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Brief description of what this note covers..."
              className="min-h-[90px] resize-none rounded-xl border-border/60 focus:border-[#c08d4c]/50 focus:ring-[#c08d4c]/20 text-sm"
            />
          </div>

          {/* File upload zone — only for upload mode */}
          {isUpload && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                File (PDF, TXT, DOCX…)
              </label>
              {selectedFile ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#c08d4c]/30 bg-[#c08d4c]/5">
                  {fileIcon(selectedFile.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={onClearFile}
                    className="p-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    dragOver
                      ? "border-[#c08d4c] bg-[#c08d4c]/10"
                      : "border-border/50 hover:border-[#c08d4c]/50 hover:bg-[#c08d4c]/5"
                  }`}
                >
                  <Upload className={`h-7 w-7 ${dragOver ? "text-[#c08d4c]" : "text-muted-foreground/50"}`} />
                  <p className="text-sm text-muted-foreground text-center">
                    <span className="text-[#c08d4c] font-semibold">Click to browse</span> or drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground/60">PDF, TXT, DOCX, images…</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          )}

          {/* Info banner for upload with missing file */}
          {isUpload && !selectedFile && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200/70">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                You can save without a file — the note will be stored as text-only.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-border/30 bg-muted/20">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl px-6 text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving || !title.trim()}
            className="bg-gradient-to-r from-[#6b1016] to-[#4a0e0e] hover:from-[#4a0e0e] hover:to-[#2d090a] text-white rounded-xl px-8 h-11 gap-2 shadow-md transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isUpload ? "Uploading…" : "Saving…"}
              </>
            ) : (
              <>
                {isUpload ? <Upload className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isUpload ? "Upload Note" : "Save Note"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Notes;
