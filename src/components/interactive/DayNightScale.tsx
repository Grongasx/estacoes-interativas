// src/components/interactive/DayNightScale.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Scale,
  Calendar,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Clock,
  Flame,
  Snowflake,
  HelpCircle,
  Award,
  Globe2
} from 'lucide-react';
import { ASTRONOMICAL_EVENTS, AstronomicalEvent } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

// Configuração do arco solar para cada evento astronômico (Hemisfério Sul)
interface SolarArcConfig {
  sunriseHour: number; // ex: 5 (05:00)
  sunsetHour: number;  // ex: 19 (19:00)
  zenithHeight: number; // altitude máxima em % da cúpula (80% verão, 40% inverno, 62% equinócio)
  summaryText: string;
}

const SOLAR_ARC_DATA: Record<string, SolarArcConfig> = {
  'solsticio-verao': {
    sunriseHour: 5,
    sunsetHour: 19,
    zenithHeight: 82,
    summaryText: 'O Sol acorda cedinho (05h) e sobe bem alto no céu! Ele demora para ir embora (19h), dando 14 horas de dia claro para brincar bastante!',
  },
  'equinocio-outono': {
    sunriseHour: 6,
    sunsetHour: 18,
    zenithHeight: 62,
    summaryText: 'O Sol acorda às 06h e vai dormir às 18h. Temos um empate perfeitinho: 12 horas de dia e 12 horas de noite!',
  },
  'solsticio-inverno': {
    sunriseHour: 7,
    sunsetHour: 17,
    zenithHeight: 40,
    summaryText: 'O Sol acorda tarde (07h) com preguiça, anda baixinho no céu e vai dormir cedo (17h). O dia fica curto e a noite bem longa e fria!',
  },
  'equinocio-primavera': {
    sunriseHour: 6,
    sunsetHour: 18,
    zenithHeight: 62,
    summaryText: 'Novo empate cósmico! O Sol nasce às 06h e se põe às 18h, dividindo o dia e a noite iguaizinhos para todo o planeta!',
  },
};

// Mini-desafio do Astrônomo
interface AstronomerQuiz {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const ASTRONOMER_QUIZ: AstronomerQuiz[] = [
  {
    question: 'Em quais dias do ano o dia e a noite duram exatamente 12 horas para todo mundo?',
    options: [
      { text: 'Nos Equinócios de Outono e Primavera! 🤝', isCorrect: true },
      { text: 'Nos Solstícios de Verão e Inverno! ☀️', isCorrect: false },
      { text: 'Apenas quando tem eclipse da Lua! 🌑', isCorrect: false },
    ],
    explanation: 'Muito bem! A palavra Equinócio é um nome divertido que significa "noites iguais aos dias": 12 horas de Dia e 12 horas de Noite!',
  },
  {
    question: 'No Solstício de Verão no Brasil (21 de Dezembro), o que acontece com as horas?',
    options: [
      { text: 'É o dia mais comprido do ano com bastante sol! 🏖️', isCorrect: true },
      { text: 'É a noite mais fria e escura do ano! ❄️', isCorrect: false },
      { text: 'O dia e a noite duram só 5 horas! ⚖️', isCorrect: false },
    ],
    explanation: 'Certinho! Como o Brasil fica virado diretamente para o Sol em dezembro, temos o dia mais longo do ano inteiro!',
  },
  {
    question: 'O que é a mágica do "Sol da Meia-Noite" perto dos polos da Terra?',
    options: [
      { text: 'No Verão polar, o Sol nunca se põe durante 24 horas! ☀️🌌', isCorrect: true },
      { text: 'O Sol se apaga como uma lâmpada à meia-noite! 📴', isCorrect: false },
      { text: 'A Lua esquenta como uma fogueira no céu! 🌕', isCorrect: false },
    ],
    explanation: 'Uau, você é demais! Nos polos da Terra, a inclinação faz o Sol dar uma volta inteira no céu sem se esconder, brilhando mesmo de madrugada!',
  },
];

export const DayNightScale: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();

