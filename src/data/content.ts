// src/data/content.ts

export const GLOSSARY_ITEMS: Record<string, any> = {
  'eixo-terrestre': {
    id: 'eixo-terrestre',
    term: 'Eixo Terrestre',
    simpleDefinition:
      'É uma linha invisível que passa pelo meio da Terra, de cima a baixo (do Polo Norte ao Polo Sul). A Terra gira apoiada nessa linha meio inclinada!',
    audioText:
      'Eixo Terrestre. É uma linha invisível que passa pelo meio da Terra, do Polo Norte ao Polo Sul. A Terra gira meio inclinada nessa linha!',
    emoji: '🌐',
    visualHint: 'Imagina um palito atravessando uma laranja levemente inclinada.',
  },
  hemisferio: {
    id: 'hemisferio',
    term: 'Hemisfério',
    simpleDefinition:
      'É cada uma das metades da Terra! Uma linha invisível no meio (Linha do Equador) divide o planeta na metade de cima (Norte) e na metade de baixo (Sul).',
    audioText:
      'Hemisfério. É cada metade do nosso planeta, dividido ao meio entre a parte de cima, o Norte, e a parte de baixo, o Sul.',
    emoji: '🌗',
    visualHint: 'Parte de cima = Hemisfério Norte. Parte de baixo = Hemisfério Sul.',
  },
  orbita: {
    id: 'orbita',
    term: 'Órbita',
    simpleDefinition:
      'É a estrada invisível no espaço por onde a Terra viaja ao redor do Sol, puxada pela força da gravidade.',
    audioText:
      'Órbita. É o caminho invisível no espaço por onde a Terra viaja ao redor do Sol sem nunca se perder.',
    emoji: '🪐',
    visualHint: 'Tem o formato de um círculo levemente achatado (oval suave).',
  },
  translacao: {
    id: 'translacao',
    term: 'Translação',
    simpleDefinition:
      'É a grande viagem completa que a Terra faz dando a volta ao redor do Sol. Essa viagem dura um ano inteiro!',
    audioText:
      'Translação. É o movimento de viagem completa que a Terra faz ao redor do Sol, demorando um ano inteiro.',
    emoji: '🚀',
    visualHint: '1 volta completa ao redor do Sol = 365 dias e 6 horas.',
  },
  rotacao: {
    id: 'rotacao',
    term: 'Rotação',
    simpleDefinition:
      'É o giro que a Terra faz ao redor de si mesma, como um pião! Esse giro cria o dia (lado virado para o Sol) e a noite (lado no escuro).',
    audioText:
      'Rotação. É o giro que a Terra faz ao redor de si mesma como um pião, criando o dia e a noite.',
    emoji: '🌀',
    visualHint: '1 giro completo em si mesma = 24 horas (1 dia).',
  },
};

export interface MissionStep {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  badgeEmoji: string;
  badgeName: string;
  introText: string;
  audioIntro: string;
  keyTakeaway: string;
  glossaryTermsUsed: string[];
}

