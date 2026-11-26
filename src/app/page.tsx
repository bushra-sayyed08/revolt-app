"use client";

import React, { useState } from "react";
import {
  Wrench,
  Sparkles,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  DollarSign,
  Droplets,
  Recycle,
  ShieldAlert,
  ArrowRight,
  Flame,
  HelpCircle,
  RotateCcw,
  Volume2,
  ExternalLink,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DiagnosisResult, SAMPLE_DIAGNOSES } from "@/types/diagnosis";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deviceHint, setDeviceHint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"repair" | "salvage" | "impact">("repair");
  const [communityTotalKg, setCommunityTotalKg] = useState(14820);

  // File upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger analysis
  const runDiagnosis = async (sampleKey?: string) => {
    setIsLoading(true);
    setCompletedSteps([]);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImage,
          deviceHint,
          sampleKey,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDiagnosis(data.data);
        setActiveTab("repair");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = (key: string) => {
    if (key === "microwave") {
      setSelectedImage("https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80");
      setDeviceHint("Microwave turns on and hums, but food doesn't heat up at all.");
    } else if (key === "pcb") {
      setSelectedImage("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80");
      setDeviceHint("Desktop power supply circuit board - random shutoffs.");
    } else if (key === "earphones") {
      setSelectedImage("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
      setDeviceHint("Bluetooth headphones dies immediately when cable removed.");
    }
    runDiagnosis(key);
  };

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      const next = [...completedSteps, stepNumber];
      setCompletedSteps(next);
      if (diagnosis && next.length === diagnosis.repairSteps.length) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setCommunityTotalKg((prev) => prev + diagnosis.impactMetrics.eWasteDivertedKg);
      }
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setDeviceHint("");
    setDiagnosis(null);
    setCompletedSteps([]);
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-emerald-900/40 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wrench className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
                  ReVolt
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Green Shift Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Right-to-Repair & Zero E-Waste Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-300">Global Diverted:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {communityTotalKg.toLocaleString()} kg
              </span>
            </div>

            <button
              onClick={resetAll}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition text-slate-300 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              New Scan
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {/* Hero Section if no diagnosis */}
        {!diagnosis && (
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Don&apos;t Dump It — Fix or Salvage It
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Diagnose broken electronics in seconds.{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Stop the E-Waste crisis.
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every year, 53 million tons of electronics are thrown away just because of simple blown fuses, bad switches, or dead batteries. ReVolt analyzes your broken appliances, diagnoses root causes, gives interactive DIY fix steps, and recovers valuable components.
            </p>

            {/* Quick One-Click Presets */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-2 text-xs">
              <span className="text-slate-400">Try Instant Sample:</span>
              <button
                onClick={() => loadSample("microwave")}
                className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-500/50 transition flex items-center gap-1 text-slate-300"
              >
                🔥 Dead Microwave
              </button>
              <button
                onClick={() => loadSample("pcb")}
                className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-500/50 transition flex items-center gap-1 text-slate-300"
              >
                ⚡ Blown Circuit / PCB
              </button>
              <button
                onClick={() => loadSample("earphones")}
                className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-500/50 transition flex items-center gap-1 text-slate-300"
              >
                🎧 Wireless Headphones
              </button>
            </div>
          </div>
        )}

        {/* Diagnostic Input Section */}
        {!diagnosis && (
          <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            {/* Image Preview / Drop Zone */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-6 transition flex flex-col items-center justify-center text-center bg-slate-950/40 group overflow-hidden">
              {selectedImage ? (
                <div className="relative w-full h-64 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Device to diagnose"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600/90 text-white rounded-lg hover:bg-rose-700 transition shadow"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-200 mb-1">
                    Upload or snap a photo of the device / circuit
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    Take a clear picture of the broken appliance, circuit board, battery compartment, or serial label.
                  </p>
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-500/20">
                    <Upload className="w-4 h-4" />
                    Browse Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </>
              )}
            </div>

            {/* Problem Description */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Describe the symptoms (Optional but helpful):
              </label>
              <textarea
                value={deviceHint}
                onChange={(e) => setDeviceHint(e.target.value)}
                placeholder="e.g. It was working fine yesterday, now it trips the main breaker when turned on. Smelled slight burning plastic."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-600 resize-none h-20"
              />
            </div>

            {/* Submit Diagnose Button */}
            <button
              onClick={() => runDiagnosis()}
              disabled={isLoading || (!selectedImage && !deviceHint)}
              className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/15"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Running AI Hardware Diagnostic...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run Instant Right-to-Repair Diagnosis
                </>
              )}
            </button>
          </div>
        )}

        {/* Diagnosis Active View */}
        {diagnosis && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Device Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                {selectedImage && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img
                      src={selectedImage}
                      alt="Device"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                      {diagnosis.deviceCategory}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {diagnosis.confidenceScore}% AI Confidence
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        diagnosis.identifiedIssue.repairDifficulty === "Beginner"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : diagnosis.identifiedIssue.repairDifficulty === "Intermediate"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      Difficulty: {diagnosis.identifiedIssue.repairDifficulty}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {diagnosis.deviceName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    <strong className="text-emerald-400">Diagnosis:</strong>{" "}
                    {diagnosis.identifiedIssue.summary}
                  </p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2 min-w-[220px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Repair Checklist</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {completedSteps.length} / {diagnosis.repairSteps.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                    style={{
                      width: `${
                        (completedSteps.length / diagnosis.repairSteps.length) * 100
                      }%`,
                    }}
                  />
                </div>
                {completedSteps.length === diagnosis.repairSteps.length ? (
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Device Fixed & Diverted!
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Check off steps as you repair
                  </p>
                )}
              </div>
            </div>

            {/* Safety Warning Card */}
            {diagnosis.safetyNotice && (
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                    Critical Safety Warning
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    {diagnosis.safetyNotice}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-slate-800 gap-4">
              <button
                onClick={() => setActiveTab("repair")}
                className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                  activeTab === "repair"
                    ? "border-emerald-400 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Wrench className="w-4 h-4" />
                DIY Repair Guide ({diagnosis.repairSteps.length} Steps)
              </button>
              <button
                onClick={() => setActiveTab("salvage")}
                className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                  activeTab === "salvage"
                    ? "border-emerald-400 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Recycle className="w-4 h-4" />
                Component Salvage & Reuse ({diagnosis.salvageableParts.length})
              </button>
              <button
                onClick={() => setActiveTab("impact")}
                className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                  activeTab === "impact"
                    ? "border-emerald-400 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Leaf className="w-4 h-4" />
                Environmental Impact
              </button>
            </div>

            {/* TAB 1: REPAIR GUIDE */}
            {activeTab === "repair" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Steps Column */}
                <div className="lg:col-span-2 space-y-4">
                  {diagnosis.repairSteps.map((step) => {
                    const isDone = completedSteps.includes(step.stepNumber);
                    return (
                      <div
                        key={step.stepNumber}
                        onClick={() => toggleStep(step.stepNumber)}
                        className={`cursor-pointer rounded-xl p-5 border transition duration-200 ${
                          isDone
                            ? "bg-emerald-950/20 border-emerald-500/40 opacity-80"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition ${
                                isDone
                                  ? "bg-emerald-500 text-slate-950"
                                  : "border-2 border-slate-600 text-transparent hover:border-slate-400"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Step {step.stepNumber}
                                </span>
                                <span className="font-semibold text-sm sm:text-base text-white">
                                  {step.title}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                                {step.instruction}
                              </p>
                              {step.safetyTip && (
                                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{step.safetyTip}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(`${step.title}. ${step.instruction}`);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition shrink-0"
                            title="Read instruction out loud"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side: Tools & Advice */}
                <div className="space-y-6">
                  {/* Tools Needed Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <Wrench className="w-4 h-4 text-emerald-400" />
                      Tools & Materials Needed
                    </h3>
                    <ul className="space-y-2">
                      {diagnosis.toolsRequired.map((tool, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/60"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Local Action Advice */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      Actionable Next Steps
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {diagnosis.localActionAdvice}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SALVAGE & REUSE */}
            {activeTab === "salvage" && (
              <div className="space-y-4">
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
                  💡 If this device cannot be fully repaired, <strong>never throw it in the trash</strong>. Extract these working components to reuse in DIY projects, sell to repair hobbyists, or drop off at local repair cafes.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {diagnosis.salvageableParts.map((part, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/40 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm text-white">
                            {part.name}
                          </h4>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {part.estimatedValue}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {part.reusePotential}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Safe to extract
                        </span>
                        <span className="text-slate-500">Upcycle ready</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ENVIRONMENTAL IMPACT */}
            {activeTab === "impact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Metric 1 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                      <Flame className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-2xl font-black font-mono text-white">
                      {diagnosis.impactMetrics.co2SavedKg} kg
                    </span>
                    <h4 className="text-xs font-semibold text-slate-300 mt-1">
                      CO₂ Emissions Prevented
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Equivalent to avoiding ~{Math.round(diagnosis.impactMetrics.co2SavedKg * 4)} km of car driving emissions.
                    </p>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
                      <Recycle className="w-5 h-5 text-teal-400" />
                    </div>
                    <span className="text-2xl font-black font-mono text-white">
                      {diagnosis.impactMetrics.eWasteDivertedKg} kg
                    </span>
                    <h4 className="text-xs font-semibold text-slate-300 mt-1">
                      E-Waste Diverted from Landfill
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Keeps toxic lead, cadmium, and plastic out of municipal soil.
                    </p>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                      <DollarSign className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-2xl font-black font-mono text-white">
                      ${diagnosis.impactMetrics.moneySavedEstimatedUsd}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-300 mt-1">
                      Replacement Cost Saved
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Average consumer savings compared to buying a replacement unit.
                    </p>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                      <Droplets className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-2xl font-black font-mono text-white">
                      {diagnosis.impactMetrics.waterConservedLitres} L
                    </span>
                    <h4 className="text-xs font-semibold text-slate-300 mt-1">
                      Embodied Manufacturing Water
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Freshwater consumed during raw mining & chip fabrication.
                    </p>
                  </div>
                </div>

                {/* Impact Scientific Methodology Card */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    How ReVolt Calculates Environmental Benefit
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    According to UN Global E-waste Monitor & IEEE Life-Cycle Assessment (LCA) standards, over 70% of a gadget&apos;s total lifetime carbon footprint occurs during the manufacturing and extraction phase (not daily usage). By extending device lifespans by even 1-2 years through DIY repair or salvaging core modules, consumer electronics emissions decrease exponentially.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        <p>
          Built for <strong>Green Shift Hacks 2026</strong> • Empowering Right to Repair & Actionable Climate Solutions.
        </p>
      </footer>
    </div>
  );
}
