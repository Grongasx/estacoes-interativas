// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Rocket,
  RotateCcw,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  Compass,
  Trophy,
  Zap,
  Star,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Globe2
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
    title: 'O Mito da Distância Desvendado',
    badgeName: 'Detetive do Espaço',
    keyTakeaway:
      'O calor e o frio das estações NÃO dependem da distância da Terra ao Sol! A Terra até fica mais perto do Sol em janeiro (no periélio), em pleno inverno europeu. O verdadeiro segredo é o eixo inclinado de 23,5° somado à viagem de translação!',
    coreConcepts: [
      'A órbita quase circular da Terra',
      'Desmistificação: distância não cria estações',
      'A dupla dinâmica: Translação + Eixo Inclinado',
    ],
    scientificFact:
      'A diferença de distância entre o ponto mais próximo e mais distante do Sol é de apenas 3%, o que é insuficiente para mudar as estações do ano.',
    emoji: '🕵️‍♂️',
    colorTheme: 'from-indigo-900 to-slate-900',
    borderTheme: 'border-indigo-400',
  },
  {
    id: 2,
    title: 'A Grande Viagem de 365 Dias e 6 Horas',
    badgeName: 'Piloto de Órbita',
    keyTakeaway:
      'A Terra viaja sem parar pelo espaço numa órbita suave. Para completar uma volta inteira ao redor do Sol (Translação), ela gasta exatamente 365 dias e quase 6 horas extras. Ao juntarmos essas 6 horas durante 4 anos seguidos, criamos 24 horas (1 dia completo), dando origem ao Ano Bissexto com 29 de fevereiro!',
    coreConcepts: [
      'Movimento de Translação (1 ano completo)',
      'As 6 horas excedentes por volta orbital',
      'Cálculo e lógica do Ano Bissexto (4 × 6h = 24h)',
    ],
    scientificFact:
      'A Terra viaja a uma incrível velocidade média de aproximadamente 107.000 km/h ao longo da sua órbita no espaço!',
    emoji: '🛸',
    colorTheme: 'from-teal-950 to-slate-900',
    borderTheme: 'border-teal-400',
  },
  {
    id: 3,
    title: 'O Ângulo Mágico dos 23,5 Graus',
    badgeName: 'Mestre da Luz Solar',
    keyTakeaway:
      'Se a Terra girasse reta em pé, o Sol bateria sempre igual e não existiriam estações! Como o eixo é inclinado em 23,5°, a luz do Sol atinge a superfície com inclinações diferentes: raios diretos e perpendiculares concentram toda a energia numa área pequena (faz calor de Verão); raios oblíquos e inclinados espalham a mesma luz por uma área muito maior, aquecendo bem menos (faz frio de Inverno)!',
    coreConcepts: [
      'Inclinação axial constante de 23,5°',
      'Concentração de energia em raios verticais (90°)',
      'Dispersão térmica em raios rasantes e oblíquos',
    ],
    scientificFact:
      'A mesma lanterna apontada reta ilumina um círculo pequeno e quente; quando inclinada, a luz estica numa oval fria e difusa.',
    emoji: '🔦',
    colorTheme: 'from-amber-950 to-slate-900',
    borderTheme: 'border-amber-400',
  },
  {
    id: 4,
    title: 'O Espelho Planetário: Sul vs Norte',
    badgeName: 'Guardião das Estações',
    keyTakeaway:
      'Os dois lados da Terra funcionam como um espelho simultâneo! Quando o Hemisfério Sul está inclinado para o Sol e vive o Verão (árvores frondosas e dias quentes), o Hemisfério Norte está inclinado para longe e vive o Inverno (árvores despidas e frio rigoroso). Da mesma forma, quando aqui é Outono com folhas caindo, lá é Primavera com flores desabrochando!',
    coreConcepts: [
      'Oposição das estações entre Norte e Sul',
      'Ciclo botânico das árvores e folhas ao longo do ano',
      'Adaptação biológica: hibernação, floração e queda foliar',
    ],
    scientificFact:
      'Quando comemoramos o Natal em 25 de Dezembro com calor e praia no Brasil, em Portugal e nos Estados Unidos é inverno com neve e casacos!',
    emoji: '🌦️',
    colorTheme: 'from-emerald-950 to-slate-900',
    borderTheme: 'border-emerald-400',
  },
  {
    id: 5,
    title: 'A Balança do Tempo: Solstícios e Equinócios',
    badgeName: 'Astrónomo Chefe',
    keyTakeaway:
      'O início de cada estação tem um nome científico especial baseado na balança das 24 horas. Nos SOLSTÍCIOS temos o dia mais longo do ano (cerca de 14h de sol no Verão) ou a noite mais longa do ano (Inverno). Nos EQUINÓCIOS (latim aequus + nox = noites iguais) há um empate cósmico perfeito: o dia e a noite têm exatamente 12 horas cada em qualquer parte do planeta!',
    coreConcepts: [
      'Solstício de Verão (14h luz / 10h noite)',
      'Solstício de Inverno (10h luz / 14h noite)',
      'Equinócios de Primavera e Outono (12h / 12h perfeitos)',
      'Fenômenos polares: Sol da Meia-Noite e Noite Polar',
    ],
    scientificFact:
      'Durante o solstício de verão nos polos, o Sol não se põe durante 24 horas seguidas, dando uma volta completa de 360° no horizonte.',
    emoji: '⚖️',
    colorTheme: 'from-purple-950 to-slate-900',
    borderTheme: 'border-purple-400',
  },
];