export const MISSION_STEPS: MissionStep[] = [
  {
    id: 1,
    slug: 'sol-e-terra',
    title: '1. O Sol e a Terra',
    subtitle: 'Por que temos calor e frio durante o ano?',
    badgeEmoji: '🕵️‍♂️',
    badgeName: 'Detetive do Espaço',
    introText:
      'Já reparaste que em alguns meses faz muito calor e noutros precisamos de casaco? Muita gente acha que o calor acontece quando a Terra chega mais perto do Sol, mas isso é um mito!',
    audioIntro:
      'Missão 1: O Sol e a Terra. Já reparaste que o clima muda ao longo do ano? Muita gente pensa que faz calor porque a Terra chega mais perto do Sol, mas isso é um mito! Vamos descobrir o verdadeiro segredo.',
    keyTakeaway:
      'O segredo das estações junta duas coisas: a viagem da Terra ao redor do Sol (translação) e a forma inclinada como a Terra gira (eixo terrestre)!',
    glossaryTermsUsed: ['translacao', 'eixo-terrestre'],
  },
  {
    id: 2,
    slug: 'movimento-de-translacao',
    title: '2. A Grande Viagem (Translação)',
    subtitle: 'Um passeio de 365 dias pelo espaço!',
    badgeEmoji: '🛸',
    badgeName: 'Piloto de Órbita',
    introText:
      'A Terra nunca fica parada! Ela viaja sem parar ao redor do Sol por um caminho em forma de oval suave chamado órbita. Essa volta inteira dura 365 dias e 6 horas.',
    audioIntro:
      'Missão 2: O Movimento de Translação. A Terra viaja ao redor do Sol por um caminho chamado órbita. Para dar uma volta completa, ela leva 365 dias e 6 horas, ou seja, um ano inteiro!',
    keyTakeaway:
      'Essas 6 horas extras somadas durante 4 anos formam 24 horas (1 dia a mais), criando o Ano Bissexto!',
    glossaryTermsUsed: ['translacao', 'orbita', 'rotacao'],
  },
  {
    id: 3,
    slug: 'inclinacao-do-eixo',
    title: '3. O Planeta Inclinado',
    subtitle: 'O segredo dos 23,5 graus!',
    badgeEmoji: '🔦',
    badgeName: 'Mestre da Luz Solar',
    introText:
      'Se a Terra girasse totalmente "em pé", não existiriam as estações do ano! Como o eixo da Terra é inclinado em 23,5°, a luz do Sol bate com força diferente em cada parte do planeta.',
    audioIntro:
      'Missão 3: A Inclinação do Eixo Terrestre. Se a Terra girasse totalmente em pé, não teríamos estações do ano! Como ela gira inclinada em 23 vírgula 5 graus, os raios do Sol chegam diretos num sítio e espalhados noutro.',
    keyTakeaway:
      'Luz direta concentra calor numa área menor (Verão). Luz inclinada espalha os raios numa área maior e aquece menos (Inverno).',
    glossaryTermsUsed: ['eixo-terrestre'],
  },
  {
    id: 4,
    slug: 'quatro-estacoes',
    title: '4. As Quatro Estações',
    subtitle: 'Enquanto um lado aquece, o outro arrefece!',
    badgeEmoji: '🌦️',
    badgeName: 'Guardião das Estações',
    introText:
      'Por causa da inclinação da Terra, quando a metade de baixo (Hemisfério Sul) recebe luz direta, a metade de cima (Hemisfério Norte) recebe luz inclinada. As estações são sempre opostas!',
    audioIntro:
      'Missão 4: As Quatro Estações. Quando o Hemisfério Sul recebe sol direto e está no Verão, o Hemisfério Norte recebe sol inclinado e está no Inverno. Eles funcionam sempre ao contrário!',
    keyTakeaway:
      'Primavera e Outono são estações de transição suave, enquanto Verão e Inverno marcam os extremos de calor e frio.',
    glossaryTermsUsed: ['hemisferio', 'eixo-terrestre'],
  },
  {
    id: 5,
    slug: 'solsticios-e-equinocios',
    title: '5. Solstícios e Equinócios',
    subtitle: 'A balança entre o dia e a noite!',
    badgeEmoji: '⚖️',
    badgeName: 'Astrónomo Chefe',
    introText:
      'O primeiro dia de cada estação tem um nome especial! Tudo depende de quem ganha o cabo de guerra das horas: o Sol (dia) ou a Lua (noite).',
    audioIntro:
      'Missão 5: Solstícios e Equinócios. O início de cada estação tem um nome especial na ciência! Nos Equinócios, o dia e a noite empatam com 12 horas cada. Nos Solstícios, um deles fica bem mais longo!',
    keyTakeaway:
      'Equinócio significa igualdade (12h de dia e 12h de noite). Solstício marca o dia mais longo (Verão) ou a noite mais longa (Inverno).',
    glossaryTermsUsed: ['rotacao', 'hemisferio'],
  },
];

export interface SeasonDetail {
  id: string;
  name: string;
  emoji: string;
  shortDesc: string;
  climate: string;
  phenomenon: string;
  dayNight: string;
  sunRays: string;
  colorTheme: string;
  badgeColor: string;
}

export interface AstronomicalEvent {
  id: string;
  name: string;
  dateSouth: string;
  whatHappens: string;
  startsSeason: string;
  dayHours: number;
  nightHours: number;
  emoji: string;
}

