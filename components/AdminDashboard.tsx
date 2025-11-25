import React, { useState } from 'react';
import { 
  LayoutDashboard, Search, PlusCircle, FolderPlus, Trash2, LogOut, 
  PanelLeftClose, FileText, Check, ClipboardList, Save, 
  PanelRightClose, PanelRightOpen, Type, ImageIcon, Info, AlignLeft, X, RefreshCcw, Layers, BookOpen, GraduationCap, Image, Edit2
} from 'lucide-react';
import { Topic, SubjectModule, GradeLevel, QuizQuestion, Assignment, TopicMaterial, BannerImage } from '../types';
import { AVAILABLE_ICONS } from '../constants';
import { RichTextEditor } from './RichTextEditor';
import { 
  Cpu, Network, Code, Database, Shield, Layout, Workflow, Disc, BarChart, Scale, MousePointer, 
  Calendar as CalendarIcon, Terminal, Cloud, Server, Smartphone, Tablet, HardDrive, Printer, 
  Speaker, Video, Camera, MessageSquare, Mail, User, Globe, Monitor,
  Binary, Brain, Bug, CircuitBoard, Command, FileCode, Fingerprint, Gamepad2, 
  GitBranch, Headphones, Key, Laptop, Lightbulb, Link, Mic, Music, PenTool, 
  Power, Radio, Save, Settings, Signal, Table, Tag, Wrench, Trash, Tv, Upload, Zap
} from 'lucide-react';

// Constants for Admin Tabs
enum AdminMaterialMode {
  CONTENT = 'CONTENT',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT'
}

const getIconComponent = (name: string, size = 20) => {
    switch (name) {
      case 'cpu': return <Cpu size={size} />;
      case 'network': return <Network size={size} />;
      case 'code': return <Code size={size} />;
      case 'database': return <Database size={size} />;
      case 'shield': return <Shield size={size} />;
      case 'layout': return <Layout size={size} />;
      case 'folder': return <FileText size={size} />;
      case 'calendar': return <CalendarIcon size={size} />;
      case 'workflow': return <Workflow size={size} />;
      case 'disc': return <Disc size={size} />;
      case 'bar-chart': return <BarChart size={size} />;
      case 'scale': return <Scale size={size} />;
      case 'lock': return <Shield size={size} />;
      case 'mouse': return <MousePointer size={size} />;
      
      // New Icons
      case 'monitor': return <Monitor size={size} />;
      case 'wifi': return <Network size={size} />;
      case 'terminal': return <Terminal size={size} />;
      case 'cloud': return <Cloud size={size} />;
      case 'server': return <Server size={size} />;
      case 'smartphone': return <Smartphone size={size} />;
      case 'tablet': return <Tablet size={size} />;
      case 'hard-drive': return <HardDrive size={size} />;
      case 'printer': return <Printer size={size} />;
      case 'speaker': return <Speaker size={size} />;
      case 'video': return <Video size={size} />;
      case 'camera': return <Camera size={size} />;
      case 'message-square': return <MessageSquare size={size} />;
      case 'mail': return <Mail size={size} />;
      case 'user': return <User size={size} />;
      case 'globe': return <Globe size={size} />;
      case 'binary': return <Binary size={size} />;
      case 'brain': return <Brain size={size} />;
      case 'bug': return <Bug size={size} />;
      case 'circuit-board': return <CircuitBoard size={size} />;
      case 'command': return <Command size={size} />;
      case 'file-code': return <FileCode size={size} />;
      case 'fingerprint': return <Fingerprint size={size} />;
      case 'gamepad-2': return <Gamepad2 size={size} />;
      case 'git-branch': return <GitBranch size={size} />;
      case 'headphones': return <Headphones size={size} />;
      case 'key': return <Key size={size} />;
      case 'laptop': return <Laptop size={size} />;
      case 'lightbulb': return <Lightbulb size={size} />;
      case 'link': return <Link size={size} />;
      case 'mic': return <Mic size={size} />;
      case 'music': return <Music size={size} />;
      case 'pen-tool': return <PenTool size={size} />;
      case 'power': return <Power size={size} />;
      case 'radio': return <Radio size={size} />;
      case 'save': return <Save size={size} />;
      case 'settings': return <Settings size={size} />;
      case 'signal': return <Signal size={size} />;
      case 'table': return <Table size={size} />;
      case 'tag': return <Tag size={size} />;
      case 'tool': return <Wrench size={size} />;
      case 'trash': return <Trash size={size} />;
      case 'tv': return <Tv size={size} />;
      case 'type': return <Type size={size} />;
      case 'upload': return <Upload size={size} />;
      case 'zap': return <Zap size={size} />;
      
      default: return <FileText size={size} />;
    }
};

