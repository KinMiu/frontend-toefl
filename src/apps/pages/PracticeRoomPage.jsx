import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertTriangle,
  Send,
  Grid,
  X,
  BookOpen,
} from "lucide-react";

export default function PracticeRoomPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve practice questions and timer config from location state
  const sessionData = location.state?.sessionData;
  const timePerQuestionSec =
    location.state?.timePerQuestionSec || sessionData?.timePerQuestionSec || null;

  const questions = sessionData?.questions || [];
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: "A" | "B" | "C" | "D" }
  const [flags, setFlags] = useState({}); // { [questionId]: boolean }
  const [timeLeft, setTimeLeft] = useState(timePerQuestionSec);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const activeQuestion = questions[currentIndex];

  // If no questions, redirect back to dashboard
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate("/dashboard");
    }
  }, [questions, navigate]);

  // Reset or run countdown timer when question changes (if timer mode enabled)
  useEffect(() => {
    if (!timePerQuestionSec) return;

    setTimeLeft(timePerQuestionSec);

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto advance to next question when timer runs out
          if (currentIndex < totalQuestions - 1) {
            setCurrentIndex((curr) => curr + 1);
          }
          return timePerQuestionSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentIndex, timePerQuestionSec, totalQuestions]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key) && activeQuestion) {
        handleSelectAnswer(activeQuestion._id, key);
      } else if (e.key === "ArrowRight" && currentIndex < totalQuestions - 1) {
        setCurrentIndex((curr) => curr + 1);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((curr) => curr - 1);
      } else if (e.key.toLowerCase() === "r" && activeQuestion) {
        toggleFlag(activeQuestion._id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, activeQuestion, totalQuestions]);

  const handleSelectAnswer = (qId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionKey,
    }));
  };

  const toggleFlag = (qId) => {
    setFlags((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = Object.values(flags).filter(Boolean).length;

  const handleSubmit = async () => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || null,
      }));

      const res = await apiClient.post("/practice/submit", {
        answers: payloadAnswers,
        timePerQuestionSec,
      });

      if (res.data.success) {
        navigate("/results", {
          state: {
            resultData: res.data.data,
          },
        });
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Gagal mengirim jawaban. Silakan coba lagi."
      );
      setIsSubmitting(false);
    }
  };

  if (!activeQuestion) {
    return null;
  }

  /**
   * Helper parser for Error Identification format: `[word](A)`
   * Converts bracketed tokens to clickable underlined markers with letter badges
   */
  const renderQuestionText = (text, type, qId) => {
    if (type !== "error_identification") {
      return (
        <p className="text-base sm:text-xl font-medium text-slate-100 leading-relaxed">
          {text}
        </p>
      );
    }

    const regex = /\[(.*?)\]\(([A-D])\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = regex.lastIndex;

      if (matchStart > lastIndex) {
        parts.push(text.substring(lastIndex, matchStart));
      }

      const word = match[1];
      const letter = match[2];
      const isSelected = answers[qId] === letter;

      parts.push(
        <button
          key={`${letter}-${matchStart}`}
          type="button"
          onClick={() => handleSelectAnswer(qId, letter)}
          className={`inline-flex flex-col items-center mx-1 my-0.5 px-2 py-0.5 rounded-lg border transition-all ${
            isSelected
              ? "bg-blue-600/30 border-blue-400 text-blue-200 shadow-sm shadow-blue-500/20"
              : "bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200"
          }`}
        >
          <span className="font-semibold underline underline-offset-4 decoration-2 decoration-blue-400 text-sm sm:text-base">
            {word}
          </span>
          <span
            className={`text-[9px] sm:text-[10px] font-extrabold uppercase mt-0.5 px-1 rounded ${
              isSelected ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            ({letter})
          </span>
        </button>
      );

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <div className="text-base sm:text-xl font-medium text-slate-100 leading-loose">
        {parts}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 pt-[max(0.6rem,env(safe-area-inset-top))]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Question Index Badge & Mobile Palette Trigger */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold">
              {currentIndex + 1} / {totalQuestions}
            </span>

            {/* Mobile Palette Button */}
            <button
              type="button"
              onClick={() => setIsMobilePaletteOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 active:scale-95 transition-all"
            >
              <Grid className="w-3.5 h-3.5 text-blue-400" />
              <span>Kisi Soal</span>
            </button>
          </div>

          {/* Timer Display */}
          {timePerQuestionSec && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-all ${
                timeLeft <= 10
                  ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                  : "bg-slate-800 border-slate-700 text-slate-200"
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>
                {Math.floor(timeLeft / 60)}:
                {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
              </span>
            </div>
          )}

          {/* Selesai / Submit Button */}
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            <span>Selesai</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace (With padding-bottom on mobile for thumb bar) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 pb-28 lg:pb-8">
        {/* Center: Question & Options (3 Cols) */}
        <main className="lg:col-span-3 space-y-4 sm:space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative">
            {/* Question Type & Topic Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    activeQuestion.type === "sentence_completion"
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {activeQuestion.type === "sentence_completion"
                    ? "Part A: Sentence Completion"
                    : "Part B: Error Identification"}
                </span>

                <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] sm:text-xs font-semibold">
                  {activeQuestion.topic}
                </span>
              </div>

              {/* Desktop Ragu-ragu Button */}
              <button
                type="button"
                onClick={() => toggleFlag(activeQuestion._id)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  flags[activeQuestion._id]
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flags[activeQuestion._id] ? "Ragu-ragu" : "Tandai Ragu"}</span>
              </button>
            </div>

            {/* Question Body */}
            <div className="min-h-[100px] mb-6 sm:mb-8">
              {renderQuestionText(activeQuestion.question, activeQuestion.type, activeQuestion._id)}
            </div>

            {/* Answer Options A, B, C, D */}
            <div className="space-y-2.5 sm:space-y-3">
              {["A", "B", "C", "D"].map((optKey) => {
                const optText = activeQuestion.options[optKey];
                const isSelected = answers[activeQuestion._id] === optKey;

                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelectAnswer(activeQuestion._id, optKey)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex items-start gap-3 sm:gap-4 active:scale-[0.99] ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/15"
                        : "bg-slate-950/70 border-slate-800/90 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {optKey}
                    </div>
                    <span className="text-xs sm:text-base font-medium leading-relaxed pt-0.5">
                      {optText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Bottom Nav Buttons */}
            <div className="hidden lg:flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentIndex((curr) => Math.max(0, curr - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentIndex < totalQuestions - 1) {
                    setCurrentIndex((curr) => curr + 1);
                  } else {
                    setIsSubmitModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-102"
              >
                <span>{currentIndex === totalQuestions - 1 ? "Periksa & Selesai" : "Selanjutnya"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Desktop Sidebar: Question Palette Grid */}
        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3">Kisi Navigasi Soal</h3>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700"></span>
                <span>Belum ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-600"></span>
                <span>Terjawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                <span>Ragu-ragu ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-blue-600 border border-blue-400"></span>
                <span>Aktif</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q._id];
                const isFlagged = !!flags[q._id];

                let colorClasses =
                  "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500";
                if (isFlagged) {
                  colorClasses = "bg-amber-500/20 text-amber-400 border-amber-500/60 font-bold";
                } else if (isAnswered) {
                  colorClasses = "bg-emerald-600/30 text-emerald-300 border-emerald-500/40 font-bold";
                }

                if (isCurrent) {
                  colorClasses =
                    "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50 font-black scale-105 shadow-md";
                }

                return (
                  <button
                    key={q._id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl border text-xs font-medium flex items-center justify-center transition-all ${colorClasses}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* PWA MOBILE FIXED THUMB NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-2xl">
        <button
          type="button"
          onClick={() => setCurrentIndex((curr) => Math.max(0, curr - 1))}
          disabled={currentIndex === 0}
          className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold disabled:opacity-30 flex items-center justify-center gap-1 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelum</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFlag(activeQuestion._id)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 active:scale-95 ${
            flags[activeQuestion._id]
              ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
              : "bg-slate-800 text-slate-400 border-slate-700"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>{flags[activeQuestion._id] ? "Ragu" : "Tandai"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (currentIndex < totalQuestions - 1) {
              setCurrentIndex((curr) => curr + 1);
            } else {
              setIsSubmitModalOpen(true);
            }
          }}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-1 active:scale-95"
        >
          <span>{currentIndex === totalQuestions - 1 ? "Selesai" : "Lanjut"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* PWA MOBILE BOTTOM SHEET / MODAL KISI SOAL */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-400" />
                <span>Kisi Navigasi Nomor Soal</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsMobilePaletteOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 py-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q._id];
                const isFlagged = !!flags[q._id];

                let colorClasses =
                  "bg-slate-800 text-slate-300 border-slate-700";
                if (isFlagged) {
                  colorClasses = "bg-amber-500/20 text-amber-400 border-amber-500/60 font-bold";
                } else if (isAnswered) {
                  colorClasses = "bg-emerald-600/30 text-emerald-300 border-emerald-500/40 font-bold";
                }

                if (isCurrent) {
                  colorClasses =
                    "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50 font-black scale-105";
                }

                return (
                  <button
                    key={q._id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsMobilePaletteOpen(false);
                    }}
                    className={`h-11 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${colorClasses}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsMobilePaletteOpen(false)}
                className="w-full py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Tutup Kisi Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Selesaikan Latihan?</h3>
                <p className="text-xs text-slate-400">Hasil dan skor TOEFL ITP akan langsung dikalkulasi.</p>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Masih ada <strong>{unansweredCount} soal</strong> belum dijawab.
                </span>
              </div>
            )}

            {submitError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {submitError}
              </div>
            )}

            <div className="py-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Total Soal:</span>
                <span className="font-bold text-white">{totalQuestions}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Terjawab:</span>
                <span className="font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Ditandai Ragu:</span>
                <span className="font-bold text-amber-400">{flaggedCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Kirim Jawaban</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
