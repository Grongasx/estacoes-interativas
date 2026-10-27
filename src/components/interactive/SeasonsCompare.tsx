// src/components/interactive/SeasonsCompare.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2,
  Sun,
  Clock,
  CloudSun,
  Sparkles,
  CheckCircle2,
  ArrowRightLeft,
  BookOpen,
  TreePine,
  Thermometer,
  Compass,
  RotateCcw,
  Shirt,
  Bird,
  HelpCircle,
  Award
} from 'lucide-react';
import { SEASONS_DATA, SeasonDetail } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';
import { SeasonTreeInteractive, SeasonType } from './SeasonTreeInteractive';

const OPPOSITE_SEASON_MAP: Record<SeasonDetail['id'], SeasonDetail['id']> = {
  verao: 'inverno',
  inverno: 'verao',
  primavera: 'outono',
  outono: 'primavera',
};

// Mapeamento entre IDs das estações e tipos da Árvore
const ID_TO_TREE_SEASON: Record<string, SeasonType> = {
  verao: 'summer',
  outono: 'autumn',
  inverno: 'winter',
  primavera: 'spring',
};

const TREE_SEASON_TO_ID: Record<SeasonType, SeasonDetail['id']> = {
  summer: 'verao',
  autumn: 'outono',
  winter: 'inverno',
  spring: 'primavera',
};

// Dados ecológicos e comportamentais de cada estação para enriquecer o laboratório
interface SeasonEcoData {
  tempRange: string;
  sunAngleText: string;
  floraDetails: string;
  faunaDetails: string;
  humanLife: string;
  clothingEmoji: string;
  animalEmoji: string;
  floraEmoji: string;
}

const SEASON_ECO_MAP: Record<SeasonDetail['id'], SeasonEcoData> = {
  verao: {
    tempRange: 'Muito calor! (28°C a 38°C)',
    sunAngleText: 'O Sol bate bem no alto da cabeça e esquenta muito o chão, igual a uma lanterna de pertinho!',
    floraDetails: 'As folhas da árvore ficam bem verdinhas, fortes e grandes. As frutas ficam maduras e docinhas nos galhos!',
    faunaDetails: 'Passarinhos cantam alto, cigarras zumbem e as abelhas voam felizes de flor em flor!',
    humanLife: 'Praia, piscina, picolé de frutas, roupas fresquinhas de calor e protetor solar no rosto!',
    clothingEmoji: '🩳',
    animalEmoji: '🦜',
    floraEmoji: '🍉',
  },
  outono: {
    tempRange: 'Ventinho fresco (16°C a 24°C)',
    sunAngleText: 'O Sol fica mais fraquinho e bate de lado, deixando o ar mais gostoso e fresco.',
    floraDetails: 'A árvore começa a ter sono: as folhas perdem a cor verde, ficam amarelas, laranjas e vermelhas, e caem no chão!',
    faunaDetails: 'Esquilos e passarinhos guardam nozes e sementinhas para comer quando o inverno chegar!',
    humanLife: 'Hora de colocar um casaquinho leve, tomar um chá quentinho e pisar nas folhas secas na calçada!',
    clothingEmoji: '🧥',
    animalEmoji: '🐿️',
    floraEmoji: '🍂',
  },
  inverno: {
    tempRange: 'Friozinho de cobertor (0°C a 14°C)',
    sunAngleText: 'O Sol passa baixinho no céu, bem deitado, e quase não consegue esquentar o chão.',
    floraDetails: 'A árvore perde todas as folhas para descansar no inverno e não congelar com o frio!',
    faunaDetails: 'Muitos animais entram em tocas e cavernas para dormir quentinhos o inverno inteiro!',
    humanLife: 'Casaco bem grosso, touca na cabeça, luvas quentinhas e chocolate quente na caneca!',
    clothingEmoji: '🧣',
    animalEmoji: '🐻❄️',
    floraEmoji: '🌲',
  },
  primavera: {
    tempRange: 'Clima gostoso e alegre (18°C a 26°C)',
    sunAngleText: 'O Sol volta a brilhar mais forte no céu e vai acordando a natureza do friozinho.',
    floraDetails: 'Brotinhos verdes nascem devagar nos galhos e abrem milhares de flores coloridas e cheirosas!',
    faunaDetails: 'Filhotinhos de passarinhos nascem nos ninhos e borboletas coloridas dançam pelo ar!',
    humanLife: 'Passear no parque, fazer piquenique na grama e aproveitar os dias cheios de flores e cores!',
    clothingEmoji: '👚',
    animalEmoji: '🐝',
    floraEmoji: '🌸',
  },
};

