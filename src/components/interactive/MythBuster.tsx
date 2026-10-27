'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight,
  BookOpen, Trophy, LockKeyhole, RotateCcw, Star, Target, Zap
} from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

type Answer = { text: string; correct: boolean; explanation: string };
type Question = { question: string; topic: string; answers: Answer[] };

const QUESTIONS: Question[] = [
  {
    topic: 'Estações do ano',
    question: 'O que causa principalmente as estações do ano?',
    answers: [
      { text: 'A Terra fica muito mais perto do Sol no verão.', correct: false, explanation: 'A distância varia um pouco, mas não explica as estações opostas dos hemisférios.' },
      { text: 'A inclinação do eixo da Terra durante a translação.', correct: true, explanation: 'A inclinação de cerca de 23,5° muda o ângulo da luz e a duração dos dias em cada hemisfério.' },
      { text: 'O Sol fica mais quente em dezembro.', correct: false, explanation: 'O Sol não muda de temperatura a cada estação terrestre.' },
      { text: 'A Terra para de girar no inverno.', correct: false, explanation: 'A Terra continua girando diariamente durante todo o ano.' },
    ],
  },
  {
    topic: 'Hemisférios',
    question: 'Quando é verão no Hemisfério Sul, o que costuma acontecer no Hemisfério Norte?',
    answers: [
      { text: 'Também é verão.', correct: false, explanation: 'Os hemisférios recebem luz de forma diferente por causa da inclinação do eixo.' },
      { text: 'É inverno.', correct: true, explanation: 'As estações são opostas: enquanto um hemisfério está mais voltado para o Sol, o outro está menos voltado.' },
      { text: 'Não existe estação definida.', correct: false, explanation: 'Os dois hemisférios têm estações, embora as datas e condições variem por região.' },
      { text: 'A Terra fica sem luz solar.', correct: false, explanation: 'A luz solar continua chegando à Terra.' },
    ],
  },
  {
    topic: 'Órbita',
    question: 'Qual é o formato aproximado da órbita da Terra ao redor do Sol?',
    answers: [
      { text: 'Um quadrado.', correct: false, explanation: 'Uma órbita quadrada não corresponde ao movimento gravitacional dos planetas.' },
      { text: 'Uma linha reta.', correct: false, explanation: 'A gravidade mantém a Terra em uma trajetória orbital fechada.' },
      { text: 'Uma elipse quase circular.', correct: true, explanation: 'A órbita terrestre é uma elipse de pouca excentricidade, quase circular.' },
      { text: 'Um círculo perfeito, sem nenhuma variação.', correct: false, explanation: 'É quase circular, mas não um círculo matematicamente perfeito.' },
    ],
  },
  {
    topic: 'Distância do Sol',
    question: 'A Terra está mais próxima do Sol em janeiro. Isso significa que é verão no planeta inteiro?',
    answers: [
      { text: 'Sim, a distância determina o verão em todo lugar.', correct: false, explanation: 'Se fosse assim, os hemisférios não teriam estações opostas ao mesmo tempo.' },
      { text: 'Não. A inclinação do eixo é a principal causa das estações.', correct: true, explanation: 'Em janeiro é verão no Hemisfério Sul e inverno no Norte, mostrando que a distância não é a causa principal.' },
      { text: 'Sim, mas só durante o dia.', correct: false, explanation: 'O ciclo de dia e noite está ligado à rotação da Terra.' },
      { text: 'Não, porque a Terra não orbita o Sol.', correct: false, explanation: 'A Terra orbita o Sol ao longo de aproximadamente um ano.' },
    ],
  },
  {
    topic: 'Luz solar',
    question: 'Por que a luz solar aquece mais uma região no verão?',
    answers: [
      { text: 'Os raios chegam mais diretamente e os dias tendem a ser mais longos.', correct: true, explanation: 'A energia fica mais concentrada em uma área e há mais tempo de iluminação durante o dia.' },
      { text: 'A região fica fisicamente mais perto do Sol.', correct: false, explanation: 'A diferença de distância entre regiões da Terra é insignificante para explicar as estações.' },
      { text: 'A atmosfera desaparece no verão.', correct: false, explanation: 'A atmosfera permanece presente em todas as estações.' },
      { text: 'A Lua reflete mais luz nessa época.', correct: false, explanation: 'A Lua não é responsável pelo padrão das estações.' },
    ],
  },
  {
    topic: 'Eixo terrestre',
    question: 'Aproximadamente quantos graus tem a inclinação do eixo terrestre?',
    answers: [
      { text: '0°', correct: false, explanation: 'Sem inclinação, o padrão anual de estações seria muito diferente.' },
      { text: '5°', correct: false, explanation: 'O valor é maior: aproximadamente 23,5°.' },
      { text: '23,5°', correct: true, explanation: 'A inclinação do eixo terrestre é de aproximadamente 23,5° em relação à perpendicular ao plano orbital.' },
      { text: '90°', correct: false, explanation: 'A inclinação não é de 90°.' },
    ],
  },
  {
    topic: 'Translação',
    question: 'Quanto tempo a Terra leva, aproximadamente, para completar uma volta ao redor do Sol?',
    answers: [
      { text: '24 horas.', correct: false, explanation: 'Cerca de 24 horas é a duração aproximada de uma rotação em relação ao Sol.' },
      { text: '30 dias.', correct: false, explanation: 'Esse período se aproxima de um mês, não de um ano.' },
      { text: '365 dias e cerca de 6 horas.', correct: true, explanation: 'Esse excedente de aproximadamente 6 horas contribui para o ajuste dos anos bissextos.' },
      { text: '10 anos.', correct: false, explanation: 'A Terra completa sua órbita em cerca de um ano.' },
    ],
  },
  {
    topic: 'Ano bissexto',
    question: 'O que fazemos, aproximadamente, com as 6 horas extras acumuladas por ano?',
    answers: [
      { text: 'Ignoramos para sempre.', correct: false, explanation: 'Sem ajustes, o calendário se afastaria gradualmente das estações.' },
      { text: 'A cada quatro anos, acrescentamos um dia ao calendário, com exceções na regra civil.', correct: true, explanation: 'Quatro períodos de cerca de 6 horas somam aproximadamente 24 horas. A regra gregoriana também considera os anos de século.' },
      { text: 'Acrescentamos um mês inteiro todo ano.', correct: false, explanation: 'O ajuste usual é de um dia em fevereiro nos anos bissextos.' },
      { text: 'A Terra gira seis horas mais rápido.', correct: false, explanation: 'O ajuste é feito no calendário, não acelerando a rotação da Terra.' },
    ],
  },
  {
    topic: 'Dia e noite',
    question: 'Qual movimento da Terra está mais diretamente ligado à alternância entre dia e noite?',
    answers: [
      { text: 'Translação ao redor do Sol.', correct: false, explanation: 'A translação está ligada à duração do ano.' },
      { text: 'Rotação em torno do próprio eixo.', correct: true, explanation: 'A rotação faz diferentes regiões da Terra ficarem voltadas para o Sol e depois se afastarem dele.' },
      { text: 'A órbita da Lua.', correct: false, explanation: 'A órbita lunar não causa a alternância diária entre dia e noite.' },
      { text: 'A inclinação das nuvens.', correct: false, explanation: 'Nuvens não determinam o ciclo de dia e noite.' },
    ],
  },
  {
    topic: 'Pensamento científico',
    question: 'Qual observação ajuda a refutar a ideia de que a distância do Sol causa sozinha as estações?',
    answers: [
      { text: 'Os hemisférios podem ter estações opostas ao mesmo tempo.', correct: true, explanation: 'Essa observação combina com a inclinação do eixo e não com uma explicação baseada apenas na distância.' },
      { text: 'O Sol aparece brilhante no céu.', correct: false, explanation: 'O brilho do Sol, sozinho, não explica as estações.' },
      { text: 'Existem estrelas no espaço.', correct: false, explanation: 'Isso não distingue as causas das estações.' },
      { text: 'A Terra tem oceanos.', correct: false, explanation: 'A presença de oceanos não é a evidência principal para essa explicação.' },
    ],
  },
];

