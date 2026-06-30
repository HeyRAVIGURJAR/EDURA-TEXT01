const API_BASE = 'https://brainboxinstitute.in/api';

// Cache for all batches so we don't hit the API repeatedly for pagination mock
let cachedAllBatches = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const fetchBatches = async () => {
  try {
    const response = await fetch(`${API_BASE}/batches`);
    if (!response.ok) throw new Error('Failed to fetch batches');
    const data = await response.json();
    return data.batches || [];
  } catch (error) {
    console.error('Error fetching batches:', error);
    const cached = localStorage.getItem('edura_cached_batches');
    return cached ? JSON.parse(cached) : [];
  }
};

/**
 * Mocks server-side pagination, search, and implements AbortController
 */
export const fetchBatchesPaginated = async (page = 1, limit = 15, query = '', signal) => {
  // 1. Fetch or get from cache
  const now = Date.now();
  if (!cachedAllBatches || now - lastFetchTime > CACHE_TTL) {
    try {
      const response = await fetch(`${API_BASE}/batches`, { signal });
      if (!response.ok) throw new Error('Failed to fetch batches');
      const data = await response.json();
      cachedAllBatches = data.batches || [];
      lastFetchTime = now;
      localStorage.setItem('edura_cached_batches', JSON.stringify(cachedAllBatches));
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error; // Let the caller handle cancellation
      }
      console.error('Error fetching paginated batches:', error);
      const cached = localStorage.getItem('edura_cached_batches');
      cachedAllBatches = cached ? JSON.parse(cached) : [];
    }
  }

  // To simulate network delay (for testing smooth skeletons)
  // await new Promise(resolve => setTimeout(resolve, 800));

  // 2. Filter by search query
  let filteredData = cachedAllBatches;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredData = cachedAllBatches.filter(batch => 
      batch.name?.toLowerCase().includes(lowerQuery) || 
      batch.byName?.toLowerCase().includes(lowerQuery)
    );
  }

  // 3. Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    hasMore: endIndex < filteredData.length,
    nextPage: endIndex < filteredData.length ? page + 1 : null,
    total: filteredData.length
  };
};

export const fetchBatchDetails = async (batchId, signal) => {
  try {
    const response = await fetch(`${API_BASE}/batch-details?batchId=${batchId}`, { signal });
    if (!response.ok) throw new Error('Failed to fetch batch details');
    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error fetching batch details:', error);
    }
    return null;
  }
};

/**
 * Connect to Google Gemini API (if VITE_GEMINI_API_KEY is present)
 * or return a detailed simulated response
 */
export const askStudyBuddy = async (query) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are StudyBuddy, an empathetic AI tutor for EDURA Ed-Tech platform. Answer this query in simple educational terms, highlighting key concepts: ${query}` }] }]
        })
      });

      if (!response.ok) throw new Error('Gemini API call failed');
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error, falling back to mock response:', error);
    }
  }

  // Simulated AI response fallback
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
  
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('newton')) {
    return "### Newton's Laws of Motion Explained:\n\n1. **First Law (Inertia)**: An object remains at rest or in uniform motion unless acted upon by an external force.\n2. **Second Law (F=ma)**: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.\n3. **Third Law (Action & Reaction)**: For every action, there is an equal and opposite reaction.\n\n*StudyBuddy Tip: Think of a rocket launch—fuel pushes down (action), rocket moves up (reaction)!*";
  } else if (lowerQuery.includes('chemical') || lowerQuery.includes('equation')) {
    return "### Balancing Chemical Equations:\n\nTo balance equations, you must satisfy the **Law of Conservation of Mass** (same number of atoms on both sides).\n\nExample:\n$$\\text{H}_2 + \\text{O}_2 \\rightarrow \\text{H}_2\\text{O}$$\nBalanced:\n$$2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$$\n\n*StudyBuddy Tip: Always balance polyatomic ions as single units if they appear on both sides.*";
  } else if (lowerQuery.includes('organic') || lowerQuery.includes('chemistry')) {
    return "### Organic Chemistry Basics:\n\nOrganic chemistry centers around **Carbon (C)** atoms. Carbon is tetravalent (can form 4 covalent bonds).\n\nKey Concepts:\n- **Hydrocarbons**: Alkanes (single bonds), Alkenes (double bonds), Alkynes (triple bonds).\n- **Functional Groups**: Alcohols (-OH), Carboxylic Acids (-COOH), Aldehydes (-CHO).\n\n*StudyBuddy Tip: Visualizing shapes (hybridization like sp³, sp², sp) is key to mastering reactions!*";
  }

  return `Here is a detailed explanation of "${query}". [Simulated Response] In a live environment with VITE_GEMINI_API_KEY, this response is generated by the Google Gemini model to assist you. Keep up the great studying!`;
};

/**
 * Submit Support message. Sends message to Telegram Bot API if credentials exist
 * or simulates success on local console.
 */
export const submitSupportMessage = async (message, adminUsername) => {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  const textMessage = `🚨 *NEW SUPPORT TICKET* 🚨\n\n*Admin Requested:* ${adminUsername}\n*Message:* ${message}`;

  if (botToken && chatId) {
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: textMessage,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) throw new Error('Telegram Bot API call failed');
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Telegram notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Local/mock log fallback
  console.log(`[API MOCK] Support Ticket for ${adminUsername}: "${message}"`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, mock: true };
};
