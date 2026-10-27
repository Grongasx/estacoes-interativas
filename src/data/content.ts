// src/data/content.ts

export const GLOSSARY_ITEMS: Record<string, any> = {
  'eixo-terrestre': {
    id: 'eixo-terrestre',
    term: 'Eixo da Terra',
    simpleDefinition:
      'É como um palitinho invisível que atravessa a Terra de ponta a ponta. A Terra gira em volta desse palito, mas ela não fica em pé: fica meio deitadinha, como um pião inclinado!',
    audioText:
      'Eixo da Terra. É como um palitinho invisível que atravessa o nosso planeta de cima a baixo. A Terra gira apoiada nele, mas fica meio deitadinha, como um pião inclinado!',
    emoji: '🌐',
    visualHint: 'Pensa numa laranja atravessada por um palito de churrasco meio tortinho.',
  },
  hemisferio: {
    id: 'hemisferio',
    term: 'Hemisfério',
    simpleDefinition:
      'É o nome chique para dizer "metade da Terra"! Uma linha mágica no meio divide o planeta na metade de cima (Norte, onde fica a Europa) e na metade de baixo (Sul, onde fica o Brasil).',
    audioText:
      'Hemisfério. Significa metade da Terra! Temos a metade de cima, chamada Hemisfério Norte, e a metade de baixo, o Hemisfério Sul, onde fica o Brasil.',
    emoji: '🌗',
    visualHint: 'Parte de cima = Hemisfério Norte. Parte de baixo = Hemisfério Sul.',
  },
  orbita: {
    id: 'orbita',
    term: 'Órbita',
    simpleDefinition:
      'É a pista de corrida invisível no espaço por onde a Terra viaja ao redor do Sol. Essa pista tem o formato de um círculo meio amassadinho (uma oval suave).',
    audioText:
      'Órbita. É a pista invisível no espaço por onde a Terra viaja dando voltas ao redor do Sol sem nunca sair do caminho.',
    emoji: '🪐',
    visualHint: 'Imagina uma pista de trenzinho em volta do Sol!',
  },
  translacao: {
    id: 'translacao',
    term: 'Translação',
    simpleDefinition:
      'É a grande volta completa que a Terra dá ao redor do Sol! Essa viagem pelo espaço é longa e dura um ano inteirinho: 365 dias e mais 6 horinhas.',
    audioText:
      'Translação. É o passeio completo que a Terra faz ao redor do Sol. Para dar essa volta inteira, ela demora um ano todinho!',
    emoji: '🚀',
    visualHint: '1 volta inteira no Sol = 1 ano no seu aniversário!',
  },
  rotacao: {
    id: 'rotacao',
    term: 'Rotação',
    simpleDefinition:
      'É a dança da Terra girando em volta de si mesma, parecendo uma bailarina ou um pião! O lado que fica virado para o Sol é de dia, e o lado que fica no escuro é de noite.',
    audioText:
      'Rotação. É o giro que a Terra dá em volta de si mesma como um pião. É esse giro que faz o dia nascer e a noite chegar!',
    emoji: '🌀',
    visualHint: '1 giro completo da Terra = 24 horas (1 dia e 1 noite).',
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
    subtitle: 'Por que o tempo muda tanto no ano?',
    badgeEmoji: '🕵️‍♂️',
    badgeName: 'Detetive do Espaço',
    introText:
      'Você já percebeu que tem meses que faz um calor gostoso de praia e outros em que precisamos de cobertor? Muita gente acha que o calor acontece porque a Terra chega mais perto do Sol, mas isso é só um boato!',
    audioIntro:
      'Missão 1: O Sol e a Terra! Por que o clima muda tanto durante o ano? Muita gente pensa que faz calor quando a Terra chega pertinho do Sol, mas isso é mentira! Vamos investigar o verdadeiro segredo.',
    keyTakeaway:
      'O calor e o frio não têm nada a ver com ficar perto ou longe do Sol. O segredo é que a Terra viaja pelo espaço meio deitadinha!',
    glossaryTermsUsed: ['translacao', 'eixo-terrestre'],
  },
  {
    id: 2,
    slug: 'movimento-de-translacao',
    title: '2. A Viagem do Ano (Translação)',
    subtitle: 'Um passeio incrível de 365 dias!',
    badgeEmoji: '🛸',
    badgeName: 'Piloto de Órbita',
    introText:
      'Aperte os cintos! A Terra nunca fica parada. Ela viaja pelo espaço em volta do Sol por um caminho chamado órbita. Para dar uma volta inteira, ela leva 365 dias e mais 6 horinhas.',
    audioIntro:
      'Missão 2: A Grande Viagem de Translação! A Terra passeia ao redor do Sol sem parar. Para dar uma volta completa, ela demora 365 dias e 6 horas, que é o tempo de um ano inteirinho!',
    keyTakeaway:
      'Essas 6 horas que sobram todo ano vão se juntando: depois de 4 anos, somam 24 horas (um dia novinho!), criando o Ano Bissexto com dia 29 de fevereiro no calendário!',
    glossaryTermsUsed: ['translacao', 'orbita', 'rotacao'],
  },
  {
    id: 3,
    slug: 'inclinacao-do-eixo',
    title: '3. O Planeta Inclinado',
    subtitle: 'O truque da lanterna e dos 23,5 graus!',
    badgeEmoji: '🔦',
    badgeName: 'Mestre da Luz Solar',
    introText:
      'Se a Terra ficasse em pé como uma vela, não teríamos estações do ano! Como ela fica meio deitadinha, a luz do Sol bate reto e bem quentinha num lugar, mas bate deitada e fraca em outro.',
    audioIntro:
      'Missão 3: O Planeta Inclinado! Como a Terra viaja inclinadinha no espaço, o Sol bate de jeitos diferentes: luz reta esquenta muito, igual a uma lanterna de perto; luz de lado se espalha e esquenta pouco!',
    keyTakeaway:
      'Luz que bate reta esquenta muito e faz o Verão. Luz que bate deitada se espalha, fica fraquinha e faz o Inverno!',
    glossaryTermsUsed: ['eixo-terrestre'],
  },
  {
    id: 4,
    slug: 'quatro-estacoes',
    title: '4. As Quatro Estações',
    subtitle: 'Um lado esquenta, o outro esfria!',
    badgeEmoji: '🌦️',
    badgeName: 'Guardião das Estações',
    introText:
      'A Terra funciona como um espelho mágica! Como o planeta é meio tortinho, quando a metade de baixo (onde fica o Brasil) ganha sol direto e vive o Verão, a metade de cima fica no frio do Inverno!',
    audioIntro:
      'Missão 4: As Quatro Estações! Quando a gente aqui no Brasil está na praia tomando picolé no Verão, lá na Europa as crianças estão usando casaco de lã e luvas no Inverno. Os dois lados da Terra são sempre opostos!',
    keyTakeaway:
      'Primavera e Outono são épocas de ventinho bom e flores, enquanto Verão e Inverno são as épocas de calorzão ou de friozinho.',
    glossaryTermsUsed: ['hemisferio', 'eixo-terrestre'],
  },
  {
    id: 5,
    slug: 'solsticios-e-equinocios',
    title: '5. Solstícios e Equinócios',
    subtitle: 'O cabo de guerra do Sol e da Lua!',
    badgeEmoji: '⚖️',
    badgeName: 'Astrónomo Chefe',
    introText:
      'O primeiro dia de cada estação tem um nome bem legal! Tudo depende de quem ganha o cabo de guerra das 24 horas: o Sol (dia claro para brincar) ou a Lua (noite escura para dormir).',
    audioIntro:
      'Missão 5: Solstícios e Equinócios! Quem ganha mais horas no relógio? Nos Equinócios dá empate perfeito: 12 horas de dia e 12 horas de noite! Nos Solstícios, um deles ganha de goleada!',
    keyTakeaway:
      'Equinócio é o grande empate: 12 horas de Sol e 12 horas de Lua. Solstício é o dia mais comprido do ano (Verão) ou a noite mais longa do ano (Inverno).',
    glossaryTermsUsed: ['rotacao', 'hemisferio'],
  },
  {
    id: 6,
    slug: 'grande-quiz-espacial',
    title: '6. O Grande Quiz dos Mestres',
    subtitle: 'Teste seus superpoderes sobre tudo o que você aprendeu!',
    badgeEmoji: '🏆',
    badgeName: 'Campeão Supremo',
    introText:
      'Chegou a hora do grande desafio final! Prove que você é um verdadeiro mestre da Terra e do Sol respondendo perguntas divertidas sobre todas as missões!',
    audioIntro:
      'Missão 6: O Grande Quiz dos Mestres do Espaço! Chegou a hora de testar tudo o que aprendemos nas missões anteriores. Mostre que você aprendeu os segredos da Terra e conquiste a sua coroa de Campeão Supremo!',
    keyTakeaway:
      'Parabéns! Você completou todas as missões e dominou a translação, o eixo inclinado de 23,5°, as quatro estações e o equilíbrio dos solstícios e equinócios!',
    glossaryTermsUsed: ['translacao', 'eixo-terrestre', 'hemisferio', 'orbita', 'rotacao'],
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
    shortDesc: 'A estação das flores e do cheirinho de natureza!',
    climate: 'Tempo gostoso, nem muito quente nem muito frio.',
    phenomenon: 'As árvores ganham brotos novos e os jardins ficam cheios de flores coloridas e borboletas.',
    dayNight: 'O dia e a noite duram quase o mesmo tempo (cerca de 12 horas cada).',
    sunRays: 'O Sol vai esquentando a terra aos pouquinhos.',
    colorTheme: 'from-pink-100 to-emerald-100 border-pink-300',
    badgeColor: 'bg-pink-500 text-white',
  },
  {
    id: 'verao',
    name: 'Verão',
    emoji: '☀️',
    shortDesc: 'A estação do sol forte, praia e piscina!',
    climate: 'Dias bem quentes e ensolarados para brincar.',
    phenomenon: 'Sol brilhando bem no alto do céu! É época de tomar picolé e se refrescar na água.',
    dayNight: 'Os dias são bem compridos e demora bastante para anoitecer!',
    sunRays: 'Os raios do Sol batem quase retos no chão e esquentam bastante.',
    colorTheme: 'from-amber-100 to-orange-100 border-amber-400',
    badgeColor: 'bg-amber-500 text-white',
  },
  {
    id: 'outono',
    name: 'Outono',
    emoji: '🍂',
    shortDesc: 'A estação das folhas amarelas e do ventinho fresco!',
    climate: 'O calorzão vai embora e começa a bater um ventinho fresco.',
    phenomenon: 'As folhas das árvores ficam amarelas, laranjas e vermelhas, e vão caindo no chão como um tapete.',
    dayNight: 'Os dias começam a ficar mais curtos e a noite chega mais cedo.',
    sunRays: 'O Sol fica mais suave e menos forte.',
    colorTheme: 'from-orange-100 to-yellow-100 border-orange-300',
    badgeColor: 'bg-orange-600 text-white',
  },
  {
    id: 'inverno',
    name: 'Inverno',
    emoji: '❄️',
    shortDesc: 'A estação do cobertor, gorro e chocolate quente!',
    climate: 'A época mais fria do ano! Em alguns lugares cai geada ou neve.',
    phenomenon: 'Hora de vestir casacos grossos, cachecol e luvas para ficar bem quentinho.',
    dayNight: 'As noites são bem longas e o dia escurece bem cedinho!',
    sunRays: 'O Sol passa baixinho no céu, batendo de lado e esquentando pouco.',
    colorTheme: 'from-sky-100 to-indigo-100 border-sky-300',
    badgeColor: 'bg-sky-600 text-white',
  },
];

