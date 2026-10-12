import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import Navbar from "../components/Navbar";
import {
  Users,
  BookOpen,
  Download,
  Upload,
  Plus,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users"); // "users" | "questions"

  // User Monitoring State
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [resetModalUser, setResetModalUser] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState("itb2026pass");
  const [resetStatus, setResetStatus] = useState("");

  // Question Bank State
  const [questionList, setQuestionList] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);

  // Excel Import State
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState("");

  // Manual Add Question Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: "sentence_completion",
    topic: "Inversion",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    answer: "A",
    explanation: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const res = await apiClient.get("/admin/users");
      if (res.data.success) {
        setUserData(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setQuestionLoading(true);
      const params = {
        limit: 100,
        topic: selectedTopic !== "all" ? selectedTopic : undefined,
        type: selectedType !== "all" ? selectedType : undefined,
        search: questionSearch.trim() || undefined,
      };

      const res = await apiClient.get("/questions", { params });
      if (res.data.success) {
        setQuestionList(res.data.data.questions);
        setTotalQuestions(res.data.data.total);
        if (res.data.data.availableTopics) {
          setAvailableTopics(res.data.data.availableTopics);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil daftar soal:", err);
    } finally {
      setQuestionLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchQuestions();
    }
  }, [activeTab, selectedTopic, selectedType]);

  const handleAdminResetPassword = async (e) => {
    e.preventDefault();
    if (!resetModalUser) return;
    setResetStatus("");

    try {
      const res = await apiClient.post("/admin/reset-password", {
        userId: resetModalUser._id,
        newPassword: temporaryPassword,
      });

      if (res.data.success) {
        setResetStatus(`Berhasil! Password baru: ${temporaryPassword}`);
        fetchUsers();
        setTimeout(() => {
          setResetModalUser(null);
          setResetStatus("");
        }, 2500);
      }
    } catch (err) {
      setResetStatus(err.response?.data?.message || "Gagal mereset password.");
    }
  };

  const handleDownloadTemplate = () => {
    const downloadUrl = `${apiClient.defaults.baseURL}/questions/template-excel`;
    const token = localStorage.getItem("toefl_token");

    fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Template_Soal_TOEFL_ITP.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => console.error("Download failed:", err));
  };

  const handleImportExcel = async (e) => {
    e.preventDefault();
    if (!importFile) return;
    setImportError("");
    setImportResult(null);
    setImportLoading(true);

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const res = await apiClient.post("/questions/import-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setImportResult(res.data.data);
        setImportFile(null);
        fetchQuestions();
      }
    } catch (err) {
      setImportError(
        err.response?.data?.message || "Gagal mengimpor file Excel."
      );
    } finally {
      setImportLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Hapus soal ini dari bank soal?")) return;

    try {
      const res = await apiClient.delete(`/questions/${id}`);
      if (res.data.success) {
        fetchQuestions();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus soal.");
    }
  };

  const handleCreateManualQuestion = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const payload = {
        section: "structure",
        type: newQuestion.type,
        topic: newQuestion.topic,
        question: newQuestion.question,
        options: {
          A: newQuestion.option_a,
          B: newQuestion.option_b,
          C: newQuestion.option_c,
          D: newQuestion.option_d,
        },
        answer: newQuestion.answer,
        explanation: newQuestion.explanation,
        source: "manual",
        is_reference: true,
      };

      const res = await apiClient.post("/questions", payload);
      if (res.data.success) {
        setIsAddModalOpen(false);
        setNewQuestion({
          type: "sentence_completion",
          topic: "Inversion",
          question: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          answer: "A",
          explanation: "",
        });
        fetchQuestions();
      }
    } catch (err) {
      setAddError(err.response?.data?.message || "Gagal menambahkan soal.");
    } finally {
      setAddLoading(false);
    }
  };

  const filteredUsers = (userData?.users || []).filter((u) => {
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 lg:pb-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Administrator Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manajemen Pengguna, Pengaturan Password Darurat, dan Pengelolaan Bank Soal
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "users"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Monitoring User</span>
              {userData?.resetRequestsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("questions")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "questions"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Bank Soal & Import</span>
            </button>
          </div>
        </div>

        {/* TAB 1: USER MONITORING */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Metric Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase font-semibold">Total Pengguna Terdaftar</p>
                <p className="text-3xl font-extrabold text-white mt-1">
                  {userData?.totalUsers || 0}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs text-amber-400 uppercase font-semibold">Permintaan Reset Password</p>
                <p className="text-3xl font-extrabold text-amber-400 mt-1">
                  {userData?.resetRequestsCount || 0}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs text-blue-400 uppercase font-semibold">Administrator</p>
                <p className="text-3xl font-extrabold text-blue-400 mt-1">
                  {userData?.adminCount || 0}
                </p>
              </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-base font-bold text-white">Daftar Akun Pengguna</h2>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Cari nama atau email..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Nama</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status Reset</th>
                      <th className="py-3 px-4">Temp Password</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">{u.name}</td>
                        <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              u.role === "admin"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.resetPasswordRequest ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Meminta Reset
                            </span>
                          ) : (
                            <span className="text-slate-400">Normal</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">
                          {u.tempPassword || "-"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setResetModalUser(u);
                              setTemporaryPassword("itb" + Math.floor(1000 + Math.random() * 9000));
                              setResetStatus("");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold text-xs transition-colors"
                          >
                            Set Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUESTION BANK & EXCEL IMPORT */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            {/* Excel Import & Download Template Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Import Card (2 Cols) */}
              <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Import Soal Bulk (Excel / CSV)</h2>
                    <p className="text-xs text-slate-400">
                      Upload file .xlsx untuk memasukkan puluhan soal Section 2 sekaligus.
                    </p>
                  </div>
                </div>

                {importError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                    {importError}
                  </div>
                )}

                {importResult && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Berhasil mengimpor {importResult.insertedCount} dari {importResult.totalRows} baris soal!
                    </p>
                    {importResult.errors && importResult.errors.length > 0 && (
                      <p className="text-amber-300 text-[11px]">
                        Catatan: Ada {importResult.errors.length} baris yang dilewati karena format tidak valid.
                      </p>
                    )}
                  </div>
                )}

                <form onSubmit={handleImportExcel} className="space-y-3">
                  <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-center bg-slate-950/40 transition-colors">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={(e) => setImportFile(e.target.files[0] || null)}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500 mt-2">
                      Format kolom yang didukung: Type, Topic, Question, Option_A, Option_B, Option_C, Option_D, Answer, Explanation.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Format Contoh Excel</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!importFile || importLoading}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                    >
                      {importLoading ? "Mengimpor..." : "Proses & Simpan ke DB"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Actions (1 Col) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Tambah Soal Satuan</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ingin menambahkan 1 soal spesifik secara manual lengkap dengan penjelasan?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Soal Manual</span>
                </button>
              </div>
            </div>

            {/* Questions Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">Bank Soal Section 2</h2>
                  <p className="text-xs text-slate-400">Total {totalQuestions} Soal Terdaftar</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="all">Semua Topik Grammar</option>
                    {availableTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="all">Semua Tipe</option>
                    <option value="sentence_completion">Sentence Completion (Part A)</option>
                    <option value="error_identification">Error Identification (Part B)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Tipe</th>
                      <th className="py-3 px-4">Topik</th>
                      <th className="py-3 px-4">Pertanyaan</th>
                      <th className="py-3 px-4">Kunci</th>
                      <th className="py-3 px-4">Sumber</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {questionList.map((q) => (
                      <tr key={q._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.type === "sentence_completion"
                                ? "bg-sky-500/10 text-sky-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {q.type === "sentence_completion" ? "Part A" : "Part B"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{q.topic}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-md truncate">
                          {q.question}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">{q.answer}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              q.source === "manual"
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-purple-500/10 text-purple-400"
                            }`}
                          >
                            {q.source}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q._id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Temporary Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-400" />
              <span>Reset Password: {resetModalUser.name}</span>
            </h3>

            <p className="text-xs text-slate-400">
              Tentukan temporary password baru untuk akun <strong>{resetModalUser.email}</strong>.
            </p>

            {resetStatus && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                {resetStatus}
              </div>
            )}

            <form onSubmit={handleAdminResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Temporary Password Baru
                </label>
                <input
                  type="text"
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Simpan & Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Manual Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 my-8">
            <h3 className="text-lg font-bold text-white">Tambah Soal Section 2 Manual</h3>

            {addError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateManualQuestion} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tipe Soal</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="sentence_completion">Sentence Completion (Part A)</option>
                    <option value="error_identification">Error Identification (Part B)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Topik Grammar</label>
                  <input
                    type="text"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    required
                    placeholder="Misal: Inversion, Reduced Clause"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Teks Soal (Gunakan [word](A) untuk Part B)
                </label>
                <textarea
                  rows="3"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  required
                  placeholder="The [ancient](A) manuscript was discovered [in](B) 1920..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Opsi A</label>
                  <input
                    type="text"
                    value={newQuestion.option_a}
                    onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Opsi B</label>
                  <input
                    type="text"
                    value={newQuestion.option_b}
                    onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Opsi C</label>
                  <input
                    type="text"
                    value={newQuestion.option_c}
                    onChange={(e) => setNewQuestion({ ...newQuestion, option_c: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Opsi D</label>
                  <input
                    type="text"
                    value={newQuestion.option_d}
                    onChange={(e) => setNewQuestion({ ...newQuestion, option_d: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block font-semibold text-slate-300 mb-1">Kunci Jawaban</label>
                  <select
                    value={newQuestion.answer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block font-semibold text-slate-300 mb-1">
                    Pembahasan (Bahasa Indonesia)
                  </label>
                  <input
                    type="text"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    required
                    placeholder="Rumus grammar dan alasan jawaban benar..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {addLoading ? "Menyimpan..." : "Simpan Soal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
