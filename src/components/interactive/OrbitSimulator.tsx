// src/components/interactive/OrbitSimulator.tsx
'use client';

import React, { useState } from 'react';
import { Calendar, Orbit, PlusCircle, RotateCcw } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

const ORBIT_POSITIONS = [
  {
    monthIndex: 0,
    label: 'Posição 1 (Dezembro)',
    seasonSouth: 'Início do Verão no Hemisfério Sul ☀️',
    daysElapsed: 0,
    x: 260,
    y: 110,
  },
  {
    monthIndex: 1,
    label: 'Posição 2 (Março)',
    seasonSouth: 'Início do Outono no Hemisfério Sul 🍂',
    daysElapsed: 91,
    x: 150,
    y: 35,
  },
  {
    monthIndex: 2,
    label: 'Posição 3 (Junho)',
    seasonSouth: 'Início do Inverno no Hemisfério Sul ❄️',
    daysElapsed: 182,
    x: 40,
    y: 110,
  },
  {
    monthIndex: 3,
    label: 'Posição 4 (Setembro)',
    seasonSouth: 'Início da Primavera no Hemisfério Sul 🌸',
    daysElapsed: 273,
    x: 150,
    y: 185,
  },
  {
    monthIndex: 4,
    label: 'Volta Completa! (1 Ano)',
    seasonSouth: '365 dias e 6 horas concluídos! 🎉',
    daysElapsed: 365,
    x: 260,
    y: 110,
  },
];

