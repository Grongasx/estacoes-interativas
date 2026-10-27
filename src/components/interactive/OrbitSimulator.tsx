'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Orbit, PlusCircle, RotateCcw, Play, Pause, SkipBack, SkipForward, Sparkles } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

const MILESTONES = [
  { label: 'Dezembro', season: 'Início do verão no Hemisfério Sul ☀️', day: 0, detail: 'O Hemisfério Sul está inclinado em direção ao Sol.' },
  { label: 'Março', season: 'Início do outono no Hemisfério Sul 🍂', day: 91, detail: 'A posição da Terra na órbita muda a distribuição de luz entre os hemisférios.' },
  { label: 'Junho', season: 'Início do inverno no Hemisfério Sul ❄️', day: 182, detail: 'O Hemisfério Sul está inclinado para longe do Sol.' },
  { label: 'Setembro', season: 'Início da primavera no Hemisfério Sul 🌸', day: 273, detail: 'A iluminação volta a mudar ao longo da órbita terrestre.' },
];

const STAR_FIELD = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 47 + 13) % 1000,
  y: (i * 83 + 29) % 520,
  r: i % 7 === 0 ? 2 : i % 3 === 0 ? 1.4 : 0.8,
  delay: `${(i % 9) * -0.37}s`,
}));

export const OrbitSimulator: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();
  const [progress, setProgress] = useState(0); // 0–4: one complete revolution
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
  const activeSeason = progress >= 4 ? 'Uma volta completa! 🌍' : milestone.season;

  return (
    <div className="space-y-7 sm:space-y-9">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-indigo-300/50 bg-slate-950 p-4 text-white shadow-2xl shadow-indigo-950/20 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(79,70,229,0.23),transparent_55%),radial-gradient(ellipse_at_5%_100%,rgba(14,165,233,0.13),transparent_40%)]" />
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4 sm:mb-7">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.18em] text-indigo-200"><Orbit size={14} /> Experiência 2 · Laboratório espacial</span>
            <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">Pilote a Terra pela órbita</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">Explore a translação terrestre. Arraste o controle, escolha uma estação ou inicie a viagem ao redor do Sol.</p>
          </div>
          <AudioButton text="Explore a translação terrestre. Use os controles para mover a Terra ao redor do Sol, observar as estações do ano e completar uma volta." label="Ouvir instruções" size="sm" />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#050817] shadow-inner shadow-black/50">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(99,102,241,0.05)_50%,transparent_80%)]" />
          <svg viewBox="0 0 1000 520" role="img" aria-label={`Simulação da órbita terrestre. Dia aproximado ${day}. ${activeSeason}`} className="relative block h-auto w-full select-none touch-pan-y">
            <defs>
              <radialGradient id="sunCore"><stop offset="0%" stopColor="#fff7bd" /><stop offset="45%" stopColor="#fbbf24" /><stop offset="78%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" stopOpacity=".15" /></radialGradient>
              <radialGradient id="earthOcean" cx="30%" cy="25%" r="80%"><stop offset="0%" stopColor="#7dd3fc" /><stop offset="45%" stopColor="#0284c7" /><stop offset="100%" stopColor="#082f49" /></radialGradient>
              <linearGradient id="nightSide"><stop offset="0%" stopColor="#020617" stopOpacity=".05" /><stop offset="100%" stopColor="#020617" stopOpacity=".86" /></linearGradient>
              <filter id="sunGlow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="15" /></filter>
              <filter id="earthGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" /></filter>
              <clipPath id="earthClip"><circle r="28" /></clipPath>
            </defs>
            {STAR_FIELD.map((star, i) => <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#dbeafe" opacity={i % 4 === 0 ? .9 : .45}><animate attributeName="opacity" values=".25;.9;.25" dur={`${2.4 + (i % 5) * .7}s`} begin={star.delay} repeatCount="indefinite" /></circle>)}
            <ellipse cx="500" cy="260" rx="320" ry="190" fill="none" stroke="#818cf8" strokeOpacity=".13" strokeWidth="22" />
            <ellipse cx="500" cy="260" rx="320" ry="190" fill="none" stroke="#818cf8" strokeOpacity=".72" strokeWidth="2" strokeDasharray="5 10" />
            <ellipse cx="500" cy="260" rx="320" ry="190" fill="none" stroke="#c4b5fd" strokeOpacity=".16" strokeWidth="1" />
            {/* Sol */}
            <circle cx="500" cy="260" r="75" fill="#f59e0b" opacity=".2" filter="url(#sunGlow)" />
            <circle cx="500" cy="260" r="52" fill="url(#sunCore)" />
            <circle cx="500" cy="260" r="40" fill="none" stroke="#fde68a" strokeOpacity=".55" strokeWidth="1.5"><animate attributeName="r" values="40;46;40" dur="4s" repeatCount="indefinite" /></circle>
            <text x="500" y="340" textAnchor="middle" fill="#fcd34d" fontSize="16" fontWeight="800" letterSpacing="4">SOL</text>
            {/* Marcos de referência clicáveis */}
            {MILESTONES.map((m, i) => {
              const a = i / 4 * Math.PI * 2 - Math.PI / 2;
              const x = 500 + Math.cos(a) * 320;
              const y = 260 + Math.sin(a) * 190;
              const selected = Math.abs(progress - i) < .16 || (progress >= 4 && i === 0);
              return <g key={m.label} role="button" tabIndex={0} aria-label={`Ir para ${m.label}`} className="cursor-pointer" onClick={() => { setPlaying(false); setPosition(i); }} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlaying(false); setPosition(i); } }}>
                <circle cx={x} cy={y} r="17" fill={selected ? '#34d399' : '#818cf8'} opacity={selected ? .18 : .1} />
                <circle cx={x} cy={y} r={selected ? 7 : 5} fill={selected ? '#6ee7b7' : '#a5b4fc'} stroke="#e0e7ff" strokeOpacity=".7" strokeWidth="1.5" />
                {showLabels && <text x={x} y={y + (i === 1 ? -23 : i === 3 ? 28 : 27)} textAnchor="middle" fill={selected ? '#a7f3d0' : '#cbd5e1'} fontSize="15" fontWeight={selected ? 800 : 600}>{m.label}</text>}
              </g>;
            })}
            {/* Terra com oceanos, continentes estilizados, sombra e eixo inclinado */}
            <g transform={`translate(${earth.x} ${earth.y})`} className="transition-transform duration-100 ease-linear">
              <circle r="38" fill="#38bdf8" opacity=".22" filter="url(#earthGlow)" />
              <g clipPath="url(#earthClip)">
                <circle r="28" fill="url(#earthOcean)" />
                <path d="M-25,-15 L-15,-25 -4,-20 2,-12 -4,-5 -13,-7 -18,2 -26,-1Z M3,-22 L15,-18 21,-8 14,-2 9,-8 1,-5 -3,-13Z M-7,2 L5,-2 14,7 8,17 0,24 -7,14 -14,9Z M17,10 L25,7 29,19 19,26 12,19Z" fill="#4ade80" opacity=".95" />
                <circle r="28" fill="url(#nightSide)" />
                <path d="M-5,-29 Q-15,0 -4,29" fill="none" stroke="#bae6fd" strokeOpacity=".35" strokeWidth="1.5" />
              </g>
              <circle r="28" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
              <line x1="-20" y1="30" x2="20" y2="-30" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
              <circle cx="0" cy="0" r="3" fill="#fef3c7" />
            </g>
            <path d={`M ${earth.x} ${earth.y} L ${earth.x + 45} ${earth.y - 42}`} stroke="#6ee7b7" strokeOpacity=".65" strokeDasharray="3 5" strokeWidth="1.5" />
            <text x="30" y="38" fill="#94a3b8" fontSize="13" letterSpacing="2">MODELO ILUSTRATIVO · ÓRBITA FORA DE ESCALA</text>
          </svg>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-slate-900/80 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" /> Terra em movimento <span className="text-slate-600">•</span> Eixo inclinado</div>
            <button type="button" onClick={() => setShowLabels(v => !v)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-white/10">{showLabels ? 'Ocultar meses' : 'Mostrar meses'}</button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-indigo-300">Posição atual · {progress >= 4 ? 'ciclo completo' : milestone.label}</p><h4 className="mt-1 text-lg font-black sm:text-xl">{activeSeason}</h4><p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{progress >= 4 ? 'A Terra completou uma volta ao redor do Sol. Uma translação corresponde a aproximadamente um ano.' : milestone.detail}</p></div>
              <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-right"><span className="block text-[10px] font-bold uppercase tracking-wider text-amber-200">Tempo decorrido</span><span className="text-xl font-black tabular-nums text-amber-100">{day} <span className="text-sm">dias</span></span>{progress >= 4 && <span className="block text-xs font-bold text-amber-200">+ 6 horas</span>}</div>
            </div>
            <label htmlFor="orbit-progress" className="mt-5 flex justify-between gap-3 text-xs font-bold text-slate-300"><span>Início</span><span>Arraste para viajar</span><span>1 ano</span></label>
            <input id="orbit-progress" type="range" min="0" max="4" step="0.01" value={progress} onChange={e => { setPlaying(false); setPosition(Number(e.target.value)); }} className="mt-2 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-300" />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setPlaying(v => !v)} className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-200">{playing ? <Pause size={16} /> : <Play size={16} />} {playing ? 'Pausar viagem' : 'Iniciar viagem'}</button>
              <button type="button" onClick={() => setPosition(Math.max(0, Math.floor(progress) - 1))} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"><SkipBack size={15} /> Anterior</button>
              <button type="button" onClick={() => { setPlaying(false); setPosition(Math.min(4, Math.floor(progress) + 1)); }} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10">Próxima <SkipForward size={15} /></button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"><RotateCcw size={15} /> Reiniciar</button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3"><label htmlFor="orbit-speed" className="text-xs font-bold text-slate-400">Velocidade da animação</label><input id="orbit-speed" aria-label="Velocidade da animação" type="range" min="0.5" max="3" step="0.5" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-28 accent-indigo-300" /><span className="rounded-md bg-white/10 px-2 py-1 text-xs font-black text-indigo-200">{speed.toFixed(1)}×</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-sky-300/15 bg-sky-300/[.07] p-4"><span className="text-xs font-extrabold uppercase tracking-wider text-sky-200">Translação</span><p className="mt-1 text-2xl font-black">365,25 <span className="text-sm">dias</span></p><p className="mt-1 text-xs leading-relaxed text-slate-300">Tempo aproximado para completar uma órbita ao redor do Sol.</p></div>
            <div className="rounded-2xl border border-violet-300/15 bg-violet-300/[.07] p-4"><span className="text-xs font-extrabold uppercase tracking-wider text-violet-200">Progresso da órbita</span><p className="mt-1 text-2xl font-black tabular-nums">{Math.round(progress / 4 * 100)}<span className="text-sm">%</span></p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-300 transition-all duration-100" style={{ width: `${progress / 4 * 100}%` }} /></div><p className="mt-2 text-xs text-slate-300">{progress >= 4 ? 'Missão concluída!' : 'Continue a viagem para completar o ano.'}</p></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="group rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 transition group-hover:rotate-6"><Orbit size={21} /></div><span className="text-xs font-black uppercase tracking-wider text-indigo-700">01 · Duração</span><p className={`mt-2 font-bold text-slate-800 ${largeTextMode ? 'text-base' : 'text-sm'}`}>Um ano corresponde a cerca de 365 dias e 6 horas. Essas horas extras ajudam a explicar o ano bissexto.</p></article>
        <article className="group rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition group-hover:rotate-6"><Sparkles size={21} /></div><span className="text-xs font-black uppercase tracking-wider text-violet-700">02 · Órbita</span><p className={`mt-2 font-bold text-slate-800 ${largeTextMode ? 'text-base' : 'text-sm'}`}>A trajetória terrestre é uma elipse muito pouco alongada, quase circular.</p><button type="button" onClick={() => openGlossary('orbita')} className="mt-3 text-xs font-extrabold text-violet-700 underline decoration-violet-300 underline-offset-4 hover:text-violet-900">Explorar o glossário ↗</button></article>
        <article className="group rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition group-hover:rotate-6">☀️</div><span className="text-xs font-black uppercase tracking-wider text-amber-700">03 · Estações</span><p className={`mt-2 font-bold text-slate-800 ${largeTextMode ? 'text-base' : 'text-sm'}`}>As estações resultam principalmente da inclinação do eixo da Terra durante a translação, não da distância ao Sol.</p></article>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="rounded-2xl bg-amber-100 p-3 text-amber-700"><Calendar size={25} /></div><div><span className="text-xs font-black uppercase tracking-[.16em] text-amber-700">Mini-laboratório</span><h4 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">Para onde vão as 6 horas extras?</h4><p className={`mt-2 max-w-2xl text-slate-600 ${largeTextMode ? 'text-base' : 'text-sm'}`}>Some um ano de cada vez. Após quatro anos, as seis horas de cada ano somam aproximadamente 24 horas — um dia extra no calendário.</p></div></div><AudioButton text="A Terra demora cerca de 365 dias e 6 horas para dar uma volta ao Sol. Ao somar as seis horas durante quatro anos, obtemos aproximadamente 24 horas, ou um dia extra no calendário." label="Ouvir sobre o ano bissexto" size="sm" /></div>
        <div className="relative mt-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><div className="mb-2 flex items-center justify-between text-xs font-extrabold text-amber-900"><span>Horas acumuladas</span><span>{extraHours} de 24 horas</span></div><div className="flex gap-1.5">{[0, 1, 2, 3].map(i => <div key={i} className={`h-3 flex-1 rounded-full transition-all duration-500 ${yearsCount > i ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm' : 'bg-amber-100'}`} />)}</div><div className="mt-3 flex flex-wrap gap-2">{[0, 1, 2, 3, 4].map(y => <button type="button" key={y} onClick={() => setYearsCount(y)} aria-pressed={yearsCount === y} className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition ${yearsCount === y ? 'bg-amber-500 text-white shadow' : 'border border-amber-200 bg-white text-amber-900 hover:bg-amber-100'}`}>{y} {y === 1 ? 'ano' : 'anos'}</button>)}</div></div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setYearsCount(y => Math.min(4, y + 1)); completeMission(2); }} disabled={yearsCount >= 4} className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-emerald-600"><PlusCircle size={17} />{yearsCount >= 4 ? 'Dia extra alcançado!' : 'Somar +1 ano'}</button><button type="button" onClick={() => setYearsCount(0)} className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-amber-50"><RotateCcw size={15} /> Zerar</button></div>
        </div>
        <div aria-live="polite" className="relative mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-white/80 p-4"><div><p className="text-xs font-bold uppercase tracking-wider text-amber-800">Acúmulo calculado</p><p className="mt-1 text-lg font-black text-slate-900">{yearsCount} {yearsCount === 1 ? 'ano' : 'anos'} × 6 horas = <span className="text-amber-600">{extraHours} horas</span></p></div>{extraHours === 24 ? <div className="animate-[bounce_1s_ease-in-out_1] rounded-xl bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">🎉 +1 dia · 29 de fevereiro</div> : <p className="text-xs font-semibold text-slate-500">Faltam {24 - extraHours} horas para completar um dia.</p>}</div>
        <p className="relative mt-3 text-xs leading-relaxed text-slate-500">Nota: a regra do calendário gregoriano tem exceções nos anos de século que não são divisíveis por 400.</p>
      </section>
    </div>
  );
};
