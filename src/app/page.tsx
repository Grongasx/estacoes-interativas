// src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Rocket, RotateCcw, Award } from 'lucide-react';
import { MISSION_STEPS } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { MissionCardsGrid } from '@/components/ui/NavigationMap';
import { AudioButton } from '@/components/ui/AudioButton';

export default function HomePage() {
  const { completedMissions, resetProgress, largeTextMode } = useProgressStore();
  const allCompleted = completedMissions.length === MISSION_STEPS.length;

  return (
    <div className="space-y-12">
      {/* Banner Principal de Boas-Vindas */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-10 shadow-xl border-4 border-indigo-200">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Jornada de Exploração Científica Interativa</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            As Estações do Ano: Como Funciona o Clima na Terra?
          </h1>

          <p
            className={`text-indigo-100 leading-relaxed font-medium ${
              largeTextMode ? 'text-xl' : 'text-base sm:text-lg'
            }`}
          >
            Bem-vindo à tua jornada espacial! Este laboratório interativo foi construído para navegares pelos mistérios do movimento da Terra e descobrires, na prática, como surgem o Verão, o Outono, o Inverno e a Primavera.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={`/explorar/${MISSION_STEPS[0].slug}`}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base transition-all shadow-lg hover:scale-105"
            >
              <Rocket className="w-5 h-5" />
              <span>Começar pela Missão 1</span>
            </Link>

            <AudioButton
              text="Bem-vindo à tua jornada de exploração científica! Este material foi construído para navegares pelos mistérios do movimento da Terra e entenderes como surgem as estações do ano. Abaixo está o teu Mapa de Navegação. Podes explorar em sequência ou clicar diretamente na missão que desejas descobrir!"
              label="Ouvir Boas-Vindas"
              size="lg"
            />
          </div>
        </div>

        {/* Ilustração Decorativa Espacial */}
        <div className="hidden lg:flex flex-col items-center justify-center absolute right-10 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-90">
          <div className="text-8xl animate-pulse">☀️</div>
          <div className="text-6xl -mt-4 ml-24">🌍</div>
        </div>
      </section>

      {/* Painel de Recompensas e Progresso do Aluno */}
      <section className="bg-white rounded-3xl p-6 border-4 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shrink-0">
            {allCompleted ? '👑' : '🏅'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                Suas Conquistas Científicas
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-800">
              {allCompleted
                ? 'Parabéns! Concluíste todas as 5 missões espaciais!'
                : `Já desbloqueaste ${completedMissions.length} de ${MISSION_STEPS.length} medalhas!`}
            </h2>
          </div>
        </div>

        {completedMissions.length > 0 && (
          <button
            type="button"
            onClick={resetProgress}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Missões</span>
          </button>
        )}
      </section>

      {/* Mapa de Navegação Principal */}
      <MissionCardsGrid />
    </div>
  );
}