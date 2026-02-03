import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Upload, Camera, AlertCircle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function ImageDiagnosis() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [petId, setPetId] = useState<number | null>(null);
  const [imageType, setImageType] = useState<"skin" | "eye" | "dental" | "ear" | "general">("skin");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [qualityFeedback, setQualityFeedback] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const petsQuery = trpc.pets.list.useQuery(undefined, { enabled: !!user });
  const uploadAndAnalyzeMutation = trpc.imageAnalysis.uploadAndAnalyze.useMutation();
  const assessQualityMutation = trpc.imageAnalysis.assessQuality.useMutation();

  const handleImageSelect = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);

      // Assess quality first
      setIsAnalyzing(true);
      try {
        const quality = await assessQualityMutation.mutateAsync({
          imageBase64: base64.split(",")[1] || base64,
          imageType,
        });
        setQualityFeedback(quality.quality);

        if (quality.quality.isAcceptable && petId) {
          // Proceed with analysis
          const result = await uploadAndAnalyzeMutation.mutateAsync({
            petId,
            imageBase64: base64.split(",")[1] || base64,
            imageType,
            description: description || undefined,
          });
          setAnalysisResult(result);
        }
      } catch (error) {
        console.error("Error analyzing image:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>You need to be signed in to use image diagnosis.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Visual Pet Diagnosis</h1>
          <p className="text-lg text-gray-600">Upload or capture photos of your pet for AI-powered analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Diagnosis Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Pet</label>
                <Select value={petId?.toString() || ""} onValueChange={(val) => setPetId(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {petsQuery.data?.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Condition Type</label>
                <Select value={imageType} onValueChange={(val: any) => setImageType(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skin">Skin Condition</SelectItem>
                    <SelectItem value="eye">Eye Problem</SelectItem>
                    <SelectItem value="dental">Dental Issue</SelectItem>
                    <SelectItem value="ear">Ear Problem</SelectItem>
                    <SelectItem value="general">General Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe symptoms or observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Choose a clear, well-lit photo for best results</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                  <TabsTrigger value="camera">Take Photo</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your image here</p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzing}
                    >
                      Browse Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="camera" className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
                    <Camera className="h-12 w-12 text-gray-400 mb-4" />
                    <Button
                      variant="outline"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isAnalyzing}
                    >
                      Open Camera
                    </Button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Image Preview */}
              {selectedImage && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <img src={selectedImage} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                </div>
              )}

              {/* Quality Feedback */}
              {qualityFeedback && (
                <Card className="mt-6 bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {qualityFeedback.isAcceptable ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          Image Quality: {qualityFeedback.qualityScore}%
                        </p>
                        {qualityFeedback.issues?.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {qualityFeedback.issues.map((issue: string, i: number) => (
                              <li key={i}>• {issue}</li>
                            ))}
                          </ul>
                        )}
                        {qualityFeedback.suggestions?.length > 0 && (
                          <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                            <p className="text-sm font-medium text-gray-900 mb-1">Suggestions:</p>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {qualityFeedback.suggestions.map((suggestion: string, i: number) => (
                                <li key={i}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analysis Results */}
              {isAnalyzing && (
                <div className="mt-6 flex items-center justify-center gap-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing image...</span>
                </div>
              )}

              {analysisResult && (
                <Card className="mt-6 border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-900">Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Possible Conditions:</h4>
                      <div className="space-y-2">
                        {analysisResult.analysis?.conditions?.map((condition: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                            <span className="text-gray-700">{condition.name}</span>
                            <span className="text-sm font-medium text-green-600">{condition.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Severity:</h4>
                      <p className="text-sm text-gray-700 capitalize">{analysisResult.analysis?.severity}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Recommendation:</h4>
                      <p className="text-sm text-gray-700">{analysisResult.analysis?.recommendation}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Observations:</h4>
                      <p className="text-sm text-gray-700">{analysisResult.analysis?.observations}</p>
                    </div>

                    {analysisResult.analysis?.warnings?.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <h4 className="font-medium text-red-900 mb-1">⚠️ Warnings:</h4>
                        <ul className="space-y-1 text-sm text-red-800">
                          {analysisResult.analysis.warnings.map((warning: string, i: number) => (
                            <li key={i}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button className="w-full mt-4" onClick={() => navigate("/dashboard")}>
                      Save to Case History
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
