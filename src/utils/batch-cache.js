/**
 * StudyRays - Batch Manager with Fuzzy Search
 */

const normalizeText = (t) =>
    (t || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const tokenize = (t) =>
    normalizeText(t).split(/\s+/).map(x => x.replace(/[^a-z0-9]+/g, '')).filter(Boolean);

// Damerau-Levenshtein distance (handles transpositions like "pyhsics" -> "physics" as 1 edit)
function damerauLevenshtein(a, b) {
    const al = a.length;
    const bl = b.length;
    if (!al) return bl;
    if (!bl) return al;

    const d = Array(al + 1).fill(null).map(() => Array(bl + 1).fill(0));

    for (let i = 0; i <= al; i++) d[i][0] = i;
    for (let j = 0; j <= bl; j++) d[0][j] = j;

    for (let i = 1; i <= al; i++) {
        for (let j = 1; j <= bl; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            d[i][j] = Math.min(
                d[i - 1][j] + 1,      // Deletion
                d[i][j - 1] + 1,      // Insertion
                d[i - 1][j - 1] + cost // Substitution
            );

            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                d[i][j] = Math.min(
                    d[i][j],
                    d[i - 2][j - 2] + cost // Transposition
                );
            }
        }
    }
    return d[al][bl];
}

// Phonetic and Hinglish normalization helper
function phoneticNormalize(text) {
    if (!text) return '';
    let t = text.toLowerCase().trim();
    
    // Replace common Hinglish interchangeable characters
    t = t.replace(/ee/g, 'i');
    t = t.replace(/oo/g, 'u');
    t = t.replace(/kh/g, 'k');
    t = t.replace(/sh/g, 's');
    t = t.replace(/ch/g, 'c');
    t = t.replace(/ph/g, 'f');
    t = t.replace(/gh/g, 'g');
    t = t.replace(/zh/g, 'z');
    t = t.replace(/jh/g, 'j');
    t = t.replace(/dh/g, 'd');
    t = t.replace(/th/g, 't');
    t = t.replace(/bh/g, 'b');
    
    // Remove double letters (consecutive duplicates)
    let clean = '';
    for (let i = 0; i < t.length; i++) {
        if (i === 0 || t[i] !== t[i - 1]) {
            clean += t[i];
        }
    }
    return clean;
}

function fuzzySearch(searchTerm, sourceArray) {
    if (!searchTerm) return sourceArray.slice();

    const normalized = normalizeText(searchTerm);
    const phoneticSearch = phoneticNormalize(searchTerm);
    const tokens = tokenize(searchTerm).filter(t => t.length >= 1);
    
    const results = [];

    sourceArray.forEach((batch, idx) => {
        const batchName = batch.name || '';
        const batchNorm = normalizeText(batchName);
        const phoneticBatch = phoneticNormalize(batchName);
        
        // Exact Match
        if (batchNorm.includes(normalized)) {
            results.push({ batch, score: 100, index: idx });
            return;
        }

        // Token Match
        const batchTokens = tokenize(batchName);
        let matchCount = 0;
        tokens.forEach(tok => {
            if (batchTokens.some(bt => bt.includes(tok) || tok.includes(bt))) {
                matchCount++;
            }
        });

        if (matchCount > 0) {
            const score = (matchCount / tokens.length) * 80;
            results.push({ batch, score, index: idx });
            return;
        }

        // Levenshtein & Damerau-Levenshtein Fuzzy Matches
        const editDist = damerauLevenshtein(normalized, batchNorm);
        const maxLen = Math.max(normalized.length, batchNorm.length);
        const score = (1 - editDist / maxLen) * 50;

        if (score > 30) {
            results.push({ batch, score, index: idx });
            return;
        }

        // Phonetic Similarity Match
        if (phoneticBatch.includes(phoneticSearch) || phoneticSearch.includes(phoneticBatch)) {
            results.push({ batch, score: 40, index: idx });
            return;
        }
    });

    return results
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .map(r => r.batch);
}

