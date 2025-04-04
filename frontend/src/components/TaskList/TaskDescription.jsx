import React from 'react';

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
  const MAX_LINES = 1;
  const CHARS_PER_LINE = 30;

  const calculateLines = (text) => {
    if (!text) return 0;
    const explicitLines = (text.match(/\n/g) || []).length + 1;
    const overflowLines = Math.ceil(text.length / CHARS_PER_LINE);
    return Math.max(explicitLines, overflowLines);
  };

  const getShortDescriptionCombined = (text, charLimit = 100, lineLimit = 3) => {
    const lines = text.split('\n').slice(0, lineLimit);
    const joined = lines.join('\n');
  
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

  const shouldShowToggle = (desc) => calculateLines(desc) > MAX_LINES;
  const needsToggle = shouldShowToggle(description);

  return (
    <div className="mb-4 relative">
      {/* Texto con Inter claramente resaltada */}
      <p className="relative text-white font-medium text-base leading-relaxed tracking-wider break-words whitespace-pre-line">
          {expanded ? description : getShortDescriptionCombined(description, 25, 2)}
      </p>

      {needsToggle && (
        <button
          onClick={onToggleExpand}
          className="text-cyan-300 hover:text-cyan-100 text-sm font-semibold mt-2 flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg transition-all"
        >
          {expanded ? (
            <>
              <ChevronIcon expanded />
              <span className="relative top-px">Mostrar menos</span>
            </>
          ) : (
            <>
              <ChevronIcon expanded={false} />
              <span className="relative top-px">Mostrar más</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TaskDescription;