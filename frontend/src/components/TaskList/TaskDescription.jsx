import React from 'react';

// Componente para el icono de Chevron
const ChevronIcon = ({ expanded }) => (
  <svg 
    className="w-4 h-4 mr-1" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
    />
  </svg>
);

const TaskDescription = ({ description, expanded, onToggleExpand }) => {
  // Constantes configurables
  const MAX_LINES = 1; // Número máximo de líneas visibles inicialmente
  const CHARS_PER_LINE = 30; // Caracteres aproximados por línea visual

  // Función para calcular líneas efectivas
  const calculateLines = (text) => {
    if (!text) return 0;
    const explicitLines = (text.match(/\n/g) || []).length + 1;
    const overflowLines = Math.ceil(text.length / CHARS_PER_LINE);
    return Math.max(explicitLines, overflowLines);
  };

  // Función para obtener descripción corta combinando límites de líneas y caracteres
  const getShortDescriptionCombined = (text, charLimit = 100, lineLimit = 3) => {
    const lines = text.split('\n').slice(0, lineLimit);
    const joined = lines.join('\n');
  
    // Si está dentro del límite, no hacemos nada más
    if (joined.length <= charLimit) return joined;
  
    const words = joined.split(' ');
    let result = '';
    let currentLength = 0;
  
    for (let word of words) {
      if (currentLength + word.length + 1 > charLimit) break;
      result += (result ? ' ' : '') + word;
      currentLength = result.length;
    }
  
    return result + '...';
  };

  // Determina si se debe mostrar el toggle
  const shouldShowToggle = (desc) => {
    return calculateLines(desc) > MAX_LINES;
  };

  const needsToggle = shouldShowToggle(description);

  return (
    <div className="mb-4 relative">
      {/* Texto con limitación cuando no está expandido */}
      <p className="text-white/80 font-sans text-base leading-relaxed tracking-wide break-words whitespace-pre-line">
        {expanded ? description : getShortDescriptionCombined(description, 25, 2)}
      </p>

      {/* Botón para mostrar más/menos */}
      {needsToggle && (
        <button
          onClick={onToggleExpand}
          className="text-cyan-300 hover:text-cyan-100 text-sm font-medium mt-1 flex items-center"
        >
          {expanded ? (
            <>
              <ChevronIcon expanded />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronIcon expanded={false} />
              Mostrar más
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TaskDescription;