export interface AnimalSoundData {
  verso: string;
  onomatopea: string;
  emoji: string;
  realAudioUrls: string[]; // Primary real audio URLs with fallbacks
}

export const ANIMAL_SOUNDS_MAP: Record<string, AnimalSoundData> = {
  // Savana & Predatori
  leone: {
    verso: 'Ruggito Maestoso',
    onomatopea: 'ROAAAR!',
    emoji: '🦁',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
      'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Lion%20roaring-sound1TamilNadu178.ogg',
    ],
  },
  elefante: {
    verso: 'Barrito Tonante',
    onomatopea: 'PAWOOO!',
    emoji: '🐘',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/elephant.mp3',
      'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3',
    ],
  },
  giraffa: {
    verso: 'Sibilo e Ronzio Infrasonico',
    onomatopea: 'Huumm-puff',
    emoji: '🦒',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/zebra.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/horse.mp3',
    ],
  },
  ghepardo: {
    verso: 'Cinguettio e Fusa Selvatiche',
    onomatopea: 'Chirp-Purr!',
    emoji: '🐆',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/leopard.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/cat.mp3',
    ],
  },
  ippopotamo: {
    verso: 'Bramito e Grugnito d\'Acqua',
    onomatopea: 'Huu-huu-grunt!',
    emoji: '🦛',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/pig.mp3',
    ],
  },
  rinoceronte: {
    verso: 'Sbuffo e Barrito',
    onomatopea: 'Snort-Puff!',
    emoji: '🦏',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/elephant.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
    ],
  },
  zebra: {
    verso: 'Raglio e Nitrito della Savana',
    onomatopea: 'Kua-kua-hiii!',
    emoji: '🦓',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/zebra.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/horse.mp3',
    ],
  },
  struzzo: {
    verso: 'Bramito Profondo e Sbuffo',
    onomatopea: 'Boom-boom-hiss!',
    emoji: '🪶',
    realAudioUrls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Struthio%20camelus%20-%20Common%20Ostrich%20call.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/turkey.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
    ],
  },
  cammello: {
    verso: 'Gorgoglio e Bramito',
    onomatopea: 'Grruuu-blub!',
    emoji: '🐪',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/sheep.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/cow.mp3',
    ],
  },
  coccodrillo: {
    verso: 'Soffio e Ruggito d\'Acqua',
    onomatopea: 'Hssss-Grrowl!',
    emoji: '🐊',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/komodo_dragon.mp3',
    ],
  },
  'mamba-nero': {
    verso: 'Sibilo Velenoso',
    onomatopea: 'Tsssssss!',
    emoji: '🐍',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/komodo_dragon.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
    ],
  },
  gazzella: {
    verso: 'Sbuffo d\'Allarme',
    onomatopea: 'Snort!',
    emoji: '🦌',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/sheep.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/zebra.mp3',
    ],
  },
  suricato: {
    verso: 'Fischio Sentinella',
    onomatopea: 'Peep-peep-bark!',
    emoji: '🦡',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/raccoon.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/monkey.mp3',
    ],
  },
  sciacallo: {
    verso: 'Guaio e Ululato',
    onomatopea: 'Yap-yaaargh!',
    emoji: '🐺',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/wolf.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/dog.mp3',
    ],
  },

  // Oceano & Creature Marine
  delfino: {
    verso: 'Click Sonico e Fischio',
    onomatopea: 'Klick-klick-iiik!',
    emoji: '🐬',
    realAudioUrls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Bottlenose%20dolphin%20whistles.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
    ],
  },
  pellicano: {
    verso: 'Croccare del Becco e Grugnito',
    onomatopea: 'Clap-clap-croak!',
    emoji: '🦢',
    realAudioUrls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Pelecanus%20crispus%20call.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/duck.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/turkey.mp3',
    ],
  },
  'squalo-bianco': {
    verso: 'Battito Idrodinamico e Mascelle',
    onomatopea: 'Chomp-Splash!',
    emoji: '🦈',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
    ],
  },
  'balena-azzurra': {
    verso: 'Canto Oceanico Ancestrale',
    onomatopea: 'Whaaa-oooo-mmmm!',
    emoji: '🐋',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Humpbackwhale2.ogg',
    ],
  },
  polpo: {
    verso: 'Spruzzo d\'Inchiostro e Gorgoglio',
    onomatopea: 'Whooosh-blub!',
    emoji: '🐙',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/duck.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
    ],
  },
  'tartaruga-marina': {
    verso: 'Sbuffo d\'Aria e Respiro',
    onomatopea: 'Pufff-fufff!',
    emoji: '🐢',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/turtle.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
    ],
  },
  orca: {
    verso: 'Fischio e Canto del Branco',
    onomatopea: 'Whiiist-clack!',
    emoji: '🐋',
    realAudioUrls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Orcinus%20orca.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
    ],
  },
  narvalo: {
    verso: 'Eco di Ghiaccio e Trilli',
    onomatopea: 'Click-ping-trill!',
    emoji: '🦄',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Bottlenose%20dolphin%20whistles.ogg',
    ],
  },
  foca: {
    verso: 'Abbaio Marino',
    onomatopea: 'Arf-arf-orfff!',
    emoji: '🦭',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/dog.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/pig.mp3',
    ],
  },
  manta: {
    verso: 'Volo d\'Onda Oceanica',
    onomatopea: 'Swoooosh-splash!',
    emoji: '🌊',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
    ],
  },
  medusa: {
    verso: 'Pulsazione Subacquea',
    onomatopea: 'Zzz-glowww...',
    emoji: '🪼',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
    ],
  },

  // Foresta & Boschi
  panda: {
    verso: 'Belato e Cinguettio',
    onomatopea: 'Bleat-honk!',
    emoji: '🐼',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/sheep.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/raccoon.mp3',
    ],
  },
  'panda-gigante': {
    verso: 'Belato e Cinguettio Soave',
    onomatopea: 'Bleat-honk-chirp!',
    emoji: '🐼',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/sheep.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/raccoon.mp3',
    ],
  },
  gorilla: {
    verso: 'Bramito e Tamburo sul Petto',
    onomatopea: 'Thump-thump-Hooo!',
    emoji: '🦍',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/monkey.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
    ],
  },
  'aquila-reale': {
    verso: 'Grido Stridente Regale',
    onomatopea: 'Kreee-aaargh!',
    emoji: '🦅',
    realAudioUrls: [
      'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Aquila%20chrysaetos%20call.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/owl.mp3',
    ],
  },
  'falco-pellegrino': {
    verso: 'Grido Rapido in Picchiata',
    onomatopea: 'Kek-kek-kreee!',
    emoji: '🦅',
    realAudioUrls: [
      'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Falco%20peregrinus%20-%20Peregrine%20Falcon%20call.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/owl.mp3',
    ],
  },
  'orso-grizzly': {
    verso: 'Ruggito e Ringhio da Titano',
    onomatopea: 'GRRR-ROAARR!',
    emoji: '🐻',
    realAudioUrls: [
      'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/tiger.mp3',
    ],
  },
  lupo: {
    verso: 'Ululato al Chiaro di Luna',
    onomatopea: 'AWOOOOOO!',
    emoji: '🐺',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/wolf.mp3',
      'https://assets.mixkit.co/active_storage/sfx/2872/2872-preview.mp3',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Wolf%20howls.ogg',
    ],
  },
  tigre: {
    verso: 'Ruggito Reale da Giungla',
    onomatopea: 'ROOOAAAR-GRRR!',
    emoji: '🐅',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/tiger.mp3',
      'https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
    ],
  },
  volpe: {
    verso: 'Guaio e Latrato Notturno',
    onomatopea: 'Ring-ding-yap!',
    emoji: '🦊',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/raccoon.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/dog.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/wolf.mp3',
    ],
  },
  gufo: {
    verso: 'Bubolio Notturno',
    onomatopea: 'Uh-uh-huuuu!',
    emoji: '🦉',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/owl.mp3',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Bubo%20bubo.ogg',
    ],
  },
  cervo: {
    verso: 'Bramito dei Boschi',
    onomatopea: 'Bellow-hrooor!',
    emoji: '🦌',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/cow.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/sheep.mp3',
    ],
  },
  scoiattolo: {
    verso: 'Cip-Cip e Schiocco',
    onomatopea: 'Chitter-clack!',
    emoji: '🐿️',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/raccoon.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/hedgehog.mp3',
    ],
  },
  riccio: {
    verso: 'Sbuffetto e Schiocco',
    onomatopea: 'Snuff-snuff!',
    emoji: '🦔',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/hedgehog.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/pig.mp3',
    ],
  },

  // Giungla Tropicale
  scimpanze: {
    verso: 'Urla e Schiamazzi da Branco',
    onomatopea: 'Ooh-ooh-aah-aah!',
    emoji: '🐵',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/monkey.mp3',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Chimpanzee%20pant-hoot.ogg',
    ],
  },
  'pappagallo-ara': {
    verso: 'Grido e Parlata Tropicale',
    onomatopea: 'Craaac-Ciao!',
    emoji: '🦜',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/rooster.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/turkey.mp3',
    ],
  },
  camaleonte: {
    verso: 'Soffio Silenzioso',
    onomatopea: 'Tshhh-snap!',
    emoji: '🦎',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/komodo_dragon.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
    ],
  },
  bradipo: {
    verso: 'Sospirone Lento',
    onomatopea: 'Aaaahhh-zooom...',
    emoji: '🦥',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/sheep.mp3',
    ],
  },
  tucano: {
    verso: 'Croccare del Becco',
    onomatopea: 'Croc-croc-kreeek!',
    emoji: '🦜',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/duck.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/turkey.mp3',
    ],
  },
  koala: {
    verso: 'Bramito Rauco',
    onomatopea: 'Grruuunt-snore!',
    emoji: '🐨',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/pig.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/sheep.mp3',
    ],
  },
  fenicottero: {
    verso: 'Starnazzo d\'Acqua',
    onomatopea: 'Honk-honk-flaaap!',
    emoji: '🦩',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/duck.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/turkey.mp3',
    ],
  },
  giaguaro: {
    verso: 'Ruggito Furtivo e Ringhio',
    onomatopea: 'Roaaar-grrr!',
    emoji: '🐆',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/leopard.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/tiger.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
    ],
  },
  rana: {
    verso: 'Gracidio dello Stagno',
    onomatopea: 'Cra-cra-ribbit!',
    emoji: '🐸',
    realAudioUrls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Rana%20temporaria.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/duck.mp3',
    ],
  },

  // Preistoria & Dinosauri
  trex: {
    verso: 'Ruggito del Re dei Dinosauri',
    onomatopea: 'SKRRRR-ROAAAR!',
    emoji: '🦖',
    realAudioUrls: [
      'https://assets.mixkit.co/active_storage/sfx/2875/2875-preview.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
    ],
  },
  velociraptor: {
    verso: 'Stridio Cacciatore Furtivo',
    onomatopea: 'Chirp-shriek-hiss!',
    emoji: '🦖',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/komodo_dragon.mp3',
      'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
    ],
  },
  triceratopo: {
    verso: 'Bramito Corazzato',
    onomatopea: 'Grumph-rooor!',
    emoji: '🦕',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/elephant.mp3',
    ],
  },
  brachiosauro: {
    verso: 'Canto del Gigante Erbivoro',
    onomatopea: 'Hwoooo-ummm!',
    emoji: '🦕',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/whale.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/elephant.mp3',
    ],
  },
  stegosauro: {
    verso: 'Sbuffo a Placche Ossee',
    onomatopea: 'Thump-grunt!',
    emoji: '🦕',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/alligator.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/pig.mp3',
    ],
  },
  pterodattilo: {
    verso: 'Grido Alato Preistorico',
    onomatopea: 'Skreee-swoosh!',
    emoji: '🦇',
    realAudioUrls: [
      'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/owl.mp3',
    ],
  },
  mammut: {
    verso: 'Barrito Glaciale',
    onomatopea: 'TRUUU-PAWOOO!',
    emoji: '🦣',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/elephant.mp3',
      'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3',
    ],
  },
  'dente-a-sciabola': {
    verso: 'Ruggito Glaciale e Ringhio',
    onomatopea: 'ROAAAR-SNARL!',
    emoji: '🐅',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/tiger.mp3',
      'https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
    ],
  },

  // Polo & Regioni Polari
  'orso-polare': {
    verso: 'Ruggito e Sbuffo Polare',
    onomatopea: 'GRRR-HUFF-ROAAR!',
    emoji: '🐻‍❄️',
    realAudioUrls: [
      'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/tiger.mp3',
    ],
  },
  'pinguino-imperatore': {
    verso: 'Trillo e Canto da Colonia',
    onomatopea: 'Honk-kraa-trill!',
    emoji: '🐧',
    realAudioUrls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Aptenodytes%20forsteri%20-%20Emperor%20Penguin%20call.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/duck.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/rooster.mp3',
    ],
  },
  pinguino: {
    verso: 'Trillo e Canto da Colonia',
    onomatopea: 'Honk-kraa-trill!',
    emoji: '🐧',
    realAudioUrls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Aptenodytes%20forsteri%20-%20Emperor%20Penguin%20call.ogg',
      'https://www.google.com/logos/fnbx/animal_sounds/duck.mp3',
      'https://www.google.com/logos/fnbx/animal_sounds/rooster.mp3',
    ],
  },
};