const BACKUP_BATCHES = [
  {
    "batch_id": "lakshya-jee-2027",
    "name": "Lakshya JEE 2027 Ultimate",
    "byName": "Alakh Pandey Sir & senior team",
    "previewImage": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    "feeTotal": 0,
    "subjectCount": 3,
    "subjects": ["Physics", "Chemistry", "Mathematics"]
  },
  {
    "batch_id": "yakeen-neet-2026",
    "name": "Yakeen NEET 2026 Dropper",
    "byName": "Viprakash Sir & Bio Squad",
    "previewImage": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
    "feeTotal": 0,
    "subjectCount": 3,
    "subjects": ["Physics", "Chemistry", "Biology"]
  },
  {
    "batch_id": "arjuna-jee-2026",
    "name": "Arjuna JEE 11th Class",
    "byName": "PhysicsWallah Senior Faculty",
    "previewImage": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
    "feeTotal": 0,
    "subjectCount": 3,
    "subjects": ["Physics", "Chemistry", "Mathematics"]
  },
  {
    "batch_id": "boards-12th-2026",
    "name": "Parishram CBSE Boards 12th",
    "byName": "Board Experts Academy",
    "previewImage": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
    "feeTotal": 0,
    "subjectCount": 5,
    "subjects": ["Physics", "Chemistry", "Maths", "English", "CS"]
  }
];

class BatchCacheManager {
    constructor() {
        this.batches = [];
        this.isLoaded = false;
        this.promise = null;
    }

    async loadBatches() {
        if (this.isLoaded) return this.batches;
        if (this.promise) return this.promise;

        console.log('📡 Loading batches dataset...');

        this.promise = (async () => {
            try {
                try {
                    localStorage.removeItem('batches_data');
                    caches.delete('batches_data').catch(() => {});
                } catch (e) {}

                let rawBatches = [];
                let response;
                try {
                    response = await fetch('/batch.json');
                    if (!response.ok) throw new Error('Not found locally');
                    
                    const data = await response.json();
                    const raw = Array.isArray(data) ? data : (data?.batches || []);
                    if (raw.length === 0) {
                        throw new Error('Local batch.json is empty placeholder');
                    }
                    rawBatches = raw;
                } catch (e) {
                    console.log('ℹ️ Local batch.json check failed, falling back to GitHub raw URL:', e.message);
                    try {
                        response = await fetch('https://raw.githubusercontent.com/HeyRAVIGURJAR/EDURA-some-data/main/batch.json');
                        if (response && response.ok) {
                            const data = await response.json();
                            rawBatches = Array.isArray(data) ? data : (data?.batches || []);
                        }
                    } catch (err) {}
                }

                if (rawBatches.length === 0) {
                    console.log('ℹ️ GitHub request failed, trying secondary mirror...');
                    try {
                        response = await fetch('https://semfy-gros.github.io/batches/batcha.json');
                        if (response && response.ok) {
                            const data = await response.json();
                            rawBatches = Array.isArray(data) ? data : (data?.batches || []);
                        }
                    } catch (err) {}
                }

                if (rawBatches.length > 0) {
                    this.batches = rawBatches.map(b => {
                        if (!b._id && b.batch_id) b._id = b.batch_id;
                        return b;
                    });
                    this.isLoaded = true;
                    console.log('✅ Loaded', this.batches.length, 'batches');
                    return this.batches;
                }
                throw new Error('Empty dataset returned');
            } catch (err) {
                console.warn('⚠️ Cache fetch failed, loading local backup data for instant loading:', err);
                this.batches = BACKUP_BATCHES.map(b => {
                    if (!b._id && b.batch_id) b._id = b.batch_id;
                    return b;
                });
                this.isLoaded = true;
                this.promise = null;
                return this.batches;
            }
        })();

        return this.promise;
    }

    async search(searchTerm, limit = 15) {
        await this.loadBatches();
        return fuzzySearch(searchTerm, this.batches).slice(0, limit);
    }

    async getAllBatches() {
        return await this.loadBatches();
    }
}

export const batchCache = new BatchCacheManager();

if (typeof window !== 'undefined') {
    window.batchCache = batchCache;
}

export default batchCache;
