import { useState, useEffect } from 'react';

export const useVoiceAssistant = (assistantId: string | null) => {
  const [isListening, setIsListening] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!assistantId || !('webkitSpeechRecognition' in window)) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript.toLowerCase();
      setTranscript(text);

      const nameMap: Record<string, string> = {
        tiger: 'тигр',
        monkey: 'обезьяна',
        unknown: 'помощник',
      };

      const triggerName = assistantId ? nameMap[assistantId] : 'помощник';
      if (text.includes(triggerName)) {
        setIsActivated(true);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [assistantId, isListening]);

  const startListening = () => setIsListening(true);
  const stopListening = () => setIsListening(false);
  const deactivate = () => setIsActivated(false);

  return {
    isListening,
    isActivated,
    transcript,
    startListening,
    stopListening,
    deactivate,
  };
};