export function getAnimalSoundMeta(animalId: string, animalNome?: string): AnimalSoundData {
  const normId = animalId.toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  if (ANIMAL_SOUNDS_MAP[normId]) {
    return ANIMAL_SOUNDS_MAP[normId];
  }

  // Alias fallbacks
  if (normId.includes('panda') && ANIMAL_SOUNDS_MAP['panda-gigante']) {
    return ANIMAL_SOUNDS_MAP['panda-gigante'];
  }
  if (normId.includes('pinguino') && ANIMAL_SOUNDS_MAP['pinguino-imperatore']) {
    return ANIMAL_SOUNDS_MAP['pinguino-imperatore'];
  }
  if (normId.includes('orso-polare') && ANIMAL_SOUNDS_MAP['orso-polare']) {
    return ANIMAL_SOUNDS_MAP['orso-polare'];
  }
  if (normId.includes('orso') && ANIMAL_SOUNDS_MAP['orso-grizzly']) {
    return ANIMAL_SOUNDS_MAP['orso-grizzly'];
  }
  if (normId.includes('falco') && ANIMAL_SOUNDS_MAP['falco-pellegrino']) {
    return ANIMAL_SOUNDS_MAP['falco-pellegrino'];
  }
  if (normId.includes('aquila') && ANIMAL_SOUNDS_MAP['aquila-reale']) {
    return ANIMAL_SOUNDS_MAP['aquila-reale'];
  }
  if (normId.includes('lupo') && ANIMAL_SOUNDS_MAP['lupo']) {
    return ANIMAL_SOUNDS_MAP['lupo'];
  }

  return {
    verso: `Verso di ${animalNome || 'Animale'}`,
    onomatopea: 'Verso caratteristico!',
    emoji: '🐾',
    realAudioUrls: [
      'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3',
    ],
  };
}
