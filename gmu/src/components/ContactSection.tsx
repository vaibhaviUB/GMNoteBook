import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log("Form submitted", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClasses = "w-full px-3.5 py-2.5 rounded-lg bg-gray-50 border border-[#4C2424] text-gray-800 text-sm focus:outline-none focus:border-[#4C2424] focus:ring-1 focus:ring-[#4C2424] transition-all placeholder:text-gray-400";
  const labelClasses = "text-[11px] font-bold text-gray-600 mb-1.5 block uppercase tracking-wider";

  return (
    <section id="contact" className="py-24 px-6 bg-gray-50 relative border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gold mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">
            Have questions about GMNoteBook or want to learn more about our AI study features? 
            Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Contact Information</h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you're a student looking to optimize your study habits or an institution 
                wanting to partner with us, we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-[#4C2424] flex items-center justify-center shrink-0 bg-white">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">Email Us</h4>
                  <a href="mailto:support@gmotebook.com" className="text-gray-600 hover:text-gold transition-colors">
                    support@gmotebook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-[#4C2424] flex items-center justify-center shrink-0 bg-white">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">Call Us</h4>
                  <a href="tel:+15555555555" className="text-gray-600 hover:text-gold transition-colors">
                    +1 (555) 555-5555
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-[#4C2424] flex items-center justify-center shrink-0 bg-white">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">Location</h4>
                  <p className="text-gray-600">
                    GM University Campus<br />
                    Computer Science Block, Room 404
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-2 border-[#4C2424] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label className={labelClasses}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className={labelClasses}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className={labelClasses}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className={labelClasses}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={3}
                  className={`${inputClasses} resize-none`}
                  placeholder="Write your message here..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full gradient-gold text-secondary-foreground font-bold py-2.5 rounded-lg shadow-card hover:opacity-90 transition-all text-sm"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
