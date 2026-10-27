// src/components/interactive/CuriosityModal.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  Tv,
  Globe,
  Sun,
  Zap,
  Leaf,
  Snowflake,
  Flower2
} from 'lucide-react';
import { AudioButton } from '@/components/ui/AudioButton';

export interface CuriosityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  text: string;
  curiosityFact: string;
  color: string;
  emoji: string;
  tag: string;
  audioText: string;
}

export const CURIOSITIES_DATA: CuriosityItem[] = [
  {
    id: 'eixo-inclinado',
    icon: <Globe className="w-6 h-6" />,
    title: 'Eixo Inclinado de 23,5°',
    subtitle: 'O Segredo que Cria as Quatro Estações',
    text: 'A Terra não gira reta no espaço. Seu eixo de rotação é inclinado em exatamente 23,5° em relação ao plano de sua órbita. Por causa disso, ao longo do ano, ora o Hemisfério Norte recebe mais luz direta, ora o Hemisfério Sul fica voltado para o Sol!',
    curiosityFact: 'Se a inclinação fosse 0°, todos os dias do ano teriam exatamente a mesma temperatura no mesmo lugar. Não haveria primavera, verão, outono ou inverno!',
    color: 'from-blue-500 to-cyan-500',
    emoji: '🌍',
    tag: 'Física Planetária',
    audioText: 'O eixo imaginário da Terra é inclinado em vinte e três vírgula cinco graus. Esta inclinação faz com que ora o polo norte, ora o polo sul fiquem inclinados na direção do Sol, criando o ciclo das quatro estações do ano.'
  },
  {
    id: 'solsticios',
    icon: <Sun className="w-6 h-6" />,
    title: 'Solstícios: O Dia Mais Longo e Mais Curto',
    subtitle: 'Máxima Inclinação Solar nos Hemisférios',
    text: 'Ocorre duas vezes por ano (em junho e dezembro). No solstício de verão de um hemisfério, o Sol atinge o ponto mais alto do céu, gerando o dia mais longo do ano! No outro hemisfério, ocorre o solstício de inverno, marcando a noite mais longa.',
    curiosityFact: 'No Círculo Polar Ártico durante o solstício de junho, acontece o "Sol da Meia-Noite": o Sol nunca se põe e fica claro durante as 24 horas do dia!',
    color: 'from-amber-500 to-orange-500',
    emoji: '☀️',
    tag: 'Astronomia Observacional',
    audioText: 'Nos solstícios, um hemisfério atinge a inclinação máxima em direção ao Sol. É quando temos o dia mais longo no verão e a noite mais longa no inverno. No polo, o sol chega a brilhar vinte e quatro horas seguidas sem se pôr!'
  },
  {
    id: 'energia-solar',
    icon: <Zap className="w-6 h-6" />,
    title: 'Concentração de Energia Solar',
    subtitle: 'Por que o Sol Direto Queima e o Inclinado Não?',
    text: 'A luz do Sol carrega a mesma quantidade total de calor. Porém, quando chega a 90° (perpendicular), todos os raios se concentram em uma área pequena no chão. Quando chega inclinada, a mesma luz se espalha numa área muito maior, diluindo o calor!',
    curiosityFact: 'É a mesma lógica de uma lanterna: se você apontar reto para a parede, vê um círculo pequeno e brilhante; se inclinar, a mancha fica gigante e fraca!',
    color: 'from-purple-500 to-pink-500',
    emoji: '⚡',
    tag: 'Termodinâmica da Luz',
    audioText: 'A mesma quantidade de luz solar aquece muito quando chega direta, pois fica concentrada em um espaço pequeno. Quando inclinada, ela se espalha em uma área três vezes maior, tornando o chão frio.'
  },
  {
    id: 'equinocios',
    icon: <Leaf className="w-6 h-6" />,
    title: 'Equinócios: Dia e Noite Perfeitos',
    subtitle: 'Equilíbrio Total entre os Hemisférios',
    text: 'A palavra equinócio vem do latim e significa "noites iguais". Ocorre em março e setembro, quando o Sol bate exatamente na linha do Equador e os dois hemisférios da Terra recebem rigorosamente a mesma quantidade de radiação solar.',
    curiosityFact: 'Nesses dois dias do ano, o Sol nasce exatamente no Leste geográfico e se põe exatamente no Oeste geográfico em todos os lugares da Terra!',
    color: 'from-green-500 to-emerald-500',
    emoji: '🍃',
    tag: 'Geografia Cósmica',
    audioText: 'Nos equinócios, o Sol ilumina a Terra exatamente no Equador. Nenhum hemisfério fica mais inclinado que o outro, fazendo com que o dia e a noite tenham exatamente doze horas cada um para todos no planeta.'
  },
  {
    id: 'hemisferios-opostos',
    icon: <Snowflake className="w-6 h-6" />,
    title: 'Hemisférios em Estações Opostas',
    subtitle: 'Enquanto o Brasil Ferve na Praia, a Europa Neve',
    text: 'Como a Terra é uma esfera inclinada, quando o Hemisfério Sul está voltado para o Sol (Verão em dezembro), o Hemisfério Norte está virado para o lado oposto (Inverno na Europa e EUA). Eles nunca têm a mesma estação simultaneamente!',
    curiosityFact: 'O Natal no Brasil acontece no auge do calor do verão, com praia e picolé; já o Natal no Canadá e na Europa ocorre com nevascas e bonecos de neve!',
    color: 'from-sky-500 to-blue-500',
    emoji: '❄️',
    tag: 'Climatologia Global',
    audioText: 'Os hemisférios Norte e Sul sempre vivem estações opostas. Quando é verão com praia no Brasil, é inverno rigoroso com neve na Europa e nos Estados Unidos.'
  },
  {
    id: 'zona-tropical',
    icon: <Flower2 className="w-6 h-6" />,
    title: 'A Zona Tropical Quente o Ano Inteiro',
    subtitle: 'Por que no Equador Nunca Faz Frio de Congelar?',
    text: 'A faixa central do planeta, situada entre o Trópico de Câncer e o Trópico de Capricórnio, recebe luz solar praticamente perpendicular e constante durante todos os 365 dias do ano. Por isso, a variação de temperatura é baixa e o clima é quente!',
    curiosityFact: 'Na Amazônia e em cidades próximas à linha do Equador, não existe inverno com neve. As pessoas dividem o ano apenas entre a estação seca e a estação das chuvas!',
    color: 'from-rose-500 to-pink-500',
    emoji: '🌺',
    tag: 'Biomas Tropicais',
    audioText: 'A região equatorial da Terra fica bem no centro do globo e recebe raios solares diretos e quentes durante o ano inteiro. Por isso, florestas tropicais como a Amazônia nunca têm inverno com neve.'
  }
];

