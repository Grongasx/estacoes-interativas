// src/components/interactive/DayNightScale.tsx
'use client';

import React, { useState } from 'react';
import { Sun, Moon, Scale, Calendar, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { ASTRONOMICAL_EVENTS, AstronomicalEvent } from '@/data/content';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

export const DayNightScale: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();
  const [selectedEventId, setSelectedEventId] = useState<string>(
    ASTRONOMICAL_EVENTS[0].id
  );
  const [visitedEvents, setVisitedEvents] = useState<string[]>([
    ASTRONOMICAL_EVENTS[0].id,
  ]);

  const currentEvent: AstronomicalEvent =
    ASTRONOMICAL_EVENTS.find((ev) => ev.id === selectedEventId) ||
    ASTRONOMICAL_EVENTS[0];

  const dayPercentage = Math.round((currentEvent.dayHours / 24) * 100);
  const nightPercentage = 100 - dayPercentage;
  const isEquinox = currentEvent.dayHours === currentEvent.nightHours;
  const isDayWinning = currentEvent.dayHours > currentEvent.nightHours;
  const isNightWinning = currentEvent.nightHours > currentEvent.dayHours;

  // Ângulo de inclinação da balança visual: negativo desce para a esquerda (Sol), positivo para a direita (Lua)
  const tiltAngle = isDayWinning ? -8 : isNightWinning ? 8 : 0;

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    if (!visitedEvents.includes(id)) {
      const updated = [...visitedEvents, id];
      setVisitedEvents(updated);
      if (updated.length >= 2) {
        completeMission(5);
      }
    }
  };

  const getOppositeEventInfo = () => {
    switch (currentEvent.id) {
      case 'solsticio-verao':
        return {
          title: 'Solstício de Inverno no Hemisfério Norte',
          desc: 'Enquanto aqui temos o dia mais longo do ano, lá no Norte é a noite mais longa do ano (14h de escuridão e apenas 10h de luz)!',
        };
      case 'solsticio-inverno':
        return {
          title: 'Solstício de Verão no Hemisfério Norte',
          desc: 'Enquanto aqui temos a noite mais longa do ano, lá no Norte eles aproveitam o dia mais longo do ano!',
        };
      case 'equinocio-outono':
        return {
          title: 'Equinócio de Primavera no Hemisfério Norte',
          desc: 'Lá também há empate perfeito (12h de dia e 12h de noite), mas dando início à Primavera no Norte!',
        };
      case 'equinocio-primavera':
        return {
          title: 'Equinócio de Outono no Hemisfério Norte',
          desc: 'Lá também o dia e a noite duram exatamente 12 horas, dando início ao Outono no Norte!',
        };
      default:
        return {
          title: 'Oposto no Norte',
          desc: 'As estações e horários de sol são sempre opostos entre os hemisférios Norte e Sul.',
        };
    }
  };

  const oppositeInfo = getOppositeEventInfo();

  return (
    <div className="space-y-8">
      {/* Seletor de Solstícios e Equinócios */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-xs uppercase tracking-wider">
              Experiência 5: A Balança das 24 Horas
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-2">
              Solstícios vs. Equinócios: Quem ganha mais horas?
            </h3>
          </div>
          <AudioButton
            text="As datas que marcam o início oficial de cada estação têm nomes astronómicos especiais: Solstícios, quando o dia ou a noite é o mais longo do ano, e Equinócios, quando o dia e a noite empatam com exatamente 12 horas cada!"
            label="Ouvir explicação"
            size="sm"
          />
        </div>

        {/* Cartões dos 4 Eventos Astronómicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ASTRONOMICAL_EVENTS.map((ev) => {
            const isSelected = ev.id === selectedEventId;
            const isVisited = visitedEvents.includes(ev.id);

            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => handleSelectEvent(ev.id)}
                className={`p-4 rounded-2xl border-4 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md scale-[1.02]'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{ev.emoji}</span>
                    {isVisited && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Visto</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-slate-800 text-base leading-snug">
                    {ev.name}
                  </h4>
                  <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    Marca: {ev.startsSeason}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.dateSouth.split('(')[0].trim()}</span>
                  </span>
                  <span className="font-extrabold text-indigo-700">
                    {ev.dayHours}h / {ev.nightHours}h
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Laboratório Visual: A Balança e a Barra de 24 Horas */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-300 shadow-xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2.5 rounded-2xl bg-white/10 shadow-inner">
              {currentEvent.emoji}
            </span>
            <div>
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                Evento Selecionado: {currentEvent.startsSeason}
              </span>
              <h4 className="text-2xl sm:text-3xl font-black">
                {currentEvent.name}
              </h4>
              <p className="text-xs sm:text-sm text-indigo-200 font-semibold mt-0.5">
                📅 Ocorre por volta de {currentEvent.dateSouth}
              </p>
            </div>
          </div>

          <AudioButton
            text={`${currentEvent.name}. No Hemisfério Sul ocorre em ${currentEvent.dateSouth}. ${currentEvent.whatHappens} São ${currentEvent.dayHours} horas de sol e ${currentEvent.nightHours} horas de noite.`}
            label="Ouvir este evento"
            size="sm"
          />
        </div>

        {/* Barra de Distribuição das 24 Horas */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Luz do Sol (Dia): {currentEvent.dayHours} horas ({dayPercentage}%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-indigo-200">
              <span>Noite (Escuridão): {currentEvent.nightHours} horas ({nightPercentage}%)</span>
              <Moon className="w-4 h-4 text-indigo-300" />
            </span>
          </div>

          {/* Barra Visual Colorida */}
          <div className="w-full h-8 bg-slate-950/80 rounded-full overflow-hidden flex p-1 border-2 border-white/20 shadow-inner">
            <div
              style={{ width: `${dayPercentage}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-l-full flex items-center justify-center text-xs font-black text-amber-950 transition-all duration-700 shadow-md"
            >
              {dayPercentage > 25 && `☀️ ${currentEvent.dayHours}h`}
            </div>
            <div
              style={{ width: `${nightPercentage}%` }}
              className="h-full bg-gradient-to-r from-indigo-700 to-slate-800 rounded-r-full flex items-center justify-center text-xs font-black text-indigo-100 transition-all duration-700 shadow-md"
            >
              {nightPercentage > 25 && `🌙 ${currentEvent.nightHours}h`}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-indigo-200/80 font-bold px-1">
            <span>0h (Meia-noite)</span>
            <span>12h (Meio-dia)</span>
            <span>24h (Total do Dia)</span>
          </div>
        </div>

        {/* A Balança Cósmica Interativa */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-indigo-200">
            <Scale className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-extrabold uppercase tracking-wider">
              Balança das Horas da Terra
            </span>
          </div>

          {/* Haste e Pratos da Balança */}
          <div className="relative max-w-md mx-auto py-4">
            {/* Haste Central de Apoio */}
            <div className="w-3 h-24 bg-gradient-to-b from-slate-300 to-slate-500 mx-auto rounded-t-full shadow-lg relative z-0">
              <div className="w-8 h-8 rounded-full bg-amber-400 border-4 border-slate-900 absolute -top-4 left-1/2 -translate-x-1/2 shadow-md flex items-center justify-center text-xs font-black text-slate-900">
                ⚖️
              </div>
            </div>

            {/* Braço Inclinável da Balança */}
            <div
              style={{ transform: `rotate(${tiltAngle}deg)` }}
              className="w-full h-3 bg-gradient-to-r from-amber-400 via-slate-200 to-indigo-400 rounded-full shadow-lg transition-transform duration-700 ease-out origin-center absolute top-7 left-0 right-0 z-10 flex items-center justify-between px-2"
            >
              {/* Prato Esquerdo - Dia */}
              <div
                style={{ transform: `rotate(${-tiltAngle}deg)` }}
                className="transition-transform duration-700 -translate-y-1"
              >
                <div
                  className={`px-4 py-3 rounded-2xl border-2 transition-all ${
                    isDayWinning
                      ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-lg scale-110 font-black'
                      : isEquinox
                      ? 'bg-amber-300/80 text-amber-950 border-amber-200 font-extrabold'
                      : 'bg-white/15 text-amber-200 border-white/20 font-bold opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <Sun className="w-4 h-4 fill-current" />
                    <span>Luz Solar</span>
                  </div>
                  <div className="text-xl sm:text-2xl mt-0.5">
                    {currentEvent.dayHours}h
                  </div>
                </div>
              </div>

              {/* Prato Direito - Noite */}
              <div
                style={{ transform: `rotate(${-tiltAngle}deg)` }}
                className="transition-transform duration-700 -translate-y-1"
              >
                <div
                  className={`px-4 py-3 rounded-2xl border-2 transition-all ${
                    isNightWinning
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg scale-110 font-black'
                      : isEquinox
                      ? 'bg-indigo-800/80 text-indigo-100 border-indigo-300 font-extrabold'
                      : 'bg-white/15 text-indigo-200 border-white/20 font-bold opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <Moon className="w-4 h-4 fill-current" />
                    <span>Noite</span>
                  </div>
                  <div className="text-xl sm:text-2xl mt-0.5">
                    {currentEvent.nightHours}h
                  </div>
                </div>
              </div>
            </div>

            {/* Base da Balança */}
            <div className="w-24 h-4 bg-slate-600 rounded-full mx-auto shadow-md -mt-2" />
          </div>

          {/* Veredito da Balança */}
          <div className="inline-block px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-md">
            {isEquinox && (
              <span className="text-emerald-300 font-black text-sm sm:text-base flex items-center justify-center gap-2">
                <span>🤝</span>
                <span>Empate Perfeito: O Dia e a Noite têm 12 Horas cada!</span>
              </span>
            )}
            {isDayWinning && (
              <span className="text-amber-300 font-black text-sm sm:text-base flex items-center justify-center gap-2">
                <span>☀️</span>
                <span>O Dia Ganhou! É o dia mais longo do ano (Solstício de Verão)!</span>
              </span>
            )}
            {isNightWinning && (
              <span className="text-sky-300 font-black text-sm sm:text-base flex items-center justify-center gap-2">
                <span>🌙</span>
                <span>A Noite Ganhou! É a noite mais longa do ano (Solstício de Inverno)!</span>
              </span>
            )}
          </div>
        </div>

        {/* Cartões Explicativos: Hemisfério Sul vs Hemisfério Norte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-2">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4" />
              <h5 className="font-extrabold text-sm uppercase tracking-wide">
                No Hemisfério Sul (Onde estamos)
              </h5>
            </div>
            <p
              className={`text-slate-100 font-medium leading-relaxed ${
                largeTextMode ? 'text-lg' : 'text-sm'
              }`}
            >
              {currentEvent.whatHappens}
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-4 h-4" />
              <h5 className="font-extrabold text-sm uppercase tracking-wide">
                No Hemisfério Norte (Ao mesmo tempo!)
              </h5>
            </div>
            <p
              className={`text-slate-100 font-medium leading-relaxed ${
                largeTextMode ? 'text-lg' : 'text-sm'
              }`}
            >
              {oppositeInfo.desc}
            </p>
          </div>
        </div>

        {/* Curiosidade Científica com Termos do Glossário */}
        <div className="bg-indigo-900/50 rounded-2xl p-5 border border-indigo-400/30 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Origem da Palavra
            </span>
            <p className="text-xs sm:text-sm text-indigo-100">
              {currentEvent.name.includes('Equinócio') ? (
                <>
                  <strong>Equinócio</strong> vem do latim <em>aequus</em> (igual) e <em>nox</em> (noite). Significa literalmente &ldquo;noites iguais aos dias&rdquo;!
                </>
              ) : (
                <>
                  <strong>Solstício</strong> vem do latim <em>solstitium</em> (sol parado), pois nessa data a altura máxima que o Sol atinge no céu parece estagnar antes de recomeçar a inverter!
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openGlossary('rotacao')}
              className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Rotação</span>
            </button>
            <button
              type="button"
              onClick={() => openGlossary('hemisferio')}
              className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Hemisfério</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};