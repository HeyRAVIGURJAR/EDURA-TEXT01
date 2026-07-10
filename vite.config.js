import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'serve-artifacts',
      configureServer(server) {
        server.middlewares.use('/artifacts', (req, res, next) => {
          const artifactDir = 'C:/Users/91935/.gemini/antigravity-ide/brain/8be408a3-4512-47a4-80e8-3cb8c68688b0';
          // Decode URL to handle spaces or special characters
          const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
          const filePath = path.join(artifactDir, cleanUrl);
          
          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif'
            };
            if (mimeTypes[ext]) {
              res.setHeader('Content-Type', mimeTypes[ext]);
            }
            res.end(fs.readFileSync(filePath));
          } else {
            next();
          }
        });
      }
    },
    {
      name: 'extract-questions-plugin',
      buildStart() {
        console.log("Vite plugin: Starting question extraction from jee.json...");
        const jeePath = path.join(__dirname, 'jee.json');
        const outputPath = path.join(__dirname, 'public', 'practice_questions.json');
        
        if (fs.existsSync(jeePath)) {
          try {
            const rawData = fs.readFileSync(jeePath, 'utf8');
            const parsed = JSON.parse(rawData);
            const extracted = {};

            const filterContinuationWords = [
              "and", "or", "but", "is", "are", "of", "in", "to", "on", "at", "by", "for", "with", "from", 
              "its", "their", "your", "be", "been", "have", "has", "becom", "that", "which", "who", "whom", 
              "whose", "were", "was", "than", "as", "the", "a", "an", "this", "these", "those", "regard",
              "water", "about", "dure", "increase", "decrease", "remain", "both", "only", "would",
              "expect", "should", "could", "may", "might", "can", "cannot", "will", "shall", "through",
              "with", "into", "onto", "under", "over", "above", "below", "between", "among", "during", "before", "after"
            ];

            const WORD_REPLACEMENTS = {
              "abov": "above",
              "affect": "affected",
              "alkalin": "alkaline",
              "allow": "allows",
              "asexu": "asexual",
              "ascend": "ascending",
              "atmospher": "atmosphere",
              "autosom": "autosomes",
              "batteri": "battery",
              "becaus": "because",
              "becom": "becomes",
              "birth": "birth",
              "bodi": "body",
              "bud": "budding",
              "butyr": "butyric",
              "calibr": "calibrated",
              "cartilagin": "cartilaginous",
              "cell": "cell",
              "chang": "change",
              "charg": "charged",
              "chromosom": "chromosome",
              "concentr": "concentrated",
              "conduct": "conductor",
              "constant": "constant",
              "correct": "correct",
              "decreas": "decrease",
              "deionis": "deionized",
              "densiti": "density",
              "differ": "difference",
              "dioxid": "dioxide",
              "distanc": "distance",
              "distribut": "distribution",
              "drosophila": "Drosophila",
              "dure": "during",
              "dynam": "dynamic",
              "electr": "electric",
              "electrod": "electrode",
              "electrolyt": "electrolyte",
              "emitt": "emitted",
              "energi": "energy",
              "epinephrin": "epinephrine",
              "equat": "equation",
              "equili": "equilibrium",
              "equival": "equivalent",
              "exampl": "example",
              "expect": "expect",
              "fals": "false",
              "fatti": "fatty",
              "felli": "falling",
              "fern": "fern",
              "fertil": "fertility",
              "fibr": "fiber",
              "field": "field",
              "follow": "following",
              "frequenc": "frequency",
              "furnac": "furnace",
              "gaba": "GABA",
              "glomerular": "glomerular",
              "gravit": "gravitational",
              "graze": "grazing",
              "ha": "has",
              "he": "he",
              "henl": "Henle",
              "human": "human",
              "hydra": "hydra",
              "imperm": "impermeable",
              "incorrect": "incorrect",
              "increas": "increase",
              "individu": "individual",
              "inert": "inertia",
              "intensiti": "intensity",
              "intern": "internal",
              "introduc": "introduced",
              "invers": "inversely",
              "iron": "iron",
              "kinet": "kinetic",
              "kinetochor": "kinetochores",
              "lactic": "lactic",
              "larg": "large",
              "limb": "limb",
              "loop": "loop",
              "magnet": "magnetic",
              "make": "makes",
              "male": "male",
              "measur": "measure",
              "metaphas": "metaphase",
              "mitot": "mitotic",
              "moth": "moth",
              "multipl": "multiple",
              "neg": "negative",
              "neurotransmitt": "neurotransmitter",
              "ocean": "ocean",
              "onion": "onion",
              "optic": "optics",
              "organ": "organic",
              "pair": "pairs",
              "particl": "particle",
              "parthenocarpi": "parthenocarpy",
              "percentag": "percentage",
              "piec": "piece",
              "place": "placed",
              "plant": "plants",
              "posit": "positive",
              "potenti": "potential",
              "power": "power",
              "pressur": "pressure",
              "produc": "produce",
              "project": "projected",
              "proporti": "proportional",
              "pyromet": "pyrometer",
              "pyruv": "pyruvic",
              "quantiti": "quantity",
              "rabbit": "rabbit",
              "radiat": "radiation",
              "rais": "raise",
              "rbc": "RBCs",
              "reduc": "reduced",
              "refer": "refers",
              "reflect": "reflected",
              "reflex": "reflexive",
              "releas": "released",
              "reproduc": "reproduce",
              "reproduct": "reproduction",
              "resist": "resistance",
              "role": "role",
              "sea": "sea",
              "seed": "seed",
              "select": "selective",
              "serotonin": "serotonin",
              "sexual": "sexual",
              "signific": "significant",
              "snake": "snake",
              "speci": "species",
              "spore": "spores",
              "statenet": "statement",
              "stationari": "stationary",
              "stimuli": "stimuli",
              "strength": "strength",
              "suffici": "sufficient",
              "symmertr": "symmetric",
              "temperatur": "temperature",
              "tesla": "Tesla",
              "thi": "this",
              "transform": "transformer",
              "transport": "transport",
              "transit": "transitive",
              "twin": "twin",
              "uniform": "uniform",
              "urin": "urine",
              "valu": "value",
              "veloc": "velocity",
              "venom": "venom",
              "versa": "versa",
              "voltag": "voltage",
              "wa": "was",
              "water": "water",
              "y-chromosom": "Y-chromosome",
              "young": "young"
            };

            function fixStemmedText(text) {
              if (!text) return text;
              return text.replace(/\b[a-zA-Z-]+\b/g, (word) => {
                const lowerWord = word.toLowerCase();
                if (WORD_REPLACEMENTS[lowerWord]) {
                  const replacement = WORD_REPLACEMENTS[lowerWord];
                  if (word[0] === word[0].toUpperCase()) {
                    return replacement[0].toUpperCase() + replacement.slice(1);
                  }
                  return replacement;
                }
                return word;
              });
            }

            function isCleanQuestion(q) {
              if (!q.question || !q.options || q.options.length !== 4) return false;
              if (q.question.length < 25) return false;
              
              if (q.question.includes('\\') || q.question.includes('_') || q.question.includes('^') || q.question.includes('{') || q.question.includes('}')) return false;
              if (q.options.some(opt => opt.includes('\\') || opt.includes('_') || opt.includes('^') || opt.includes('{') || opt.includes('}'))) return false;
              
              if (q.question.toLowerCase().includes("nan") || q.question.toLowerCase().includes("null")) return false;
              if (q.options.some(opt => !opt || opt.trim() === "" || opt.toLowerCase() === "nan" || opt.toLowerCase() === "null")) return false;
              
              if (q.options.some(opt => /^\s*[\(\[\\{]*\s*([a-d0-9i]+)\s*[\)\]\.\s\-:]+/i.test(opt))) return false;

              const opt0FirstWord = q.options[0].trim().split(/\s+/)[0].toLowerCase();
              if (filterContinuationWords.includes(opt0FirstWord)) return false;

              const qWords = q.question.trim().split(/\s+/);
              const qLastWord = qWords[qWords.length - 1].toLowerCase();
              if (filterContinuationWords.includes(qLastWord)) return false;

              if (q.options.some(opt => opt.length < 2)) return false;

              return true;
            }

            for (const category of Object.keys(parsed)) {
              const list = parsed[category];
              const cleanList = [];
              
              for (const q of list) {
                if (!isCleanQuestion(q)) continue;
                cleanList.push({
                  question: fixStemmedText(q.question),
                  options: q.options.map(opt => fixStemmedText(opt))
                });
              }
              
              const sampled = cleanList.slice(0, 300);
              extracted[category] = sampled;
              console.log(`- Extracted ${sampled.length} clean questions for '${category}'`);
            }
            
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2), 'utf8');
            console.log(`Successfully extracted and saved questions to ${outputPath}`);
          } catch (err) {
            console.error("Vite plugin error extracting questions:", err);
          }
        } else {
          console.warn("Vite plugin: jee.json not found in root.");
        }
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'EDURA | Premium Badge Dashboard',
        short_name: 'EDURA',
        description: 'Luxury Learning Platform & Badge Dashboard',
        theme_color: '#000000',
        background_color: '#000000',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