interface CuriosityModalProps {
  curiosityIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  largeTextMode?: boolean;
}

export const CuriosityModal: React.FC<CuriosityModalProps> = ({
  curiosityIndex,
  onClose,
  onSelectIndex,
  largeTextMode = false
}) => {
  const current = CURIOSITIES_DATA[curiosityIndex] || CURIOSITIES_DATA[0];
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0); // 0 a 100
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fecha com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [curiosityIndex]);

  const handleNext = () => {
    onSelectIndex((curiosityIndex + 1) % CURIOSITIES_DATA.length);
    setVideoProgress(0);
  };

  const handlePrev = () => {
    onSelectIndex((curiosityIndex - 1 + CURIOSITIES_DATA.length) % CURIOSITIES_DATA.length);
    setVideoProgress(0);
  };

  // Barra de progresso do vídeo da animação (duração de 15s por ciclo)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 0.6));
    }, 90);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Renderizador do Canvas para a animação cinematográfica de cada curiosidade
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now: number) => {
      const time = (now - startTime) * (isPlaying ? 1 : 0);
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // Fundo Espacial Estrelado Cinematográfico
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.8);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.6, '#090d16');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Estrelas cintilantes estáticas
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5) % w);
        const sy = ((i * 263.1) % h);
        const sSize = (i % 3 === 0 ? 1.8 : 1.2);
        const sAlpha = 0.3 + 0.5 * Math.sin(time * 0.002 + i * 1.5);
        ctx.fillStyle = `rgba(255, 255, 255, ${sAlpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // -------------------------------------------------------------
      // CENA 1: EIXO INCLINADO (23,5°)
      // -------------------------------------------------------------
      if (current.id === 'eixo-inclinado') {
        const cx = w * 0.55;
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.24;

        // Sol brilhando à esquerda
        const sunX = w * 0.12;
        const sunY = h * 0.5;
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 130);
        sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        sunGlow.addColorStop(0.3, 'rgba(251, 191, 36, 0.4)');
        sunGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 130, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
        ctx.fill();

        // Raios solares em direção à Terra
        for (let r = 0; r < 5; r++) {
          const ry = cy - 40 + r * 20;
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.moveTo(sunX + 35, ry);
          ctx.lineTo(cx - radius - 5, ry);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.save();
        ctx.translate(cx, cy);

        // Linha vertical de referência (0° pontilhada cinza)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 1.5);
        ctx.lineTo(0, radius * 1.5);
        ctx.stroke();
        ctx.setLineDash([]);

        // Rotação com a inclinação exata de 23.5°
        const tiltAngle = (23.5 * Math.PI) / 180;
        ctx.rotate(tiltAngle);

        // Eixo de rotação da Terra (amarelo ouro radiante)
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0, -radius * 1.45);
        ctx.lineTo(0, radius * 1.45);
        ctx.stroke();

        // Setas nos polos
        ctx.fillStyle = '#facc15';
        ctx.fillText('Pólo Norte', -28, -radius * 1.52);
        ctx.fillText('Pólo Sul', -24, radius * 1.62);

        // Esfera da Terra
        const earthGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.2, 5, 0, 0, radius);
        earthGrad.addColorStop(0, '#38bdf8');
        earthGrad.addColorStop(0.5, '#0284c7');
        earthGrad.addColorStop(0.85, '#0369a1');
        earthGrad.addColorStop(1, '#082f49');
        ctx.fillStyle = earthGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Linha do Equador tracejada
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Continentes girando
        const spin = (time * 0.0006) % (Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, radius - 1, 0, Math.PI * 2);
        ctx.clip();
        for (let c = 0; c < 3; c++) {
          const contX = ((c * radius * 0.9 + spin * radius * 0.6) % (radius * 2.4)) - radius * 1.2;
          ctx.beginPath();
          ctx.ellipse(contX, -radius * 0.3, radius * 0.25, radius * 0.2, 0, 0, Math.PI * 2);
          ctx.ellipse(contX + 15, radius * 0.25, radius * 0.22, radius * 0.28, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Sombra de noite na metade direita
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.arc(0, 0, radius, -Math.PI / 2, Math.PI / 2, false);
        ctx.fill();

        ctx.restore();

        // Arco do ângulo de 23,5°
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.25, -Math.PI / 2, -Math.PI / 2 + tiltAngle);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillText('23,5° de Inclinação', cx + 18, cy - radius * 1.28);
      }

      // -------------------------------------------------------------
      // CENA 2: SOLSTÍCIOS (DIA MAIS LONGO VS MAIS CURTO)
      // -------------------------------------------------------------
      else if (current.id === 'solsticios') {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.25;

        // Sol gigante ao lado esquerdo emitindo feixes
        const sunX = w * 0.12;
        const sunY = cy;
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 150);
        sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
        sunGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.3)');
        sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 150, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 36, 0, Math.PI * 2);
        ctx.fill();

        // Globo inclinado para o Sol
        ctx.save();
        ctx.translate(cx, cy);
        const tilt = (-23.5 * Math.PI) / 180;
        ctx.rotate(tilt);

        // Planeta Terra
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Hemisfério Norte iluminado diretamente pelo Sol
        const lightGrad = ctx.createLinearGradient(-radius, 0, radius, 0);
        lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
        lightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
        ctx.fillStyle = lightGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Equador
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 0.15, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Eixo
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -radius * 1.35);
        ctx.lineTo(0, radius * 1.35);
        ctx.stroke();

        ctx.restore();

        // Destaque didático: Polo Norte no Sol da Meia-Noite
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillText('☀️ Sol da Meia-Noite (24h de luz)', cx - 40, cy - radius - 20);

        ctx.fillStyle = '#93c5fd';
        ctx.fillText('❄️ Noite Polar (24h de escuridão)', cx - 40, cy + radius + 30);
      }

      // -------------------------------------------------------------
      // CENA 3: ENERGIA SOLAR & CONCENTRAÇÃO
      // -------------------------------------------------------------
      else if (current.id === 'energia-solar') {
        const leftX = w * 0.28;
        const rightX = w * 0.72;
        const groundY = h * 0.76;

        // Lado 1: Feixe Direto (90°)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(leftX, h * 0.18, 26, 0, Math.PI * 2);
        ctx.fill();

        // Feixe estreito concentrado
        const beam1 = ctx.createLinearGradient(leftX, h * 0.18, leftX, groundY);
        beam1.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        beam1.addColorStop(0.5, 'rgba(245, 158, 11, 0.8)');
        beam1.addColorStop(1, 'rgba(239, 68, 68, 0.95)');
        ctx.fillStyle = beam1;
        ctx.beginPath();
        ctx.moveTo(leftX - 16, h * 0.18);
        ctx.lineTo(leftX - 30, groundY);
        ctx.lineTo(leftX + 30, groundY);
        ctx.lineTo(leftX + 16, h * 0.18);
        ctx.closePath();
        ctx.fill();

        // Mancha de fogo concentrada
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(leftX, groundY, 32, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Luz Direta (90°)', leftX, h * 0.35);
        ctx.fillText('🔥 Calor Concentrado (38°C)', leftX, groundY + 30);

        // Lado 2: Feixe Inclinado (30°)
        const sun2X = rightX - 60;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(sun2X, h * 0.18, 26, 0, Math.PI * 2);
        ctx.fill();

        // Feixe aberto e espalhado
        const beam2 = ctx.createLinearGradient(sun2X, h * 0.18, rightX, groundY);
        beam2.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        beam2.addColorStop(0.5, 'rgba(253, 230, 138, 0.45)');
        beam2.addColorStop(1, 'rgba(186, 230, 253, 0.3)');
        ctx.fillStyle = beam2;
        ctx.beginPath();
        ctx.moveTo(sun2X - 16, h * 0.18);
        ctx.lineTo(rightX - 90, groundY);
        ctx.lineTo(rightX + 90, groundY);
        ctx.lineTo(sun2X + 16, h * 0.18);
        ctx.closePath();
        ctx.fill();

        // Mancha fria espalhada
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.beginPath();
        ctx.ellipse(rightX, groundY, 90, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText('Luz Inclinada (30°)', rightX, h * 0.35);
        ctx.fillText('❄️ Calor Espalhado (10°C)', rightX, groundY + 30);

        // Linha do solo
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(w, groundY);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // CENA 4: EQUINÓCIOS (EQUILÍBRIO PERFEITO)
      // -------------------------------------------------------------
      else if (current.id === 'equinocios') {
        const cx = w * 0.55;
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.25;

        // Sol alinhado exatamente ao centro do Equador
        const sunX = w * 0.14;
        const sunY = cy;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 34, 0, Math.PI * 2);
        ctx.fill();

        // Feixe reto apontando para a linha do Equador
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(sunX + 35, sunY);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Globo com eixo vertical em relação aos raios
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Linha do terminador dividindo perfeitamente o globo de cima a baixo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, -Math.PI / 2, Math.PI / 2, false);
        ctx.fill();

        // Linha do Equador iluminada
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - radius, cy);
        ctx.lineTo(cx + radius, cy);
        ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚖️ 12 Horas de Dia / 12 Horas de Noite para Todos!', cx, cy + radius + 30);
      }

      // -------------------------------------------------------------
      // CENA 5: HEMISFÉRIOS OPOSTOS (BRASIL VS EUROPA)
      // -------------------------------------------------------------
      else if (current.id === 'hemisferios-opostos') {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.26;

        // Metade Superior: Hemisfério Norte (Inverno / Neve)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, 0, false);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.clip();

        // Flocos de neve caindo
        for (let s = 0; s < 25; s++) {
          const sx = cx - radius + ((s * 37 + time * 0.05) % (radius * 2));
          const sy = cy - radius + ((s * 23 + time * 0.08) % radius);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Metade Inferior: Hemisfério Sul (Verão / Praia)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI, false);
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.clip();

        // Brilho dourado de verão
        const sunGlow = ctx.createRadialGradient(cx, cy + radius * 0.5, 0, cx, cy + radius * 0.5, radius * 0.8);
        sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
        sunGlow.addColorStop(1, 'rgba(14, 165, 233, 0.3)');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(cx - radius, cy, radius * 2, radius);
        ctx.restore();

        // Linha do Equador separando os dois mundos
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - radius - 15, cy);
        ctx.lineTo(cx + radius + 15, cy);
        ctx.stroke();

        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('❄️ Hemisfério Norte: INVERNO rigoroso', cx, cy - radius - 16);

        ctx.fillStyle = '#fde047';
        ctx.fillText('☀️ Hemisfério Sul (Brasil): VERÃO na praia', cx, cy + radius + 30);
      }

      // -------------------------------------------------------------
      // CENA 6: ZONA TROPICAL (O CALOR O ANO INTEIRO)
      // -------------------------------------------------------------
      else if (current.id === 'zona-tropical') {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.26;

        // Globo da Terra
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Continentes na floresta tropical
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.ellipse(cx - 20, cy, radius * 0.3, radius * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Faixa Tropical Dourada Pulsando
        const pulse = 0.5 + 0.3 * Math.sin(time * 0.003);
        const tropGrad = ctx.createLinearGradient(0, cy - radius * 0.35, 0, cy + radius * 0.35);
        tropGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        tropGrad.addColorStop(0.3, `rgba(251, 191, 36, ${pulse})`);
        tropGrad.addColorStop(0.5, `rgba(239, 68, 68, ${pulse * 1.1})`);
        tropGrad.addColorStop(0.7, `rgba(251, 191, 36, ${pulse})`);
        tropGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = tropGrad;
        ctx.fillRect(cx - radius, cy - radius * 0.35, radius * 2, radius * 0.7);

        // Trópico de Câncer e Trópico de Capricórnio (linhas)
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx - radius, cy - radius * 0.35);
        ctx.lineTo(cx + radius, cy - radius * 0.35);
        ctx.moveTo(cx - radius, cy + radius * 0.35);
        ctx.lineTo(cx + radius, cy + radius * 0.35);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Trópico de Câncer (23,5° N)', cx, cy - radius * 0.4);
        ctx.fillText('Trópico de Capricórnio (23,5° S)', cx, cy + radius * 0.48);

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText('🌴 Zona Tropical: Sol Direto e Calor o Ano Todo!', cx, cy + radius + 32);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [curiosityIndex, isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-purple-400/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Barra Superior do CineCiência */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {current.tag}
                </span>
                <span className="text-xs text-slate-400">
                  {curiosityIndex + 1} de {CURIOSITIES_DATA.length}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
                <span>{current.emoji}</span>
                <span>{current.title}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Fechar animação"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TELA DE VÍDEO / ANIMAÇÃO CIENTÍFICA 60 FPS */}
        <div
          ref={containerRef}
          className="relative w-full h-64 sm:h-80 md:h-96 bg-black flex items-center justify-center overflow-hidden select-none"
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Selo HD e Status do Vídeo */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="bg-rose-600/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow">
              AO VIVO · 60 FPS
            </span>
            <span className="bg-black/60 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
              {current.subtitle}
            </span>
          </div>

          {/* Controles de Reprodução sobre a Tela */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2">
            {/* Barra de Progresso do Vídeo */}
            <div className="w-full bg-slate-700/80 h-1.5 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-purple-500 h-full transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="font-mono text-[11px] text-slate-300">
                  {Math.floor((videoProgress / 100) * 15)}s / 15s
                </span>
              </div>

              {/* Navegação Rápida Anterior / Próxima */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-black transition-all cursor-pointer shadow-md"
                >
                  Próxima <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DIDÁTICA EXPLICATIVA */}
        <div className="p-6 bg-slate-900 overflow-y-auto space-y-4 text-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-xl font-black text-amber-300">
              {current.subtitle}
            </h4>
            <AudioButton text={current.audioText} label="Ouvir explicação" size="sm" />
          </div>

          <p className={`text-slate-300 leading-relaxed ${largeTextMode ? 'text-base' : 'text-sm'}`}>
            {current.text}
          </p>

          {/* Caixa "Você Sabia?" */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-900 border border-purple-500/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider block">
                Você Sabia?
              </span>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                {current.curiosityFact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
