// api/chat.js - Version corrigée avec JAX72
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // 1. Définition des constantes sécurisées
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = 'gemini-2.0-flash-exp'; // Modèle plus stable
    const PROMO_CODE = "JAX72";
    const AFFILIATE_LINK = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
    const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
    const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";

    // 2. Gestion CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Gérer les requêtes OPTIONS pour CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Vérification de la méthode
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 4. Vérification de la clé API
    if (!GEMINI_API_KEY) {
        console.error("❌ Clé API Gemini manquante dans les variables d'environnement");
        return res.status(500).json({ 
            error: "Configuration serveur manquante",
            details: "GEMINI_API_KEY n'est pas définie" 
        });
    }

    // 5. Extraction de la requête utilisateur
    let userQuery;
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        userQuery = body.userQuery;
        
        if (!userQuery || typeof userQuery !== 'string') {
            return res.status(400).json({ error: 'Requête utilisateur invalide' });
        }
        
        // Limiter la longueur de la requête
        if (userQuery.length > 1000) {
            return res.status(400).json({ error: 'Requête trop longue' });
        }
    } catch (error) {
        console.error("❌ Erreur de parsing du corps:", error);
        return res.status(400).json({ error: 'Format de requête invalide' });
    }

    // 6. Prompt système avec JAX72
    const SYSTEM_PROMPT = `
Vous êtes un assistant amical nommé JAX72PRONOSTIC qui aide les utilisateurs à profiter du code promo JAX72 pour obtenir des bonus sur 1xBet et Melbet. 
Votre rôle est d'encourager les inscriptions avec ce code et d'expliquer les avantages.

## Instructions:
1. Répondez toujours en 3 phrases maximum — soyez naturel et conversationnel comme un humain.
2. Adaptez-vous automatiquement à la langue de l'utilisateur (français, anglais, espagnol, etc.).
3. Mettez en avant ces points clés :
   - Le code promo JAX72 offre des bonus à l'inscription.
   - Pour télécharger les coupons de grosses cotes et scores exacts, ils DOIVENT utiliser le code JAX72.
   - Faire un premier dépôt de 5000F ou 10$ pour activer tous les avantages.
4. Partagez toujours ces liens :
   - 📱 Chaîne WhatsApp (pronostics gratuits quotidiens): ${WHATSAPP_LINK}
   - 📱 Canal Telegram (pronostics gratuits quotidiens): ${TELEGRAM_LINK}
   - 🎰 Inscription 1xBet: https://1xbet.com
   - 🎯 Inscription Melbet: https://melbet.com

## Ton et Style:
- Amical et encourageant, jamais agressif.
- Enthousiaste mais crédible.
- Concis (3 phrases max !).
- Naturel comme une conversation entre amis.

## Exemples:
En français :
"Inscris-toi avec le code **JAX72** pour débloquer des bonus incroyables et accéder à nos coupons de grosses cotes et scores exacts ! Fais ton premier dépôt de 5000F ou 10$ pour profiter de tous les avantages. Rejoins aussi nos chaînes WhatsApp et Telegram pour des pronos gratuits chaque jour ! 🔥"

En anglais :
"Sign up with promo code **JAX72** to unlock amazing bonuses and access our high-odds coupons and exact scores! Make your first deposit of $10 to enjoy all benefits. Join our WhatsApp and Telegram channels for free daily predictions! 🚀"

⚠️ Toujours mentionner clairement que le code **JAX72** est OBLIGATOIRE pour télécharger les coupons premium !
`;

    // 7. Construction du payload Gemini
    const payload = {
        contents: [{
            parts: [{
                text: SYSTEM_PROMPT + `\n\nQuestion de l'utilisateur: ${userQuery}`
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300, // Réduit pour respecter "3 phrases max"
        }
    };

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    try {
        console.log("🔄 Appel à l'API Gemini...");
        console.log("📝 Requête utilisateur:", userQuery.substring(0, 100) + "...");
        
        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // Vérifier si la réponse est OK
        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            console.error("❌ Erreur Gemini API - Status:", geminiResponse.status);
            console.error("❌ Réponse d'erreur:", errorText);
            
            return res.status(geminiResponse.status).json({ 
                error: "Erreur API Gemini",
                details: `Status: ${geminiResponse.status}`,
                fallback: `Bonjour ! Utilisez le code ${PROMO_CODE} pour bénéficier des meilleurs bonus sur 1xBet et Melbet. Rejoignez nos chaînes pour des pronostics gratuits !`
            });
        }

        const responseData = await geminiResponse.json();

        const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("❌ Réponse vide de Gemini:", responseData);
            // Réponse de fallback
            const fallbackResponse = `Salut ! N'oublie pas d'utiliser le code **${PROMO_CODE}** pour tes inscriptions. 📱 Rejoins-nous sur WhatsApp: ${WHATSAPP_LINK} et Telegram: ${TELEGRAM_LINK} pour des pronostics quotidiens gratuits !`;
            
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.status(200).send(fallbackResponse);
        }

        console.log("✅ Réponse Gemini reçue avec succès");
        console.log("📨 Longueur réponse:", text.length);
        
        // 8. Renvoyer la réponse
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.status(200).send(text);

    } catch (error) {
        console.error("💥 Erreur serveur:", error);
        
        // Réponse de fallback en cas d'erreur
        const fallbackResponse = `Bonjour ! Le code **${PROMO_CODE}** vous offre les meilleurs bonus sur 1xBet et Melbet. 🎰 Inscrivez-vous et faites votre premier dépôt pour activer tous les avantages. Rejoignez nos chaînes pour des pronostics exclusifs !`;
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.status(200).send(fallbackResponse);
    }
};