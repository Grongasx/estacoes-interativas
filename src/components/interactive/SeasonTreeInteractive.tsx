// src/components/interactive/SeasonTreeInteractive.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Wind, Sparkles, MousePointerClick } from 'lucide-react';

export type SeasonType = 'summer' | 'autumn' | 'winter' | 'spring';

interface SeasonTreeProps {
  selectedSeason: SeasonType;
  onSelectSeason: (season: SeasonType) => void;
  largeTextMode?: boolean;
}

// Interface de partícula para o Canvas de alta performance (60 FPS)
interface CanvasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  vAngle: number;
  flip: number;
  vFlip: number;
  wobble: number;
  vWobble: number;
  type: 'leaf' | 'snow' | 'petal' | 'burstLeaf' | 'pollen';
  colorStart: string;
  colorEnd: string;
  opacity: number;
  depth: number;
}

// Folhas botânicas individuais na copa com posições e atrasos orgânicos determinísticos (Zero Hydration Mismatch)
interface DetailedTreeLeaf {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  growthDelay: number;
  springColor: string;
  summerColor: string;
  autumnColor: string;
}

// Paletas de cores ricas para as folhas
const SPRING_GREENS = ['#86efac', '#4ade80', '#a7f3d0', '#6ee7b7', '#bbf7d0'];
const SUMMER_GREENS = ['#15803d', '#16a34a', '#166534', '#14532d', '#22c55e'];
const AUTUMN_COLORS = ['#dc2626', '#ea580c', '#f97316', '#facc15', '#c2410c', '#b45309', '#d97706'];

const AUTUMN_FALLING_PAIRS = [
  { start: '#dc2626', end: '#f97316' },
  { start: '#ea580c', end: '#facc15' },
  { start: '#b45309', end: '#fb923c' },
  { start: '#991b1b', end: '#f59e0b' },
  { start: '#c2410c', end: '#fde047' },
];

// Geração determinística de 74 folhas botânicas detalhadas cobrindo a copa nos galhos
const TREE_LEAVES_DATA: DetailedTreeLeaf[] = [
  // Topo da Copa
  { id: 1, x: 450, y: 90, angle: -90, scale: 1.05, growthDelay: 0.1, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[0] },
  { id: 2, x: 430, y: 105, angle: -110, scale: 0.95, growthDelay: 0.3, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[1] },
  { id: 3, x: 470, y: 100, angle: -70, scale: 1.0, growthDelay: 0.2, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[2] },
  { id: 4, x: 410, y: 120, angle: -125, scale: 1.1, growthDelay: 0.5, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[3] },
  { id: 5, x: 490, y: 115, angle: -55, scale: 1.05, growthDelay: 0.4, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[4] },
  { id: 6, x: 445, y: 130, angle: -85, scale: 1.15, growthDelay: 0.2, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[5] },
  { id: 7, x: 385, y: 135, angle: -140, scale: 0.95, growthDelay: 0.7, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[6] },
  { id: 8, x: 515, y: 130, angle: -40, scale: 1.0, growthDelay: 0.6, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[0] },

  // Ramos Esquerdo Superior
  { id: 9, x: 350, y: 150, angle: -130, scale: 1.1, growthDelay: 0.8, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[1] },
  { id: 10, x: 320, y: 140, angle: -150, scale: 1.0, growthDelay: 1.0, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[2] },
  { id: 11, x: 295, y: 160, angle: -165, scale: 1.15, growthDelay: 1.2, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[3] },
  { id: 12, x: 270, y: 175, angle: -175, scale: 1.05, growthDelay: 1.4, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[4] },
  { id: 13, x: 250, y: 200, angle: -160, scale: 1.1, growthDelay: 1.5, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[5] },
  { id: 14, x: 310, y: 180, angle: -125, scale: 0.95, growthDelay: 0.9, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[6] },
  { id: 15, x: 335, y: 195, angle: -110, scale: 1.05, growthDelay: 0.7, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[0] },
  { id: 16, x: 280, y: 215, angle: -145, scale: 1.0, growthDelay: 1.3, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[1] },

  // Ramos Esquerdo Médio e Inferior
  { id: 17, x: 230, y: 220, angle: -170, scale: 1.15, growthDelay: 1.6, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[2] },
  { id: 18, x: 210, y: 245, angle: -155, scale: 1.05, growthDelay: 1.8, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[3] },
  { id: 19, x: 190, y: 270, angle: -145, scale: 1.2, growthDelay: 1.9, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[4] },
  { id: 20, x: 225, y: 280, angle: -130, scale: 1.0, growthDelay: 1.7, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[5] },
  { id: 21, x: 255, y: 260, angle: -120, scale: 1.1, growthDelay: 1.4, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[6] },
  { id: 22, x: 285, y: 250, angle: -105, scale: 0.95, growthDelay: 1.1, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[0] },
  { id: 23, x: 170, y: 300, angle: -150, scale: 1.05, growthDelay: 2.0, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[1] },
  { id: 24, x: 195, y: 320, angle: -135, scale: 1.1, growthDelay: 2.1, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[2] },

  // Ramos Direito Superior
  { id: 25, x: 550, y: 145, angle: -50, scale: 1.1, growthDelay: 0.8, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[3] },
  { id: 26, x: 580, y: 135, angle: -30, scale: 1.0, growthDelay: 1.0, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[4] },
  { id: 27, x: 605, y: 155, angle: -15, scale: 1.15, growthDelay: 1.2, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[5] },
  { id: 28, x: 630, y: 170, angle: -5, scale: 1.05, growthDelay: 1.4, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[6] },
  { id: 29, x: 650, y: 195, angle: -20, scale: 1.1, growthDelay: 1.5, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[0] },
  { id: 30, x: 590, y: 175, angle: -55, scale: 0.95, growthDelay: 0.9, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[1] },
  { id: 31, x: 565, y: 190, angle: -70, scale: 1.05, growthDelay: 0.7, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[2] },
  { id: 32, x: 620, y: 210, angle: -35, scale: 1.0, growthDelay: 1.3, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[3] },

  // Ramos Direito Médio e Inferior
  { id: 33, x: 670, y: 215, angle: -10, scale: 1.15, growthDelay: 1.6, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[4] },
  { id: 34, x: 690, y: 240, angle: -25, scale: 1.05, growthDelay: 1.8, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[5] },
  { id: 35, x: 710, y: 265, angle: -35, scale: 1.2, growthDelay: 1.9, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[6] },
  { id: 36, x: 675, y: 275, angle: -50, scale: 1.0, growthDelay: 1.7, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[0] },
  { id: 37, x: 645, y: 255, angle: -60, scale: 1.1, growthDelay: 1.4, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[1] },
  { id: 38, x: 615, y: 245, angle: -75, scale: 0.95, growthDelay: 1.1, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[2] },
  { id: 39, x: 730, y: 295, angle: -30, scale: 1.05, growthDelay: 2.0, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[3] },
  { id: 40, x: 705, y: 315, angle: -45, scale: 1.1, growthDelay: 2.1, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[4] },

  // Ramos Centro-Superior e Coração da Copa
  { id: 41, x: 420, y: 160, angle: -95, scale: 1.15, growthDelay: 0.4, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[5] },
  { id: 42, x: 480, y: 155, angle: -80, scale: 1.1, growthDelay: 0.5, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[6] },
  { id: 43, x: 450, y: 180, angle: -88, scale: 1.2, growthDelay: 0.3, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[0] },
  { id: 44, x: 390, y: 185, angle: -105, scale: 1.05, growthDelay: 0.6, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[1] },
  { id: 45, x: 510, y: 180, angle: -72, scale: 1.05, growthDelay: 0.6, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[2] },
  { id: 46, x: 370, y: 210, angle: -115, scale: 1.1, growthDelay: 0.9, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[3] },
  { id: 47, x: 530, y: 205, angle: -65, scale: 1.1, growthDelay: 0.9, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[4] },
  { id: 48, x: 450, y: 215, angle: -90, scale: 1.25, growthDelay: 0.4, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[5] },
  { id: 49, x: 415, y: 235, angle: -100, scale: 1.05, growthDelay: 0.8, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[6] },
  { id: 50, x: 485, y: 230, angle: -80, scale: 1.05, growthDelay: 0.8, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[0] },

  // Camadas de Volume Central e Preenchimento Botânico
  { id: 51, x: 340, y: 235, angle: -125, scale: 1.0, growthDelay: 1.1, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[1] },
  { id: 52, x: 560, y: 230, angle: -55, scale: 1.0, growthDelay: 1.1, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[2] },
  { id: 53, x: 305, y: 250, angle: -135, scale: 1.1, growthDelay: 1.3, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[3] },
  { id: 54, x: 595, y: 245, angle: -45, scale: 1.1, growthDelay: 1.3, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[4] },
  { id: 55, x: 375, y: 260, angle: -110, scale: 1.05, growthDelay: 1.0, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[5] },
  { id: 56, x: 525, y: 255, angle: -70, scale: 1.05, growthDelay: 1.0, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[6] },
  { id: 57, x: 450, y: 265, angle: -90, scale: 1.15, growthDelay: 0.5, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[0] },
  { id: 58, x: 410, y: 285, angle: -105, scale: 1.0, growthDelay: 1.2, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[1] },
  { id: 59, x: 490, y: 280, angle: -75, scale: 1.0, growthDelay: 1.2, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[2] },
  { id: 60, x: 350, y: 285, angle: -120, scale: 1.05, growthDelay: 1.5, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[3] },
  { id: 61, x: 550, y: 280, angle: -60, scale: 1.05, growthDelay: 1.5, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[4] },
  { id: 62, x: 450, y: 310, angle: -90, scale: 1.1, growthDelay: 0.7, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[5] },

  // Folhagem Periférica e Pontas de Ramos
  { id: 63, x: 360, y: 110, angle: -135, scale: 0.9, growthDelay: 0.6, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[6] },
  { id: 64, x: 540, y: 105, angle: -45, scale: 0.9, growthDelay: 0.6, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[0] },
  { id: 65, x: 400, y: 80, angle: -120, scale: 0.95, growthDelay: 0.3, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[1] },
  { id: 66, x: 500, y: 75, angle: -60, scale: 0.95, growthDelay: 0.3, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[2] },
  { id: 67, x: 280, y: 130, angle: -160, scale: 1.0, growthDelay: 1.1, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[3] },
  { id: 68, x: 620, y: 125, angle: -20, scale: 1.0, growthDelay: 1.1, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[4] },
  { id: 69, x: 230, y: 170, angle: -165, scale: 1.05, growthDelay: 1.6, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[5] },
  { id: 70, x: 670, y: 165, angle: -15, scale: 1.05, growthDelay: 1.6, springColor: SPRING_GREENS[4], summerColor: SUMMER_GREENS[4], autumnColor: AUTUMN_COLORS[6] },
  { id: 71, x: 160, y: 240, angle: -160, scale: 1.1, growthDelay: 2.0, springColor: SPRING_GREENS[0], summerColor: SUMMER_GREENS[0], autumnColor: AUTUMN_COLORS[0] },
  { id: 72, x: 740, y: 235, angle: -20, scale: 1.1, growthDelay: 2.0, springColor: SPRING_GREENS[1], summerColor: SUMMER_GREENS[1], autumnColor: AUTUMN_COLORS[1] },
  { id: 73, x: 140, y: 280, angle: -150, scale: 1.0, growthDelay: 2.2, springColor: SPRING_GREENS[2], summerColor: SUMMER_GREENS[2], autumnColor: AUTUMN_COLORS[2] },
  { id: 74, x: 760, y: 275, angle: -30, scale: 1.0, growthDelay: 2.2, springColor: SPRING_GREENS[3], summerColor: SUMMER_GREENS[3], autumnColor: AUTUMN_COLORS[3] },
];

