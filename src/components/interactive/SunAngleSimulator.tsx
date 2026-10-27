// src/components/interactive/SunAngleSimulator.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Sun,
  ThermometerSun,
  ThermometerSnowflake,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Flame,
  Snowflake,
  Layers,
  ArrowDownRight,
  ArrowDown
} from 'lucide-react';
import { AudioButton } from '@/components/ui/AudioButton';

export interface SunAngleSimulatorProps {
  selectedBeam?: 'direct' | 'slanted';
  onSelectBeam?: (beam: 'direct' | 'slanted') => void;
  largeTextMode?: boolean;
}

interface PhotonParticle {
  progress: number; // 0 (no Sol) a 1 (no chão)
  lane: number;     // -1 a 1 de desvio lateral no feixe
  speed: number;
  size: number;
  alpha: number;
}

interface HeatHazeMote {
  x: number;
  y: number;
  vy: number;
  vx: number;
  life: number;
  maxLife: number;
  size: number;
}

export const SunAngleSimulator: React.FC<SunAngleSimulatorProps> = ({
  selectedBeam = 'direct',
  onSelectBeam,
  largeTextMode = false
}) => {
  // Ângulo de incidência solar em graus (90° = sol a pino/zenite, 30° = sol inclinado/inverno)
  const [angle, setAngle] = useState<number>(selectedBeam === 'direct' ? 90 : 35);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simDirectionRef = useRef<number>(-1); // -1 diminuindo ângulo, +1 aumentando
  const targetAngleRef = useRef<number>(selectedBeam === 'direct' ? 90 : 35);
  const currentAngleRef = useRef<number>(selectedBeam === 'direct' ? 90 : 35);

  // Sincroniza quando o prop selectedBeam mudar externamente
  useEffect(() => {
    const newTarget = selectedBeam === 'direct' ? 90 : 35;
    targetAngleRef.current = newTarget;
  }, [selectedBeam]);

  // Partículas de fótons viajando pelo feixe solar
  const photonsRef = useRef<PhotonParticle[]>(
    Array.from({ length: 45 }, () => ({
      progress: Math.random(),
      lane: (Math.random() - 0.5) * 1.8,
      speed: 0.005 + Math.random() * 0.007,
      size: 1.8 + Math.random() * 2.2,
      alpha: 0.4 + Math.random() * 0.5,
    }))
  );

  // Partículas de calor ondulando subindo do chão
  const heatHazeRef = useRef<HeatHazeMote[]>([]);

  // Interpolação suave do ângulo e simulação gravada contínua
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setAngle((prev) => {
        let next = prev + simDirectionRef.current * 0.6;
        if (next <= 30) {
          next = 30;
          simDirectionRef.current = 1;
        } else if (next >= 90) {
          next = 90;
          simDirectionRef.current = -1;
        }
        targetAngleRef.current = next;
        return Math.round(next * 10) / 10;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Mudança manual de preset
  const handlePresetSelect = (preset: 'direct' | 'slanted') => {
    setIsSimulating(false);
    const target = preset === 'direct' ? 90 : 35;
    setAngle(target);
    targetAngleRef.current = target;
    if (onSelectBeam) onSelectBeam(preset);
  };

  const handleSliderChange = (newVal: number) => {
    setIsSimulating(false);
    setAngle(newVal);
    targetAngleRef.current = newVal;
    if (onSelectBeam) {
      if (newVal >= 65 && selectedBeam !== 'direct') onSelectBeam('direct');
      else if (newVal < 65 && selectedBeam !== 'slanted') onSelectBeam('slanted');
    }
  };

  // Cálculo da temperatura e concentração de energia
  // Lambert's Cosine Law: Intensidade = I0 * sin(angle)
  const rad = (angle * Math.PI) / 180;
  const sinFactor = Math.sin(rad); // 1.0 a 90°, 0.5 a 30°
  const intensityPercent = Math.round(sinFactor * 100);
  // Área relativa onde a luz se espalha: 1 / sin(angle)
  const spreadMultiplier = Math.round((1 / Math.max(0.2, sinFactor)) * 10) / 10;
  // Temperatura estimada de 6°C (inverno extremo) a 38°C (verão intenso)
  const currentTemp = Math.round(6 + (38 - 6) * Math.pow(sinFactor, 1.3));

  // Loop de Animação 60 FPS com Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

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

    const render = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      // Interpolação suave do ângulo para animação fluida
      currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * 0.12;
      const currentAng = currentAngleRef.current;
      const currentRad = (currentAng * Math.PI) / 180;
      const curSin = Math.sin(currentRad);

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // 1. Céu dinâmico conforme o calor e o ângulo solar
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (currentAng > 65) {
        // Céu ensolarado e aquecido de verão
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(0.45, '#bae6fd');
        skyGrad.addColorStop(0.82, '#fef08a');
        skyGrad.addColorStop(1, '#fed7aa');
      } else {
        // Céu mais frio e límpido de outono/inverno
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.45, '#7dd3fc');
        skyGrad.addColorStop(0.82, '#e0f2fe');
        skyGrad.addColorStop(1, '#f1f5f9');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Posição do Sol na abóbada celeste
      // 90° -> centro do topo (x = w * 0.5, y = 75)
      // 30° -> topo esquerdo (x = w * 0.18, y = 110)
      const sunRatio = (90 - currentAng) / 60; // 0 quando 90°, 1 quando 30°
      const sunX = w * (0.5 - 0.32 * sunRatio);
      const sunY = h * (0.13 + 0.08 * sunRatio);
      const sunRadius = Math.max(34, Math.min(48, w * 0.055));

      // Ponto de impacto central no chão
      const groundY = h * 0.82;
      // Quando inclinado, o ponto central no chão se desloca suavemente para a direita
      const groundCenterX = w * (0.5 + 0.08 * sunRatio);

      // Largura da mancha de luz no chão: espalha conforme 1 / sin(angle)
      const baseSpotRadiusX = w * 0.11;
      const spotRadiusX = (baseSpotRadiusX / Math.max(0.35, curSin)) * (1 + 0.1 * sunRatio);
      const spotRadiusY = spotRadiusX * 0.22; // projeção elíptica em perspectiva

      // Vetor direção do feixe de luz
      const beamDx = groundCenterX - sunX;
      const beamDy = groundY - sunY;
      const beamLength = Math.hypot(beamDx, beamDy);
      const beamAngle = Math.atan2(beamDy, beamDx);

      // 2. DESENHO DOS RAIOS SOLARES VOLUMÉTRICOS (GOD RAYS) COM DEGRADÊ SUAVE
      ctx.save();

      // Corona do Sol (Brilho Radiante Gigante)
      const corona = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 4.5);
      const coronaOpacity = 0.55 + 0.35 * curSin;
      corona.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
      corona.addColorStop(0.2, `rgba(254, 240, 138, ${0.7 * coronaOpacity})`);
      corona.addColorStop(0.5, `rgba(251, 191, 36, ${0.35 * coronaOpacity})`);
      corona.addColorStop(0.8, `rgba(249, 115, 22, ${0.1 * coronaOpacity})`);
      corona.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Feixe Principal Cônico Volumétrico de Luz
      const mainBeamGrad = ctx.createLinearGradient(sunX, sunY, groundCenterX, groundY);
      const beamIntensity = 0.35 + 0.45 * curSin;
      if (curSin > 0.75) {
        // Muito concentrado e quente (dourado-âmbar radiante)
        mainBeamGrad.addColorStop(0, `rgba(255, 255, 245, ${beamIntensity})`);
        mainBeamGrad.addColorStop(0.25, `rgba(254, 240, 138, ${beamIntensity * 0.85})`);
        mainBeamGrad.addColorStop(0.7, `rgba(251, 191, 36, ${beamIntensity * 0.6})`);
        mainBeamGrad.addColorStop(1, `rgba(249, 115, 22, ${beamIntensity * 0.8})`);
      } else {
        // Mais espalhado e suave (âmbar pálido translúcido)
        mainBeamGrad.addColorStop(0, `rgba(255, 255, 245, ${beamIntensity * 0.8})`);
        mainBeamGrad.addColorStop(0.3, `rgba(254, 240, 138, ${beamIntensity * 0.5})`);
        mainBeamGrad.addColorStop(0.7, `rgba(253, 230, 138, ${beamIntensity * 0.3})`);
        mainBeamGrad.addColorStop(1, `rgba(224, 242, 254, ${beamIntensity * 0.25})`);
      }

      ctx.fillStyle = mainBeamGrad;
      ctx.beginPath();
      ctx.moveTo(sunX - sunRadius * 0.8, sunY);
      ctx.lineTo(groundCenterX - spotRadiusX, groundY);
      ctx.lineTo(groundCenterX + spotRadiusX, groundY);
      ctx.lineTo(sunX + sunRadius * 0.8, sunY);
      ctx.closePath();
      ctx.fill();

      // Feixes Internos God Rays Dinâmicos com Pulso Ondulante
      const numRays = 7;
      for (let r = 0; r < numRays; r++) {
        const offsetRatio = (r - (numRays - 1) / 2) / ((numRays - 1) / 2); // -1 a +1
        const wave = Math.sin(time * 0.0018 + r * 1.2) * 0.06;
        const pulse = 0.15 + Math.sin(time * 0.0022 + r * 0.9) * 0.08;

        const rayStartX = sunX + offsetRatio * (sunRadius * 0.7);
        const rayStartY = sunY;
        const rayTargetX = groundCenterX + (offsetRatio + wave) * (spotRadiusX * 0.85);

        const rayGrad = ctx.createLinearGradient(rayStartX, rayStartY, rayTargetX, groundY);
        rayGrad.addColorStop(0, `rgba(255, 255, 240, ${pulse * (0.8 + 0.4 * curSin)})`);
        rayGrad.addColorStop(0.5, `rgba(254, 240, 138, ${pulse * 0.5 * curSin})`);
        rayGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rayStartX - 4, rayStartY);
        ctx.lineTo(rayTargetX - 12, groundY);
        ctx.lineTo(rayTargetX + 12, groundY);
        ctx.lineTo(rayStartX + 4, rayStartY);
        ctx.closePath();
        ctx.fill();
      }

      // Linhas Guias de Luz Tracejadas indicando o Feixe Geométrico
      ctx.strokeStyle = curSin > 0.7 ? 'rgba(251, 146, 60, 0.4)' : 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      // Borda Esquerda do Feixe
      ctx.beginPath();
      ctx.moveTo(sunX - sunRadius * 0.8, sunY);
      ctx.lineTo(groundCenterX - spotRadiusX, groundY);
      ctx.stroke();
      // Borda Direita do Feixe
      ctx.beginPath();
      ctx.moveTo(sunX + sunRadius * 0.8, sunY);
      ctx.lineTo(groundCenterX + spotRadiusX, groundY);
      ctx.stroke();
      // Linha Central com seta
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(groundCenterX, groundY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      // 3. FÓTONS SOLARES VIAJANDO PELO FEIXE (Visualização de Energia em Movimento)
      ctx.save();
      photonsRef.current.forEach((photon) => {
        photon.progress += photon.speed;
        if (photon.progress > 1) {
          photon.progress = 0;
          photon.lane = (Math.random() - 0.5) * 1.8;

          // Ao atingir o chão, se for quente (ângulo alto), gera onda de calor
          if (curSin > 0.65 && heatHazeRef.current.length < 35) {
            heatHazeRef.current.push({
              x: groundCenterX + photon.lane * (spotRadiusX * 0.8),
              y: groundY - 4,
              vy: -(0.6 + Math.random() * 0.9),
              vx: (Math.random() - 0.5) * 0.4,
              life: 0,
              maxLife: 40 + Math.random() * 30,
              size: 2 + Math.random() * 3,
            });
          }
        }

        // Posição interpolada ao longo do feixe
        const p = photon.progress;
        const currentSpread = (sunRadius * 0.8) * (1 - p) + spotRadiusX * p;
        const cx = sunX * (1 - p) + groundCenterX * p;
        const cy = sunY * (1 - p) + groundY * p;

        // Desvio perpendicular
        const perpX = -Math.sin(beamAngle);
        const perpY = Math.cos(beamAngle);
        const px = cx + perpX * (photon.lane * currentSpread * 0.5);
        const py = cy + perpY * (photon.lane * currentSpread * 0.5);

        // Brilho do fóton
        const photonAlpha = photon.alpha * (p < 0.1 ? p * 10 : p > 0.9 ? (1 - p) * 10 : 1);
        ctx.fillStyle = curSin > 0.7
          ? `rgba(255, 255, 240, ${photonAlpha})`
          : `rgba(254, 249, 195, ${photonAlpha * 0.8})`;

        ctx.beginPath();
        ctx.arc(px, py, photon.size * (curSin > 0.7 ? 1.2 : 0.9), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 4. CHÃO, COLINAS E SUPERFÍCIE TERRESTRE
      ctx.save();
      // Colina ao fundo
      const hillGrad = ctx.createLinearGradient(0, groundY - 60, 0, h);
      hillGrad.addColorStop(0, '#15803d');
      hillGrad.addColorStop(1, '#14532d');
      ctx.fillStyle = hillGrad;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 10);
      ctx.quadraticCurveTo(w * 0.25, groundY - 35, w * 0.55, groundY);
      ctx.quadraticCurveTo(w * 0.8, groundY + 25, w, groundY);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Superfície plana com grama recortada
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, '#16a34a');
      groundGrad.addColorStop(0.3, '#15803d');
      groundGrad.addColorStop(1, '#0f3d1b');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // Borda iluminada superior do chão
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();

      // 5. MANCHA TÉRMICA DE LUZ NO CHÃO (CONCENTRADA VS ESPALHADA)
      const puddleGrad = ctx.createRadialGradient(
        groundCenterX,
        groundY,
        0,
        groundCenterX,
        groundY,
        spotRadiusX
      );

      if (curSin > 0.75) {
        // 🔥 VERÃO / DIRETO: Ponto super quente, núcleo vermelho-alaranjado fervilhante
        puddleGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        puddleGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.95)');
        puddleGrad.addColorStop(0.55, 'rgba(249, 115, 22, 0.85)');
        puddleGrad.addColorStop(0.85, 'rgba(220, 38, 38, 0.45)');
        puddleGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      } else {
        // ❄️ INVERNO / INCLINADO: Mancha enorme, difusa, suave e fria
        puddleGrad.addColorStop(0, 'rgba(255, 255, 230, 0.8)');
        puddleGrad.addColorStop(0.3, 'rgba(253, 230, 138, 0.55)');
        puddleGrad.addColorStop(0.7, 'rgba(186, 230, 253, 0.35)');
        puddleGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');
      }

      ctx.fillStyle = puddleGrad;
      ctx.beginPath();
      ctx.ellipse(groundCenterX, groundY, spotRadiusX, spotRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Contorno pulsante da área iluminada
      ctx.strokeStyle = curSin > 0.75 ? 'rgba(251, 146, 60, 0.85)' : 'rgba(125, 211, 252, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(groundCenterX, groundY, spotRadiusX, spotRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 6. ONDAS DE CALOR SUBINDO (HEAT HAZE MIRAGE) NO MODO QUENTE
      if (curSin > 0.65) {
        ctx.save();
        for (let i = heatHazeRef.current.length - 1; i >= 0; i--) {
          const m = heatHazeRef.current[i];
          m.life++;
          m.y += m.vy;
          m.x += m.vx + Math.sin(time * 0.01 + m.y * 0.1) * 0.3;

          const progress = m.life / m.maxLife;
          if (progress >= 1) {
            heatHazeRef.current.splice(i, 1);
            continue;
          }

          const alpha = (1 - progress) * 0.45;
          ctx.fillStyle = `rgba(254, 215, 170, ${alpha})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * (1 + progress), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 7. GRADE DE SENSORES DE ÁREA NO CHÃO (Demonstração de Lamport / Concentração)
      const numTiles = 5;
      const tileWidth = w * 0.09;
      const tileHeight = 14;
      const gridStartX = groundCenterX - (numTiles * tileWidth) / 2;

      for (let t = 0; t < numTiles; t++) {
        const tx = gridStartX + t * tileWidth;
        const ty = groundY + 12;

        // Verifica se este quadrado de chão está dentro do feixe
        const tileDistFromCenter = Math.abs(tx + tileWidth / 2 - groundCenterX);
        const isCovered = tileDistFromCenter < spotRadiusX;

        // Se está coberto, calcula a intensidade local
        ctx.save();
        if (isCovered) {
          if (curSin > 0.75) {
            // No modo direto, apenas os quadrados centrais recebem intensidade 100%
            if (tileDistFromCenter < tileWidth * 0.9) {
              ctx.fillStyle = 'rgba(239, 68, 68, 0.85)'; // 🔥 Fogo
              ctx.strokeStyle = '#fef08a';
            } else {
              ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
              ctx.strokeStyle = '#fdba74';
            }
          } else {
            // No modo inclinado, todos os 5 quadrados recebem apenas 33% de energia
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)'; // ❄️ Frio
            ctx.strokeStyle = '#bae6fd';
          }
          ctx.lineWidth = 1.5;
          ctx.fillRect(tx + 2, ty, tileWidth - 4, tileHeight);
          ctx.strokeRect(tx + 2, ty, tileWidth - 4, tileHeight);
        } else {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.fillRect(tx + 2, ty, tileWidth - 4, tileHeight);
          ctx.strokeRect(tx + 2, ty, tileWidth - 4, tileHeight);
        }
        ctx.restore();
      }

      // Rótulo da área na grade
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        curSin > 0.75
          ? '🎯 Alta Concentração: Toda energia em área pequena!'
          : '📐 Energia Diluída: A mesma luz espalhada em 3x mais área!',
        groundCenterX,
        groundY + 44
      );

      // 8. O DISCO SOLAR PRINCIPAL COM BRILHO NOBRE
      ctx.save();
      // Raios rotativos delicados ao redor do Sol
      const numSolarRays = 12;
      for (let s = 0; s < numSolarRays; s++) {
        const sAngle = (s * (Math.PI * 2)) / numSolarRays + time * 0.0008;
        const innerR = sunRadius * 1.08;
        const outerR = sunRadius * (1.28 + 0.12 * Math.sin(time * 0.003 + s));

        ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(sAngle) * innerR, sunY + Math.sin(sAngle) * innerR);
        ctx.lineTo(sunX + Math.cos(sAngle) * outerR, sunY + Math.sin(sAngle) * outerR);
        ctx.stroke();
      }

      // Corpo esférico do Sol
      const sunSphere = ctx.createRadialGradient(
        sunX - sunRadius * 0.25,
        sunY - sunRadius * 0.25,
        0,
        sunX,
        sunY,
        sunRadius
      );
      sunSphere.addColorStop(0, '#ffffff');
      sunSphere.addColorStop(0.3, '#fef08a');
      sunSphere.addColorStop(0.7, '#f59e0b');
      sunSphere.addColorStop(1, '#ea580c');

      ctx.fillStyle = sunSphere;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Ângulo anotado ao lado do Sol
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#1e293b';
      ctx.font = '900 12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Barra de Controle do Experimento dos Raios Solares */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border-2 border-amber-300">
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-1.5">
            Laboratório Físico da Luz Solar
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            Como o ângulo dos raios solares muda a temperatura?
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
            Mude o ângulo do Sol e observe os raios volumétricos e a mancha térmica no chão!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSimulating((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm shadow-lg transition-all cursor-pointer ${
              isSimulating
                ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-300/40 animate-pulse'
                : 'bg-white hover:bg-amber-50 text-amber-900 ring-4 ring-white/30 hover:scale-105'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Pausar Simulação' : '▶ Animação Contínua do Ângulo'}</span>
          </button>

          <AudioButton
            text="Quando os raios solares chegam retos a noventa graus, toda a energia do Sol fica concentrada em uma área pequena, provocando muito calor e dias de Verão. Quando a luz chega inclinada a trinta graus, a mesma quantidade de energia se espalha em uma área três vezes maior, resultando em menos calor e dias de Inverno!"
            label="Ouvir explicação científica"
            size="sm"
          />
        </div>
      </div>

      {/* Botões Rápidos de Comparação dos Extremos (Verão vs Inverno) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handlePresetSelect('direct')}
          className={`p-5 rounded-2xl border-4 text-left transition-all flex items-center gap-4 group cursor-pointer ${
            angle >= 70
              ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-amber-500 shadow-xl scale-[1.02] ring-4 ring-amber-300/40'
              : 'bg-white border-slate-200 hover:bg-amber-50/50 hover:scale-[1.01]'
          }`}
        >
          <div
            className={`p-3.5 rounded-2xl ${
              angle >= 70 ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600'
            } group-hover:scale-110 transition-transform`}
          >
            <ThermometerSun className="w-9 h-9" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                1. Luz Direta (90° · Perpendicular)
              </span>
              <span className="text-xs font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                🔥 38°C
              </span>
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-0.5">
              Raios Concentrados = VERÃO ☀️
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Sol alto no céu, área iluminada pequena e máxima intensidade térmica!
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handlePresetSelect('slanted')}
          className={`p-5 rounded-2xl border-4 text-left transition-all flex items-center gap-4 group cursor-pointer ${
            angle < 70
              ? 'bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 border-sky-500 shadow-xl scale-[1.02] ring-4 ring-sky-300/40'
              : 'bg-white border-slate-200 hover:bg-sky-50/50 hover:scale-[1.01]'
          }`}
        >
          <div
            className={`p-3.5 rounded-2xl ${
              angle < 70 ? 'bg-sky-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600'
            } group-hover:scale-110 transition-transform`}
          >
            <ThermometerSnowflake className="w-9 h-9" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-sky-700">
                2. Luz Inclinada (35° · Oblíqua)
              </span>
              <span className="text-xs font-black bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full">
                ❄️ 10°C
              </span>
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-0.5">
              Raios Espalhados = INVERNO ❄️
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Sol baixo no horizonte, a luz se espalha em área 3x maior e o solo fica frio!
            </p>
          </div>
        </button>
      </div>

      {/* QUADRO PRINCIPAL DO EXPERIMENTO: CANVAS 60 FPS COM FEIXES VOLUMÉTRICOS */}
      <div
        ref={containerRef}
        className="relative rounded-3xl overflow-hidden border-4 border-slate-300/80 shadow-2xl min-h-[460px] sm:min-h-[520px] flex flex-col justify-between select-none"
      >
        {/* Barra de Telemetria no Topo do Cenário */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 bg-white/85 backdrop-blur-md border-b border-black/10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{angle >= 70 ? '☀️' : '❄️'}</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Ângulo Atual de Incidência Solar
              </span>
              <span className="text-lg sm:text-xl font-black text-slate-900">
                {Math.round(angle)}° · {angle >= 70 ? 'Incidência Direta (Zenital)' : 'Incidência Inclinada (Oblíqua)'}
              </span>
            </div>
          </div>

          {/* Cards de Métricas ao Vivo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Termômetro Dinâmico */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-slate-300 shadow-md">
              <span
                className={`w-3.5 h-3.5 rounded-full animate-ping ${
                  currentTemp >= 28 ? 'bg-red-500' : currentTemp >= 20 ? 'bg-amber-500' : 'bg-sky-400'
                }`}
              />
              <div>
                <span className="text-[9px] font-black uppercase text-slate-500 block">
                  Temperatura
                </span>
                <span
                  className={`text-base sm:text-lg font-black ${
                    currentTemp >= 28 ? 'text-red-600' : currentTemp >= 20 ? 'text-amber-600' : 'text-blue-600'
                  }`}
                >
                  {currentTemp}°C
                </span>
              </div>
            </div>

            {/* Concentração de Calor */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-slate-300 shadow-md">
              <Flame
                className={`w-5 h-5 ${
                  intensityPercent >= 75 ? 'text-red-500 animate-bounce' : 'text-slate-400'
                }`}
              />
              <div>
                <span className="text-[9px] font-black uppercase text-slate-500 block">
                  Concentração
                </span>
                <span className="text-sm font-black text-slate-900">
                  {intensityPercent}% de calor/m²
                </span>
              </div>
            </div>

            {/* Fator de Espalhamento */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-slate-300 shadow-md">
              <Layers className="w-5 h-5 text-indigo-500" />
              <div>
                <span className="text-[9px] font-black uppercase text-slate-500 block">
                  Área Iluminada
                </span>
                <span className="text-sm font-black text-slate-900">
                  {spreadMultiplier}x
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Camada Canvas Interativa 60 FPS */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 w-full h-full pointer-events-none"
        />

        {/* Slider Interativo de Ângulo Solar (25° a 90°) no Rodapé do Canvas */}
        <div className="relative z-20 p-4 sm:p-5 bg-slate-900/80 backdrop-blur-md text-white border-t border-slate-700/60 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300">
              <Sliders className="w-4 h-4" />
              <span>Controle Preciso do Ângulo Solar:</span>
              <span className="text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-600 text-sm">
                {Math.round(angle)}°
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1 text-sky-300">
                <Snowflake className="w-3.5 h-3.5" /> 25° (Inverno Frio)
              </span>
              <span>↔</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-3.5 h-3.5" /> 90° (Verão Quente)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-extrabold text-sky-400">25°</span>
            <input
              type="range"
              min="25"
              max="90"
              step="1"
              value={angle}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 transition-all"
            />
            <span className="text-xs font-extrabold text-amber-400">90°</span>
          </div>
        </div>
      </div>

      {/* Explicação Didática da Lei dos Cossenos / Espalhamento de Luz */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 space-y-2">
          <div className="flex items-center gap-2 text-orange-800 font-black text-base">
            <ArrowDown className="w-5 h-5 text-orange-600" />
            <span>Por que a Luz Direta (90°) é Tão Quente?</span>
          </div>
          <p className={`text-slate-700 leading-relaxed ${largeTextMode ? 'text-base' : 'text-sm'}`}>
            Quando o Sol está a pino no céu, os feixes de luz chegam em linha reta perpendicular.
            <strong> 100% dos fótons de calor</strong> atingem uma área concentrada e pequena no solo.
            Como a energia não se dispersa, a temperatura sobe rapidamente (atingindo até 38°C).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 space-y-2">
          <div className="flex items-center gap-2 text-sky-800 font-black text-base">
            <ArrowDownRight className="w-5 h-5 text-sky-600" />
            <span>Por que a Luz Inclinada (35°) é Tão Fria?</span>
          </div>
          <p className={`text-slate-700 leading-relaxed ${largeTextMode ? 'text-base' : 'text-sm'}`}>
            Quando o Sol está baixo no horizonte, os raios chegam de raspão em ângulo inclinado.
            A <strong>mesma quantidade de luz solar</strong> é forçada a se espalhar por uma área
            <strong> 3 vezes maior ({spreadMultiplier}x)</strong>. Cada centímetro quadrado recebe pouca energia,
            mantendo o clima frio (por volta de 10°C).
          </p>
        </div>
      </div>
    </div>
  );
};
