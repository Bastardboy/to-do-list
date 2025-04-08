import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isListeningTitle, setIsListeningTitle] = useState(false);
  const [isListeningDesc, setIsListeningDesc] = useState(false);
  const recognitionRef = useRef(null);
  const cookies = parseCookies();
  const id_user = cookies.id_user;
  const activeFieldRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);
  const INACTIVITY_TIMEOUT = 3000;

  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = setTimeout(() => {
      if (isListeningTitle || isListeningDesc) {
        console.log('Timeout por inactividad - cerrando micrófono');
        stopListening();
      }
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      setError('Usa Chrome o Edge para reconocimiento por voz');
      return;
    }
  
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = true;
  
      recognitionRef.current.onresult = (event) => {
        resetInactivityTimeout();
        const results = event.results;
        const lastResult = results[results.length - 1];
        const transcript = lastResult[0].transcript.trim();
  
        if (lastResult.isFinal) {
          const processText = (prevText) => {
            const combined = prevText ? `${prevText} ${transcript}` : transcript;
            const words = combined.split(/\s+/);
            const filteredWords = words.filter((word, index, arr) => {
              return index === 0 || word.toLowerCase() !== arr[index - 1].toLowerCase();
            });
            return filteredWords.join(' ');
          };
  
          if (activeFieldRef.current === 'title') {
            setTitle((prev) => processText(prev));
          } else {
            setDescription((prev) => processText(prev));
          }
        }
      };
  
      recognitionRef.current.onerror = (event) => {
        console.error('Error:', event.error);
        setError(`Error en el micrófono: ${event.error}`);
        stopListening();
      };
  
      recognitionRef.current.onstart = () => {
        resetInactivityTimeout();
        console.log('Micrófono activado para:', activeFieldRef.current);
      };
  
      recognitionRef.current.onend = () => {
        console.log('Reconocimiento de voz detenido');
        setIsListeningTitle(false);
        setIsListeningDesc(false);
      };
    }
  
    if (isListeningTitle || isListeningDesc) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  
    return () => {
      clearTimeout(inactivityTimeoutRef.current);
      recognitionRef.current?.stop();
    };
  }, [isListeningTitle, isListeningDesc]);

  
  const startListening = async (field) => {
    setError('');
    activeFieldRef.current = field;
    
    if (recognitionRef.current && (isListeningTitle || isListeningDesc)) {
      await new Promise(resolve => {
        recognitionRef.current.onend = resolve;
        recognitionRef.current.stop();
      });
    }

    setTimeout(() => {
      if (field === 'title') {
        setIsListeningTitle(true);
        setIsListeningDesc(false);
      } else {
        setIsListeningDesc(true);
        setIsListeningTitle(false);
      }
    }, 100);
  };

  const stopListening = () => {
    clearTimeout(inactivityTimeoutRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListeningTitle(false);
    setIsListeningDesc(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    stopListening();
    
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }
    
    if (!description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    try {
      await axios.post('/api/tasks', {
        title,
        description,
        completed: false,
        id_user
      });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Error al crear la tarea. Intenta nuevamente.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gradient-form max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl space-y-6 mb-12 bg-gradient-to-tr from-indigo-500/90 via-purple-500/90 to-pink-500/90 relative"
    >
      <h2 className="font-display text-4xl font-bold text-white text-center drop-shadow-md">
        ✨ Nueva Tarea
      </h2>
      
      {error && (
        <div className="font-alert bg-red-500/90 text-white p-4 rounded-xl border-l-4 border-red-300 shadow-lg flex items-start gap-3 animate-fade-in">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <div>
            <p className="font-medium">¡Atención!</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Campo Título con Micrófono */}
        <div className="relative">
          <input
            type="text"
            placeholder="Título *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`font-alert w-full p-4 pr-12 rounded-xl bg-white/20 backdrop-blur-sm border ${
              error && !title.trim() ? 'border-red-400' : 'border-white/30'
            } text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg transition-all duration-300`}
          />

          <button
            type="button"
            onClick={() => isListeningTitle ? stopListening() : startListening('title')}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
              isListeningTitle 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-white/30 hover:bg-white/40'
            } transition-all`}
            aria-label="Microfono para título"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
        
        {/* Campo Descripción con Micrófono */}
        <div className="relative">
          <textarea
            placeholder="Descripción *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className={`font-alert w-full p-4 pr-12 rounded-xl bg-white/20 border ${
              error && !description.trim() ? 'border-red-400' : 'border-white/30'
            } text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg transition-all duration-300`}
          />
          <button
            type="button"
            onClick={() => isListeningDesc ? stopListening() : startListening('description')}
            className={`absolute right-3 bottom-4 p-2 rounded-full ${
              isListeningDesc 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-white/30 hover:bg-white/40'
            } transition-all`}
            aria-label="Microfono para descripción"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
              />
            </svg>
          </button>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-100 shadow-2xl flex items-center justify-center gap-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        Crear Tarea
      </button>
    </form>
  );
};

export default TaskForm;
