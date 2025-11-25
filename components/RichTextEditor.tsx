
import React, { useEffect, useRef } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Eraser, 
  Heading1, Heading2, Quote, AlignCenter, AlignRight, AlignLeft, 
  Undo, Redo, Image as ImageIcon, Video, Music, Type 
} from 'lucide-react';

const ToolbarButton = ({ icon, onClick, label, title }: any) => (
  <button 
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className="p-1.5 text-slate-700 hover:bg-white hover:shadow-sm hover:text-blue-600 rounded flex items-center gap-1 transition-all active:bg-slate-200"
    title={title}
  >
    {icon}
    {label && <span className="text-xs font-bold">{label}</span>}
  </button>
);

interface RichTextEditorProps {
  initialValue: string;
  onChange: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue;
    }
  }, []); // Initial load only. Key prop in parent handles re-renders for different content.

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  const insertMedia = (type: 'image' | 'audio' | 'video') => {
    const url = prompt(`Masukkan URL ${type === 'image' ? 'Gambar' : type === 'audio' ? 'Audio (MP3/WAV)' : 'Video (MP4/YouTube)'}:`);
    if (!url) return;

    if (type === 'image') {
        document.execCommand('insertImage', false, url);
    } else if (type === 'audio') {
        const html = `<audio controls src="${url}" class="w-full my-2"></audio><p><br/></p>`;
        document.execCommand('insertHTML', false, html);
    } else if (type === 'video') {
        let html = '';
        // Simple check for YouTube
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = '';
            try {
                if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
                else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1];
                else if (url.includes('embed/')) videoId = url.split('embed/')[1];
            } catch(e) {}

            if (videoId) {
                html = `<div class="aspect-video w-full my-4 rounded-lg overflow-hidden shadow-sm"><iframe src="https://www.youtube.com/embed/${videoId}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p><br/></p>`;
            } else {
                alert("Link YouTube tidak valid.");
                return;
            }
        } else {
            // Standard video tag for MP4 etc
            html = `<video controls src="${url}" class="w-full rounded-lg my-2 max-h-[400px] bg-black"></video><p><br/></p>`;
        }
        document.execCommand('insertHTML', false, html);
    }
    handleInput();
    editorRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-sm border border-slate-200 rounded-t-none rounded-b-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 border-b border-slate-300 sticky top-0 z-20">
         <ToolbarButton icon={<Undo size={16}/>} onClick={() => applyFormat('undo')} title="Undo" />
         <ToolbarButton icon={<Redo size={16}/>} onClick={() => applyFormat('redo')} title="Redo" />
         <div className="w-px h-5 bg-slate-300 mx-1" />
         
         <ToolbarButton icon={<Bold size={16}/>} onClick={() => applyFormat('bold')} title="Bold (Ctrl+B)" />
         <ToolbarButton icon={<Italic size={16}/>} onClick={() => applyFormat('italic')} title="Italic (Ctrl+I)" />
         <ToolbarButton icon={<Underline size={16}/>} onClick={() => applyFormat('underline')} title="Underline (Ctrl+U)" />
         <div className="w-px h-5 bg-slate-300 mx-1" />
         
         <ToolbarButton icon={<Heading1 size={16}/>} onClick={() => applyFormat('formatBlock', 'H2')} label="H1" title="Heading 1" />
         <ToolbarButton icon={<Heading2 size={16}/>} onClick={() => applyFormat('formatBlock', 'H3')} label="H2" title="Heading 2" />
         <ToolbarButton icon={<Type size={16}/>} onClick={() => applyFormat('formatBlock', 'P')} label="P" title="Paragraph" />
         <div className="w-px h-5 bg-slate-300 mx-1" />
         
         <ToolbarButton icon={<AlignLeft size={16}/>} onClick={() => applyFormat('justifyLeft')} title="Align Left" />
         <ToolbarButton icon={<AlignCenter size={16}/>} onClick={() => applyFormat('justifyCenter')} title="Align Center" />
         <ToolbarButton icon={<AlignRight size={16}/>} onClick={() => applyFormat('justifyRight')} title="Align Right" />
         <div className="w-px h-5 bg-slate-300 mx-1" />

         <ToolbarButton icon={<ListOrdered size={16}/>} onClick={() => applyFormat('insertOrderedList')} title="Ordered List" />
         <ToolbarButton icon={<List size={16}/>} onClick={() => applyFormat('insertUnorderedList')} title="Bullet List" />
         <ToolbarButton icon={<Quote size={16}/>} onClick={() => applyFormat('formatBlock', 'BLOCKQUOTE')} title="Quote" />
         <div className="w-px h-5 bg-slate-300 mx-1" />
         
         <ToolbarButton icon={<LinkIcon size={16}/>} onClick={() => {
            const url = prompt('Masukkan URL Link:');
            if(url) applyFormat('createLink', url);
         }} title="Insert Link" />
         
         {/* Media Buttons */}
         <ToolbarButton icon={<ImageIcon size={16}/>} onClick={() => insertMedia('image')} title="Insert Image" />
         <ToolbarButton icon={<Video size={16}/>} onClick={() => insertMedia('video')} title="Insert Video (MP4/YouTube)" />
         <ToolbarButton icon={<Music size={16}/>} onClick={() => insertMedia('audio')} title="Insert Audio (MP3)" />
         
         <div className="w-px h-5 bg-slate-300 mx-1" />
         <ToolbarButton icon={<Eraser size={16}/>} onClick={() => applyFormat('removeFormat')} title="Clear Formatting" />
      </div>
      
      {/* Editable Paper Area */}
      <div className="flex-1 bg-slate-200 p-4 overflow-y-auto cursor-text" onClick={() => editorRef.current?.focus()}>
        <div 
          ref={editorRef}
          contentEditable
          className="min-h-[800px] max-w-[210mm] mx-auto bg-white shadow-lg p-[20mm] focus:outline-none prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mb-4 prose-p:leading-7 prose-img:rounded-lg prose-img:mx-auto prose-video:rounded-lg prose-iframe:rounded-lg"
          onInput={handleInput}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
