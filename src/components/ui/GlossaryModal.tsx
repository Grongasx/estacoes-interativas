// src/components/ui/GlossaryModal.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { GLOSSARY_ITEMS } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from './AudioButton';

export const GlossaryModal: React.FC = () => {
  const activeGlossaryTerm = useProgressStore((state) => state.activeGlossaryTerm);
  const closeGlossary = useProgressStore((state) => state.closeGlossary);
  const openGlossary = useProgressStore((state) => state.openGlossary);
  const largeTextMode = useProgressStore((state) => state.largeTextMode);

  if (!activeGlossaryTerm) return null;

  const currentItem =
    GLOSSARY_ITEMS[activeGlossaryTerm] || Object.values(GLOSSARY_ITEMS)[0];
  const allItems = Object.values(GLOSSARY_ITEMS);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden"
        >
          {/* Cabeçalho do Glossário */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-amber-300" />
              <h3 className="text-lg font-extrabold tracking-wide">
                Glossário Científico
              </h3>
            </div>
            <button
              type="button"
              onClick={closeGlossary}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Fechar glossário"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Seletor rápido de palavras do glossário */}
          <div className="bg-indigo-50/80 px-5 py-3 border-b border-indigo-100 flex flex-wrap gap-2">
            {allItems.map((item) => {
              const isSelected = item.id === currentItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openGlossary(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm scale-105'
                      : 'bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.term}</span>
                </button>
              );
            })}
          </div>

          {/* Conteúdo Principal do Termo */}
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-4xl shadow-inner shrink-0">
                {currentItem.emoji}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                  Palavra Científica
                </span>
                <h4 className="text-2xl font-black text-slate-800">
                  {currentItem.term}
                </h4>
              </div>
            </div>

            <p
              className={`text-slate-700 leading-relaxed font-medium ${
                largeTextMode ? 'text-xl' : 'text-base'
              }`}
            >
              {currentItem.simpleDefinition}
            </p>

            {/* Dica Visual para Imaginar */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-extrabold uppercase text-amber-700 block mb-0.5">
                  Dica para imaginar:
                </span>
                <p
                  className={`text-amber-900 font-semibold ${
                    largeTextMode ? 'text-lg' : 'text-sm'
                  }`}
                >
                  {currentItem.visualHint}
                </p>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <AudioButton
                text={currentItem.audioText}
                label="Ouvir explicação"
              />
              <button
                type="button"
                onClick={closeGlossary}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                Entendi! Fechar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};