export const SEASONS_DATA: SeasonDetail[] = [
  {
    id: 'primavera',
    name: 'Primavera',
    emoji: '🌸',
    shortDesc: 'Transição entre o frio do inverno e o calor do verão.',
    climate: 'Temperatura agradável (nem muito frio, nem muito calor) e mais humidade no ar.',
    phenomenon: 'As plantas voltam a brotar e os jardins ficam cheios de flores.',
    dayNight: 'Os dias e as noites têm quase a mesma duração (cerca de 12 horas).',
    sunRays: 'Raios solares chegam de forma equilibrada.',
    colorTheme: 'from-pink-100 to-emerald-100 border-pink-300',
    badgeColor: 'bg-pink-500 text-white',
  },
  {
    id: 'verao',
    name: 'Verão',
    emoji: '☀️',
    shortDesc: 'Acontece quando o nosso hemisfério está virado diretamente para o Sol.',
    climate: 'Temperaturas altas e dias bem quentes.',
    phenomenon: 'Sol brilhante e forte, ótimo para brincar ao ar livre e refrescar-se.',
    dayNight: 'Os dias são mais compridos do que as noites (anoitece mais tarde!).',
    sunRays: 'Raios solares batem quase diretos (perpendiculares) no chão.',
    colorTheme: 'from-amber-100 to-orange-100 border-amber-400',
    badgeColor: 'bg-amber-500 text-white',
  },
  {
    id: 'outono',
    name: 'Outono',
    emoji: '🍂',
    shortDesc: 'Transição onde o calor do verão vai dando lugar ao friozinho do inverno.',
    climate: 'A temperatura vai descendo devagar e chove menos.',
    phenomenon: 'As folhas de muitas árvores ficam amarelas ou laranjas e caem no chão.',
    dayNight: 'Os dias e as noites voltam a ter durações muito parecidas.',
    sunRays: 'Raios solares começam a ficar mais suaves.',
    colorTheme: 'from-orange-100 to-yellow-100 border-orange-300',
    badgeColor: 'bg-orange-600 text-white',
  },
  {
    id: 'inverno',
    name: 'Inverno',
    emoji: '❄️',
    shortDesc: 'Acontece quando o nosso hemisfério fica inclinado para longe do Sol.',
    climate: 'Os dias mais frios do ano! Nalguns lugares pode haver geada ou neve.',
    phenomenon: 'Hora de usar casacos quentes; a natureza descansa do calor.',
    dayNight: 'As noites são mais longas e os dias são mais curtos (escurece cedo!).',
    sunRays: 'Raios solares chegam fracos, inclinados e espalhados.',
    colorTheme: 'from-sky-100 to-indigo-100 border-sky-300',
    badgeColor: 'bg-sky-600 text-white',
  },
];

export const ASTRONOMICAL_EVENTS: AstronomicalEvent[] = [
  {
    id: 'solsticio-verao',
    name: 'Solstício de Verão',
    dateSouth: '21 de dezembro (no Hemisfério Sul)',
    whatHappens: 'É o dia mais longo e a noite mais curta de todo o ano!',
    startsSeason: 'Verão',
    dayHours: 14,
    nightHours: 10,
    emoji: '🏖️',
  },
  {
    id: 'equinocio-outono',
    name: 'Equinócio de Outono',
    dateSouth: '20 a 23 de março (no Hemisfério Sul)',
    whatHappens: 'Empate perfeito! O dia e a noite têm exatamente 12 horas cada um.',
    startsSeason: 'Outono',
    dayHours: 12,
    nightHours: 12,
    emoji: '🍁',
  },
  {
    id: 'solsticio-inverno',
    name: 'Solstício de Inverno',
    dateSouth: '21 de junho (no Hemisfério Sul)',
    whatHappens: 'É a noite mais longa e o dia mais curto de todo o ano!',
    startsSeason: 'Inverno',
    dayHours: 10,
    nightHours: 14,
    emoji: '🧣',
  },
  {
    id: 'equinocio-primavera',
    name: 'Equinócio de Primavera',
    dateSouth: '22 ou 23 de setembro (no Hemisfério Sul)',
    whatHappens: 'Novo empate! O dia e a noite duram exatamente 12 horas cada.',
    startsSeason: 'Primavera',
    dayHours: 12,
    nightHours: 12,
    emoji: '🌻',
  },
];