export default function HomePage() {
  const { completedMissions, resetProgress, largeTextMode } = useProgressStore();
  const allCompleted = completedMissions.length === MISSION_STEPS.length;

  // Sistema de Pontuação e XP (200 XP por missão)
  const currentXP = completedMissions.length * 200;
  const maxXP = 1000;
  const progressPercentage = Math.round((completedMissions.length / MISSION_STEPS.length) * 100);

  // Estado dos cartões do resumo expandidos no mobile
  const [expandedSummaryId, setExpandedSummaryId] = useState<number | null>(
    completedMissions.length > 0 ? completedMissions[0] : 1
  );

  const toggleSummaryExpand = (id: number) => {
    setExpandedSummaryId((prev) => (prev === id ? null : id));
  };

  const getScientistRank = () => {
    switch (completedMissions.length) {
      case 0:
        return {
          title: 'Explorador Aprendiz',
          icon: '🔭',
          desc: 'Pronto para desvendar os segredos do cosmos!',
        };
      case 1:
        return {
          title: 'Detetive Solar',
          icon: '🔍',
          desc: 'Derrubaste o mito da distância!',
        };
      case 2:
        return {
          title: 'Piloto de Órbita',
          icon: '🛸',
          desc: 'Dominaste os 365 dias e o ano bissexto!',
        };
      case 3:
        return {
          title: 'Físico da Luz Solar',
          icon: '☀️',
          desc: 'Desvendaste o ângulo de 23,5 graus!',
        };
      case 4:
        return {
          title: 'Guardião das Quatro Estações',
          icon: '🌍',
          desc: 'Mestre do espelho planetário Norte vs Sul!',
        };
      case 5:
        return {
          title: 'Grande Mestre Cósmico da Terra',
          icon: '👑',
          desc: 'Conhecimento total dos Solstícios, Equinócios e das 4 Estações!',
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

  const audioSummaryText = completedMissions.length > 0
    ? `Resumo das tuas aprendizagens espaciais! Tens ${currentXP} pontos de experiência no nível ${rank.title}. Já conquistaste ${completedMissions.length} medalhas oficiais. Revê abaixo todas as descobertas científicas que desbloqueaste na tua jornada!`
    : 'Bem-vindo ao laboratório das estações do ano! Completa as missões espaciais para somar pontos de experiência, forjar medalhas oficiais e desbloquear o teu resumo científico de aprendizagens!';

  return (
    <div className="space-y-6 sm:space-y-12">
      {/* BANNER PRINCIPAL HERO COM RESPONSIVIDADE MOBILE NATIVA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-5 sm:p-10 shadow-2xl border-3 sm:border-4 border-indigo-300/40">
        <div className="relative z-10 max-w-3xl space-y-3.5 sm:space-y-5">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Laboratório Interativo de Astronomia</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            As Estações do Ano: Como Funciona o Clima na Terra?
          </h1>

          <p
            className={`text-indigo-100 leading-relaxed font-medium ${
              largeTextMode ? 'text-lg sm:text-xl' : 'text-xs sm:text-base md:text-lg'
            }`}
          >
            Navega pelos mistérios do movimento da Terra, desfaz mitos e descobre na prática como a translação, o eixo inclinado de 23,5°, os solstícios e os equinócios transformam a natureza ao nosso redor!
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href={`/explorar/${MISSION_STEPS[0].slug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm sm:text-base transition-all shadow-xl cursor-pointer w-full sm:w-auto"
            >
              <Rocket className="w-5 h-5 fill-current shrink-0" />
              <span>{completedMissions.length > 0 ? 'Continuar Exploração' : 'Começar pela Missão 1'}</span>
            </Link>

            <AudioButton
              text={audioSummaryText}
              label="Ouvir Resumo da Página"
              size="md"
            />
          </div>
        </div>

        {/* Ilustração Decorativa Cósmica (Desktop e Tablet) */}
        <div className="hidden md:flex flex-col items-center justify-center absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-90">
          <div className="text-7xl lg:text-8xl animate-pulse">☀️</div>
          <div className="text-5xl lg:text-6xl -mt-4 ml-20 drop-shadow-2xl">🌍</div>
        </div>
      </section>

      {/* PAINEL 1: PONTUAÇÃO, XP E PATENTE CIENTÍFICA (MOBILE-FIRST) */}
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
                  Pontuação e Nível do Aluno
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
              title="Zerar pontuação para recomeçar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Progresso</span>
            </button>
          )}
        </div>

        {/* Barra de Pontos de Experiência (XP) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Pontos de Sabedoria</span>
            </span>
            <span className="text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-black font-mono">
              {currentXP} / {maxXP} XP ({progressPercentage}%)
            </span>
          </div>

          <div className="w-full h-4 sm:h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border-2 border-slate-200 shadow-inner">
            <div
              style={{ width: `${Math.max(6, progressPercentage)}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-700 shadow-md flex items-center justify-end pr-1.5"
            >
              {progressPercentage >= 20 && (
                <span className="text-[9px] sm:text-[10px] font-black text-amber-950">
                  {currentXP} XP
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3 Cartões de Estatísticas Adaptáveis */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
          <div className="p-2.5 sm:p-4 rounded-2xl bg-amber-50/80 border sm:border-2 border-amber-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3">
            <span className="text-2xl sm:text-3xl">🏅</span>
            <div>
              <span className="text-[9px] sm:text-[11px] font-extrabold uppercase text-amber-800 block">
                Medalhas
              </span>
              <span className="text-sm sm:text-xl font-black text-amber-950">
                {completedMissions.length}/{MISSION_STEPS.length}
              </span>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-2xl bg-emerald-50/80 border sm:border-2 border-emerald-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3">
            <span className="text-2xl sm:text-3xl">💡</span>
            <div>
              <span className="text-[9px] sm:text-[11px] font-extrabold uppercase text-emerald-800 block">
                Conceitos
              </span>
              <span className="text-sm sm:text-xl font-black text-emerald-950">
                {completedMissions.length * 3} Lições
              </span>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-2xl bg-indigo-50/80 border sm:border-2 border-indigo-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3">
            <span className="text-2xl sm:text-3xl">⭐</span>
            <div>
              <span className="text-[9px] sm:text-[11px] font-extrabold uppercase text-indigo-800 block">
                Grau
              </span>
              <span className="text-sm sm:text-xl font-black text-indigo-950">
                {completedMissions.length}/5
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PAINEL 2: GALERIA DE MEDALHAS OFICIAIS (CARROSSEL TOUCH MOBILE + GRADE DESKTOP) */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 sm:p-8 border-3 sm:border-4 border-amber-400/50 shadow-2xl space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shrink-0">
              🎖️
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full inline-block mb-0.5 border border-amber-300/30">
                Galeria Oficial
              </span>
              <h2 className="text-xl sm:text-3xl font-black">
                Medalhas Científicas
              </h2>
            </div>
          </div>

          <div className="text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300">
            {allCompleted ? '👑 Todas Forjadas!' : `${completedMissions.length}/5 Forjadas`}
          </div>
        </div>

        {/* Dica de toque/deslize para smartphones */}
        <div className="flex items-center justify-between text-[11px] text-amber-200/90 sm:hidden">
          <span>👈 Desliza para ver os badges</span>
          <span>👉</span>
        </div>

        {/* CONTAINER DO CARROSSEL TOUCH MOBILE / GRADE DESKTOP */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-3 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
          {MISSION_STEPS.map((step) => {
            const isUnlocked = completedMissions.includes(step.id);

            return (
              <Link
                key={step.id}
                href={`/explorar/${step.slug}`}
                className="group snap-center shrink-0 w-[140px] sm:w-auto p-3 sm:p-4 rounded-3xl bg-white/5 hover:bg-white/15 active:scale-95 border-2 border-white/10 hover:border-amber-400/60 transition-all flex flex-col items-center justify-between shadow-lg cursor-pointer"
              >
                <div className="text-[10px] sm:text-[11px] font-extrabold uppercase text-amber-300 mb-1">
                  Missão {step.id}
                </div>

                <MissionBadge
                  missionId={step.id}
                  badgeName={step.badgeName}
                  isUnlocked={isUnlocked}
                  size="sm"
                  showLabel={false}
                />

                <div className="mt-2 text-center w-full">
                  <span className="text-[11px] sm:text-xs font-black block text-white group-hover:text-amber-300 transition-colors truncate">
                    {step.badgeName}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-0.5 mt-1 px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? '✓ Forjada' : '🔒 Bloqueada'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Brasão Supremo se todas as missões foram concluídas */}
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
                  Troféu Máximo
                </span>
                <h4 className="text-lg sm:text-2xl font-black text-white">
                  Treinamento Completo Concluído!
                </h4>
                <p className="text-xs text-amber-100 mt-0.5">
                  És um Grande Mestre Cósmico com todas as insígnias forjadas!
                </p>
              </div>
            </div>

            <span className="px-4 py-2 rounded-full bg-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-lg shrink-0">
              🌟 Certificado Ativo
            </span>
          </motion.div>
        )}
      </section>

      {/* PAINEL 3: RESUMO DO QUE FOI APRENDIDO (ACORDEÃO DINÂMICO MOBILE) */}
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
                  Dossiê Científico
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 leading-snug">
                Resumo do que foi Aprendido
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold line-clamp-1 sm:line-clamp-none">
                Toca nos cartões para abrir ou fechar as conclusões essenciais de cada missão!
              </p>
            </div>
          </div>

          <AudioButton
            text="Este é o teu Dossiê Científico com o resumo de tudo o que aprendeste! Podes ler as grandes conclusões sobre o mito da distância, a viagem de 365 dias, o ângulo de vinte e três vírgula cinco graus, a oposição dos hemisférios e o equilíbrio dos solstícios e equinócios."
            label="Ouvir Resumo Geral das Lições"
            size="sm"
          />
        </div>

        {/* Lista de Cartões Acordeão (Mobile-Friendly) */}
        <div className="space-y-3">
          {LEARNING_SUMMARIES.map((item) => {
            const isUnlocked = completedMissions.includes(item.id);
            const isExpanded = expandedSummaryId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl sm:rounded-3xl border-2 sm:border-3 transition-all overflow-hidden ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {/* Cabeçalho do Cartão (Acordeão clicável no mobile) */}
                <button
                  type="button"
                  onClick={() => toggleSummaryExpand(item.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer active:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-white/15 shrink-0">
                      {item.emoji}
                    </span>
                    <div>
                      <span
                        className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider block ${
                          isUnlocked ? 'text-amber-300' : 'text-slate-400'
                        }`}
                      >
                        Missão {item.id} · {item.badgeName}
                      </span>
                      <h3
                        className={`text-base sm:text-xl font-black leading-snug ${
                          isUnlocked ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isUnlocked ? (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Adquirido</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[11px] font-black">
                        <Lock className="w-3 h-3" />
                        <span>Bloqueado</span>
                      </span>
                    )}

                    <div className="p-1 rounded-lg bg-white/10 text-white/80">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Conteúdo Expansível do Resumo */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-white/10 space-y-3.5 pt-3"
                    >
                      {isUnlocked ? (
                        <>
                          {/* A Grande Conclusão */}
                          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 border border-white/15">
                            <span className="text-[11px] sm:text-xs font-black uppercase text-amber-300 block mb-1">
                              🎯 A Grande Descoberta:
                            </span>
                            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                              {item.keyTakeaway}
                            </p>
                          </div>

                          {/* Conceitos e Fato Científico */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <span className="font-extrabold text-amber-300 uppercase block mb-1">
                                🧠 Conceitos Aprendidos:
                              </span>
                              <ul className="space-y-1 text-slate-200 font-medium">
                                {item.coreConcepts.map((concept, cIdx) => (
                                  <li key={cIdx} className="flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-black">✓</span>
                                    <span>{concept}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <span className="font-extrabold text-sky-300 uppercase block mb-1">
                                🔬 Facto de Observação:
                              </span>
                              <p className="text-slate-200 leading-relaxed font-medium">
                                {item.scientificFact}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-semibold">
                          <p>
                            🔒 Completa a Missão {item.id} no laboratório para desbloquear esta descoberta!
                          </p>
                          <Link
                            href={`/explorar/${MISSION_STEPS[item.id - 1].slug}`}
                            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline self-start sm:self-auto"
                          >
                            <span>Abrir Missão {item.id}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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