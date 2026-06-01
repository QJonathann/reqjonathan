import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Blokujemy wszystko, co nie jest metodą POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Metoda niedozwolona. Użyj POST.' 
    });
  }

  try {
    // 1. Pobieramy payload z frontendu
    const { payload } = req.body;

    // 2. Pobieramy bezpieczną zmienną z ustawień Vercela (bez NEXT_PUBLIC_)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({ 
        success: false, 
        error: 'Błąd konfiguracji: Brak zdefiniowanej zmiennej DISCORD_WEBHOOK_URL.' 
      });
    }

    // 3. Wysyłamy zapytanie do API Discorda
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      return res.status(discordResponse.status).json({
        success: false,
        error: `Discord API Error: ${errorText || discordResponse.statusText}`
      });
    }

    // 4. Zwracamy sukces do frontendu
    return res.status(200).json({ 
      success: true, 
      message: 'Zgłoszenie pomyślnie wysłane do kanału Discord!' 
    });

  } catch (error: any) {
    console.error('Błąd funkcji serverless:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Wystąpił błąd serwera podczas wysyłania do Discorda.' 
    });
  }
}