// src/app/explorar/[etapa]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  BookOpen,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { MISSION_STEPS, GLOSSARY_ITEMS } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';
import { MythBuster } from '@/components/interactive/MythBuster';
import { OrbitSimulator } from '@/components/interactive/OrbitSimulator';
import { TiltFlashlight } from '@/components/interactive/TiltFlashlight';
import { SeasonsCompare } from '@/components/interactive/SeasonsCompare';
import { DayNightScale } from '@/components/interactive/DayNightScale';
import { MasterQuiz } from '@/components/interactive/MasterQuiz';

function MissionStepContent() {
  const params = useParams<{ etapa: string }>();
  const {
    completedMissions,
    completeMission,
    openGlossary,
    largeTextMode,
  } = useProgressStore();

  const currentStepIndex = MISSION_STEPS.findIndex(
    (s) => s.slug === params?.etapa
  );
  const currentStep = MISSION_STEPS[currentStepIndex];

  if (!currentStep) {
    return (
      <div className="bg-white rounded-3xl p-8 border-4 border-rose-200 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-800">
          Missão não encontrada!
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white font-bold text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Voltar ao Menu Principal</span>
        </Link>
      </div>
    );
  }

  const prevStep =
    currentStepIndex > 0 ? MISSION_STEPS[currentStepIndex - 1] : null;
  const nextStep =
    currentStepIndex < MISSION_STEPS.length - 1
      ? MISSION_STEPS[currentStepIndex + 1]
      : null;

  const isCompleted = completedMissions.includes(currentStep.id);

  const renderInteractiveLab = () => {
    switch (currentStep.id) {
      case 1:
        return <MythBuster />;
      case 2:
        return <OrbitSimulator />;
      case 3:
        return <TiltFlashlight />;
      case 4:
        return <SeasonsCompare />;
      case 5:
        return <DayNightScale />;
      case 6:
        return <MasterQuiz />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Barra de Progresso Rápida entre as 5 Missões */}
      <nav className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {MISSION_STEPS.map((step) => {
          const isCurrent = step.id === currentStep.id;
          const isDone = completedMissions.includes(step.id);

          return (
            <Link
              key={step.id}
              href={`/explorar/${step.slug}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-extrabold text-xs whitespace-nowrap transition-all border-2 ${
                isCurrent
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{step.badgeEmoji}</span>
              <span>Missão {step.id}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Cabeçalho de Introdução da Missão */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-lg space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shadow-inner">
              {currentStep.badgeEmoji}
            </span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                Medalha da Missão: {currentStep.badgeName}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black">
                {currentStep.title}
              </h1>
            </div>
          </div>

          <AudioButton
            text={currentStep.audioIntro}
            label="Ouvir Introdução"
            size="md"
          />
        </div>

        <p
          className={`text-indigo-100 leading-relaxed font-medium ${
            largeTextMode ? 'text-xl' : 'text-base sm:text-lg'
          }`}
        >
          {currentStep.introText}
        </p>

        {/* Palavras Destacadas do Glossário nesta Missão */}
        <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300 mr-1">
            <BookOpen className="w-4 h-4" />
            <span>Palavras científicas desta missão (clica para abrir):</span>
          </span>
          {currentStep.glossaryTermsUsed.map((termId: string) => {
            const item = GLOSSARY_ITEMS[termId];
            if (!item) return null;
            return (
              <button
                key={termId}
                type="button"
                onClick={() => openGlossary(termId)}
                className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>{item.emoji}</span>
                <span className="underline decoration-amber-300 underline-offset-2">
                  {item.term}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Laboratório Interativo Específico da Etapa */}
      {renderInteractiveLab()}

      {/* Resumo "Para Guardar na Memória" + Botão de Marcar Missão Concluída */}
      <section className="bg-amber-50 border-4 border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <Lightbulb className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
              Resumo Super Importante!
            </span>
            <p
              className={`font-black text-slate-800 ${
                largeTextMode ? 'text-xl' : 'text-base sm:text-lg'
              }`}
            >
              {currentStep.keyTakeaway}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => completeMission(currentStep.id)}
          className={`px-6 py-3.5 rounded-full font-black text-sm shrink-0 transition-all shadow-sm flex items-center gap-2 ${
            isCompleted
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>
            {isCompleted
              ? `Medalha "${currentStep.badgeName}" Conquistada!`
              : 'Concluir Missão e Ganhar Medalha'}
          </span>
        </button>
      </section>

      {/* Rodapé de Navegação: Anterior | ↑ Voltar ao Menu Principal | Próxima */}
      <footer className="pt-4 border-t-2 border-indigo-100 flex flex-wrap items-center justify-between gap-4">
        {prevStep ? (
          <Link
            href={`/explorar/${prevStep.slug}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-sm border-2 border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior: {prevStep.title}</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>↑ Voltar ao Menu Principal</span>
        </Link>

        {nextStep ? (
          <Link
            href={`/explorar/${nextStep.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all"
          >
            <span>Próxima: {nextStep.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all"
          >
            <span>🎉 Finalizar e Ver Medalhas!</span>
          </Link>
        )}
      </footer>
    </div>
  );
}

export default function MissionStepPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-white rounded-3xl p-8 border-4 border-indigo-100 text-center font-bold text-slate-500">
          A carregar missão espacial...
        </div>
      }
    >
      <MissionStepContent />
    </React.Suspense>
  );
}