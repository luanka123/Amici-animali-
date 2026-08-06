import { Animal } from '../types';

/**
 * Mappa di curiosità multiple per ciascun animale.
 * Ogni riapertura dell'app o rotazione dinamica seleziona una curiosità differente!
 */
export const EXTRA_CURIOSITIES: Record<string, string[]> = {
  leone: [
    "Il ruggito del leone è così potente da poter essere sentito fino a 8 chilometri di distanza!",
    "I leoni dormono fino a 20 ore al giorno per risparmiare energie per le battute di caccia!",
    "Le leonesse sono le principali cacciatrici del branco e lavorano sempre in squadra perfetta.",
    "La criniera del leone maschio diventa più scura e folta man mano che cresce ed è più forte!",
  ],
  elefante: [
    "Usa la sua proboscide speciale per bere, salutare i compagni e raccogliere cibo!",
    "Un elefante ha circa 40.000 muscoli solo nella proboscide, più di tutto il corpo umano!",
    "Gli elefanti sono incredibilmente empatici e riescono a riconoscersi allo specchio!",
    "Le orecchie dell'elefante africano hanno la forma precisa del continente africano!",
  ],
  giraffa: [
    "Il suo collo è altissimo, ma ha esattamente 7 vertebre proprio come quello degli esseri umani!",
    "La lingua della giraffa è di colore blu-viola scuro ed è lunga fino a 50 centimetri per proteggersi dal sole!",
    "Le giraffe dormono in media soltanto 30 minuti al giorno, spesso rimanendo in piedi!",
    "Le macchie sulla pelle della giraffa sono uniche per ciascun individuo, come le nostre impronte digitali!",
  ],
  ghepardo: [
    "È l'animale terrestre più veloce in assoluto: scatta da 0 a 100 km/h in soli tre secondi!",
    "Ha delle strisce nere sotto gli occhi chiamate 'linee di lacrime' che assorbono il sole e gli permettono di mirare le prede!",
    "A differenza degli altri grandi felini, il ghepardo non può ruggire ma fa le fusa come un gattino domestico!",
    "Durante la corsa ad alta velocità, la sua lunga coda funziona come il timone di una barca per virare all'istante!",
  ],
  ippopotamo: [
    "Suda un fluido rosa naturale che protegge la sua pelle dal sole come una crema solare!",
    "Nonostante il corpo pesante, può correre a oltre 30 km/h a terra e trattenere il respiro sott'acqua per 5 minuti!",
    "Gli ippopotami trascorrono quasi tutta la giornata immersi in acqua dolce per mantenere fresca la pelle.",
    "I suoi denti canini crescono per tutta la vita e possono superare i 50 centimetri di lunghezza!",
  ],
  rinoceronte: [
    "Il suo famoso corno è fatto di cheratina, la stessa sostanza di cui sono fatte le nostre unghie e i nostri capelli!",
    "Ha una vista molto debole, ma compensa con un udito ed un olfatto straordinariamente sviluppati!",
    "Adora fare i bagni nel fango: il fango fresco lo protegge dalle punture di insetto e dal caldo scottante.",
    "Un gruppo di rinoceronti viene chiamato in etologia 'uno schianto'!",
  ],
  zebra: [
    "Non esistono due zebre con le stesse strisce: il loro mantello è unico al mondo come un'impronta digitale!",
    "Le strisce bicolore creano un effetto ottico che confonde gli insetti fastidiosi e i grandi predatori.",
    "Le zebre dormono in piedi e mantengono sempre una sentinella sveglia nel branco a fare la guardia.",
    "Comunicano tra loro muovendo le orecchie e attraverso una grande varietà di nitriti ed abbaghi!",
  ],
  suricato: [
    "I suricati fanno le sentinelle: uno sta in piedi sulle zampe dietro per fare la guardia mentre gli altri cercano cibo!",
    "Sono immuni al veleno di molti scorpioni e serpenti della savana!",
    "I suricati vivono in grandi famiglie sotterranee chiamate 'mob' dotate di centinaia di gallerie interconnesse.",
    "I cuccioli imparano a cacciare seguendo gli adulti che insegnano loro le tecniche di sopravvivenza.",
  ],
  struzzo: [
    "È l'uccello più grande del mondo e fa uova giganti, ma non può volare! In compenso corre velocissimo!",
    "Gli occhi dello struzzo sono grandi quanto palline da biliardo e più grandi del suo stesso cervello!",
    "Con un solo calcio delle sue zampe potentissime può difendersi anche dai leoni!",
    "Le uova di struzzo pesano quanto circa 24 uova di gallina messe insieme!",
  ],
  cammello: [
    "Nelle sue gobbe conserva grasso da trasformare in energia e acqua per resistere settimane nel deserto senza bere!",
    "Ha tre palpebre per occhio e due file di lunghe ciglia per proteggersi dalle tempeste di sabbia!",
    "Può chiudere completamente le narici per non far entrare neanche un granello di sabbia nel naso!",
    "Riesce a bere fino a 100 litri d'acqua in soli 10 minuti quando trova un'oasi!",
  ],
  delfino: [
    "Dorme mantenendo solo metà del cervello a riposo per continuare a respirare in superficie!",
    "I delfini si danno nomi propri tra loro usando fischi speciali ed unici al mondo!",
    "Usano l'ecolocalizzazione: emettono suoni che rimbombano per 'vedere' gli oggetti e i pesci al buio!",
    "Sono animali giocherelloni che amano fare capriole e saltare sui flutti delle navi!",
  ],
  pellicano: [
    "Ha una tasca sotto il becco che può contenere fino a 13 litri d'acqua per catturare i pesci!",
    "Per inghiottire il pesce, il pellicano piega il collo all'indietro per far scivolare l'acqua fuori dalla sacca.",
    "Volano in formazione a 'V' per risparmiare energia e viaggiare insieme per lunghissime distanze.",
    "I cuccioli di pellicano mangiano direttamente dal becco dei genitori!",
  ],
  "squalo-bianco": [
    "Può sentire una singola goccia di sangue in 100 litri d'acqua e ha migliaia di denti di ricambio!",
    "Non ha ossa nel corpo: il suo scheletro è fatto interamente di cartilagine flessibile, come la punta del nostro naso!",
    "Gli squali esistono sulla Terra da più di 400 milioni di anni, prima ancora dei dinosauri!",
    "Possono percepire i minimi campi elettrici emessi dai cuori degli altri pesci nell'acqua!",
  ],
  "balena-azzurra": [
    "È l'animale più grande mai esistito sulla Terra, persino più grande del più grande dinosauro!",
    "Il cuore della balena azzurra è grande quanto una piccola automobile e pesa circa 180 kg!",
    "Il suo canto sott'acqua può viaggiare per centinaia di chilometri ed è il suono più forte del mondo animale!",
    "Mangia fino a 4 tonnellate di minuscoli gamberetti (krill) ogni singolo giorno!",
  ],
  polpo: [
    "Ha tre cuori, sangue blu e può cambiare colore della pelle in meno di un secondo per mimetizzarsi!",
    "I suoi otto bracci sono dotati di ventose intelligenti che possono sentire i sapori del cibo toccandolo!",
    "È un animale incredibilmente intelligente capace di svitare tappi di barattoli e risolvere labirinti!",
    "Se si sente in pericolo, spruzza una nuvola di inchiostro nero per scappare al sicuro!",
  ],
  "tartaruga-marina": [
    "Nuota per migliaia di chilometri attraverso gli oceani e ritorna esattamente sulla stessa spiaggia per deporre le uova!",
    "Può trattenere il respiro sott'acqua per diverse ore mentre riposa sul fondo del mare!",
    "Le tartarughe marine esistono da oltre 100 milioni di anni ed hanno nuotato insieme ai mosasauri!",
    "Il guscio della tartaruga è collegato alla sua colonna vertebrale ed è la sua casa protettiva per tutta la vita!",
  ],
  orca: [
    "Chiamata balena assassina, in realtà è il delfino più grande del mondo ed è molto affettuosa con la sua famiglia!",
    "Ogni famiglia di orche ha un proprio dialetto di suoni e canti unico al mondo!",
    "Lavora in squadra per cacciare e insegna le strategie ai propri cuccioli per generazioni.",
    "Le orche non hanno predatori naturali nell'oceano e sono considerate le regine dei mari!",
  ],
  narvalo: [
    "È conosciuto come l'unicorno del mare perché ha un lungo dente a spirale che spunta dalla bocca!",
    "Il lungo zanna del narvalo è pieno di milioni di terminazioni nervose per sentire la temperatura del mare!",
    "Vive nelle gelide acque dell'Artico e può immergersi fino a 1.500 metri di profondità!",
    "I maschi sfiorano delicatamente i loro denti tra loro come un saluto di pace tra unicorni marini!",
  ],
  "panda-gigante": [
    "Trascorre fino a 12 ore al giorno a sgranocchiare deliziosi germogli e foglie di bambù!",
    "I panda hanno un 'falso pollice' speciale sulla zampa che li aiuta ad afferrare saldamente le canne di bambù!",
    "I cuccioli di panda quando nascono sono rosa, ciechi e piccolissimi, grandi quanto un panetto di burro!",
    "Nonostante la stazza enorme, i panda sono ottimi arrampicatori sugli alberi e sanno nuotare benissimo!",
  ],
  gufo: [
    "Può ruotare la testa fino a 270 gradi per guardarsi attorno senza muovere il corpo!",
    "Le piume del gufo sono così soffici e speciali da rendere il suo volo completamente silenzioso al 100%!",
    "I suoi grandi occhi gialli o arancioni non possono ruotare, per questo deve girare tutta la testa!",
    "Ha un udito così sensibile da sentire un topolino muoversi sotto la neve o sotto le foglie secche!",
  ],
  tigre: [
    "A differenza di quasi tutti gli altri gatti e felini, la tigre adora nuotare e giocare nell'acqua!",
    "Le strisce della tigre non sono solo sul pelo, ma sono disegnate anche sulla sua pelle sottostante!",
    "Ogni tigre ha un disegno di strisce unico al mondo, proprio come le impronte digitali umane!",
    "I ruggiti della tigre contengono frequenze bassissime che possono paralizzare temporaneamente le prede!",
  ],
  gorilla: [
    "Condividiamo con il gorilla oltre il 98% del nostro DNA! Si batte i pugni sul petto per farsi sentire.",
    "I gorilla costruiscono un nuovo letto di foglie morbide sugli alberi o a terra ogni singola sera!",
    "Ogni gorilla ha un disegno delle rughe del naso (impronta nasale) unico al mondo!",
    "Sono vegetariani pacifici che amano mangiare frutti e germogli in compagnia della propria famiglia.",
  ],
  camaleonte: [
    "I suoi occhi possono muoversi e guardare in due direzioni diverse contemporaneamente!",
    "Cambia colore non solo per mimetizzarsi, ma anche per mostrare le sue emozioni o regolare la temperatura!",
    "La sua lingua appiccicosa può scattare a velocità fulminea ed è più lunga del suo stesso corpo!",
    "Le sue zampe sono divise in due dita fuse per afferrare i rami saldamente come con delle pinze!",
  ],
  tucano: [
    "Il suo becco colorato è gigantesco ma è leggerissimo perché all'interno è cavo e pieno d'aria!",
    "Usa il suo grande becco come un radiatore naturale per regolare la temperatura corporea quando fa caldo!",
    "Quando dorme, piega la testa all'indietro e copre il becco con la coda per trasformarsi in una palla di piume!",
    "I tucani amano giocare lanciandosi bacche e piccoli frutti tra loro con il becco!",
  ],
  bradipo: [
    "Si muove così lentamente che minuscole alghe verdi crescono sul suo pelo per mimetizzarlo nella foresta!",
    "I bradipi impiegano fino a un mese intero per digerire una singola foglia nello stomaco!",
    "Sono ottimi nuotatori: in acqua riescono a muoversi tre volte più velocemente rispetto a terra!",
    "Dormono fino a 15-18 ore al giorno appesi a testa in giù ai rami più alti degli alberi!",
  ],
  koala: [
    "Dorme fino a 20 ore al giorno ed è ghiotto solo di deliziose foglie di eucalipto!",
    "I koala hanno impronte digitali quasi identiche a quelle degli esseri umani!",
    "Il cucciolo di koala nasce piccolissimo ed abita nella tasca della mamma per i primi 6 mesi di vita.",
    "Non hanno quasi mai bisogno di bere acqua perché ricavano tutta l'idratazione dalle foglie fresche!",
  ],
  "aquila-reale": [
    "Ha una vista così potente da poter vedere una piccola lepre a oltre 3 chilometri di distanza!",
    "Può volare a oltre 240 km/h quando si tuffa in picchiata dal cielo!",
    "Le aquile costruiscono nidi giganti sui dirupi chiamati 'aniere' che usano per tutta la vita!",
    "I suoi artigli sono così forti da avere una presa più potente della stretta di una mano d'uomo adulto!",
  ],
  fenicottero: [
    "Diventa rosa perché mangia tantissimi piccoli gamberetti rosa ricchi di pigmenti naturali!",
    "I fenicotteri dormono spesso in piedi mantenendosi in equilibrio su una sola gamba per risparmiare calore!",
    "Costruiscono nidi di fango a forma di piccolo vulcano per proteggere il loro unico uovo!",
    "I cuccioli di fenicottero nascono con piume grigie o bianche e diventano rosa crescendo!",
  ],
  trex: [
    "I suoi denti erano lunghi fino a 30 centimetri, grandi quanto una banana gigantesca!",
    "A dispetto delle braccia corte, ogni braccio del T-Rex poteva sollevare oltre 200 chilogrammi!",
    "Aveva un olfatto formidabile ed un morso più potente di qualsiasi altro animale mai esistito sulla Terra!",
    "Il Tyrannosaurus Rex aveva una vista eccellente e tridimensionale, proprio come i grandi rapaci moderni!",
  ],
  triceratopo: [
    "Il suo grande collare osseo e i tre corni gli servivano da scudo per difendersi dal T-Rex!",
    "Aveva tra i 400 e i 800 denti disposti in batterie che si sostituivano continuamente mentre masticava piante!",
    "Il cranio del triceratopo era gigantesco, lungo fino a un terzo dell'intero suo corpo!",
    "Era un dinosauro erbivoro tranquillo ma molto coraggioso se doveva proteggere i piccoli del branco!",
  ],
  brachiosauro: [
    "Il suo collo era così lungo che poteva brucare le foglie sulla cima di alberi alti 4 piani!",
    "Le sue zampe anteriori erano più lunghe di quelle posteriori, proprio come nelle giraffe moderne!",
    "Si stima che un brachiosauro dovesse mangiare oltre 400 chilogrammi di vegetali ogni giorno!",
    "A differenza di altri dinosauri, il brachiosauro teneva il collo eretto verso il cielo per raggiungere le cime alti!",
  ],
  pterodattilo: [
    "Aveva grandi ali di pelle tese tra le dita e poteva volare alto sopra i mari preistorici!",
    "I suoi fossili dimostrano che le sue ossa erano cave e leggerissime come quelle degli uccelli odierni!",
    "Aveva un lungo becco sottile dotato di denti aguzzi per catturare i pesci al volo sulle onde!",
    "Non era propriamente un dinosauro, ma un rettile volante preistorico appartenente ai pterosauri!",
  ],
  velociraptor: [
    "Aveva un grande artiglio a falce sulle zampe posteriori per cacciare in branco in modo velocissimo!",
    "I velociraptor reali erano coperti di piume colorate ed erano grandi circa quanto un tacchino o un grande cane!",
    "Erano dinosauri intelligenti e rapidi con un cervello molto grande rispetto alla loro stazza!",
    "Utilizzavano la lunga coda rigida per bilanciarsi perfettamente durante le virate veloci in corsa!",
  ],
  stegosauro: [
    "Aveva grandi placche ossee sulla schiena a forma di aquilone e quattro spini sulla coda per difesa!",
    "Nonostante la stazza imponente di oltre 5 tonnellate, il suo cervello era grande quanto una noce!",
    "Le placche sulla schiena venivano usate per regolare la temperatura corporea scambiando calore col sole.",
    "Era un lento e pacifico erbivoro che camminava a testa bassa brucando felci e cespugli bassi!",
  ],
  "orso-polare": [
    "Sotto la sua folta pelliccia bianca, la sua pelle è completamente nera per assorbire il calore del sole!",
    "I peli dell'orso polare non sono bianchi ma trasparenti e cavi per intrappolare l'aria calda attorno al corpo!",
    "È un nuotatore eccellente e può nuotare per giorni interi nell'oceano gelato senza fermarsi!",
    "Le sue zampe sono larghe come racchette da neve con cuscinetti antiscivolo per non scivolare sul ghiaccio!",
  ],
  "pinguino-imperatore": [
    "I papà pinguino tengono l'uovo al caldo sui loro piedi sotto la pancia per due mesi durante la bufera gelida!",
    "Possono tuffarsi nel mare polare fino a oltre 500 metri di profondità e trattenere il respiro per 20 minuti!",
    "Per riscaldarsi nelle tempeste polari, migliaia di pinguini si stringono insieme a turno ruotando dal centro all'esterno!",
    "I pinguini imperatore sono i più alti e pesanti di tutte le specie di pinguini viventi!",
  ]
};

/**
 * Restituisce una curiosità casuale o fresca per l'animale specificato.
 */
export function getRandomCuriosity(animalId: string, currentCuriosity?: string): string {
  const list = EXTRA_CURIOSITIES[animalId];
  if (!list || list.length === 0) {
    return currentCuriosity || "Un fantastico animale con abilità uniche da scoprire!";
  }

  // Filtra la curiosità attuale se presente per variare sempre
  const available = currentCuriosity ? list.filter(c => c !== currentCuriosity) : list;
  const pool = available.length > 0 ? available : list;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Processa l'elenco degli animali e assegna a ciascuno una curiosità fresca casuale ad ogni apertura/avvio dell'app.
 */
export function randomizeAnimalCuriosities<T extends Animal>(animals: T[]): T[] {
  return animals.map(animal => {
    const freshFact = getRandomCuriosity(animal.id);
    return {
      ...animal,
      fattoCurioso: freshFact,
      fattiCuriosi: EXTRA_CURIOSITIES[animal.id] || [animal.fattoCurioso]
    };
  });
}
