// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Rocket,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Lock,
  Trophy,
  Zap,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { MISSION_STEPS } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { MissionCardsGrid } from '@/components/ui/NavigationMap';
import { AudioButton } from '@/components/ui/AudioButton';
import { MissionBadge } from '@/components/ui/MissionBadge';

interface LearningSummaryItem {
  id: number;
  title: string;
  badgeName: string;
  keyTakeaway: string;
  coreConcepts: string[];
  scientificFact: string;
  emoji: string;
  colorTheme: string;
  borderTheme: string;
}

const LEARNING_SUMMARIES: LearningSummaryItem[] = [
  {
    id: 1,
    title: 'O Mito do Sol Derrubado!',
    badgeName: 'Detetive do Espaço',
    keyTakeaway:
      'Muita gente achava que no Verão a Terra chegava mais perto do Sol, mas isso é só um boato! Em janeiro a Terra até fica um pouquinho mais perto do Sol, e mesmo assim é inverno na Europa. O verdadeiro segredo é que a Terra viaja pelo espaço meio deitadinha!',
    coreConcepts: [
      'A Terra não chega muito perto nem longe do Sol',
      'O calor não depende da distância',
      'O planeta viaja meio inclinado no espaço',
    ],
    scientificFact:
      'A pista de corrida da Terra no espaço é quase um círculo perfeitinho, então a distância do Sol quase não muda!',
    emoji: '🕵️‍♂️',
    colorTheme: 'from-indigo-900 to-slate-900',
    borderTheme: 'border-indigo-400',
  },
  {
    id: 2,
    title: 'A Viagem do Ano e o Dia Extra de Fevereiro!',
    badgeName: 'Piloto de Órbita',
    keyTakeaway:
      'A Terra dá uma volta completa ao redor do Sol que dura 365 dias (o ano todinho!), mas sobram 6 horinhas em cada volta. Ao juntar essas 6 horas durante 4 anos, somamos 24 horas (um dia novinho!), que é o dia 29 de fevereiro no Ano Bissexto!',
    coreConcepts: [
      'Translação: 1 volta completa no Sol = 1 ano',
      'As 6 horas que sobram a cada ano',
      'A mágica do Ano Bissexto: 4 vezes 6h = 24h (1 dia)',
    ],
    scientificFact:
      'Enquanto você lê isso, a Terra está voando pelo espaço a mais de 100 mil quilômetros por hora sem você nem sentir!',
    emoji: '🛸',
    colorTheme: 'from-teal-950 to-slate-900',
    borderTheme: 'border-teal-400',
  },
  {
    id: 3,
    title: 'O Truque da Lanterna e dos 23,5 Graus!',
    badgeName: 'Mestre da Luz Solar',
    keyTakeaway:
      'Pensa numa lanterna no escuro: se você mirar ela reta para o chão, a luz fica concentrada e quentinha (é o Verão!). Se você inclinar a lanterna, a luz se estica, fica espalhada e fraquinha (é o Inverno!). A Terra é meio inclinada, por isso o Sol bate diferente em cada lugar!',
    coreConcepts: [
      'A Terra fica meio deitadinha (23,5 graus)',
      'Luz que bate reta esquenta muito (Verão)',
      'Luz que bate de lado espalha e fica fraca (Inverno)',
    ],
    scientificFact:
      'Se a Terra ficasse totalmente em pé, todos os dias do ano teriam exatamente o mesmo clima para sempre!',
    emoji: '🔦',
    colorTheme: 'from-amber-950 to-slate-900',
    borderTheme: 'border-amber-400',
  },
  {
    id: 4,
    title: 'O Espelho da Terra: Brasil vs Portugal!',
    badgeName: 'Guardião das Estações',
    keyTakeaway:
      'A Terra tem duas metades que funcionam ao contrário como um espelho! Quando no Brasil estamos na praia de calção no Verão, lá na Europa as crianças usam luvas e casacos pesados no Inverno. E quando as folhas caem no Outono aqui, lá é Primavera cheia de flores!',
    coreConcepts: [
      'Metade de baixo (Sul) e metade de cima (Norte)',
      'Quando um lado esquenta, o outro lado esfria',
      'As folhas nascem na Primavera e caem no Outono',
    ],
    scientificFact:
      'No Natal, em 25 de Dezembro, as pessoas no Brasil comem frutas geladas no calor, enquanto nos Estados Unidos montam bonecos de neve!',
    emoji: '🌦️',
    colorTheme: 'from-emerald-950 to-slate-900',
    borderTheme: 'border-emerald-400',
  },
  {
    id: 5,
    title: 'O Cabo de Guerra entre o Dia e a Noite!',
    badgeName: 'Astrônomo Chefe',
    keyTakeaway:
      'No Solstício de Verão, o Dia vence com folga: temos 14 horas de luz quentinha para brincar e uma noite curta! No Solstício de Inverno, a Noite vence com 14 horas de escuridão. E nos Equinócios dá empate perfeito: são exatamente 12 horas de Dia e 12 horas de Noite para todo mundo!',
    coreConcepts: [
      'Solstício de Verão: o dia mais longo do ano',
      'Solstício de Inverno: a noite mais longa do ano',
      'Equinócio: o grande empate de 12 horas de Dia e 12 horas de Noite',
    ],
    scientificFact:
      'Nos polos da Terra, no auge do verão, o Sol não se põe nem à meia-noite! O céu continua clarinho durante a noite inteira.',
    emoji: '⚖️',
    colorTheme: 'from-purple-950 to-slate-900',
    borderTheme: 'border-purple-400',
  },
  {
    id: 6,
    title: 'O Grande Quiz dos Mestres do Espaço!',
    badgeName: 'Campeão Supremo',
    keyTakeaway:
      'Parabéns! Você provou que é um verdadeiro gênio da Terra e do Sol! Agora você sabe tudo sobre o mito da distância, a viagem dos 365 dias, o ano bissexto, a lanterna inclinadinha em 23,5°, o espelho do Brasil e da Europa e o empate das 12 horas nos equinócios!',
    coreConcepts: [
      'Revisão completa de todas as 5 missões',
      'Desafios e perguntas dos mestres respondidos',
      'Medalha e Coroa de Campeão Supremo conquistadas!',
    ],
    scientificFact:
      'Completando as 6 missões, você adquiriu conhecimentos reais que muitos adultos ainda se confundem!',
    emoji: '🏆',
    colorTheme: 'from-amber-950 to-slate-900',
    borderTheme: 'border-amber-400',
  },
];

