// api/chat.js - Version avec fallback conversationnel intelligent
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // 1. Configuration de base
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = 'gemini-1.5-flash';
    const PROMO_CODE = "JAX72";
    const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
    const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";

    // 2. Gestion CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 3. Extraction de la requête
    let userQuery;
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        userQuery = body.userQuery;
        
        if (!userQuery || typeof userQuery !== 'string') {
            return res.status(400).json({ error: 'Requête utilisateur invalide' });
        }
    } catch (error) {
        console.error("❌ Erreur de parsing:", error);
        return res.status(400).json({ error: 'Format de requête invalide' });
    }

    // 4. SYSTÈME DE FALLBACK INTELLIGENT
    const getFallbackResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        
        // 🔥 Réponses basées sur l'intention de l'utilisateur
        const responseMap = {
            // 🎯 SALUTATIONS
            'salut': `Salut ! 👋 Prêt à maximiser tes gains avec le code **${PROMO_CODE}** ? Je suis là pour t'aider à obtenir les meilleurs bonus !`,
            'bonjour': `Bonjour ! 🚀 Content de te revoir. N'oublie pas le code **${PROMO_CODE}** pour tes inscriptions, c'est la clé des bonus max !`,
            'hello': `Hello ! 💫 Comment vas-tu ? Si tu veux les meilleures offres, pense au code **${PROMO_CODE}** à l'inscription !`,
            'coucou': `Coucou ! 😊 Prêt pour une session de gains ? Le code **${PROMO_CODE}** t'attend pour des bonus incroyables !`,
            
            // ❓ QUESTIONS SUR LE CODE
            'code promo': `🎯 Le code **${PROMO_CODE}** est ton passeport vers les meilleurs bonus ! Utilise-le à l'inscription sur 1xBet ou Melbet.`,
            'quel est le code': `🔥 Le code magique c'est **${PROMO_CODE}** ! Ne l'oublie surtout pas à l'inscription pour débloquer tous les avantages.`,
            'code': `💫 Je te recommande le code **${PROMO_CODE}** ! C'est le plus rentable en ce moment pour les nouveaux inscrits.`,
            
            // 🎰 QUESTIONS 1XBET
            '1xbet': `🎰 Sur 1xBet, utilise **${PROMO_CODE}** pour un bonus de bienvenue boosté ! N'oublie pas de faire ton premier dépôt.`,
            'comment s\'inscrire sur 1xbet': `📝 Va sur 1xBet.com, remplis le formulaire et surtout entre **${PROMO_CODE}** dans le champ code promo !`,
            'inscription 1xbet': `🚀 Inscription rapide : 1xBet.com + code **${PROMO_CODE}** = Bonus maximum garanti !`,
            
            // 🎲 QUESTIONS MELBET
            'melbet': `🎲 Sur MelBet, le code **${PROMO_CODE}** te donne accès à des offres exclusives ! Parfait pour bien commencer.`,
            'comment s\'inscrire sur melbet': `📱 Rendez-vous sur MelBet.com, inscris-toi et n'oublie pas **${PROMO_CODE}** comme code promo !`,
            
            // 💰 QUESTIONS BONUS
            'bonus': `💰 Avec **${PROMO_CODE}**, tu peux obtenir jusqu'à 100% de bonus sur ton premier dépôt ! C'est le moment de profiter.`,
            'gain': `💸 Les gains commencent avec le bon code ! **${PROMO_CODE}** est ta clé pour des bonus optimisés sur tes paris.`,
            'argent': `🤑 Pour maximiser tes gains, commence par utiliser **${PROMO_CODE}** à l'inscription. Ensuite, fais ton premier dépôt !`,
            
            // 📱 QUESTIONS RÉSEAUX SOCIAUX
            'whatsapp': `💬 Rejoins notre WhatsApp ici : ${WHATSAPP_LINK} pour des pronostics gratuits chaque jour ! On y partage les meilleures opportunités.`,
            'telegram': `📢 Notre Telegram : ${TELEGRAM_LINK} - Tu y trouveras des analyses exclusives et des conseils de paris en direct !`,
            'réseaux sociaux': `📱 Suis-nous sur WhatsApp ${WHATSAPP_LINK} et Telegram ${TELEGRAM_LINK} pour ne rien manquer des meilleurs pronos !`,
            
            // 🏆 PRONOSTICS
            'pronostic': `🎯 Nos meilleurs pronos sont sur WhatsApp et Telegram ! Rejoins-nous : ${WHATSAPP_LINK} - On analyse les matchs quotidiennement.`,
            'prediction': `🔮 Pour des predictions fiables, suis nos chaînes ! WhatsApp : ${WHATSAPP_LINK} | Telegram : ${TELEGRAM_LINK}`,
            'conseil': `💡 Mon meilleur conseil : utilise **${PROMO_CODE}** + rejoins nos réseaux pour des tips exclusifs !`,
            
            // 💳 DÉPÔT
            'dépôt': `💳 Après inscription avec **${PROMO_CODE}**, fais ton premier dépôt (5000F ou 10$) pour activer tous les bonus !`,
            'premier dépôt': `🚨 Important : le premier dépôt active tes bonus ! 5000F ou 10$ minimum après inscription avec **${PROMO_CODE}**.`,
            'combien déposer': `💰 Je recommande 5000F ou 10$ pour ton premier dépôt après avoir utilisé **${PROMO_CODE}** à l'inscription.`,
            
            // ❓ QUESTIONS GÉNÉRIQUES
            'comment ça marche': `🎯 C'est simple : 1) Inscris-toi avec **${PROMO_CODE}** 2) Fais ton 1er dépôt 3) Rejoins nos réseaux pour des pronos !`,
            'aide': `🆘 Je peux t'aider avec : codes promo, inscriptions, bonus et pronostics. Demande-moi ce dont tu as besoin !`,
            'quoi de neuf': `🔥 En ce moment, le code **${PROMO_CODE}** offre des bonus exceptionnels ! C'est le bon moment pour s'inscrire.`
        };

        // 🔍 Recherche de correspondance par mot-clé
        for (const [keyword, response] of Object.entries(responseMap)) {
            if (message.includes(keyword)) {
                return response;
            }
        }

        // 🎲 Réponses générales aléatoires si aucune correspondance
        const generalResponses = [
            `🎯 Excellent question ! Pour optimiser tes gains, n'oublie pas le code **${PROMO_CODE}** à chaque inscription. C'est la base !`,
            `💫 Je te conseille de toujours utiliser **${PROMO_CODE}** comme code promo. Ensuite, rejoins nos réseaux pour des conseils exclusifs !`,
            `🚀 Pour bien démarrer, commence par t'inscrire avec **${PROMO_CODE}**. Ensuite, je te guide pour les étapes suivantes !`,
            `🔥 Le secret c'est **${PROMO_CODE}** ! Ce code ouvre les portes des meilleurs bonus sur tes plateformes de paris préférées.`,
            `💡 Astuce du jour : **${PROMO_CODE}** reste le code le plus rentable. Utilise-le et fais ton premier dépôt pour activer les bonus !`,
            `🎰 Que dirais-tu de maximiser tes gains avec **${PROMO_CODE}** ? C'est le code qu'il te faut pour des bonus boostés !`,
            `📈 Pour augmenter tes chances, combine **${PROMO_CODE}** à l'inscription + nos pronostics sur WhatsApp : ${WHATSAPP_LINK}`,
            `💎 **${PROMO_CODE}** = Ton allié pour des bonus premium ! N'hésite pas à me demander comment l'utiliser au mieux.`,
            `🚀 Prêt à passer au niveau supérieur ? **${PROMO_CODE}** est ta première étape vers des gains optimisés !`,
            `🎯 Je remarque que tu t'intéresses au betting. Commence par le code **${PROMO_CODE}** - c'est le plus avantageux en ce moment !`
        ];

        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    };

    // 5. TENTATIVE API GEMINI (avec fallback automatique)
    let useFallback = false;
    
    if (GEMINI_API_KEY) {
        try {
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

            const payload = {
                contents: [{
                    parts: [{
                        text: `Tu es JAX72PRONOSTIC, assistant betting. Réponds en 3 phrases max. Code: ${PROMO_CODE}. Liens: ${WHATSAPP_LINK}, ${TELEGRAM_LINK}. Sois concis et pro.\n\nQuestion: ${userQuery}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150,
                }
            };

            console.log("🔄 Tentative API Gemini...");
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (aiText && aiText.length > 10) {
                    console.log("✅ Réponse Gemini reçue");
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    return res.status(200).send(aiText);
                }
            }
            
            // Si on arrive ici, l'API a échoué
            useFallback = true;
            console.log("⚠️ API Gemini échouée, utilisation du fallback");
            
        } catch (error) {
            useFallback = true;
            console.log("⚠️ Erreur API, fallback activé:", error.message);
        }
    } else {
        useFallback = true;
        console.log("⚠️ Pas de clé API, fallback par défaut");
    }

    // 6. UTILISATION DU FALLBACK INTELLIGENT
    const fallbackResponse = getFallbackResponse(userQuery);
    console.log("🎯 Fallback utilisé:", fallbackResponse.substring(0, 50) + "...");
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(fallbackResponse);
};