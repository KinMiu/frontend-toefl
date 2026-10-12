import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Lightbulb,
  Search,
  BookOpen,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Link2,
  Check,
  X,
  Target,
  Sliders,
  Table as TableIcon,
  LayoutGrid,
  Filter,
  Eye,
  Info,
} from "lucide-react";

export default function TipsTricksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pairs"); // "pairs" | "partA" | "partB" | "golden" | "all"
  const [pairsViewMode, setPairsViewMode] = useState("cards"); // "cards" | "table"

  // Quick filter keywords
  const QUICK_TAGS = [
    { label: "as ... as", query: "as ... as", tab: "pairs" },
    { label: "neither ... nor", query: "neither", tab: "pairs" },
    { label: "not only ... but also", query: "not only", tab: "pairs" },
    { label: "Inversi (Dibalik)", query: "inversi", tab: "partA" },
    { label: "Reduced Clause", query: "reduced", tab: "partA" },
    { label: "Subject-Verb Agreement", query: "agreement", tab: "partB" },
    { label: "Parallelism", query: "parallel", tab: "partB" },
    { label: "Preposisi + Gerund", query: "gerund", tab: "golden" },
  ];

  // 1. DATA: Pasangan Kata Wajib (Correlative Conjunctions & Paired Words)
  const PAIRED_WORDS = [
    {
      pair: "as ... as",
      meaning: "Sama ... dengan (Perbandingan Setara)",
      formula: "as + [adjective / adverb] + as",
      correct: "Bandung is as cool as Malang during the rainy season.",
      wrong: "Bandung is as cool than Malang during the rainy season.",
      trapExplanation: "Soal TOEFL hampir selalu mengganti kata 'as' kedua dengan 'than' atau 'so'. Ingat: polanya paten 'as ... as'.",
      category: "pairs",
    },
    {
      pair: "not only ... but also",
      meaning: "Tidak hanya ... tetapi juga (Wajib Paralel)",
      formula: "not only [A] but also [B]",
      correct: "She is not only brilliant but also hardworking.",
      wrong: "She is not only brilliant and also hardworking.",
      trapExplanation: "Sering diganti dengan 'and also'. Jika diletakkan di paling depan kalimat, susunan kalimat WAJIB DIBALIK / INVERSI: 'Not only did he win...'",
      category: "pairs",
    },
    {
      pair: "neither ... nor",
      meaning: "Baik ... maupun ... tidak (Keduanya Negatif)",
      formula: "neither [A] nor [B] + Verb (Verb ikut B)",
      correct: "Neither the professor nor the students were present in the hall.",
      wrong: "Neither the professor or the students were present in the hall.",
      trapExplanation: "Ingat prinsip N-N: Neither berpasangan dengan NOR. Pembuat soal sering memasangkannya dengan 'or'.",
      category: "pairs",
    },
    {
      pair: "either ... or",
      meaning: "Bisa ... atau ... (Pilihan salah satu)",
      formula: "either [A] or [B] + Verb (Verb ikut B)",
      correct: "Either the dean or his assistants are going to attend.",
      wrong: "Either the dean nor his assistants are going to attend.",
      trapExplanation: "Jangan tertukar! Either berpasangan dengan OR (tanpa N). Verb ditentukan oleh subjek setelah 'or'.",
      category: "pairs",
    },
    {
      pair: "both ... and",
      meaning: "Kedua-duanya (Subjek Selalu Jamak / Plural)",
      formula: "both [A] and [B] + Verb Plural",
      correct: "Both physics and chemistry are required courses for ITB students.",
      wrong: "Both physics as well as chemistry are required courses.",
      trapExplanation: "Pembuat soal sangat gemar mengganti 'and' dengan 'as well as', 'also', atau 'with'. 'Both' HANYA punya satu pasangan: 'AND'!",
      category: "pairs",
    },
    {
      pair: "between ... and",
      meaning: "Antara ... dan ... (Rentang 2 Entitas)",
      formula: "between [A] and [B]",
      correct: "The laboratory session is held between 09:00 and 11:30.",
      wrong: "The laboratory session is held between 09:00 to 11:30.",
      trapExplanation: "Sering menjebak dengan 'to' atau 'or'. Pasangan BETWEEN adalah AND. Kalau mau pakai 'to', gunakan 'FROM ... TO'.",
      category: "pairs",
    },
    {
      pair: "from ... to",
      meaning: "Dari ... sampai/hingga ...",
      formula: "from [start] to [finish]",
      correct: "The research duration is from January to June.",
      wrong: "The research duration is from January and June.",
      trapExplanation: "Sering dicampur aduk dengan between. Ingat: From ... to, sedangkan Between ... and.",
      category: "pairs",
    },
    {
      pair: "so [adj/adv] that ...",
      meaning: "Sangat ... sehingga ... (Diikuti Adjective Murni)",
      formula: "so + [adjective / adverb] + that + [klausa S+V]",
      correct: "The theorem was so complex that only few researchers solved it.",
      wrong: "The theorem was such complex that only few researchers solved it.",
      trapExplanation: "'So' hanya diikuti kata sifat atau kata keterangan tunggal (tanpa kata benda). Jika ada kata benda, gunakan 'Such'.",
      category: "pairs",
    },
    {
      pair: "such [a/an + noun] that ...",
      meaning: "Sedemikian ... sehingga ... (Diikuti Frasa Benda)",
      formula: "such + (a/an) + [adj + noun] + that + [klausa S+V]",
      correct: "It was such a demanding examination that everyone felt exhausted.",
      wrong: "It was so a demanding examination that everyone felt exhausted.",
      trapExplanation: "Jika ada Noun Phrase ('a demanding examination'), wajib pakai SUCH, bukan SO.",
      category: "pairs",
    },
    {
      pair: "prefer ... to",
      meaning: "Lebih menyukai ... daripada ...",
      formula: "prefer [noun/gerund] to [noun/gerund]",
      correct: "Engineers prefer practical testing to pure mathematical simulation.",
      wrong: "Engineers prefer practical testing than pure mathematical simulation.",
      trapExplanation: "Di tes TOEFL, kata 'prefer' SELALU berpasangan dengan 'to', BUKAN 'than'. 'Than' hanya untuk 'would rather ... than'.",
      category: "pairs",
    },
    {
      pair: "no sooner ... than",
      meaning: "Baru saja ... langsung ... (Pola Inversi Waktu)",
      formula: "No sooner had S + V3 than S + V2",
      correct: "No sooner had the lecture started than the projector malfunctioned.",
      wrong: "No sooner had the lecture started when the projector malfunctioned.",
      trapExplanation: "Pasangan 'No sooner' adalah THAN (karena 'sooner' berbentuk comparative), bukan 'when'.",
      category: "pairs",
    },
    {
      pair: "hardly / scarcely ... when",
      meaning: "Hampir saja / Baru saja ... ketika ...",
      formula: "Hardly had S + V3 when S + V2",
      correct: "Hardly had the rocket launched when telemetry signals stabilized.",
      wrong: "Hardly had the rocket launched than telemetry signals stabilized.",
      trapExplanation: "Berbeda dengan No sooner, kata Hardly dan Scarcely SELALU berpasangan dengan WHEN.",
      category: "pairs",
    },
    {
      pair: "the more ... the more ...",
      meaning: "Semakin ... semakin ... (Double Comparative)",
      formula: "The + [comparative], the + [comparative]",
      correct: "The more rigorous the training is, the better the exam results will be.",
      wrong: "More rigorous the training is, higher the exam results will be.",
      trapExplanation: "Kedua sisi WAJIB diawali dengan artikel 'The' dan bentuk comparative (-er atau more).",
      category: "pairs",
    },
    {
      pair: "whether ... or",
      meaning: "Apakah ... atau ...",
      formula: "whether [A] or [B]",
      correct: "The committee must decide whether to approve or reject the proposal.",
      wrong: "The committee must decide whether to approve nor reject the proposal.",
      trapExplanation: "Whether selalu berpasangan dengan 'or' (bukan nor/and).",
      category: "pairs",
    },
    {
      pair: "one of the + plural noun",
      meaning: "Salah satu dari ... (Benda Jamak, Predikat Tunggal)",
      formula: "One of the + [Noun Plural -s] + [Verb Singular is/was/has]",
      correct: "One of the oldest universities in Indonesia is ITB.",
      wrong: "One of the oldest university in Indonesia are ITB.",
      trapExplanation: "Bendanya harus jamak ('universities'), tetapi kata kerjanya harus tunggal ('is') karena subjek intinya adalah 'One'.",
      category: "pairs",
    },
  ];

  // 2. DATA: Strategi Part A (Sentence Completion No 1-15)
  const PART_A_STRATEGIES = [
    {
      number: "01",
      title: "Hukum Pokok: Hitung Subject & Verb Kalimat",
      summary: "Setiap kalimat bahasa Inggris wajib memiliki minimal 1 Subject dan 1 Verb.",
      formula: "N Kalimat = N Connector + 1 Verb (1 Klausa = 1 S + 1 V)",
      rules: [
        "Jika kalimat di soal belum ada Subject, pilih jawaban yang HANYA berupa Noun/Pronoun.",
        "Jika kalimat sudah memiliki 1 Subject dan 1 Verb tanpa connector, JANGAN PERNAH memilih jawaban yang memiliki Verb lagi (menjadi Double Verb).",
        "Connector (and, but, because, although, that, which) menghubungkan 2 klausa. Tanpa connector, tidak boleh ada 2 verb utama.",
      ],
      sampleQuestion: "_______ in 1920, the Bandung Institute of Technology is Indonesia's oldest engineering school.",
      sampleOptions: [
        { key: "A", text: "Founded", isCorrect: true, reason: "Benar! Reduced passive clause (Which was founded -> Founded)." },
        { key: "B", text: "Was founded", isCorrect: false, reason: "Salah! Double verb dengan 'is'." },
        { key: "C", text: "It was founded", isCorrect: false, reason: "Salah! Double subject (It & ITB) dan double verb." },
        { key: "D", text: "Founding", isCorrect: false, reason: "Salah! Makna aktif (kampus tidak mendirikan dirinya sendiri)." },
      ],
    },
    {
      number: "02",
      title: "Hukum Inversi: Negative Word di Awal Kalimat",
      summary: "Jika kalimat diawali kata keterangan negatif/pembatas, susunan dibalik (Auxiliary sebelum Subject).",
      formula: "Negative Word + Auxiliary (do/did/have/is/can) + Subject + Main Verb",
      rules: [
        "Kata pemicu inversi: Rarely, Seldom, Never, Barely, Scarcely, Hardly, Not only, Under no circumstances, In no way.",
        "Pola biasa: 'We have rarely seen such results.'",
        "Pola inversi: 'Rarely HAVE WE SEEN such results.' (Bukan 'Rarely we have seen').",
        "Di pilihan ganda, cari opsi di mana Auxiliary Verb mendahului Subject!",
      ],
      sampleQuestion: "Rarely _______ such extreme weather fluctuations in West Java.",
      sampleOptions: [
        { key: "A", text: "meteorologists observe", isCorrect: false, reason: "Salah! Belum dibalik (inversi belum terjadi)." },
        { key: "B", text: "do meteorologists observe", isCorrect: true, reason: "Benar! Auxiliary 'do' mendahului subject 'meteorologists'." },
        { key: "C", text: "meteorologists have observed", isCorrect: false, reason: "Salah! Pola kalimat biasa tanpa pembalikan." },
        { key: "D", text: "observation of meteorologists", isCorrect: false, reason: "Salah! Frasa benda tanpa predikat." },
      ],
    },
    {
      number: "03",
      title: "Hukum Appositive: Frasa Keterangan Tambahan",
      summary: "Appositive adalah frasa penjelas yang diapit koma (atau di awal sebelum koma) untuk menerangkan subjek.",
      formula: "[Appositive], Subject + Verb ... ATAU Subject, [Appositive], Verb ...",
      rules: [
        "Appositive BUKAN kalimat mandiri dan TIDAK BOLEH memiliki Main Verb di dalamnya.",
        "Abaikan jebakan pilihan jawaban yang menyelipkan 'is', 'was', atau 'it is'.",
        "Pilihlah frasa kata benda bersih (Clean Noun Phrase).",
      ],
      sampleQuestion: "_______, the Bosscha Observatory attracts astronomers from around the globe.",
      sampleOptions: [
        { key: "A", text: "It is an astronomical landmark in Lembang", isCorrect: false, reason: "Salah! Ada subject 'It' dan verb 'is' (Double subject & verb)." },
        { key: "B", text: "An astronomical landmark in Lembang", isCorrect: true, reason: "Benar! Frasa benda murni tanpa verb untuk menerangkan Bosscha." },
        { key: "C", text: "Because an astronomical landmark", isCorrect: false, reason: "Salah! 'Because' butuh klausa S+V lengkap." },
        { key: "D", text: "Was built as a landmark", isCorrect: false, reason: "Salah! Diawali verb tanpa konektor pasif yang tepat." },
      ],
    },
    {
      number: "04",
      title: "Hukum Reduced Clauses: Pemendekan Anak Kalimat",
      summary: "Anak kalimat yang disingkat menjadi bentuk Participle: Aktif (V-ing) vs Pasif (V-3).",
      formula: "Makna Aktif = V-ing (Present Participle) | Makna Pasif = V-3 (Past Participle)",
      rules: [
        "Trik kilat 10 detik: Lihat subjek setelah tanda koma!",
        "Apakah subjek tersebut MELAKUKAN tindakan? -> Pilih V-ing (Active). Contoh: 'Having finished the thesis, Andi celebrated.'",
        "Apakah subjek tersebut MENERIMA tindakan? -> Pilih V-3 (Passive). Contoh: 'Designed by engineers, the bridge withstands earthquakes.'",
      ],
      sampleQuestion: "_______ by international peer reviewers, the paper was published in a top journal.",
      sampleOptions: [
        { key: "A", text: "Thoroughly evaluated", isCorrect: true, reason: "Benar! Makna pasif: artikel ditinjau (V-3) oleh reviewer." },
        { key: "B", text: "Thoroughly evaluating", isCorrect: false, reason: "Salah! Makna aktif (artikel tidak meninjau dirinya sendiri)." },
        { key: "C", text: "It was thoroughly evaluated", isCorrect: false, reason: "Salah! Double clause tanpa konjungsi penghubung." },
        { key: "D", text: "Evaluation thoroughly", isCorrect: false, reason: "Salah! Susunan kata benda dan adverb tidak tepat." },
      ],
    },
  ];

  // 3. DATA: Strategi Part B (Error Identification No 16-40)
  const PART_B_STRATEGIES = [
    {
      step: "Langkah 1",
      title: "Cek Subject-Verb Agreement (Paling Sering Keluar)",
      description: "Pastikan kata kerja yang digarisbawahi cocok dengan subjek aslinya (tunggal vs jamak).",
      trapPattern: "Pembuat soal menyisipkan frasa preposisi pengacau (Prepositional Phrase) di antara subjek dan predikat.",
      badExample: "The collection [of ancient volcanic rocks] WERE examined by geologists.",
      fixedExample: "The collection [of ancient volcanic rocks] WAS examined by geologists.",
      explanation: "Subjek aslinya adalah 'collection' (tunggal), bukan 'rocks'. Jadi kata kerjanya wajib WAS, bukan were.",
      checklist: [
        "Abaikan semua kata di dalam tanda kurung/preposisi [of...], [in...], [with...], [along with...].",
        "Kata 'Each', 'Every', 'One of', 'Neither of' selalu dianggap TUNGGAL (Verb tunggal: is/was/has/-s).",
      ],
    },
    {
      step: "Langkah 2",
      title: "Cek Word Form (Kelas Kata: Adjective vs Adverb)",
      description: "Deteksi kata sifat (Adjective) dan kata keterangan (Adverb) yang sengaja ditukar.",
      trapPattern: "Menaruh Adjective padahal menerangkan Verb, atau menaruh Adverb padahal menerangkan Noun.",
      badExample: "The research team conducted the experiment EXTREME CAREFUL.",
      fixedExample: "The research team conducted the experiment EXTREMELY CAREFULLY.",
      explanation: "Menerangkan kata kerja 'conducted' wajib menggunakan adverb berakhiran -ly (carefully), bukan kata sifat (careful).",
      checklist: [
        "Adjective menerangkan Noun: 'a rapid calculation'.",
        "Adverb (-ly) menerangkan Verb atau Adjective: 'calculate rapidly', 'remarkably accurate'.",
        "Setelah preposisi (of, for, in, at) wajib NOUN: 'in difficulty' (bukan in difficult).",
      ],
    },
    {
      step: "Langkah 3",
      title: "Cek Parallelism (Kesejajaran Bentuk Gramatikal)",
      description: "Kata yang digabung dengan 'and', 'but', 'or', atau koma beruntun HARUS sejenis.",
      trapPattern: "Memasukkan bentuk lain di antara deretan yang seragam (misal: -ing, -ing, dan to-V1).",
      badExample: "The duties include analyzing data, conducting interviews, and TO WRITE reports.",
      fixedExample: "The duties include analyzing data, conducting interviews, and WRITING reports.",
      explanation: "Semua kata kerja harus sejajar dalam bentuk gerund (-ing): analyzing, conducting, dan writing.",
      checklist: [
        "Pola A, B, and C: jika A dan B berbentuk gerund (-ing), C wajib -ing.",
        "Jika A dan B berbentuk Noun, C wajib Noun. Jangan campur Noun dengan Adjective.",
      ],
    },
    {
      step: "Langkah 4",
      title: "Cek Tingkat Perbandingan (Comparative & Superlative)",
      description: "Mendeteksi kesalahan pola lebih dari (comparative) dan paling (superlative).",
      trapPattern: "Double comparative (misal: 'more faster') atau salah pasangan ('more ... as').",
      badExample: "Titanium is MORE STRONGER than aluminum in structural engineering.",
      fixedExample: "Titanium is STRONGER than aluminum in structural engineering.",
      explanation: "Kata sifat satu suku kata (strong) hanya ditambah akhiran '-er' (stronger). Dilarang menambahkan kata 'more'.",
      checklist: [
        "Dilarang double comparative: SALAH: 'more better', 'more taller'.",
        "1 suku kata = -er than (higher than). 2 suku kata atau lebih = more ... than (more efficient than).",
        "Superlative wajib didahului artikel 'The': 'the most important', 'the fastest'.",
      ],
    },
    {
      step: "Langkah 5",
      title: "Cek Konjungsi vs Preposisi (Klausa S+V vs Noun)",
      description: "Membedakan kata hubung yang butuh Subject + Verb dengan preposisi yang hanya butuh Noun.",
      trapPattern: "Menaruh 'Because' sebelum Noun Phrase, atau menaruh 'Because of' sebelum klausa S+V.",
      badExample: "The outdoor measurement was postponed BECAUSE OF it rained heavily.",
      fixedExample: "The outdoor measurement was postponed BECAUSE it rained heavily.",
      explanation: "Karena diikuti oleh klausa lengkap (Subject 'it' + Verb 'rained'), harus menggunakan konjungsi 'Because', bukan 'Because of'.",
      checklist: [
        "Because / Although / Since / Even though + CLAUSE (S + V).",
        "Because of / Despite / In spite of / Due to + NOUN / NOUN PHRASE.",
      ],
    },
  ];

  // 4. DATA: Rumus Emas (Golden Grammar Rules)
  const GOLDEN_RULES = [
    {
      id: "G1",
      name: "Preposisi + Gerund (V-ing)",
      formula: "Preposition (of, in, on, at, for, by, without, before, after) + V-ing",
      correct: "She succeeded IN SOLVING the differential equation.",
      wrong: "She succeeded in solve (atau to solve) the differential equation.",
      insight: "Semua kata kerja yang terletak langsung setelah kata depan (preposisi) WAJIB berakhiran -ing.",
    },
    {
      id: "G2",
      name: "Modal Auxiliary + Bare Infinitive (V1 Murni)",
      formula: "Modal (can, could, will, would, shall, should, may, might, must) + V1 Murni",
      correct: "The autonomous vehicle MUST COMPLY with traffic safety protocols.",
      wrong: "The autonomous vehicle must complies (atau to comply / complying) with...",
      insight: "Setelah modal auxiliary, kata kerja tidak boleh ditambah -s, -ed, -ing, atau 'to'. Selalu bentuk dasar V1.",
    },
    {
      id: "G3",
      name: "Causative Verbs (Menyuruh Orang Lain)",
      formula: "Make / Have / Let + Orang + V1 (Active) | Get + Orang + TO V1 (Active)",
      correct: "The professor HAD his students REVISE (V1) the laboratory report.",
      wrong: "The professor had his students to revise the laboratory report.",
      insight: "Hafalkan kuncinya: Make, Have, Let pakai V1 murni. Sedangkan GET menggunakan TO V1.",
    },
    {
      id: "G4",
      name: "Subjunctive Mood (Mandat & Tuntutan)",
      formula: "Verb of Urgency (suggest, recommend, insist, require, demand) + that + S + V1 Murni",
      correct: "The dean recommended that every student SUBMIT (bukan submits) the paper on time.",
      wrong: "The dean recommended that every student submits the paper on time.",
      insight: "Meskipun subjeknya tunggal ('every student' atau 'he'), kata kerja tetap V1 dasar tanpa -s karena ada makna anjuran (subjunctive).",
    },
  ];

  // Filter items based on active search
  const filteredPairs = useMemo(() => {
    if (!searchQuery.trim()) return PAIRED_WORDS;
    const q = searchQuery.toLowerCase();
    return PAIRED_WORDS.filter(
      (item) =>
        item.pair.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.formula.toLowerCase().includes(q) ||
        item.correct.toLowerCase().includes(q) ||
        item.wrong.toLowerCase().includes(q) ||
        item.trapExplanation.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredPartA = useMemo(() => {
    if (!searchQuery.trim()) return PART_A_STRATEGIES;
    const q = searchQuery.toLowerCase();
    return PART_A_STRATEGIES.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.formula.toLowerCase().includes(q) ||
        item.sampleQuestion.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredPartB = useMemo(() => {
    if (!searchQuery.trim()) return PART_B_STRATEGIES;
    const q = searchQuery.toLowerCase();
    return PART_B_STRATEGIES.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.badExample.toLowerCase().includes(q) ||
        item.fixedExample.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredGolden = useMemo(() => {
    if (!searchQuery.trim()) return GOLDEN_RULES;
    const q = searchQuery.toLowerCase();
    return GOLDEN_RULES.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.formula.toLowerCase().includes(q) ||
        item.correct.toLowerCase().includes(q) ||
        item.wrong.toLowerCase().includes(q) ||
        item.insight.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalFilteredCount =
    filteredPairs.length + filteredPartA.length + filteredPartB.length + filteredGolden.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 md:pb-16">
        {/* COMPACT & ELEGANT HERO SECTION */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/25 p-5 sm:p-7 shadow-xl">
          <div className="absolute top-0 right-0 w-72 h-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>TOEFL ITP ITB • Cheat Sheet & Formula Guide</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pusat Rumus & Pola Jebakan Ujian 💡
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Kuasai pasangan kata keramat, rumus kilat Structure (Part A), dan eliminasi sistematis Written Expression (Part B) sebelum masuk ke ruang latihan.
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
              <div className="text-left sm:text-right">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                  Target Skor ITB
                </span>
                <span className="text-lg sm:text-xl font-black text-amber-400">ITP 580 / iBT 88</span>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-102"
              >
                <span>Mulai Latihan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* SEARCH BAR & QUICK TAGS */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci rumus (misal: 'as', 'neither', 'inversion', 'reduced', 'agreement')..."
              className="w-full pl-10 pr-20 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Quick Filter Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3 h-3 text-blue-400" /> Cepat:
            </span>
            {QUICK_TAGS.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(tag.query);
                  setActiveTab(tag.tab);
                }}
                className={`px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap transition-all ${
                  searchQuery === tag.query
                    ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </section>

        {/* STICKY TOP CATEGORY NAVIGATION TABS (CLEAN & DEDICATED) */}
        <section className="sticky top-16 z-30 bg-slate-950/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-slate-800/80 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
            {[
              { id: "pairs", label: "🔗 Pasangan Kata", count: filteredPairs.length },
              { id: "partA", label: "⚡ Trik Part A (Structure)", count: filteredPartA.length },
              { id: "partB", label: "🔍 Trik Part B (Written Exp)", count: filteredPartB.length },
              { id: "golden", label: "🏆 Rumus Emas", count: filteredGolden.length },
              { id: "all", label: "✨ Semua", count: totalFilteredCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border shrink-0 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 1: PASANGAN KATA WAJIB (PAIRED WORDS)                            */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "pairs") && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span>1. Pasangan Kata Wajib (Correlative Conjunctions)</span>
                  </h2>
                  <span className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {filteredPairs.length} Pola
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Pasangan paten ini tidak boleh tertukar. Soal TOEFL hampir selalu menguji dengan menukar pasangannya!
                </p>
              </div>

              {/* DEDICATED VIEW MODE SWITCHER (KARTU VS TABEL) */}
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <span className="text-xs font-semibold text-slate-400">Mode Tampilan:</span>
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setPairsViewMode("cards")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      pairsViewMode === "cards"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Kartu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPairsViewMode("table")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      pairsViewMode === "table"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Tabel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TABLE VIEW (Active on toggle) */}
            {pairsViewMode === "table" ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Pasangan Paten</th>
                      <th className="py-3 px-4">Arti & Pola Rumus</th>
                      <th className="py-3 px-4 text-emerald-400">Contoh Benar ✅</th>
                      <th className="py-3 px-4 text-red-400">Jebakan Sering Keluar ❌</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredPairs.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-xs whitespace-nowrap align-top">
                          {item.pair}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 align-top space-y-1">
                          <p className="font-medium text-white">{item.meaning}</p>
                          <code className="text-[11px] text-sky-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 block w-fit">
                            {item.formula}
                          </code>
                        </td>
                        <td className="py-3.5 px-4 text-slate-200 align-top">
                          <p className="text-emerald-300/90 font-medium italic">"{item.correct}"</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 align-top space-y-1">
                          <p className="text-red-300/90 font-medium line-through italic">"{item.wrong}"</p>
                          <p className="text-[11px] text-slate-400">{item.trapExplanation}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* CARD VIEW (Default, responsive for all screens) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPairs.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md flex flex-col justify-between space-y-3.5"
                  >
                    {/* Card Header: Pair & Meaning */}
                    <div className="space-y-1 pb-2.5 border-b border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm sm:text-base font-black text-amber-400 px-2.5 py-1 bg-amber-500/10 border border-amber-500/25 rounded-lg">
                          {item.pair}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Pasangan Paten
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-200 pt-1">
                        {item.meaning}
                      </p>
                    </div>

                    {/* Formula */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Rumus Bentuk:
                      </span>
                      <code className="px-2.5 py-1.5 bg-slate-950 border border-slate-800/80 rounded-lg text-sky-300 font-mono text-xs block font-semibold">
                        {item.formula}
                      </code>
                    </div>

                    {/* Benar vs Salah Box */}
                    <div className="space-y-2 text-xs">
                      {/* Correct */}
                      <div className="p-2.5 rounded-xl bg-emerald-950/25 border border-emerald-500/25 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Contoh Benar:
                        </span>
                        <p className="text-emerald-200/90 font-medium italic pl-4">
                          "{item.correct}"
                        </p>
                      </div>

                      {/* Wrong / Trap */}
                      <div className="p-2.5 rounded-xl bg-red-950/25 border border-red-500/25 space-y-1">
                        <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 uppercase tracking-wider">
                          <X className="w-3.5 h-3.5 text-red-400" /> Jebakan Sering Keluar:
                        </span>
                        <p className="text-red-200/90 font-medium line-through italic pl-4">
                          "{item.wrong}"
                        </p>
                      </div>
                    </div>

                    {/* Trap Explanation */}
                    <div className="pt-1 flex items-start gap-1.5 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                      <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] sm:text-xs leading-relaxed text-slate-300">
                        {item.trapExplanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: STRATEGI PART A (STRUCTURE / SENTENCE COMPLETION)             */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "partA") && (
          <section className="space-y-4 pt-2">
            <div className="pb-1">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>2. Strategi Kilat Part A: Sentence Completion (No. 1–15)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Trik menganalisis kelengkapan Subject, Verb, dan Clause dalam waktu 15–20 detik per soal.
              </p>
            </div>

            <div className="space-y-4">
              {filteredPartA.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg hover:border-slate-700/80 transition-all"
                >
                  {/* Header with Step Number */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-black text-sm flex items-center justify-center shrink-0">
                        {item.number}
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">{item.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Formula */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Pola Rumus Utama:
                    </span>
                    <code className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono text-xs sm:text-sm block font-bold">
                      {item.formula}
                    </code>
                  </div>

                  {/* Execution Rules */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Langkah & Aturan Eksekusi:
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {item.rules.map((r, rIdx) => (
                        <li
                          key={rIdx}
                          className="flex items-start gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real Question Dissection */}
                  {item.sampleQuestion && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block mb-1">
                          Bedah Soal Nyata:
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-white italic">
                          "{item.sampleQuestion}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        {item.sampleOptions.map((opt) => (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-lg border flex flex-col justify-between space-y-1 ${
                              opt.isCorrect
                                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                                : "bg-slate-900/60 border-slate-800 text-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold font-mono">
                                ({opt.key}) {opt.text}
                              </span>
                              {opt.isCorrect && (
                                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                                  Benar
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] opacity-90 leading-tight">{opt.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: STRATEGI PART B (WRITTEN EXPRESSION / ERROR IDENTIFICATION)    */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "partB") && (
          <section className="space-y-4 pt-2">
            <div className="pb-1">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>3. Strategi Sistematis Part B: Written Expression (No. 16–40)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Langkah berurutan untuk mendeteksi 1 pilihan kata bergaris bawah yang keliru tanpa perlu membaca arti seluruh kalimat.
              </p>
            </div>

            <div className="space-y-4">
              {filteredPartB.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg hover:border-slate-700/80 transition-all"
                >
                  {/* Step Badge & Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-xs rounded-lg uppercase tracking-wider">
                        {item.step}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Contrast Box: Salah vs Benar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/25 space-y-1">
                      <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Kalimat Salah di Soal:
                      </span>
                      <p className="text-red-200 font-mono line-through italic">
                        "{item.badExample}"
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Perbaikan yang Benar:
                      </span>
                      <p className="text-emerald-200 font-mono italic">
                        "{item.fixedExample}"
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-white">Alasan Mengapa Salah: </strong>
                      {item.explanation}
                    </p>
                  </div>

                  {/* Checklist Points */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Kaidah Pemeriksaan:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {item.checklist.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: RUMUS EMAS (GOLDEN GRAMMAR RULES)                              */}
        {/* ========================================================================= */}
        {(activeTab === "all" || activeTab === "golden") && (
          <section className="space-y-4 pt-2">
            <div className="pb-1">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>4. Daftar Rumus Emas TOEFL (*Golden Grammar Rules*)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Rumus paten yang langsung menghasilkan jawaban benar tanpa perlu menebak arti kalimat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGolden.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 space-y-3.5 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-bold text-purple-300">
                        {item.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase rounded-md">
                        Paten
                      </span>
                    </div>

                    <code className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs block font-bold">
                      {item.formula}
                    </code>

                    <div className="space-y-1.5 text-xs pt-1">
                      <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                          Benar:
                        </span>
                        <p className="italic">"{item.correct}"</p>
                      </div>

                      <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200">
                        <span className="text-[10px] font-bold uppercase text-red-400 block">
                          Salah:
                        </span>
                        <p className="line-through italic">"{item.wrong}"</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                    💡 <strong className="text-slate-200">Kunci: </strong>
                    {item.insight}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM PRACTICE CALLOUT BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-950/50 border border-blue-500/30 p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 max-w-xl mx-auto">
            <h3 className="text-base sm:text-xl font-bold text-white">
              Siap Menerapkan Rumus di Soal Asli? 🚀
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Uji reflek Anda sekarang. Sistem Spaced Repetition (SRS) akan otomatis mengulang rumus yang sering salah hingga Anda mahir mencapai target ITP 580+.
            </p>
          </div>

          <div className="pt-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-102"
            >
              <span>Buka Ruang Latihan TOEFL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
