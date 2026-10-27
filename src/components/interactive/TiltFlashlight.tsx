// src/components/interactive/TiltFlashlight.tsx
'use client';

import React, { useState } from 'react';
import { Sun, ThermometerSun, ThermometerSnowflake } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

export const TiltFlashlight: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();
  const [isTilted, setIsTilted] = useState(true);
  const [selectedBeam, setSelectedBeam] = useState<'direct' | 'slanted'>('direct');

  const handleToggleTilt = (tilted: boolean) => {
    setIsTilted(tilted);
    completeMission(3);
  };

  const handleSelectBeam = (beam: 'direct' | 'slanted') => {
    setSelectedBeam(beam);
    completeMission(3);
  };

  return (
    <div className="space-y-8">
      {/* Parte 1: Planeta "Em Pé" (0°) vs Planeta Inclinado (23,5°) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-extrabold text-xs uppercase tracking-wider">
              Experiência 3: A Inclinação de 23,5°
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-2">
              E se a Terra girasse totalmente &ldquo;em pé&rdquo;?
            </h3>
          </div>
          <AudioButton
            text="Se o nosso planeta girasse totalmente em pé, não teríamos estações do ano como conhecemos! O eixo imaginário da Terra é inclinado em cerca de 23 vírgula 5 graus."
            label="Ouvir explicação"
            size="sm"
          />
        </div>

        {/* Botões de Alternância de Eixo */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleToggleTilt(false)}
            className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all border-2 ${
              !isTilted
                ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            🤖 Testar Terra &ldquo;Em Pé&rdquo; (0°)
          </button>

          <button
            type="button"
            onClick={() => handleToggleTilt(true)}
            className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all border-2 ${
              isTilted
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            🌍 Terra Real Inclinada (23,5°)
          </button>

          <button
            type="button"
            onClick={() => openGlossary('eixo-terrestre')}
            className="px-4 py-3 rounded-2xl font-bold text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 ml-auto"
          >
            📖 O que é o Eixo Terrestre?
          </button>
        </div>

        {/* Visualizador da Inclinação */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white border-4 border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Linha vertical de referência */}
              <div className="absolute top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-600" />

              {/* Globo com rotação de eixo */}
              <div
                style={{
                  transform: isTilted ? 'rotate(23.5deg)' : 'rotate(0deg)',
                }}
                className="relative w-28 h-28 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.3)] border-4 border-sky-200 transition-transform duration-500"
              >
                {/* Eixo Terrestre */}
                <div className="absolute -top-8 -bottom-8 w-1 bg-amber-400 rounded-full" />
                <span className="text-5xl select-none">🌍</span>
              </div>
            </div>
            <span className="mt-4 px-3 py-1 rounded-full bg-slate-800 text-amber-300 font-extrabold text-xs">
              Ângulo atual do eixo: {isTilted ? '23,5° (Inclinado)' : '0° (Em pé)'}
            </span>
          </div>

          <div className="space-y-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-lg font-black text-amber-300">
              {isTilted
                ? '✅ Com 23,5°: Temos as 4 Estações!'
                : '⚠️ Sem inclinação (0°): Adeus Estações!'}
            </h4>
            <p className={`text-slate-200 leading-relaxed ${largeTextMode ? 'text-base' : 'text-sm'}`}>
              {isTilted
                ? 'Como a Terra está inclinada em 23,5°, uma metade do planeta inclina-se mais para o Sol (recebendo raios diretos e quentes), enquanto a outra metade recebe raios mais inclinados e frios!'
                : 'Se a Terra girasse totalmente em pé, a luz do Sol bateria sempre com o mesmo ângulo nos mesmos lugares o ano inteiro. Não existiria mudança entre verão, outono, inverno e primavera!'}
            </p>
          </div>
        </div>
      </div>

      {/* Parte 2: Simulador da Lanterna Solar (Luz Direta vs Luz Inclinada) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
              Laboratório da Lanterna Solar
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-2">
              Como o ângulo dos raios solares muda a temperatura?
            </h3>
          </div>
          <AudioButton
            text="Quando a luz solar chega direta, os raios ficam concentrados numa área menor, trazendo mais energia e dias mais quentes de Verão. Quando a luz chega inclinada, os raios espalham-se numa área maior, gerando menos energia e dias mais frios de Inverno!"
            label="Ouvir comparação"
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSelectBeam('direct')}
            className={`p-5 rounded-2xl border-4 text-left transition-all flex items-center gap-4 ${
              selectedBeam === 'direct'
                ? 'bg-amber-50 border-amber-400 shadow-md'
                : 'bg-slate-50 border-slate-200 hover:bg-amber-50/40'
            }`}
          >
            <ThermometerSun className="w-10 h-10 text-amber-500 shrink-0" />
            <div>
              <span className="text-xs font-extrabold uppercase text-amber-700">
                1. Luz Solar Direta (Perpendicular)
              </span>
              <h4 className="text-lg font-black text-slate-800">
                Raios Concentrados = VERÃO ☀️
              </h4>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectBeam('slanted')}
            className={`p-5 rounded-2xl border-4 text-left transition-all flex items-center gap-4 ${
              selectedBeam === 'slanted'
                ? 'bg-sky-50 border-sky-400 shadow-md'
                : 'bg-slate-50 border-slate-200 hover:bg-sky-50/40'
            }`}
          >
            <ThermometerSnowflake className="w-10 h-10 text-sky-500 shrink-0" />
            <div>
              <span className="text-xs font-extrabold uppercase text-sky-700">
                2. Luz Solar Inclinada (Oblíqua)
              </span>
              <h4 className="text-lg font-black text-slate-800">
                Raios Espalhados = INVERNO ❄️
              </h4>
            </div>
          </button>
        </div>

        {/* Demonstração Visual do Feixe de Luz */}
        <div
          className={`rounded-3xl p-6 border-4 transition-colors ${
            selectedBeam === 'direct'
              ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300'
              : 'bg-gradient-to-br from-sky-50 to-indigo-100 border-sky-300'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-slate-500">
                Tipo de Luz Solar
              </span>
              <p className="text-xl font-black text-slate-800">
                {selectedBeam === 'direct'
                  ? 'Direta (Perpendicular)'
                  : 'Inclinada (Oblíqua)'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-slate-500">
                Ângulo de Incidência no Chão
              </span>
              <p className="text-base font-bold text-slate-800">
                {selectedBeam === 'direct'
                  ? '🎯 Raios concentrados em menor área'
                  : '📐 Raios espalhados em maior área'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-slate-500">
                Efeito no Clima
              </span>
              <p
                className={`text-base font-black ${
                  selectedBeam === 'direct' ? 'text-orange-700' : 'text-sky-800'
                }`}
              >
                {selectedBeam === 'direct'
                  ? '🔥 Mais energia, dias mais quentes (Verão)'
                  : '🧊 Menos energia, dias mais frios (Inverno)'}
              </p>
            </div>
          </div>

          {/* Barra visual representando a área atingida no solo */}
          <div className="mt-6 pt-5 border-t border-slate-300/60 flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>
                Tamanho da mancha de luz no chão com a mesma quantidade de sol:
              </span>
            </div>
            {selectedBeam === 'direct' ? (
              <div className="w-36 h-6 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 shadow-md flex items-center justify-center text-xs font-black text-white">
                Área Pequena = Muito Calor!
              </div>
            ) : (
              <div className="w-72 sm:w-96 h-6 rounded-full bg-gradient-to-r from-sky-300 via-amber-200 to-sky-300 shadow-inner flex items-center justify-center text-xs font-black text-slate-700">
                Área Muito Grande = Calor Espalhado e Fraco!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};