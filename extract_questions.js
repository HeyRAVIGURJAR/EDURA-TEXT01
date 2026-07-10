const fs = require('fs');
const path = require('path');

console.log("Starting question extraction from jee.json...");

try {
  const rawData = fs.readFileSync(path.join(__dirname, 'jee.json'), 'utf8');
  console.log("Read complete. Parsing JSON...");
  const parsed = JSON.parse(rawData);
  
  const extracted = {};
  
  for (const category of Object.keys(parsed)) {
    const list = parsed[category];
    console.log(`Processing category '${category}' (${list.length} raw questions)...`);
    
    // Filter clean multiple-choice questions
    const cleanList = list.filter(q => {
      if (!q.question || !q.options) return false;
      if (q.question.length < 5 || q.question.toLowerCase().includes("nan")) return false;
      if (q.options.length !== 4) return false;
      // Ensure options are not empty, not null, not "nan"
      return q.options.every(opt => opt && opt.trim() !== "" && opt.toLowerCase() !== "nan" && opt.toLowerCase() !== "null");
    });
    
    // Limit to first 250 clean questions per category to keep bundle size light and load times instant
    const sampled = cleanList.slice(0, 250);
    extracted[category] = sampled;
    console.log(`- Extracted ${sampled.length} clean questions for '${category}'`);
  }
  
  const outputPath = path.join(__dirname, 'public', 'practice_questions.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2), 'utf8');
  console.log(`Extraction complete. Saved to ${outputPath}`);
  
} catch (error) {
  console.error("Error during extraction:", error);
}
