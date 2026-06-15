import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

type UserRole = "pet_owner" | "veterinarian" | "clinic" | "vendor";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  joinDate: Date;
  
  // Vet specific
  licenseNumber?: string;
  specializations?: string[];
  yearsOfExperience?: number;
  consultationFee?: number;
  
  // Clinic specific
  clinicName?: string;
  services?: string[];
  staffCount?: number;
  
  // Vendor specific
  businessName?: string;
  category?: string;
  totalProducts?: number;
  totalSales?: number;
  
  // Pet owner specific
  petCount?: number;
  favoriteVets?: string[];
}

export default function UserProfile() {
  const [location, setLocation] = useLocation();
  const [userRole, setUserRole] = useState<UserRole>("pet_owner");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    location: "Cairo, Egypt",
    bio: "Pet lover and animal welfare advocate",
    profileImage: "👤",
    rating: 4.8,
    totalReviews: 24,
    verified: true,
    joinDate: new Date("2024-01-15"),
    petCount: 2,
    favoriteVets: ["Dr. Ahmed", "Dr. Fatima"],
  });

  const meQuery = trpc.auth.me.useQuery();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Call API to save profile
    setIsEditing(false);
  };

  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case "veterinarian":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">License Number</label>
              <Input
                name="licenseNumber"
                value={profileData.licenseNumber || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Years of Experience</label>
              <Input
                name="yearsOfExperience"
                type="number"
                value={profileData.yearsOfExperience || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Consultation Fee (EGP)</label>
              <Input
                name="consultationFee"
                type="number"
                value={profileData.consultationFee || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>
          </div>
        );

      case "clinic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Clinic Name</label>
              <Input
                name="clinicName"
                value={profileData.clinicName || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Staff Count</label>
              <Input
                name="staffCount"
                type="number"
                value={profileData.staffCount || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>
          </div>
        );

      case "vendor":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Business Name</label>
              <Input
                name="businessName"
                value={profileData.businessName || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Category</label>
              <Input
                name="category"
                value={profileData.category || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Number of Pets</label>
              <Input
                name="petCount"
                type="number"
                value={profileData.petCount || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400 mb-4">
            User Profile
          </h1>
        </div>

        {/* Role selector */}
        <div className="w-full max-w-2xl mb-8">
          <p className="text-yellow-200 font-semibold mb-3">Select Profile Type:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { role: "pet_owner", label: "🐾 Pet Owner", icon: "🐾" },
              { role: "veterinarian", label: "👨‍⚕️ Veterinarian", icon: "👨‍⚕️" },
              { role: "clinic", label: "🏥 Clinic", icon: "🏥" },
              { role: "vendor", label: "🛍️ Vendor", icon: "🛍️" },
            ].map((opt) => (
              <button
                key={opt.role}
                onClick={() => setUserRole(opt.role as UserRole)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  userRole === opt.role
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg"
                    : "bg-slate-700/50 text-yellow-200 hover:bg-slate-600/70 border border-yellow-400/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile card */}
        <div className="w-full max-w-2xl bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl backdrop-blur-sm p-8">
          {/* Profile header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="text-7xl">{profileData.profileImage}</div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-200">{profileData.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-300">⭐ {profileData.rating}</span>
                  <span className="text-yellow-100/60">({profileData.totalReviews} reviews)</span>
                  {profileData.verified && <span className="text-green-400">✓ Verified</span>}
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold px-6 py-2 rounded-full"
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
          </div>

          {/* Basic info */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Name</label>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-yellow-200 font-semibold mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-slate-700/50 border-yellow-400/30"
                />
              </div>
              <div>
                <label className="block text-yellow-200 font-semibold mb-2">Phone</label>
                <Input
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-slate-700/50 border-yellow-400/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Location</label>
              <Input
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-slate-700/50 border-yellow-400/30"
              />
            </div>

            <div>
              <label className="block text-yellow-200 font-semibold mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full bg-slate-700/50 border border-yellow-400/30 text-yellow-100 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Role-specific content */}
          <div className="border-t border-yellow-400/30 pt-8 mb-8">
            <h3 className="text-xl font-bold text-yellow-200 mb-4">
              {userRole === "pet_owner" && "Pet Owner Details"}
              {userRole === "veterinarian" && "Professional Details"}
              {userRole === "clinic" && "Clinic Details"}
              {userRole === "vendor" && "Business Details"}
            </h3>
            {renderRoleSpecificContent()}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-between pt-6">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-2 border-yellow-400 text-yellow-200 font-bold px-6 py-2 rounded-full"
            >
              Back
            </Button>
            {isEditing && (
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold px-8 py-2 rounded-full"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Stats section */}
        <div className="w-full max-w-2xl mt-8 grid grid-cols-3 gap-4">
          <div className="bg-slate-700/50 border border-yellow-400/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-300">
              {userRole === "pet_owner" ? profileData.petCount : profileData.totalReviews}
            </div>
            <div className="text-sm text-yellow-100/60 mt-2">
              {userRole === "pet_owner" ? "Pets" : "Reviews"}
            </div>
          </div>
          <div className="bg-slate-700/50 border border-yellow-400/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-300">
              {userRole === "vendor" ? profileData.totalProducts : "—"}
            </div>
            <div className="text-sm text-yellow-100/60 mt-2">
              {userRole === "vendor" ? "Products" : "Member"}
            </div>
          </div>
          <div className="bg-slate-700/50 border border-yellow-400/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-300">
              {profileData.verified ? "✓" : "—"}
            </div>
            <div className="text-sm text-yellow-100/60 mt-2">Verified</div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
