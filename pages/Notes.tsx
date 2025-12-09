import React, { useState } from 'react';
import { Plus, X, ChevronLeft, Trash2 } from 'lucide-react';
import { Note } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotesProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const Notes: React.FC<NotesProps> = ({ notes, setNotes }) => {
  const navigate = useNavigate();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
    }
    setIsEditorOpen(true);
  };

  const saveNote = () => {
    if (!title && !content) {
      setIsEditorOpen(false);
      return;
    }

    const updatedNote: Note = {
      id: editingNote ? editingNote.id : crypto.randomUUID(),
      title: title || 'Untitled Note',
      content,
      updatedAt: new Date().toISOString()
    };

    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? updatedNote : n));
    } else {
      setNotes(prev => [updatedNote, ...prev]);
    }
    setIsEditorOpen(false);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('Delete this note?')) {
        setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  if (isEditorOpen) {
    return (
      <div className="h-screen bg-white flex flex-col z-50 fixed inset-0">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
           <button onClick={() => setIsEditorOpen(false)} className="text-gray-600 flex items-center">
              <ChevronLeft size={24} />
              <span className="ml-1">Back</span>
           </button>
           <button onClick={saveNote} className="text-yellow-600 font-semibold px-4 py-1.5 bg-yellow-50 rounded-lg">
             Save
           </button>
        </div>
        <div className="flex-1 p-5 overflow-y-auto">
           <input 
             type="text" 
             placeholder="Title" 
             value={title}
             onChange={e => setTitle(e.target.value)}
             className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none mb-4"
           />
           <textarea 
             placeholder="Type your note here..." 
             value={content}
             onChange={e => setContent(e.target.value)}
             className="w-full h-full text-base text-gray-700 placeholder-gray-300 border-none outline-none resize-none"
           />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-gray-50">
      <div className="p-4 pb-24">
         <div className="flex items-center space-x-2 mb-6">
            <button onClick={() => navigate('/')} className="text-gray-500">
               <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Daily Notes</h1>
         </div>

         <div className="grid gap-3">
            {notes.length === 0 && (
                <p className="text-center text-gray-400 mt-10">No notes yet. Tap + to add one.</p>
            )}
            {notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => openEditor(note)}
                className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100 relative group active:scale-[0.99] transition-transform"
              >
                 <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 mb-1">{note.title}</h3>
                    <button onClick={(e) => deleteNote(note.id, e)} className="text-gray-400 hover:text-red-500 p-1">
                       <Trash2 size={16} />
                    </button>
                 </div>
                 <p className="text-sm text-gray-600 line-clamp-2">{note.content || "No additional text"}</p>
                 <p className="text-xs text-gray-400 mt-3 text-right">
                    {new Date(note.updatedAt).toLocaleDateString()}
                 </p>
              </div>
            ))}
         </div>
      </div>

      <button 
        onClick={() => openEditor()}
        className="fixed bottom-20 right-6 w-14 h-14 bg-yellow-500 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-yellow-600 hover:scale-105 transition-all z-40"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Notes;