import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import {
  Stethoscope,
  ImageIcon,
  BookOpen,
  AlertCircle,
  PawPrint,
  Plus,
  History,
  LogOut,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PawPrint className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">VetAI Care Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-600">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-slate-600">
            Manage your pets' health and access diagnostic tools
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link href="/symptom-checker">
            <Card className="cursor-pointer hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <Stethoscope className="w-8 h-8 text-emerald-600 mb-2" />
                <CardTitle className="text-lg">Symptom Checker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Diagnose pet symptoms</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/image-analysis">
            <Card className="cursor-pointer hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <ImageIcon className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Visual Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Upload pet photos</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/emergency-triage">
            <Card className="cursor-pointer hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Emergency Triage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Urgent assessment</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/knowledge-base">
            <Card className="cursor-pointer hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Health information</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* My Pets Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900">My Pets</h3>
            <Link href="/pets/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Pet
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for pet cards */}
            <Card>
              <CardHeader>
                <CardTitle>No pets added yet</CardTitle>
                <CardDescription>Add your first pet to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/pets/new">
                  <Button variant="outline" className="w-full">
                    Add Your First Pet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Cases */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Recent Cases</h3>
            <Link href="/case-history">
              <Button variant="outline" className="gap-2">
                <History className="w-4 h-4" /> View All
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>No cases yet</CardTitle>
              <CardDescription>
                Start by running a symptom check or uploading an image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/symptom-checker">
                <Button>Start First Diagnosis</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
