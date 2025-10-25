// api/chat.js - Version OpenAI adaptée
import OpenAI from "openai";

export default async function handler(req, res) {
  // 1. Clé API OpenAI
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const MODEL = "gpt-4o-mini"; // rapide et peu coûteux
  const PROMO_CODE = "TAR72";
  const AFFILIATE_LINK = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
  const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
  const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";

  // 2. CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  // 3. Vérification méthode
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 4. Vérif clé API
  if (!OPENAI_API_KEY) {
    console.error("❌ Clé API OpenAI manquante");
    return res.status(500).json({ error: "Clé API manquante dans les variables d'environnement" });
  }

  // 5. Extraction du message utilisateur
  let userQuery;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    userQuery = body.userQuery;
    if (!userQuery || typeof userQuery !== "string") {
      return res.status(400).json({ error: "Requête utilisateur invalide" });
    }
  } catch (error) {
    console.error("❌ Erreur de parsing:", error);
    return res.status(400).json({ error: "Format de requête invalide" });
  }

  // 6. Prompt système
  const SYSTEM_PROMPT = `
Vous êtes un assistant amical nommé TAR72PRONOSTIC qui aide les utilisateurs à profiter du code promo TAR72 pour obtenir des bonus sur 1xBet et Melbet. 
Votre rôle est d’encourager les inscriptions avec ce code et d’expliquer les avantages.

## Instructions:
1. Répondez toujours en 3 phrases maximum — soyez naturel et conversationnel comme un humain.
2. Adaptez-vous automatiquement à la langue de l’utilisateur (français, anglais, espagnol, etc.).
3. Mettez en avant ces points clés :
   - Le code promo TAR72 offre des bonus à l’inscription.
   - Pour télécharger les coupons de grosses cotes et scores exacts, ils DOIVENT utiliser le code TAR72.
   - Faire un premier dépôt de 5000F ou 10$ pour activer tous les avantages.
4. Partagez toujours ces liens :
   - 📱 Chaîne WhatsApp (pronostics gratuits quotidiens): ${WHATSAPP_LINK}
   - 📱 Canal Telegram: ${TELEGRAM_LINK}
   - 🎰 Inscription 1xBet: https://1xbet.com
   - 🎯 Inscription Melbet: https://melbet.com

## Ton et Style:
- Amical et encourageant, jamais agressif.
- Enthousiaste mais crédible.
- Concis (3 phrases max !).
- Naturel comme une conversation entre amis.

## Exemple:
"Inscris-toi avec le code **TAR72** pour débloquer des bonus incroyables et accéder à nos coupons de grosses cotes ! Fais ton premier dépôt de 5000F ou 10$ pour profiter de tous les avantages. Rejoins notre chaîne WhatsApp pour des pronos gratuits chaque jour : ${WHATSAPP_LINK} 🔥"
`;

  // 7. Appel OpenAI
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  try {
    console.log("🔄 Appel à l'API OpenAI...");
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    const text = completion.choices?.[0]?.message?.content || "Aucune réponse générée.";
    console.log("✅ Réponse OpenAI reçue");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(text);
  } catch (error) {
    console.error("💥 Erreur API OpenAI:", error);
    return res.status(500).json({
      error: "Erreur interne du serveur",
      details: error.message,
    });
  }
}
