import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered,
  Image as ImageIcon, Link as LinkIcon, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Check, Download, Quote, Brain,
} from "lucide-react";
import { useNotesStore, SUBJECTS } from "@/lib/notesStore";
import { NoteQuizModal } from "@/components/NoteQuizModal";

export const Route = createFileRoute("/dashboard/notes/$noteId")({
  component: NoteEditorPage,
});

function NoteEditorPage() {
  const { noteId } = Route.useParams();
  const { get, update } = useNotesStore();
  const navigate = useNavigate();
  const note = get(noteId);

  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(note?.title ?? "");
  const [subject, setSubject] = useState(note?.subject ?? SUBJECTS[0]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const initialHtml = note?.html ?? "";
  const [quizOpen, setQuizOpen] = useState(false);

  // Autosave (debounced)
  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => {
      update(note.id, {
        title: title || "Untitled",
        subject,
        html: editorRef.current?.innerHTML ?? "",
      });
      setSavedAt(new Date().toLocaleTimeString());
    }, 600);
    return () => clearTimeout(t);
  }, [title, subject]); // eslint-disable-line

  if (!note) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-soft">
        <div className="rounded-2xl bg-card p-8 text-center">
          <p>Note not found.</p>
          <Link to="/dashboard/notes" className="mt-4 inline-block font-semibold text-gold">← Back to Notes</Link>
        </div>
      </div>
    );
  }

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    handleEditorChange();
  };

  const handleEditorChange = () => {
    if (!editorRef.current) return;
    update(note.id, { html: editorRef.current.innerHTML });
    setSavedAt(new Date().toLocaleTimeString());
  };

  const insertImage = () => {
    const url = prompt("Image URL:");
    if (url) exec("insertImage", url);
  };
  const insertLink = () => {
    const url = prompt("Link URL:");
    if (url) exec("createLink", url);
  };
  const downloadHtml = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${editorRef.current?.innerHTML ?? ""}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title || "note"}.html`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-soft">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          <div className="flex flex-1 items-center gap-3">
            <button onClick={() => navigate({ to: "/dashboard/notes" })} className="rounded-lg p-2 hover:bg-soft">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled document"
              className="w-full max-w-xl border-0 bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
                <Check className="h-3 w-3 text-emerald-600" /> Saved {savedAt}
              </span>
            )}
            <button
              onClick={() => setQuizOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-3 py-1.5 text-sm font-semibold text-gold-foreground transition hover:brightness-110"
            >
              <Brain className="h-4 w-4" /> Take Test
            </button>
            <button onClick={downloadHtml} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-soft">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-2">
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs">
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-t border-border bg-soft/60 px-6 py-2">
          <Group>
            <select onChange={(e) => exec("formatBlock", e.target.value)} defaultValue="" className="rounded-md border border-border bg-card px-2 py-1 text-xs">
              <option value="" disabled>Style</option>
              <option value="<p>">Normal</option>
              <option value="<h1>">Heading 1</option>
              <option value="<h2>">Heading 2</option>
              <option value="<h3>">Heading 3</option>
              <option value="<blockquote>">Quote</option>
            </select>
            <select onChange={(e) => exec("fontName", e.target.value)} defaultValue="" className="rounded-md border border-border bg-card px-2 py-1 text-xs">
              <option value="" disabled>Font</option>
              <option value="Inter">Inter</option>
              <option value="Georgia">Georgia</option>
              <option value="Playfair Display">Playfair</option>
              <option value="ui-monospace">Mono</option>
            </select>
            <select onChange={(e) => exec("fontSize", e.target.value)} defaultValue="" className="rounded-md border border-border bg-card px-2 py-1 text-xs">
              <option value="" disabled>Size</option>
              <option value="2">Small</option>
              <option value="3">Normal</option>
              <option value="5">Large</option>
              <option value="7">XL</option>
            </select>
          </Group>
          <Sep />
          <Group>
            <Btn onClick={() => exec("bold")} title="Bold"><Bold className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("italic")} title="Italic"><Italic className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("underline")} title="Underline"><Underline className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("strikeThrough")} title="Strike"><Strikethrough className="h-4 w-4" /></Btn>
            <input type="color" onChange={(e) => exec("foreColor", e.target.value)} title="Text color" className="h-7 w-7 cursor-pointer rounded border border-border bg-card" />
          </Group>
          <Sep />
          <Group>
            <Btn onClick={() => exec("formatBlock", "<h1>")} title="H1"><Heading1 className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("formatBlock", "<h2>")} title="H2"><Heading2 className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("formatBlock", "<h3>")} title="H3"><Heading3 className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("formatBlock", "<blockquote>")} title="Quote"><Quote className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("formatBlock", "<pre>")} title="Code block"><Code className="h-4 w-4" /></Btn>
          </Group>
          <Sep />
          <Group>
            <Btn onClick={() => exec("insertUnorderedList")} title="Bullets"><List className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("insertOrderedList")} title="Numbered"><ListOrdered className="h-4 w-4" /></Btn>
          </Group>
          <Sep />
          <Group>
            <Btn onClick={() => exec("justifyLeft")} title="Left"><AlignLeft className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("justifyCenter")} title="Center"><AlignCenter className="h-4 w-4" /></Btn>
            <Btn onClick={() => exec("justifyRight")} title="Right"><AlignRight className="h-4 w-4" /></Btn>
          </Group>
          <Sep />
          <Group>
            <Btn onClick={insertLink} title="Link"><LinkIcon className="h-4 w-4" /></Btn>
            <Btn onClick={insertImage} title="Image"><ImageIcon className="h-4 w-4" /></Btn>
          </Group>
        </div>
      </header>

      {/* Document area */}
      <main className="px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorChange}
            dangerouslySetInnerHTML={{ __html: initialHtml }}
            className="prose-note min-h-[80vh] rounded-sm bg-card p-16 text-[15px] leading-relaxed shadow-md outline-none focus:shadow-lg"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          />
        </div>
      </main>

      {quizOpen && (
        <NoteQuizModal
          html={editorRef.current?.innerHTML ?? initialHtml}
          title={title}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </div>
  );
}

function Btn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className="rounded p-2 text-muted-foreground transition hover:bg-card hover:text-foreground"
    >
      {children}
    </button>
  );
}
function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}
function Sep() {
  return <span className="mx-1 h-5 w-px bg-border" />;
}
