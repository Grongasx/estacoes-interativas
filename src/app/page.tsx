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
  Flame,
  Globe2
} from 'lucide-react';
import { MISSION_STEPS } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { MissionCardsGrid } from '@/components/ui/NavigationMap';
import { AudioButton } from '@/components/ui/AudioButton';
import { MissionBadge } from '@/components/ui/MissionBadge';

// Dados detalhados do Resumo do que foi aprendido em cada missão
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

  // Sistema de Pontuação e XP
  // Cada missão concluída vale 200 pontos de XP (Total = 1.000 XP)
  const currentXP = completedMissions.length * 200;
  const maxXP = 1000;
  const progressPercentage = Math.round((completedMissions.length / MISSION_STEPS.length) * 100);

  // Patente e Nível Científico do Aluno
  const getScientistRank = () => {
    switch (completedMissions.length) {
      case 0:
        return {
          title: 'Explorador Aprendiz',
          icon: '🔭',
          desc: 'Pronto para desvendar os segredos do cosmos!',
          color: 'text-slate-700 bg-slate-100',
        };
      case 1:
        return {
          title: 'Detetive Solar',
          icon: '🔍',
          desc: 'Derrubaste o mito da distância!',
          color: 'text-indigo-700 bg-indigo-100',
        };
      case 2:
        return {
          title: 'Piloto de Órbita',
          icon: '🛸',
          desc: 'Dominaste os 365 dias e o ano bissexto!',
          color: 'text-teal-700 bg-teal-100',
        };
      case 3:
        return {
          title: 'Físico da Luz Solar',
          icon: '☀️',
          desc: 'Desvendaste o ângulo de 23,5 graus!',
          color: 'text-amber-800 bg-amber-100',
        };
      case 4:
        return {
          title: 'Guardião das Quatro Estações',
          icon: '🌍',
          desc: 'Mestre do espelho planetário Norte vs Sul!',
          color: 'text-emerald-800 bg-emerald-100',
        };
      case 5:
        return {
          title: 'Grande Mestre Cósmico da Terra',
          icon: '👑',
          desc: 'Conhecimento total dos Solstícios, Equinócios e das 4 Estações!',
          color: 'text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-400 shadow-md',
        };
      default:
        return {
          title: 'Explorador',
          icon: '🚀',
          desc: 'Em viagem pelo espaço!',
          color: 'text-indigo-700 bg-indigo-100',
        };
    }
  };

  const rank = getScientistRank();

  // Texto consolidado para leitura em voz alta do resumo
  const audioSummaryText = completedMissions.length > 0
    ? `Resumo das tuas aprendizagens espaciais! Tens ${currentXP} pontos de experiência no nível ${rank.title}. Já conquistaste ${completedMissions.length} medalhas oficiais. Revê abaixo todas as descobertas científicas que desbloqueaste na tua jornada!`
    : 'Bem-vindo ao laboratório das estações do ano! Completa as missões espaciais para somar pontos de experiência, forjar medalhas oficiais e desbloquear o teu resumo científico de aprendizagens!';

  return (
    <div className="space-y-12">
      {/* BANNER PRINCIPAL HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-10 shadow-2xl border-4 border-indigo-300/40">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Laboratório de Ciências e Astronomia Interativa</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            As Estações do Ano: Como Funciona o Clima na Terra?
          </h1>

          <p
            className={`text-indigo-100 leading-relaxed font-medium ${
              largeTextMode ? 'text-xl' : 'text-base sm:text-lg'
            }`}
          >
            Navega pelos mistérios do movimento da Terra, desfaz mitos populares e descobre na prática como a translação, o eixo inclinado de 23,5°, os solstícios e os equinócios transformam a natureza ao nosso redor!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={`/explorar/${MISSION_STEPS[0].slug}`}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <Rocket className="w-5 h-5 fill-current" />
              <span>{completedMissions.length > 0 ? 'Continuar Exploração' : 'Começar pela Missão 1'}</span>
            </Link>

            <AudioButton
              text={audioSummaryText}
              label="Ouvir Resumo da Página"
              size="lg"
            />
          </div>
        </div>

        {/* Ilustração Decorativa Cósmica */}
        <div className="hidden lg:flex flex-col items-center justify-center absolute right-12 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-90">
          <div className="text-8xl animate-pulse">☀️</div>
          <div className="text-6xl -mt-4 ml-24 drop-shadow-2xl">🌍</div>
        </div>
      </section>

      {/* PAINEL 1: PONTUAÇÃO, XP E PATENTE CIENTÍFICA */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg text-3xl font-black">
              {rank.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                  Painel de Pontuação e Nível do Aluno
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {rank.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                {rank.desc}
              </p>
            </div>
          </div>

          {completedMissions.length > 0 && (
            <button
              type="button"
              onClick={resetProgress}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
              title="Zerar pontuação e medalhas para recomeçar o treinamento"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Progresso</span>
            </button>
          )}
        </div>

        {/* Barra de Pontos de Experiência (XP) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Pontos de Sabedoria Acumulados</span>
            </span>
            <span className="text-amber-800 bg-amber-100 px-3 py-1 rounded-full text-xs font-black font-mono">
              {currentXP} / {maxXP} XP ({progressPercentage}%)
            </span>
          </div>

          <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border-2 border-slate-200 shadow-inner">
            <div
              style={{ width: `${Math.max(5, progressPercentage)}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-700 shadow-md flex items-center justify-end pr-2"
            >
              {progressPercentage >= 20 && (
                <span className="text-[10px] font-black text-amber-950">
                  {currentXP} XP
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3 Cartões Rápidos de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200 flex items-center gap-3">
            <span className="text-3xl">🏅</span>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-amber-800 block">
                Medalhas Forjadas
              </span>
              <span className="text-xl font-black text-amber-950">
                {completedMissions.length} de {MISSION_STEPS.length} Desbloqueadas
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 flex items-center gap-3">
            <span className="text-3xl">💡</span>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-emerald-800 block">
                Conceitos Dominados
              </span>
              <span className="text-xl font-black text-emerald-950">
                {completedMissions.length * 3} Lições Científicas
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-indigo-800 block">
                Nível Científico
              </span>
              <span className="text-xl font-black text-indigo-950">
                Grau {completedMissions.length} de 5
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PAINEL 2: GALERIA DE MEDALHAS OFICIAIS COM DESENHO DE BADGES MESMO */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400/50 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-black text-2xl shadow-lg">
              🎖️
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full inline-block mb-1 border border-amber-300/30">
                Galeria Oficial de Conquistas
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Medalhas e Insígnias Científicas
              </h2>
            </div>
          </div>

          <div className="text-xs font-black px-4 py-2 rounded-full bg-white/10 border border-white/20 text-amber-300">
            {allCompleted ? '👑 Todas as Medalhas Conquistadas!' : `${completedMissions.length}/5 Forjadas`}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-3xl">
          Cada missão concluída com sucesso forja uma insígnia vetorial com brasão heráldico próprio. Explora as missões abaixo para desbloquear o conjunto completo de medalhas!
        </p>

        {/* Grade com os 5 Badges Vetoriais Detalhados */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-3">
          {MISSION_STEPS.map((step) => {
            const isUnlocked = completedMissions.includes(step.id);

            return (
              <Link
                key={step.id}
                href={`/explorar/${step.slug}`}
                className="group p-4 rounded-3xl bg-white/5 hover:bg-white/15 border-2 border-white/10 hover:border-amber-400/60 transition-all flex flex-col items-center justify-between shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="text-[11px] font-extrabold uppercase text-amber-300 mb-2">
                  Missão {step.id}
                </div>

                <MissionBadge
                  missionId={step.id}
                  badgeName={step.badgeName}
                  isUnlocked={isUnlocked}
                  size="md"
                  showLabel={false}
                />

                <div className="mt-3 text-center">
                  <span className="text-xs font-black block text-white group-hover:text-amber-300 transition-colors">
                    {step.badgeName}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? '✓ Conquistada' : '🔒 Bloqueada'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Grande Brasão Supremo da Terra se todas as missões foram concluídas */}
        {allCompleted && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 border-3 border-amber-300 flex flex-wrap items-center justify-between gap-4 text-center sm:text-left shadow-2xl"
          >
            <div className="flex items-center gap-4 mx-auto sm:mx-0">
              <span className="text-5xl animate-bounce">👑</span>
              <div>
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  Troféu Máximo do Explorador
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  Parabéns! Concluíste o Treinamento Completo das 5 Missões!
                </h4>
                <p className="text-xs text-amber-100 mt-1">
                  És agora um Grande Mestre Cósmico com todas as insígnias forjadas e o conhecimento integral do planeta Terra.
                </p>
              </div>
            </div>

            <div className="mx-auto sm:mx-0">
              <span className="px-5 py-2.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-lg inline-block">
                🌟 Certificado de Mestre Ativo
              </span>
            </div>
          </motion.div>
        )}
      </section>

      {/* PAINEL 3: RESUMO COMPLETO DO QUE FOI APRENDIDO (DOSSIÊ CIENTÍFICO) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg text-3xl font-black">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-wider text-indigo-700">
                  Diário de Bordo & Dossiê Científico
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                Resumo do que foi Aprendido
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                Revê as grandes lições e descobertas fundamentais de cada missão espacial.
              </p>
            </div>
          </div>

          <AudioButton
            text="Este é o teu Dossiê Científico com o resumo de tudo o que aprendeste! Podes ler as grandes conclusões sobre o mito da distância, a viagem de 365 dias, o ângulo de vinte e três vírgula cinco graus, a oposição dos hemisférios e o equilíbrio dos solstícios e equinócios."
            label="Ouvir Resumo Geral das Lições"
            size="sm"
          />
        </div>

        {/* Lista de Cartões das 5 Missões com Conteúdo Aprendido */}
        <div className="space-y-4">
          {LEARNING_SUMMARIES.map((item) => {
            const isUnlocked = completedMissions.includes(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-3xl p-6 border-3 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-indigo-400 shadow-lg'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-inner border border-white/15">
                      {item.emoji}
                    </span>
                    <div>
                      <span
                        className={`text-[11px] font-black uppercase tracking-wider ${
                          isUnlocked ? 'text-amber-300' : 'text-slate-400'
                        }`}
                      >
                        Missão {item.id} · Medalha: {item.badgeName}
                      </span>
                      <h3
                        className={`text-lg sm:text-xl font-black ${
                          isUnlocked ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Conhecimento Adquirido</span>
                    </span>
                  ) : (
                    <Link
                      href={`/explorar/${MISSION_STEPS[item.id - 1].slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-black transition-colors"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Completar Missão {item.id} →</span>
                    </Link>
                  )}
                </div>

                {isUnlocked ? (
                  <div className="space-y-4 pt-2">
                    {/* A Grande Conclusão */}
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                      <span className="text-xs font-black uppercase text-amber-300 block mb-1">
                        🎯 A Grande Descoberta:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                        {item.keyTakeaway}
                      </p>
                    </div>

                    {/* Conceitos-Chave e Fato Científico */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="font-extrabold text-amber-300 uppercase block mb-1">
                          🧠 Conceitos Aprendidos:
                        </span>
                        <ul className="space-y-1 text-slate-200 font-medium">
                          {item.coreConcepts.map((concept, cIdx) => (
                            <li key={cIdx} className="flex items-center gap-1.5">
                              <span className="text-emerald-400">✓</span>
                              <span>{concept}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="font-extrabold text-sky-300 uppercase block mb-1">
                          🔬 Facto Curioso de Observação:
                        </span>
                        <p className="text-slate-200 leading-relaxed font-medium">
                          {item.scientificFact}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <p>
                      🔒 Esta descoberta científica está trancada. Entra na Missão {item.id} para experimentar no laboratório e desbloquear o resumo!
                    </p>
                    <Link
                      href={`/explorar/${MISSION_STEPS[item.id - 1].slug}`}
                      className="text-indigo-600 font-bold hover:underline shrink-0 ml-3"
                    >
                      Abrir Missão →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* MAPA DE NAVEGAÇÃO PRINCIPAL DAS 5 MISSÕES */}
      <MissionCardsGrid />
    </div>
  );
}