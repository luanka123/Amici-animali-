import React, { useState } from 'react';
import { Animal, AnimalHabitat } from '../types';
import { Search, Volume2, Sparkles, Filter, Info, ShieldAlert, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/audio';
import { getRandomCuriosity } from '../utils/curiosities';

interface EncyclopediaViewProps {
  animals: Animal[];
  onSelectAnimalForMode?: (animal: Animal) => void;
}

export const EncyclopediaView: React.FC<EncyclopediaViewProps> = ({ animals }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHabitat, setSelectedHabitat] = useState<AnimalHabitat | 'tutti'>('tutti');
  const [activeAnimal, setActiveAnimal] = useState<Animal | null>(null);

  // Filter animals based on search query and habitat filter
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.fattoCurioso.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.habitat.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHabitat = selectedHabitat === 'tutti' || animal.habitat === selectedHabitat;

    return matchesSearch && matchesHabitat;
  });

  const handleSpeak = (text: string) => {
    sound.playPop();
    sound.speak(text);
  };

  const getHabitatBadgeColor = (habitat: AnimalHabitat) => {
    switch (habitat) {
      case 'savana':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'oceano':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'foresta':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Search Bar Area */}
      <div className="frosted rounded-[32px] p-6 border border-emerald-200/60 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grande Enciclopedia della Natura</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-stone-900">
              Esplora Tutti gli Animali 📚
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
              Scopri foto, habitat, statistiche e segreti di ogni specie animalistica!
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca animale (es. Leone, bambù)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 rounded-2xl border border-emerald-200 text-sm font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 font-bold text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Habitat Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-emerald-100 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-stone-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Habitat:
          </span>

          {(['tutti', 'savana', 'oceano', 'foresta'] as const).map((habitat) => (
            <button
              key={habitat}
              onClick={() => {
                sound.playPop();
                setSelectedHabitat(habitat);
              }}
              className={`px-3 py-1 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all btn-active shrink-0 ${
                selectedHabitat === habitat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/70 text-stone-600 hover:bg-emerald-50'
              }`}
            >
              {habitat === 'tutti' ? '🌟 Tutti' : habitat === 'savana' ? '🦁 Savana' : habitat === 'oceano' ? '🐬 Oceano' : '🌲 Foresta'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Encyclopedia Cards */}
      {filteredAnimals.length === 0 ? (
        <div className="frosted rounded-3xl p-8 text-center border border-amber-200">
          <p className="text-base font-bold text-stone-600">
            Nessun animale trovato per "{searchQuery}". Prova una nuova ricerca!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <motion.div
              key={animal.id}
              whileHover={{ y: -6 }}
              className="frosted rounded-[28px] overflow-hidden border-2 border-emerald-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between bg-white/95"
            >
              <div>
                {/* Photo Header - TALL & SPACIOUS */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-100 border-b-2 border-emerald-100">
                  <img
                    src={animal.foto}
                    alt={animal.nome}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span
                    className={`absolute top-3 left-3 text-xs font-black uppercase px-3 py-1 rounded-full border-2 shadow-sm ${getHabitatBadgeColor(
                      animal.habitat
                    )}`}
                  >
                    {animal.habitat}
                  </span>
                  <button
                    onClick={() => handleSpeak(`${animal.nome}. ${animal.fattoCurioso}`)}
                    className="absolute top-3 right-3 p-2.5 bg-white/90 hover:bg-white text-emerald-950 rounded-full shadow-lg transition-all btn-active border border-emerald-200"
                    title="Ascolta curiosità"
                  >
                    <Volume2 className="w-5 h-5 text-emerald-700" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-2xl font-black font-display text-stone-900 leading-tight">
                    {animal.nome}
                  </h3>

                  <p className="text-sm font-semibold text-stone-800 line-clamp-3 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                    💡 {animal.fattoCurioso}
                  </p>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-extrabold text-stone-800">
                    <div className="bg-emerald-100/80 p-2 rounded-xl border border-emerald-200 text-center">
                      🏋️ {animal.statistiche.peso}
                    </div>
                    <div className="bg-emerald-100/80 p-2 rounded-xl border border-emerald-200 text-center">
                      ⚡ {animal.statistiche.velocita}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    sound.playPop();
                    setActiveAnimal(animal);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 btn-active border border-emerald-500"
                >
                  <Info className="w-4 h-4" />
                  <span>Apri Scheda Dettagliata</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Detailed Inspection - ENLARGED DIALOG & HUGE PHOTO */}
      <AnimatePresence>
        {activeAnimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActiveAnimal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="frosted-dark rounded-[40px] max-w-2xl w-full overflow-hidden p-6 md:p-8 shadow-2xl border-2 border-emerald-300/60 relative space-y-5 bg-stone-900/90 text-white"
            >
              <button
                onClick={() => setActiveAnimal(null)}
                className="absolute top-5 right-5 bg-stone-200/90 hover:bg-white text-stone-900 w-10 h-10 rounded-full font-black text-lg flex items-center justify-center transition-colors shadow-md z-20"
              >
                ✕
              </button>

              <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 md:h-96 border-2 border-emerald-300/50 shadow-2xl bg-black">
                <img
                  src={activeAnimal.foto}
                  alt={activeAnimal.nome}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-3xl sm:text-4xl font-black font-display text-emerald-200">
                  {activeAnimal.nome}
                </h3>
                <button
                  onClick={() => handleSpeak(`${activeAnimal.nome}. ${activeAnimal.fattoCurioso}`)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-colors flex items-center gap-2 text-sm font-black shadow-md"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Ascolta 🔊</span>
                </button>
              </div>

              <div className="bg-stone-800/90 rounded-2xl p-5 border border-emerald-300/40 text-base font-bold text-stone-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-black text-emerald-300 text-lg flex items-center gap-2">
                    🌟 Curiosità Speciale:
                  </p>
                  <button
                    onClick={() => {
                      sound.playPop();
                      const nextFact = getRandomCuriosity(activeAnimal.id, activeAnimal.fattoCurioso);
                      setActiveAnimal({ ...activeAnimal, fattoCurioso: nextFact });
                      sound.speak(`Altra curiosità: ${nextFact}`);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all btn-active border border-emerald-400"
                    title="Mostra un'altra curiosità per questo animale"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Altra Curiosità</span>
                  </button>
                </div>
                <p className="leading-relaxed">"{activeAnimal.fattoCurioso}"</p>
              </div>

              {/* Stats detail */}
              <div className="grid grid-cols-2 gap-3 text-sm font-extrabold text-stone-200">
                <div className="bg-stone-800/80 p-3 rounded-2xl border border-emerald-300/30">
                  🏋️ Peso: <span className="text-emerald-300 font-black">{activeAnimal.statistiche.peso}</span>
                </div>
                <div className="bg-stone-800/80 p-3 rounded-2xl border border-emerald-300/30">
                  ⚡ Velocità: <span className="text-emerald-300 font-black">{activeAnimal.statistiche.velocita}</span>
                </div>
                <div className="bg-stone-800/80 p-3 rounded-2xl border border-emerald-300/30">
                  📏 Lunghezza: <span className="text-emerald-300 font-black">{activeAnimal.statistiche.lunghezza}</span>
                </div>
                <div className="bg-stone-800/80 p-3 rounded-2xl border border-emerald-300/30">
                  🎂 Longevità: <span className="text-emerald-300 font-black">{activeAnimal.statistiche.longevita}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveAnimal(null)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-colors font-display shadow-xl text-base btn-active"
              >
                Chiudi Scheda
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