// Mini-desafio do Espelho Planetário
interface QuizQuestion {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Em 25 de Dezembro comemoramos o Natal! No Brasil (Sul) estamos na praia no Verão. Como está o clima em Portugal (Norte)?',
    options: [
      { text: 'Inverno frio com casacos e cachecol! ❄️', isCorrect: true },
      { text: 'Verão quente igual ao Brasil! ☀️', isCorrect: false },
      { text: 'Outono chuvoso com folhas a cair! 🍂', isCorrect: false },
    ],
    explanation: 'Exato! Como o eixo da Terra está inclinado, em Dezembro o Sul recebe luz direta (Verão) e o Norte recebe luz inclinada (Inverno).',
  },
  {
    question: 'Quando as folhas das árvores amarelam e caem na Argentina (Outono), o que acontece nos campos do Japão?',
    options: [
      { text: 'As cerejeiras florescem na Primavera! 🌸', isCorrect: true },
      { text: 'Começa a nevar sem parar! ☃️', isCorrect: false },
      { text: 'Todas as frutas amadurecem no Verão! 🍉', isCorrect: false },
    ],
    explanation: 'Muito bem! O oposto de Outono é sempre Primavera. Enquanto o Sul arrefece, o Norte floresce e aquece!',
  },
  {
    question: 'Por que o Hemisfério Sul e o Hemisfério Norte nunca têm a mesma estação ao mesmo tempo?',
    options: [
      { text: 'Por causa da inclinação de 23,5° do eixo da Terra! 📐', isCorrect: true },
      { text: 'Porque a Terra fica mais perto do Sol no Verão! 🛸', isCorrect: false },
      { text: 'Porque as nuvens bloqueiam o Sol só de um lado! ☁️', isCorrect: false },
    ],
    explanation: 'Perfeito! É a inclinação fixa do eixo que faz uma metade inclinar-se em direção ao Sol enquanto a outra inclina-se para longe.',
  },
];

