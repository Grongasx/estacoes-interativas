// src/components/interactive/SeasonsCompare.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Sun, Clock, CloudSun, Sparkles, CheckCircle2, ArrowRightLeft, BookOpen } from 'lucide-react';
import { SEASONS_DATA, SeasonDetail } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

const OPPOSITE_SEASON_MAP: Record<
  SeasonDetail['id'],
  SeasonDetail['id']
> = {
  verao: 'inverno',
  inverno: 'verao',
  primavera: 'outono',
  outono: 'primavera',
};

export const SeasonsCompare: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();
  const [selectedSouthId, setSelectedSouthId] =
    useState<SeasonDetail['id']>('verao');
  const [exploredSeasons, setExploredSeasons] = useState<string[]>(['verao']);

  const southSeason =
    SEASONS_DATA.find((s) => s.id === selectedSouthId) || SEASONS_DATA[1];
  const northSeasonId = OPPOSITE_SEASON_MAP[selectedSouthId];
  const northSeason =
    SEASONS_DATA.find((s) => s.id === northSeasonId) || SEASONS_DATA[3];

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

  return (
    <div className="space-y-8">
      {/* Parte 1: Simulador de Oposição dos Hemisférios */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
              Experiência 4: O Espelho dos Hemisférios
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-2">
              Escolhe a estação no Hemisfério Sul e vê o que acontece no Norte!
            </h3>
          </div>
          <AudioButton
            text="Devido à inclinação do eixo da Terra, quando o Hemisfério Sul recebe luz solar direta, o Hemisfério Norte recebe luz inclinada. Por isso, as estações são sempre opostas nos dois lados do planeta!"
            label="Ouvir explicação"
            size="sm"
          />
        </div>

        {/* Botões das 4 Estações */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEASONS_DATA.map((season) => {
            const isSelected = season.id === selectedSouthId;
            const isVisited = exploredSeasons.includes(season.id);

            return (
              <button
                key={season.id}
                type="button"
                onClick={() => handleSelectSeason(season.id)}
                className={`p-4 rounded-2xl border-4 text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                    : 'bg-slate-50 hover:bg-indigo-50/50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-3xl">{season.emoji}</span>
                  {isVisited && (
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isSelected ? 'text-emerald-300' : 'text-emerald-500'
                      }`}
                    />
                  )}
                </div>
                <div>
                  <span
                    className={`text-[11px] font-bold uppercase block ${
                      isSelected ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    Estação no Sul
                  </span>
                  <span className="text-lg font-black">{season.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Janela Dupla: Hemisfério Sul vs Hemisfério Norte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Cartão Hemisfério Sul */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-4 border-indigo-400 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400 text-indigo-200 text-xs font-extrabold flex items-center gap-1.5">
                <span>👇</span>
                <span>Metade de Baixo: Hemisfério Sul</span>
              </span>
              <span className="text-3xl">{southSeason.emoji}</span>
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase text-amber-300 tracking-wider">
                Estação Atual
              </span>
              <h4 className="text-3xl font-black">{southSeason.name}</h4>
              <p className="text-xs text-indigo-200 mt-1">{southSeason.shortDesc}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/15 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Raios de Sol: </strong>
                  <span>{southSeason.sunRays}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CloudSun className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-200">Clima & Natureza: </strong>
                  <span>{southSeason.climate} {southSeason.phenomenon}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-200">Dias e Noites: </strong>
                  <span>{southSeason.dayNight}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cartão Hemisfério Norte (Oposto!) */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white border-4 border-purple-400 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-extrabold flex items-center gap-1.5">
                <span>👆</span>
                <span>Metade de Cima: Hemisfério Norte</span>
              </span>
              <span className="text-3xl">{northSeason.emoji}</span>
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase text-purple-300 tracking-wider">
                Estação Oposta Simultânea
              </span>
              <h4 className="text-3xl font-black">{northSeason.name}</h4>
              <p className="text-xs text-purple-200 mt-1">{northSeason.shortDesc}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/15 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Raios de Sol: </strong>
                  <span>{northSeason.sunRays}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CloudSun className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-200">Clima & Natureza: </strong>
                  <span>{northSeason.climate} {northSeason.phenomenon}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-200">Dias e Noites: </strong>
                  <span>{northSeason.dayNight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo do Espelho */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-6 h-6 text-amber-700 shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-amber-950">
              Quando no Sul é <strong>{southSeason.name}</strong> ({southSeason.emoji}), no Norte é exatamente <strong>{northSeason.name}</strong> ({northSeason.emoji})!
            </p>
          </div>

          <button
            type="button"
            onClick={() => openGlossary('hemisferio')}
            className="px-4 py-2 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-extrabold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>O que é Hemisfério?</span>
          </button>
        </div>
      </div>
    </div>
  );
};
