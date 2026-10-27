// src/components/ui/AudioButton.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Square, VolumeX } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';

interface AudioButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  label = 'Ouvir explicação',
  className = '',
  size = 'md',
}) => {
  const { soundEnabled } = useProgressStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = useCallback(() => {
    if (!isSupported || !soundEnabled) return;

    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.92; // Ritmo levemente mais calmo e didático
    utterance.pitch = 1.05;

    const voices = synth.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang.includes('pt-BR') || v.lang.includes('pt')
    );
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  }, [isSupported, soundEnabled, isSpeaking, text]);

  if (!isSupported) return null;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  }[size];

  return (
    <button
      type="button"
      onClick={handleSpeak}
      disabled={!soundEnabled}
      title={
        !soundEnabled
          ? 'O som está desativado no topo da página'
          : isSpeaking
          ? 'Parar leitura'
          : label
      }
      className={`inline-flex items-center justify-center font-bold rounded-full transition-all shadow-sm active:scale-95 ${sizeClasses} ${
        !soundEnabled
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
          : isSpeaking
          ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md'
      } ${className}`}
    >
      {!soundEnabled ? (
        <>
          <VolumeX className="w-4 h-4 shrink-0" />
          <span>Som Desativado</span>
        </>
      ) : isSpeaking ? (
        <>
          <Square className="w-4 h-4 fill-current shrink-0" />
          <span>Parar Áudio</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};