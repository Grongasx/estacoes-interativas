// src/components/interactive/TiltFlashlight.tsx
'use client';
import React, { useState } from 'react';
import { Sun, ThermometerSun, ThermometerSnowflake, Sparkles, Info, Globe, Zap, Leaf, Snowflake, Flower2, Play } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';
import { SunAngleSimulator } from './SunAngleSimulator';
import { CuriosityModal, CURIOSITIES_DATA } from './CuriosityModal';

const BACKGROUND_STARS = Array.from({ length: 30 }, (_, i) => ({
  top: `${((i * 37 + 13) % 92) + 4}%`,
  left: `${((i * 59 + 23) % 92) + 4}%`,
  animationDelay: `${((i * 7) % 20) / 10}s`,
  animationDuration: `${1.2 + ((i * 3) % 15) / 10}s`,
}));

export const TiltFlashlight: React.FC = () => {
  const { completeMission, openGlossary, largeTextMode } = useProgressStore();
  const [isTilted, setIsTilted] = useState(true);
  const [selectedBeam, setSelectedBeam] = useState<'direct' | 'slanted'>('direct');
  const [activeCuriosity, setActiveCuriosity] = useState<number | null>(null);



  const handleToggleTilt = (tilted: boolean) => {
    setIsTilted(tilted);
    completeMission(3);
  };

  const handleSelectBeam = (beam: 'direct' | 'slanted') => {
    setSelectedBeam(beam);
    completeMission(3);
  };

  // Curiosidades detalhadas com animações importadas de CURIOSITIES_DATA

  return (
    <div className="space-y-8">
      {/* Parte 1: Planeta "Em Pé" (0°) vs Planeta Inclinado (23,5°) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-extrabold text-xs uppercase tracking-wider">
              Experiência 3: A Inclinação de 23,5°
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-2">
              E se a Terra girasse totalmente "em pé"?
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
            className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all border-2 ${!isTilted
                ? 'bg-slate-800 text-white border-slate-800 shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:scale-105'
              }`}
          >
            🤖 Testar Terra "Em Pé" (0°)
          </button>
          <button
            type="button"
            onClick={() => handleToggleTilt(true)}
            className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all border-2 ${isTilted
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:scale-105'
              }`}
          >
            🌍 Terra Real Inclinada (23,5°)
          </button>
          <button
            type="button"
            onClick={() => openGlossary('eixo-terrestre')}
            className="px-4 py-3 rounded-2xl font-bold text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 ml-auto transition-all hover:scale-105"
          >
            📖 O que é o Eixo Terrestre?
          </button>
        </div>

        {/* Visualizador 3D da Inclinação */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border-4 border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Modelo 3D da Terra */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Estrelas de fundo determinísticas */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  {BACKGROUND_STARS.map((star, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                      style={{
                        top: star.top,
                        left: star.left,
                        animationDelay: star.animationDelay,
                        animationDuration: star.animationDuration,
                      }}
                    />
                  ))}
                </div>

                {/* Linha vertical de referência */}
                <div className="absolute top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-600 opacity-50" />

                {/* Sol (fonte de luz) */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2">
                  <div className="relative">
                    {/* Corona solar */}
                    <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-500/30 blur-xl animate-pulse" />
                    {/* Sol principal */}
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_80px_rgba(251,191,36,0.8)]">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-200/50 to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Raios solares */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-l from-yellow-400/70 to-transparent blur-sm" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-l from-yellow-400/50 to-transparent blur-sm rotate-15" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-l from-yellow-400/50 to-transparent blur-sm -rotate-15" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-l from-yellow-400/30 to-transparent blur-sm rotate-30" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-l from-yellow-400/30 to-transparent blur-sm -rotate-30" />

                {/* Globo 3D com rotação de eixo */}
                <div
                  style={{
                    transform: isTilted ? 'rotate(23.5deg)' : 'rotate(0deg)',
                    transformStyle: 'preserve-3d',
                  }}
                  className="relative w-48 h-48 transition-transform duration-700 ease-in-out"
                >
                  {/* Eixo Terrestre */}
                  <div className="absolute -top-16 -bottom-16 left-1/2 -translate-x-1/2 w-2 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]" />

                  {/* Pontos polares */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

                  {/* Esfera da Terra */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-blue-900 shadow-[0_0_80px_rgba(56,189,248,0.5)] border-4 border-sky-300/50 overflow-hidden">
                    {/* Atmosfera */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-300/20 to-transparent" />

                    {/* Continentes simulados */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full blur-sm opacity-80" />
                    <div className="absolute bottom-1/3 right-1/4 w-14 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full blur-sm opacity-80" />
                    <div className="absolute top-1/2 left-1/2 w-12 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-full blur-sm opacity-80" />
                    <div className="absolute top-1/3 right-1/3 w-10 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full blur-sm opacity-70" />

                    {/* Nuvens */}
                    <div className="absolute top-1/5 left-1/3 w-12 h-4 bg-white/40 rounded-full blur-sm" />
                    <div className="absolute bottom-1/4 right-1/3 w-10 h-3 bg-white/30 rounded-full blur-sm" />

                    {/* Efeito de iluminação */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-l from-yellow-300/30 via-transparent to-transparent" />
                  </div>

                  {/* Linha do Equador */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 -translate-y-1/2" />

                  {/* Hemisférios labels */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-300 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                    Hemisfério Norte
                  </div>
                  <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-300 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                    Hemisfério Sul
                  </div>
                </div>
              </div>

              <span className="mt-10 px-5 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm text-amber-300 font-extrabold text-sm border border-amber-400/30 shadow-lg">
                Ângulo atual: {isTilted ? '23,5° (Inclinado)' : '0° (Em pé)'}
              </span>
            </div>

            {/* Informações */}
            <div className="space-y-4 bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
              <h4 className="text-xl font-black text-amber-300 flex items-center gap-2">
                {isTilted ? (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Com 23,5°: Temos as 4 Estações!
                  </>
                ) : (
                  <>
                    <Info className="w-6 h-6" />
                    Sem inclinação (0°): Adeus Estações!
                  </>
                )}
              </h4>
              <p className={`text-slate-200 leading-relaxed ${largeTextMode ? 'text-base' : 'text-sm'}`}>
                {isTilted
                  ? 'Como a Terra está inclinada em 23,5°, uma metade do planeta inclina-se mais para o Sol (recebendo raios diretos e quentes), enquanto a outra metade recebe raios mais inclinados e frios! Isso cria as estações do ano.'
                  : 'Se a Terra girasse totalmente em pé, a luz do Sol bateria sempre com o mesmo ângulo nos mesmos lugares o ano inteiro. Não existiria mudança entre verão, outono, inverno e primavera!'}
              </p>

              {/* Indicador visual */}
              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isTilted ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isTilted ? 'Sistema ativo: Estações funcionando' : 'Sistema desativado: Sem variações sazonais'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parte 2: Laboratório Interativo dos Raios Solares e Temperatura */}
      <SunAngleSimulator
        selectedBeam={selectedBeam}
        onSelectBeam={handleSelectBeam}
        largeTextMode={largeTextMode}
      />




      {/* Seção de Curiosidades Incríveis com Animações / Vídeos */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border-4 border-purple-200 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-purple-700">
                Cinema Científico Interativo
              </span>
              <h3 className="text-2xl font-black text-slate-800">
                Curiosidades Incríveis!
              </h3>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full bg-white/95 border border-purple-300 text-purple-900 text-xs font-black shadow-sm flex items-center gap-2">
            <Play className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
            Clique em qualquer card para abrir o vídeo/animação!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURIOSITIES_DATA.map((curiosity, index) => (
            <button
              key={curiosity.id}
              type="button"
              onClick={() => setActiveCuriosity(index)}
              className="group p-5 rounded-3xl border-2 border-purple-200 bg-white/80 hover:bg-white hover:border-purple-400 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-left flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl group-hover:bg-purple-300/40 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${curiosity.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {curiosity.icon}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 group-hover:bg-purple-600 group-hover:text-white text-purple-800 text-[11px] font-black transition-all shadow-sm">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Ver Vídeo</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl group-hover:scale-125 transition-transform">{curiosity.emoji}</span>
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    {curiosity.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {curiosity.text}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-[11px] font-bold text-purple-600 group-hover:text-purple-700">
                <span className="bg-purple-100/70 px-2 py-0.5 rounded text-purple-800">{curiosity.tag}</span>
                <span className="underline decoration-purple-300 group-hover:decoration-purple-600 font-black">
                  Assistir Animação →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal da Animação Cinematográfica / Vídeo */}
      {activeCuriosity !== null && (
        <CuriosityModal
          curiosityIndex={activeCuriosity}
          onClose={() => setActiveCuriosity(null)}
          onSelectIndex={setActiveCuriosity}
          largeTextMode={largeTextMode}
        />
      )}
    </div>
  );
};