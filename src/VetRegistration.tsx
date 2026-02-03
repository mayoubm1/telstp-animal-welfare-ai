import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function VetRegistration() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    licenseNumber: "",
    specializations: [] as string[],
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    clinicEmail: "",
    bio: "",
    consultationFee: "",
  });
  const [newSpecialization, setNewSpecialization] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const registerMutation = trpc.veterinarians.register.useMutation();
  const profileQuery = trpc.veterinarians.getProfile.useQuery();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization],
      }));
      setNewSpecialization("");
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.licenseNumber || !formData.clinicName || !formData.clinicAddress) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        licenseNumber: formData.licenseNumber,
        specializations: formData.specializations,
        clinicName: formData.clinicName,
        clinicAddress: formData.clinicAddress,
        clinicPhone: formData.clinicPhone,
        clinicEmail: formData.clinicEmail,
        bio: formData.bio,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setLocation("/vet-dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to register veterinarian profile");
    }
  };

  if (!user) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to register as a veterinarian</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (profileQuery.data) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-600" />
              Veterinarian Profile Exists
            </CardTitle>
            <CardDescription>You already have a veterinarian profile registered</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/vet-dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Veterinarian Registration</CardTitle>
          <CardDescription>Register your veterinary credentials and clinic information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="w-5 h-5" />
                Profile registered successfully! Redirecting to dashboard...
              </div>
            )}

            {/* License Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">License Information</h3>

              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., VET-2024-001234"
                  required
                />
              </div>

              <div>
                <Label>Specializations</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    placeholder="e.g., Orthopedics, Cardiology"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSpecialization();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddSpecialization}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specializations.map((spec, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialization(index)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Clinic Information</h3>

              <div>
                <Label htmlFor="clinicName">Clinic Name *</Label>
                <Input
                  id="clinicName"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleInputChange}
                  placeholder="Your clinic name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="clinicAddress">Clinic Address *</Label>
                <Input
                  id="clinicAddress"
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                  placeholder="Full clinic address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clinicPhone">Phone Number</Label>
                  <Input
                    id="clinicPhone"
                    name="clinicPhone"
                    value={formData.clinicPhone}
                    onChange={handleInputChange}
                    placeholder="+20 1234567890"
                  />
                </div>

                <div>
                  <Label htmlFor="clinicEmail">Email Address</Label>
                  <Input
                    id="clinicEmail"
                    name="clinicEmail"
                    type="email"
                    value={formData.clinicEmail}
                    onChange={handleInputChange}
                    placeholder="clinic@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="consultationFee">Consultation Fee (Optional)</Label>
                <Input
                  id="consultationFee"
                  name="consultationFee"
                  type="number"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  placeholder="e.g., 50.00"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Professional Information</h3>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your experience and expertise..."
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register as Veterinarian"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
