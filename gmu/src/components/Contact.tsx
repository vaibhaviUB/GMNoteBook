import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="bg-soft py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-display text-6xl font-bold text-gold">Get in Touch</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Have questions about GMNoteBook or want to learn more about our AI study features? Send us a message and our team will get back to you.
          </p>
        </div>
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-3xl font-bold text-foreground">Contact Information</h3>
            <p className="mt-4 text-muted-foreground">
              Whether you're a student looking to optimize your study habits or an institution wanting to partner with us, we'd love to hear from you.
            </p>
            <div className="mt-10 space-y-6">
              {[
                { icon: Mail, title: "Email Us", v: "support@gmotebook.com" },
                { icon: Phone, title: "Call Us", v: "+1 (555) 555-5555" },
                { icon: MapPin, title: "Location", v: "GM University Campus\nComputer Science Block, Room 404" },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{c.title}</p>
                    <p className="whitespace-pre-line text-sm text-muted-foreground">{c.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form className="rounded-2xl border border-brand/20 bg-card p-8 shadow-sm" onSubmit={(e) => e.preventDefault()}>
            <Field label="Full Name" placeholder="John Doe" />
            <Field label="Email Address" placeholder="you@example.com" type="email" />
            <Field label="Subject" placeholder="How can we help?" />
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
              />
            </div>
            <button type="submit" className="mt-6 w-full rounded-lg bg-gold py-3 font-bold text-gold-foreground transition hover:brightness-95">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mt-5 first:mt-0">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
      />
    </div>
  );
}