// Flores primaveris de cerejeira (sakura) com pétalas desabrochando
const SPRING_BLOSSOMS = [
  { x: 440, y: 110, s: 1.1, delay: 0.2 },
  { x: 480, y: 125, s: 1.0, delay: 0.4 },
  { x: 370, y: 160, s: 1.2, delay: 0.3 },
  { x: 530, y: 155, s: 1.15, delay: 0.5 },
  { x: 310, y: 180, s: 1.0, delay: 0.7 },
  { x: 590, y: 175, s: 1.2, delay: 0.6 },
  { x: 250, y: 230, s: 1.1, delay: 0.9 },
  { x: 650, y: 225, s: 1.1, delay: 0.8 },
  { x: 200, y: 280, s: 1.0, delay: 1.1 },
  { x: 700, y: 275, s: 1.0, delay: 1.0 },
  { x: 410, y: 210, s: 1.25, delay: 0.3 },
  { x: 490, y: 205, s: 1.15, delay: 0.4 },
  { x: 360, y: 250, s: 1.0, delay: 0.6 },
  { x: 540, y: 245, s: 1.05, delay: 0.7 },
  { x: 450, y: 150, s: 1.3, delay: 0.1 },
  { x: 450, y: 260, s: 1.1, delay: 0.5 },
];

// Estrelas fixas determinísticas para a noite de Inverno
const WINTER_STARS = [
  { cx: 90, cy: 70, r: 1.8, opacity: 0.9 },
  { cx: 165, cy: 110, r: 1.2, opacity: 0.6 },
  { cx: 240, cy: 60, r: 2.2, opacity: 0.95 },
  { cx: 330, cy: 85, r: 1.5, opacity: 0.7 },
  { cx: 580, cy: 65, r: 2.0, opacity: 0.85 },
  { cx: 670, cy: 95, r: 1.4, opacity: 0.65 },
  { cx: 740, cy: 55, r: 2.3, opacity: 0.9 },
  { cx: 830, cy: 120, r: 1.6, opacity: 0.75 },
  { cx: 120, cy: 170, r: 1.3, opacity: 0.5 },
  { cx: 790, cy: 180, r: 1.5, opacity: 0.6 },
];

// Pingentes de gelo (icicles) nos galhos durante o Inverno
const WINTER_ICICLES = [
  { x: 260, y: 182, len: 18 },
  { x: 295, y: 202, len: 24 },
  { x: 345, y: 282, len: 20 },
  { x: 280, y: 308, len: 16 },
  { x: 555, y: 205, len: 22 },
  { x: 610, y: 178, len: 19 },
  { x: 575, y: 310, len: 25 },
  { x: 620, y: 320, len: 17 },
  { x: 430, y: 255, len: 21 },
  { x: 470, y: 255, len: 18 },
];

