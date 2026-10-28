// src/components/ui/NavigationMap.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Volume2,
  VolumeX,
  Type,
  CheckCircle2,
  Compass,
  Award,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { MISSION_STEPS } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';

export const TopAccessibilityBar: React.FC = () => {
  const pathname = usePathname();
  const {
    completedMissions,
    soundEnabled,
    largeTextMode,
    toggleSound,
    toggleLargeText,
    openGlossary,
  } = useProgressStore();

  const isHome = pathname === '/';

  return (
    <>
      {/* BARRA SUPERIOR SEMÂNTICA STICKY COM VISUAL CÓSMICO */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10 text-white shadow-lg transition-all">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Lado Esquerdo: Logo / Voltar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm transition-transform active:scale-95 shrink-0 border border-white/15"
              aria-label="Ir para o menu principal"
            >
              <Home className="w-4 h-4 text-amber-300" />
              <span className="font-extrabold">{isHome ? 'Exploradores' : '← Início'}</span>
            </Link>

            {/* Contador de Medalhas */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-amber-400/20 border border-amber-300/30 text-amber-300 text-[11px] sm:text-xs font-black">
              <span>🏆</span>
              <span>
                {completedMissions.length}/{MISSION_STEPS.length} <span className="hidden xs:inline">missões</span>
              </span>
            </div>
          </div>

          {/* Lado Direito: Controles de Acessibilidade */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => openGlossary('translacao')}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span className="hidden sm:inline">Glossário</span>
              <span className="sm:hidden text-xs">Dicionário</span>
            </button>

            <button
              type="button"
              onClick={toggleLargeText}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-colors border cursor-pointer ${
                largeTextMode
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15'
              }`}
              title="Aumentar tamanho das letras para facilitar a leitura"
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">{largeTextMode ? 'Letra Maior: ON' : 'Letra Maior'}</span>
              <span className="sm:hidden text-xs">Aa</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-colors border cursor-pointer ${
                soundEnabled
                  ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border-sky-400/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              }`}
              title="Ativar ou desativar narração em voz alta"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-sky-300" />
                  <span className="hidden sm:inline">Voz: ON</span>
                  <span className="sm:hidden text-[10px]">Voz</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-rose-300" />
                  <span className="hidden sm:inline">Voz: OFF</span>
                  <span className="sm:hidden text-[10px]">Mudo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* BARRA DE NAVEGAÇÃO INFERIOR PARA SMARTPHONES (NATIVE APP FEEL) */}
      <nav
        aria-label="Navegação rápida móvel"
        className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-indigo-100 z-50 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-around"
      >
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isHome ? 'text-indigo-600 font-black' : 'text-slate-500 font-bold'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Início</span>
        </Link>

        <button
          type="button"
          onClick={() => openGlossary('translacao')}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-purple-700 font-bold active:scale-95"
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Glossário</span>
        </button>

        <button
          type="button"
          onClick={toggleLargeText}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl font-bold active:scale-95 ${
            largeTextMode ? 'text-emerald-700 font-black' : 'text-slate-500'
          }`}
          title="Alternar tamanho do texto"
        >
          <Type className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{largeTextMode ? 'Letra A+' : 'Letra'}</span>
        </button>

        <button
          type="button"
          onClick={toggleSound}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl font-bold active:scale-95 ${
            soundEnabled ? 'text-sky-700 font-black' : 'text-rose-600'
          }`}
          title="Alternar narração em áudio"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Voz: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Voz: OFF</span>
            </>
          )}
        </button>
      </nav>
    </>
  );
};

export const MissionCardsGrid: React.FC = () => {
  const { completedMissions, largeTextMode, openGlossary } = useProgressStore();

  const getMissionTheme = (id: number) => {
    switch (id) {
      case 1:
        return {
          border: 'border-amber-300/80 hover:border-amber-400',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          iconBg: 'bg-amber-100 text-amber-800',
          accentText: 'group-hover:text-amber-700',
        };
      case 2:
        return {
          border: 'border-sky-300/80 hover:border-sky-400',
          badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
          iconBg: 'bg-sky-100 text-sky-800',
          accentText: 'group-hover:text-sky-700',
        };
      case 3:
        return {
          border: 'border-orange-300/80 hover:border-orange-400',
          badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
          iconBg: 'bg-orange-100 text-orange-800',
          accentText: 'group-hover:text-orange-700',
        };
      case 4:
        return {
          border: 'border-emerald-300/80 hover:border-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          iconBg: 'bg-emerald-100 text-emerald-800',
          accentText: 'group-hover:text-emerald-700',
        };
      case 5:
        return {
          border: 'border-purple-300/80 hover:border-purple-400',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
          iconBg: 'bg-purple-100 text-purple-800',
          accentText: 'group-hover:text-purple-700',
        };
      case 6:
      default:
        return {
          border: 'border-yellow-400/80 hover:border-yellow-500',
          badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
          iconBg: 'bg-gradient-to-tr from-amber-200 to-yellow-200 text-amber-900',
          accentText: 'group-hover:text-amber-800',
        };
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b-2 border-indigo-100 pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-indigo-600 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Mapa de Navegação
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Escolha uma missão em sequência ou toque direto no tema desejado!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {MISSION_STEPS.map((step) => {
          const isCompleted = completedMissions.includes(step.id);
          const theme = getMissionTheme(step.id);

          return (
            <Link
              key={step.id}
              href={`/explorar/${step.slug}`}
              className={`group relative rounded-3xl p-4 sm:p-6 border-3 sm:border-4 transition-all duration-200 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-xl flex flex-col justify-between ${
                isCompleted
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-sm'
                  : `bg-white ${theme.border} shadow-sm`
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <span className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${theme.iconBg} group-hover:scale-110 transition-transform flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0`}>
                    {step.badgeEmoji}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] sm:text-xs font-black shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Concluída!
                    </span>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full ${theme.badgeBg} text-[11px] sm:text-xs font-extrabold border`}>
                      Missão {step.id}
                    </span>
                  )}
                </div>

                <h3 className={`text-lg sm:text-xl font-black text-slate-900 ${theme.accentText} transition-colors mb-1 leading-snug`}>
                  {step.title}
                </h3>
                <p
                  className={`text-slate-600 font-medium mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none ${
                    largeTextMode ? 'text-base' : 'text-xs sm:text-sm'
                  }`}
                >
                  {step.subtitle}
                </p>
              </div>

              <div className="pt-2.5 sm:pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-black text-indigo-600">
                <span className="truncate pr-2 text-slate-700 font-bold">Medalha: {step.badgeName}</span>
                <span className="shrink-0 font-black text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Explorar →
                </span>
              </div>
            </Link>
          );
        })}

        {/* Card 7: Glossário Científico */}
        <button
          type="button"
          onClick={() => openGlossary('eixo-terrestre')}
          className="group text-left rounded-3xl p-4 sm:p-6 border-3 sm:border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 transition-all duration-200 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-xl flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
              <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-200 group-hover:scale-110 transition-transform flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0">
                📖
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[11px] sm:text-xs font-black shadow-sm">
                Consulta Rápida
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors mb-1 leading-snug">
              Dicionário do Espaço (Glossário)
            </h3>
            <p
              className={`text-slate-600 font-medium mb-3 sm:mb-4 ${
                largeTextMode ? 'text-base' : 'text-xs sm:text-sm'
              }`}
            >
              Dicionário ilustrado com áudio para entender palavras como Eixo, Órbita e Hemisfério!
            </p>
          </div>

          <div className="pt-2.5 sm:pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-black text-purple-700">
            <span>5 termos essenciais</span>
            <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-black">
              Abrir Dicionário →
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};