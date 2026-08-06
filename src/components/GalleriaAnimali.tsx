import React, { useState } from 'react';
import { Animal, AnimalHabitat } from '../types';
import { HabitatBadge } from './HabitatBadge';
import { StatCard } from './StatCard';
import { Volume2, Sparkles, Filter, X, Lightbulb, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';
import { getRandomCuriosity } from '../utils/curiosities';

interface GalleriaAnimaliProps {
  animals: Animal[];
  onSelectAnimalForScopri: (index: number) => void;
}

export const GalleriaAnimali: React.FC<GalleriaAnimaliProps> = ({
  animals,
  onSelectAnimalForScopri,
}) => {
  const [filterHabitat, setFilterHabitat] = useState<AnimalHabitat | 'tutti'>('tutti');
  const [activeModalAnimal, setActiveModalAnimal] = useState<Animal | null>(null);
  const [isModalFlipped, setIsModalFlipped] = useState<boolean>(false);

  const filteredAnimals = animals.filter(
    (a) => filterHabitat === 'tutti' || a.habitat === filterHabitat
  );

  const handleOpenModal = (animal: Animal) => {
    sound.playPop();
    setIsModalFlipped(false);
    setActiveModalAnimal(animal);
  };

  const handleCloseModal = () => {
    sound.playPop();
    sound.stopSpeech();
    setActiveModalAnimal(null);
  };

  const handleSpeakAnimal = (animal: Animal, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    sound.speak(`${animal.nome}. ${animal.fattoCurioso}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 flex flex-col gap-6">
      {/* Title & Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black font-display text-amber-950 flex items-center gap-2">
            <span>Tutti gli Amici Animali</span>
            <span className="text-sm font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
              Pacchetto Mix ({animals.length})
            </span>
          </h2>
          <p className="text-xs font-semibold text-amber-800/80">
            Esplora le 8 carte o filtra per habitat naturale!
          </p>
        </div>

        {/* Habitat Filters */}
        <div className="flex items-center gap-1.5 bg-amber-50 p-1.5 rounded-2xl border border-amber-200">
          <Filter className="w-4 h-4 text-amber-700 ml-1 hidden sm:block" />
          <button
            onClick={() => {
              sound.playPop();
              setFilterHabitat('tutti');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              filterHabitat === 'tutti'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Tutti ({animals.length})
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setFilterHabitat('savana');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              filterHabitat === 'savana'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Savana (3)
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setFilterHabitat('oceano');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              filterHabitat === 'oceano'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Oceano (2)
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setFilterHabitat('foresta');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              filterHabitat === 'foresta'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Foresta (3)
          </button>
        </div>
      </div>

      {/* Grid of 8 Animal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAnimals.map((animal) => {
          const originalIndex = animals.findIndex((a) => a.id === animal.id);

          return (
            <div
              key={animal.id}
              onClick={() => handleOpenModal(animal)}
              className="group bg-white rounded-3xl border-2 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all duration-300 p-4 flex flex-col justify-between cursor-pointer active:scale-95"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <HabitatBadge habitat={animal.habitat} size="sm" />
                  <button
                    onClick={(e) => handleSpeakAnimal(animal, e)}
                    className="p-1.5 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                    title="Ascolta curiosità"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Photo */}
                <div className="w-full h-40 rounded-2xl overflow-hidden bg-amber-50 mb-3 relative">
                  <img
                    src={animal.foto}
                    alt={animal.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 left-3 text-white font-black font-display text-xl drop-shadow-md">
                    {animal.nome}
                  </span>
                </div>

                {/* Quick stats badges */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold text-amber-950 mb-3">
                  <div className="bg-amber-50 p-1.5 rounded-xl border border-amber-100">
                    ⚖️ {animal.statistiche.peso}
                  </div>
                  <div className="bg-amber-50 p-1.5 rounded-xl border border-amber-100">
                    ⚡ {animal.statistiche.velocita}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAnimalForScopri(originalIndex);
                }}
                className="w-full bg-amber-500 text-white font-black text-xs py-2 px-3 rounded-xl shadow-xs hover:bg-amber-600 transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modalità 3D</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Detail Modal if an animal card is clicked */}
      {activeModalAnimal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 text-amber-950 hover:bg-amber-200 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pr-10">
              <img
                src={activeModalAnimal.foto}
                alt={activeModalAnimal.nome}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
              />
              <div>
                <h3 className="text-2xl font-black font-display text-amber-950">
                  {activeModalAnimal.nome}
                </h3>
                <HabitatBadge habitat={activeModalAnimal.habitat} size="sm" showDescription />
              </div>
            </div>

            {/* Fun Fact */}
            <div className="p-3.5 bg-amber-100/80 border border-amber-200 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase">
                  <Lightbulb className="w-4 h-4 text-amber-700" />
                  <span>Curiosità:</span>
                </div>
                <button
                  onClick={() => {
                    sound.playPop();
                    const nextFact = getRandomCuriosity(activeModalAnimal.id, activeModalAnimal.fattoCurioso);
                    setActiveModalAnimal({ ...activeModalAnimal, fattoCurioso: nextFact });
                    sound.speak(`Altra curiosità: ${nextFact}`);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition-all btn-active border border-amber-300"
                  title="Cambia curiosità"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Nuova</span>
                </button>
              </div>
              <p className="text-sm font-extrabold text-amber-950 leading-snug">
                "{activeModalAnimal.fattoCurioso}"
              </p>
            </div>

            {/* 4 Stats */}
            <div className="grid grid-cols-2 gap-2.5">
              <StatCard tipo="peso" valore={activeModalAnimal.statistiche.peso} />
              <StatCard tipo="velocita" valore={activeModalAnimal.statistiche.velocita} />
              <StatCard tipo="lunghezza" valore={activeModalAnimal.statistiche.lunghezza} />
              <StatCard tipo="longevita" valore={activeModalAnimal.statistiche.longevita} />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-amber-100">
              <button
                onClick={() => {
                  sound.speak(
                    `${activeModalAnimal.nome}. ${activeModalAnimal.fattoCurioso}. Peso: ${activeModalAnimal.statistiche.peso}. Velocità: ${activeModalAnimal.statistiche.velocita}.`
                  );
                }}
                className="flex-1 bg-amber-100 text-amber-900 font-extrabold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-200 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
                <span>Ascolta Tutto</span>
              </button>

              <button
                onClick={() => {
                  const idx = animals.findIndex((a) => a.id === activeModalAnimal.id);
                  handleCloseModal();
                  onSelectAnimalForScopri(idx);
                }}
                className="flex-1 bg-amber-500 text-white font-extrabold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-md"
              >
                <span>Apri in 3D</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
