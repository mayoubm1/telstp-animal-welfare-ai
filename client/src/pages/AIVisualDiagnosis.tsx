import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Upload, Mic, StopCircle, Play, Loader, CheckCircle, Camera, Video } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AIVisualDiagnosis() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [petSpecies, setPetSpecies] = useState<"cat" | "dog">("cat");
  const [symptoms, setSymptoms] = useState("");
  
  // Photo/Video states
  const [uploadedMedia, setUploadedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null);
  
  // Audio states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreview, setAudioPreview] = useState<string>("");
  const [transcribedText, setTranscribedText] = useState("");
  
  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Handle media upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedMedia(file);
      setMediaType(type);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioPreview(url);
        
        // Auto-transcribe
        transcribeAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  // Stop audio recording
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Transcribe audio
  const transcribeAudio = async (blob: Blob) => {
    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append("file", blob);

      // Use Manus voice transcription
      const response = await fetch("/api/trpc/diagnosis.transcribeAudio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.result?.data) {
        setTranscribedText(data.result.data);
      }
    } catch (error) {
      console.error("Transcription error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze with AI
  const analyzeWithAI = async () => {
    if (!symptoms && !transcribedText && !uploadedMedia) {
      alert("Please provide at least one input: symptoms, audio, or media");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Prepare analysis payload
      const analysisData = {
        petSpecies,
        symptoms,
        audioTranscript: transcribedText,
        mediaType,
        mediaUrl: mediaPreview,
      };

      // Call AI diagnosis procedure
      const response = await fetch("/api/trpc/diagnosis.analyzeMultimedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysisData),
      });

      const result = await response.json();
      if (result.result?.data) {
        const { analysis, diagnosis: diag, recommendations: recs } = result.result.data;
        setAiAnalysis(analysis);
        setDiagnosis(diag);
        setRecommendations(recs || []);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Error analyzing case. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900">AI Visual Diagnosis</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pet Species */}
            <Card>
              <CardHeader>
                <CardTitle>Pet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pet Species *
                  </label>
                  <select
                    value={petSpecies}
                    onChange={(e) => setPetSpecies(e.target.value as "cat" | "dog")}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cat">Cat</option>
                    <option value="dog">Dog</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms Input */}
            <Card>
              <CardHeader>
                <CardTitle>Describe Symptoms</CardTitle>
                <CardDescription>
                  Describe what you observe about your pet's condition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., Coughing, loss of appetite, lethargy, discharge from eyes..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Photo
                </CardTitle>
                <CardDescription>
                  Upload a clear photo of your pet or affected area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMediaUpload(e, "photo")}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </Button>
                {mediaType === "photo" && mediaPreview && (
                  <div className="mt-4">
                    <img src={mediaPreview} alt="Pet" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Upload Video
                </CardTitle>
                <CardDescription>
                  Upload a video showing your pet's symptoms or behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleMediaUpload(e, "video")}
                  className="hidden"
                />
                <Button
                  onClick={() => videoInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Video
                </Button>
                {mediaType === "video" && mediaPreview && (
                  <div className="mt-4">
                    <video src={mediaPreview} controls className="w-full h-48 rounded-lg bg-slate-900" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audio Recording */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Record Pet Sounds
                </CardTitle>
                <CardDescription>
                  Record coughing, wheezing, or other sounds for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button
                      onClick={startAudioRecording}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopAudioRecording}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      <StopCircle className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {audioPreview && (
                  <div className="space-y-2">
                    <audio src={audioPreview} controls className="w-full" />
                    {transcribedText && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Transcribed:</p>
                        <p className="text-sm text-blue-800">{transcribedText}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analyze Button */}
            <Button
              onClick={analyzeWithAI}
              disabled={isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                "Analyze with AI"
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {aiAnalysis && (
              <>
                {/* AI Analysis */}
                <Card className="border-blue-300 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <CheckCircle className="w-5 h-5" />
                      AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-800">{aiAnalysis}</p>
                  </CardContent>
                </Card>

                {/* Diagnosis */}
                {diagnosis && (
                  <Card className="border-green-300 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-900">Likely Diagnosis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-green-800">{diagnosis}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-600 font-bold mt-1">•</span>
                            <span className="text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Find Emergency Clinic
                  </Button>
                  <Button className="w-full" variant="outline">
                    Share with Veterinarian
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