export const SeasonsCompare: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();

  // Ponto de vista do observador: 'sul' (ex: Brasil) ou 'norte' (ex: Portugal/Europa)
  const [viewHemisphere, setViewHemisphere] = useState<'sul' | 'norte'>('sul');
  
  // Estação ativa no Hemisfério Sul (referência planetária)
  const [selectedSouthId, setSelectedSouthId] = useState<SeasonDetail['id']>('verao');
  const [exploredSeasons, setExploredSeasons] = useState<string[]>(['verao']);

  // Estado do Quiz Interativo
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizCelebration, setShowQuizCelebration] = useState(false);

  // Determinar a estação atual no Sul e no Norte
  const southSeason = SEASONS_DATA.find((s) => s.id === selectedSouthId) || SEASONS_DATA[1];
  const northSeasonId = OPPOSITE_SEASON_MAP[selectedSouthId];
  const northSeason = SEASONS_DATA.find((s) => s.id === northSeasonId) || SEASONS_DATA[3];

  // A estação mostrada pela árvore depende do ponto de vista do hemisfério selecionado!
  const effectiveSeasonId = viewHemisphere === 'sul' ? selectedSouthId : northSeasonId;
  const currentTreeSeason = ID_TO_TREE_SEASON[effectiveSeasonId] || 'summer';
  const effectiveEcoData = SEASON_ECO_MAP[effectiveSeasonId];
  const effectiveSeasonData = viewHemisphere === 'sul' ? southSeason : northSeason;

  const handleSelectSeason = (id: SeasonDetail['id']) => {
    setSelectedSouthId(id);
    if (!exploredSeasons.includes(id)) {
      const next = [...exploredSeasons, id];
      setExploredSeasons(next);
      if (next.length >= 2) {
        completeMission(4);
      }
    }
  };

  const handleTreeSeasonChange = (treeSeason: SeasonType) => {
    const matchingId = TREE_SEASON_TO_ID[treeSeason];
    if (!matchingId) return;

    if (viewHemisphere === 'sul') {
      handleSelectSeason(matchingId);
    } else {
      // Se estamos a olhar o Norte e mudamos a árvore, invertemos para encontrar o correspondente no Sul
      const oppositeId = OPPOSITE_SEASON_MAP[matchingId];
      handleSelectSeason(oppositeId);
    }
  };

  const handleToggleHemisphereView = (target: 'sul' | 'norte') => {
    setViewHemisphere(target);
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    setSelectedQuizOption(optionIdx);
    const q = QUIZ_QUESTIONS[currentQuizIndex];
    if (q.options[optionIdx].isCorrect) {
      setQuizScore((prev) => prev + 1);
      if (currentQuizIndex === QUIZ_QUESTIONS.length - 1) {
        setShowQuizCelebration(true);
        completeMission(4);
      }
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      // Reiniciar quiz se já terminou
      setCurrentQuizIndex(0);
      setQuizScore(0);
      setShowQuizCelebration(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* PAINEL DE CONTROLE INTEGRADO: HEMISFÉRIO E ESTAÇÕES */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-400/40 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-lg font-black text-2xl">
              🌍
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full inline-block mb-1 border border-amber-300/30">
                Missão 4 · O Laboratório das Quatro Estações
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                O Espelho Planetário e a Vida na Terra
              </h2>
            </div>
          </div>

          <AudioButton
            text="Bem-vindo à Missão 4 reestruturada! Aqui podes alternar a perspetiva entre o Hemisfério Sul, onde fica o Brasil, e o Hemisfério Norte, onde fica Portugal. Quando um hemisfério está inclinado para o Sol e vive o Verão, o outro está inclinado para longe e vive o Inverno!"
            label="Ouvir instruções da missão 4"
            size="sm"
          />
        </div>

        {/* CONTROLE 1: PONTO DE VISTA DO HEMISFÉRIO PARA A ÁRVORE */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
              Ponto de Observação da Árvore
            </span>
            <p className="text-sm font-bold text-white">
              De qual lado do planeta queres olhar a natureza agora?
            </p>
          </div>

          <div className="inline-flex p-1.5 rounded-2xl bg-slate-950/60 border border-white/20">
            <button
              type="button"
              onClick={() => handleToggleHemisphereView('sul')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                viewHemisphere === 'sul'
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🇧🇷</span>
              <span>Hemisfério Sul (ex: Brasil)</span>
              {viewHemisphere === 'sul' && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </button>

            <button
              type="button"
              onClick={() => handleToggleHemisphereView('norte')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                viewHemisphere === 'norte'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🇵🇹</span>
              <span>Hemisfério Norte (ex: Portugal)</span>
              {viewHemisphere === 'norte' && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </button>
          </div>
        </div>

        {/* CONTROLE 2: SELETOR DAS 4 ESTAÇÕES (SINCRONIZADO) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase text-amber-300 tracking-wider">
              Escolhe a época do ano no Hemisfério Sul (o Norte ajusta-se automaticamente no espelho):
            </span>
            <span className="text-xs text-indigo-200 font-semibold hidden sm:inline">
              {exploredSeasons.length}/4 Estações exploradas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEASONS_DATA.map((season) => {
              const isSelected = season.id === selectedSouthId;
              const isVisited = exploredSeasons.includes(season.id);
              const oppositeName = SEASONS_DATA.find((s) => s.id === OPPOSITE_SEASON_MAP[season.id])?.name;

              return (
                <button
                  key={season.id}
                  type="button"
                  onClick={() => handleSelectSeason(season.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-4 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 border-white shadow-xl scale-[1.03] ring-4 ring-amber-400/40'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="text-3xl">{season.emoji}</span>
                    {isVisited && (
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          isSelected ? 'text-emerald-900' : 'text-emerald-400'
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase block tracking-wider ${
                        isSelected ? 'text-amber-950/80' : 'text-indigo-200'
                      }`}
                    >
                      No Sul:
                    </span>
                    <span className="text-base sm:text-lg font-black leading-tight block">
                      {season.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold mt-1 block ${
                        isSelected ? 'text-amber-900' : 'text-slate-300'
                      }`}
                    >
                      (No Norte: {oppositeName})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* BANNER DINÂMICO DE SINCRONIZAÇÃO */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-5 h-5 text-amber-300 shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-white">
              A árvore abaixo está no <strong>{viewHemisphere === 'sul' ? 'Hemisfério Sul (Brasil)' : 'Hemisfério Norte (Portugal)'}</strong> exibindo o <strong>{effectiveSeasonData.name}</strong> ({effectiveSeasonData.emoji})!
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleToggleHemisphereView(viewHemisphere === 'sul' ? 'norte' : 'sul')}
            className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              Ver Árvore no Hemisfério {viewHemisphere === 'sul' ? 'Norte 🇵🇹' : 'Sul 🇧🇷'}
            </span>
          </button>
        </div>
      </div>

      {/* SEÇÃO 1: SIMULAÇÃO BOTÂNICA 60 FPS DA ÁRVORE DAS ESTAÇÕES */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <TreePine className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-3 py-0.5 rounded-full inline-block mb-1">
                Laboratório Vivo da Natureza · Visão: {viewHemisphere === 'sul' ? 'Hemisfério Sul' : 'Hemisfério Norte'}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                A Árvore Viva: Nascimento, Maturidade, Envelhecimento e Queda
              </h3>
            </div>
          </div>

          <AudioButton
            text={`Observa a árvore sob o clima de ${effectiveSeasonData.name} no Hemisfério ${viewHemisphere === 'sul' ? 'Sul' : 'Norte'}. Na primavera nascem brotos e flores; no verão a copa tem folhas verdes exuberantes; no outono as folhas amarelam e caem suavemente com o vento; e no inverno a árvore descansa desprovida de folhas.`}
            label="Ouvir explicação da árvore"
            size="sm"
          />
        </div>

        {/* Componente da Árvore Botânica com 60 FPS Canvas & SVG */}
        <SeasonTreeInteractive
          selectedSeason={currentTreeSeason}
          onSelectSeason={handleTreeSeasonChange}
          largeTextMode={largeTextMode}
        />
      </div>

      {/* SEÇÃO 2: DOSSIÊ ECOLÓGICO E CLIMÁTICO DA ESTAÇÃO */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-xs uppercase tracking-wider">
              Ecologia e Vida Cotidiana
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              Como o {effectiveSeasonData.name} ({effectiveSeasonData.emoji}) afeta a vida no planeta?
            </h3>
          </div>
          <span className="text-3xl p-2 rounded-2xl bg-indigo-50 border border-indigo-200">
            {effectiveEcoData.floraEmoji}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Clima e Raios Solares */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wide">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <span>Temperatura & Calor</span>
            </div>
            <div className="text-lg font-black text-amber-950">
              {effectiveEcoData.tempRange}
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              {effectiveEcoData.sunAngleText}
            </p>
          </div>

          {/* Card 2: Plantas e Florestas */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wide">
              <TreePine className="w-4 h-4 text-emerald-600" />
              <span>Flora & Vegetação</span>
            </div>
            <div className="text-lg font-black text-emerald-950 flex items-center gap-1.5">
              <span>{effectiveEcoData.floraEmoji}</span>
              <span>Ciclo das Plantas</span>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              {effectiveEcoData.floraDetails}
            </p>
          </div>

          {/* Card 3: Animais & Pessoas */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 border-2 border-sky-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-800 font-extrabold text-xs uppercase tracking-wide">
              <Bird className="w-4 h-4 text-sky-600" />
              <span>Fauna & Seres Humanos</span>
            </div>
            <div className="text-lg font-black text-indigo-950 flex items-center gap-1.5">
              <span>{effectiveEcoData.animalEmoji}</span>
              <span>{effectiveEcoData.clothingEmoji}</span>
              <span>Comportamento</span>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              <strong>Animais:</strong> {effectiveEcoData.faunaDetails}
              <br />
              <strong>Pessoas:</strong> {effectiveEcoData.humanLife}
            </p>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: O ESPELHO PLANETÁRIO LADO A LADO (SUL vs NORTE) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-500/40 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 font-black text-xs uppercase tracking-wider border border-indigo-400/40">
              O Espelho Simultâneo dos Hemisférios
            </span>
            <h3 className="text-2xl font-black text-white mt-1.5">
              Dois lados do mesmo planeta no mesmo dia do ano!
            </h3>
          </div>
          <AudioButton
            text="Quando é verão no Brasil com praia e calor de trinta graus, no mesmo instante na Europa e América do Norte é inverno rigoroso com neve e casacos grossos! Nunca te esqueças: as estações são sempre opostas."
            label="Ouvir sobre as estações opostas"
            size="sm"
          />
        </div>

        {/* Comparação Lado a Lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cartão Hemisfério Sul */}
          <div
            className={`rounded-3xl p-6 border-4 transition-all ${
              viewHemisphere === 'sul'
                ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-400 shadow-xl ring-2 ring-emerald-400/50'
                : 'bg-white/5 border-white/20 opacity-85'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-400/30 flex items-center gap-1.5">
                <span>👇</span>
                <span>Hemisfério Sul (ex: Brasil)</span>
              </span>
              <span className="text-3xl">{southSeason.emoji}</span>
            </div>

            <h4 className="text-3xl font-black text-white">{southSeason.name}</h4>
            <p className="text-xs text-slate-300 mt-1 mb-4">{southSeason.shortDesc}</p>

            <div className="space-y-2.5 text-xs border-t border-white/10 pt-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Sun className="w-4 h-4 shrink-0" />
                <span><strong>Raios de Sol:</strong> {southSeason.sunRays}</span>
              </div>
              <div className="flex items-center gap-2 text-sky-200">
                <CloudSun className="w-4 h-4 shrink-0" />
                <span><strong>Clima:</strong> {southSeason.climate}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <Clock className="w-4 h-4 shrink-0" />
                <span><strong>Dias e Noites:</strong> {southSeason.dayNight}</span>
              </div>
            </div>
          </div>

          {/* Cartão Hemisfério Norte (Oposto!) */}
          <div
            className={`rounded-3xl p-6 border-4 transition-all ${
              viewHemisphere === 'norte'
                ? 'bg-gradient-to-br from-purple-950/80 to-slate-900 border-purple-400 shadow-xl ring-2 ring-purple-400/50'
                : 'bg-white/5 border-white/20 opacity-85'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-black text-xs border border-purple-400/30 flex items-center gap-1.5">
                <span>👆</span>
                <span>Hemisfério Norte (ex: Portugal/Europa)</span>
              </span>
              <span className="text-3xl">{northSeason.emoji}</span>
            </div>

            <h4 className="text-3xl font-black text-white">{northSeason.name}</h4>
            <p className="text-xs text-slate-300 mt-1 mb-4">{northSeason.shortDesc}</p>

            <div className="space-y-2.5 text-xs border-t border-white/10 pt-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Sun className="w-4 h-4 shrink-0" />
                <span><strong>Raios de Sol:</strong> {northSeason.sunRays}</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <CloudSun className="w-4 h-4 shrink-0" />
                <span><strong>Clima:</strong> {northSeason.climate}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <Clock className="w-4 h-4 shrink-0" />
                <span><strong>Dias e Noites:</strong> {northSeason.dayNight}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé explicativo com glossário */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <p className="text-indigo-100">
            Enquanto no Sul é <strong>{southSeason.name}</strong> ({southSeason.emoji}), no Norte é simultaneamente <strong>{northSeason.name}</strong> ({northSeason.emoji}).
          </p>

          <button
            type="button"
            onClick={() => openGlossary('hemisferio')}
            className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Consultar Termo: Hemisfério</span>
          </button>
        </div>
      </div>

      {/* SEÇÃO 4: O DESAFIO DO ESPELHO PLANETÁRIO (MINI-QUIZ RECOMPENSADOR) */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200 px-3 py-0.5 rounded-full inline-block mb-1">
                Desafio Interativo
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                O Grande Teste do Espelho Planetário
              </h3>
            </div>
          </div>

          <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-amber-200 text-amber-900">
            Pergunta {currentQuizIndex + 1} de {QUIZ_QUESTIONS.length}
          </span>
        </div>

        {/* Card da Pergunta Atual */}
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <h4 className="text-lg font-black text-slate-900 leading-snug">
            {QUIZ_QUESTIONS[currentQuizIndex].question}
          </h4>

          <div className="space-y-2.5">
            {QUIZ_QUESTIONS[currentQuizIndex].options.map((option, idx) => {
              const isSelected = selectedQuizOption === idx;
              const hasAnswered = selectedQuizOption !== null;

              let btnStyle = 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 text-slate-800';
              if (hasAnswered) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-md';
                } else if (isSelected && !option.isCorrect) {
                  btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleAnswerQuiz(idx)}
                  className={`w-full p-4 rounded-xl border-3 text-left transition-all text-sm sm:text-base cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    {hasAnswered && option.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback e Botão Avançar */}
          {selectedQuizOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs sm:text-sm space-y-3"
            >
              <p className="font-semibold leading-relaxed">
                {QUIZ_QUESTIONS[currentQuizIndex].explanation}
              </p>

              <button
                type="button"
                onClick={handleNextQuizQuestion}
                className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xs sm:text-sm transition-transform hover:scale-105 cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>
                  {currentQuizIndex < QUIZ_QUESTIONS.length - 1
                    ? 'Próxima Pergunta ➡️'
                    : 'Concluir Desafio 🏆'}
                </span>
              </button>
            </motion.div>
          )}

          {/* Celebração final de conclusão */}
          {showQuizCelebration && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-2 shadow-lg"
            >
              <div className="text-4xl">🎉 🌟 👑</div>
              <h5 className="text-xl font-black">
                Mestre das Estações Desbloqueado!
              </h5>
              <p className="text-xs sm:text-sm text-emerald-100">
                Compreendeste na perfeição o espelho planetário e o ciclo botânico da Terra!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
