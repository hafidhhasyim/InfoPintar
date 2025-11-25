import React from 'react';
import { Topic } from '../types';
import { 
  ChevronRight, Cpu, Network, Code, Database, Shield, Layout, FileText, Calendar, 
  Workflow, Disc, BarChart, Scale, Lock, Terminal, Cloud, Server, Smartphone, 
  Tablet, HardDrive, Printer, Speaker, Video, Camera, MessageSquare, Mail, User, Globe, Monitor,
  Binary, Brain, Bug, CircuitBoard, Command, FileCode, Fingerprint, Gamepad2, 
  GitBranch, Headphones, Key, Laptop, Lightbulb, Link, Mic, Music, PenTool, 
  Power, Radio, Save, Settings, Signal, Table, Tag, Wrench, Trash, Tv, Type, Upload, Zap
} from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

const getIcon = (name: string) => {
  const props = { className: "w-6 h-6 text-blue-600" };
  switch (name) {
    case 'cpu': return <Cpu {...props} />;
    case 'network': return <Network {...props} className="text-indigo-600" />;
    case 'code': return <Code {...props} className="text-emerald-600" />;
    case 'database': return <Database {...props} className="text-amber-600" />;
    case 'shield': return <Shield {...props} className="text-red-600" />;
    case 'layout': return <Layout {...props} className="text-cyan-600" />;
    case 'folder': return <FileText {...props} className="text-yellow-600" />;
    case 'calendar': return <Calendar {...props} className="text-purple-600" />;
    case 'workflow': return <Workflow {...props} className="text-teal-600" />;
    case 'disc': return <Disc {...props} className="text-slate-600" />;
    case 'bar-chart': return <BarChart {...props} className="text-green-600" />;
    case 'scale': return <Scale {...props} className="text-orange-600" />;
    case 'lock': return <Lock {...props} className="text-rose-600" />;
    
    // New Icons
    case 'monitor': return <Monitor {...props} />;
    case 'wifi': return <Network {...props} />;
    case 'terminal': return <Terminal {...props} />;
    case 'cloud': return <Cloud {...props} className="text-sky-500" />;
    case 'server': return <Server {...props} />;
    case 'smartphone': return <Smartphone {...props} />;
    case 'tablet': return <Tablet {...props} />;
    case 'hard-drive': return <HardDrive {...props} />;
    case 'printer': return <Printer {...props} />;
    case 'speaker': return <Speaker {...props} />;
    case 'video': return <Video {...props} />;
    case 'camera': return <Camera {...props} />;
    case 'message-square': return <MessageSquare {...props} />;
    case 'mail': return <Mail {...props} />;
    case 'user': return <User {...props} />;
    case 'globe': return <Globe {...props} />;
    case 'binary': return <Binary {...props} />;
    case 'brain': return <Brain {...props} />;
    case 'bug': return <Bug {...props} />;
    case 'circuit-board': return <CircuitBoard {...props} />;
    case 'command': return <Command {...props} />;
    case 'file-code': return <FileCode {...props} />;
    case 'fingerprint': return <Fingerprint {...props} />;
    case 'gamepad-2': return <Gamepad2 {...props} />;
    case 'git-branch': return <GitBranch {...props} />;
    case 'headphones': return <Headphones {...props} />;
    case 'key': return <Key {...props} />;
    case 'laptop': return <Laptop {...props} />;
    case 'lightbulb': return <Lightbulb {...props} />;
    case 'link': return <Link {...props} />;
    case 'mic': return <Mic {...props} />;
    case 'music': return <Music {...props} />;
    case 'pen-tool': return <PenTool {...props} />;
    case 'power': return <Power {...props} />;
    case 'radio': return <Radio {...props} />;
    case 'save': return <Save {...props} />;
    case 'settings': return <Settings {...props} />;
    case 'signal': return <Signal {...props} />;
    case 'table': return <Table {...props} />;
    case 'tag': return <Tag {...props} />;
    case 'tool': return <Wrench {...props} />;
    case 'trash': return <Trash {...props} />;
    case 'tv': return <Tv {...props} />;
    case 'type': return <Type {...props} />;
    case 'upload': return <Upload {...props} />;
    case 'zap': return <Zap {...props} />;
    
    default: return <FileText {...props} className="text-gray-600" />;
  }
};

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer active:scale-95 flex items-start gap-4"
    >
      <div className="p-3 bg-slate-50 rounded-lg shrink-0">
        {getIcon(topic.iconName)}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800 text-lg mb-1">{topic.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{topic.description}</p>
      </div>
      <div className="self-center text-slate-300">
        <ChevronRight size={20} />
      </div>
    </div>
  );
};