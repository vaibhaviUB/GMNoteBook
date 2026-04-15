import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";


const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [usn, setUsn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError("Please fill in required fields.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            college_name: collegeName,
            department: department,
            program: program,
            semester: semester,
            usn: usn,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('rate limit')) {
          setError("Rate limit hit: Supabase blocked this to prevent spam. Please go to your Supabase Dashboard -> Authentication -> Providers -> Email, and turn OFF 'Confirm email', then try again.");
          setLoading(false);
          return;
        }
        throw signUpError;
      }
      
      // Explicitly insert into profiles table just in case the backend trigger is missing
      if (data?.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          phone_number: phoneNumber,
          college_name: collegeName,
          department: department,
          program: program,
          semester: semester,
          usn: usn,
          email: email
        });
        
        if (profileError) {
          console.error("Profile insert error:", profileError);
        }
      }

      // Navigate to dashboard upon successful sign up.
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-[#4C2424] text-gray-800 text-sm focus:outline-none focus:border-[#4C2424] focus:ring-1 focus:ring-[#4C2424] transition-all placeholder:text-gray-400";
  const labelClasses = "text-[11px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#6b1016] transition-colors font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-xl bg-white p-8 md:p-10 rounded-2xl shadow-sm border-2 border-[#4C2424]">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="GMNoteBook Logo" className="w-10 h-10 rounded-full object-cover shadow-sm bg-white" />
            <span className="text-xl font-display font-bold text-gold">GMNoteBook</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-900">Create Your Account</h1>
          <p className="text-sm text-gray-500 mt-1">Start your smart learning journey today.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClasses}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className={labelClasses}>Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={inputClasses}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>College Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className={inputClasses}
                placeholder="University Name"
              />
            </div>
            <div>
              <label className={labelClasses}>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={inputClasses}
                placeholder="e.g., CS, IS"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Select Program</label>
              <div className="relative">
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Select Program</option>
                  <option value="btech">B.Tech</option>
                  <option value="mtech">M.Tech</option>
                  <option value="bca">BCA</option>
                  <option value="mca">MCA</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Select Semester</label>
              <div className="relative">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClasses}>USN / Roll Number</label>
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className={inputClasses}
              placeholder="USN / Roll Number"
            />
          </div>

          <div>
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="trupti12@gmail.com"
            />
          </div>

          <div>
            <label className={labelClasses}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold hover:opacity-90 text-secondary-foreground font-bold py-3.5 rounded-xl shadow-card transition-all text-[15px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Free Account"}
            </button>
          </div>
        </form>

        <p className="text-center text-[13px] text-gray-600 mt-6">
          Already tracking your goals?{" "}
          <Link to="/login" className="text-gold font-semibold hover:underline transition-all">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
