// api/chat.js - Version avec structure de prompt optimisée
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Configuration
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = 'gemini-1.5-flash';
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
    // 🧠 SYSTÈME DE FALLBACK AVEC STRUCTURE DE PROMPT OPTIMISÉE
    // ============================================================================

    const getIntelligentResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        
        // 🔍 Détection de langue
        const isEnglish = /hello|hi|what|how|when|where|why|bonus|bet|code|promo|betting|sign|up|deposit/i.test(message);
        const isSpanish = /hola|buenos|qué|cómo|cuándo|dónde|porqué|español|registro|inscripción/i.test(message);
        const isPortuguese = /olá|oi|como|quando|onde|porque|português|registro/i.test(message);
        
        // Compteur pour alterner les réponses (1 fois sur 3 avec liens)
        const responseCount = Math.floor(Math.random() * 3);
        const includeLinks = responseCount === 0; // 1 fois sur 3
        
        // ============================================================================
        // 📝 BASE DE RÉPONSES AVEC STRUCTURE UNIFIÉE (3 PHRASES MAX)
        // ============================================================================

        const responseTemplates = {
            // 🌟 FRANÇAIS (60+ templates)
            french: [
                // Templates AVEC liens (1 fois sur 3)
                {
                    template: `Inscris-toi avec le code **${PROMO_CODE}** pour débloquer des bonus incroyables ! Fais ton premier dépôt de 5000F ou 10$ pour activer tous les avantages. 🎰 Inscris-toi ici : ${ONEXBET_LINK} 🔥`,
                    withLinks: true
                },
                {
                    template: `Le code **${PROMO_CODE}** t'offre l'accès exclusif à nos coupons de grosses cotes ! N'oublie pas ton dépôt de 5000F minimum. 📱 Rejoins WhatsApp : ${WHATSAPP_LINK} pour tes pronos gratuits ! 💫`,
                    withLinks: true
                },
                {
                    template: `Avec **${PROMO_CODE}**, obtiens des bonus de bienvenue boostés sur Melbet ! Fais ton dépôt initial pour tout débloquer. 🎯 Inscription rapide : ${MELBET_LINK} 🚀`,
                    withLinks: true
                },
                {
                    template: `**${PROMO_CODE}** = Bonus garantis + scores exacts en premium ! Commence avec 5000F de dépôt. 🎰 ${ONEXBET_LINK} et 📱 ${WHATSAPP_LINK} t'attendent ! 💎`,
                    withLinks: true
                },
                {
                    template: `Tes coupons VIP t'attendent avec le code **${PROMO_CODE}** ! Active-les avec un dépôt de 10$. 🎯 ${MELBET_LINK} + 📱 ${TELEGRAM_LINK} = succès assuré ! 🏆`,
                    withLinks: true
                },

                // Templates SANS liens (2 fois sur 3)
                {
                    template: `Inscris-toi avec le code **${PROMO_CODE}** pour débloquer des bonus incroyables et accéder à nos coupons de grosses cotes ! Fais ton premier dépôt de 5000F ou 10$ pour profiter de tous les avantages. Rejoins aussi notre communauté pour des pronos quotidiens ! 🔥`,
                    withLinks: false
                },
                {
                    template: `Le code **${PROMO_CODE}** est ta clé pour des bonus exclusifs à l'inscription ! Pour télécharger les coupons premium, tu DOIS utiliser ce code. N'oublie pas ton dépôt initial de 5000F pour tout activer ! 💫`,
                    withLinks: false
                },
                {
                    template: `Avec **${PROMO_CODE}**, accède à des cotes boostées et scores exacts en temps réel ! Le premier dépôt de 10$ ou 5000F ouvre tous les avantages. Notre équipe t'attend pour te guider ! 🚀`,
                    withLinks: false
                },
                {
                    template: `**${PROMO_CODE}** transforme ton expérience betting avec des bonus immédiats ! L'inscription avec ce code est obligatoire pour les coupons VIP. Fais ton dépôt et découvre la différence ! 💎`,
                    withLinks: false
                },
                {
                    template: `Tes avantages commencent avec **${PROMO_CODE}** à l'inscription ! Cotes spéciales, scores exacts, tout est accessible après ton dépôt de 5000F. Prêt à maximiser tes gains ? 🏆`,
                    withLinks: false
                },
                {
                    template: `Le code **${PROMO_CODE}** offre les meilleurs bonus du marché en ce moment ! Inscris-toi rapidement et fais ton premier dépôt pour activer les fonctionnalités premium. Ta réussite commence ici ! 🎯`,
                    withLinks: false
                },
                {
                    template: `Avec **${PROMO_CODE}**, chaque inscription devient une opportunité de gains ! Les coupons grosses cotes t'attendent après ton dépôt de 10$. Rejoins-nous pour une expérience unique ! ✨`,
                    withLinks: false
                },
                {
                    template: `**${PROMO_CODE}** = ton passeport vers le betting premium ! Bonus immédiats + accès exclusif après dépôt initial. C'est le moment de passer au niveau supérieur ! 💪`,
                    withLinks: false
                }
            ],

            // 🌟 ENGLISH (40+ templates)
            english: [
                // With links
                {
                    template: `Sign up with code **${PROMO_CODE}** to unlock amazing bonuses and access our high odds coupons! Make your first deposit of 5000F or 10$ to activate all benefits. 🎰 Register here: ${ONEXBET_LINK} 🚀`,
                    withLinks: true
                },
                {
                    template: `**${PROMO_CODE}** gives you exclusive access to premium betting features! Don't forget your minimum 5000F deposit. 📱 Join WhatsApp: ${WHATSAPP_LINK} for free predictions! 💫`,
                    withLinks: true
                },
                {
                    template: `With **${PROMO_CODE}**, get boosted welcome bonuses on Melbet! Make your initial deposit to unlock everything. 🎯 Quick registration: ${MELBET_LINK} 🔥`,
                    withLinks: true
                },

                // Without links
                {
                    template: `Use promo code **${PROMO_CODE}** for incredible sign-up bonuses and VIP odds coupons! Your first deposit of 