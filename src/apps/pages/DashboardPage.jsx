import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import Navbar from "../components/Navbar";
import {
  Sparkles,
  Trophy,
  Flame,
  Brain,
  Timer,
  Play,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  Layers,
  ChevronRight,
  Zap,
  Sliders,
  Compass,
  Lightbulb,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dashboard Stats State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Practice Setup State
  const [questionCount, setQuestionCount] = useState(10);
  const [customQuestionCount, setCustomQuestionCount] = useState("");
  // Timer Setup State: "session" | "question" | "none"
  const [timerCategory, setTimerCategory] = useState("session");
  const [sessionMinutes, setSessionMinutes] = useState("25"); // default 25 menit (TOEFL ITP Sec 2)
  const [customSessionMinutes, setCustomSessionMinutes] = useState("120"); // contoh user: 120 menit
  const [questionSeconds, setQuestionSeconds] = useState("45"); // default 45 detik
  const [customQuestionSeconds, setCustomQuestionSeconds] = useState("30");
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/practice/stats");
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Compute active question count and timing for dynamic live preview
  const resolvedCount =
    questionCount === "custom"
      ? parseInt(customQuestionCount, 10) || 10
      : questionCount;

  // Resolve total time for session timer (in seconds)
  const resolvedTotalTimeSec =
    timerCategory === "session"
      ? (sessionMinutes === "custom"
          ? (parseInt(customSessionMinutes, 10) || 25) * 60
          : (parseInt(sessionMinutes, 10) || 25) * 60)
      : null;

  // Resolve time per question (in seconds)
  const resolvedTimePerQuestionSec =
    timerCategory === "question"
      ? (questionSeconds === "custom"
          ? parseInt(customQuestionSeconds, 10) || 30
          : parseInt(questionSeconds, 10) || 45)
      : null;

  const estimatedMinutes =
    timerCategory === "session"
      ? Math.round((resolvedTotalTimeSec || 0) / 60)
      : timerCategory === "question" && resolvedTimePerQuestionSec && resolvedCount
      ? Math.ceil((resolvedCount * resolvedTimePerQuestionSec) / 60)
      : null;

  const handleStartPractice = async () => {
    setStartError("");
    setStartLoading(true);

    try {
      const res = await apiClient.post("/practice/start", {
        questionCount: resolvedCount,
        timerType: timerCategory,
        totalTimeSec: resolvedTotalTimeSec,
        timePerQuestionSec: resolvedTimePerQuestionSec,
      });

      if (res.data.success) {
        navigate("/practice", {
          state: {
            sessionData: res.data.data,
            timerType: timerCategory,
            totalTimeSec: resolvedTotalTimeSec,
            timePerQuestionSec: resolvedTimePerQuestionSec,
          },
        });
      }
    } catch (err) {
      setStartError(
        err.response?.data?.message || "Gagal memulai latihan. Silakan coba kembali."
      );
    } finally {
      setStartLoading(false);
    }
  };

  // Presets definition for Question Packs
  const PACK_PRESETS = [
    {
      count: 5,
      label: "5 Soal",
      tag: "Quick Drill",
      desc: "~3-4 Menit",
      badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      count: 10,
      label: "10 Soal",
      tag: "Rekomendasi",
      desc: "~7-8 Menit",
      isPopular: true,
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      count: 20,
      label: "20 Soal",
      tag: "Intensif",
      desc: "~15 Menit",
      badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      count: 40,
      label: "40 Soal",
      tag: "Full Section 2",
      desc: "Simulasi Penuh",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  // Presets definition for Timer Per Sesi (Total Exam Time)
  const SESSION_TIMER_PRESETS = [
    {
      id: "25",
      icon: "⏱️",
      title: "25 Menit",
      desc: "Standar Resmi ETS",
      sub: "Simulasi Section 2",
      isRecommended: true,
    },
    {
      id: "40",
      icon: "⏳",
      title: "40 Menit",
      desc: "1 Menit / Soal",
      sub: "Fokus & Teliti",
    },
    {
      id: "60",
      icon: "🕒",
      title: "60 Menit (1 Jam)",
      desc: "Waktu Luang",
      sub: "Latihan Mendalam",
    },
    {
      id: "120",
      icon: "🏆",
      title: "120 Menit (2 Jam)",
      desc: "Sesi Marathon",
      sub: "Paling Leluasa",
    },
  ];

  // Presets definition for Timer Per Soal
  const QUESTION_TIMER_PRESETS = [
    {
      id: "45",
      icon: "⏱️",
      title: "45 Detik / Soal",
      desc: "Standar Ujian Resmi",
      sub: "Rekomendasi ITB",
      isRecommended: true,
    },
    {
      id: "30",
      icon: "⚡",
      title: "30 Detik / Soal",
      desc: "Speed Challenge",
      sub: "Latih reflek cepat",
    },
    {
      id: "60",
      icon: "⏳",
      title: "60 Detik / Soal",
      desc: "Analisis Mendalam",
      sub: "Fokus pemahaman",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7 pb-24 lg:pb-8">
        {/* HEADER HERO: Greeting & Target ITB Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/25 rounded-full text-xs font-semibold text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>TOEFL ITP ITB • Section 2 Structure & Written Expression</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Selamat Datang, {user?.name || "Mahasiswa"}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Platform latihan cerdas dengan Spaced Repetition System (SRS). Rumus grammar yang sering salah akan otomatis dijadwalkan ulang sampai tuntas dikuasai.
              </p>
            </div>

            {/* Target Score Widget */}
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-lg shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
                  Target Syarat Masuk ITB
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white">570–580</span>
                  <span className="text-xs font-bold text-slate-400">ITP / iBT 88+</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pascasarjana & Beasiswa</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS OVERVIEW: 4 Compact, Clean Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 hover:border-slate-700 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Bank Soal Aktif
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {loading ? "-" : stats?.totalBankQuestions || 0}
              </h3>
              <p className="text-[11px] text-slate-500">Section 2 Certified</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 hover:border-slate-700 transition-all">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Rata-rata Akurasi
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                {loading ? "-" : `${stats?.overallAccuracy || 0}%`}
              </h3>
              <p className="text-[11px] text-slate-500">
                {stats?.totalCorrect || 0} / {stats?.totalAttempted || 0} benar
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 hover:border-slate-700 transition-all">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                SRS Dikuasai (Kept)
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-purple-400 mt-0.5">
                {loading ? "-" : stats?.srsKept || 0}
              </h3>
              <p className="text-[11px] text-slate-500">Streak &ge; 5 Benar</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 hover:border-slate-700 transition-all">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Study Streak
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-orange-400 mt-0.5">
                {loading ? "-" : `${stats?.studyStreak || 1} Hari`}
              </h3>
              <p className="text-[11px] text-slate-500">Konsistensi Aktif 🔥</p>
            </div>
          </div>
        </section>

        {/* TIPS & TRIK EDUCATIONAL CALLOUT BANNER */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Pusat Tips & Trik: Kuasai Rumus Sebelum Ujian!
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Wajib Dibaca
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Pelajari pasangan kata keramat (<code className="text-amber-300 font-mono">as ... as</code>, <code className="text-amber-300 font-mono">not only ... but also</code>, <code className="text-amber-300 font-mono">neither ... nor</code>) dan trik eliminasi kilat Part A & B.
              </p>
            </div>
          </div>

          <Link
            to="/tips-trik"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-102 shrink-0"
          >
            <span>Buka Cheat Sheet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* MAIN INTERACTIVE PRACTICE STUDIO (CONFIG & START) */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-7">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Konfigurasi & Mulai Latihan
                </h2>
                <p className="text-xs text-slate-400">
                  Pilih paket soal dan timer yang Anda inginkan sebelum memulai ujian.
                </p>
              </div>
            </div>

            {/* SRS Status Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">SRS Adaptif: Aktif</span>
            </div>
          </div>

          {startError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-center gap-2">
              <span>⚠️</span>
              <span>{startError}</span>
            </div>
          )}

          {/* STEP 1: PAKET JUMLAH SOAL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>Pilih Jumlah Soal</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Terpilih: <strong className="text-white">{resolvedCount} Soal</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {PACK_PRESETS.map((pkg) => {
                const isSelected = questionCount === pkg.count;
                return (
                  <button
                    key={pkg.count}
                    type="button"
                    onClick={() => setQuestionCount(pkg.count)}
                    className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/40"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-[9px] font-black uppercase text-white shadow-md">
                        Favorit
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-base sm:text-lg font-black ${
                          isSelected ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {pkg.label}
                      </span>
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mb-1 ${pkg.badgeColor}`}
                    >
                      {pkg.tag}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{pkg.desc}</p>
                  </button>
                );
              })}

              {/* Custom Count Button */}
              <button
                type="button"
                onClick={() => setQuestionCount("custom")}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  questionCount === "custom"
                    ? "bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/40"
                    : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div>
                  <span
                    className={`text-base font-black ${
                      questionCount === "custom" ? "text-white" : "text-slate-200"
                    }`}
                  >
                    Custom
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">
                    Bebas atur jumlah
                  </span>
                </div>
                <span className="text-[11px] text-blue-400 font-semibold mt-2">
                  Atur Sendiri ⚙️
                </span>
              </button>
            </div>

            {/* Custom Question Count Input */}
            {questionCount === "custom" && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md flex items-center gap-3 animate-fade-in">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={customQuestionCount}
                  onChange={(e) => setCustomQuestionCount(e.target.value)}
                  placeholder="Jumlah soal (1 - 50)"
                  className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-xs text-slate-400 font-medium">soal (maks. 50)</span>
              </div>
            )}
          </div>

          {/* STEP 2: MODE TIMER */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                <span>Pilih Mode Waktu & Timer</span>
              </label>

              <span className="text-[11px] text-slate-400">
                Mode Aktif:{" "}
                <strong className="text-white">
                  {timerCategory === "session"
                    ? `⏱️ Timer Per Sesi (${sessionMinutes === "custom" ? customSessionMinutes : sessionMinutes} Menit)`
                    : timerCategory === "question"
                    ? `⚡ Timer Per Soal (${questionSeconds === "custom" ? customQuestionSeconds : questionSeconds}s / soal)`
                    : "🌿 Tanpa Batas Waktu"}
                </strong>
              </span>
            </div>

            {/* Segmented Category Selector */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl w-full sm:w-fit">
              <button
                type="button"
                onClick={() => setTimerCategory("session")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  timerCategory === "session"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>⏱️</span>
                <span>Timer Per Sesi (Total)</span>
              </button>

              <button
                type="button"
                onClick={() => setTimerCategory("question")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  timerCategory === "question"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>⚡</span>
                <span>Timer Per Soal</span>
              </button>

              <button
                type="button"
                onClick={() => setTimerCategory("none")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  timerCategory === "none"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>🌿</span>
                <span>Tanpa Timer (Zen)</span>
              </button>
            </div>

            {/* TAB CONTENT: 1. TIMER PER SESI */}
            {timerCategory === "session" && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-slate-400">
                  💡 <strong>Timer Per Sesi:</strong> Waktu total dihitung mundur terus untuk keseluruhan sesi ujian (misal 25 menit, 60 menit, atau 120 menit). Timer <strong>tidak me-reset</strong> saat Anda berpindah nomor soal, dan sesi akan selesai otomatis saat total waktu habis.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {SESSION_TIMER_PRESETS.map((t) => {
                    const isSelected = sessionMinutes === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSessionMinutes(t.id)}
                        className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/40"
                            : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                        }`}
                      >
                        {t.isRecommended && (
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-[9px] font-black uppercase text-white shadow-md">
                            Standar
                          </span>
                        )}
                        <div className="text-2xl mb-1.5">{t.icon}</div>
                        <div
                          className={`text-sm font-bold ${
                            isSelected ? "text-white" : "text-slate-200"
                          }`}
                        >
                          {t.title}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
                        <span className="block text-[10px] text-blue-400/90 font-medium mt-1.5">
                          {t.sub}
                        </span>
                      </button>
                    );
                  })}

                  {/* Custom Session Minutes Button */}
                  <button
                    type="button"
                    onClick={() => setSessionMinutes("custom")}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      sessionMinutes === "custom"
                        ? "bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/40"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                    }`}
                  >
                    <div>
                      <div className="text-2xl mb-1.5">⚙️</div>
                      <div
                        className={`text-sm font-bold ${
                          sessionMinutes === "custom" ? "text-white" : "text-slate-200"
                        }`}
                      >
                        Custom Menit
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Atur menit bebas</p>
                    </div>
                    <span className="text-[10px] text-blue-400/90 font-semibold mt-2">
                      Atur Durasi
                    </span>
                  </button>
                </div>

                {/* Custom Session Minutes Input */}
                {sessionMinutes === "custom" && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md flex items-center gap-3 animate-fade-in">
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={customSessionMinutes}
                      onChange={(e) => setCustomSessionMinutes(e.target.value)}
                      placeholder="Total menit sesi (misal 120)"
                      className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">menit total sesi</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 2. TIMER PER SOAL */}
            {timerCategory === "question" && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-slate-400">
                  ⚡ <strong>Timer Per Soal:</strong> Waktu dihitung mundur per butir soal (misal 30 detik atau 45 detik). Timer akan <strong>me-reset kembali</strong> setiap Anda berpindah ke butir soal berikutnya. Cocok untuk melatih ritme kecepatan pengerjaan per item.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {QUESTION_TIMER_PRESETS.map((t) => {
                    const isSelected = questionSeconds === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setQuestionSeconds(t.id)}
                        className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/40"
                            : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                        }`}
                      >
                        {t.isRecommended && (
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-[9px] font-black uppercase text-white shadow-md">
                            Standar
                          </span>
                        )}
                        <div className="text-2xl mb-1.5">{t.icon}</div>
                        <div
                          className={`text-sm font-bold ${
                            isSelected ? "text-white" : "text-slate-200"
                          }`}
                        >
                          {t.title}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
                        <span className="block text-[10px] text-blue-400/90 font-medium mt-1.5">
                          {t.sub}
                        </span>
                      </button>
                    );
                  })}

                  {/* Custom Question Seconds Button */}
                  <button
                    type="button"
                    onClick={() => setQuestionSeconds("custom")}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      questionSeconds === "custom"
                        ? "bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/40"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                    }`}
                  >
                    <div>
                      <div className="text-2xl mb-1.5">⚙️</div>
                      <div
                        className={`text-sm font-bold ${
                          questionSeconds === "custom" ? "text-white" : "text-slate-200"
                        }`}
                      >
                        Custom Detik
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Atur detik bebas</p>
                    </div>
                    <span className="text-[10px] text-blue-400/90 font-semibold mt-2">
                      Atur Detik
                    </span>
                  </button>
                </div>

                {/* Custom Question Seconds Input */}
                {questionSeconds === "custom" && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md flex items-center gap-3 animate-fade-in">
                    <input
                      type="number"
                      min="10"
                      max="300"
                      value={customQuestionSeconds}
                      onChange={(e) => setCustomQuestionSeconds(e.target.value)}
                      placeholder="Detik per soal (misal 30)"
                      className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">detik / soal</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 3. ZEN MODE */}
            {timerCategory === "none" && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3 animate-fade-in">
                <span className="text-2xl">🌿</span>
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">Zen Mode Aktif</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Kerjakan seluruh soal dengan tenang tanpa countdown timer maupun tekanan waktu. Sangat direkomendasikan saat Anda ingin membaca penjelasan dan menganalisis struktur kalimat secara mendalam.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: LIVE SESSION SUMMARY & LAUNCH BUTTON */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/60">
            {/* Live Summary Chips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                📋 Ringkasan Sesi yang Akan Dijalankan:
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                  {resolvedCount} Butir Soal
                </span>
                <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                  {timerCategory === "session"
                    ? `⏱️ Timer Per Sesi: ${sessionMinutes === "custom" ? customSessionMinutes : sessionMinutes} Menit`
                    : timerCategory === "question"
                    ? `⚡ Timer Per Soal: ${questionSeconds === "custom" ? customQuestionSeconds : questionSeconds}s / soal`
                    : "🌿 Zen Mode (Tanpa Timer)"}
                </span>
                {estimatedMinutes && (
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    {timerCategory === "session" ? `Durasi Ujian: ${estimatedMinutes} Menit` : `Estimasi Waktu: ~${estimatedMinutes} Menit`}
                  </span>
                )}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleStartPractice}
              disabled={startLoading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all hover:scale-102 disabled:opacity-50"
            >
              {startLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Mulai Latihan Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* RECENT SESSIONS TABLE */}
        {stats?.recentSessions && stats.recentSessions.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Riwayat Sesi Latihan Terakhir
                </h3>
              </div>
              <span className="text-xs text-slate-400">10 Sesi Terbaru</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Waktu Latihan</th>
                    <th className="py-3 px-4">Jumlah Soal</th>
                    <th className="py-3 px-4">Skor Sec 2 (31-68)</th>
                    <th className="py-3 px-4">Estimasi ITP (310-677)</th>
                    <th className="py-3 px-4">Ekuivalen iBT (0-120)</th>
                    <th className="py-3 px-4 text-right">Status Target ITB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recentSessions.map((session, idx) => (
                    <tr
                      key={session._id || idx}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {new Date(session.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {session.correctAnswers} / {session.totalQuestions} Benar
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-400">
                        {session.scaledScoreSec2}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">
                        {session.estimatedTotalITP}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sky-400">
                        {session.equivalentIBT}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {session.equivalentIBT >= 88 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✅ Lolos Target ITB
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Kurang {88 - session.equivalentIBT} Poin iBT
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
