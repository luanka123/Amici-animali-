// Pexels API Integration Service with Client-side LocalStorage Caching

const CACHE_KEY = 'pexels_animal_photos_v1';

// Helper to get cache from LocalStorage
function getLocalCache(): Record<string, string> {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Helper to save cache to LocalStorage
function saveLocalCache(cache: Record<string, string>): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Unable to save Pexels photo to localStorage', e);
  }
}

const ANIMAL_TRANSLATIONS: Record<string, string> = {
  'leone': 'lion animal',
  'elefante': 'elephant animal',
  'pellicano': 'pelican bird',
  'delfino': 'dolphin ocean',
  'panda gigante': 'giant panda',
  'panda': 'panda animal',
  'gufo': 'owl bird',
  'tigre': 'tiger animal',
  'giraffa': 'giraffe animal',
  'ghepardo': 'cheetah animal',
  'ippopotamo': 'hippopotamus animal',
  'rinoceronte': 'rhinoceros animal',
  'zebra': 'zebra animal',
  'suricato': 'meerkat animal',
  'squalo bianco': 'great white shark',
  'squalo': 'shark',
  'balena azzurra': 'blue whale ocean',
  'balena': 'whale ocean',
  'polpo': 'octopus ocean',
  'tartaruga marina': 'sea turtle ocean',
  'gorilla': 'gorilla ape',
  'camaleonte': 'chameleon lizard',
  'tucano': 'toucan bird',
  'bradipo': 'sloth animal',
  'tyrannosaurus rex': 't-rex dinosaur',
  'trex': 't-rex dinosaur',
  'triceratopo': 'triceratops dinosaur',
  'brachiosauro': 'brachiosaurus dinosaur',
  'pterodattilo': 'pterodactyl dinosaur',
};

function getEnglishSearchQuery(italianName: string): string {
  const clean = italianName.toLowerCase().trim();
  return ANIMAL_TRANSLATIONS[clean] || `${clean} animal nature`;
}

/**
 * Fetches a real animal photo from Pexels API or returns cached/fallback photo.
 */
export async function getAnimalPhoto(animalName: string, defaultUrl: string): Promise<string> {
  const cache = getLocalCache();
  const cacheKey = animalName.toLowerCase().trim();

  // 1. Check local cache first
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const viteApiKey = (import.meta as any).env?.VITE_PEXELS_API_KEY;
  const englishQuery = getEnglishSearchQuery(animalName);

  try {
    let photoUrl: string | null = null;

    // 2. Direct Pexels API call if client-side key exists
    if (viteApiKey) {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(englishQuery)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: viteApiKey,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
          photoUrl = data.photos[0].src.large || data.photos[0].src.medium;
        }
      }
    } else {
      // 3. Fallback to Express backend proxy endpoint /api/pexels
      const res = await fetch(`/api/pexels?query=${encodeURIComponent(englishQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.photoUrl) {
          photoUrl = data.photoUrl;
        }
      }
    }

    if (photoUrl) {
      cache[cacheKey] = photoUrl;
      saveLocalCache(cache);
      return photoUrl;
    }
  } catch (err) {
    console.warn(`Pexels API fetch failed for ${animalName}, using fallback URL.`, err);
  }

  // 4. Default fallback URL if Pexels API is not configured or returns no results
  cache[cacheKey] = defaultUrl;
  saveLocalCache(cache);
  return defaultUrl;
}

/**
 * Clear the Pexels photo cache if requested by user
 */
export function clearPexelsCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn('Failed to clear Pexels cache', e);
  }
}