  const [selectedEventId, setSelectedEventId] = useState<string>(
    ASTRONOMICAL_EVENTS[0].id
  );
  const [visitedEvents, setVisitedEvents] = useState<string[]>([
    ASTRONOMICAL_EVENTS[0].id,
  ]);

  // Controle de simulação do relógio solar 24h
  const [currentTimeHour, setCurrentTimeHour] = useState<number>(12); // Hora do dia: 0 a 24
  const [isPlayingDay, setIsPlayingDay] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tab de exploração polar
  const [polarLocation, setPolarLocation] = useState<'tropical' | 'artico' | 'antartico'>('tropical');

  // Mini-Quiz
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentEvent: AstronomicalEvent =
    ASTRONOMICAL_EVENTS.find((ev) => ev.id === selectedEventId) ||
    ASTRONOMICAL_EVENTS[0];

  const arcConfig = SOLAR_ARC_DATA[currentEvent.id] || SOLAR_ARC_DATA['solsticio-verao'];

  const dayPercentage = Math.round((currentEvent.dayHours / 24) * 100);
  const nightPercentage = 100 - dayPercentage;
  const isEquinox = currentEvent.dayHours === currentEvent.nightHours;
  const isDayWinning = currentEvent.dayHours > currentEvent.nightHours;
  const isNightWinning = currentEvent.nightHours > currentEvent.dayHours;

