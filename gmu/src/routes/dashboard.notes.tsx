import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { BookOpen, Plus, Search, Trash2, Edit3, Folder, Upload, FilePlus2 } from "lucide-react";
import { DashboardLayout, PageHeader } from "@/components/DashboardLayout";
import { useNotesStore, SUBJECTS, type Note } from "@/lib/notesStore";

export const Route = createFileRoute("/dashboard/notes")({
  component: Notes,
});

function Notes() {
  const { notes, remove, add } = useNotesStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("All");
  const [showOptions, setShowOptions] = useState(false);

  const filtered = notes.filter((n) => {
    const text = (n.title + " " + n.subject + " " + n.html).toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (subjectFilter !== "All" && n.subject !== subjectFilter) return false;
    return true;
  });

  const groupedBySubject = useMemo(() => {
    const map: Record<string, Note[]> = {};
    filtered.forEach((n) => {
      (map[n.subject] ??= []).push(n);
    });
    return map;
  }, [filtered]);

  const createNew = () => {
    const id = crypto.randomUUID();
    add({
      id, title: "", subject: SUBJECTS[0], tags: [], html: "",
      date: today(), updated: today(),
    });
    setShowOptions(false);
    navigate({ to: "/dashboard/notes/$noteId", params: { noteId: id } });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const id = crypto.randomUUID();
      const ext = file.name.split(".").pop()?.toLowerCase();
      let html = "";
      if (ext === "txt" || ext === "md") {
        const text = await file.text();
        html = text.split("\n").map((l) => `<p>${escapeHtml(l) || "<br/>"}</p>`).join("");
      } else if (ext === "html" || ext === "htm") {
        html = await file.text();
      } else {
        // Store as embedded reference for binary docs (pdf, docx)
        const url = URL.createObjectURL(file);
        html = `<p><b>Uploaded file:</b> ${escapeHtml(file.name)}</p><p><a href="${url}" target="_blank">Open original document</a></p><p><em>Add your notes about this document below…</em></p>`;
      }
      add({
        id,
        title: file.name.replace(/\.[^.]+$/, ""),
        subject: SUBJECTS[0],
        tags: [],
        html,
        date: today(),
        updated: today(),
      });
    }
    setShowOptions(false);
    e.target.value = "";
  };

  return (
    <DashboardLayout>
      <PageHeader
        tag="Smart Notebook"
        title="Your"
        accent="Notes"
        subtitle="Create new notes in a Google Docs-style editor or upload existing files."
        action={
          <div className="relative">
            <button onClick={() => setShowOptions((s) => !s)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:brightness-110">
              <Plus className="h-4 w-4" /> Add Note
            </button>
            {showOptions && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
                <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                  <button onClick={createNew} className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-soft">
                    <FilePlus2 className="mt-0.5 h-5 w-5 text-gold" />
                    <div>
                      <div className="font-semibold">Create New Note</div>
                      <div className="text-xs text-muted-foreground">Open the document editor</div>
                    </div>
                  </button>
                  <div className="border-t border-border" />
                  <button onClick={() => fileRef.current?.click()} className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-soft">
                    <Upload className="mt-0.5 h-5 w-5 text-gold" />
                    <div>
                      <div className="font-semibold">Upload Existing</div>
                      <div className="text-xs text-muted-foreground">.txt, .md, .html, .pdf, .docx</div>
                    </div>
                  </button>
                </div>
              </>
            )}
            <input ref={fileRef} type="file" multiple accept=".txt,.md,.html,.htm,.pdf,.docx,.doc" onChange={handleUpload} className="hidden" />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or content..."
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-gold"
          />
        </div>
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="rounded-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold">
          <option>All</option>
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-8 space-y-8">
        {Object.entries(groupedBySubject).length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No notes yet. Create a new note or upload an existing file to begin.</p>
          </div>
        )}
        {Object.entries(groupedBySubject).map(([subject, items]) => (
          <div key={subject}>
            <div className="mb-3 flex items-center gap-2">
              <Folder className="h-4 w-4 text-gold" />
              <h2 className="font-display text-lg font-bold">{subject}</h2>
              <span className="text-xs text-muted-foreground">{items.length} notes</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((n) => (
                <div key={n.id} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-gold/50 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                      <BookOpen className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                      <button onClick={() => navigate({ to: "/dashboard/notes/$noteId", params: { noteId: n.id } })} className="rounded p-1 hover:bg-soft"><Edit3 className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => remove(n.id)} className="rounded p-1 hover:bg-soft"><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
                    </div>
                  </div>
                  <h3 className="mt-4 line-clamp-1 font-bold">{n.title || "Untitled"}</h3>
                  <div
                    className="prose-note mt-2 line-clamp-3 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: n.html || "<em>No content</em>" }}
                  />
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>📅 {n.updated}</span>
                    <button onClick={() => navigate({ to: "/dashboard/notes/$noteId", params: { noteId: n.id } })} className="font-semibold text-gold hover:underline">Open →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

function today() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
