// src/components/ui/MissionBadge.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Check } from 'lucide-react';

interface MissionBadgeProps {
  missionId: number;
  badgeName: string;
  isUnlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

export const MissionBadge: React.FC<MissionBadgeProps> = ({
  missionId,
  badgeName,
  isUnlocked,
  size = 'md',
  showLabel = true,
  onClick,
}) => {
  const sizeMap = {
    sm: { w: 100, h: 125, badgeW: 'w-24', badgeH: 'h-32' },
    md: { w: 140, h: 175, badgeW: 'w-32 sm:w-36', badgeH: 'h-40 sm:h-44' },
    lg: { w: 180, h: 225, badgeW: 'w-44 sm:w-48', badgeH: 'h-52 sm:h-56' },
  };

  const { w, h, badgeW, badgeH } = sizeMap[size];

  // Renderizador de SVG vetorial detalhado para cada badge
  const renderBadgeArt = () => {
    switch (missionId) {
      case 1:
        // BADGE 1: DETETIVE DO ESPAÇO (Escudo Estelar com Lupa e Órbita)
        return (
          <g>
            <defs>
              <linearGradient id="shieldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
              <linearGradient id="goldRim1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
              <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fde047" />
                <stop offset="75%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Fundo do Escudo */}
            <path
              d="M 20 25 Q 70 10 120 25 Q 125 80 70 125 Q 15 80 20 25 Z"
              fill={isUnlocked ? 'url(#shieldGrad1)' : '#334155'}
              stroke={isUnlocked ? 'url(#goldRim1)' : '#64748b'}
              strokeWidth="4"
              filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
            />

            {/* Estrelas de fundo */}
            {isUnlocked && (
              <g fill="#fef08a" opacity="0.7">
                <circle cx="45" cy="40" r="1.5" />
                <circle cx="95" cy="45" r="1.5" />
                <circle cx="85" cy="85" r="1.2" />
                <circle cx="50" cy="90" r="1.2" />
              </g>
            )}

            {/* Globo Terrestre no centro */}
            <circle
              cx="70"
              cy="65"
              r="22"
              fill={isUnlocked ? '#0284c7' : '#475569'}
              stroke={isUnlocked ? '#38bdf8' : '#64748b'}
              strokeWidth="2"
            />
            {isUnlocked && (
              <path
                d="M 60 55 Q 65 52 72 56 Q 78 62 72 70 Q 64 74 60 68 Z M 75 68 Q 80 65 84 70 Q 82 78 76 76 Z"
                fill="#22c55e"
              />
            )}

            {/* Lupa de Detetive Cósmica */}
            <circle
              cx="70"
              cy="65"
              r="18"
              fill="none"
              stroke={isUnlocked ? 'url(#goldRim1)' : '#94a3b8'}
              strokeWidth="3.5"
            />
            <line
              x1="83"
              y1="78"
              x2="100"
              y2="95"
              stroke={isUnlocked ? 'url(#goldRim1)' : '#94a3b8'}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Brilho da lente */}
            {isUnlocked && (
              <path
                d="M 58 56 A 14 14 0 0 1 76 54"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
              />
            )}

            {/* 3 Estrelas douradas no topo */}
            <g fill={isUnlocked ? '#fbbf24' : '#64748b'}>
              <polygon points="70,12 72,17 77,17 73,20 75,25 70,22 65,25 67,20 63,17 68,17" />
              <polygon points="50,16 51.5,19.5 55.5,19.5 52.5,22 53.5,26 50,23.5 46.5,26 47.5,22 44.5,19.5 48.5,19.5" />
              <polygon points="90,16 91.5,19.5 95.5,19.5 92.5,22 93.5,26 90,23.5 86.5,26 87.5,22 84.5,19.5 88.5,19.5" />
            </g>

            {/* Fita / Faixa inferior */}
            <path
              d="M 12 110 L 30 118 L 30 102 Z M 128 110 L 110 118 L 110 102 Z"
              fill={isUnlocked ? '#92400e' : '#334155'}
            />
            <rect
              x="24"
              y="100"
              width="92"
              height="20"
              rx="4"
              fill={isUnlocked ? 'url(#ribbonGrad1)' : '#475569'}
              stroke={isUnlocked ? '#78350f' : '#64748b'}
              strokeWidth="1.5"
            />
            <text
              x="70"
              y="114"
              textAnchor="middle"
              fill={isUnlocked ? '#451a03' : '#cbd5e1'}
              fontSize="7.5"
              fontWeight="900"
              letterSpacing="0.8"
            >
              DETETIVE DO ESPAÇO
            </text>
          </g>
        );

      case 2:
        // BADGE 2: PILOTO DE ÓRBITA (Asas de Piloto com Foguete e Elipse de Translação)
        return (
          <g>
            <defs>
              <linearGradient id="shieldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#042f2e" />
                <stop offset="50%" stopColor="#0f766e" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
              <linearGradient id="cyanRim2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>

            {/* Escudo Circular com Asas */}
            <path
              d="M 15 55 C 25 35, 45 35, 70 30 C 95 35, 115 35, 125 55 C 130 90, 95 115, 70 125 C 45 115, 10 90, 15 55 Z"
              fill={isUnlocked ? 'url(#shieldGrad2)' : '#334155'}
              stroke={isUnlocked ? 'url(#cyanRim2)' : '#64748b'}
              strokeWidth="4"
              filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
            />

            {/* Órbita Elíptica Dourada */}
            <ellipse
              cx="70"
              cy="70"
              rx="38"
              ry="16"
              transform="rotate(-20 70 70)"
              fill="none"
              stroke={isUnlocked ? '#fbbf24' : '#64748b'}
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />

            {/* O Sol no Foco da Órbita */}
            <circle
              cx="60"
              cy="72"
              r="10"
              fill={isUnlocked ? '#f59e0b' : '#64748b'}
            />
            {isUnlocked && (
              <circle cx="60" cy="72" r="6" fill="#fef08a" />
            )}

            {/* Foguete Espacial em Translação */}
            <g transform="translate(86, 52) rotate(45) scale(0.85)">
              <path
                d="M 0 -15 C 6 -8, 6 6, 0 12 C -6 6, -6 -8, 0 -15 Z"
                fill={isUnlocked ? '#f8fafc' : '#94a3b8'}
                stroke={isUnlocked ? '#ef4444' : '#475569'}
                strokeWidth="1.5"
              />
              {/* Asas do foguete */}
              <polygon
                points="-5,4 -10,12 -5,9"
                fill={isUnlocked ? '#ef4444' : '#64748b'}
              />
              <polygon
                points="5,4 10,12 5,9"
                fill={isUnlocked ? '#ef4444' : '#64748b'}
              />
              {/* Janela redonda */}
              <circle cx="0" cy="-2" r="2.5" fill="#38bdf8" />
              {/* Chama propulsora */}
              {isUnlocked && (
                <polygon points="-3,12 0,18 3,12" fill="#f97316" />
              )}
            </g>

            {/* Faixa inferior */}
            <rect
              x="26"
              y="102"
              width="88"
              height="20"
              rx="4"
              fill={isUnlocked ? '#0284c7' : '#475569'}
              stroke={isUnlocked ? '#38bdf8' : '#64748b'}
              strokeWidth="1.5"
            />
            <text
              x="70"
              y="116"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="7.5"
              fontWeight="900"
              letterSpacing="0.8"
            >
              PILOTO DE ÓRBITA
            </text>
          </g>
        );

      case 3:
        // BADGE 3: MESTRE DA LUZ SOLAR (Sol Flamejante com Feixes em 23,5°)
        return (
          <g>
            <defs>
              <linearGradient id="sunGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {/* Estrela de 8 pontas solar */}
            <path
              d="M 70 15 L 82 32 L 102 24 L 98 44 L 118 52 L 104 68 L 120 82 L 100 88 L 106 108 L 86 104 L 70 124 L 54 104 L 34 108 L 40 88 L 20 82 L 36 68 L 22 52 L 42 44 L 38 24 L 58 32 Z"
              fill={isUnlocked ? 'url(#sunGrad3)' : '#334155'}
              stroke={isUnlocked ? '#fef08a' : '#64748b'}
              strokeWidth="3"
              filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
            />

            {/* Círculo Interno com Eixo da Terra em 23,5° */}
            <circle
              cx="70"
              cy="68"
              r="26"
              fill={isUnlocked ? '#1e293b' : '#1e293b'}
              stroke={isUnlocked ? '#fde047' : '#475569'}
              strokeWidth="2.5"
            />

            {/* Mini Globo Inclinado */}
            <circle
              cx="70"
              cy="68"
              r="17"
              fill={isUnlocked ? '#0284c7' : '#475569'}
            />
            {/* Linha do Equador e Eixo 23,5° */}
            <line
              x1="55"
              y1="75"
              x2="85"
              y2="61"
              stroke={isUnlocked ? '#facc15' : '#94a3b8'}
              strokeWidth="1.8"
              strokeDasharray="2 2"
            />
            <line
              x1="62"
              y1="48"
              x2="78"
              y2="88"
              stroke={isUnlocked ? '#ef4444' : '#94a3b8'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Raio de Luz Solar Dourado Concentrado */}
            {isUnlocked && (
              <polygon
                points="42,42 66,62 60,68 36,48"
                fill="#fde047"
                opacity="0.65"
              />
            )}

            {/* Faixa inferior */}
            <rect
              x="25"
              y="102"
              width="90"
              height="20"
              rx="4"
              fill={isUnlocked ? '#dc2626' : '#475569'}
              stroke={isUnlocked ? '#f87171' : '#64748b'}
              strokeWidth="1.5"
            />
            <text
              x="70"
              y="116"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="7.5"
              fontWeight="900"
              letterSpacing="0.8"
            >
              MESTRE DA LUZ
            </text>
          </g>
        );

      case 4:
        // BADGE 4: GUARDIÃO DAS ESTAÇÕES (Brasão Real em 4 Quadrantes com Coroa de Louros)
        return (
          <g>
            <defs>
              <linearGradient id="emeraldGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Coroa de Louros lateral */}
            {isUnlocked && (
              <g fill="#f59e0b" opacity="0.85">
                <circle cx="16" cy="45" r="3.5" />
                <circle cx="13" cy="60" r="3.5" />
                <circle cx="16" cy="75" r="3.5" />
                <circle cx="22" cy="90" r="3.5" />
                <circle cx="124" cy="45" r="3.5" />
                <circle cx="127" cy="60" r="3.5" />
                <circle cx="124" cy="75" r="3.5" />
                <circle cx="118" cy="90" r="3.5" />
              </g>
            )}

            {/* Escudo Heráldico */}
            <path
              d="M 24 25 L 116 25 L 116 75 C 116 105, 70 125, 70 125 C 70 125, 24 105, 24 75 Z"
              fill={isUnlocked ? 'url(#emeraldGrad4)' : '#334155'}
              stroke={isUnlocked ? '#fbbf24' : '#64748b'}
              strokeWidth="3.5"
              filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
            />

            {/* Divisória dos 4 Quadrantes */}
            <line x1="26" y1="62" x2="114" y2="62" stroke="#fbbf24" strokeWidth="2" />
            <line x1="70" y1="26" x2="70" y2="110" stroke="#fbbf24" strokeWidth="2" />

            {/* Quadrante 1 (Noroeste): Primavera 🌸 */}
            <circle cx="48" cy="44" r="8" fill={isUnlocked ? '#f472b6' : '#64748b'} opacity="0.9" />
            <text x="48" y="48" textAnchor="middle" fontSize="10">🌸</text>

            {/* Quadrante 2 (Nordeste): Verão ☀️ */}
            <circle cx="92" cy="44" r="8" fill={isUnlocked ? '#facc15' : '#64748b'} opacity="0.9" />
            <text x="92" y="48" textAnchor="middle" fontSize="10">☀️</text>

            {/* Quadrante 3 (Sudoeste): Outono 🍂 */}
            <circle cx="48" cy="84" r="8" fill={isUnlocked ? '#ea580c' : '#64748b'} opacity="0.9" />
            <text x="48" y="88" textAnchor="middle" fontSize="10">🍂</text>

            {/* Quadrante 4 (Sudeste): Inverno ❄️ */}
            <circle cx="92" cy="84" r="8" fill={isUnlocked ? '#38bdf8' : '#64748b'} opacity="0.9" />
            <text x="92" y="88" textAnchor="middle" fontSize="10">❄️</text>

            {/* Faixa inferior */}
            <rect
              x="20"
              y="102"
              width="100"
              height="20"
              rx="4"
              fill={isUnlocked ? '#047857' : '#475569'}
              stroke={isUnlocked ? '#6ee7b7' : '#64748b'}
              strokeWidth="1.5"
            />
            <text
              x="70"
              y="116"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="6.8"
              fontWeight="900"
              letterSpacing="0.6"
            >
              GUARDIÃO DAS ESTAÇÕES
            </text>
          </g>
        );

      case 5:
        // BADGE 5: ASTRÓNOMO CHEFE (Octógono Imperial com Balança Cósmica de Sol e Lua)
        return (
          <g>
            <defs>
              <linearGradient id="purpleGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2e1065" />
                <stop offset="50%" stopColor="#581c87" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
            </defs>

            {/* Octógono Cósmico */}
            <polygon
              points="45,15 95,15 125,45 125,95 95,125 45,125 15,95 15,45"
              fill={isUnlocked ? 'url(#purpleGrad5)' : '#334155'}
              stroke={isUnlocked ? '#fbbf24' : '#64748b'}
              strokeWidth="4"
              filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
            />

            {/* Balança Cósmica no centro */}
            {/* Haste vertical */}
            <line x1="70" y1="42" x2="70" y2="86" stroke={isUnlocked ? '#fef08a' : '#94a3b8'} strokeWidth="3" />
            {/* Pivô central */}
            <circle cx="70" cy="46" r="4" fill={isUnlocked ? '#fbbf24' : '#64748b'} />
            {/* Braço horizontal */}
            <line x1="42" y1="52" x2="98" y2="52" stroke={isUnlocked ? '#fef08a' : '#94a3b8'} strokeWidth="3" />
            {/* Correntes */}
            <line x1="45" y1="52" x2="40" y2="72" stroke={isUnlocked ? '#fde047' : '#94a3b8'} strokeWidth="1.2" />
            <line x1="45" y1="52" x2="50" y2="72" stroke={isUnlocked ? '#fde047' : '#94a3b8'} strokeWidth="1.2" />
            <line x1="95" y1="52" x2="90" y2="72" stroke={isUnlocked ? '#fde047' : '#94a3b8'} strokeWidth="1.2" />
            <line x1="95" y1="52" x2="100" y2="72" stroke={isUnlocked ? '#fde047' : '#94a3b8'} strokeWidth="1.2" />

            {/* Prato do Sol (Esquerda) */}
            <path d="M 36 72 Q 45 78 54 72 Z" fill={isUnlocked ? '#f59e0b' : '#64748b'} />
            <circle cx="45" cy="65" r="6" fill={isUnlocked ? '#fde047' : '#94a3b8'} />

            {/* Prato da Lua (Direita) */}
            <path d="M 86 72 Q 95 78 104 72 Z" fill={isUnlocked ? '#6366f1' : '#64748b'} />
            <circle cx="95" cy="65" r="5" fill={isUnlocked ? '#e2e8f0' : '#94a3b8'} />

            {/* Base da balança */}
            <polygon points="62,86 78,86 74,80 66,80" fill={isUnlocked ? '#fbbf24' : '#64748b'} />

            {/* Faixa inferior */}
            <rect
              x="22"
              y="102"
              width="96"
              height="20"
              rx="4"
              fill={isUnlocked ? '#6b21a8' : '#475569'}
              stroke={isUnlocked ? '#c084fc' : '#64748b'}
              strokeWidth="1.5"
            />
            <text
              x="70"
              y="116"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="7.5"
              fontWeight="900"
              letterSpacing="0.8"
            >
              ASTRÔNOMO CHEFE
            </text>
          </g>
        );

      case 6:
        // BADGE 6: CAMPEÃO SUPREMO (Coroa de Ouro com Estrela Radiante e Laurel de Vitória)
        return (
          <g>
            <defs>
              <linearGradient id="goldCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="shieldGrad6" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="50%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Escudo Estelar Dourado */}
            <path
              d="M 18 35 Q 70 15 122 35 Q 128 85 70 125 Q 12 85 18 35 Z"
              fill={isUnlocked ? 'url(#shieldGrad6)' : '#334155'}
              stroke={isUnlocked ? 'url(#goldCrownGrad)' : '#64748b'}
              strokeWidth="4"
              filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
            />

            {/* Coroa Real no centro */}
            <path
              d="M 40 85 L 35 48 L 52 64 L 70 42 L 88 64 L 105 48 L 100 85 Z"
              fill={isUnlocked ? 'url(#goldCrownGrad)' : '#64748b'}
              stroke={isUnlocked ? '#fef08a' : '#94a3b8'}
              strokeWidth="2"
            />

            {/* Joias da coroa */}
            {isUnlocked && (
              <g>
                <circle cx="35" cy="46" r="3.5" fill="#ef4444" />
                <circle cx="70" cy="40" r="4.5" fill="#38bdf8" />
                <circle cx="105" cy="46" r="3.5" fill="#ef4444" />
                <circle cx="52" cy="74" r="3" fill="#22c55e" />
                <circle cx="70" cy="74" r="3.5" fill="#fef08a" />
                <circle cx="88" cy="74" r="3" fill="#a855f7" />
              </g>
            )}

            {/* Estrela de Vitória Brilhante */}
            <polygon
              points="70,18 72,23 77,23 73,26 75,31 70,28 65,31 67,26 63,23 68,23"
              fill={isUnlocked ? '#fef08a' : '#64748b'}
            />

            {/* Faixa inferior */}
            <rect
              x="18"
              y="102"
              width="104"
              height="20"
              rx="4"
              fill={isUnlocked ? '#b45309' : '#475569'}
              stroke={isUnlocked ? '#fde047' : '#64748b'}
              strokeWidth="1.5"
            />
            <text
              x="70"
              y="116"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="6.8"
              fontWeight="900"
              letterSpacing="0.6"
            >
              CAMPEÃO SUPREMO
            </text>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`relative ${badgeW} ${badgeH} flex items-center justify-center`}>
        {/* SVG do Badge Vetorial */}
        <svg
          viewBox="0 0 140 140"
          className={`w-full h-full drop-shadow-xl transition-all duration-300 ${
            isUnlocked ? 'filter-none' : 'grayscale opacity-60 contrast-75'
          }`}
        >
          {renderBadgeArt()}
        </svg>

        {/* Ícone de Cadeado se bloqueado */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="w-9 h-9 rounded-full bg-slate-950/80 border-2 border-slate-500 flex items-center justify-center text-slate-300 shadow-lg">
              <Lock className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Efeito cintilante se desbloqueado */}
        {isUnlocked && (
          <div className="absolute -top-1 -right-1 z-20 w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
          </div>
        )}
      </div>

      {showLabel && (
        <div className="text-center mt-2 max-w-[140px]">
          <span
            className={`text-xs font-black block leading-tight ${
              isUnlocked ? 'text-slate-800' : 'text-slate-400'
            }`}
          >
            {badgeName}
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider block mt-0.5 ${
              isUnlocked ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {isUnlocked ? '⭐ Desbloqueada' : '🔒 Bloqueada'}
          </span>
        </div>
      )}
    </motion.div>
  );
};
