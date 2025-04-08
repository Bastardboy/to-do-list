document.getElementById('startBtn').addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true; // Para resultados provisionales

    recognition.onresult = event => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                document.getElementById('textField').value += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
    };

    recognition.onerror = event => {
        console.error('Error:', event.error);
    };

    recognition.start();
});