const SECRETS = [
  { id: 'orbit', points: 20, title: 'Segredo 1 — A órbita quase circular', icon: '🪐', text: 'A órbita da Terra é uma elipse de pouca excentricidade. A variação de distância ao Sol não explica as estações opostas dos hemisférios.' },
  { id: 'hemispheres', points: 40, title: 'Segredo 2 — O espelho dos hemisférios', icon: '🌎', text: 'Quando o Hemisfério Sul está mais voltado para o Sol, tende a ser verão no Sul e inverno no Norte. Cerca de seis meses depois, o padrão se inverte.' },
  { id: 'sunlight', points: 60, title: 'Segredo 3 — O poder do ângulo', icon: '☀️', text: 'Raios mais diretos concentram energia em uma área menor. A duração do dia também influencia a energia recebida ao longo do dia.' },
  { id: 'leap', points: 80, title: 'Segredo 4 — O calendário secreto', icon: '📅', text: 'O ano tropical dura aproximadamente 365,2422 dias. Por isso o calendário gregoriano usa anos bissextos com exceções: anos divisíveis por 100 não são bissextos, salvo se também forem divisíveis por 400.' },
  { id: 'expert', points: 100, title: 'Segredo lendário — Mestre das estações', icon: '🏆', text: 'Você concluiu todas as perguntas! Lembre-se: estações resultam principalmente da inclinação do eixo terrestre combinada com a translação, não da distância ao Sol.' },
];

