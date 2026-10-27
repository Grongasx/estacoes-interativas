// src/components/ui/NavigationMap.tsx
'use client';

import React from 'react';
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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-indigo-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Lado Esquerdo: Logo / Voltar ao Menu Principal */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{isHome ? 'Exploradores do Clima' : '↑ Menu Principal'}</span>
          </Link>

          {/* Contador de Medalhas */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <span>🏆</span>
            <span>
              {completedMissions.length} de {MISSION_STEPS.length} missões
            </span>
          </div>
        </div>

        {/* Lado Direito: Controles de Acessibilidade e Glossário */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGlossary('translacao')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs sm:text-sm transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>6. Glossário</span>
          </button>

          <button
            type="button"
            onClick={toggleLargeText}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm transition-colors border ${
              largeTextMode
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Aumentar tamanho das letras para facilitar a leitura"
          >
            <Type className="w-4 h-4" />
            <span className="hidden md:inline">
              {largeTextMode ? 'Letra Maior: ON' : 'Letra Maior'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm transition-colors border ${
              soundEnabled
                ? 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-200'
                : 'bg-rose-100 text-rose-700 border-rose-200'
            }`}
            title="Ativar ou desativar leitura em voz alta"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden md:inline">Voz: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden md:inline">Voz: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export const MissionCardsGrid: React.FC = () => {
  const { completedMissions, largeTextMode, openGlossary } = useProgressStore();

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-indigo-100 pb-4">
        <div className="flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-indigo-600" />
          <h2 className="text-2xl font-black text-slate-800">
            Mapa de Navegação
          </h2>
        </div>
        <p className="text-sm font-semibold text-slate-500">
          Escolha uma missão em sequência ou clique direto no tema que quer explorar!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MISSION_STEPS.map((step) => {
          const isCompleted = completedMissions.includes(step.id);

          return (
            <Link
              key={step.id}
              href={`/explorar/${step.slug}`}
              className={`group relative rounded-3xl p-6 border-4 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                isCompleted
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'
                  : 'bg-white border-indigo-100 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-indigo-100 group-hover:scale-110 transition-transform flex items-center justify-center text-2xl shadow-sm">
                    {step.badgeEmoji}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Concluída!
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">
                      Missão {step.id}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">
                  {step.title}
                </h3>
                <p
                  className={`text-slate-600 font-medium mb-4 ${
                    largeTextMode ? 'text-base' : 'text-sm'
                  }`}
                >
                  {step.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-extrabold text-indigo-600">
                <span>Medalha: {step.badgeName}</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  Explorar →
                </span>
              </div>
            </Link>
          );
        })}

        {/* Card 6: Glossário Científico */}
        <button
          type="button"
          onClick={() => openGlossary('eixo-terrestre')}
          className="group text-left rounded-3xl p-6 border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="w-12 h-12 rounded-2xl bg-purple-200 group-hover:scale-110 transition-transform flex items-center justify-center text-2xl shadow-sm">
                📖
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">
                Consulta Rápida
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-800 group-hover:text-purple-700 transition-colors mb-1">
              6. Glossário Científico
            </h3>
            <p
              className={`text-slate-600 font-medium mb-4 ${
                largeTextMode ? 'text-base' : 'text-sm'
              }`}
            >
              Dicionário ilustrado com áudio para entender palavras como Eixo, Órbita e Hemisfério!
            </p>
          </div>

          <div className="pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-extrabold text-purple-700">
            <span>5 palavras científicas</span>
            <span className="group-hover:translate-x-1 transition-transform">
              Abrir Dicionário →
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};