export const OrbitSimulator: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [yearsCount, setYearsCount] = useState(1);

  const currentPos = ORBIT_POSITIONS[stepIndex];
  const accumulatedExtraHours = yearsCount * 6;

  const handleSliderChange = (newIndex: number) => {
    setStepIndex(newIndex);
    if (newIndex === 4) {
      completeMission(2);
    }
  };

  return (
    <div className="space-y-8">
      {/* Simulador de Órbita Elíptica */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-xs uppercase tracking-wider">
              Experiência 2: Piloto de Translação
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-2">
              Faz a Terra viajar pela sua Órbita!
            </h3>
          </div>
          <AudioButton
            text="Usa o controlo deslizante abaixo para mover a Terra pela sua órbita em forma de oval suave ao redor do Sol!"
            label="Ouvir instrução"
            size="sm"
          />
        </div>

        {/* Mapa SVG da Órbita */}
        <div className="bg-slate-950 rounded-3xl p-6 text-white border-4 border-slate-800 flex flex-col items-center">
          <svg
            viewBox="0 0 300 220"
            className="w-full max-w-lg h-auto overflow-visible"
          >
            {/* Trajetória Elíptica (Órbita) */}
            <ellipse
              cx="150"
              cy="110"
              rx="110"
              ry="75"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeDasharray="6 4"
            />

            {/* Marcadores das 4 posições */}
            {ORBIT_POSITIONS.slice(0, 4).map((pos, idx) => (
              <circle
                key={idx}
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill={stepIndex === idx ? '#34d399' : '#475569'}
                className="cursor-pointer"
                onClick={() => handleSliderChange(idx)}
              />
            ))}

            {/* O Sol no Centro */}
            <g transform="translate(150, 110)">
              <circle r="28" fill="#f59e0b" className="animate-pulse" />
              <circle r="20" fill="#fde047" />
              <text
                textAnchor="middle"
                dy="5"
                fontSize="14"
                fontWeight="bold"
                fill="#78350f"
              >
                SOL
              </text>
            </g>

            {/* A Terra com Eixo Inclinado */}
            <g
              transform={`translate(${currentPos.x}, ${currentPos.y})`}
              className="transition-all duration-500 ease-out"
            >
              {/* Linha do Eixo Inclinado */}
              <line
                x1="-8"
                y1="18"
                x2="8"
                y2="-18"
                stroke="#facc15"
                strokeWidth="2.5"
              />
              <circle r="13" fill="#0ea5e9" stroke="#e0f2fe" strokeWidth="2" />
              <path
                d="M-6,-4 Q0,-8 6,-2 Q4,6 -4,5 Z"
                fill="#22c55e"
              />
            </g>
          </svg>

          {/* Painel de Dados da Posição Atual */}
          <div className="w-full max-w-xl mt-4 bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase block">
                {currentPos.label}
              </span>
              <p className="text-base sm:text-lg font-extrabold text-white">
                {currentPos.seasonSouth}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-700 text-right">
              <span className="text-xs text-indigo-300 block">Tempo de viagem:</span>
              <span className="text-lg font-black text-amber-300">
                {currentPos.daysElapsed} dias {stepIndex === 4 ? '+ 6 horas!' : ''}
              </span>
            </div>
          </div>

          {/* Controlo Deslizante (Slider) */}
          <div className="w-full max-w-xl mt-6 space-y-2">
            <label
              htmlFor="orbit-slider"
              className="flex justify-between text-xs font-extrabold text-slate-300"
            >
              <span>Início da Viagem</span>
              <span>Arrasta para mover a Terra ➔</span>
              <span>1 Ano Completo (365d 6h)</span>
            </label>
            <input
              id="orbit-slider"
              type="range"
              min={0}
              max={4}
              step={1}
              value={stepIndex}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>

        {/* Três Características Principais da Translação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100">
            <span className="text-xs font-extrabold uppercase text-indigo-600">
              1. Duração
            </span>
            <p className={`font-bold text-slate-800 mt-1 ${largeTextMode ? 'text-base' : 'text-sm'}`}>
              1 ano terrestre (365 dias e 6 horas), com ajuste no ano bissexto a cada 4 anos.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-100">
            <span className="text-xs font-extrabold uppercase text-purple-600">
              2. Formato da Órbita
            </span>
            <p className={`font-bold text-slate-800 mt-1 ${largeTextMode ? 'text-base' : 'text-sm'}`}>
              Ligeiramente elíptica, ou seja, tem o formato de uma oval suave.
            </p>
            <button
              type="button"
              onClick={() => openGlossary('orbita')}
              className="mt-2 text-xs font-extrabold text-purple-700 hover:underline"
            >
              📖 O que é Órbita?
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-100">
            <span className="text-xs font-extrabold uppercase text-amber-700">
              3. Função nas Estações
            </span>
            <p className={`font-bold text-slate-800 mt-1 ${largeTextMode ? 'text-base' : 'text-sm'}`}>
              Faz a Terra mudar de posição em relação ao Sol ao longo dos meses do ano.
            </p>
          </div>
        </div>
      </div>

      {/* Mini-Laboratório do Ano Bissexto (As 6 horas extras) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-amber-600" />
            <h4 className="text-xl font-black text-slate-800">
              Para onde vão as 6 horas que sobram todos os anos?
            </h4>
          </div>
          <AudioButton
            text="A Terra demora 365 dias e 6 horas para dar uma volta ao Sol. Se juntarmos 6 horas durante 4 anos, formamos 24 horas, que é um dia inteiro a mais em fevereiro: o Ano Bissexto!"
            label="Ouvir segredo do Ano Bissexto"
            size="sm"
          />
        </div>

        <p className={`text-slate-700 font-medium ${largeTextMode ? 'text-lg' : 'text-sm'}`}>
          Clica no botão abaixo para somar os anos e ver como nascem as <strong>24 horas extras</strong> do <strong>Ano Bissexto</strong>!
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              const next = yearsCount < 4 ? yearsCount + 1 : 4;
              setYearsCount(next);
              completeMission(2);
            }}
            disabled={yearsCount >= 4}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-emerald-600 text-white font-extrabold text-sm transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {yearsCount < 4
                ? `Somar +1 Ano (${yearsCount}/4 anos)`
                : '4 Anos Completos = Ano Bissexto!'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setYearsCount(1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>

          <div className="px-4 py-2 rounded-2xl bg-white border-2 border-amber-300 font-extrabold text-sm text-amber-900">
            {yearsCount} {yearsCount === 1 ? 'ano' : 'anos'} × 6 horas ={' '}
            <span className="text-lg text-amber-600">{accumulatedExtraHours} horas</span>
            {accumulatedExtraHours === 24 && ' (🎉 +1 Dia no Calendário: 29 de Fevereiro!)'}
          </div>
        </div>
      </div>
    </div>
  );
};