interface AdminDashboardProps {
  curriculumData: SubjectModule[];
  setCurriculumData: React.Dispatch<React.SetStateAction<SubjectModule[]>>;
  bannerImages: BannerImage[];
  setBannerImages: React.Dispatch<React.SetStateAction<BannerImage[]>>;
  onLogout: () => void;
  onResetAttempts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    curriculumData, setCurriculumData, bannerImages, setBannerImages, onLogout, onResetAttempts 
}) => {
  // Admin Dashboard State
  const [adminEditingTopic, setAdminEditingTopic] = useState<Topic | null>(null);
  const [adminMaterialMode, setAdminMaterialMode] = useState<AdminMaterialMode>(AdminMaterialMode.CONTENT);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  
  // Modal Inputs
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicModuleId, setNewTopicModuleId] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleGrade, setNewModuleGrade] = useState<GradeLevel>(7);
  
  // Banner Input
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [newBannerTitle, setNewBannerTitle] = useState('');
  
  // Layout State - Right sidebar collapsed by default
  const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState(false);
  const [adminRightSidebarCollapsed, setAdminRightSidebarCollapsed] = useState(true);
  const [adminTopicSearch, setAdminTopicSearch] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Perubahan berhasil disimpan!');
  
  // Form States for Admin Editor
  const [adminFormTitle, setAdminFormTitle] = useState('');
  const [adminFormDesc, setAdminFormDesc] = useState('');
  const [adminFormIcon, setAdminFormIcon] = useState('');
  const [adminMaterials, setAdminMaterials] = useState<TopicMaterial[]>([]);
  const [activeAdminMaterialId, setActiveAdminMaterialId] = useState<string>('');
  const [adminFormSummary, setAdminFormSummary] = useState('');

  // Stats Calculation
  const totalModules = curriculumData.length;
  const totalTopics = curriculumData.reduce((acc, mod) => acc + mod.topics.length, 0);
  const totalQuizzes = curriculumData.reduce((acc, mod) => 
    acc + mod.topics.reduce((tAcc, topic) => 
      tAcc + (topic.materials?.reduce((mAcc, mat) => mAcc + (mat.quizzes?.length || 0), 0) || 0), 0), 0);

  // --- Helper: Trigger Toast ---
  const triggerToast = (message: string) => {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  // --- Handlers ---

  const startEditingTopic = (topic: Topic) => {
    setAdminEditingTopic(topic);
    setAdminFormTitle(topic.title);
    setAdminFormDesc(topic.description);
    setAdminFormSummary(topic.contentSummary);
    setAdminFormIcon(topic.iconName || 'file-text');
    setAdminRightSidebarCollapsed(false); // Expand right sidebar when editing starts
    
    if (topic.materials && topic.materials.length > 0) {
        setAdminMaterials([...topic.materials]);
        setActiveAdminMaterialId(topic.materials[0].id);
    } else {
        const defaultMat: TopicMaterial = { id: `mat-${Date.now()}`, title: 'Materi Utama', content: '', quizzes: [], assignments: [] };
        setAdminMaterials([defaultMat]);
        setActiveAdminMaterialId(defaultMat.id);
    }
    setAdminMaterialMode(AdminMaterialMode.CONTENT);
  };

  const handleAddModule = () => {
    if(!newModuleTitle.trim()) return;
    
    const newModule: SubjectModule = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle,
      grade: newModuleGrade,
      topics: []
    };

    setCurriculumData(prev => [...prev, newModule]);
    setShowAddModuleModal(false);
    setNewModuleTitle('');
    triggerToast("Modul berhasil ditambahkan");
  };

  const handleDeleteModule = (moduleId: string) => {
    if(confirm("Yakin ingin menghapus modul ini? Semua topik didalamnya akan terhapus.")) {
      setCurriculumData(prev => prev.filter(m => m.id !== moduleId));
      if(adminEditingTopic) setAdminEditingTopic(null);
      triggerToast("Modul dihapus");
    }
  };

  const handleAddTopic = () => {
    if(!newTopicTitle.trim() || !newTopicModuleId) return;

    setCurriculumData(prev => prev.map(mod => {
      if(mod.id === newTopicModuleId) {
        const newTopic: Topic = {
          id: `manual-${Date.now()}`,
          title: newTopicTitle,
          description: 'Deskripsi topik baru',
          iconName: 'file-text',
          contentSummary: 'Belum ada ringkasan',
          materials: [{ id: `mat-${Date.now()}`, title: 'Pendahuluan', content: '', quizzes: [], assignments: [] }],
        };
        return { ...mod, topics: [...mod.topics, newTopic] };
      }
      return mod;
    }));

    setShowAddTopicModal(false);
    setNewTopicTitle('');
    setNewTopicModuleId('');
    triggerToast("Topik berhasil ditambahkan");
  };

  const handleDeleteTopic = (moduleId: string, topicId: string) => {
     if(confirm("Hapus topik ini?")) {
        setCurriculumData(prev => prev.map(mod => {
           if(mod.id === moduleId) {
              return { ...mod, topics: mod.topics.filter(t => t.id !== topicId) };
           }
           return mod;
        }));
        if(adminEditingTopic?.id === topicId) setAdminEditingTopic(null);
        triggerToast("Topik dihapus");
     }
  };

  const saveTopic = () => {
    if (!adminEditingTopic) return;

    setCurriculumData(prevData => {
      return prevData.map(module => ({
        ...module,
        topics: module.topics.map(t => {
          if (t.id === adminEditingTopic.id) {
            return {
              ...t,
              title: adminFormTitle,
              description: adminFormDesc,
              iconName: adminFormIcon,
              contentSummary: adminFormSummary,
              materials: adminMaterials,
            };
          }
          return t;
        })
      }));
    });

    triggerToast("Perubahan berhasil disimpan!");
  };

  const handleResetQuizClick = (e: React.MouseEvent) => {
      e.preventDefault(); 
      if (window.confirm("Apakah Anda yakin ingin mereset semua riwayat pengerjaan kuis siswa? Siswa akan bisa mengerjakan ulang kuis hari ini.")) {
          onResetAttempts();
          triggerToast("Riwayat kuis berhasil direset!");
      }
  };

  // --- Banner Handlers ---
  const addBanner = () => {
      if (!newBannerUrl.trim()) {
          alert("URL gambar tidak boleh kosong.");
          return;
      }
      
      const newBanner: BannerImage = {
          id: `b-${Date.now()}`,
          url: newBannerUrl,
          title: newBannerTitle || 'InfoPintar Banner'
      };
      
      setBannerImages(prev => {
          const updated = [...prev, newBanner];
          localStorage.setItem('bannerImages', JSON.stringify(updated));
          return updated;
      });
      
      setNewBannerUrl('');
      setNewBannerTitle('');
      triggerToast("Banner ditambahkan");
  };

  const removeBanner = (id: string) => {
      if(window.confirm("Hapus banner ini dari slider?")) {
          setBannerImages(prev => {
              const updated = prev.filter(b => b.id !== id);
              localStorage.setItem('bannerImages', JSON.stringify(updated));
              return updated;
          });
          triggerToast("Banner dihapus");
      }
  };
  
  const startEditingBanner = (banner: BannerImage) => {
      setEditingBannerId(banner.id);
      setNewBannerTitle(banner.title || '');
  }

  const saveBannerEdit = (id: string) => {
      setBannerImages(prev => {
          const updated = prev.map(b => b.id === id ? { ...b, title: newBannerTitle } : b);
          localStorage.setItem('bannerImages', JSON.stringify(updated));
          return updated;
      });
      setEditingBannerId(null);
      setNewBannerTitle('');
      triggerToast("Banner diperbarui");
  };

  // --- Material/Quiz/Assignment Handlers ---

  const addAdminMaterial = () => {
      const newMat: TopicMaterial = {
          id: `mat-${Date.now()}`,
          title: 'Materi Baru',
          content: '',
          quizzes: [],
          assignments: []
      };
      const newMaterials = [...adminMaterials, newMat];
      setAdminMaterials(newMaterials);
      setActiveAdminMaterialId(newMat.id);
  };

  const updateAdminMaterial = (id: string, field: keyof TopicMaterial, value: any) => {
      setAdminMaterials(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const deleteAdminMaterial = (id: string) => {
      if (adminMaterials.length <= 1) {
          alert("Minimal harus ada satu materi.");
          return;
      }
      const newMats = adminMaterials.filter(m => m.id !== id);
      setAdminMaterials(newMats);
      if (activeAdminMaterialId === id) {
          setActiveAdminMaterialId(newMats[0].id);
      }
  };

  const addAdminQuiz = (materialId: string) => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'Pertanyaan baru...',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
      correctAnswerIndex: 0,
      explanation: 'Penjelasan...'
    };
    
    setAdminMaterials(prev => prev.map(m => {
        if(m.id === materialId) {
            return { ...m, quizzes: [...(m.quizzes || []), newQ] };
        }
        return m;
    }));
  };

  const updateAdminQuiz = (materialId: string, qIdx: number, field: keyof QuizQuestion, value: any) => {
    setAdminMaterials(prev => prev.map(m => {
        if(m.id === materialId && m.quizzes) {
            const updatedQuizzes = [...m.quizzes];
            updatedQuizzes[qIdx] = { ...updatedQuizzes[qIdx], [field]: value };
            return { ...m, quizzes: updatedQuizzes };
        }
        return m;
    }));
  };

  const updateAdminQuizOption = (materialId: string, qIdx: number, oIdx: number, val: string) => {
    setAdminMaterials(prev => prev.map(m => {
        if(m.id === materialId && m.quizzes) {
            const updatedQuizzes = [...m.quizzes];
            updatedQuizzes[qIdx].options[oIdx] = val;
            return { ...m, quizzes: updatedQuizzes };
        }
        return m;
    }));
  };

  const deleteAdminQuiz = (materialId: string, qIdx: number) => {
      setAdminMaterials(prev => prev.map(m => {
          if(m.id === materialId && m.quizzes) {
              const updatedQuizzes = [...m.quizzes];
              updatedQuizzes.splice(qIdx, 1);
              return { ...m, quizzes: updatedQuizzes };
          }
          return m;
      }));
  }

  const addAdminAssignment = (materialId: string) => {
    const newA: Assignment = {
      id: `asg-${Date.now()}`,
      title: 'Tugas Baru',
      description: 'Deskripsi tugas...',
      dueDate: ''
    };
    setAdminMaterials(prev => prev.map(m => {
        if(m.id === materialId) {
            return { ...m, assignments: [...(m.assignments || []), newA] };
        }
        return m;
    }));
  };

  const updateAdminAssignment = (materialId: string, idx: number, field: keyof Assignment, value: string) => {
    setAdminMaterials(prev => prev.map(m => {
        if(m.id === materialId && m.assignments) {
            const updatedAsg = [...m.assignments];
            updatedAsg[idx] = { ...updatedAsg[idx], [field]: value };
            return { ...m, assignments: updatedAsg };
        }
        return m;
    }));
  };

  const deleteAdminAssignment = (materialId: string, idx: number) => {
    setAdminMaterials(prev => prev.map(m => {
        if(m.id === materialId && m.assignments) {
            const updatedAsg = [...m.assignments];
            updatedAsg.splice(idx, 1);
            return { ...m, assignments: updatedAsg };
        }
        return m;
    }));
  };

  // Render Helpers
  const filteredModules = curriculumData.map(mod => ({
    ...mod,
    topics: mod.topics.filter(t => t.title.toLowerCase().includes(adminTopicSearch.toLowerCase()))
  })).filter(mod => mod.topics.length > 0 || (mod.title.toLowerCase().includes(adminTopicSearch.toLowerCase())));

  const activeAdminMaterial = adminMaterials.find(m => m.id === activeAdminMaterialId) || adminMaterials[0];
  const activeQuizzes = activeAdminMaterial?.quizzes || [];
  const activeAssignments = activeAdminMaterial?.assignments || [];

  return (
    <div className="flex w-screen h-screen bg-slate-100 overflow-hidden relative font-sans text-slate-900">
        {/* Left Sidebar (Navigation) */}
        <div 
          className={`${adminSidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm z-20 shrink-0`}
        >
           {/* Sidebar Header */}
           <div className="p-4 border-b border-slate-100 flex items-center justify-between h-16">
             {!adminSidebarCollapsed && (
               <div className="flex items-center gap-2 overflow-hidden">
                 <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <LayoutDashboard size={18} />
                 </div>
                 <span className="font-bold text-slate-700 whitespace-nowrap text-sm">Admin Panel</span>
               </div>
             )}
             {adminSidebarCollapsed && (
               <div className="w-full flex justify-center">
                 <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shrink-0 cursor-pointer" onClick={() => setAdminSidebarCollapsed(false)}>
                    <LayoutDashboard size={18} />
                 </div>
               </div>
             )}
             {!adminSidebarCollapsed && (
                <button onClick={() => setAdminSidebarCollapsed(true)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                  <PanelLeftClose size={20} />
                </button>
             )}
           </div>
           
           {!adminSidebarCollapsed ? (
             <div className="p-3 border-b border-slate-100 space-y-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari topik..." 
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={adminTopicSearch}
                    onChange={(e) => setAdminTopicSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button 
                    onClick={() => setShowAddModuleModal(true)}
                    className="flex items-center justify-center gap-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                    <FolderPlus size={14} /> + Modul
                    </button>
                    <button 
                    onClick={() => setShowAddTopicModal(true)}
                    className="flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                    <PlusCircle size={14} /> + Topik
                    </button>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center py-4 gap-4">
                <button onClick={() => setAdminSidebarCollapsed(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <Search size={20} />
                </button>
                 <button onClick={() => { setAdminSidebarCollapsed(false); setShowAddModuleModal(true); }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600">
                  <FolderPlus size={20} />
                </button>
                <button onClick={() => { setAdminSidebarCollapsed(false); setShowAddTopicModal(true); }} className="p-2 hover:bg-slate-50 rounded-lg text-blue-600">
                  <PlusCircle size={20} />
                </button>
             </div>
           )}

           <div className="flex-1 overflow-y-auto p-2 space-y-4 no-scrollbar">
             {!adminSidebarCollapsed && filteredModules.map(mod => (
               <div key={mod.id} className="relative group/module">
                 <div className="flex justify-between items-center pr-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">{mod.title}</h3>
                    <button onClick={() => handleDeleteModule(mod.id)} className="opacity-0 group-hover/module:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"><Trash2 size={12}/></button>
                 </div>
                 <div className="space-y-1">
                   {mod.topics.map(topic => (
                     <div 
                       key={topic.id}
                       className={`px-3 py-2 rounded-lg text-sm cursor-pointer flex items-center justify-between group transition-all ${adminEditingTopic?.id === topic.id ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                     >
                        <div className="flex-1 flex items-center gap-2 overflow-hidden" onClick={() => startEditingTopic(topic)}>
                            <div className={`w-1.5 h-1.5 rounded-full ${adminEditingTopic?.id === topic.id ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                            <span className="truncate">{topic.title}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleDeleteTopic(mod.id, topic.id)} className="text-slate-300 hover:text-red-500 p-1">
                             <Trash2 size={14} />
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
           </div>
           
           <div className="p-3 border-t border-slate-100 space-y-2">
              <button type="button" onClick={() => setShowBannerModal(true)} className={`flex items-center ${adminSidebarCollapsed ? 'justify-center' : 'gap-3 pl-3'} w-full py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium transition-colors`} title="Atur Banner">
                <Image size={18} />
                {!adminSidebarCollapsed && "Atur Banner"}
              </button>
              <button type="button" onClick={handleResetQuizClick} className={`flex items-center ${adminSidebarCollapsed ? 'justify-center' : 'gap-3 pl-3'} w-full py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors`} title="Reset Kuis">
                <RefreshCcw size={18} />
                {!adminSidebarCollapsed && "Reset Kuis"}
              </button>
              <button type="button" onClick={onLogout} className={`flex items-center ${adminSidebarCollapsed ? 'justify-center' : 'gap-3 pl-3'} w-full py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors`} title="Logout">
                <LogOut size={18} />
                {!adminSidebarCollapsed && "Keluar"}
              </button>
           </div>
        </div>

        {/* Center Panel (Editor Workspace) */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
           {/* Editor Header */}
           <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-30">
             <div className="flex items-center gap-4 overflow-hidden">
                {adminEditingTopic ? (
                   <>
                     <h2 className="text-lg font-bold text-slate-800 truncate max-w-[200px]">{adminFormTitle || 'Untitled Topic'}</h2>
                     <div className="h-4 w-px bg-slate-300 shrink-0"></div>
                     <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                       {[
                         { id: AdminMaterialMode.CONTENT, label: 'Materi', icon: FileText },
                         { id: AdminMaterialMode.QUIZ, label: 'Kuis', icon: Check },
                         { id: AdminMaterialMode.ASSIGNMENT, label: 'Tugas', icon: ClipboardList }
                       ].map(tab => (
                         <button
                           key={tab.id}
                           onClick={() => setAdminMaterialMode(tab.id)}
                           className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${adminMaterialMode === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                           <tab.icon size={14} /> {tab.label}
                         </button>
                       ))}
                     </div>
                   </>
                ) : (
                  <div className="text-slate-400 italic flex items-center gap-2">
                    <LayoutDashboard size={18}/> Dashboard Overview
                  </div>
                )}
             </div>
             
             {adminEditingTopic && (
               <div className="flex items-center gap-3 shrink-0">
                 <button 
                   onClick={saveTopic}
                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
                 >
                   <Save size={18} /> Simpan Perubahan
                 </button>
               </div>
             )}
           </div>

           {/* Main Content Area */}
           <div className="flex-1 overflow-y-auto p-0 relative">
              {adminEditingTopic ? (
                <div className="h-full flex flex-col">
                   {/* Material Tabs Bar */}
                   <div className="flex-1 flex flex-col">
                      <div className="bg-white border-b border-slate-200 px-6 pt-4 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-sm z-10 sticky top-0">
                          {adminMaterials.map((mat) => (
                              <div 
                                  key={mat.id}
                                  onClick={() => {
                                      setActiveAdminMaterialId(mat.id);
                                      setAdminMaterialMode(AdminMaterialMode.CONTENT); 
                                  }}
                                  className={`group relative px-5 py-2.5 rounded-t-lg text-sm font-medium cursor-pointer border-x border-t flex items-center gap-3 min-w-[140px] justify-between hover:bg-slate-50 transition-all
                                      ${activeAdminMaterialId === mat.id 
                                          ? 'border-slate-300 border-b-white bg-white text-blue-600 font-bold translate-y-[1px] z-20' 
                                          : 'border-transparent bg-slate-100 text-slate-500 border-b-slate-200'}
                                  `}
                              >
                                  <span className="truncate max-w-[100px]">{mat.title}</span>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); deleteAdminMaterial(mat.id); }}
                                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                                  >
                                      <X size={14} />
                                  </button>
                              </div>
                          ))}
                          <button 
                              onClick={addAdminMaterial}
                              className="px-3 py-2 mb-[1px] text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors ml-1"
                              title="Tambah Tab Materi Baru"
                          >
                              <PlusCircle size={20} />
                          </button>
                      </div>

                      {/* Editor Document Area */}
                      <div className="flex-1 bg-slate-100 p-8 overflow-y-auto">
                         {activeAdminMaterial && (
                             <>
                                 {/* CONTENT EDITOR */}
                                 {adminMaterialMode === AdminMaterialMode.CONTENT && (
                                    <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-lg border border-slate-200 flex flex-col transition-all">
                                        <div className="p-12 pb-4 border-b border-slate-50">
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Judul Bagian Materi</label>
                                                <input 
                                                    className="w-full text-3xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none border-b border-transparent focus:border-blue-200 transition-colors py-1 bg-transparent"
                                                    value={activeAdminMaterial.title}
                                                    onChange={(e) => updateAdminMaterial(activeAdminMaterial.id, 'title', e.target.value)}
                                                    placeholder="Judul Materi..."
                                                />
                                        </div>
                                        <div className="flex-1 p-12 pt-0 relative group">
                                                <RichTextEditor 
                                                    key={activeAdminMaterial.id} 
                                                    initialValue={activeAdminMaterial.content} 
                                                    onChange={(val) => updateAdminMaterial(activeAdminMaterial.id, 'content', val)}
                                                />
                                        </div>
                                    </div>
                                 )}

                                 {/* QUIZ EDITOR */}
                                 {adminMaterialMode === AdminMaterialMode.QUIZ && (
                                     <div className="max-w-4xl mx-auto">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-slate-700">Soal Kuis untuk "{activeAdminMaterial.title}"</h3>
                                            <button onClick={() => addAdminQuiz(activeAdminMaterial.id)} className="flex items-center gap-2 text-sm bg-white border border-slate-200 text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-200 px-4 py-2 rounded-lg transition-all shadow-sm">
                                                <PlusCircle size={16} /> Tambah Soal
                                            </button>
                                        </div>
                                        {activeQuizzes.length === 0 && (
                                            <div className="text-center p-16 bg-white rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                                                <Check size={48} className="mx-auto mb-4 opacity-20" />
                                                <p>Belum ada soal kuis untuk materi ini.</p>
                                            </div>
                                        )}
                                        <div className="space-y-6 pb-20">
                                            {activeQuizzes.map((q, idx) => (
                                            <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-all">
                                                <button 
                                                    onClick={() => deleteAdminQuiz(activeAdminMaterial.id, idx)}
                                                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <div className="mb-6 pr-10">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Pertanyaan {idx + 1}</label>
                                                    <input 
                                                        className="w-full font-medium text-lg text-slate-800 border-b border-slate-200 focus:border-blue-500 focus:outline-none py-2 transition-colors bg-transparent"
                                                        value={q.question}
                                                        onChange={(e) => updateAdminQuiz(activeAdminMaterial.id, idx, 'question', e.target.value)}
                                                        placeholder="Tulis pertanyaan..."
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-lg border ${q.correctAnswerIndex === oIdx ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-transparent'}`}>
                                                        <input 
                                                            type="radio" 
                                                            name={`correct-${q.id}`} 
                                                            checked={q.correctAnswerIndex === oIdx}
                                                            onChange={() => updateAdminQuiz(activeAdminMaterial.id, idx, 'correctAnswerIndex', oIdx)}
                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                        <input 
                                                            className="flex-1 text-sm bg-transparent focus:outline-none font-medium text-slate-700"
                                                            value={opt}
                                                            onChange={(e) => updateAdminQuizOption(activeAdminMaterial.id, idx, oIdx, e.target.value)}
                                                            placeholder={`Pilihan ${String.fromCharCode(65 + oIdx)}`}
                                                        />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Penjelasan Jawaban</label>
                                                    <textarea 
                                                        rows={2}
                                                        className="w-full text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200 focus:border-blue-300 focus:outline-none focus:bg-white transition-colors"
                                                        value={q.explanation}
                                                        onChange={(e) => updateAdminQuiz(activeAdminMaterial.id, idx, 'explanation', e.target.value)}
                                                        placeholder="Jelaskan mengapa jawaban tersebut benar..."
                                                    />
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                     </div>
                                 )}

                                 {/* ASSIGNMENT EDITOR */}
                                 {adminMaterialMode === AdminMaterialMode.ASSIGNMENT && (
                                     <div className="max-w-4xl mx-auto space-y-6 pb-20">
                                         <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-slate-700">Penugasan untuk "{activeAdminMaterial.title}"</h3>
                                            <button onClick={() => addAdminAssignment(activeAdminMaterial.id)} className="flex items-center gap-2 text-sm bg-white border border-slate-200 text-yellow-600 font-bold hover:bg-yellow-50 hover:border-yellow-200 px-4 py-2 rounded-lg transition-all shadow-sm">
                                              <PlusCircle size={16} /> Tambah Tugas
                                            </button>
                                         </div>
                                         {activeAssignments.length === 0 && (
                                            <div className="text-center p-16 bg-white rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                                               <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
                                               <p>Belum ada tugas untuk materi ini.</p>
                                            </div>
                                         )}
                                         {activeAssignments.map((asg, idx) => (
                                           <div key={asg.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative hover:shadow-md transition-all">
                                              <button 
                                                 onClick={() => deleteAdminAssignment(activeAdminMaterial.id, idx)}
                                                 className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2"
                                               >
                                                 <Trash2 size={18} />
                                               </button>
            
                                               <div className="grid grid-cols-3 gap-6 mb-4">
                                                  <div className="col-span-2">
                                                     <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Judul Tugas</label>
                                                     <input 
                                                       className="w-full text-lg font-bold text-slate-800 border-b border-slate-200 focus:border-yellow-500 focus:outline-none py-2 transition-colors bg-transparent"
                                                       value={asg.title}
                                                       onChange={(e) => updateAdminAssignment(activeAdminMaterial.id, idx, 'title', e.target.value)}
                                                       placeholder="Judul Tugas..."
                                                     />
                                                  </div>
                                                  <div>
                                                     <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Deadline</label>
                                                     <input 
                                                       type="date"
                                                       className="w-full text-sm text-slate-600 border-b border-slate-200 focus:border-yellow-500 focus:outline-none py-2 bg-transparent"
                                                       value={asg.dueDate}
                                                       onChange={(e) => updateAdminAssignment(activeAdminMaterial.id, idx, 'dueDate', e.target.value)}
                                                     />
                                                  </div>
                                               </div>
                                               <div>
                                                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Deskripsi</label>
                                                  <textarea 
                                                    rows={3}
                                                    className="w-full text-sm text-slate-600 bg-yellow-50/30 rounded-lg p-3 border border-yellow-100 focus:border-yellow-300 focus:bg-white focus:outline-none transition-colors"
                                                    value={asg.description}
                                                    onChange={(e) => updateAdminAssignment(activeAdminMaterial.id, idx, 'description', e.target.value)}
                                                    placeholder="Deskripsi detail tugas..."
                                                  />
                                               </div>
                                           </div>
                                         ))}
                                      </div>
                                 )}
                             </>
                         )}
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50">
                   <div className="grid grid-cols-3 gap-6 max-w-4xl w-full px-8 mb-12">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Layers size={24}/></div>
                         <h3 className="text-2xl font-bold text-slate-800">{totalModules}</h3>
                         <p className="text-sm text-slate-500">Total Modul</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4"><BookOpen size={24}/></div>
                         <h3 className="text-2xl font-bold text-slate-800">{totalTopics}</h3>
                         <p className="text-sm text-slate-500">Total Topik</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><GraduationCap size={24}/></div>
                         <h3 className="text-2xl font-bold text-slate-800">{totalQuizzes}</h3>
                         <p className="text-sm text-slate-500">Total Soal Kuis</p>
                      </div>
                   </div>
                   <p className="text-lg font-medium text-slate-500">Pilih topik di sidebar kiri untuk mulai mengedit konten.</p>
                </div>
              )}
           </div>
        </div>

        {/* Right Sidebar (Inspector) */}
        {adminEditingTopic && (
          <div 
            className={`${adminRightSidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm z-20 shrink-0`}
          >
             <div className="p-4 border-b border-slate-100 flex items-center justify-between h-16">
                {!adminRightSidebarCollapsed && <span className="font-bold text-slate-700">Properti Topik</span>}
                <button 
                  onClick={() => setAdminRightSidebarCollapsed(!adminRightSidebarCollapsed)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 ml-auto"
                >
                  {adminRightSidebarCollapsed ? <PanelRightOpen size={20}/> : <PanelRightClose size={20}/>}
                </button>
             </div>

             {!adminRightSidebarCollapsed ? (
               <div className="p-5 space-y-6 overflow-y-auto">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                       <Type size={14} /> Judul Topik
                    </label>
                    <input 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={adminFormTitle}
                      onChange={(e) => setAdminFormTitle(e.target.value)}
                    />
                  </div>

                  {/* Icon Picker */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                       <ImageIcon size={14} /> Ikon Topik
                    </label>
                    <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 max-h-40 overflow-y-auto no-scrollbar">
                        {AVAILABLE_ICONS.map(icon => (
                            <button
                                key={icon}
                                onClick={() => setAdminFormIcon(icon)}
                                className={`p-2 rounded-lg flex items-center justify-center transition-all aspect-square ${adminFormIcon === icon ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
                                title={icon}
                            >
                                {getIconComponent(icon, 18)}
                            </button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                       <Info size={14} /> Deskripsi Singkat
                    </label>
                    <textarea 
                      rows={3}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={adminFormDesc}
                      onChange={(e) => setAdminFormDesc(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                       <AlignLeft size={14} /> Rangkuman (Summary)
                    </label>
                    <textarea 
                      rows={5}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={adminFormSummary}
                      onChange={(e) => setAdminFormSummary(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Digunakan untuk preview dan meta description.</p>
                  </div>
               </div>
             ) : (
               <div className="flex flex-col items-center py-4 gap-6">
                  <div className="group relative" title="Judul">
                     <Type size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="group relative" title="Ikon">
                     <ImageIcon size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="group relative" title="Deskripsi">
                     <Info size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="group relative" title="Rangkuman">
                     <AlignLeft size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
               </div>
             )}
          </div>
        )}

        {/* Modals */}
        {showAddModuleModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Tambah Modul Baru</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Modul</label>
                            <input 
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                                value={newModuleTitle}
                                onChange={(e) => setNewModuleTitle(e.target.value)}
                                placeholder="Misal: Sistem Komputer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
                            <select 
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                                value={newModuleGrade}
                                onChange={(e) => setNewModuleGrade(Number(e.target.value) as GradeLevel)}
                            >
                                <option value={7}>Kelas 7</option>
                                <option value={8}>Kelas 8</option>
                                <option value={9}>Kelas 9</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setShowAddModuleModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                        <button onClick={handleAddModule} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Buat Modul</button>
                    </div>
                </div>
            </div>
        )}

        {showAddTopicModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Tambah Topik Baru</h3>
                <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Judul Topik</label>
                     <input 
                       className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                       value={newTopicTitle}
                       onChange={(e) => setNewTopicTitle(e.target.value)}
                       placeholder="Misal: Algoritma Pencarian"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Modul (Mata Pelajaran)</label>
                     <select 
                       className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                       value={newTopicModuleId}
                       onChange={(e) => setNewTopicModuleId(e.target.value)}
                     >
                       <option value="">Pilih Modul...</option>
                       {curriculumData.map(m => (
                         <option key={m.id} value={m.id}>Kelas {m.grade} - {m.title}</option>
                       ))}
                     </select>
                   </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                   <button onClick={() => setShowAddTopicModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                   <button onClick={handleAddTopic} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Buat Topik</button>
                </div>
             </div>
          </div>
        )}

        {/* Banner Management Modal */}
        {showBannerModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-scale-up relative">
                    <button 
                        onClick={() => { setShowBannerModal(false); setEditingBannerId(null); setNewBannerTitle(''); }}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                    >
                        <X size={20}/>
                    </button>
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <ImageIcon size={24} className="text-blue-600"/> Pengaturan Banner Slider
                    </h3>
                    
                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {bannerImages.map((banner) => (
                            <div key={banner.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white transition-colors">
                                <img src={banner.url} alt="Banner" className="w-24 h-16 object-cover rounded-lg bg-slate-200 border border-slate-200" />
                                
                                {editingBannerId === banner.id ? (
                                    <div className="flex-1 flex gap-2">
                                        <input 
                                            className="flex-1 p-2 border border-blue-300 rounded-lg text-sm focus:outline-none"
                                            value={newBannerTitle}
                                            onChange={(e) => setNewBannerTitle(e.target.value)}
                                            placeholder="Judul Banner"
                                            autoFocus
                                        />
                                        <button onClick={() => saveBannerEdit(banner.id)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Check size={16}/></button>
                                        <button onClick={() => { setEditingBannerId(null); setNewBannerTitle(''); }} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"><X size={16}/></button>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold text-slate-800 truncate">{banner.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{banner.url}</p>
                                    </div>
                                )}

                                {editingBannerId !== banner.id && (
                                    <div className="flex gap-1">
                                        <button 
                                            type="button"
                                            onClick={() => startEditingBanner(banner)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18}/>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeBanner(banner.id); }}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {bannerImages.length === 0 && (
                            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                Belum ada banner yang ditambahkan.
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 bg-white">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tambah Banner Baru</div>
                        <input 
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm transition-all focus:bg-white"
                            placeholder="Judul Banner (Opsional)"
                            value={!editingBannerId ? newBannerTitle : ''} // Only show if not editing existing
                            onChange={(e) => !editingBannerId && setNewBannerTitle(e.target.value)}
                            disabled={!!editingBannerId}
                        />
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm transition-all focus:bg-white"
                                placeholder="URL Gambar Banner (https://...)"
                                value={newBannerUrl}
                                onChange={(e) => setNewBannerUrl(e.target.value)}
                                disabled={!!editingBannerId}
                            />
                            <button 
                                type="button"
                                onClick={addBanner}
                                disabled={!newBannerUrl || !!editingBannerId}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
                            >
                                <PlusCircle size={18}/> Tambah
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showToast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-fade-in z-[70]">
             <Check size={18} className="text-green-400" />
             <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}
    </div>
  );
};