export const ASTRONOMICAL_EVENTS: AstronomicalEvent[] = [
  {
    id: 'solsticio-verao',
    name: 'Solstício de Verão',
    dateSouth: '21 de dezembro (no Brasil)',
    whatHappens: 'É o dia mais comprido do ano! Temos bastante sol para brincar e uma noite bem curtinha.',
    startsSeason: 'Verão',
    dayHours: 14,
    nightHours: 10,
    emoji: '🏖️',
  },
  {
    id: 'equinocio-outono',
    name: 'Equinócio de Outono',
    dateSouth: '20 a 23 de março (no Brasil)',
    whatHappens: 'Empate perfeito! São 12 horas de luz do sol e 12 horas de noite escura.',
    startsSeason: 'Outono',
    dayHours: 12,
    nightHours: 12,
    emoji: '🍁',
  },
  {
    id: 'solsticio-inverno',
    name: 'Solstício de Inverno',
    dateSouth: '21 de junho (no Brasil)',
    whatHappens: 'É a noite mais longa e fria do ano! O Sol dorme cedo e a noite dura bastante.',
    startsSeason: 'Inverno',
    dayHours: 10,
    nightHours: 14,
    emoji: '🧣',
  },
  {
    id: 'equinocio-primavera',
    name: 'Equinócio de Primavera',
    dateSouth: '22 ou 23 de setembro (no Brasil)',
    whatHappens: 'Novo empate cósmico! O dia e a noite duram exatamente 12 horas cada.',
    startsSeason: 'Primavera',
    dayHours: 12,
    nightHours: 12,
    emoji: '🌻',
  },
];