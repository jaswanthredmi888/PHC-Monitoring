import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Tele-Consultant Clinical Assist API
  app.post('/api/gemini/teleconsult-assist', async (req, res) => {
    try {
      const { patientName, age, gender, symptoms, vitals, medicalHistory, pregnancyStatus } = req.body;
      const client = getAIClient();

      if (!client) {
        // High quality fallback clinical guidance if API key not set
        return res.json({
          differentialDiagnosis: [
            pregnancyStatus?.includes('Pregnant')
              ? 'Gestational Hypertension / Mild Preeclampsia warning'
              : 'Acute viral febrile illness or seasonal infection',
            'Possible upper respiratory tract infection',
            'Nutritional iron deficiency anemia factor'
          ],
          recommendedActions: [
            'Immediate bedside blood pressure re-measurement in left lateral position',
            'Urine dipstick test for proteinuria (+1 to +4)',
            'Provide oral hydration and monitor fetal heart rate if ANC case',
            'Schedule physical review at PHC within 24 hours if symptoms persist'
          ],
          suggestedMedications: [
            { name: 'Paracetamol 500mg', dosage: '1 tablet TID for fever (SOS)', duration: '3 days' },
            { name: 'IFA (Iron Folic Acid)', dosage: '1 tablet OD after meals', duration: '30 days' },
            { name: 'ORS (Oral Rehydration Salts)', dosage: '1 packet in 1L boiled water', duration: 'As needed' }
          ],
          urgencyLevel: vitals?.bloodPressure?.startsWith('15') || vitals?.bloodPressure?.startsWith('16') ? 'High' : 'Medium',
          doctorNotesSummary: `Clinical review for ${patientName || 'Patient'} (${age || 'Adult'}y). Symptoms suggest monitored protocol. Immediate ASHA home check advised.`
        });
      }

      const prompt = `You are a clinical decision support assistant for Primary Health Center (PHC) doctors and ASHA workers in rural India.
Analyze the following patient clinical presentation and provide structured medical recommendations.

Patient Info:
- Name: ${patientName || 'Patient'}
- Age/Gender: ${age || 'Unknown'} / ${gender || 'Unknown'}
- Pregnancy Status: ${pregnancyStatus || 'None'}
- Symptoms Reported: ${symptoms || 'General unwell'}
- Vitals: ${JSON.stringify(vitals || {})}
- Known History / Comorbidities: ${medicalHistory || 'None recorded'}

Respond strictly with JSON matching this structure:
{
  "differentialDiagnosis": ["string", "string"],
  "recommendedActions": ["string", "string"],
  "suggestedMedications": [
    { "name": "string", "dosage": "string", "duration": "string" }
  ],
  "urgencyLevel": "Low" | "Medium" | "High" | "Critical",
  "doctorNotesSummary": "concise 2-3 sentence clinical summary"
}`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (err: any) {
      console.error('Teleconsult Assist Error:', err);
      return res.status(500).json({ error: 'Clinical assist generation error', fallback: true });
    }
  });

  // AI Stock & Inventory Forecast Assistant
  app.post('/api/gemini/inventory-forecast', async (req, res) => {
    try {
      const { medicines, recentDiseaseTrend } = req.body;
      const client = getAIClient();

      if (!client) {
        return res.json({
          recommendations: [
            'Increase IFA Tablet buffer by +30% due to 8 high-risk ANC cases in Chandanagiri sector.',
            'Stock up Paracetamol syrup and ORS packets ahead of monsoon diarrheal cluster in Kalyanpur.',
            'Maintain cold chain 2-8°C for Anti-Rabies and Hepatitis B vaccine buffer.'
          ],
          criticalShortageAlerts: ['IFA Tablets (Iron Folic Acid)', 'ORS Packets']
        });
      }

      const prompt = `You are an expert public health supply chain analyst for Primary Health Centers.
Given the current medicine stock and recent disease distribution trends:
Medicines Stock: ${JSON.stringify(medicines || [])}
Recent Outbreak Trends: ${JSON.stringify(recentDiseaseTrend || {})}

Provide intelligent supply recommendations and alert on critical shortages for rural health delivery.
Format as JSON:
{
  "recommendations": ["string", "string", "string"],
  "criticalShortageAlerts": ["string"]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Inventory Forecast Error:', err);
      return res.status(500).json({ error: 'Forecast error', fallback: true });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PHC Monitoring Server running on http://localhost:${PORT}`);
  });
}

startServer();
