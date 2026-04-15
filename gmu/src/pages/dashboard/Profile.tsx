import { IdCard, GraduationCap, Briefcase, Users, MapPin, Phone, ArrowUp, Camera, Loader2, Mail, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || null);
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`*`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setProfileData(data);
          setEditedData(data);
          setAvatarUrl(data.avatar_url);
        }
      }
    } catch (error: any) {
      console.error('Error loading user data!', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedData.full_name,
          department: editedData.department,
          college_name: editedData.college_name,
          usn: editedData.usn,
          semester: editedData.semester,
          phone_number: editedData.phone_number,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(editedData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const profileInfo = [
    { key: "usn", label: "USN / Roll Number", value: profileData?.usn || "NOT SET", icon: IdCard },
    { key: "department", label: "Discipline", value: profileData?.department || "NOT SET", icon: GraduationCap },
    { key: "college_name", label: "Institution", value: profileData?.college_name || "NOT SET", icon: Briefcase },
    { key: "semester", label: "Section / Semester", value: profileData?.semester || "NOT SET", icon: Users },
    { key: "email", label: "Email ID", value: email || "Loading...", icon: Mail, readonly: true },
    { key: "phone_number", label: "Phone Number", value: profileData?.phone_number || "NOT SET", icon: Phone },
  ];

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // 1. Upload to Storage
      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;

      // 3. Update Profile Database
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      toast.success("Profile picture updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd] pb-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#c08d4c]/10 to-transparent -z-10" />
      <div className="absolute top-40 -right-20 w-64 h-64 bg-[#c08d4c]/5 rounded-full blur-3xl -z-10" />

      <div className="px-6 relative">
        {/* Profile Card */}
        <div className="mt-8 mb-10 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#c08d4c] via-[#a67a42] to-[#4a2e19] p-10 flex flex-col items-center text-white shadow-[0_20px_50px_rgba(192,141,76,0.3)] border border-white/10 relative group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(192,141,76,0.4)]">
          
          <div className="absolute top-6 right-6">
            {isEditing && (
              <div className="flex gap-2">
                <Button 
                  onClick={saveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 shadow-lg transition-all active:scale-95"
                >
                  Save
                </Button>
                <Button 
                  onClick={() => { setIsEditing(false); setEditedData(profileData); }}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-6 backdrop-blur-md transition-all active:scale-95"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div 
            className="relative cursor-pointer mb-6 group/avatar"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 bg-white/10 shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover/avatar:scale-105 flex items-center justify-center relative">
              {uploading || loading && !isEditing ? (
                <Loader2 className="h-8 w-8 animate-spin text-white/70" />
              ) : (
                <img 
                  src={avatarUrl || "/vector_avatar.png"} 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover scale-110" 
                />
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="hidden"
              ref={fileInputRef}
            />

            <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 border-[3px] border-[#c08d4c] rounded-full shadow-lg ring-2 ring-white/20 animate-pulse z-10"></div>
          </div>
          <div className="space-y-3 text-center w-full max-w-md">
            {isEditing ? (
              <div className="space-y-3">
                <input 
                  type="text"
                  value={editedData.full_name || ""}
                  onChange={(e) => setEditedData({ ...editedData, full_name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-2 text-center text-xl font-bold placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <input 
                  type="text"
                  value={editedData.department || ""}
                  onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
                  placeholder="Department (e.g. CSE)"
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-1.5 text-center text-sm font-medium placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all uppercase tracking-widest"
                />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black tracking-tight drop-shadow-md uppercase">
                  {loading ? "Loading..." : profileData?.full_name || "USER NAME"}
                </h2>
                <p className="text-white/80 text-sm font-medium tracking-widest uppercase">
                  {loading ? "..." : profileData?.department || "Student"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Info Items */}
        <div className="grid gap-4 sm:grid-cols-2">
          {profileInfo.map((info, index) => (
            <Card key={index} className={`border border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md transition-all duration-300 ${!isEditing ? 'hover:shadow-md hover:-translate-y-1 hover:border-[#c08d4c]/20' : ''} group`}>
              <CardContent className="p-5 flex items-center gap-5">
                <div className="p-3 bg-[#fdf8f3] rounded-2xl group-hover:bg-[#c08d4c] transition-colors duration-300">
                  <info.icon className="h-6 w-6 text-[#c08d4c] group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-[#c08d4c] uppercase tracking-tighter mb-0.5">{info.label}</span>
                  {isEditing && !info.readonly ? (
                    <input 
                      type="text"
                      value={editedData[info.key] || ""}
                      onChange={(e) => setEditedData({ ...editedData, [info.key]: e.target.value })}
                      className="text-sm font-bold text-foreground bg-[#fdf8f3] border-b-2 border-[#c08d4c]/30 focus:border-[#c08d4c] focus:outline-none transition-all py-1 w-full"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-foreground/90 leading-tight line-clamp-2">
                      {loading ? "..." : info.value}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        {!isEditing && (
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto min-w-[200px] h-14 bg-gradient-to-r from-[#6b1016] to-[#4a0e0e] hover:from-[#4a0e0e] hover:to-[#2d090a] text-white rounded-2xl shadow-[0_10px_20px_rgba(107,16,22,0.2)] hover:shadow-[0_15px_30px_rgba(107,16,22,0.3)] transition-all duration-300 flex items-center justify-center gap-3 group border-none"
            >
              <Camera className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-bold tracking-wide">Edit Profile</span>
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full sm:w-auto min-w-[200px] h-14 border-2 border-[#6b1016]/20 hover:border-[#6b1016] hover:bg-[#6b1016]/5 text-[#6b1016] rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <span className="font-bold tracking-wide">Sign Out</span>
            </Button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
