// src/components/interactive/OrbitSimulator.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Orbit, PlusCircle, RotateCcw, Play, Pause, SkipBack, SkipForward, Sparkles } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

const MILESTONES = [
  { label: 'Dezembro', season: 'Verão no Brasil ☀️', day: 0, detail: 'O nosso lado da Terra ganha sol direto e bem quentinho!' },
  { label: 'Março', season: 'Outono no Brasil 🍂', day: 91, detail: 'O ventinho fica fresco e as folhas começam a amarelar e cair.' },
  { label: 'Junho', season: 'Inverno no Brasil ❄️', day: 182, detail: 'O nosso lado fica virado para longe do Sol: faz frio de casaco!' },
  { label: 'Setembro', season: 'Primavera no Brasil 🌸', day: 273, detail: 'O Sol volta a esquentar e os jardins se enchem de flores coloridas!' },
];

const STAR_FIELD = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 47 + 13) % 1000,
  y: (i * 83 + 29) % 520,
  r: i % 7 === 0 ? 2 : i % 3 === 0 ? 1.4 : 0.8,
  delay: `${(i % 9) * -0.37}s`,
}));

export const OrbitSimulator: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();
  const [progress, setProgress] = useState(0); // 0–4: volta completa
  const [yearsCount, setYearsCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showLabels, setShowLabels] = useState(true);

  const angle = progress / 4 * Math.PI * 2 - Math.PI / 2;
  const earth = useMemo(() => ({ x: 500 + Math.cos(angle) * 320, y: 260 + Math.sin(angle) * 190 }), [angle]);
  const stageIndex = Math.min(3, Math.floor((progress % 4) + 0.00001));
  const milestone = MILESTONES[stageIndex];
  const day = Math.min(365, Math.round(progress / 4 * 365));
  const extraHours = yearsCount * 6;

  const setPosition = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(4, next));
    setProgress(clamped);
  }, []);

  useEffect(() => {
    if (progress >= 4) {
      setPlaying(false);
      completeMission(2);
    }
  }, [progress, completeMission]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress(current => {
        const next = current + 0.012 * speed;
        if (next >= 4) {
          window.clearInterval(id);
          return 4;
        }
        return next;
      });
    }, 32);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  const reset = () => { setPlaying(false); setPosition(0); };
  const activeSeason = progress >= 4 ? 'Uma volta inteira no Sol! 🌍🎉' : milestone.season;

  return (
    <div className="space-y-6 sm:space-y-9">
      {/* SIMULADOR PRINCIPAL DA ÓRBITA */}
      <section className="relative isolate overflow-hidden rounded-3xl sm:rounded-[2rem] border-3 sm:border-4 border-indigo-300/40 bg-slate-950 p-4 sm:p-7 lg:p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(79,70,229,0.23),transparent_55%),radial-gradient(ellipse_at_5%_100%,rgba(14,165,233,0.13),transparent_40%)]" />
        
        {/* Cabeçalho do Simulador */}
        <div className="mb-4 sm:mb-7 flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300/30 bg-indigo-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-200">
              <Orbit size={14} /> Missão 2 · Nave Espacial da Terra
            </span>
            <h3 className="mt-2 text-xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Pilote a Terra ao Redor do Sol!
            </h3>
            <p className="mt-1.5 max-w-xl text-xs sm:text-base leading-relaxed text-slate-300">
              Aperte o <strong>Play</strong> para ver a Terra viajar o ano inteiro! Você também pode arrastar o controle com o dedo para passear pelas estações.
            </p>
          </div>
          <AudioButton text="Pilote a Terra ao redor do Sol! Use os botões para fazer a Terra passear pelo espaço, ver como as estações mudam durante o ano e completar uma volta inteirinha de 365 dias!" label="Ouvir instruções" size="sm" />
        </div>

        {/* CÂMERA ESPACIAL DA ÓRBITA (SVG RESPONSIVO) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#050817] shadow-inner shadow-black/50">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(99,102,241,0.05)_50%,transparent_80%)]" />
          <svg viewBox="0 0 1000 520" role="img" aria-label={`Simulação da órbita da Terra. Dia ${day}. ${activeSeason}`} className="relative block h-auto w-full select-none touch-pan-y">
            <defs>
              <radialGradient id="sunCore"><stop offset="0%" stopColor="#fff7bd" /><stop offset="45%" stopColor="#fbbf24" /><stop offset="78%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" stopOpacity=".15" /></radialGradient>
              <radialGradient id="earthOcean" cx="30%" cy="25%" r="80%"><stop offset="0%" stopColor="#7dd3fc" /><stop offset="45%" stopColor="#0284c7" /><stop offset="100%" stopColor="#082f49" /></radialGradient>
              <linearGradient id="nightSide"><stop offset="0%" stopColor="#020617" stopOpacity=".05" /><stop offset="100%" stopColor="#020617" stopOpacity=".86" /></linearGradient>
              <filter id="sunGlow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="15" /></filter>
              <filter id="earthGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" /></filter>
              <clipPath id="earthClip"><circle r="28" /></clipPath>
            </defs>

            {/* Estrelas piscantes */}
            {STAR_FIELD.map((star, i) => (
              <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#dbeafe" opacity={i % 4 === 0 ? .9 : .45}>
                <animate attributeName="opacity" values=".25;.9;.25" dur={`${2.4 + (i % 5) * .7}s`} begin={star.delay} repeatCount="indefinite" />
              </circle>
            ))}

            {/* Pista Oval da Órbita */}
            <ellipse cx="500" cy="260" rx="320" ry="190" fill="none" stroke="#818cf8" strokeOpacity=".13" strokeWidth="22" />
            <ellipse cx="500" cy="260" rx="320" ry="190" fill="none" stroke="#818cf8" strokeOpacity=".72" strokeWidth="2" strokeDasharray="5 10" />
            <ellipse cx="500" cy="260" rx="320" ry="190" fill="none" stroke="#c4b5fd" strokeOpacity=".16" strokeWidth="1" />

            {/* O Sol no Centro */}
            <circle cx="500" cy="260" r="75" fill="#f59e0b" opacity=".2" filter="url(#sunGlow)" />
            <circle cx="500" cy="260" r="52" fill="url(#sunCore)" />
            <circle cx="500" cy="260" r="40" fill="none" stroke="#fde68a" strokeOpacity=".55" strokeWidth="1.5">
              <animate attributeName="r" values="40;46;40" dur="4s" repeatCount="indefinite" />
            </circle>
            <text x="500" y="340" textAnchor="middle" fill="#fcd34d" fontSize="16" fontWeight="900" letterSpacing="4">SOL</text>

            {/* Marcos das 4 Estações na Órbita */}
            {MILESTONES.map((m, i) => {
              const a = i / 4 * Math.PI * 2 - Math.PI / 2;
              const x = 500 + Math.cos(a) * 320;
              const y = 260 + Math.sin(a) * 190;
              const selected = Math.abs(progress - i) < .16 || (progress >= 4 && i === 0);
              return (
                <g
                  key={m.label}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ir para ${m.label}`}
                  className="cursor-pointer"
                  onClick={() => { setPlaying(false); setPosition(i); }}
                >
                  <circle cx={x} cy={y} r="20" fill={selected ? '#34d399' : '#818cf8'} opacity={selected ? .25 : .1} />
                  <circle cx={x} cy={y} r={selected ? 8 : 6} fill={selected ? '#6ee7b7' : '#a5b4fc'} stroke="#e0e7ff" strokeWidth="2" />
                  {showLabels && (
                    <text
                      x={x}
                      y={y + (i === 1 ? -24 : i === 3 ? 30 : 28)}
                      textAnchor="middle"
                      fill={selected ? '#a7f3d0' : '#cbd5e1'}
                      fontSize="15"
                      fontWeight={selected ? 900 : 700}
                    >
                      {m.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* A Terra com eixo inclinado */}
            <g transform={`translate(${earth.x} ${earth.y})`} className="transition-transform duration-100 ease-linear">
              <circle r="38" fill="#38bdf8" opacity=".22" filter="url(#earthGlow)" />
              <g clipPath="url(#earthClip)">
                <circle r="28" fill="url(#earthOcean)" />
                <path d="M-25,-15 L-15,-25 -4,-20 2,-12 -4,-5 -13,-7 -18,2 -26,-1Z M3,-22 L15,-18 21,-8 14,-2 9,-8 1,-5 -3,-13Z M-7,2 L5,-2 14,7 8,17 0,24 -7,14 -14,9Z M17,10 L25,7 29,19 19,26 12,19Z" fill="#4ade80" opacity=".95" />
                <circle r="28" fill="url(#nightSide)" />
                <path d="M-5,-29 Q-15,0 -4,29" fill="none" stroke="#bae6fd" strokeOpacity=".35" strokeWidth="1.5" />
              </g>
              <circle r="28" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
              {/* Eixo Inclinado Amarelo */}
              <line x1="-20" y1="30" x2="20" y2="-30" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r="3" fill="#fef3c7" />
            </g>

            <path d={`M ${earth.x} ${earth.y} L ${earth.x + 45} ${earth.y - 42}`} stroke="#6ee7b7" strokeOpacity=".65" strokeDasharray="3 5" strokeWidth="1.5" />
            <text x="30" y="38" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1.5">PISTA DO ESPAÇO · DESENHO ILUSTRATIVO</text>
          </svg>

          {/* Rodapé da Câmera Espacial */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-slate-900/90 px-3 py-2.5 sm:px-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#4ade80]" />
              <span>A Terra viaja meio deitadinha!</span>
            </div>
            <button
              type="button"
              onClick={() => setShowLabels(v => !v)}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold text-slate-200 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              {showLabels ? 'Ocultar meses' : 'Mostrar meses'}
            </button>
          </div>
        </div>

        {/* ATALHOS RÁPIDOS TOUCH DAS 4 ESTAÇÕES (MUITO FÁCIL NO SMARTPHONE) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {MILESTONES.map((m, i) => {
            const isSelected = Math.abs(progress - i) < .25 || (progress >= 4 && i === 0);
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => { setPlaying(false); setPosition(i); }}
                className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-black border-white shadow-lg'
                    : 'bg-white/10 text-white font-bold border-white/15 hover:bg-white/20'
                }`}
              >
                <span className="text-xs sm:text-sm block leading-tight">{m.label}</span>
                <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-slate-950' : 'text-slate-300'}`}>
                  {i === 0 && '☀️ Verão'}
                  {i === 1 && '🍂 Outono'}
                  {i === 2 && '❄️ Inverno'}
                  {i === 3 && '🌸 Primavera'}
                </span>
              </button>
            );
          })}
        </div>

        {/* PAINEL DE CONTROLE DE VOO */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-indigo-300">
                  Onde a Terra está agora:
                </p>
                <h4 className="mt-0.5 text-lg sm:text-xl font-black text-white">
                  {activeSeason}
                </h4>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {progress >= 4
                    ? '🎉 Viva! A Terra completou uma volta inteirinha de 1 ano ao redor do Sol!'
                    : milestone.detail}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 px-3.5 py-2 text-right shrink-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  Dias de Viagem
                </span>
                <span className="text-xl sm:text-2xl font-black tabular-nums text-amber-200">
                  {day} <span className="text-xs font-bold text-amber-300">dias</span>
                </span>
                {progress >= 4 && (
                  <span className="block text-[11px] font-black text-amber-300">+ 6 horas extras!</span>
                )}
              </div>
            </div>

            {/* Controle Deslizante com Toque Fácil */}
            <div className="space-y-1.5 pt-1">
              <label htmlFor="orbit-progress" className="flex justify-between gap-3 text-xs font-bold text-slate-300">
                <span>Início da volta</span>
                <span>Arrasta para passear</span>
                <span>Fim do ano</span>
              </label>
              <input
                id="orbit-progress"
                type="range"
                min="0"
                max="4"
                step="0.01"
                value={progress}
                onChange={e => { setPlaying(false); setPosition(Number(e.target.value)); }}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-400"
              />
            </div>

            {/* Botões Grandes e Fáceis para o Polegar no Smartphone */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPlaying(v => !v)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 px-5 py-3 text-sm font-black text-slate-950 shadow-lg cursor-pointer min-h-[44px]"
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
                <span>{playing ? 'Pausar Viagem' : 'Iniciar Viagem'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPosition(Math.max(0, Math.floor(progress) - 1))}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 px-3.5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/10 active:scale-95 cursor-pointer min-h-[44px]"
              >
                <SkipBack size={15} /> <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={() => { setPlaying(false); setPosition(Math.min(4, Math.floor(progress) + 1)); }}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 px-3.5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/10 active:scale-95 cursor-pointer min-h-[44px]"
              >
                <span>Avançar</span> <SkipForward size={15} />
              </button>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-300 hover:bg-white/10 active:scale-95 cursor-pointer min-h-[44px]"
              >
                <RotateCcw size={15} /> <span>Zerar</span>
              </button>
            </div>
          </div>

          {/* Cartões de Estatísticas de Translação */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-3.5 sm:p-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-200">
                1 Volta (Translação)
              </span>
              <p className="mt-0.5 text-xl sm:text-2xl font-black text-white">
                365 dias <span className="text-xs font-bold text-sky-200">+ 6h</span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                É o tempo que o nosso planeta gasta para passear em volta do Sol!
              </p>
            </div>

            <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 p-3.5 sm:p-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-violet-200">
                Progresso da Volta
              </span>
              <p className="mt-0.5 text-xl sm:text-2xl font-black tabular-nums text-white">
                {Math.round(progress / 4 * 100)}%
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-150"
                  style={{ width: `${progress / 4 * 100}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-300">
                {progress >= 4 ? 'Missão 2 concluída com sucesso!' : 'Continue viajando até dar a volta toda!'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 FATOS CIENTÍFICOS DESCOMPLICADOS */}
      <section className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 sm:p-5 shadow-sm">
          <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 text-xl">
            🚀
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">01 · A Viagem</span>
          <p className={`mt-1 font-bold text-slate-800 ${largeTextMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
            A Terra nunca para de voar pelo espaço. Para dar 1 volta inteira no Sol, ela demora 1 ano todinho!
          </p>
        </article>

        <article className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4 sm:p-5 shadow-sm">
          <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 text-xl">
            🪐
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-violet-700">02 · A Pista (Órbita)</span>
          <p className={`mt-1 font-bold text-slate-800 ${largeTextMode ? 'text-base' : 'text-sm'}`}>
            A estrada da Terra no espaço é quase um círculo perfeitinho, parecendo uma pista de trenzinho!
          </p>
        </article>

        <article className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 sm:p-5 shadow-sm">
          <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 text-xl">
            ☀️
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">03 · As Estações</span>
          <p className={`mt-1 font-bold text-slate-800 ${largeTextMode ? 'text-base' : 'text-sm'}`}>
            Não é ficar perto ou longe do Sol que muda o clima: é a Terra viajar meio deitadinha!
          </p>
        </article>
      </section>

      {/* MINI-LABORATÓRIO DO ANO BISSEXTO */}
      <section className="relative overflow-hidden rounded-3xl border-3 sm:border-4 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 sm:p-7 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-amber-400 p-2.5 text-amber-950 text-2xl shrink-0 shadow-md">
              📅
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Jogo do Ano Bissexto
              </span>
              <h4 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                Para onde vão as 6 horas extras todo ano?
              </h4>
              <p className={`mt-1 text-slate-600 font-medium ${largeTextMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                Toque no botão para somar um ano de cada vez e veja a mágica acontecer depois de 4 anos!
              </p>
            </div>
          </div>
          <AudioButton text="A Terra demora cerca de 365 dias e mais 6 horas para dar uma volta ao Sol. Se juntarmos 6 horas durante 4 anos seguidos, temos 24 horas, ou seja, um dia inteirinho a mais no calendário: o dia 29 de fevereiro!" label="Ouvir sobre o ano bissexto" size="sm" />
        </div>

        {/* Barra de Progresso das Horas */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-amber-950">
            <span>Horas que sobraram guardadas:</span>
            <span className="text-amber-800 font-mono text-sm">{extraHours} de 24 horas</span>
          </div>

          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-4 flex-1 rounded-full transition-all duration-500 ${
                  yearsCount > i
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-md scale-105'
                    : 'bg-amber-100 border border-amber-200'
                }`}
              />
            ))}
          </div>

          {/* Botões dos 4 Anos com Toque Fácil */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[0, 1, 2, 3, 4].map(y => (
              <button
                type="button"
                key={y}
                onClick={() => setYearsCount(y)}
                className={`rounded-2xl px-3.5 py-2 text-xs font-black transition-all cursor-pointer active:scale-95 ${
                  yearsCount === y
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'border border-amber-300 bg-white text-amber-900 hover:bg-amber-100'
                }`}
              >
                {y === 0 ? 'Começar' : `${y}º ano (+6h)`}
              </button>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              setYearsCount(y => Math.min(4, y + 1));
              completeMission(2);
            }}
            disabled={yearsCount >= 4}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 px-5 py-3 text-sm font-black text-white shadow-md transition-all disabled:bg-emerald-600 cursor-pointer min-h-[44px]"
          >
            <PlusCircle size={18} />
            <span>{yearsCount >= 4 ? 'Dia 29 Criado com Sucesso!' : 'Somar +1 Ano (6h)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setYearsCount(0)}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-amber-300 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-amber-50 active:scale-95 transition-colors cursor-pointer min-h-[44px]"
          >
            <RotateCcw size={15} /> <span>Zerar</span>
          </button>
        </div>

        {/* Resultado Divertido da Matemática */}
        <div className="mt-4 rounded-2xl border-2 border-amber-200 bg-white/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <p className="text-[11px] font-black uppercase text-amber-800">Cálculo das Horinhas:</p>
            <p className="text-base sm:text-lg font-black text-slate-900">
              {yearsCount} {yearsCount === 1 ? 'ano' : 'anos'} × 6 horas = <span className="text-amber-600">{extraHours} horas</span>
            </p>
          </div>

          {extraHours === 24 ? (
            <div className="animate-bounce rounded-2xl bg-emerald-100 border-2 border-emerald-400 px-4 py-2 text-xs sm:text-sm font-black text-emerald-950">
              🎉 Criamos o dia 29 de fevereiro! Ano Bissexto!
            </div>
          ) : (
            <p className="text-xs font-bold text-slate-500">
              Faltam {24 - extraHours} horas para completar 1 dia no calendário.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
