import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, CheckCircle, Clock, MessageSquare, FileText } from "lucide-react";

export default function VetDashboard() {
  const { user } = useAuth();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [responseText, setResponseText] = useState("");

  const consultationsQuery = trpc.consultations.getByVeterinarian.useQuery(undefined, { enabled: !!user });
  const respondMutation = trpc.consultations.respond.useMutation();

  const handleRespond = async () => {
    if (selectedCase && responseText) {
      try {
        await respondMutation.mutateAsync({
          consultationId: selectedCase.id,
          response: responseText,
          recommendation: responseText,
        });
        setResponseText("");
        setSelectedCase(null);
        consultationsQuery.refetch();
      } catch (error) {
        console.error("Error responding to consultation:", error);
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "urgent":
        return "bg-orange-100 text-orange-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <MessageSquare className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Veterinarian Access Required</CardTitle>
            <CardDescription>Please sign in with a veterinarian account.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Veterinarian Dashboard</h1>
          <p className="text-lg text-gray-600">Manage consultation requests and pet cases</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {consultationsQuery.data?.filter((c: any) => c.status === "pending").length || 0}
                </div>
                <p className="text-sm text-gray-600 mt-2">Pending Requests</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {consultationsQuery.data?.filter((c: any) => c.status === "in_progress").length || 0}
                </div>
                <p className="text-sm text-gray-600 mt-2">In Progress</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {consultationsQuery.data?.filter((c: any) => c.severity === "critical").length || 0}
                </div>
                <p className="text-sm text-gray-600 mt-2">Critical Cases</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {consultationsQuery.data?.filter((c: any) => c.status === "resolved").length || 0}
                </div>
                <p className="text-sm text-gray-600 mt-2">Resolved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consultations List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Consultation Requests</CardTitle>
              <CardDescription>Review and respond to pet owner inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultationsQuery.isLoading && <p className="text-gray-500">Loading consultations...</p>}
                {consultationsQuery.data?.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No consultations at this time</p>
                )}
                {consultationsQuery.data?.map((consultation: any) => (
                  <div
                    key={consultation.id}
                    onClick={() => setSelectedCase(consultation)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCase?.id === consultation.id
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(consultation.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            Pet: {consultation.petName || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Owner: {consultation.ownerName || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(consultation.severity)}>
                        {consultation.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{consultation.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(consultation.createdAt).toLocaleDateString()}</span>
                      <Badge variant="outline">{consultation.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Case Details & Response */}
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
              <CardDescription>
                {selectedCase ? "Review and respond to case" : "Select a case to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCase ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pet Information</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded text-sm text-gray-700">
                      <p>
                        <strong>Name:</strong> {selectedCase.petName}
                      </p>
                      <p>
                        <strong>Species:</strong> {selectedCase.petSpecies}
                      </p>
                      <p>
                        <strong>Age:</strong> {selectedCase.petAge} years
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Symptoms</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded text-sm text-gray-700 max-h-32 overflow-y-auto">
                      {selectedCase.description}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Your Response
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Provide your professional assessment, recommendations, and any next steps..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={6}
                    />
                  </div>

                  <Button
                    onClick={handleRespond}
                    disabled={!responseText || respondMutation.isPending}
                    className="w-full"
                  >
                    {respondMutation.isPending ? "Sending..." : "Send Response"}
                  </Button>

                  {selectedCase.status === "resolved" && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      This case has been resolved
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a consultation to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