export const SeasonTreeInteractive: React.FC<SeasonTreeProps> = ({
  selectedSeason,
  onSelectSeason,
  largeTextMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<CanvasParticle[]>([]);
  const prevSeasonRef = useRef<SeasonType>(selectedSeason);

  // Estados de Interação e Simulação
  const [isSimulating, setIsSimulating] = useState(false);
  const [windBoost, setWindBoost] = useState(0);
  const [treeSway, setTreeSway] = useState(false);
  const windBoostRef = useRef(0);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedSeasonRef = useRef(selectedSeason);
  useEffect(() => {
    selectedSeasonRef.current = selectedSeason;
  }, [selectedSeason]);

  useEffect(() => {
    windBoostRef.current = windBoost;
  }, [windBoost]);

  // Alterna modo de simulação gravada contínua (Primavera -> Verão -> Outono -> Inverno -> Primavera...)
  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  useEffect(() => {
    if (!isSimulating) {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      return;
    }

    const seasonsOrder: SeasonType[] = ['spring', 'summer', 'autumn', 'winter'];
    simIntervalRef.current = setInterval(() => {
      const currentIndex = seasonsOrder.indexOf(selectedSeasonRef.current);
      const nextIndex = (currentIndex + 1) % seasonsOrder.length;
      onSelectSeason(seasonsOrder[nextIndex]);
    }, 4500);

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [isSimulating, onSelectSeason]);

  // Função Canvas para desenhar folha botânica com nervuras e degradê
  const drawDetailedLeafOnCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      flip: number,
      colorStart: string,
      colorEnd: string,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const scaleX = Math.cos(flip);
      ctx.scale(Math.abs(scaleX) < 0.12 ? 0.12 : scaleX, 1);
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      const grad = ctx.createRadialGradient(0, size * 0.4, 1, 0, -size * 0.3, size * 1.2);
      grad.addColorStop(0, colorStart);
      grad.addColorStop(0.6, colorEnd);
      grad.addColorStop(1, '#fef08a');

      ctx.fillStyle = grad;
      ctx.beginPath();
      // Formato lanceado com pontas lobadas (Bordo/Carvalho)
      ctx.moveTo(0, size * 0.55);
      ctx.bezierCurveTo(-size * 0.35, size * 0.35, -size * 0.45, size * 0.15, -size * 0.4, 0);
      ctx.bezierCurveTo(-size * 0.6, -size * 0.1, -size * 0.65, -size * 0.35, -size * 0.35, -size * 0.45);
      ctx.bezierCurveTo(-size * 0.25, -size * 0.6, -size * 0.15, -size * 0.75, 0, -size * 0.95);
      ctx.bezierCurveTo(size * 0.15, -size * 0.75, size * 0.25, -size * 0.6, size * 0.35, -size * 0.45);
      ctx.bezierCurveTo(size * 0.65, -size * 0.35, size * 0.6, -size * 0.1, size * 0.4, 0);
      ctx.bezierCurveTo(size * 0.45, size * 0.15, size * 0.35, size * 0.35, 0, size * 0.55);
      ctx.closePath();
      ctx.fill();

      // Haste e Nervuras
      ctx.shadowColor = 'transparent';
      ctx.beginPath();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = Math.max(1, size * 0.08);
      ctx.lineCap = 'round';
      ctx.moveTo(0, size * 0.5);
      ctx.lineTo(0, size * 0.85);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
      ctx.lineWidth = Math.max(0.8, size * 0.06);
      ctx.moveTo(0, size * 0.5);
      ctx.lineTo(0, -size * 0.75);
      // Nervuras secundárias
      ctx.moveTo(0, size * 0.25);
      ctx.lineTo(-size * 0.3, size * 0.05);
      ctx.moveTo(0, 0);
      ctx.lineTo(-size * 0.35, -size * 0.25);
      ctx.moveTo(0, size * 0.25);
      ctx.lineTo(size * 0.3, size * 0.05);
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.35, -size * 0.25);
      ctx.stroke();

      ctx.restore();
    },
    []
  );

  // Desenho de pétala de cerejeira (sakura)
  const drawSakuraPetalOnCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      flip: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const scaleX = Math.cos(flip);
      ctx.scale(Math.abs(scaleX) < 0.12 ? 0.12 : scaleX, 1);
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

      const grad = ctx.createRadialGradient(0, size * 0.2, 0, 0, -size * 0.2, size * 0.9);
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(0.35, '#fb7185');
      grad.addColorStop(0.75, '#fbcfe8');
      grad.addColorStop(1, '#ffffff');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.55);
      ctx.bezierCurveTo(-size * 0.45, size * 0.2, -size * 0.45, -size * 0.35, -size * 0.15, -size * 0.55);
      ctx.lineTo(0, -size * 0.42);
      ctx.lineTo(size * 0.15, -size * 0.55);
      ctx.bezierCurveTo(size * 0.45, -size * 0.35, size * 0.45, size * 0.2, 0, size * 0.55);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    },
    []
  );

  // Raios Solares Volumétricos de Verão (God Rays) com Degradê Suave
  const drawVolumetricSunRays = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      const sunX = width * 0.14;
      const sunY = height * 0.16;

      ctx.save();

      // Corona Solar Difusa
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, width * 0.65);
      sunGlow.addColorStop(0, 'rgba(255, 255, 230, 0.9)');
      sunGlow.addColorStop(0.12, 'rgba(254, 240, 138, 0.55)');
      sunGlow.addColorStop(0.35, 'rgba(251, 191, 36, 0.22)');
      sunGlow.addColorStop(0.65, 'rgba(249, 115, 22, 0.06)');
      sunGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, height);

      // Feixes de Luz Volumétricos (God Rays)
      const baseAngles = [0.35, 0.52, 0.68, 0.85, 1.02, 1.18, 1.35];
      const beamLength = width * 1.4;

      baseAngles.forEach((baseAngle, i) => {
        const wave = Math.sin(time * 0.0012 + i * 1.3) * 0.04;
        const currentAngle = baseAngle + wave;
        const spread = 0.07 + Math.sin(time * 0.0008 + i * 2) * 0.02;

        const x1 = sunX + Math.cos(currentAngle - spread) * beamLength;
        const y1 = sunY + Math.sin(currentAngle - spread) * beamLength;
        const x2 = sunX + Math.cos(currentAngle + spread) * beamLength;
        const y2 = sunY + Math.sin(currentAngle + spread) * beamLength;

        const targetCenterX = sunX + Math.cos(currentAngle) * beamLength;
        const targetCenterY = sunY + Math.sin(currentAngle) * beamLength;
        const rayGrad = ctx.createLinearGradient(sunX, sunY, targetCenterX, targetCenterY);

        const pulseOpacity = 0.22 + Math.sin(time * 0.0015 + i * 0.8) * 0.08;
        rayGrad.addColorStop(0, `rgba(255, 255, 235, ${pulseOpacity})`);
        rayGrad.addColorStop(0.25, `rgba(254, 240, 138, ${pulseOpacity * 0.75})`);
        rayGrad.addColorStop(0.65, `rgba(251, 191, 36, ${pulseOpacity * 0.3})`);
        rayGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
      });

      // Partículas de Pólen e Luz Solar Dourada Flutuando no Verão
      for (let j = 0; j < 28; j++) {
        const moteTime = time * 0.0006 + j * 123.45;
        const mx = (Math.sin(moteTime * 1.3) * 0.5 + 0.5) * (width * 0.78) + width * 0.1;
        const my = (Math.cos(moteTime * 0.9) * 0.5 + 0.5) * (height * 0.7) + height * 0.1;
        const mSize = 1.5 + Math.sin(moteTime * 3) * 0.9;
        const mAlpha = 0.35 + Math.sin(moteTime * 4) * 0.3;

        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 210, ${mAlpha})`;
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(mx, my, mSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    },
    []
  );

  // Queda súbita de folhas quando o Inverno é acionado (morte e desprendimento sazonal)
  const triggerWinterLeafBurst = useCallback((width: number, height: number) => {
    const burstParticles: CanvasParticle[] = [];
    const canopyCenterX = width * 0.5;
    const canopyCenterY = height * 0.38;

    for (let i = 0; i < 60; i++) {
      const offsetX = (Math.random() - 0.5) * (width * 0.55);
      const offsetY = (Math.random() - 0.5) * (height * 0.35);
      const colorPair = AUTUMN_FALLING_PAIRS[Math.floor(Math.random() * AUTUMN_FALLING_PAIRS.length)];

      burstParticles.push({
        x: canopyCenterX + offsetX,
        y: canopyCenterY + offsetY,
        vx: (Math.random() - 0.3) * 3.2 + 1.2,
        vy: 2.8 + Math.random() * 4.5,
        size: 14 + Math.random() * 11,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.14,
        flip: Math.random() * Math.PI,
        vFlip: 0.05 + Math.random() * 0.08,
        wobble: Math.random() * Math.PI * 2,
        vWobble: 0.05 + Math.random() * 0.06,
        type: 'burstLeaf',
        colorStart: colorPair.start,
        colorEnd: colorPair.end,
        opacity: 1,
        depth: 1,
      });
    }

    particlesRef.current = [...particlesRef.current, ...burstParticles];
  }, []);

  // Dispara rajada interativa quando a criança clica na árvore ou no botão de vento
  const triggerInteractiveGust = useCallback(
    (clickX?: number, clickY?: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const originX = clickX ?? rect.width * 0.5;
      const originY = clickY ?? rect.height * 0.38;

      setTreeSway(true);
      setWindBoost(4.2);
      setTimeout(() => setTreeSway(false), 700);
      setTimeout(() => setWindBoost(0), 1800);

      const extra: CanvasParticle[] = [];
      const count = 18;

      for (let i = 0; i < count; i++) {
        const spreadX = (Math.random() - 0.5) * 120;
        const spreadY = (Math.random() - 0.5) * 80;

        if (selectedSeason === 'autumn') {
          const pair = AUTUMN_FALLING_PAIRS[i % AUTUMN_FALLING_PAIRS.length];
          extra.push({
            x: originX + spreadX,
            y: originY + spreadY,
            vx: 2.5 + Math.random() * 3.5,
            vy: 1.8 + Math.random() * 2.8,
            size: 14 + Math.random() * 10,
            angle: Math.random() * Math.PI * 2,
            vAngle: (Math.random() - 0.5) * 0.15,
            flip: Math.random() * Math.PI,
            vFlip: 0.06 + Math.random() * 0.08,
            wobble: Math.random() * Math.PI * 2,
            vWobble: 0.05,
            type: 'burstLeaf',
            colorStart: pair.start,
            colorEnd: pair.end,
            opacity: 1,
            depth: 2,
          });
        } else if (selectedSeason === 'spring') {
          extra.push({
            x: originX + spreadX,
            y: originY + spreadY,
            vx: 2.2 + Math.random() * 3.0,
            vy: 1.2 + Math.random() * 2.2,
            size: 10 + Math.random() * 6,
            angle: Math.random() * Math.PI * 2,
            vAngle: (Math.random() - 0.5) * 0.12,
            flip: Math.random() * Math.PI,
            vFlip: 0.06 + Math.random() * 0.07,
            wobble: Math.random() * Math.PI * 2,
            vWobble: 0.05,
            type: 'petal',
            colorStart: '#f43f5e',
            colorEnd: '#fbcfe8',
            opacity: 1,
            depth: 2,
          });
        } else if (selectedSeason === 'summer') {
          extra.push({
            x: originX + spreadX,
            y: originY + spreadY,
            vx: 1.8 + Math.random() * 2.5,
            vy: 1.5 + Math.random() * 2.2,
            size: 13 + Math.random() * 8,
            angle: Math.random() * Math.PI * 2,
            vAngle: (Math.random() - 0.5) * 0.1,
            flip: Math.random() * Math.PI,
            vFlip: 0.05,
            wobble: Math.random() * Math.PI * 2,
            vWobble: 0.04,
            type: 'burstLeaf',
            colorStart: '#15803d',
            colorEnd: '#4ade80',
            opacity: 1,
            depth: 2,
          });
        } else if (selectedSeason === 'winter') {
          extra.push({
            x: originX + spreadX,
            y: originY + spreadY,
            vx: 2.0 + Math.random() * 3.0,
            vy: 2.0 + Math.random() * 3.0,
            size: 3.5 + Math.random() * 2.5,
            angle: 0,
            vAngle: 0,
            flip: 0,
            vFlip: 0,
            wobble: Math.random() * Math.PI * 2,
            vWobble: 0.04,
            type: 'snow',
            colorStart: '#ffffff',
            colorEnd: '#e0f2fe',
            opacity: 0.95,
            depth: 2,
          });
        }
      }

      particlesRef.current = [...particlesRef.current, ...extra];
    },
    [selectedSeason]
  );

  // Sincroniza partículas contínuas conforme a estação ativa
  const syncParticles = useCallback((season: SeasonType, width: number, height: number) => {
    const existing = particlesRef.current.filter((p) => p.type === 'burstLeaf');
    const nextParticles: CanvasParticle[] = [...existing];

    if (season === 'autumn') {
      const numLeaves = 26;
      for (let i = 0; i < numLeaves; i++) {
        const colorPair = AUTUMN_FALLING_PAIRS[i % AUTUMN_FALLING_PAIRS.length];
        nextParticles.push({
          x: Math.random() * width,
          y: Math.random() * height - height * 0.2,
          vx: 0.8 + Math.random() * 1.8,
          vy: 1.2 + Math.random() * 2.0,
          size: 14 + Math.random() * 11,
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 0.07,
          flip: Math.random() * Math.PI,
          vFlip: 0.03 + Math.random() * 0.05,
          wobble: Math.random() * Math.PI * 2,
          vWobble: 0.03 + Math.random() * 0.04,
          type: 'leaf',
          colorStart: colorPair.start,
          colorEnd: colorPair.end,
          opacity: 0.85 + Math.random() * 0.15,
          depth: i % 3,
        });
      }
    } else if (season === 'winter') {
      const numSnowflakes = 95;
      for (let i = 0; i < numSnowflakes; i++) {
        const depth = i % 3;
        const size = depth === 0 ? 1.8 : depth === 1 ? 3.0 : 4.2;
        const speed = depth === 0 ? 0.9 : depth === 1 ? 1.7 : 2.7;

        nextParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0.5 + Math.random() * 0.9,
          vy: speed + Math.random() * 0.8,
          size,
          angle: 0,
          vAngle: 0,
          flip: 0,
          vFlip: 0,
          wobble: Math.random() * Math.PI * 2,
          vWobble: 0.02 + Math.random() * 0.03,
          type: 'snow',
          colorStart: '#ffffff',
          colorEnd: '#ffffff',
          opacity: depth === 0 ? 0.45 : depth === 1 ? 0.75 : 0.95,
          depth,
        });
      }
    } else if (season === 'spring') {
      const numPetals = 30;
      for (let i = 0; i < numPetals; i++) {
        nextParticles.push({
          x: Math.random() * width,
          y: Math.random() * height - height * 0.2,
          vx: 1.2 + Math.random() * 1.6,
          vy: 0.9 + Math.random() * 1.5,
          size: 9 + Math.random() * 7,
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 0.08,
          flip: Math.random() * Math.PI,
          vFlip: 0.04 + Math.random() * 0.06,
          wobble: Math.random() * Math.PI * 2,
          vWobble: 0.04 + Math.random() * 0.05,
          type: 'petal',
          colorStart: '#f43f5e',
          colorEnd: '#fbcfe8',
          opacity: 0.85 + Math.random() * 0.15,
          depth: i % 3,
        });
      }
    }

    particlesRef.current = nextParticles;
  }, []);

  // Reage à mudança de estação usando coordenadas CSS reais do container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    if (selectedSeason === 'winter' && prevSeasonRef.current !== 'winter') {
      triggerWinterLeafBurst(rect.width, rect.height);
    }
    prevSeasonRef.current = selectedSeason;
    syncParticles(selectedSeason, rect.width, rect.height);
  }, [selectedSeason, syncParticles, triggerWinterLeafBurst]);

  // Loop de Renderização no Canvas (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      syncParticles(selectedSeason, rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const startTime = performance.now();

    const renderLoop = (now: number) => {
      const elapsed = now - startTime;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Verão: feixes de sol volumétricos com degradês suaves
      if (selectedSeason === 'summer') {
        drawVolumetricSunRays(ctx, width, height, elapsed);
      }

      const particles = particlesRef.current;
      const extraWind = windBoostRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.wobble += p.vWobble;
        p.angle += p.vAngle + extraWind * 0.015;
        p.flip += p.vFlip + extraWind * 0.02;

        const windDrift = Math.sin(p.wobble) * 1.5 + extraWind;
        p.x += p.vx + windDrift;
        p.y += p.vy;

        if (p.type === 'leaf' || p.type === 'burstLeaf') {
          drawDetailedLeafOnCanvas(
            ctx,
            p.x,
            p.y,
            p.size,
            p.angle,
            p.flip,
            p.colorStart,
            p.colorEnd,
            p.opacity
          );

          if (p.type === 'burstLeaf' && p.y > height * 0.85) {
            p.opacity -= 0.025;
            if (p.opacity <= 0) {
              particles.splice(i, 1);
              continue;
            }
          }
        } else if (p.type === 'snow') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          if (p.depth === 2) {
            ctx.shadowColor = 'rgba(224, 242, 254, 0.9)';
            ctx.shadowBlur = 6;
          }
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'petal') {
          drawSakuraPetalOnCanvas(ctx, p.x, p.y, p.size, p.angle, p.flip, p.opacity);
        }

        if (p.type !== 'burstLeaf') {
          if (p.y > height + 25) {
            p.y = -25;
            p.x = Math.random() * width;
          }
          if (p.x > width + 25) {
            p.x = -25;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedSeason, drawDetailedLeafOnCanvas, drawSakuraPetalOnCanvas, drawVolumetricSunRays, syncParticles]);

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    triggerInteractiveGust(clickX, clickY);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Controle de Simulação e Interação de Vento */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-100/90 via-teal-100/80 to-indigo-100/90 border-2 border-emerald-300 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleSimulation}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm transition-all cursor-pointer border-b-4 active:border-b-0 active:translate-y-1 ${isSimulating
                ? 'bg-rose-600 hover:bg-rose-500 border-rose-800 text-white ring-4 ring-rose-300/40 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white ring-4 ring-emerald-300/40 hover:scale-105'
              }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Pausar Simulação do Ciclo' : '▶ Assistir Ciclo Completo'}</span>
          </button>

          <button
            type="button"
            onClick={() => triggerInteractiveGust()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-sm bg-sky-500 hover:bg-sky-400 text-white border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm"
          >
            <Wind className="w-4 h-4" />
            <span>Soprar Vento!</span>
          </button>
        </div>

        {/* Indicador do Estágio Biológico */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 border border-slate-300 text-xs font-extrabold text-slate-800 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {selectedSeason === 'spring' && '🌱 Fase 1: Nascimento & Brotação Lenta das Folhas'}
            {selectedSeason === 'summer' && '☀️ Fase 2: Plenitude & Máxima Fotossíntese'}
            {selectedSeason === 'autumn' && '🍂 Fase 3: Envelhecimento, Amarelamento & Queda'}
            {selectedSeason === 'winter' && '❄️ Fase 4: Dormência Sazonal & Árvore Nua Protegida'}
          </span>
        </div>
      </div>

      {/* 4 Botões Seletores das Estações (Estilo Tátil 3D) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => {
            setIsSimulating(false);
            onSelectSeason('summer');
          }}
          className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex flex-col justify-between text-left cursor-pointer active:translate-y-1 ${selectedSeason === 'summer'
              ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white border-amber-600 shadow-xl scale-105 ring-4 ring-amber-300/40'
              : 'bg-white/90 hover:bg-white text-slate-800 border-amber-200 border-b-amber-300 hover:scale-105 hover:shadow-md'
            }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-4xl">☀️</span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${selectedSeason === 'summer' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
                }`}
            >
              Vigor Máximo
            </span>
          </div>
          <div>
            <h4 className="text-lg font-black">1. Verão</h4>
            <p className={`text-xs mt-0.5 ${selectedSeason === 'summer' ? 'text-amber-100' : 'text-slate-500'}`}>
              Raios solares & folhas verdes adultas
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSimulating(false);
            onSelectSeason('autumn');
          }}
          className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex flex-col justify-between text-left cursor-pointer active:translate-y-1 ${selectedSeason === 'autumn'
              ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white border-red-700 shadow-xl scale-105 ring-4 ring-orange-300/40'
              : 'bg-white/90 hover:bg-white text-slate-800 border-orange-200 border-b-orange-300 hover:scale-105 hover:shadow-md'
            }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-4xl">🍂</span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${selectedSeason === 'autumn' ? 'bg-white/25 text-white' : 'bg-orange-100 text-orange-800'
                }`}
            >
              Envelhecimento
            </span>
          </div>
          <div>
            <h4 className="text-lg font-black">2. Outono</h4>
            <p className={`text-xs mt-0.5 ${selectedSeason === 'autumn' ? 'text-orange-100' : 'text-slate-500'}`}>
              Folhas amarelam & caem suavemente
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSimulating(false);
            onSelectSeason('winter');
          }}
          className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex flex-col justify-between text-left cursor-pointer active:translate-y-1 ${selectedSeason === 'winter'
              ? 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white border-indigo-900 shadow-xl scale-105 ring-4 ring-sky-300/40'
              : 'bg-white/90 hover:bg-white text-slate-800 border-sky-200 border-b-sky-300 hover:scale-105 hover:shadow-md'
            }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-4xl">❄️</span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${selectedSeason === 'winter' ? 'bg-white/25 text-white' : 'bg-sky-100 text-sky-800'
                }`}
            >
              Queda Total
            </span>
          </div>
          <div>
            <h4 className="text-lg font-black">3. Inverno</h4>
            <p className={`text-xs mt-0.5 ${selectedSeason === 'winter' ? 'text-sky-100' : 'text-slate-500'}`}>
              Neve caindo & árvore nua
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSimulating(false);
            onSelectSeason('spring');
          }}
          className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex flex-col justify-between text-left cursor-pointer active:translate-y-1 ${selectedSeason === 'spring'
              ? 'bg-gradient-to-br from-pink-400 via-rose-400 to-emerald-500 text-white border-emerald-700 shadow-xl scale-105 ring-4 ring-pink-300/40'
              : 'bg-white/90 hover:bg-white text-slate-800 border-pink-200 border-b-pink-300 hover:scale-105 hover:shadow-md'
            }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-4xl">🌸</span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${selectedSeason === 'spring' ? 'bg-white/25 text-white' : 'bg-pink-100 text-pink-800'
                }`}
            >
              Nascimento
            </span>
          </div>
          <div>
            <h4 className="text-lg font-black">4. Primavera</h4>
            <p className={`text-xs mt-0.5 ${selectedSeason === 'spring' ? 'text-pink-100' : 'text-slate-500'}`}>
              Brotos nascem & crescem devagar
            </p>
          </div>
        </button>
      </div>

      {/* QUADRO AMPLIADO DA ÁRVORE INTERATIVA */}
      <div
        ref={containerRef}
        onClick={handleSceneClick}
        title="Toque na árvore para agitar os galhos!"
        className={`relative rounded-[2.5rem] overflow-hidden border-4 shadow-2xl transition-all duration-700 min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex flex-col justify-between select-none cursor-pointer ${selectedSeason === 'summer'
            ? 'border-amber-300 bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50'
            : selectedSeason === 'autumn'
              ? 'border-orange-300 bg-gradient-to-b from-amber-300 via-orange-100 to-stone-100'
              : selectedSeason === 'winter'
                ? 'border-sky-300 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-800'
                : 'border-pink-300 bg-gradient-to-b from-pink-200 via-sky-100 to-emerald-50'
          }`}
      >
        {/* Barra de Status no Topo do Cenário */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-30 flex flex-wrap items-center justify-between gap-3 p-4 bg-white/85 backdrop-blur-md border-b border-black/10 cursor-default"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {selectedSeason === 'summer' && '☀️'}
              {selectedSeason === 'autumn' && '🍂'}
              {selectedSeason === 'winter' && '❄️'}
              {selectedSeason === 'spring' && '🌱'}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Simulação Botânica Interativa (Toque na Copa!)
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {selectedSeason === 'summer' && 'Verão · Maturidade Máxima, Fotossíntese & Raios Solares'}
                {selectedSeason === 'autumn' && 'Outono · Envelhecimento, Amarelamento & Queda Suave'}
                {selectedSeason === 'winter' && 'Inverno · Dormência Sazonal, Gelo nos Galhos & Árvore Nua'}
                {selectedSeason === 'spring' && 'Primavera · Nascimento, Folhas Crescem Devagar & Floração'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold border border-amber-300">
              <MousePointerClick className="w-3.5 h-3.5" />
              Toque na árvore!
            </span>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-300 shadow-sm text-xs font-black">
              <span
                className={`w-3 h-3 rounded-full animate-pulse ${selectedSeason === 'summer'
                    ? 'bg-red-500'
                    : selectedSeason === 'autumn'
                      ? 'bg-amber-500'
                      : selectedSeason === 'winter'
                        ? 'bg-sky-400'
                        : 'bg-emerald-500'
                  }`}
              />
              <span className="text-slate-800">
                {selectedSeason === 'summer' && '34°C · Clorofila Plena 🔥'}
                {selectedSeason === 'autumn' && '19°C · Secagem Foliar 🍂'}
                {selectedSeason === 'winter' && '2°C · Dormência Nua 🧊'}
                {selectedSeason === 'spring' && '24°C · Brotação & Seiva 🌸'}
              </span>
            </div>
          </div>
        </div>

        {/* Camada Intermediária: Desenho Majestoso da Árvore Vetorial com Astros, Relevo e Folhas Botânicas */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <svg
            viewBox="0 0 900 620"
            className={`w-full h-full select-none transition-transform duration-500 ${treeSway ? 'scale-[1.01] rotate-[0.6deg]' : 'scale-100 rotate-0'
              }`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Textura do Tronco e Galhos em Madeira Carvalho */}
              <linearGradient id="treeBarkTexture" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2e1302" />
                <stop offset="30%" stopColor="#5c2c10" />
                <stop offset="65%" stopColor="#78350f" />
                <stop offset="85%" stopColor="#5c2c10" />
                <stop offset="100%" stopColor="#2e1302" />
              </linearGradient>

              {/* Arco-íris suave para a Primavera */}
              <linearGradient id="springRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.18" />
                <stop offset="35%" stopColor="#facc15" stopOpacity="0.18" />
                <stop offset="70%" stopColor="#4ade80" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.18" />
              </linearGradient>

              {/* Filtro de Sombra Suave para as Folhas */}
              <filter id="leafShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* ELEMENTOS CELESTES DE FUNDO CONFORME A ESTAÇÃO */}
            {selectedSeason === 'summer' && (
              <g>
                <circle cx="125" cy="105" r="68" fill="#fef08a" opacity="0.25" />
                <circle cx="125" cy="105" r="48" fill="#fde047" opacity="0.45" />
                <circle cx="125" cy="105" r="32" fill="#facc15" />
              </g>
            )}

            {selectedSeason === 'spring' && (
              <g>
                <path
                  d="M 80 480 A 380 340 0 0 1 820 480"
                  fill="none"
                  stroke="url(#springRainbow)"
                  strokeWidth="28"
                  strokeLinecap="round"
                />
                <circle cx="145" cy="115" r="38" fill="#fef08a" opacity="0.7" />
              </g>
            )}

            {selectedSeason === 'autumn' && (
              <g opacity="0.75">
                <circle cx="750" cy="120" r="42" fill="#fb923c" opacity="0.45" />
                {/* Nuvens de vento de Outono */}
                <path
                  d="M 110 125 Q 140 105 175 120 Q 210 100 240 125 Z"
                  fill="#fed7aa"
                  opacity="0.65"
                />
                <path
                  d="M 660 95 Q 700 75 735 90 Q 770 75 800 95 Z"
                  fill="#ffedd5"
                  opacity="0.6"
                />
              </g>
            )}

            {selectedSeason === 'winter' && (
              <g>
                {/* Estrelas cintilantes no céu noturno de inverno */}
                {WINTER_STARS.map((star, idx) => (
                  <circle
                    key={idx}
                    cx={star.cx}
                    cy={star.cy}
                    r={star.r}
                    fill="#ffffff"
                    opacity={star.opacity}
                  />
                ))}
                {/* Lua Crescente */}
                <circle cx="760" cy="105" r="34" fill="#fef9c3" opacity="0.95" />
                <circle cx="746" cy="96" r="28" fill="#0f172a" />
              </g>
            )}

            {/* CHÃO, COLINAS E TAPETE NATURAL CONFORME A ESTAÇÃO */}
            {selectedSeason === 'summer' && (
              <g>
                <path d="M 0 500 Q 220 470 450 500 T 900 480 L 900 620 L 0 620 Z" fill="#15803d" />
                <path d="M 0 530 Q 300 490 600 530 T 900 510 L 900 620 L 0 620 Z" fill="#166534" />
                <ellipse cx="450" cy="548" rx="185" ry="22" fill="#14532d" opacity="0.45" />
                <circle cx="180" cy="540" r="4.5" fill="#fef08a" />
                <circle cx="280" cy="555" r="4" fill="#f472b6" />
                <circle cx="650" cy="545" r="4.5" fill="#fde047" />
                <circle cx="760" cy="535" r="4" fill="#ffffff" />
              </g>
            )}

            {selectedSeason === 'autumn' && (
              <g>
                <path d="M 0 500 Q 220 470 450 500 T 900 480 L 900 620 L 0 620 Z" fill="#b45309" />
                <path d="M 0 530 Q 300 495 600 530 T 900 510 L 900 620 L 0 620 Z" fill="#78350f" />
                {/* Montes de folhas caídas secas ao redor do tronco */}
                <ellipse cx="450" cy="550" rx="150" ry="24" fill="#c2410c" opacity="0.95" />
                <ellipse cx="380" cy="560" rx="80" ry="18" fill="#ea580c" />
                <ellipse cx="520" cy="558" rx="90" ry="20" fill="#d97706" />
                <ellipse cx="310" cy="565" rx="55" ry="14" fill="#b45309" />
                <ellipse cx="590" cy="567" rx="65" ry="15" fill="#dc2626" />
              </g>
            )}

            {selectedSeason === 'winter' && (
              <g>
                <path d="M 0 500 Q 220 475 450 500 T 900 485 L 900 620 L 0 620 Z" fill="#cbd5e1" />
                <path d="M 0 525 Q 300 495 600 525 T 900 505 L 900 620 L 0 620 Z" fill="#f8fafc" />
                <ellipse cx="450" cy="555" rx="160" ry="26" fill="#ffffff" />
                <ellipse cx="370" cy="565" rx="85" ry="18" fill="#e2e8f0" />
                <ellipse cx="530" cy="562" rx="95" ry="20" fill="#ffffff" />
              </g>
            )}

            {selectedSeason === 'spring' && (
              <g>
                <path d="M 0 500 Q 220 470 450 500 T 900 480 L 900 620 L 0 620 Z" fill="#16a34a" />
                <path d="M 0 530 Q 300 490 600 530 T 900 510 L 900 620 L 0 620 Z" fill="#15803d" />
                <circle cx="200" cy="540" r="5" fill="#f472b6" />
                <circle cx="245" cy="565" r="4" fill="#fef08a" />
                <circle cx="320" cy="555" r="4.5" fill="#f43f5e" />
                <circle cx="630" cy="545" r="5" fill="#fb7185" />
                <circle cx="690" cy="562" r="4" fill="#ffffff" />
                <circle cx="750" cy="535" r="4.5" fill="#fef08a" />
              </g>
            )}

            {/* TRONCO CENTRAL MAJESTOSO, VEIOS DA CASCA E GALHOS */}
            <g>
              {/* Raízes expostas no solo */}
              <path
                d="M 365 620 Q 400 560 420 520 L 480 520 Q 500 560 535 620 Z"
                fill="url(#treeBarkTexture)"
              />
              {/* Tronco principal */}
              <path
                d="M 410 540 C 415 450 395 380 410 320 C 418 280 370 240 290 200 C 310 195 365 220 425 260 C 435 220 430 180 450 140 C 465 180 460 220 470 260 C 510 220 565 190 635 185 C 575 220 525 255 495 305 C 510 370 495 450 510 540 Z"
                fill="url(#treeBarkTexture)"
              />

              {/* Textura orgânica interna do tronco e abrigo natural */}
              <ellipse cx="455" cy="415" rx="14" ry="22" fill="#1e0b01" stroke="#451a03" strokeWidth="3" />
              <path d="M 432 515 Q 438 440 430 350" stroke="#3b1906" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
              <path d="M 480 520 Q 475 430 482 340" stroke="#3b1906" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />

              {/* Sistema de Galhos Primários e Secundários */}
              {/* Lado Esquerdo */}
              <path d="M 330 220 Q 280 180 230 170" stroke="url(#treeBarkTexture)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M 270 185 Q 240 145 205 140" stroke="url(#treeBarkTexture)" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 300 205 Q 290 155 270 130" stroke="url(#treeBarkTexture)" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 380 270 Q 320 310 250 320" stroke="url(#treeBarkTexture)" strokeWidth="11" strokeLinecap="round" fill="none" />
              <path d="M 310 295 Q 270 345 220 355" stroke="url(#treeBarkTexture)" strokeWidth="7" strokeLinecap="round" fill="none" />

              {/* Centro / Topo */}
              <path d="M 440 200 Q 410 150 380 120" stroke="url(#treeBarkTexture)" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 455 170 Q 450 120 445 90" stroke="url(#treeBarkTexture)" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 465 200 Q 490 150 520 115" stroke="url(#treeBarkTexture)" strokeWidth="10" strokeLinecap="round" fill="none" />

              {/* Lado Direito */}
              <path d="M 525 225 Q 585 180 645 165" stroke="url(#treeBarkTexture)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M 580 190 Q 615 140 655 125" stroke="url(#treeBarkTexture)" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 560 215 Q 630 210 685 200" stroke="url(#treeBarkTexture)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M 500 290 Q 570 315 640 325" stroke="url(#treeBarkTexture)" strokeWidth="11" strokeLinecap="round" fill="none" />
              <path d="M 570 305 Q 625 355 680 365" stroke="url(#treeBarkTexture)" strokeWidth="7" strokeLinecap="round" fill="none" />

              {/* Camadas Realistas de Neve e Pingentes de Gelo sobre os Galhos no Inverno */}
              {selectedSeason === 'winter' && (
                <g className="transition-opacity duration-700">
                  <path d="M 410 320 C 418 280 370 240 290 200" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 330 220 Q 280 180 230 170" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 270 185 Q 240 145 205 140" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <path d="M 380 270 Q 320 310 250 320" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 440 200 Q 410 150 380 120" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M 455 170 Q 450 120 445 90" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <path d="M 465 200 Q 490 150 520 115" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M 525 225 Q 585 180 645 165" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 580 190 Q 615 140 655 125" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <path d="M 500 290 Q 570 315 640 325" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 420 260 Q 450 240 480 255" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" fill="none" />

                  {/* Pingentes de gelo cristalinos pendurados */}
                  {WINTER_ICICLES.map((ic, i) => (
                    <polygon
                      key={i}
                      points={`${ic.x - 3.5},${ic.y} ${ic.x + 3.5},${ic.y} ${ic.x},${ic.y + ic.len}`}
                      fill="#e0f2fe"
                      opacity="0.88"
                    />
                  ))}
                </g>
              )}
            </g>

            {/* CONJUNTO BOTÂNICO DE 74 FOLHAS DETALHADAS NA COPA */}
            <g>
              {TREE_LEAVES_DATA.map((leaf) => {
                let currentScale = leaf.scale;
                let currentColor = leaf.summerColor;
                let veinColor = '#86efac';
                let opacity = 1;

                if (selectedSeason === 'spring') {
                  currentScale = leaf.scale * 0.76; // Brotos jovens em crescimento
                  currentColor = leaf.springColor;
                  veinColor = '#bbf7d0';
                  opacity = 0.96;
                } else if (selectedSeason === 'summer') {
                  currentScale = leaf.scale * 1.15; // Auge da maturidade foliar
                  currentColor = leaf.summerColor;
                  veinColor = '#86efac';
                  opacity = 1;
                } else if (selectedSeason === 'autumn') {
                  currentScale = leaf.scale * 0.96; // Leve retração por secagem
                  currentColor = leaf.autumnColor;
                  veinColor = '#fef08a';
                  opacity = 0.92;
                } else if (selectedSeason === 'winter') {
                  currentScale = 0; // Árvore totalmente nua no inverno
                  opacity = 0;
                }

                return (
                  <g
                    key={leaf.id}
                    transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.angle}) scale(${currentScale})`}
                    style={{
                      transition: `transform ${selectedSeason === 'spring' ? 1.4 + leaf.growthDelay * 0.7 : 0.9}s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.7s ease-out`,
                      transformOrigin: '0 0',
                    }}
                    opacity={opacity}
                  >
                    {/* Haste botânica da folha ancorada no ramo */}
                    <line x1="0" y1="0" x2="0" y2="9" stroke="#451a03" strokeWidth="1.6" strokeLinecap="round" />

                    {/* Lâmina da Folha Detalhada com Recorte Anatômico */}
                    <path
                      d="M 0 0 C -6 -12, -18 -22, -16 -34 C -14 -42, -7 -50, 0 -62 C 7 -50, 14 -42, 16 -34 C 18 -22, 6 -12, 0 0 Z"
                      fill={currentColor}
                      stroke={selectedSeason === 'autumn' ? '#78350f' : '#14532d'}
                      strokeWidth="0.8"
                      filter="url(#leafShadow)"
                    />

                    {/* Nervura Central Principal */}
                    <line x1="0" y1="0" x2="0" y2="-52" stroke={veinColor} strokeWidth="1.3" strokeLinecap="round" />

                    {/* Nervuras Laterais Secundárias */}
                    <line x1="0" y1="-14" x2="-8" y2="-24" stroke={veinColor} strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="0" y1="-14" x2="8" y2="-24" stroke={veinColor} strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="0" y1="-28" x2="-10" y2="-38" stroke={veinColor} strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="0" y1="-28" x2="10" y2="-38" stroke={veinColor} strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="0" y1="-42" x2="-6" y2="-49" stroke={veinColor} strokeWidth="0.8" strokeLinecap="round" />
                    <line x1="0" y1="-42" x2="6" y2="-49" stroke={veinColor} strokeWidth="0.8" strokeLinecap="round" />
                  </g>
                );
              })}
            </g>

            {/* Flores de Cerejeira (Sakura) Desabrochando na Primavera */}
            {selectedSeason === 'spring' && (
              <g>
                {SPRING_BLOSSOMS.map((fl, idx) => (
                  <g
                    key={idx}
                    transform={`translate(${fl.x}, ${fl.y}) scale(${fl.s})`}
                    style={{
                      transition: `transform ${0.8 + fl.delay}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    }}
                  >
                    <circle cx="-6" cy="-3" r="5.5" fill="#f43f5e" opacity="0.95" />
                    <circle cx="6" cy="-3" r="5.5" fill="#f43f5e" opacity="0.95" />
                    <circle cx="0" cy="-7" r="5.5" fill="#fb7185" opacity="0.95" />
                    <circle cx="-4" cy="5" r="5.5" fill="#fbcfe8" opacity="0.95" />
                    <circle cx="4" cy="5" r="5.5" fill="#fbcfe8" opacity="0.95" />
                    <circle cx="0" cy="0" r="3.8" fill="#fef08a" />
                    <circle cx="0" cy="0" r="1.8" fill="#f59e0b" />
                  </g>
                ))}
              </g>
            )}
          </svg>
        </div>

        {/* Camada Superior: Canvas 60 FPS com Efeitos de Luz, Folhas Caindo em 3D, Neve e Pétalas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-20 w-full h-full pointer-events-none"
        />

        {/* Rodapé Científico com Detalhes do Eixo e Fotossíntese */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-30 px-5 py-3.5 bg-black/55 backdrop-blur-md text-white flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm cursor-default"
        >
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-300">🔬 Ciclo Biológico:</span>
            <span className="font-semibold text-slate-100">
              {selectedSeason === 'spring' && 'A luz solar volta a ficar direta: a seiva sobe e as folhas nascem devagar dos brotos!'}
              {selectedSeason === 'summer' && 'Sol perpendicular no zênite: as folhas atingem tamanho máximo e produzem clorofila plena!'}
              {selectedSeason === 'autumn' && 'Sol oblíquo e inclinado: as folhas perdem a clorofila verde, ficam amarelas e caem no vento!'}
              {selectedSeason === 'winter' && 'Mínima luz solar: todas as folhas caem para que a árvore nua não congele com a neve!'}
            </span>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-400/40">
            Eixo: 23,5°
          </span>
        </div>
      </div>

      {/* Card Didático Explicativo */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-emerald-300 shadow-md space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">
            {selectedSeason === 'summer' && '☀️'}
            {selectedSeason === 'autumn' && '🍂'}
            {selectedSeason === 'winter' && '❄️'}
            {selectedSeason === 'spring' && '🌱'}
          </span>
          <h4 className="text-lg font-black text-slate-900">
            {selectedSeason === 'summer' && 'Verão: Maturidade Plena, Clorofila & Raios Solares Diretos'}
            {selectedSeason === 'autumn' && 'Outono: Envelhecimento, Amarelamento & Desprendimento das Folhas'}
            {selectedSeason === 'winter' && 'Inverno: Dormência Sazonal das Folhas & A Árvore Nua Protegida'}
            {selectedSeason === 'spring' && 'Primavera: Nascimento Lento dos Brotos, Floração & Renascimento'}
          </h4>
        </div>

        <p className={`text-slate-700 leading-relaxed font-medium ${largeTextMode ? 'text-base' : 'text-sm'}`}>
          {selectedSeason === 'summer' && (
            <>
              No <strong>VERÃO</strong>, a inclinação de 23,5° da Terra faz com que o hemisfério receba luz solar <strong>direta e concentrada</strong>. Cada folha da árvore está no seu ápice de crescimento e tamanho, realizando fotossíntese vigorosa. Os raios solares alimentam a produção intensa de clorofila verde que reveste os galhos com força vital!
            </>
          )}
          {selectedSeason === 'autumn' && (
            <>
              No <strong>OUTONO</strong>, a translação terrestre faz os raios solares incidirem de maneira <strong>inclinada e espalhada</strong>. Com dias mais curtos e frios, a árvore começa o processo de <strong>envelhecimento foliar</strong>: para economizar água e nutrientes, ela degrada a clorofila verde. As folhas ficam amarelas, laranjas e vermelhas, ressecam e caem suavemente pelo ar até o solo!
            </>
          )}
          {selectedSeason === 'winter' && (
            <>
              No <strong>INVERNO</strong>, com o hemisfério inclinado para longe do Sol, a luz é fraca e as temperaturas despencam. A árvore entra em <strong>dormência biológica</strong>: todas as folhas restantes caem de uma só vez, deixando a árvore completamente nua. Isso evita que a árvore perca água e impede que a neve acumule nas folhas e quebre os galhos com seu peso!
            </>
          )}
          {selectedSeason === 'spring' && (
            <>
              Na <strong>PRIMAVERA</strong>, a luz solar volta a ficar mais forte e direta. A água e os sais minerais voltam a circular com energia pelo tronco. Acontece o <strong>nascimento</strong>: pequenos gomos e brotos verde-claros surgem nos ramos e <strong>crescem devagar</strong> folha a folha, acompanhados por flores de cerejeira coloridas que desabrocham para celebrar a vida!
            </>
          )}
        </p>
      </div>
    </div>
  );
};