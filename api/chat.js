// api/chat.js — version optimisée avec liens d'affiliation directs
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = 'gemini-2.0-flash';
    const PROMO_CODE = "JAX72"; // Synchronisé avec le frontend
    
    // 🔗 LIENS D'AFFILIATION DIRECTS
    const AFFILIATE_1XBET = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
    const AFFILIATE_MELBET = "https://melbet.com";
    const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb6DfduAe5VxRWAu0413";
    const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";

    // Headers CORS pour permettre les requêtes du frontend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "Clé API manquante" });

    let userQuery;
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        userQuery = body.userQuery?.trim();
        
        // Si pas de texte mais présence d'image dans le frontend
        if (!userQuery) {
            userQuery = "L'utilisateur a partagé une image ou un fichier";
        }
    } catch {
        return res.status(400).json({ error: 'Format invalide' });
    }

    // 💬 PROMPT OPTIMISÉ AVEC LIENS DIRECTS
    const SYSTEM_PROMPT = `
Tu es **INTER PRONOSTIC**, un assistant humain, naturel et sympathique.  
Ta mission est d'aider les utilisateurs à gagner plus sur **1xBet** et **Melbet** en utilisant le **code promo JAX72**.  
Réponds de manière courte (2 à 3 phrases), naturelle et vivante — comme un ami expert en paris sportifs.  
Tu adaptes ta langue automatiquement (français, anglais, espagnol…) selon la question.  
Si la question n'a rien à voir avec les paris, répond gentiment et ramène subtilement vers ton rôle principal (aider avec le code JAX72).

### 🎯 OBJECTIFS PRINCIPAUX :
1. **Inscription avec code** : Guider vers l'inscription avec le code **${PROMO_CODE}**
2. **Dépôt minimum** : Expliquer le dépôt de 10$ requis pour télécharger les coupons
3. **Liens directs** : Inclure les liens cliquables dans tes réponses
4. **WhatsApp** : Inviter à rejoindre le canal pour les pronostics

### 💰 CONDITIONS IMPORTANTES :
- **Code promo obligatoire** : ${PROMO_CODE}
- **Dépôt minimum** : 10$ pour activer le bonus et télécharger les coupons
- **Plateformes** : 1xBet ou Melbet

### 🔗 LIENS DIRECTS À UTILISER :
- **1xBet** : ${AFFILIATE_1XBET}
- **Melbet** : ${AFFILIATE_MELBET}
- **WhatsApp** : ${WHATSAPP_LINK}

### ⚡ STYLE DE RÉPONSE :
- Parle comme un vrai humain, chaleureux, motivant
- Varie tes tournures de phrases à chaque réponse
- Utilise des émojis (1 à 2 max) selon le ton
- Après avoir dit "Salut" dans la première phrase, évite de commencer toutes les phrases par salut
- **INCLURE DES LIENS CLIQUABLES** dans tes réponses

### 📢 STRATÉGIE DE RÉPONSE :
Dans CHAQUE réponse, tu DOIS inclure au moins un de ces éléments :
1. Le code promo **${PROMO_CODE}** 
2. Un lien direct vers 1xBet ou Melbet
3. L'information sur le dépôt de 10$ requis
4. Le lien WhatsApp pour les coupons

### 🧠 EXEMPLES CONCRETS :
**Français avec liens :**
"Pour commencer à gagner, inscris-toi sur 🎰 [1xBet](${AFFILIATE_1XBET}) avec le code **${PROMO_CODE}** ! Fais un dépôt de 10$ pour débloquer ton bonus et rejoins 📱 [WhatsApp](${WHATSAPP_LINK}) pour tes premiers pronostics gratuits ! 🚀"

"Excellent choix ! Utilise le code **${PROMO_CODE}** sur 🎲 [Melbet](${AFFILIATE_MELBET}) avec un dépôt de 10$ minimum. Tu auras accès à tous nos coupons VIP sur 💬 [notre canal](${WHATSAPP_LINK}) ! 💰"

**Anglais avec liens :**
"Ready to win? Sign up on 🎰 [1xBet](${AFFILIATE_1XBET}) using code **${PROMO_CODE}**! Deposit $10 to unlock your bonus and join 📱 [WhatsApp](${WHATSAPP_LINK}) for free daily tips! 🏆"

**Español avec liens :**
"¡Para ganar grande! Regístrate en 🎲 [Melbet](${AFFILIATE_MELBET}) con el código **${PROMO_CODE}**. Depósito mínimo de $10 para tu bono y únete a 💬 [WhatsApp](${WHATSAPP_LINK}) para pronósticos premium. ¡Vamos! 💪"

### 💡 PHRASES ACCROCHES À UTILISER :
- "Le dépôt de 10$ te donne accès à tous nos coupons VIP"
- "Avec le code ${PROMO_CODE}, ton bonus est garanti !"
- "Rejoins WhatsApp pour tes pronostics gratuits dès aujourd'hui"
- "Inscris-toi maintenant et commence à gagner !"

### 📸 GESTION DES IMAGES :
Si l'utilisateur envoie une image (screenshot de pari, ticket, capture), réponds en parlant des paris sportifs et en l'encourageant à :
1. S'inscrire avec le code **${PROMO_CODE}**
2. Faire un dépôt de 10$ sur ${AFFILIATE_1XBET} ou ${AFFILIATE_MELBET}
3. Rejoindre ${WHATSAPP_LINK} pour plus de conseils

### 🚀 APPEL À L'ACTION :
Termine souvent tes réponses par un appel à l'action clair avec un lien direct !
`;

    const payload = {
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUtilisateur: ${userQuery}` }] }],
        generationConfig: {
            temperature: 0.85,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300, // Augmenté pour les liens
        },
    };

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    try {
        console.log("🧠 Envoi de la requête à Gemini...");
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("❌ Erreur API Gemini:", data);
            return res.status(500).json({ error: data.error?.message || "Erreur API Gemini" });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!text) return res.status(500).json({ error: "Réponse vide de Gemini" });

        console.log("✅ Réponse réussie");
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.status(200).send(text);

    } catch (error) {
        console.error("💥 Erreur serveur:", error);
        return res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
    }
};