export const MythBuster: React.FC = () => {
  const completeMission = useProgressStore((state) => state.completeMission);
  const largeTextMode = useProgressStore((state) => state.largeTextMode);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [discoveredSecrets, setDiscoveredSecrets] = useState<string[]>([]);
  const [showAllSecrets, setShowAllSecrets] = useState(false);

  const currentQuestion = QUESTIONS[questionIndex];
  const answered = answers[questionIndex] !== undefined;
  const correctCount = useMemo(
    () => Object.entries(answers).filter(([index, answerIndex]) => QUESTIONS[Number(index)].answers[answerIndex]?.correct).length,
    [answers],
  );
  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);
  const unlockedSecrets = SECRETS.filter((secret) => score >= secret.points);
  const nextSecret = SECRETS.find((secret) => score < secret.points);

  const chooseAnswer = (answerIndex: number) => {
    if (answered) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setAnswers((previous) => ({ ...previous, [questionIndex]: answerIndex }));
    if (currentQuestion.answers[answerIndex].correct) {
      setScore((previous) => {
        const next = previous + 10;
        if (next >= 50) completeMission(1);
        return next;
      });
    }
  };

  const revealSecret = (id: string) => {
    if (!discoveredSecrets.includes(id)) {
      const updated = [...discoveredSecrets, id];
      setDiscoveredSecrets(updated);
      if (updated.length >= 2 || score >= 50) completeMission(1);
    }
  };

  const nextQuestion = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setDiscoveredSecrets([]);
    setShowAllSecrets(false);
  };

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-slate-950 p-6 text-white shadow-xl sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_15%_20%,#4338ca_0,transparent_35%),radial-gradient(circle_at_85%_80%,#0e7490_0,transparent_35%)]" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-400/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-200">
              <Sparkles className="h-4 w-4" /> Experiência 1 · Detetive da Ciência
            </span>
            <h3 className="mt-3 text-2xl font-black sm:text-3xl">Mito ou verdade: desafie o universo</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              Responda ao quiz, ganhe pontos por acertos e desbloqueie segredos científicos ao alcançar novas metas.
            </p>
          </div>
          <AudioButton
            text="Responda às dez perguntas sobre as estações do ano, a órbita da Terra e o ano bissexto. Cada resposta correta vale dez pontos. Use sua pontuação para desbloquear segredos."
            label="Ouvir instruções"
            size="sm"
          />
        </div>

        <div className="relative z-10 mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300"><Trophy className="h-4 w-4 text-amber-300" /> Pontuação</div>
            <div className="mt-1 text-3xl font-black text-amber-300">{score}<span className="text-base text-slate-400"> / 100</span></div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300"><Target className="h-4 w-4 text-emerald-300" /> Acertos</div>
            <div className="mt-1 text-3xl font-black">{correctCount}<span className="text-base text-slate-400"> / {QUESTIONS.length}</span></div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-300"><LockKeyhole className="h-4 w-4 text-violet-300" /> Segredos</div>
            <div className="mt-1 text-3xl font-black">{discoveredSecrets.length}<span className="text-base text-slate-400"> descobertos</span></div>
          </div>
        </div>

        <div className="relative z-10 mt-5">
          <div className="mb-2 flex justify-between text-xs font-bold text-slate-300">
            <span>Progresso do desafio</span><span>{Object.keys(answers).length}/{QUESTIONS.length} perguntas</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300" animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} />
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border-2 border-indigo-100 bg-white p-5 shadow-lg sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-indigo-800">
              Pergunta {questionIndex + 1} de {QUESTIONS.length}
            </span>
            <span className="text-xs font-bold text-slate-500">{currentQuestion.topic}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={questionIndex} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.2 }}>
              <h4 className={`mt-5 font-black leading-snug text-slate-900 ${largeTextMode ? 'text-2xl' : 'text-xl sm:text-2xl'}`}>
                {currentQuestion.question}
              </h4>
              <p className="mt-2 text-sm text-slate-500">Escolha uma resposta. Cada acerto vale <strong className="text-emerald-700">10 pontos</strong>.</p>
              <div className="mt-5 space-y-3">
                {currentQuestion.answers.map((answer, index) => {
                  const isSelected = selectedAnswer === index;
                  const showCorrect = answered && answer.correct;
                  const showWrong = answered && isSelected && !answer.correct;
                  return (
                    <motion.button
                      key={answer.text}
                      whileHover={!answered ? { y: -2 } : undefined}
                      whileTap={!answered ? { scale: 0.99 } : undefined}
                      type="button"
                      disabled={answered}
                      onClick={() => chooseAnswer(index)}
                      className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                        showCorrect ? 'border-emerald-400 bg-emerald-50' :
                        showWrong ? 'border-rose-400 bg-rose-50' :
                        isSelected ? 'border-indigo-400 bg-indigo-50' :
                        answered ? 'border-slate-100 bg-slate-50 opacity-70' :
                        'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/60'
                      }`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                        showCorrect ? 'bg-emerald-500 text-white' : showWrong ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {showCorrect ? <CheckCircle2 className="h-4 w-4" /> : showWrong ? <AlertTriangle className="h-4 w-4" /> : String.fromCharCode(65 + index)}
                      </span>
                      <span className="pt-1 text-sm font-bold leading-relaxed text-slate-800">{answer.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showExplanation && selectedAnswer !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`mt-4 rounded-2xl border p-4 ${currentQuestion.answers[selectedAnswer].correct ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-center gap-2 font-black text-slate-900">
                  {currentQuestion.answers[selectedAnswer].correct ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <HelpCircle className="h-5 w-5 text-amber-600" />}
                  {currentQuestion.answers[selectedAnswer].correct ? '+10 pontos! Resposta correta.' : 'Ainda não! Vamos aprender com isso.'}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{currentQuestion.answers[selectedAnswer].explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex flex-wrap gap-3">
            {questionIndex < QUESTIONS.length - 1 ? (
              <button type="button" disabled={!answered} onClick={nextQuestion} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40">
                Próxima pergunta <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" disabled={!answered} onClick={() => setShowAllSecrets(true)} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">
                Ver resultado final <Trophy className="h-4 w-4" />
              </button>
            )}
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
              <RotateCcw className="h-4 w-4" /> Recomeçar
            </button>
          </div>
          {showAllSecrets && Object.keys(answers).length === QUESTIONS.length && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mt-5 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
              <div className="flex items-center gap-2 text-amber-800"><Trophy className="h-6 w-6" /><strong className="text-lg">Desafio concluído!</strong></div>
              <p className="mt-2 text-sm font-semibold text-slate-700">Você fez {score} de 100 pontos, acertou {correctCount} de {QUESTIONS.length} perguntas e revelou {discoveredSecrets.length} segredos. {score === 100 ? 'Pontuação perfeita: nível lendário!' : 'Continue explorando os segredos desbloqueados para revisar o conteúdo.'}</p>
            </motion.div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-950 p-5 text-white shadow-lg sm:p-6">
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }} transition={{ duration: 4, repeat: Infinity }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-3xl shadow-[0_0_28px_#f59e0b55]">☀️</motion.div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-cyan-300">Central de descobertas</p>
                <h4 className="text-xl font-black">Metas de pontuação</h4>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {[20, 40, 60, 80, 100].map((milestone) => (
                <div key={milestone}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                    <span className={score >= milestone ? 'text-emerald-300' : 'text-slate-400'}>{milestone} pontos</span>
                    <span>{score >= milestone ? 'Desbloqueado' : `${milestone - score} para liberar`}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <motion.div className={`h-full rounded-full ${score >= milestone ? 'bg-emerald-400' : 'bg-indigo-400'}`} animate={{ width: `${Math.min(100, (score / milestone) * 100)}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              ))}
            </div>
            {nextSecret ? (
              <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                <Zap className="mr-1 inline h-4 w-4 text-amber-300" /> Próxima recompensa: <strong className="text-white">{nextSecret.title}</strong>
              </p>
            ) : (
              <p className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-200">Todas as metas alcançadas. Você dominou o laboratório!</p>
            )}
          </div>

          <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-amber-700" /><h4 className="text-lg font-black text-slate-900">Arquivo de segredos</h4></div>
            <p className="mt-1 text-sm text-slate-600">Cada meta revela uma nova descoberta. Clique para registrar o segredo no seu diário.</p>
            <div className="mt-4 space-y-3">
              {SECRETS.map((secret) => {
                const unlocked = score >= secret.points;
                const discovered = discoveredSecrets.includes(secret.id);
                return (
                  <motion.div layout key={secret.id} className={`rounded-2xl border p-4 ${unlocked ? 'border-amber-300 bg-white' : 'border-slate-200 bg-white/60'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${unlocked ? 'bg-amber-100' : 'bg-slate-100 grayscale'}`}>{unlocked ? secret.icon : <LockKeyhole className="h-5 w-5 text-slate-400" />}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="text-sm font-black text-slate-900">{secret.title}</h5>
                          <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>{unlocked ? 'Liberado' : `${secret.points} pts`}</span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{unlocked ? secret.text : 'Segredo bloqueado. Continue respondendo corretamente para descobrir esta informação.'}</p>
                        {unlocked && (
                          <button type="button" onClick={() => revealSecret(secret.id)} disabled={discovered} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-black text-slate-950 transition hover:bg-amber-400 disabled:bg-emerald-100 disabled:text-emerald-800">
                            {discovered ? <><CheckCircle2 className="h-3.5 w-3.5" /> Guardado no diário</> : <><Star className="h-3.5 w-3.5" /> Descobrir segredo</>}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>

      <div className="rounded-3xl border-2 border-indigo-100 bg-indigo-50 p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-3">
          <div className="rounded-2xl bg-indigo-600 p-3 text-white"><HelpCircle className="h-6 w-6" /></div>
          <div className="flex-1">
            <h4 className="text-lg font-black text-slate-900">Mito derrubado: é tudo sobre a distância?</h4>
            <p className={`mt-2 leading-relaxed text-slate-700 ${largeTextMode ? 'text-lg' : 'text-sm'}`}>
              Não. A Terra está mais próxima do Sol por volta de janeiro e mais distante por volta de julho, mas isso não explica por que os hemisférios têm estações opostas. A explicação principal é a inclinação do eixo terrestre, que altera o ângulo de incidência da luz solar e a duração dos dias ao longo da translação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