  // Inclinação orgânica da balança (-10 graus se o dia vence, +10 se a noite vence, 0 se empate)
  const tiltAngle = (currentEvent.nightHours - currentEvent.dayHours) * 2.5;

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    if (!visitedEvents.includes(id)) {
      const updated = [...visitedEvents, id];
      setVisitedEvents(updated);
      if (updated.length >= 2) {
        completeMission(5);
      }
    }
  };

  // Efeito de animação do ciclo 24 horas
  useEffect(() => {
    if (!isPlayingDay) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setCurrentTimeHour((prev) => {
        const next = prev + 0.25; // avança 15 minutos por frame
        if (next >= 24) return 0;
        return next;
      });
    }, 120);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlayingDay]);

  // Cálculo da posição do Sol no céu simulado
  // O Sol está visível entre arcConfig.sunriseHour e arcConfig.sunsetHour
  const isSunVisible =
    currentTimeHour >= arcConfig.sunriseHour &&
    currentTimeHour <= arcConfig.sunsetHour;

  // Fração do arco de luz percorrida pelo Sol (0 = amanhecer, 0.5 = zênite/meio-dia, 1 = pôr do sol)
  const dayDuration = arcConfig.sunsetHour - arcConfig.sunriseHour;
  const sunProgress = isSunVisible
    ? (currentTimeHour - arcConfig.sunriseHour) / dayDuration
    : 0;

  // Posição x em % (5% a 95% da largura da cúpula)
  const sunX = 8 + sunProgress * 84;
  // Posição y em % (parábola invertida: baseada em sin(pi * progress))
  const sunElevationFactor = Math.sin(Math.PI * sunProgress);
  const sunY = 82 - sunElevationFactor * (arcConfig.zenithHeight * 0.7);

  // Cálculo da posição da Lua durante a noite
  const isNightTime = !isSunVisible;
  const nightDuration = 24 - dayDuration;
  let nightProgress = 0;
  if (currentTimeHour > arcConfig.sunsetHour) {
    nightProgress = (currentTimeHour - arcConfig.sunsetHour) / nightDuration;
  } else if (currentTimeHour < arcConfig.sunriseHour) {
    nightProgress = (currentTimeHour + (24 - arcConfig.sunsetHour)) / nightDuration;
  }
  const moonX = 10 + nightProgress * 80;
  const moonY = 80 - Math.sin(Math.PI * nightProgress) * 55;

  // Cor do céu dinâmica baseada na hora
  const getSkyGradient = () => {
    if (currentTimeHour >= 4 && currentTimeHour < 6) {
      // Alvorada / Amanhecer
      return 'from-indigo-950 via-rose-900 to-amber-700';
    }
    if (currentTimeHour >= 6 && currentTimeHour < 9) {
      // Manhã
      return 'from-sky-700 via-sky-500 to-amber-200';
    }
    if (currentTimeHour >= 9 && currentTimeHour < 16) {
      // Meio-dia pleno
      return 'from-sky-500 via-sky-400 to-sky-200';
    }
    if (currentTimeHour >= 16 && currentTimeHour < 18.5) {
      // Entardecer dourado
      return 'from-indigo-900 via-amber-600 to-yellow-400';
    }
    if (currentTimeHour >= 18.5 && currentTimeHour < 20.5) {
      // Pôr do sol e crepúsculo
      return 'from-slate-950 via-purple-900 to-rose-800';
    }
    // Noite estrelada profunda
    return 'from-slate-950 via-indigo-950 to-slate-900';
  };

  // Formatação da hora: "14:30"
  const formattedHours = Math.floor(currentTimeHour);
  const formattedMinutes = Math.floor((currentTimeHour % 1) * 60)
    .toString()
    .padStart(2, '0');

  const getOppositeEventInfo = () => {
    switch (currentEvent.id) {
      case 'solsticio-verao':
        return {
          title: 'Solstício de Inverno no Hemisfério Norte',
          desc: 'Enquanto no Sul temos 14h de luz, no Norte vivem a noite mais longa do ano com 14h de escuridão e apenas 10h de luz fraca!',
        };
      case 'solsticio-inverno':
        return {
          title: 'Solstício de Verão no Hemisfério Norte',
          desc: 'Enquanto no Sul é a noite mais longa do ano, no Norte aproveitam o dia mais longo do ano com 14h de sol!',
        };
      case 'equinocio-outono':
        return {
          title: 'Equinócio de Primavera no Hemisfério Norte',
          desc: 'Lá também há empate perfeito (12h de dia e 12h de noite), mas marcando o início da Primavera e o fim do frio!',
        };
      case 'equinocio-primavera':
        return {
          title: 'Equinócio de Outono no Hemisfério Norte',
          desc: 'Lá também o dia e a noite duram exatamente 12 horas, dando início ao Outono com folhas caindo!',
        };
      default:
        return {
          title: 'Oposto no Norte',
          desc: 'As estações e horários de sol são sempre opostos entre os hemisférios Norte e Sul.',
        };
    }
  };

  const oppositeInfo = getOppositeEventInfo();

  // Função para responder quiz
  const handleAnswerQuiz = (idx: number) => {
    setSelectedQuizOption(idx);
    if (ASTRONOMER_QUIZ[quizIndex].options[idx].isCorrect) {
      setQuizScore((prev) => prev + 1);
      if (quizIndex === ASTRONOMER_QUIZ.length - 1) {
        setQuizFinished(true);
        completeMission(5);
      }
    }
  };

  const handleNextQuiz = () => {
    setSelectedQuizOption(null);
    if (quizIndex < ASTRONOMER_QUIZ.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizIndex(0);
      setQuizScore(0);
      setQuizFinished(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* CABEÇALHO DA EXPERIÊNCIA 5 */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300/40 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-lg font-black text-2xl">
              ⚖️
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full inline-block mb-1 border border-amber-300/30">
                Missão 5 · Observatório dos Céus
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Solstícios e Equinócios: A Balança do Tempo
              </h2>
            </div>
          </div>

          <AudioButton
            text="Bem-vindo à Missão 5 máxima! Descobre aqui como o movimento da Terra faz o Sol nascer mais cedo ou mais tarde ao longo do ano. Nos solstícios temos o dia mais longo ou a noite mais longa, enquanto nos equinócios a luz e a escuridão empatam com doze horas exatas cada!"
            label="Ouvir introdução da missão 5"
            size="sm"
          />
        </div>

        {/* SELETOR DOS 4 EVENTOS ASTRONÔMICOS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase text-amber-300 tracking-wider">
              Escolhe o marco astronómico para carregar na Balança Cósmica:
            </span>
            <span className="text-xs text-indigo-200 font-semibold hidden sm:inline">
              {visitedEvents.length}/4 Eventos astronómicos explorados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ASTRONOMICAL_EVENTS.map((ev) => {
              const isSelected = ev.id === selectedEventId;
              const isVisited = visitedEvents.includes(ev.id);

              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => handleSelectEvent(ev.id)}
                  className={`p-4 rounded-2xl border-4 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-br from-amber-400/20 to-amber-500/10 shadow-xl scale-[1.03] ring-4 ring-amber-400/40 text-white'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{ev.emoji}</span>
                      {isVisited && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-400/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Explorado</span>
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-white text-base leading-snug">
                      {ev.name}
                    </h4>
                    <span className="inline-block mt-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-amber-300">
                      Inicia: {ev.startsSeason}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ev.dateSouth.split('(')[0].trim()}</span>
                    </span>
                    <span className="font-black text-amber-300">
                      {ev.dayHours}h Sol · {ev.nightHours}h Noite
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: SIMULADOR INTERATIVO DO ARCO SOLAR E CÉU 24 HORAS */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-indigo-500/40 shadow-xl space-y-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs uppercase tracking-wider border border-amber-300/30">
              Laboratório do Arco Celeste · {currentEvent.name}
            </span>
            <h3 className="text-2xl font-black mt-2">
              Observa o Sol a Cruzar o Céu ao Longo das 24 Horas
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl">
              Arrasta o cursor ou clica em <strong>Reproduzir</strong> para assistir ao amanhecer, à subida do Sol, ao pôr do sol e à noite estrelada!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlayingDay((prev) => !prev)}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
            >
              {isPlayingDay ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar Céu</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reproduzir 24h</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlayingDay(false);
                setCurrentTimeHour(12);
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Voltar ao Meio-Dia"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DOMO CELESTE INTERATIVO (CANVAS / SVG COM CORPO CELESTE) */}
        <div
          className={`relative w-full h-72 sm:h-84 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl transition-all duration-700 bg-gradient-to-b ${getSkyGradient()}`}
        >
          {/* Estrelas piscantes quando é noite */}
          {isNightTime && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-12 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
              <div className="absolute top-16 left-1/4 w-2 h-2 bg-amber-100 rounded-full animate-pulse" />
              <div className="absolute top-8 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
              <div className="absolute top-14 right-1/4 w-2 h-2 bg-blue-100 rounded-full animate-ping opacity-60" />
              <div className="absolute top-10 right-16 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <div className="absolute top-24 left-3/4 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" />
            </div>
          )}

          {/* Trajetória Tracejada do Arco do Sol para este Evento */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d={`M 8% 82% Q 50% ${82 - arcConfig.zenithHeight * 0.7}% 92% 82%`}
              fill="none"
              stroke="url(#arcGlow)"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
          </svg>

          {/* O SOL EM MOVIMENTO */}
          {isSunVisible && (
            <div
              style={{
                left: `${sunX}%`,
                top: `${sunY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 flex flex-col items-center transition-all duration-150 pointer-events-none"
            >
              {/* Brilho Solar Difuso */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-300/40 blur-md absolute -inset-2 animate-pulse" />
              {/* Disco do Sol */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-white shadow-xl flex items-center justify-center text-amber-950 font-black text-lg border-2 border-amber-200">
                ☀️
              </div>
              <span className="text-[10px] sm:text-xs font-black uppercase text-amber-950 bg-amber-300/90 px-2 py-0.5 rounded-full mt-1 shadow-sm whitespace-nowrap">
                {currentTimeHour >= 11 && currentTimeHour <= 13 ? 'Zênite Máximo' : 'Sol em Marcha'}
              </span>
            </div>
          )}

          {/* A LUA EM MOVIMENTO NA NOITE */}
          {isNightTime && (
            <div
              style={{
                left: `${moonX}%`,
                top: `${moonY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 flex flex-col items-center transition-all duration-150 pointer-events-none"
            >
              <div className="w-14 h-14 rounded-full bg-indigo-200/20 blur-md absolute -inset-1" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-white shadow-xl flex items-center justify-center text-slate-900 font-black text-base border-2 border-indigo-200">
                🌙
              </div>
              <span className="text-[10px] font-black uppercase text-indigo-100 bg-slate-950/70 px-2 py-0.5 rounded-full mt-1 border border-white/20">
                Céu Noturno
              </span>
            </div>
          )}

          {/* Horizonte Terrestre com Colinas e Árvore Projetando Sombra */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-950 via-emerald-900 to-emerald-800/80 border-t-2 border-emerald-500/40 z-10 flex items-end justify-between px-8 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-white/10">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>LESTE (Nascente: ~0{arcConfig.sunriseHour}h00)</span>
            </div>

            {/* Silhueta de Árvore no Meio com Sombra Dinâmica */}
            <div className="relative flex flex-col items-center">
              <span className="text-3xl sm:text-4xl drop-shadow-md">🌳</span>
              {/* Sombra da árvore proporcional à posição do sol */}
              {isSunVisible && (
                <div
                  style={{
                    width: `${Math.max(15, 65 * (1 - sunElevationFactor))}px`,
                    transform: `skewX(${(0.5 - sunProgress) * 55}deg)`,
                  }}
                  className="h-2 bg-black/40 rounded-full blur-[1px] -mt-1 transition-all duration-150"
                />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-white/10">
              <span>OESTE (Poente: ~{arcConfig.sunsetHour}h00)</span>
              <Compass className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>

          {/* Relógio Digital Flutuante dentro do Céu */}
          <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-200 block">
                Hora do Dia
              </span>
              <span className="text-lg font-black text-amber-300 tracking-wider">
                {formattedHours.toString().padStart(2, '0')}:{formattedMinutes}
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLE DESLIZANTE DO HORÁRIO (0h às 24h) */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black">
            <span className="flex items-center gap-2 text-amber-300">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Ajustar Relógio do Dia</span>
            </span>
            <span className="text-white font-mono bg-black/40 px-3 py-1 rounded-full border border-white/10">
              {formattedHours.toString().padStart(2, '0')}:{formattedMinutes} horas
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="23.75"
            step="0.25"
            value={currentTimeHour}
            onChange={(e) => {
              setIsPlayingDay(false);
              setCurrentTimeHour(parseFloat(e.target.value));
            }}
            className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[11px] font-extrabold text-slate-300 px-1">
            <span>00h (Meia-Noite)</span>
            <span>06h (Amanhecer)</span>
            <span>12h (Meio-Dia)</span>
            <span>18h (Anoitecer)</span>
            <span>24h (Fim do Ciclo)</span>
          </div>

          <p className="text-xs text-amber-200 font-semibold bg-white/5 p-3 rounded-xl border border-white/10">
            💡 <strong>Resumo do Arco Solar:</strong> {arcConfig.summaryText}
          </p>
        </div>
      </div>

      {/* SEÇÃO 2: A BALANÇA CÓSMICA 3D DAS 24 HORAS */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300/40 shadow-xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2.5 rounded-2xl bg-white/10 shadow-inner">
              {currentEvent.emoji}
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Pesagem Cósmica · {currentEvent.startsSeason}
              </span>
              <h4 className="text-2xl sm:text-3xl font-black">
                {currentEvent.name}
              </h4>
              <p className="text-xs sm:text-sm text-indigo-200 font-semibold mt-0.5">
                📅 Ocorre por volta de {currentEvent.dateSouth}
              </p>
            </div>
          </div>

          <AudioButton
            text={`${currentEvent.name}. No Hemisfério Sul ocorre em ${currentEvent.dateSouth}. ${currentEvent.whatHappens} São ${currentEvent.dayHours} horas de sol e ${currentEvent.nightHours} horas de noite.`}
            label="Ouvir este evento"
            size="sm"
          />
        </div>

        {/* Barra de Distribuição das 24 Horas */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Luz do Sol (Dia): {currentEvent.dayHours} horas ({dayPercentage}%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-indigo-200">
              <span>Noite (Escuridão): {currentEvent.nightHours} horas ({nightPercentage}%)</span>
              <Moon className="w-4 h-4 text-indigo-300" />
            </span>
          </div>

          {/* Barra Visual Colorida */}
          <div className="w-full h-8 bg-slate-950/80 rounded-full overflow-hidden flex p-1 border-2 border-white/20 shadow-inner">
            <div
              style={{ width: `${dayPercentage}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-l-full flex items-center justify-center text-xs font-black text-amber-950 transition-all duration-700 shadow-md"
            >
              {dayPercentage > 25 && `☀️ ${currentEvent.dayHours}h`}
            </div>
            <div
              style={{ width: `${nightPercentage}%` }}
              className="h-full bg-gradient-to-r from-indigo-700 to-slate-800 rounded-r-full flex items-center justify-center text-xs font-black text-indigo-100 transition-all duration-700 shadow-md"
            >
              {nightPercentage > 25 && `🌙 ${currentEvent.nightHours}h`}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-indigo-200/80 font-bold px-1">
            <span>0h (Meia-noite)</span>
            <span>12h (Meio-dia)</span>
            <span>24h (Total do Dia)</span>
          </div>
        </div>

        {/* A Balança Cósmica Interativa com Orbes de Horas */}
        <div className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-indigo-200">
            <Scale className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              A Balança Mecânica das 24 Horas
            </span>
          </div>

          {/* Estrutura Mecânica da Balança com Orbes Físicos */}
          <div className="relative max-w-xl mx-auto py-6">
            {/* Pilar Central de Sustentação */}
            <div className="w-4 h-32 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 mx-auto rounded-t-full shadow-2xl relative z-0">
              {/* Pivô / Fulcro central com joia dourada */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-slate-900 absolute -top-5 left-1/2 -translate-x-1/2 shadow-xl flex items-center justify-center text-sm font-black text-slate-900 ring-2 ring-amber-300">
                ⚖️
              </div>
            </div>

            {/* Braço Articulado da Balança */}
            <div
              style={{
                transform: `rotate(${tiltAngle}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              className="w-full h-3.5 bg-gradient-to-r from-amber-400 via-yellow-200 to-indigo-400 rounded-full shadow-2xl origin-center absolute top-9 left-0 right-0 z-10 flex items-center justify-between px-3"
            >
              {/* Prato Esquerdo - Dia (Luz Solar) */}
              <div
                style={{
                  transform: `rotate(${-tiltAngle}deg)`,
                  transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="flex flex-col items-center -translate-y-2"
              >
                {/* Correntes metálicas do prato */}
                <div className="w-16 h-8 border-l-2 border-r-2 border-amber-300/60 mx-auto" />

                {/* Prato de Bronze Esquerdo */}
                <div
                  className={`w-40 sm:w-48 p-4 rounded-3xl border-3 transition-all ${
                    isDayWinning
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 border-white shadow-2xl scale-110 font-black'
                      : isEquinox
                      ? 'bg-amber-300/80 text-amber-950 border-amber-200 font-extrabold shadow-md'
                      : 'bg-white/15 text-amber-200 border-white/20 font-bold opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase">
                    <Sun className="w-4 h-4 fill-current text-amber-600" />
                    <span>Luz Solar</span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black mt-1">
                    {currentEvent.dayHours} Horas
                  </div>

                  {/* Orbes de Sol dentro do prato */}
                  <div className="flex flex-wrap justify-center gap-1 mt-2.5">
                    {Array.from({ length: currentEvent.dayHours }).map((_, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-600 shadow-sm"
                        title={`Hora de Sol ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Prato Direito - Noite (Escuridão) */}
              <div
                style={{
                  transform: `rotate(${-tiltAngle}deg)`,
                  transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="flex flex-col items-center -translate-y-2"
              >
                {/* Correntes metálicas do prato */}
                <div className="w-16 h-8 border-l-2 border-r-2 border-indigo-300/60 mx-auto" />

                {/* Prato de Bronze Direito */}
                <div
                  className={`w-40 sm:w-48 p-4 rounded-3xl border-3 transition-all ${
                    isNightWinning
                      ? 'bg-gradient-to-br from-indigo-700 to-purple-800 text-white border-white shadow-2xl scale-110 font-black'
                      : isEquinox
                      ? 'bg-indigo-900/80 text-indigo-100 border-indigo-300 font-extrabold shadow-md'
                      : 'bg-white/15 text-indigo-200 border-white/20 font-bold opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase">
                    <Moon className="w-4 h-4 fill-current text-indigo-300" />
                    <span>Escuridão</span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black mt-1">
                    {currentEvent.nightHours} Horas
                  </div>

                  {/* Orbes de Lua dentro do prato */}
                  <div className="flex flex-wrap justify-center gap-1 mt-2.5">
                    {Array.from({ length: currentEvent.nightHours }).map((_, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-indigo-300 border border-indigo-900 shadow-sm"
                        title={`Hora de Noite ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Base pesada de ferro fundido */}
            <div className="w-32 h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-full mx-auto shadow-2xl -mt-2 border border-amber-400/40" />
          </div>

          {/* Veredito Visual da Balança */}
          <div className="inline-block px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            {isEquinox && (
              <span className="text-emerald-300 font-black text-sm sm:text-base flex items-center justify-center gap-2">
                <span>🤝</span>
                <span>Equilíbrio Perfeito: O Dia e a Noite têm exatamente 12 Horas cada!</span>
              </span>
            )}
            {isDayWinning && (
              <span className="text-amber-300 font-black text-sm sm:text-base flex items-center justify-center gap-2">
                <span>☀️</span>
                <span>O Dia Ganha com Folga! É o dia mais longo do ano (Solstício de Verão)!</span>
              </span>
            )}
            {isNightWinning && (
              <span className="text-sky-300 font-black text-sm sm:text-base flex items-center justify-center gap-2">
                <span>🌙</span>
                <span>A Noite Ganha com Folga! É a noite mais longa do ano (Solstício de Inverno)!</span>
              </span>
            )}
          </div>
        </div>

        {/* SEÇÃO 3: FENÓMENO EXTREMO - SOL DA MEIA-NOITE & NOITE POLAR */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 border-3 border-indigo-400/30 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-white/10">🌐</span>
              <div>
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  Curiosidade Planetária Extrema
                </span>
                <h4 className="text-xl sm:text-2xl font-black">
                  O que acontece nos Polos da Terra?
                </h4>
              </div>
            </div>

            {/* Seletor de Região */}
            <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/20">
              <button
                type="button"
                onClick={() => setPolarLocation('tropical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  polarLocation === 'tropical'
                    ? 'bg-amber-400 text-amber-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Nossa Região (Brasil/Portugal)
              </button>
              <button
                type="button"
                onClick={() => setPolarLocation('artico')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  polarLocation === 'artico'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Polo Norte (Ártico)
              </button>
              <button
                type="button"
                onClick={() => setPolarLocation('antartico')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  polarLocation === 'antartico'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Polo Sul (Antártida)
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 border border-white/15 text-xs sm:text-sm leading-relaxed space-y-2">
            {polarLocation === 'tropical' && (
              <p>
                Nas latitudes médias e tropicais onde vive a maioria das pessoas, as variações de sol são suaves (entre 10h no inverno e 14h no verão). Mas quanto mais nos aproximamos dos polos, mais extremas ficam as horas de sol!
              </p>
            )}
            {polarLocation === 'artico' && (
              <p>
                🧊 <strong>No Círculo Polar Ártico:</strong> No Solstício de Junho ocorre o famoso <strong>Sol da Meia-Noite</strong>: o Sol dá uma volta completa no céu sem nunca descer abaixo do horizonte durante 24 horas ininterruptas! Em contrapartida, em Dezembro vivem a <strong>Noite Polar</strong>, ficando semanas sob escuridão total!
              </p>
            )}
            {polarLocation === 'antartico' && (
              <p>
                🐧 <strong>Na Antártida (Polo Sul):</strong> É exatamente o inverso! Em Dezembro (Solstício de Verão austral), os pinguins e cientistas aproveitam 24 horas de luz solar contínua. Em Junho, passam meses sob escuridão e auroras austrais!
              </p>
            )}
          </div>
        </div>

        {/* SEÇÃO 4: RESUMO SUL vs NORTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-2">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4" />
              <h5 className="font-extrabold text-sm uppercase tracking-wide">
                No Hemisfério Sul (Onde estamos)
              </h5>
            </div>
            <p
              className={`text-slate-100 font-medium leading-relaxed ${
                largeTextMode ? 'text-lg' : 'text-sm'
              }`}
            >
              {currentEvent.whatHappens}
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-4 h-4" />
              <h5 className="font-extrabold text-sm uppercase tracking-wide">
                No Hemisfério Norte (Ao mesmo tempo!)
              </h5>
            </div>
            <p
              className={`text-slate-100 font-medium leading-relaxed ${
                largeTextMode ? 'text-lg' : 'text-sm'
              }`}
            >
              {oppositeInfo.desc}
            </p>
          </div>
        </div>

        {/* Origem da Palavra com Glossário */}
        <div className="bg-indigo-900/50 rounded-2xl p-5 border border-indigo-400/30 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Origem da Palavra
            </span>
            <p className="text-xs sm:text-sm text-indigo-100">
              {currentEvent.name.includes('Equinócio') ? (
                <>
                  <strong>Equinócio</strong> vem do latim <em>aequus</em> (igual) e <em>nox</em> (noite). Significa literalmente &ldquo;noites iguais aos dias&rdquo;!
                </>
              ) : (
                <>
                  <strong>Solstício</strong> vem do latim <em>solstitium</em> (sol parado), pois nessa data a altura máxima que o Sol atinge no céu parece estagnar antes de recomeçar a inverter!
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openGlossary('rotacao')}
              className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Rotação</span>
            </button>
            <button
              type="button"
              onClick={() => openGlossary('hemisferio')}
              className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Hemisfério</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEÇÃO 5: O DESAFIO DO ASTRÔNOMO CHEFE (MINI-QUIZ RECOMPENSADOR) */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-950 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl space-y-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full inline-block mb-1 border border-amber-300/30">
                Desafio dos Astros
              </span>
              <h3 className="text-2xl font-black">
                O Teste Final do Astrônomo Chefe
              </h3>
            </div>
          </div>

          <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-amber-400 text-amber-950">
            Pergunta {quizIndex + 1} de {ASTRONOMER_QUIZ.length}
          </span>
        </div>

        {/* Card da Pergunta */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-md space-y-4">
          <h4 className="text-lg font-black leading-snug">
            {ASTRONOMER_QUIZ[quizIndex].question}
          </h4>

          <div className="space-y-2.5">
            {ASTRONOMER_QUIZ[quizIndex].options.map((opt, idx) => {
              const isSelected = selectedQuizOption === idx;
              const hasAnswered = selectedQuizOption !== null;

              let btnStyle = 'bg-white/10 hover:bg-white/20 border-white/20 text-white';
              if (hasAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-black shadow-lg';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-600 border-rose-400 text-white font-bold';
                } else {
                  btnStyle = 'bg-white/5 border-white/10 text-white/40 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleAnswerQuiz(idx)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all text-sm sm:text-base cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.text}</span>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback explicativo e botão de avanço */}
          {selectedQuizOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-white/15 border border-white/20 text-xs sm:text-sm space-y-3"
            >
              <p className="font-semibold text-indigo-100 leading-relaxed">
                {ASTRONOMER_QUIZ[quizIndex].explanation}
              </p>

              <button
                type="button"
                onClick={handleNextQuiz}
                className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm transition-transform hover:scale-105 cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>
                  {quizIndex < ASTRONOMER_QUIZ.length - 1
                    ? 'Próxima Pergunta ➡️'
                    : 'Finalizar Missão 5 🎓'}
                </span>
              </button>
            </motion.div>
          )}

          {/* Celebração final de conclusão */}
          {quizFinished && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-center space-y-2 shadow-2xl"
            >
              <div className="text-4xl">👑 ☀️ 🌙 ⚖️</div>
              <h5 className="text-xl font-black">
                Medalha de Astrônomo Chefe Conquistada!
              </h5>
              <p className="text-xs sm:text-sm font-bold text-amber-950/90">
                Você dominou por completo os Solstícios, Equinócios e o grande relógio de 24 horas da Terra!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};