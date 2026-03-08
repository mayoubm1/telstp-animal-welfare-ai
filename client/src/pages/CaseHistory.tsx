import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function CaseHistory() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  // Mock case history data
  const mockCases = [
    {
      id: 1,
      petName: "Max",
      petSpecies: "dog",
      date: "2026-03-08",
      symptoms: "Vomiting and diarrhea",
      severity: "moderate",
      status: "resolved",
      diagnosis: "Gastroenteritis",
      treatment: "Prescribed antibiotics and diet change",
    },
    {
      id: 2,
      petName: "Luna",
      petSpecies: "cat",
      date: "2026-03-05",
      symptoms: "Difficulty urinating",
      severity: "severe",
      status: "in_progress",
      diagnosis: "Urinary tract infection",
      treatment: "Pending veterinarian review",
    },
    {
      id: 3,
      petName: "Max",
      petSpecies: "dog",
      date: "2026-02-28",
      symptoms: "Limping and swelling",
      severity: "mild",
      status: "resolved",
      diagnosis: "Sprain",
      treatment: "Rest and pain management",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-blue-100 text-blue-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "severe":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const selectedCase = mockCases.find((c) => c.id === selectedCaseId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Case History</h1>
          <p className="text-slate-600">View and manage your pet's medical records</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cases List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {mockCases.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No case history found</p>
                  </CardContent>
                </Card>
              ) : (
                mockCases.map((caseItem) => (
                  <Card
                    key={caseItem.id}
                    className={`cursor-pointer transition-all ${
                      selectedCaseId === caseItem.id
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedCaseId(caseItem.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {caseItem.petName}
                            </h3>
                            <span className="text-sm text-slate-600 capitalize">
                              ({caseItem.petSpecies})
                            </span>
                          </div>
                          <p className="text-slate-600 mb-3">{caseItem.symptoms}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(caseItem.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(caseItem.status)}
                            <span className="text-sm font-medium capitalize text-slate-700">
                              {caseItem.status.replace("_", " ")}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(
                              caseItem.severity
                            )}`}
                          >
                            {caseItem.severity}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Case Details */}
          <div>
            {selectedCase ? (
              <Card>
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-lg">{selectedCase.petName}'s Case</CardTitle>
                  <CardDescription>
                    {new Date(selectedCase.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Symptoms</h4>
                    <p className="text-slate-600 text-sm">{selectedCase.symptoms}</p>
                  </div>

                  {/* Severity */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Severity</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getSeverityColor(
                        selectedCase.severity
                      )}`}
                    >
                      {selectedCase.severity}
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Diagnosis</h4>
                    <p className="text-slate-600 text-sm">{selectedCase.diagnosis}</p>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Treatment</h4>
                    <p className="text-slate-600 text-sm">{selectedCase.treatment}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Status</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedCase.status)}
                      <span className="text-sm capitalize text-slate-700">
                        {selectedCase.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 space-y-2">
                    <Button className="w-full" variant="outline">
                      Download Report
                    </Button>
                    <Button className="w-full" variant="outline">
                      Share with Vet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Select a case to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
