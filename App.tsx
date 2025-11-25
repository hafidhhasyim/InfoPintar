import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, User, Key } from 'lucide-react';
import { CURRICULUM_DATA, DEFAULT_BANNERS } from './constants';
import { GradeLevel, ViewState, Topic, SubjectModule, BannerImage } from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentView } from './components/StudentView';

const App: React.FC = () => {
  // Data State (Database)
  const [curriculumData, setCurriculumData] = useState<SubjectModule[]>(CURRICULUM_DATA);
  // Initialize bannerImages with localStorage data if available, else defaults
  const [bannerImages, setBannerImages] = useState<BannerImage[]>(() => {
      const stored = localStorage.getItem('bannerImages');
      return stored ? JSON.parse(stored) : DEFAULT_BANNERS;
  });

  // Global View State
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  
  // User Preferences State
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(7);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string>('ocean');
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Quiz Attempts State (Lifted up to manage resets)
  const [quizAttempts, setQuizAttempts] = useState<Record<string, {date: string, score: number}>>({});

  // Load attempts on mount
  useEffect(() => {
    const stored = localStorage.getItem('quizAttempts');
    if (stored) {
      setQuizAttempts(JSON.parse(stored));
    }
  }, []);

  // Sync bannerImages to localStorage whenever it changes
  useEffect(() => {
      localStorage.setItem('bannerImages', JSON.stringify(bannerImages));
  }, [bannerImages]);

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'admin' && loginPassword === 'admin123') {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginError('');
      setViewState(ViewState.ADMIN_DASHBOARD);
    } else {
      setLoginError('Username atau password salah.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewState(ViewState.HOME);
  };

  const handleResetAllAttempts = () => {
      localStorage.removeItem('quizAttempts');
      setQuizAttempts({});
  };

  // Render
  if (viewState === ViewState.ADMIN_DASHBOARD && isLoggedIn) {
    return (
      <AdminDashboard 
        curriculumData={curriculumData}
        setCurriculumData={setCurriculumData}
        bannerImages={bannerImages}
        setBannerImages={setBannerImages}
        onLogout={handleLogout}
        onResetAttempts={handleResetAllAttempts}
      />
    );
  }

  return (
    <>
      <StudentView 
        viewState={viewState}
        setViewState={setViewState}
        curriculumData={curriculumData}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        currentThemeId={currentThemeId}
        setCurrentThemeId={setCurrentThemeId}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        quizAttempts={quizAttempts}
        setQuizAttempts={setQuizAttempts}
        bannerImages={bannerImages}
      />

      {/* Improved Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative transform transition-all scale-100">
              <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30 z-10">
                    <ShieldCheck size={40} className="text-white" />
                  </div>
                  <button 
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-all"
                  >
                    <X size={20} />
                  </button>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-6">
                   <h2 className="text-2xl font-bold text-slate-800">Admin Portal</h2>
                   <p className="text-slate-500 text-sm mt-1">Masuk untuk mengelola konten pembelajaran.</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-5">
                   <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <User size={18} />
                     </div>
                     <input 
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-white"
                       placeholder="Username"
                       value={loginUsername}
                       onChange={e => setLoginUsername(e.target.value)}
                     />
                   </div>
                   <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Key size={18} />
                     </div>
                     <input 
                       type="password"
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-white"
                       placeholder="Password"
                       value={loginPassword}
                       onChange={e => setLoginPassword(e.target.value)}
                     />
                   </div>
                   
                   {loginError && (
                     <div className="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg text-center font-medium border border-red-100 animate-shake">
                        {loginError}
                     </div>
                   )}
                   
                   <button 
                     type="submit"
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                   >
                     <Lock size={16} /> Masuk Dashboard
                   </button>
                </form>
              </div>
              <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                  <p className="text-[10px] text-slate-400">InfoPintar Learning Management System &copy; 2024</p>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default App;