// src/components/interactive/MasterQuiz.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  Award,
  Star,
  ArrowRight,
  Flame,
  HelpCircle,
  Crown
} from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

interface QuizQuestion {
  missionSource: string;
  missionNumber: number;
  question: string;
  emoji: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

const MASTER_QUESTIONS: QuizQuestion[] = [
  {
    missionSource: 'Missão 1 · O Sol e a Terra',
    missionNumber: 1,
    emoji: '🕵️‍♂️',
    question: 'Por que faz calor no Verão? É porque a Terra viaja mais pertinho do Sol?',
    options: [
      {
        text: 'Não! A Terra não chega pertinho; o calor acontece porque ela viaja deitadinha e ganha luz solar reta!',
        isCorrect: true,
      },
      {
        text: 'Sim! No Verão a Terra quase encosta no Sol de tão pertinho!',
        isCorrect: false,
      },
      {
        text: 'Não, é porque o Sol toma banho de fogo e fica gigante!',
        isCorrect: false,
      },
    ],
    explanation:
      'Parabéns, Detetive! Você derrubou o mito: a distância da Terra quase não muda. O verdadeiro segredo é a inclinação do planeta!',
  },
  {
    missionSource: 'Missão 2 · A Grande Viagem',
    missionNumber: 2,
    emoji: '🛸',
    question: 'Quanto tempo a Terra leva para dar uma volta inteirinha ao redor do Sol?',
    options: [
      {
        text: '365 dias e mais 6 horas (um ano completo do calendário)!',
        isCorrect: true,
      },
      {
        text: 'Apenas 24 horas (o tempo de um dia e uma noite)!',
        isCorrect: false,
      },
      {
        text: 'Exatamente 30 dias (o tempo de um mês)!',
        isCorrect: false,
      },
    ],
    explanation:
      'Isso mesmo, Piloto de Órbita! Essa volta inteira se chama Translação e dura 365 dias e 6 horas.',
  },
  {
    missionSource: 'Missão 2 · O Ano Bissexto',
    missionNumber: 2,
    emoji: '📅',
    question: 'O que acontece com as 6 horinhas que sobram a cada ano da viagem da Terra?',
    options: [
      {
        text: 'Elas se juntam durante 4 anos (6+6+6+6 = 24h) e criam o dia 29 de fevereiro no Ano Bissexto!',
        isCorrect: true,
      },
      {
        text: 'Elas somem no espaço e são apagadas dos relógios!',
        isCorrect: false,
      },
      {
        text: 'Elas viram minutos extras na hora do recreio da escola!',
        isCorrect: false,
      },
    ],
    explanation:
      'Perfeito! 4 anos com 6 horas extras formam 24 horas certinho, que é exatamente 1 dia a mais em fevereiro!',
  },
  {
    missionSource: 'Missão 3 · O Planeta Inclinado',
    missionNumber: 3,
    emoji: '🔦',
    question: 'O que acontece quando o Sol bate retinho no chão, igual a uma lanterna apontada de perto?',
    options: [
      {
        text: 'A luz fica concentrada num ponto só e esquenta muito (faz o calor de Verão)!',
        isCorrect: true,
      },
      {
        text: 'A luz fica com frio, se espalha e começa a nevar no quintal!',
        isCorrect: false,
      },
      {
        text: 'O chão vira um espelho e reflete o Sol de volta para a Lua!',
        isCorrect: false,
      },
    ],
    explanation:
      'Muito bem, Mestre da Luz! Luz reta concentra calor e aquece muito; luz inclinada espalha e esquenta pouco!',
  },
  {
    missionSource: 'Missão 4 · O Espelho Planetário',
    missionNumber: 4,
    emoji: '🌦️',
    question: 'Quando é Natal (25 de Dezembro) e estamos na praia no Brasil (Sul), o que as crianças usam em Portugal (Norte)?',
    options: [
      {
        text: 'Casaco bem grosso, luvas e gorro, porque lá é Inverno com frio e neve! ❄️',
        isCorrect: true,
      },
      {
        text: 'Biquíni e óculos de sol na praia de calor, igualzinho ao Brasil! 🏖️',
        isCorrect: false,
      },
      {
        text: 'Capa de chuva amarela porque na Europa não existem estações!',
        isCorrect: false,
      },
    ],
    explanation:
      'Sensacional! Os dois lados da Terra funcionam como um espelho: quando no Sul é Verão, no Norte é simultaneamente Inverno!',
  },
  {
    missionSource: 'Missão 5 · Solstícios e Equinócios',
    missionNumber: 5,
    emoji: '⚖️',
    question: 'O que acontece nos dias de Equinócio em todo o planeta Terra?',
    options: [
      {
        text: 'Empate cósmico perfeito: são exatamente 12 horas de dia e 12 horas de noite! 🤝',
        isCorrect: true,
      },
      {
        text: 'O Sol fica aceso 24 horas direto sem nunca anoitecer!',
        isCorrect: false,
      },
      {
        text: 'O dia acaba às 10 horas da manhã e fica escuro o resto do tempo!',
        isCorrect: false,
      },
    ],
    explanation:
      'Incrível! Equinócio significa "noites iguais": 12 horas de Sol para brincar e 12 horas de noite para dormir!',
  },
];

export const MasterQuiz: React.FC = () => {
  const { completeMission, largeTextMode } = useProgressStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const currentQ = MASTER_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / MASTER_QUESTIONS.length) * 100);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // já respondeu

    setSelectedOption(idx);
    setAnsweredQuestions((prev) => [...prev, currentIndex]);

    const isCorrect = currentQ.options[idx].isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Se respondeu a última pergunta
    if (currentIndex === MASTER_QUESTIONS.length - 1) {
      setTimeout(() => {
        setIsFinished(true);
        completeMission(6); // Conclui a Missão 6
      }, 1400);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex < MASTER_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      completeMission(6);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setAnsweredQuestions([]);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* CABEÇALHO DO QUIZ */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-5 sm:p-8 border-4 border-amber-400/50 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              🏆
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full inline-block mb-1 border border-amber-300/30">
                Missão 6 · O Desafio Final dos Campeões
              </span>
              <h2 className="text-xl sm:text-3xl font-black">
                O Grande Quiz dos Segredos do Espaço
              </h2>
            </div>
          </div>

          <AudioButton
            text="Bem-vindo à Missão 6, o grande teste final dos mestres do espaço! Responda às perguntas sobre o mito do Sol, a viagem de 365 dias, o truque da lanterna, o espelho da Terra e o equilíbrio dos solstícios e equinócios. Mostre o que aprendeu e ganhe a coroa de Campeão Supremo!"
            label="Ouvir instruções do Quiz"
            size="sm"
          />
        </div>

        {/* Barra de Progresso do Quiz */}
        {!isFinished && (
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-black text-indigo-200">
              <span>Pergunta {currentIndex + 1} de {MASTER_QUESTIONS.length}</span>
              <span className="text-amber-300 font-mono">{score} Acertos até agora</span>
            </div>

            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-500 shadow-md"
              />
            </div>
          </div>
        )}
      </div>

      {/* ÁREA INTERATIVA DO QUIZ */}
      {!isFinished ? (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl p-5 sm:p-8 border-4 border-indigo-200 shadow-xl space-y-6"
        >
          {/* Tag da Missão de Origem */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
              <span>{currentQ.emoji}</span>
              <span>Lembrando da {currentQ.missionSource}</span>
            </span>

            <span className="text-xs font-extrabold text-slate-400">
              Questão {currentIndex + 1}
            </span>
          </div>

          {/* Pergunta */}
          <h3
            className={`font-black text-slate-900 leading-snug ${
              largeTextMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-2xl'
            }`}
          >
            {currentQ.question}
          </h3>

          {/* Opções de Resposta */}
          <div className="space-y-3 pt-1">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const hasAnswered = selectedOption !== null;

              let btnStyle =
                'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 text-slate-800';

              if (hasAnswered) {
                if (option.isCorrect) {
                  btnStyle =
                    'bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-lg ring-2 ring-emerald-400';
                } else if (isSelected && !option.isCorrect) {
                  btnStyle =
                    'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-3 text-left transition-all text-xs sm:text-base cursor-pointer active:scale-[0.99] flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span className="leading-relaxed font-semibold">{option.text}</span>
                  {hasAnswered && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Explicativo e Botão Avançar */}
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl">💡</span>
                <p className="text-xs sm:text-sm font-bold leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>

              {currentIndex < MASTER_QUESTIONS.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm transition-transform shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Próxima Pergunta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      ) : (
        /* TELA DE RESULTADO FINAL E COROAÇÃO */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-500 rounded-3xl p-6 sm:p-10 border-4 border-white shadow-2xl text-center space-y-6 text-slate-950"
        >
          <div className="w-24 h-24 rounded-full bg-white/40 border-4 border-white mx-auto flex items-center justify-center text-5xl shadow-xl animate-bounce">
            👑
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-4 py-1 rounded-full inline-block">
              Desafio Concluído com Sucesso!
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-950">
              Você é um Campeão Supremo da Terra!
            </h3>
            <p className="text-sm sm:text-lg font-bold text-slate-900 max-w-xl mx-auto">
              Você acertou <strong className="text-slate-950 text-xl">{score}</strong> de <strong className="text-slate-950 text-xl">{MASTER_QUESTIONS.length}</strong> perguntas e provou que sabe tudo sobre o Sol, a Terra e as estações!
            </p>
          </div>

          {/* Medalha Destravada */}
          <div className="p-4 rounded-2xl bg-white/70 max-w-md mx-auto border-2 border-white/80 shadow-md flex items-center justify-center gap-3">
            <span className="text-3xl">🎖️</span>
            <div className="text-left">
              <span className="text-xs font-extrabold uppercase text-amber-900 block">
                Medalha Desbloqueada:
              </span>
              <span className="text-base sm:text-lg font-black text-slate-950">
                Campeão Supremo dos Segredos do Espaço
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/"
              className="px-6 py-3.5 rounded-full bg-slate-950 text-white font-black text-sm transition-transform active:scale-95 shadow-xl hover:bg-slate-900 inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Ver Minhas Medalhas na Página Inicial</span>
            </Link>

            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-3.5 rounded-full bg-white/80 hover:bg-white text-slate-900 font-extrabold text-sm transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jogar o Quiz de Novo</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