export default function HomePage() {
  const { completedMissions, resetProgress, largeTextMode } = useProgressStore();
  const allCompleted = completedMissions.length === MISSION_STEPS.length;

  const currentXP = completedMissions.length * 200;
  const maxXP = 1200;
  const progressPercentage = Math.round((completedMissions.length / MISSION_STEPS.length) * 100);

  // Estado para controlar as cartas viradas (Flip Card)
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);

  const toggleFlip = (id: number) => {
    setFlippedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getScientistRank = () => {
    switch (completedMissions.length) {
      case 0:
        return {
          title: 'Explorador Aprendiz',
          icon: '🔭',
          desc: 'Pronto para desvendar os segredos do espaço!',
        };
      case 1:
        return {
          title: 'Detetive do Sol',
          icon: '🔍',
          desc: 'Você descobriu o mito da distância!',
        };
      case 2:
        return {
          title: 'Piloto das Estrelas',
          icon: '🛸',
          desc: 'Você aprendeu os 365 dias e o ano bissexto!',
        };
      case 3:
        return {
          title: 'Mestre da Lanterna Solar',
          icon: '☀️',
          desc: 'Você entendeu a Terra inclinadinha!',
        };
      case 4:
        return {
          title: 'Guardião das Quatro Estações',
          icon: '🌍',
          desc: 'Você sabe como o Brasil e a Europa são opostos!',
        };
      case 5:
        return {
          title: 'Mestre dos Astros e das Horas',
          icon: '⚖️',
          desc: 'Você domina os Solstícios e Equinócios!',
        };
      case 6:
        return {
          title: 'Grande Campeão Supremo do Espaço',
          icon: '👑',
          desc: 'Você zerou todas as missões e venceu o Grande Quiz!',
        };
      default:
        return {
          title: 'Explorador',
          icon: '🚀',
          desc: 'Em viagem pelo espaço!',
        };
    }
  };

  const rank = getScientistRank();

  const audioSummaryText =
    completedMissions.length > 0
      ? `Resumo das suas aventuras no espaço! Você tem ${currentXP} pontos no nível ${rank.title}. Já conquistou ${completedMissions.length} medalhas! Toque nas cartas para ler e virar os segredos aprendidos!`
      : 'Bem-vindo ao laboratório das estações do ano! Faça as missões para ganhar pontos, conquistar medalhas douradas e descobrir os segredos da Terra!';

  return (
    <div className="space-y-6 sm:space-y-12">
      {/* BANNER PRINCIPAL COM MINI-PLANETÁRIO CSS VIVO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-5 sm:p-10 shadow-2xl border-3 sm:border-4 border-indigo-300/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Lado Esquerdo: Conteúdo e CTA 3D estilo Duolingo */}
          <div className="relative z-10 lg:col-span-7 space-y-3.5 sm:space-y-5">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-wider border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Laboratório Espacial das Crianças</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              As Estações do Ano: Por que o Clima Muda na Terra?
            </h1>

            <p
              className={`text-indigo-100 leading-relaxed font-medium ${
                largeTextMode ? 'text-lg sm:text-xl' : 'text-xs sm:text-base md:text-lg'
              }`}
            >
              Venha viajar pelo espaço! Descubra de um jeito muito fácil e divertido por que faz calor no Verão, friozinho no Inverno, ventinho no Outono e flores na Primavera!
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href={`/explorar/${MISSION_STEPS[0].slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all shadow-xl cursor-pointer w-full sm:w-auto"
              >
                <Rocket className="w-5 h-5 fill-current shrink-0" />
                <span>{completedMissions.length > 0 ? 'Continuar Aventura' : 'Começar pela Missão 1'}</span>
              </Link>

              <AudioButton
                text={audioSummaryText}
                label="Ouvir Explicação da Página"
                size="md"
              />
            </div>
          </div>

          {/* Lado Direito: Mini-Planetário CSS Animado Puro */}
          <div className="relative lg:col-span-5 flex items-center justify-center py-4 lg:py-0 select-none">
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Halo de luz cósmico de fundo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-purple-500/20 rounded-full blur-2xl animate-pulse" />

              {/* Anel tracejado da órbita */}
              <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.06)]" />

              {/* Sol no centro com raios e pulso suave */}
              <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-[0_0_40px_rgba(251,191,36,0.8)] flex items-center justify-center animate-pulse">
                <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]">☀️</span>
              </div>

              {/* Contêiner da Órbita giratória contínua (spin lento de 20s) */}
              <div
                className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full animate-spin"
                style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}
              >
                {/* A Terra posicionada na linha da órbita com inclinação de 23.5° (Easter egg da Missão 3!) */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-sky-600 via-blue-400 to-emerald-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] flex items-center justify-center rotate-[23.5deg] border-2 border-white/50"
                    title="Terra inclinadinha em 23,5°!"
                  >
                    <span className="text-xl sm:text-2xl filter drop-shadow">🌍</span>
                  </div>
                  {/* Linha indicativa sutil do eixo imaginário inclinado */}
                  <div className="w-0.5 h-14 bg-amber-400/70 -mt-12 rotate-[23.5deg] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAINEL 1: PONTUAÇÃO E NÍVEL DA CRIANÇA (GAMIFICAÇÃO VIVA) */}
      <section className="bg-white rounded-3xl p-4 sm:p-8 border-3 sm:border-4 border-amber-200 shadow-xl space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg text-2xl sm:text-3xl font-black shrink-0">
              {rank.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-700">
                  Seus Pontos e Conquistas
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 leading-snug">
                {rank.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold line-clamp-1 sm:line-clamp-none">
                {rank.desc}
              </p>
            </div>
          </div>

          {completedMissions.length > 0 && (
            <button
              type="button"
              onClick={resetProgress}
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
              title="Recomeçar do zero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jogar Novamente</span>
            </button>
          )}
        </div>

        {/* Barra de Pontos com Gradiente Vibrante Ciano -> Roxo -> Dourado */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Pontos de Sabedoria</span>
            </span>
            <span className="text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-black font-mono">
              {currentXP} de {maxXP} Pontos ({progressPercentage}%)
            </span>
          </div>

          <div className="w-full h-4 sm:h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border-2 border-slate-200 shadow-inner">
            <div
              style={{ width: `${Math.max(6, progressPercentage)}%` }}
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400 rounded-full transition-all duration-700 ease-out shadow-md flex items-center justify-end pr-1.5"
            >
              {progressPercentage >= 20 && (
                <span className="text-[9px] sm:text-[10px] font-black text-white drop-shadow-sm">
                  {currentXP} pts
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3 Cartões com Micro-interações táteis e Escala */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
          <div className="p-2.5 sm:p-4 rounded-2xl backdrop-blur-md bg-amber-50/90 border-2 border-amber-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md cursor-default">
            <span className="text-2xl sm:text-3xl">🏅</span>
            <div>
              <span className="text-[9px] sm:text-[11px] font-extrabold uppercase text-amber-800 block">
                Medalhas
              </span>
              <span className="text-sm sm:text-xl font-black text-amber-950">
                {completedMissions.length} de {MISSION_STEPS.length}
              </span>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-2xl backdrop-blur-md bg-emerald-50/90 border-2 border-emerald-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md cursor-default">
            <span className="text-2xl sm:text-3xl">💡</span>
            <div>
              <span className="text-[9px] sm:text-[11px] font-extrabold uppercase text-emerald-800 block">
                Segredos
              </span>
              <span className="text-sm sm:text-xl font-black text-emerald-950">
                {completedMissions.length * 3} Descobertos
              </span>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-2xl backdrop-blur-md bg-indigo-50/90 border-2 border-indigo-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md cursor-default">
            <span className="text-2xl sm:text-3xl">⭐</span>
            <div>
              <span className="text-[9px] sm:text-[11px] font-extrabold uppercase text-indigo-800 block">
                Nível
              </span>
              <span className="text-sm sm:text-xl font-black text-indigo-950">
                Fase {completedMissions.length}/6
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PAINEL 2: QUADRO DE MEDALHAS (CARROSSEL COM FEEDBACK TÁTIL) */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 sm:p-8 border-3 sm:border-4 border-amber-400/50 shadow-2xl space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shrink-0">
              🎖️
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full inline-block mb-0.5 border border-amber-300/30">
                Suas Conquistas
              </span>
              <h2 className="text-xl sm:text-3xl font-black">
                Quadro de Medalhas
              </h2>
            </div>
          </div>

          <div className="text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300">
            {allCompleted ? '👑 Todas Desbloqueadas!' : `${completedMissions.length}/${MISSION_STEPS.length} Conquistadas`}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-3xl">
          Complete cada missão para ganhar sua medalha oficial! Deslize para ver sua coleção completa:
        </p>

        {/* Carrossel Touch com Feedback Visual */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-3 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
          {MISSION_STEPS.map((step) => {
            const isUnlocked = completedMissions.includes(step.id);

            return (
              <Link
                key={step.id}
                href={`/explorar/${step.slug}`}
                className={`group snap-center shrink-0 w-[145px] sm:w-auto p-3.5 sm:p-4 rounded-3xl transition-all duration-200 flex flex-col items-center justify-between cursor-pointer ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-amber-400/20 via-white/10 to-white/5 border-2 border-amber-400/80 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20 hover:scale-105'
                    : 'bg-white/5 border-2 border-white/10 grayscale opacity-60 hover:opacity-85 hover:grayscale-0'
                }`}
              >
                <div className="text-[10px] sm:text-[11px] font-extrabold uppercase text-amber-300 mb-1">
                  Missão {step.id}
                </div>

                <div className="relative my-1">
                  <MissionBadge
                    missionId={step.id}
                    badgeName={step.badgeName}
                    isUnlocked={isUnlocked}
                    size="sm"
                    showLabel={false}
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl filter drop-shadow group-hover:rotate-12 transition-transform duration-200">
                        🔒
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center w-full">
                  <span className="text-[11px] sm:text-xs font-black block text-white group-hover:text-amber-300 transition-colors truncate">
                    {step.badgeName}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-white/10 text-slate-300 group-hover:text-amber-200'
                    }`}
                  >
                    {isUnlocked ? (
                      '✓ Ganhou!'
                    ) : (
                      <>
                        <span className="inline-block group-hover:rotate-12 transition-transform">🔒</span>
                        <span>Bloqueada</span>
                      </>
                    )}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Troféu Final de Conclusão */}
        {allCompleted && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 border-2 sm:border-3 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl animate-bounce">👑</span>
              <div>
                <span className="text-[10px] sm:text-xs font-black uppercase text-amber-300 tracking-wider">
                  Troféu de Ouro Supremo
                </span>
                <h4 className="text-lg sm:text-2xl font-black text-white">
                  Parabéns! Você Concluiu Todas as Missões!
                </h4>
                <p className="text-xs text-amber-100 mt-0.5">
                  Agora você é um Grande Campeão do Espaço e sabe tudo sobre a Terra!
                </p>
              </div>
            </div>

            <span className="px-4 py-2 rounded-full bg-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-lg shrink-0">
              🌟 Certificado Campeão
            </span>
          </motion.div>
        )}
      </section>

      {/* PAINEL 3: O QUE VOCÊ APRENDEU (CADERNO DE DESCOBERTAS - FLIP CARDS CSS) */}
      <section className="bg-white rounded-3xl p-4 sm:p-8 border-3 sm:border-4 border-indigo-200 shadow-xl space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg text-2xl sm:text-3xl font-black shrink-0">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-700">
                  Caderno de Descobertas
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 leading-snug">
                O que Você Aprendeu
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold line-clamp-1 sm:line-clamp-none">
                Todos os 6 cartões de segredos cósmicos! Toque nas cartas desbloqueadas para virar e ler!
              </p>
            </div>
          </div>

          <AudioButton
            text="Este é o seu caderno de descobertas! Aqui você confere os segredos de cada missão. Toque nas cartas desbloqueadas para virar e ler o que você aprendeu sobre a Terra e o Sol!"
            label="Ouvir o que você aprendeu"
            size="sm"
          />
        </div>

        {/* Grade de 6 Cartas Flip Card Responsiva */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {LEARNING_SUMMARIES.map((item) => {
            const isUnlocked = completedMissions.includes(item.id);
            const isFlipped = flippedCardIds.includes(item.id);

            // Se bloqueada: Exibe estado visual bonito de Segredo Bloqueado
            if (!isUnlocked) {
              return (
                <div
                  key={item.id}
                  className="rounded-3xl border-3 border-dashed border-indigo-200 bg-gradient-to-b from-indigo-50/70 to-slate-100/90 p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group min-h-[380px]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                        Missão {item.id}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-extrabold">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                      </span>
                    </div>

                    <div className="py-4 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform border border-indigo-200 mb-3">
                        <Lock className="w-8 h-8 animate-pulse text-indigo-600" />
                      </div>
                      <span className="text-xs font-black uppercase text-indigo-800 tracking-wider">
                        Segredo Bloqueado
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-2 leading-relaxed">
                        Jogue a Missão {item.id} para revelar as descobertas secretas e destravar esta carta cósmica!
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-indigo-100">
                    <Link
                      href={`/explorar/${MISSION_STEPS[item.id - 1].slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all shadow-md cursor-pointer"
                    >
                      <span>Jogar Missão {item.id}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            }

            // Se desbloqueada: Funciona como Flip Card CSS puro 3D
            return (
              <div
                key={item.id}
                className="[perspective:1000px] w-full min-h-[380px]"
              >
                <div
                  onClick={() => toggleFlip(item.id)}
                  className={`relative w-full h-full rounded-3xl cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] min-h-[380px] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRENTE DA CARTA (RESUMO & CONQUISTA) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-3 border-amber-400 shadow-xl flex flex-col justify-between select-none">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/30">
                          Missão {item.id} · {item.badgeName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Descoberto!
                        </span>
                      </div>

                      <div className="py-2 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl shadow-inner border border-white/20 mb-3">
                          {item.emoji}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-indigo-200 mt-2 line-clamp-3 font-medium leading-relaxed">
                          {item.keyTakeaway}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/15 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-amber-400 text-amber-950 font-black text-xs shadow-md hover:scale-105 transition-transform">
                        <span>🔄</span>
                        <span>Toque para Virar a Carta</span>
                      </div>
                    </div>
                  </div>

                  {/* VERSO DA CARTA (SEGREDO CIENTÍFICO DETALHADO) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border-3 border-amber-300 shadow-2xl flex flex-col justify-between overflow-y-auto select-none">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/15 pb-2">
                        <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                          🎯 Segredo Revelado
                        </span>
                        <span className="text-[10px] font-extrabold text-indigo-300 bg-white/10 px-2 py-0.5 rounded-full">
                          Toque para desvirar ↩️
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-black uppercase text-amber-300 block">
                          🧠 O Que Você Aprendeu:
                        </span>
                        <p className="text-xs text-slate-100 font-medium leading-relaxed">
                          {item.keyTakeaway}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-emerald-300 block">
                          ✨ Pontos-Chave:
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-200 font-medium">
                          {item.coreConcepts.map((concept, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-1">
                              <span className="text-emerald-400 font-black shrink-0">✓</span>
                              <span>{concept}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-[11px]">
                        <span className="font-black text-sky-300 block mb-0.5">
                          🔬 Curiosidade Incrível:
                        </span>
                        <p className="text-slate-200 leading-snug">
                          {item.scientificFact}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 text-center border-t border-white/10 mt-2">
                      <span className="text-[10px] text-amber-300 font-bold">
                        ↺ Toque para virar de volta
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MAPA DE NAVEGAÇÃO DAS MISSÕES */}
      <MissionCardsGrid />
    </div>
  );
}