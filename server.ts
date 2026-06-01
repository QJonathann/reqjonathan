/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse incoming JSON payloads safely
  app.use(express.json());

  // API endpoints FIRST

// API Route: Send application to Discord Webhook and return status
  app.post('/api/send-webhook', async (req, res) => {
    try {
      // 1. Pobieramy TYLKO treść wiadomości (payload) od klienta
      const { payload } = req.body;

      // 2. Serwer SAM odczytuje bezpieczną zmienną środowiskową
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

      // Sprawdzamy, czy zmienna na serwerze Vercel/Node.js w ogóle istnieje
      if (!webhookUrl) {
        return res.status(500).json({ 
          success: false, 
          error: 'Błąd konfiguracji serwera: Brak zdefiniowanej zmiennej DISCORD_WEBHOOK_URL.' 
        });
      }

      // Check URL looks somewhat valid
      if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
        return res.status(400).json({ 
          success: false, 
          error: 'Niepoprawny format adresu Discord Webhook. Powinien zaczynać się od https://discord.com/api/webhooks/...' 
        });
      }

      // Perform server-side fetch to discord API to bypass client browser CORS limitations
      const discordResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Wysyłamy do Discorda sam payload
      });

      if (!discordResponse.ok) {
        const errorText = await discordResponse.text();
        return res.status(discordResponse.status).json({
          success: false,
          error: `Discord API Error: ${errorText || discordResponse.statusText}`
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Zgłoszenie pomyślnie wysłane do kanału Discord!' 
      });

    } catch (error: any) {
      console.error('Server error posting webhook:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || 'Wystąpił błąd serwera podczas wysyłania do Discorda.' 
      });
    }
  });

  // Vite middleware or Static files
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
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
