import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Home, BookOpen, MessageSquare, Search, Settings, ArrowLeft, Check, 
  SearchX, LogOut, Lock, HelpCircle, ClipboardList, GraduationCap, Info, X, ChevronRight, ChevronLeft 
} from 'lucide-react';
import { ViewState, GradeLevel, Topic, SubjectModule, ThemeConfig, QuizQuestion, BannerImage } from '../types';
import { TopicCard } from './TopicCard';
import { THEMES } from '../constants';
import { chatWithTutor } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Footer } from './Footer';

interface StudentViewProps {
  viewState: ViewState;
  setViewState: (view: ViewState) => void;
  curriculumData: SubjectModule[];
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic | null) => void;
  currentThemeId: string;
  setCurrentThemeId: (id: any) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  quizAttempts: Record<string, {date: string, score: number}>;
  setQuizAttempts: React.Dispatch<React.SetStateAction<Record<string, {date: string, score: number}>>>;
  bannerImages: BannerImage[];
}

const HomeBannerSlider = ({ images }: { images: BannerImage[] }) => {
    const [curr, setCurr] = useState(0);
    const autoSlideInterval = useRef<any>(null);

    const next = () => setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1));
    const prev = () => setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1));

    useEffect(() => {
        if (images.length > 1) {
            autoSlideInterval.current = setInterval(next, 5000);
        }
        return () => {
            if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
        }
    }, [curr, images.length]);

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg mb-8 group">
            <div 
                className="flex transition-transform ease-out duration-500 h-full" 
                style={{ transform: `translateX(-${curr * 100}%)` }}
            >
                {images.map((img) => (
                    <div key={img.id} className="min-w-full h-full relative">
                        <img src={img.url} alt="Banner" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            {img.title && <h2 className="text-white font-bold text-xl md:text-2xl shadow-black drop-shadow-md">{img.title}</h2>}
                        </div>
                    </div>
                ))}
            </div>
            
            {images.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {images.map((_, i) => (
                            <div 
                                key={i} 
                                className={`transition-all w-2 h-2 rounded-full bg-white ${curr === i ? "p-1" : "bg-opacity-50"}`} 
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export const StudentView: React.FC<StudentViewProps> = ({
  viewState, setViewState, curriculumData, selectedGrade, setSelectedGrade,
  selectedTopic, setSelectedTopic, currentThemeId, setCurrentThemeId,
  isLoggedIn, onLoginClick, onLogout, quizAttempts, setQuizAttempts, bannerImages
}) => {
  const [activeMaterialTab, setActiveMaterialTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quiz State
  const [showStudentQuizModal, setShowStudentQuizModal] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const theme = THEMES[currentThemeId] || THEMES.ocean;
  const subjects = useMemo(() => curriculumData.filter(s => s.grade === selectedGrade), [curriculumData, selectedGrade]);

  useEffect(() => {
    setActiveMaterialTab(0);
  }, [selectedTopic]);

  // --- Helpers ---
  const saveQuizAttempt = (materialId: string, score: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newAttempts = { ...quizAttempts, [materialId]: { date: today, score } };
    setQuizAttempts(newAttempts);
    localStorage.setItem('quizAttempts', JSON.stringify(newAttempts));
  };

  const isQuizAvailable = (materialId: string) => {
    const attempt = quizAttempts[materialId];
    if (!attempt) return true;
    const today = new Date().toISOString().split('T')[0];
    return attempt.date !== today;
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    const results: any[] = [];
    
    curriculumData.forEach(module => {
      module.topics.forEach(topic => {
        if (topic.title.toLowerCase().includes(query)) {
          results.push({ topic, grade: module.grade, matchType: 'title' });
        } else if (topic.description.toLowerCase().includes(query)) {
          results.push({ topic, grade: module.grade, matchType: 'description' });
        } else if (topic.contentSummary.toLowerCase().includes(query)) {
           results.push({ topic, grade: module.grade, matchType: 'content' });
        }
      });
    });
    return results.sort((a, b) => {
      const priority: any = { title: 0, description: 1, content: 2 };
      return priority[a.matchType] - priority[b.matchType];
    });
  }, [searchQuery, curriculumData]);

  // --- Handlers ---
  const handleTopicClick = (topic: Topic) => {
    // Refresh topic data from source
    const freshTopic = curriculumData.flatMap(m => m.topics).find(t => t.id === topic.id) || topic;
    setSelectedTopic(freshTopic);
    setViewState(ViewState.TOPIC_DETAIL);
    setShowStudentQuizModal(false);
  };

  const handleStartQuiz = () => {
    if (!selectedTopic) return;
    const materials = selectedTopic.materials || [];
    const activeMaterial = materials[activeMaterialTab];
    if (!activeMaterial) return;

    if (!isQuizAvailable(activeMaterial.id)) {
      alert("Kamu sudah mengerjakan kuis ini hari ini. Coba lagi besok ya!");
      return;
    }

    setQuizLoading(true);
    setShowStudentQuizModal(true);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setShowQuizResult(false);
    
    let questions: QuizQuestion[] = activeMaterial.quizzes || [];
    setQuizQuestions(questions);
    setQuizLoading(false);
  };

  const handleAnswerQuiz = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === quizQuestions[currentQuestionIndex].correctAnswerIndex;
    
    setTimeout(() => {
        if (isCorrect) setQuizScore(p => p + 1);
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(p => p + 1);
            setSelectedAnswer(null);
        } else {
            setShowQuizResult(true);
            const finalScore = isCorrect ? quizScore + 1 : quizScore;
            const materials = selectedTopic?.materials || [];
            const activeMaterial = materials[activeMaterialTab];
            if(activeMaterial) saveQuizAttempt(activeMaterial.id, finalScore);
        }
    }, 1200); 
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    const apiHistory = chatHistory.map(h => ({ role: h.role, parts: [{ text: h.text }] }));
    const response = await chatWithTutor(apiHistory, userMsg);
    
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setChatLoading(false);
  };

  // --- Sub-Render Functions ---

  const renderSidebar = () => (
    <div className="hidden md:flex flex-col w-72 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 z-50 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h1 className={`text-2xl font-bold ${theme.text} tracking-tight flex items-center gap-2`}>
          <div className={`w-8 h-8 rounded-lg ${theme.primary} flex items-center justify-center text-white`}>
            <BookOpen size={18} />
          </div>
          InfoPintar
        </h1>
        <p className="text-xs text-slate-500 mt-2 ml-1">Platform Belajar Informatika SMP</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: ViewState.HOME, label: 'Beranda', icon: Home },
          { id: ViewState.TOPIC_LIST, label: 'Materi Pelajaran', icon: BookOpen },
          { id: ViewState.SEARCH, label: 'Pencarian', icon: Search },
          { id: ViewState.AI_TUTOR, label: 'Tanya AI Tutor', icon: MessageSquare },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setViewState(item.id)} 
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl text-sm font-medium transition-all duration-200 
              ${(viewState === item.id || (item.id === ViewState.TOPIC_LIST && viewState === ViewState.TOPIC_DETAIL))
                ? `${theme.secondary} ${theme.text} shadow-sm` 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <item.icon size={20} className={viewState === item.id ? 'fill-current opacity-20' : ''} strokeWidth={viewState === item.id ? 2.5 : 2} /> 
            {item.label}
          </button>
        ))}
        
        {isLoggedIn && (
          <button 
            onClick={() => setViewState(ViewState.ADMIN_DASHBOARD)} 
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl text-sm font-medium transition-all duration-200 mt-4 border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50`}
          >
            <Settings size={20} /> 
            Dashboard Admin
          </button>
        )}
      </nav>
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button 
          onClick={() => setViewState(ViewState.SETTINGS)}
          className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors ${viewState === ViewState.SETTINGS ? theme.lightText : ''}`}
        >
          <Settings size={20} /> Pengaturan
        </button>

        {isLoggedIn ? (
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        ) : (
          <button 
            onClick={onLoginClick}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Lock size={20} /> Admin Login
          </button>
        )}
      </div>
    </div>
  );

  const renderBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-slate-200 pb-safe z-50 transition-all duration-300 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-16 px-2">
        <button onClick={() => setViewState(ViewState.HOME)} className={`relative flex flex-col items-center justify-center gap-1 p-2 w-full transition-colors rounded-xl ${viewState === ViewState.HOME ? theme.lightText : 'text-slate-400 hover:text-slate-600'}`}>
          <Home size={24} strokeWidth={viewState === ViewState.HOME ? 2.5 : 2} className="z-10" />
          <span className="text-[10px] font-bold z-10">Beranda</span>
        </button>
        
        <button onClick={() => setViewState(ViewState.SEARCH)} className={`relative flex flex-col items-center justify-center gap-1 p-2 w-full transition-colors rounded-xl ${viewState === ViewState.SEARCH ? theme.lightText : 'text-slate-400 hover:text-slate-600'}`}>
          <Search size={24} strokeWidth={viewState === ViewState.SEARCH ? 2.5 : 2} className="z-10" />
          <span className="text-[10px] font-bold z-10">Cari</span>
        </button>

        <button onClick={() => setViewState(ViewState.TOPIC_LIST)} className={`relative flex flex-col items-center justify-center gap-1 p-2 w-full transition-colors rounded-xl ${(viewState === ViewState.TOPIC_LIST || viewState === ViewState.TOPIC_DETAIL) ? theme.lightText : 'text-slate-400 hover:text-slate-600'}`}>
          <BookOpen size={24} strokeWidth={(viewState === ViewState.TOPIC_LIST || viewState === ViewState.TOPIC_DETAIL) ? 2.5 : 2} className="z-10" />
          <span className="text-[10px] font-bold z-10">Materi</span>
        </button>
        
        {isLoggedIn ? (
          <button onClick={() => setViewState(ViewState.ADMIN_DASHBOARD)} className={`relative flex flex-col items-center justify-center gap-1 p-2 w-full transition-colors rounded-xl ${viewState === ViewState.ADMIN_DASHBOARD ? theme.lightText : 'text-slate-400 hover:text-slate-600'}`}>
            <Settings size={24} strokeWidth={viewState === ViewState.ADMIN_DASHBOARD ? 2.5 : 2} className="z-10" />
            <span className="text-[10px] font-bold z-10">Admin</span>
          </button>
        ) : (
          <button onClick={() => setViewState(ViewState.AI_TUTOR)} className={`relative flex flex-col items-center justify-center gap-1 p-2 w-full transition-colors rounded-xl ${viewState === ViewState.AI_TUTOR ? theme.lightText : 'text-slate-400 hover:text-slate-600'}`}>
            <MessageSquare size={24} strokeWidth={viewState === ViewState.AI_TUTOR ? 2.5 : 2} className="z-10" />
            <span className="text-[10px] font-bold z-10">Tutor</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderQuizModal = () => {
    if (!showStudentQuizModal) return null;
    const safeQuizLength = quizQuestions.length || 1;

    return (
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                   <HelpCircle size={18} />
                </div>
                <span className="font-bold text-slate-700">Kuis Singkat</span>
             </div>
             <button onClick={() => setShowStudentQuizModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                <X size={20} />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
             {!showQuizResult ? (
                <div className="max-w-xl mx-auto">
                   <div className="mb-8">
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                         <span>Pertanyaan {currentQuestionIndex + 1}</span>
                         <span>{quizQuestions.length} Total</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                      </div>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{quizQuestions[currentQuestionIndex]?.question}</h3>
                   <div className="space-y-3">
                      {quizQuestions[currentQuestionIndex]?.options.map((opt, idx) => (
                         <button key={idx} onClick={() => handleAnswerQuiz(idx)} disabled={selectedAnswer !== null} className={`w-full p-4 rounded-xl text-left font-medium border-2 transition-all duration-200 flex items-center justify-between ${selectedAnswer === null ? 'bg-white border-slate-200 hover:border-blue-300 text-slate-700 shadow-sm' : idx === quizQuestions[currentQuestionIndex].correctAnswerIndex ? 'bg-green-50 border-green-500 text-green-700' : selectedAnswer === idx ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            <span>{opt}</span>
                            {selectedAnswer !== null && idx === quizQuestions[currentQuestionIndex].correctAnswerIndex && <Check size={20} className="text-green-600"/>}
                            {selectedAnswer === idx && idx !== quizQuestions[currentQuestionIndex].correctAnswerIndex && <X size={20} className="text-red-600"/>}
                         </button>
                      ))}
                   </div>
                   {selectedAnswer !== null && (
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-slide-up">
                         <div className="flex items-center gap-2 text-blue-700 font-bold mb-1 text-sm"><Info size={16} /> Penjelasan:</div>
                         <p className="text-blue-600 text-sm">{quizQuestions[currentQuestionIndex].explanation}</p>
                      </div>
                   )}
                </div>
             ) : (
                <div className="text-center py-8 animate-scale-up">
                   <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ring-8 ring-orange-50"><GraduationCap size={48} className="text-white" /></div>
                   <h2 className="text-3xl font-bold text-slate-800 mb-2">Kuis Selesai!</h2>
                   <div className="flex justify-center gap-4 mb-8">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-32"><div className="text-xs text-slate-400 font-bold uppercase mb-1">Nilai Akhir</div><div className="text-4xl font-black text-blue-600">{Math.round((quizScore / safeQuizLength) * 100)}</div></div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-32"><div className="text-xs text-slate-400 font-bold uppercase mb-1">Benar</div><div className="text-4xl font-black text-green-600">{quizScore}/{quizQuestions.length}</div></div>
                   </div>
                   <button onClick={() => { setShowStudentQuizModal(false); setViewState(ViewState.TOPIC_DETAIL); }} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 w-full max-w-xs">Tutup</button>
                </div>
             )}
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---
  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 pb-16 md:pb-0 md:pl-72 selection:${theme.primary} selection:text-white`}>
      {renderSidebar()}
      <main className="min-h-screen">
        {viewState === ViewState.HOME && (
            <div className="p-6 max-w-4xl mx-auto pb-24 animate-fade-in">
                <header className="mb-8 mt-4 flex justify-between items-center">
                    <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang 👋</h1>
                    <p className="text-slate-600">Pilih kelasmu untuk mulai belajar.</p>
                    </div>
                    <button onClick={() => setViewState(ViewState.SETTINGS)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors md:hidden"><Settings className="w-6 h-6 text-slate-600" /></button>
                </header>
                
                <HomeBannerSlider images={bannerImages} />

                <div onClick={() => setViewState(ViewState.SEARCH)} className="md:hidden mb-8 bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
                    <Search className="text-slate-400" size={20} />
                    <span className="text-slate-400 text-sm">Cari materi pelajaran...</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[GradeLevel.Grade7, GradeLevel.Grade8, GradeLevel.Grade9].map((grade) => (
                    <div key={grade} onClick={() => { setSelectedGrade(grade); setViewState(ViewState.TOPIC_LIST); }} className={`group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer ${theme.accent} hover:shadow-lg transition-all relative overflow-hidden`}>
                        <div className={`w-14 h-14 ${theme.secondary} rounded-2xl flex items-center justify-center ${theme.text} font-bold text-xl mb-4 group-hover:${theme.primary} group-hover:text-white transition-colors duration-300`}>{grade}</div>
                        <h2 className="text-xl font-bold text-slate-800 relative z-10">Kelas {grade}</h2>
                        <p className="text-slate-500 text-sm mt-2 relative z-10 line-clamp-2">{grade === 7 ? 'Dasar TIK, Hardware & Software' : grade === 8 ? 'Jaringan Internet & Algoritma' : 'Data, Dampak Sosial & Hukum Digital'}</p>
                        <div className={`mt-6 flex items-center ${theme.lightText} text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>Mulai Belajar <ArrowLeft className="rotate-180 ml-2 w-4 h-4" /></div>
                    </div>
                    ))}
                </div>
            </div>
        )}

        {/* ... Rest of the render methods (TOPIC_LIST, SEARCH, AI_TUTOR, SETTINGS, TOPIC_DETAIL) remain largely the same ... */}
        {viewState === ViewState.TOPIC_LIST && (
            <div className="p-4 max-w-3xl mx-auto pb-32 animate-fade-in">
                <div className="flex items-center gap-4 mb-8 sticky top-0 bg-slate-50/95 backdrop-blur-md py-4 z-20 -mx-4 px-4 border-b border-slate-100 md:static md:bg-transparent md:border-0 md:p-0">
                    <button onClick={() => setViewState(ViewState.HOME)} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Materi Kelas {selectedGrade}</h2>
                        <p className={`text-xs font-medium ${theme.lightText} uppercase tracking-wider`}>Kurikulum Merdeka</p>
                    </div>
                </div>
                <div className="space-y-8">
                    {subjects.map(subject => (
                    <div key={subject.id}>
                        <div className="flex items-center gap-2 mb-4"><div className={`h-6 w-1 rounded-full ${theme.primary}`}></div><h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{subject.title}</h3></div>
                        <div className="grid gap-3">{subject.topics.map(topic => (<TopicCard key={topic.id} topic={topic} onClick={() => handleTopicClick(topic)} />))}</div>
                    </div>
                    ))}
                    {subjects.length === 0 && <div className="text-center py-10 text-slate-400"><p>Belum ada modul untuk kelas ini.</p></div>}
                </div>
            </div>
        )}

        {viewState === ViewState.TOPIC_DETAIL && selectedTopic && (
            <div className="bg-white min-h-screen pb-32 animate-slide-up">
                <div className="h-64 w-full relative overflow-hidden group">
                    <img src={`https://picsum.photos/seed/${selectedTopic.id}/800/400`} alt="Topic Illustration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                        <div className="flex gap-2 mb-2"><span className={`px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm text-[10px] font-bold border border-white/10`}>KELAS {selectedGrade}</span><span className={`px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm text-[10px] font-bold border border-white/10`}>MODUL INTERAKTIF</span></div>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2 text-white shadow-black drop-shadow-md">{selectedTopic.title}</h1>
                    </div>
                    <button onClick={() => setViewState(ViewState.TOPIC_LIST)} className="absolute top-4 left-4 p-2 bg-black/20 rounded-full text-white backdrop-blur-md hover:bg-black/40 transition-all"><ArrowLeft size={24} /></button>
                </div>
                <div className="max-w-3xl mx-auto p-6 -mt-6 relative z-20 bg-white rounded-t-3xl md:rounded-none md:mt-0 min-h-[60vh]">
                    {selectedTopic.materials && selectedTopic.materials.length > 1 && (
                        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-2 border-b border-slate-100">
                            {selectedTopic.materials.map((mat, idx) => (
                                <button key={mat.id} onClick={() => setActiveMaterialTab(idx)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeMaterialTab === idx ? `${theme.primary} text-white shadow-md` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{mat.title}</button>
                            ))}
                        </div>
                    )}
                    {selectedTopic.materials?.[activeMaterialTab]?.assignments?.length > 0 && (
                        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-3"><ClipboardList size={18}/> Tugas Kamu</h3>
                            <div className="space-y-3">
                                {selectedTopic.materials[activeMaterialTab].assignments.map(asg => (
                                    <div key={asg.id} className="bg-white p-3 rounded-lg border border-yellow-100 shadow-sm">
                                        <div className="flex justify-between items-start"><h4 className="font-bold text-slate-800 text-sm">{asg.title}</h4>{asg.dueDate && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Deadline: {asg.dueDate}</span>}</div>
                                        <p className="text-xs text-slate-600 mt-1">{asg.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="animate-fade-in">
                        <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800 prose-img:rounded-xl prose-img:shadow-lg prose-video:w-full prose-video:rounded-xl">
                            <div dangerouslySetInnerHTML={{ __html: selectedTopic.materials?.[activeMaterialTab]?.content || 'Materi belum tersedia' }} />
                        </div>
                    </div>
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center">
                        <div className={`w-16 h-16 ${theme.secondary} ${theme.text} rounded-full flex items-center justify-center mx-auto mb-4`}><Check size={32} strokeWidth={3} /></div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Materi Selesai!</h3>
                        {selectedTopic.materials?.[activeMaterialTab]?.quizzes?.length > 0 ? (
                            <>
                                <div className="text-slate-500 mb-6">
                                    {isQuizAvailable(selectedTopic.materials[activeMaterialTab].id) ? <p>Uji pemahamanmu tentang materi ini dengan kuis singkat.</p> : (
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-sm">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">Hasil Kuis Hari Ini</p>
                                            <div className="flex items-baseline justify-center gap-1"><span className="text-3xl font-black text-blue-600">{quizAttempts[selectedTopic.materials[activeMaterialTab].id]?.score}</span><span className="text-sm font-bold text-slate-400">/ {selectedTopic.materials[activeMaterialTab].quizzes.length} Benar</span></div>
                                            <p className="text-xs text-slate-400 mt-2">Kembali lagi besok untuk mengulang!</p>
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleStartQuiz} disabled={!isQuizAvailable(selectedTopic.materials[activeMaterialTab].id)} className={`w-full md:w-auto ${isQuizAvailable(selectedTopic.materials[activeMaterialTab].id) ? `${theme.primary} ${theme.primaryHover}` : 'bg-slate-300 cursor-not-allowed'} text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-900/5 transition-all flex items-center justify-center gap-2 active:scale-95`}><BookOpen size={20} />{isQuizAvailable(selectedTopic.materials[activeMaterialTab].id) ? "Mulai Kuis" : "Kuis Selesai Hari Ini"}</button>
                            </>
                        ) : <p className="text-slate-400 text-sm">Belum ada kuis untuk materi ini.</p>}
                    </div>
                </div>
            </div>
        )}

        {viewState === ViewState.SEARCH && (
            <div className="p-6 max-w-3xl mx-auto pb-24 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Pencarian</h2>
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Cari materi, kuis, atau topik..." className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg bg-white text-slate-800 placeholder-slate-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                </div>
                <div className="space-y-4">
                    {searchQuery.length > 1 && searchResults.length === 0 && <div className="text-center py-12 text-slate-400"><SearchX size={48} className="mx-auto mb-4 opacity-50" /><p>Tidak ditemukan hasil untuk "{searchQuery}"</p></div>}
                    {searchResults.map((res, idx) => (
                        <div key={`${res.topic.id}-${idx}`} onClick={() => handleTopicClick(res.topic)} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-300 cursor-pointer flex gap-4 transition-all">
                            <div className={`w-2 h-full rounded-full ${res.grade === 7 ? 'bg-blue-500' : res.grade === 8 ? 'bg-emerald-500' : 'bg-violet-500'}`}></div>
                            <div>
                                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-500">Kelas {res.grade}</span>{res.matchType !== 'title' && <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded capitalize">Match in {res.matchType}</span>}</div>
                                <h3 className="font-bold text-slate-800">{res.topic.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{res.topic.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {viewState === ViewState.AI_TUTOR && (
            <div className="flex flex-col h-screen md:h-[calc(100vh-20px)] bg-slate-50 pb-20 md:pb-4 max-w-5xl mx-auto">
                <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3 sticky top-0 z-10 md:rounded-b-2xl shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md"><MessageSquare className="text-white" size={20} /></div>
                    <div><h2 className="font-bold text-slate-800">Tutor AI</h2><p className="text-xs text-slate-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online</p></div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.length === 0 && <div className="text-center py-20 opacity-50"><MessageSquare size={48} className="mx-auto mb-4 text-slate-300" /><p className="text-slate-500">Halo! Saya Tutor AI.<br/>Tanyakan apa saja tentang pelajaran Informatika.</p></div>}
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'}`}><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                        </div>
                    ))}
                    {chatLoading && <div className="flex justify-start"><div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex gap-2 items-center"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div></div></div>}
                </div>
                <div className="p-4 bg-white border-t border-slate-200 md:rounded-t-2xl">
                    <div className="flex gap-2">
                        <input className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ketik pertanyaanmu..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                        <button onClick={handleSendMessage} disabled={!chatInput.trim() || chatLoading} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20"><ArrowLeft size={20} className="rotate-90" /></button>
                    </div>
                </div>
            </div>
        )}

        {viewState === ViewState.SETTINGS && (
            <div className="p-6 max-w-2xl mx-auto pb-24 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Pengaturan</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 text-sm">Tema Aplikasi</div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.values(THEMES).map(t => (
                            <button key={t.id} onClick={() => setCurrentThemeId(t.id)} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${currentThemeId === t.id ? `border-current ${t.text} bg-slate-50` : 'border-slate-100 hover:border-slate-200'}`}><div className={`w-8 h-8 rounded-full ${t.primary}`}></div><span className="text-xs font-medium">{t.name}</span></button>
                        ))}
                    </div>
                </div>
                {!isLoggedIn && <button onClick={onLoginClick} className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition shadow-lg"><Lock size={18} /> Login Admin</button>}
                {isLoggedIn && <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">A</div><div><div className="font-bold text-green-800">Admin Logged In</div><div className="text-xs text-green-600">Akses penuh ke dashboard</div></div></div><button onClick={onLogout} className="text-sm font-bold text-red-500 hover:text-red-700">Logout</button></div>}
            </div>
        )}
      </main>
      {/* Footer Integration */}
      {viewState !== ViewState.ADMIN_DASHBOARD && viewState !== ViewState.AI_TUTOR && <Footer />}
      {renderBottomNav()}
      {renderQuizModal()}
    </div>
  );
};