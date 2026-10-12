import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import Navbar from "../components/Navbar";
import {
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const resultData = location.state?.resultData;

  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "wrong" | "correct"
  const [retryLoading, setRetryLoading] = useState(false);
  const [retryError, setRetryError] = useState("");

  if (!resultData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-4">Data hasil latihan tidak ditemukan.</p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const {
    totalQuestions,
    correctAnswers,
    accuracyPercentage,
    scaledScoreSec2,
    estimatedTotalITP,
    equivalentIBT,
    targetITB,
    topicDiagnostics = [],
    wrongQuestionIds = [],
    reviewItems = [],
  } = resultData;

  const handleRetryWrong = async () => {
    if (wrongQuestionIds.length === 0) return;
    setRetryError("");
    setRetryLoading(true);

    try {
      const res = await apiClient.post("/practice/retry-wrong", {
        questionIds: wrongQuestionIds,
      });

      if (res.data.success) {
        navigate("/practice", {
          state: {
            sessionData: res.data.data,
            timePerQuestionSec: null, // Zen mode for retry practice
          },
        });
      }
    } catch (err) {
      setRetryError(
        err.response?.data?.message || "Gagal memuat soal yang salah."
      );
      setRetryLoading(false);
    }
  };

  const filteredReviewItems = reviewItems.filter((item) => {
    if (activeFilter === "wrong") return !item.isCorrect;
    if (activeFilter === "correct") return item.isCorrect;
    return true;
  });

  const safeTopics = topicDiagnostics.filter((t) => t.isMastered);
  const needPracticeTopics = topicDiagnostics.filter((t) => !t.isMastered);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 lg:pb-8">
        {/* Header & Target Benchmark Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-300 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Ringkasan Evaluasi Skor Resmi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Hasil Latihan TOEFL ITP Section 2
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {correctAnswers} benar dari {totalQuestions} soal • Akurasi {accuracyPercentage}%
              </p>
            </div>

            {/* ITB Benchmark Status Card */}
            <div
              className={`flex-shrink-0 p-4 sm:p-5 rounded-2xl border flex items-center gap-4 ${
                targetITB?.isPassingIBT
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-950/40 border-amber-500/30 text-amber-300"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                  targetITB?.isPassingIBT
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold tracking-wider opacity-80">
                  Status Standar ITB (Target iBT 88)
                </p>
                <h3 className="text-base sm:text-lg font-black mt-0.5">
                  {targetITB?.isPassingIBT ? "Lolos Target Masuk ITB! 🎉" : "Perlu Sedikit Peningkatan"}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  {targetITB?.isPassingIBT
                    ? `Performa ekuivalen iBT ${equivalentIBT} telah melampaui target 88.`
                    : `Selisih ${targetITB?.gapIBT} poin iBT dari target beasiswa.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Scores Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Scaled Score Section 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-2 hover:border-slate-700 transition-all">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Skor Section 2 (Structure)
            </span>
            <div className="text-4xl sm:text-5xl font-black text-blue-400">
              {scaledScoreSec2}
            </div>
            <p className="text-[11px] text-slate-400">Skala Resmi ETS 31–68</p>
          </div>

          {/* Estimated Total TOEFL ITP */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-2 hover:border-slate-700 transition-all">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Estimasi Total TOEFL ITP
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-400">
              {estimatedTotalITP}
            </div>
            <p className="text-[11px] text-slate-400">Skala 310–677 (Target: 570–580)</p>
          </div>

          {/* Equivalent TOEFL iBT */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-2 hover:border-slate-700 transition-all">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ekuivalensi Skor TOEFL iBT
            </span>
            <div className="text-4xl sm:text-5xl font-black text-sky-400">
              {equivalentIBT}
            </div>
            <p className="text-[11px] text-slate-400">Skala 0–120 (Target ITB: 88+)</p>
          </div>
        </section>

        {/* Quick Actions Bar */}
        <section className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            {wrongQuestionIds.length > 0 ? (
              <button
                type="button"
                onClick={handleRetryWrong}
                disabled={retryLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-102 disabled:opacity-50"
              >
                {retryLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Latih Khusus Soal yang Salah Barusan ({wrongQuestionIds.length} Soal)</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Sempurna! Semua soal dijawab benar.
              </span>
            )}
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </section>

        {retryError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
            {retryError}
          </div>
        )}

        {/* Diagnostic Grammar Topics Breakdown */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>Diagnosa Penguasaan per Topik Grammar</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topik Aman */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Kategori Topik Aman (&ge;70%)
                </span>
                <span className="text-xs text-slate-400">{safeTopics.length} Topik</span>
              </div>

              {safeTopics.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Belum ada topik yang mencapai akurasi &ge;70%. Terus berlatih!
                </p>
              ) : (
                <div className="space-y-2.5">
                  {safeTopics.map((topic) => (
                    <div
                      key={topic.topic}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-200">{topic.topic}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {topic.correct}/{topic.total} Benar
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {topic.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Topik Butuh Latihan */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Butuh Latihan Tambahan (&lt;70%)
                </span>
                <span className="text-xs text-slate-400">{needPracticeTopics.length} Topik</span>
              </div>

              {needPracticeTopics.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Hebat! Tidak ada topik dengan kelemahan kritis di sesi ini.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {needPracticeTopics.map((topic) => (
                    <div
                      key={topic.topic}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-200">{topic.topic}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {topic.correct}/{topic.total} Benar
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {topic.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Detailed Question Review List */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Pembahasan Lengkap per Soal</span>
            </h2>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === "all"
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Semua ({reviewItems.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("wrong")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === "wrong"
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Salah ({wrongQuestionIds.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("correct")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === "correct"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Benar ({correctAnswers})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviewItems.map((item, idx) => (
              <div
                key={item.questionId || idx}
                className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                  item.isCorrect
                    ? "bg-slate-900/70 border-emerald-500/20"
                    : "bg-slate-900/90 border-red-500/30 shadow-lg shadow-red-500/5"
                }`}
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.isCorrect
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {item.isCorrect ? "✓" : "✗"}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Soal #{idx + 1} • {item.topic}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                      item.isCorrect
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.isCorrect ? "Benar" : "Salah"}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-sm sm:text-base font-medium text-slate-100 mb-4 leading-relaxed">
                  {item.question}
                </p>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {["A", "B", "C", "D"].map((k) => {
                    const text = item.options[k];
                    const isUserChoice = item.selectedAnswer === k;
                    const isCorrectAnswer = item.correctAnswer === k;

                    let optBorder = "border-slate-800 bg-slate-950/40 text-slate-400";
                    if (isCorrectAnswer) {
                      optBorder = "border-emerald-500 bg-emerald-500/10 text-emerald-200 font-semibold";
                    } else if (isUserChoice && !item.isCorrect) {
                      optBorder = "border-red-500 bg-red-500/10 text-red-200 font-semibold";
                    }

                    return (
                      <div
                        key={k}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optBorder}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold opacity-80">{k}.</span>
                          <span>{text}</span>
                        </div>
                        {isCorrectAnswer && (
                          <span className="text-[10px] font-bold uppercase text-emerald-400">
                            (Kunci Benar)
                          </span>
                        )}
                        {isUserChoice && !isCorrectAnswer && (
                          <span className="text-[10px] font-bold uppercase text-red-400">
                            (Pilihan Anda)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Indonesian Explanation Box */}
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 space-y-1">
                  <p className="font-bold text-blue-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Pembahasan & Rumus Grammar:
                  </p>
                  <p className="leading-relaxed opacity-90">{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
