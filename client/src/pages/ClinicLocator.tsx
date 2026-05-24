import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { MapPin, Phone, Clock, AlertCircle, Star, Navigation, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  clinic_type?: string | null;
  emergency_services?: boolean | null;
  rating?: number | null;
  distance?: number;
  city?: string;
  latitude?: number;
  longitude?: number;
  distance_km?: number;
  verified?: boolean;
}

export default function ClinicLocator() {
  const [searchCity, setSearchCity] = useState("");
  const [clinicType, setClinicType] = useState<"general" | "emergency" | "specialty" | "hospital" | undefined>();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [nearestEmergencyClinics, setNearestEmergencyClinics] = useState<Clinic[]>([]);

  // Get all clinics on mount
  const allClinicsQuery = trpc.clinics.getAll.useQuery();
  
  const clinicsQuery = trpc.clinics.search.useQuery(
    { query: searchCity, clinicType },
    { enabled: !!searchCity }
  );

  // Find nearest emergency clinics
  const nearestQuery = trpc.clinics.findNearest.useQuery(
    {
      latitude: userLocation?.lat || 0,
      longitude: userLocation?.lng || 0,
      maxDistance: 10,
    },
    { enabled: !!userLocation && emergencyMode }
  );

  // Initialize with all clinics
  useEffect(() => {
    if (allClinicsQuery.data && !searchCity && !clinicType) {
      // Show all clinics initially
    }
  }, [allClinicsQuery.data]);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      // Query will auto-trigger due to enabled condition
    }
  };

  const handleGetDirections = (clinic: Clinic) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(clinic.name + " " + clinic.address)}`;
    window.open(mapsUrl, "_blank");
  };

  const handleCallClinic = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const findNearestEmergency = () => {
    if (!userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setEmergencyMode(true);
          },
          (error) => {
            console.error("Location error:", error);
          }
        );
      }
      return;
    }

    setEmergencyMode(true);
  };

  // Trigger nearest search when emergency mode is enabled and location is available
  useEffect(() => {
    if (emergencyMode && userLocation && nearestQuery.data) {
      setNearestEmergencyClinics(nearestQuery.data);
      if (nearestQuery.data.length > 0) {
        setSelectedClinic(nearestQuery.data[0]);
      }
    }
  }, [nearestQuery.data, emergencyMode, userLocation]);

  const getClinicTypeColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "specialty":
        return "bg-purple-100 text-purple-800";
      case "hospital":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  // Show loading state
  const isLoading = clinicsQuery.isLoading || allClinicsQuery.isLoading || nearestQuery.isLoading;

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Veterinary Clinics</h1>
          <p className="text-gray-600">Search for nearby veterinary clinics and emergency services</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Clinics</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="e.g., Cairo, Alexandria"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Clinic Type</Label>
                  <select
                    id="type"
                    value={clinicType || ""}
                    onChange={(e) => setClinicType((e.target.value as any) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="general">General</option>
                    <option value="emergency">Emergency</option>
                    <option value="specialty">Specialty</option>
                    <option value="hospital">Hospital</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button type="submit" className="w-full">
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clinics List */}
          <div className="lg:col-span-2">
            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Searching for clinics...</p>
                </CardContent>
              </Card>
            )}

            {(clinicsQuery.isError || allClinicsQuery.isError || nearestQuery.isError) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p>Error loading clinics. Please try again.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isLoading && ((emergencyMode ? nearestEmergencyClinics : clinicsQuery.data || allClinicsQuery.data || [])?.length === 0) && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No clinics found in this area. Try a different search.</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {(emergencyMode ? nearestEmergencyClinics : clinicsQuery.data || allClinicsQuery.data || [])?.map((clinic: Clinic) => (
                <Card
                  key={clinic.id}
                  className={`cursor-pointer transition-all ${selectedClinic?.id === clinic.id ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedClinic(clinic)}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{clinic.name}</h3>
                        <p className="text-sm text-gray-600">{clinic.address}</p>
                      </div>
                      <Badge className={getClinicTypeColor(clinic.clinic_type || "general")}>
                        {clinic.clinic_type || "General"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      {clinic.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{(clinic.rating as number).toFixed(1)}</span>
                        </div>
                      )}
                      {clinic.emergency_services === true && (
                        <Badge variant="destructive">Emergency Services</Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallClinic(clinic.phone);
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(clinic);
                        }}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Clinic Details Sidebar */}
          <div>
            {selectedClinic ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{selectedClinic.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-500">Address</Label>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{selectedClinic.address}</span>
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${selectedClinic.phone}`} className="text-blue-600 hover:underline">
                        {selectedClinic.phone}
                      </a>
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Type</Label>
                    <Badge className={getClinicTypeColor(selectedClinic.clinic_type || "general")}>
                      {selectedClinic.clinic_type || "General"}
                    </Badge>
                  </div>

                  {selectedClinic.rating && (
                    <div>
                      <Label className="text-xs text-gray-500">Rating</Label>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{typeof selectedClinic.rating === 'number' ? selectedClinic.rating.toFixed(1) : parseFloat(String(selectedClinic.rating)).toFixed(1)} / 5</span>
                      </div>
                    </div>
                  )}

                  {selectedClinic.emergency_services && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-sm text-red-800 font-semibold">✓ Emergency Services Available</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleGetDirections(selectedClinic)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleCallClinic(selectedClinic.phone)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Select a clinic to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Emergency Clinic Finder */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Emergency Clinic Finder</CardTitle>
            <CardDescription className="text-red-700">Need immediate veterinary care?</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={findNearestEmergency}
            >
              <Zap className="w-4 h-4 mr-2" />
              Find Nearest Emergency Clinic
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Mode Results */}
        {emergencyMode && nearestEmergencyClinics.length > 0 && (
          <Card className="mt-8 border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Nearest Emergency Clinics</CardTitle>
              <CardDescription>Sorted by distance from your location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nearestEmergencyClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="p-3 bg-white border border-red-200 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
                    onClick={() => setSelectedClinic(clinic)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-red-900">{clinic.name}</p>
                        <p className="text-sm text-gray-600">{clinic.address}</p>
                      </div>
                      {clinic.distance_km && (
                        <Badge variant="destructive">{clinic.distance_km.toFixed(1)} km</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallClinic(clinic.phone);
                        }}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(clinic);
                        }}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
