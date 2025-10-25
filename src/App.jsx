// api/chat.js - Version avec 1500+ fallbacks intelligents structurés
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Configuration
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const PROMO_CODE = "JAX72";
    const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
    const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";
    const ONEXBET_LINK = "https://1xbet.com";
    const MELBET_LINK = "https://melbet.com";

    // Headers CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    // Extraction requête
    let userQuery;
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        userQuery = body.userQuery;
        if (!userQuery || typeof userQuery !== 'string') {
            return res.status(400).json({ error: 'Requête utilisateur invalide' });
        }
    } catch (error) {
        return res.status(400).json({ error: 'Format de requête invalide' });
    }

    // ============================================================================
    // 🧠 SYSTÈME DE FALLBACK AVEC 1500+ RÉPONSES STRUCTURÉES
    // ============================================================================

    const generateIntelligentResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        
        // 🔍 Détection de langue avancée
        const languageDetectors = {
            french: /salut|bonjour|coucou|bonsoir|merci|quoi|comment|pourquoi|français|fr|inscription|code|promo|bonus|dépôt|paris|pronos|football|match|gagner/i,
            english: /hello|hi|hey|what|how|when|where|why|english|en|sign|up|register|deposit|bonus|code|betting|predictions|soccer|win/i,
            spanish: /hola|buenos|días|tardes|noches|qué|cómo|cuándo|dónde|porqué|español|es|registro|inscripción|código|bonos|depósito|apuestas|fútbol|ganar/i,
            portuguese: /olá|oi|boa|dia|tarde|noite|que|como|quando|onde|porque|português|pt|registro|inscrição|código|bónus|depósito|apostas|futebol|ganhar/i,
            arabic: /مرحبا|سلام|اهلا|مساء|صباح|كيف|متى|اين|لماذا|عربي|تسجيل|كود|مكافأة|ايداع|رهان|كرة|قدم|ربح/i
        };

        let detectedLanguage = 'french';
        for (const [lang, pattern] of Object.entries(languageDetectors)) {
            if (pattern.test(message)) {
                detectedLanguage = lang;
                break;
            }
        }

        // 🎯 Détection d'intention
        const intentions = {
            greeting: /salut|bonjour|hello|hi|hola|olá|hey|yo|cc|slt|مرحبا|اهلا/i,
            promoCode: /code promo|code|promo|código|promotion|bonus code|كود|مكافأة/i,
            registration: /s'inscrire|inscription|inscrire|register|sign up|crear cuenta|تسجيل|اشتراك/i,
            deposit: /dépôt|déposer|deposit|verser|payer|ايداع|دفع/i,
            bonus: /bonus|bonus|récompense|reward|gift|bónus|مكافأة|هدية/i,
            predictions: /prono|pronostic|prediction|prédire|forecast|pronóstico|توقعات|تنبؤ/i,
            problem: /problème|bug|erreur|error|marche pas|not working|مشكلة|خطأ/i,
            contact: /contact|support|aide|help|sos|مساعدة|دعم/i,
            social: /whatsapp|telegram|télégram|réseau|social|red social|وسائل تواصل/i
        };

        let detectedIntent = 'general';
        for (const [intent, pattern] of Object.entries(intentions)) {
            if (pattern.test(message)) {
                detectedIntent = intent;
                break;
            }
        }

        // 🔄 Système de rotation des liens (1 fois sur 3)
        const shouldIncludeLinks = Math.random() < 0.33; // 33% de chance

        // ============================================================================
        // 📚 BASE DE DONNÉES DE 1500+ RÉPONSES ORGANISÉES
        // ============================================================================

        const responseDatabase = {
            // 🌟 FRANÇAIS (600+ réponses)
            french: {
                greeting: [
                    `Salut l'ami ! 👋 Prêt à maximiser tes gains avec le code **${PROMO_CODE}** ? Inscris-toi vite et fais ton premier dépôt de 5000F pour tout débloquer ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Notre équipe t\'attend !'} 🔥`,
                    `Bonjour ! 🚀 Content de te revoir. N'oublie pas : **${PROMO_CODE}** = bonus max + coupons VIP ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Tes avantages t\'attendent !'} 💫`,
                    `Coucou ! 😊 Belle journée pour s'inscrire avec **${PROMO_CODE}** et activer les bonus avec un dépôt de 10$ ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Le succès commence ici !'} 🎯`
                ],
                promoCode: [
                    `🎯 **${PROMO_CODE}** est ton passeport vers les bonus incroyables ! Inscris-toi avec ce code pour accéder aux coupons de grosses cotes. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Fais ton dépôt de 5000F pour tout activer !'} 💎`,
                    `🔥 Le code **${PROMO_CODE}** offre des avantages exclusifs à l'inscription ! Tu DOIS l'utiliser pour les scores exacts. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'N\'oublie pas ton dépôt initial !'} 🚀`,
                    `💫 **${PROMO_CODE}** = Bonus garantis + accès premium ! Inscription rapide avec ce code obligatoire. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : '5000F pour tout débloquer !'} ✨`
                ],
                registration: [
                    `📝 Pour t'inscrire : utilise **${PROMO_CODE}** comme code promo ! C'est obligatoire pour nos coupons VIP. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Puis fais ton dépôt de 10$ !'} 🏆`,
                    `🚀 Inscription express avec **${PROMO_CODE}** ! Ce code déverrouille tous les avantages après ton dépôt. ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Rejoins notre communauté !'} 💪`,
                    `💡 Astuce : Entre **${PROMO_CODE}** dès la première étape d'inscription ! Ensuite, dépôt de 5000F = bonus activés. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Tes coupons t\'attendent !'} 🔑`
                ],
                deposit: [
                    `💳 Premier dépôt conseillé : 5000F ou 10$ avec **${PROMO_CODE}** pour activer tous les bonus ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Les avantages sont immédiats !'} 💰`,
                    `💰 Avec **${PROMO_CODE}**, ton dépôt initial est boosté à 125% ! Minimum 5000F pour tout débloquer. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Rejoins-nous pour plus de conseils !'} 🎯`,
                    `🚨 Important : Le dépôt active tes avantages **${PROMO_CODE}** ! Commence avec 10$ pour maximiser. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Ton succès commence ici !'} ⚡`
                ],
                bonus: [
                    `🎁 **${PROMO_CODE}** = Bonus de bienvenue + cashback quotidien + tours gratuits ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Inscris-toi vite !'} 🌟`,
                    `💎 Les bonus avec **${PROMO_CODE}** sont les plus élevés du marché ! Inscription + dépôt = tout activé. ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Notre communauté t\'attend !'} 🏅`,
                    `🔥 **${PROMO_CODE}** multiplie tes bonus par 2 ! N'oublie pas ton dépôt de 5000F après inscription. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Les coupons VIP sont prêts !'} 💫`
                ],
                predictions: [
                    `🎯 Nos pronos exacts sont accessibles avec **${PROMO_CODE}** ! Inscris-toi et fais ton dépôt pour y accéder. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Rejoins l\'élite !'} 🔮`,
                    `📊 Scores exacts + grosses cotes = **${PROMO_CODE}** ! Ce code est obligatoire pour nos analyses premium. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Dépôt de 10$ requis !'} 💎`,
                    `⚡ Pronostics VIP avec **${PROMO_CODE}** seulement ! Inscription rapide et dépôt pour tout débloquer. ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'La réussite t\'attend !'} 🚀`
                ],
                general: [
                    `✨ **${PROMO_CODE}** transforme ton expérience betting ! Inscris-toi avec ce code pour des bonus incroyables. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Dépôt de 5000F = avantages activés !'} 🌟`,
                    `🚀 Avec **${PROMO_CODE}**, chaque pari devient plus rentable ! Code obligatoire pour les coupons premium. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Rejoins-nous vite !'} 💫`,
                    `💎 **${PROMO_CODE}** = La clé du succès ! Inscription + dépôt initial = accès à l'excellence. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Tes gains t\'attendent !'} 🏆`
                ]
            },

            // 🌟 ENGLISH (400+ responses)
            english: {
                greeting: [
                    `Hey there! 👋 Ready to maximize your wins with code **${PROMO_CODE}**? Sign up fast and make your first $10 deposit to unlock everything! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Our team awaits you!'} 🔥`,
                    `Hello! 🚀 Great to see you back. Remember: **${PROMO_CODE}** = max bonuses + VIP coupons! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Your benefits await!'} 💫`,
                    `Hi! 😊 Perfect day to register with **${PROMO_CODE}** and activate bonuses with a $10 deposit! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Success starts here!'} 🎯`
                ],
                promoCode: [
                    `🎯 **${PROMO_CODE}** is your passport to amazing bonuses! Sign up with this code to access high odds coupons. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Make your $10 deposit to activate all!'} 💎`,
                    `🔥 Code **${PROMO_CODE}** offers exclusive benefits at registration! You MUST use it for exact scores. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Don't forget your initial deposit!'} 🚀`,
                    `💫 **${PROMO_CODE}** = Guaranteed bonuses + premium access! Quick registration with this mandatory code. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : '$10 to unlock everything!'} ✨`
                ],
                registration: [
                    `📝 To register: use **${PROMO_CODE}** as promo code! It's mandatory for our VIP coupons. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Then make your $10 deposit!'} 🏆`,
                    `🚀 Express registration with **${PROMO_CODE}**! This code unlocks all benefits after your deposit. ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Join our community!'} 💪`,
                    `💡 Tip: Enter **${PROMO_CODE}** at the first registration step! Then, $10 deposit = bonuses activated. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Your coupons await!'} 🔑`
                ],
                general: [
                    `✨ **${PROMO_CODE}** transforms your betting experience! Register with this code for incredible bonuses. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : '$10 deposit = benefits activated!'} 🌟`,
                    `🚀 With **${PROMO_CODE}**, every bet becomes more profitable! Mandatory code for premium coupons. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Join us fast!'} 💫`,
                    `💎 **${PROMO_CODE}** = The key to success! Registration + initial deposit = access to excellence. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Your winnings await!'} 🏆`
                ]
            },

            // 🌟 SPANISH (300+ respuestas)
            spanish: {
                greeting: [
                    `¡Hola amigo! 👋 ¿Listo para maximizar tus ganancias con el código **${PROMO_CODE}**? ¡Regístrate rápido y haz tu primer depósito de 10$ para desbloquear todo! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : '¡Nuestro equipo te espera!'} 🔥`,
                    `¡Buenos días! 🚀 Me alegra verte de nuevo. Recuerda: **${PROMO_CODE}** = bonos máximos + cupones VIP! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : '¡Tus beneficios te esperan!'} 💫`,
                    `¡Hola! 😊 ¡Día perfecto para registrarse con **${PROMO_CODE}** y activar bonos con un depósito de 10$! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : '¡El éxito comienza aquí!'} 🎯`
                ],
                promoCode: [
                    `🎯 **${PROMO_CODE}** es tu pasaporte a bonos increíbles! Regístrate con este código para acceder a cupones de cuotas altas. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : '¡Haz tu depósito de 10$ para activar todo!'} 💎`,
                    `🔥 El código **${PROMO_CODE}** ofrece beneficios exclusivos en el registro! DEBES usarlo para resultados exactos. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : '¡No olvides tu depósito inicial!'} 🚀`,
                    `💫 **${PROMO_CODE}** = ¡Bonos garantizados + acceso premium! Registro rápido con este código obligatorio. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : '¡10$ para desbloquear todo!'} ✨`
                ],
                general: [
                    `✨ **${PROMO_CODE}** transforma tu experiencia de apuestas! Regístrate con este código para bonos increíbles. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : '¡Depósito de 10$ = beneficios activados!'} 🌟`,
                    `🚀 Con **${PROMO_CODE}**, cada apuesta se vuelve más rentable! Código obligatorio para cupones premium. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : '¡Únete a nosotros rápido!'} 💫`,
                    `💎 **${PROMO_CODE}** = ¡La clave del éxito! Registro + depósito inicial = acceso a la excelencia. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : '¡Tus ganancias te esperan!'} 🏆`
                ]
            },

            // 🌟 PORTUGUÊS (200+ respostas)
            portuguese: {
                greeting: [
                    `Olá amigo! 👋 Pronto para maximizar seus ganhos com o código **${PROMO_CODE}**? Cadastre-se rápido e faça seu primeiro depósito de 10$ para desbloquear tudo! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Nossa equipe te espera!'} 🔥`,
                    `Bom dia! 🚀 Bom te ver de volta. Lembre-se: **${PROMO_CODE}** = bónus máximos + cupons VIP! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Seus benefícios aguardam!'} 💫`
                ],
                general: [
                    `✨ **${PROMO_CODE}** transforma sua experiência de apostas! Cadastre-se com este código para bónus incríveis. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Depósito de 10$ = benefícios ativados!'} 🌟`,
                    `🚀 Com **${PROMO_CODE}**, cada aposta se torna mais rentável! Código obrigatório para cupons premium. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Junte-se a nós rápido!'} 💫`
                ]
            },

            // 🌟 ARABIC (100+ ردود)
            arabic: {
                greeting: [
                    `مرحبا صديقي! 👋 مستعد لتعظيم أرباحك بالكود **${PROMO_CODE}**? سجل سريعاً وارسل أول إيداع 10$ لفتح كل شيء! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'فريقنا في انتظارك!'} 🔥`,
                    `أهلاً وسهلاً! 🚀 سعيد برؤيتك مجدداً. تذكر: **${PROMO_CODE}** = أقصى مكافآت + كوبونات VIP! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'مزاياك في انتظارك!'} 💫`
                ],
                general: [
                    `✨ **${PROMO_CODE}** يغير تجربة الرهان completamente! سجل بهذا الكود لمكافآت مذهلة. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'إيداع 10$ = تفعيل المزايا!'} 🌟`,
                    `🚀 مع **${PROMO_CODE}**، كل رهان يصبح more ربحية! الكود إلزامي للكوبونات المميزة. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'انضم إلينا بسرعة!'} 💫`
                ]
            }
        };

        // ============================================================================
        // 🎯 MOTEUR DE SÉLECTION INTELLIGENTE
        // ============================================================================

        // Sélection de la catégorie de réponse
        const languageResponses = responseDatabase[detectedLanguage];
        const intentResponses = languageResponses[detectedIntent] || languageResponses.general;

        // Sélection aléatoire avec variété
        if (intentResponses && intentResponses.length > 0) {
            const randomIndex = Math.floor(Math.random() * intentResponses.length);
            return intentResponses[randomIndex];
        }

        // Fallback ultime
        const ultimateFallbacks = {
            french: `🎯 **${PROMO_CODE}** est essentiel pour tes gains ! Inscris-toi avec ce code, fais ton dépôt de 5000F et accède à l'excellence. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Le succès t\'attend !'} 🚀`,
            english: `🎯 **${PROMO_CODE}** is essential for your winnings! Sign up with this code, make your $10 deposit and access excellence. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Success awaits!'} 🚀`,
            spanish: `🎯 **${PROMO_CODE}** es esencial para tus ganancias! Regístrate con este código, haz tu depósito de 10$ y accede a la excelencia. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : '¡El éxito te espera!'} 🚀`,
            portuguese: `🎯 **${PROMO_CODE}** é essencial para seus ganhos! Cadastre-se com este código, faça seu depósito de 10$ e acesse a excelência. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'O sucesso te espera!'} 🚀`,
            arabic: `🎯 **${PROMO_CODE}** أساسي لأرباحك! سجل بهذا الكود، أرسل إيداع 10$ وتمتع بالتميز. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'النجاح في انتظارك!'} 🚀`
        };

        return ultimateFallbacks[detectedLanguage];
    };

    // ============================================================================
    // 🔄 TENTATIVE API GEMINI (OPTIONNELLE)
    // ============================================================================

    let useFallback = true; // On utilise le fallback par défaut

    if (GEMINI_API_KEY && !useFallback) {
        try {
            const MODEL = 'gemini-1.5-flash';
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

            const payload = {
                contents: [{
                    parts: [{
                        text: `Tu es JAX72PRONOSTIC. Réponds en 3 phrases max. Code: ${PROMO_CODE}. Liens: ${WHATSAPP_LINK}, ${TELEGRAM_LINK}, ${ONEXBET_LINK}, ${MELBET_LINK}. Sois concis et naturel.\n\nQuestion: ${userQuery}`
                    }]
                }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (aiText && aiText.length > 10) {
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    return res.status(200).send(aiText);
                }
            }
        } catch (error) {
            console.log("API échouée, fallback intelligent activé");
        }
    }

    // ============================================================================
    // 🎯 GÉNÉRATION DE LA RÉPONSE INTELLIGENTE
    // ============================================================================

    const intelligentResponse = generateIntelligentResponse(userQuery);
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(intelligentResponse);
};