import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, X, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ImageUploadTriage() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = trpc.imageAnalysis.uploadAndAnalyze.useMutation({
    onSuccess: (result: any) => {
      setAnalysisResult(result);
      setIsAnalyzing(false);
    },
    onError: () => {
      setIsAnalyzing(false);
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            handleFileSelect(file);
            stopCamera();
          }
        });
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !previewUrl) return;
    setIsAnalyzing(true);
    try {
      if (!selectedImage) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1];
        await analyzeImage.mutateAsync({
          petId: user?.id || 1,
          imageBase64: base64,
          imageType: "general",
          description: "Pet health assessment",
        });
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Visual Health Assessment</h1>
          <p className="text-slate-600">Upload or capture images for AI-powered pet health analysis</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Camera Capture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Live Camera Capture
                </CardTitle>
                <CardDescription>Take a photo directly from your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!cameraActive ? (
                  <Button onClick={startCamera} className="w-full" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-black"
                      style={{ maxHeight: "300px" }}
                    />
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto} className="flex-1">
                        <Camera className="w-4 h-4 mr-2" />
                        Capture
                      </Button>
                      <Button onClick={stopCamera} variant="outline" className="flex-1">
                        Stop
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Image
                </CardTitle>
                <CardDescription>Drag and drop or click to select</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDragDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Drop image here or click to select</p>
                  <p className="text-sm text-slate-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </CardContent>
            </Card>

            {/* Image Guidelines */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Photo Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700 space-y-2">
                <p>✓ Good lighting and clear focus</p>
                <p>✓ Close-up of affected area</p>
                <p>✓ Multiple angles if possible</p>
                <p>✓ Avoid shadows and glare</p>
                <p>✓ Include scale reference if helpful</p>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Results Section */}
          <div className="space-y-6">
            {previewUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Image Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img src={previewUrl} alt="Preview" className="w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1">
                      {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                    </Button>
                    <Button onClick={clearImage} variant="outline">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisResult && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <CheckCircle className="w-5 h-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Conditions Detected */}
                  {analysisResult.conditions && analysisResult.conditions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Conditions Detected:</h4>
                      <div className="space-y-2">
                        {analysisResult.conditions.map((condition: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-1">
                              {Math.round((condition.confidence || 0) * 100)}%
                            </Badge>
                            <div>
                              <p className="font-medium text-slate-900">{condition.name}</p>
                              <p className="text-sm text-slate-600">{condition.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Severity */}
                  {analysisResult.severity && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Severity Level:</h4>
                      <Badge
                        className={
                          analysisResult.severity === "critical"
                            ? "bg-red-600"
                            : analysisResult.severity === "moderate"
                              ? "bg-yellow-600"
                              : "bg-green-600"
                        }
                      >
                        {analysisResult.severity.toUpperCase()}
                      </Badge>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysisResult.recommendations && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Recommendations:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                        {analysisResult.recommendations.map((rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="pt-4 border-t border-green-200">
                    <p className="text-sm text-slate-600 mb-3">
                      Based on this analysis, we recommend:
                    </p>
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        Schedule Vet Consultation
                      </Button>
                      <Button className="w-full" variant="outline">
                        Find Emergency Clinic
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!previewUrl && !analysisResult && (
              <Card className="bg-slate-50">
                <CardContent className="pt-12 text-center">
                  <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Upload or capture an image to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Camera Capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
