// src/components/interactive/MythBuster.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { AudioButton } from '@/components/ui/AudioButton';

export const MythBuster: React.FC = () => {
  const completeMission = useProgressStore((state) => state.completeMission);
  const largeTextMode = useProgressStore((state) => state.largeTextMode);
  const [selectedTest, setSelectedTest] = useState<'none' | 'myth' | 'truth'>('none');
  const [discoveredSecrets, setDiscoveredSecrets] = useState<string[]>([]);

  const handleSelectTest = (type: 'myth' | 'truth') => {
    setSelectedTest(type);
    if (type === 'truth') {
      completeMission(1);
    }
  };

  const toggleSecret = (id: string) => {
    if (!discoveredSecrets.includes(id)) {
      const updated = [...discoveredSecrets, id];
      setDiscoveredSecrets(updated);
      if (updated.length >= 2) {
        completeMission(1);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Laboratório Mito vs Verdade */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
              Experiência 1: Detetive da Ciência
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-2">
              Por que faz calor em alguns meses e frio noutros?
            </h3>
          </div>
          <AudioButton
            text="Clica nos dois botões abaixo para testar se o calor acontece por estarmos mais perto do Sol ou se existe outro segredo!"
            label="Ouvir instrução"
            size="sm"
          />
        </div>

        {/* Botões de Teste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSelectTest('myth')}
            className={`p-5 rounded-2xl border-4 text-left transition-all flex items-start gap-4 cursor-pointer ${
              selectedTest === 'myth'
                ? 'bg-rose-50 border-rose-400 shadow-md scale-[1.01]'
                : 'bg-slate-50 hover:bg-rose-50/40 border-slate-200'
            }`}
          >
            <span className="text-4xl shrink-0">🤔</span>
            <div>
              <span className="text-xs font-extrabold uppercase text-rose-600 block">
                Hipótese 1 (Muito comum!)
              </span>
              <h4 className="text-lg font-black text-slate-800">
                &ldquo;A Terra chega mais perto do Sol no verão!&rdquo;
              </h4>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Clica aqui para testar esta ideia no espaço
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTest('truth')}
            className={`p-5 rounded-2xl border-4 text-left transition-all flex items-start gap-4 cursor-pointer ${
              selectedTest === 'truth'
                ? 'bg-emerald-50 border-emerald-400 shadow-md scale-[1.01]'
                : 'bg-slate-50 hover:bg-emerald-50/40 border-slate-200'
            }`}
          >
            <span className="text-4xl shrink-0">🔭</span>
            <div>
              <span className="text-xs font-extrabold uppercase text-emerald-600 block">
                Hipótese 2 (Científica!)
              </span>
              <h4 className="text-lg font-black text-slate-800">
                &ldquo;A Terra viaja inclinada ao redor do Sol!&rdquo;
              </h4>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Clica aqui para ver o que realmente acontece
              </p>
            </div>
          </button>
        </div>

        {/* Ecrã Espacial de Simulação */}
        <div className="relative rounded-3xl bg-slate-950 p-6 sm:p-8 text-white overflow-hidden min-h-[280px] flex flex-col items-center justify-center border-4 border-slate-800">
          {/* Estrelas de fundo */}
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

          <AnimatePresence mode="wait">
            {selectedTest === 'none' && (
              <motion.div
                key="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-3 z-10 py-6"
              >
                <HelpCircle className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
                <p className="text-lg font-bold text-slate-200">
                  Escolhe uma das duas hipóteses acima para ligar o simulador espacial!
                </p>
              </motion.div>
            )}

            {selectedTest === 'myth' && (
              <motion.div
                key="myth"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full z-10 space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                  {/* Sol */}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_50px_#f59e0b] flex items-center justify-center text-4xl animate-pulse">
                      ☀️
                    </div>
                    <span className="text-xs font-bold text-amber-300 mt-2">Sol Central</span>
                  </div>

                  {/* Linha de Distância */}
                  <div className="flex-1 max-w-xs flex flex-col items-center gap-1">
                    <div className="w-full h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-sky-400 rounded-full relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold text-rose-300 whitespace-nowrap">
                        Variação de apenas 3% na distância!
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 text-center font-medium mt-1">
                      Janeiro: 147 milhões km | Julho: 152 milhões km
                    </span>
                  </div>

                  {/* Terra */}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-emerald-500 shadow-[0_0_20px_#38bdf8] flex items-center justify-center text-3xl">
                      🌍
                    </div>
                    <span className="text-xs font-bold text-sky-300 mt-2">Planeta Terra</span>
                  </div>
                </div>

                {/* Caixa de Refutação do Mito */}
                <div className="bg-rose-950/80 border-2 border-rose-500/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-rose-900/60 text-rose-300 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-rose-300 tracking-wider">
                        Mito Científico Derrubado!
                      </span>
                    </div>
                    <p className={`text-rose-100 font-semibold leading-relaxed ${largeTextMode ? 'text-lg' : 'text-sm'}`}>
                      Se o calor dependesse apenas de chegar mais perto do Sol, o planeta <strong>inteiro</strong> estaria com calor ao mesmo tempo! Mas em Janeiro, enquanto o Brasil está na praia no Verão, nos Estados Unidos e na Europa é pleno Inverno com neve!
                    </p>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectTest('truth')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-transform hover:scale-105 cursor-pointer shadow-lg"
                  >
                    <span>Testar a Hipótese 2 (A Verdade Científica!)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {selectedTest === 'truth' && (
              <motion.div
                key="truth"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full z-10 space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                  {/* Sol */}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_60px_#f59e0b] flex items-center justify-center text-4xl animate-pulse">
                      ☀️
                    </div>
                    <span className="text-xs font-bold text-amber-300 mt-2">Raios Paralelos</span>
                  </div>

                  {/* Raios de Luz */}
                  <div className="flex-1 max-w-xs flex flex-col items-center gap-2">
                    <div className="w-full space-y-1.5">
                      <div className="h-1 bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full shadow-[0_0_8px_#fde047]" />
                      <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-300 rounded-full shadow-[0_0_8px_#fb923c]" />
                      <div className="h-1 bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full shadow-[0_0_8px_#fde047]" />
                    </div>
                    <span className="text-[11px] text-amber-200 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
                      Luz Solar Direta vs Inclinada
                    </span>
                  </div>

                  {/* Terra Inclinada */}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="relative">
                      {/* Eixo tracejado 23.5 graus */}
                      <div className="w-0.5 h-24 bg-red-400 absolute -top-4 left-1/2 -translate-x-1/2 rotate-[23.5deg] z-20 shadow-[0_0_6px_#ef4444]" />
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-emerald-500 shadow-[0_0_20px_#38bdf8] flex items-center justify-center text-3xl rotate-[23.5deg]">
                        🌍
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-300 mt-3">
                      Eixo Inclinado em 23,5°!
                    </span>
                  </div>
                </div>

                {/* Caixa da Verdade Científica */}
                <div className="bg-emerald-950/80 border-2 border-emerald-500/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-emerald-900/60 text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                        Descoberta Científica Confirmada!
                      </span>
                    </div>
                    <p className={`text-emerald-100 font-semibold leading-relaxed ${largeTextMode ? 'text-lg' : 'text-sm'}`}>
                      O segredo das estações é a <strong>inclinação do eixo da Terra (23,5°)</strong> combinada com a viagem ao redor do Sol! O hemisfério inclinado em direção ao Sol recebe luz direta e fica quente (Verão), enquanto o outro recebe luz fraca e inclinada (Inverno)!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cartões Interativos para Desbloquear os 2 Segredos */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-700 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Clica para desbloquear as pistas do Detetive Espacial:</span>
            </h4>
            <span className="text-xs font-bold text-slate-500">
              {discoveredSecrets.length}/2 pistas reveladas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => toggleSecret('orbita')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                discoveredSecrets.includes('orbita')
                  ? 'bg-amber-50 border-amber-300 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-slate-800 text-sm">
                  Pista 1: A Órbita Quase Circular
                </span>
                {discoveredSecrets.includes('orbita') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-xs font-bold text-indigo-600">Revelar</span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {discoveredSecrets.includes('orbita')
                  ? 'A Terra gira num caminho que é quase um círculo perfeito. A diferença entre o ponto mais perto e o mais longe é minúscula e não tem poder para criar o inverno ou o verão!'
                  : 'Clica aqui para ver o formato do caminho da Terra no espaço.'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => toggleSecret('estacoes-opostas')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                discoveredSecrets.includes('estacoes-opostas')
                  ? 'bg-amber-50 border-amber-300 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-slate-800 text-sm">
                  Pista 2: O Espelho dos Hemisférios
                </span>
                {discoveredSecrets.includes('estacoes-opostas') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-xs font-bold text-indigo-600">Revelar</span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {discoveredSecrets.includes('estacoes-opostas')
                  ? 'Como a Terra é inclinada, quando o Hemisfério Sul aponta para o Sol é Verão aqui e Inverno no Hemisfério Norte. As estações são sempre opostas!'
                  : 'Clica aqui para entender por que as estações são espelhadas.'}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};