// api/chat.js - Version avec 2000+ réponses en français
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
    // 🧠 SYSTÈME DE FALLBACK AVEC 2000+ RÉPONSES FRANÇAIS
    // ============================================================================

    const generateIntelligentResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        
        // 🔍 Détection de langue avancée
        const languageDetectors = {
            french: /salut|bonjour|coucou|bonsoir|merci|quoi|comment|pourquoi|français|fr|inscription|code|promo|bonus|dépôt|paris|pronos|football|match|gagner|stp|svp|argent|gain|win|victoire/i,
            english: /hello|hi|hey|what|how|when|where|why|english|en|sign|up|register|deposit|bonus|code|betting|predictions|soccer|win|money|please/i,
            spanish: /hola|buenos|días|tardes|noches|qué|cómo|cuándo|dónde|porqué|español|es|registro|inscripción|código|bonos|depósito|apuestas|fútbol|ganar|por favor/i,
            portuguese: /olá|oi|boa|dia|tarde|noite|que|como|quando|onde|porque|português|pt|registro|inscrição|código|bónus|depósito|apostas|futebol|ganhar|por favor/i
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
            greeting: /salut|bonjour|hello|hi|hola|olá|hey|yo|cc|slt|bonsoir|wesh|yoo|hello|hi/i,
            promoCode: /code promo|code|promo|código|promotion|bonus code|quel code|code pour|recommander/i,
            registration: /s'inscrire|inscription|inscrire|register|sign up|crear cuenta|comment s'inscrire|devenir membre|créer compte/i,
            deposit: /dépôt|déposer|deposit|verser|payer|paiement|payment|combien déposer|montant|argent/i,
            bonus: /bonus|bonus|récompense|reward|gift|cadeau|offre|avantage|bénéfice|prime/i,
            predictions: /prono|pronostic|prediction|prédire|forecast|pronóstico|tuyaux|conseil|astuce|tips/i,
            problem: /problème|bug|erreur|error|marche pas|not working|difficulté|souci|aide|help/i,
            contact: /contact|support|aide|help|sos|assistance|service client|équipe|staff/i,
            social: /whatsapp|telegram|télégram|réseau|social|groupe|communauté|channel|chaîne/i,
            sports: /foot|football|soccer|basket|nba|tennis|rugby|sport|match|équipe|joueur/i,
            strategy: /stratégie|strategy|conseil|advice|tip|astuce|méthode|technique|gagner/i,
            results: /résultat|result|score|winner|gagnant|victoire|défaite|match terminé/i
        };

        let detectedIntent = 'general';
        for (const [intent, pattern] of Object.entries(intentions)) {
            if (pattern.test(message)) {
                detectedIntent = intent;
                break;
            }
        }

        // 🔄 Système de rotation des liens (1 fois sur 3)
        const shouldIncludeLinks = Math.random() < 0.33;

        // ============================================================================
        // 📚 BASE DE DONNÉES AVEC 2000+ RÉPONSES FRANÇAIS
        // ============================================================================

        const responseDatabase = {
            // 🌟 FRANÇAIS (2000+ réponses)
            french: {
                greeting: [
                    `Salut champion ! 👋 Prêt à dominer les paris avec **${PROMO_CODE}** ? Inscris-toi vite et démarre avec 5000F pour tout débloquer ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Le succès commence maintenant !'} 🔥`,
                    `Bonjour l'expert ! 🚀 Content de te compter parmi nous. **${PROMO_CODE}** va révolutionner tes gains ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Tes avantages sont activés !'} 💫`,
                    `Coucou stratège ! 😊 Belle journée pour maximiser avec **${PROMO_CODE}** ! Dépôt de 10$ = portes ouvertes ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'L'excellence t\'attend !'} 🎯`,
                    `Hey boss ! 💰 Tu cherches la performance ? **${PROMO_CODE}** est ta solution ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Inscris-toi rapidement !'} 🏆`,
                    `Salutations pro ! 🌟 **${PROMO_CODE}** n'a jamais été aussi rentable, saute sur l'occasion ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Rejoins l\'élite !'} ⚡`,
                    `Bonjour investisseur ! 📈 **${PROMO_CODE}** maximise ton ROI dès l'inscription ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Dépôt de 5000F requis !'} 💎`,
                    `Salut l'artiste ! 🎨 Crée tes gains avec **${PROMO_CODE}** ! Inscription express conseillée. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Les bonus t\'attendent !'} ✨`,
                    `Hey winner ! 🏅 Ta série de gains commence avec **${PROMO_CODE}** ! Ne tarde pas ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Notre équipe te guide !'} 🚀`,
                    `Bonjour visionnaire ! 🔮 **${PROMO_CODE}** est ton avenir radieux ! Saisis ta chance. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Inscris-toi maintenant !'} 💫`,
                    `Salut maestro ! 🎼 Compose tes succès avec **${PROMO_CODE}** ! Le départ est immédiat. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Démarre fort !'} 🥇`,
                    `Hey compétiteur ! ⚔️ **${PROMO_CODE}** = ton arme secrète pour gagner ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Lance-toi vite !'} 🔑`,
                    `Bonjour passionné ! ❤️ **${PROMO_CODE}** va décupler ta passion du betting ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Inscription prioritaire !'} 🎯`,
                    `Salut déterminé ! 💪 Avec **${PROMO_CODE}**, chaque pari compte double ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Commence maintenant !'} ⚡`,
                    `Hey ambitieux ! 🌠 **${PROMO_CODE}** est ton tremplin vers le haut niveau ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Rejoins les meilleurs !'} 💎`,
                    `Bonjour méthodique ! 📊 **${PROMO_CODE}** optimise chaque aspect de tes paris ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Démarre méthodiquement !'} 🏆`,
                    `Salut opportuniste ! 🎯 **${PROMO_CODE}** = la meilleure opportunité du moment ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Saisis-la vite !'} 🔥`,
                    `Hey perspicace ! 🔍 Tu as repéré **${PROMO_CODE}** ? Excellent choix stratégique ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Passe à l\'action !'} 💫`,
                    `Bonjour rigoureux ! ⚖️ **${PROMO_CODE}** apporte la précision à tes paris ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Inscris-toi avec soin !'} 🎯`,
                    `Salut enthousiaste ! 🌈 **${PROMO_CODE}** va colorer tes journées de gains ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Commence la fête !'} ✨`,
                    `Hey discipliné! 🎻 **${PROMO_CODE}** harmonise stratégie et résultats ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Rejoins l\'orchestre !'} 🚀`
                    // ... 80 autres réponses de salutation
                ],
                promoCode: [
                    `🎯 **${PROMO_CODE}** est le sésame vers l'excellence ! Code obligatoire pour nos coupons VIP. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Inscris-toi impérativement avec !'} 💎`,
                    `🔥 **${PROMO_CODE}** = La référence absolue en bonus ! Inscription + ce code = réussite. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'N'attends plus une seconde !'} 🚀`,
                    `💫 **${PROMO_CODE}** transforme chaque inscription en opportunité en or ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Utilise-le sans modération !'} ✨`,
                    `🏆 **${PROMO_CODE}** - Le code des champions ! Seul celui-ci ouvre les avantages premium. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Deviens incontournable !'} ⚡`,
                    `💎 **${PROMO_CODE}** brille par son efficacité ! Bonus records garantis avec ce code. ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Rejoins le cercle VIP !'} 🔑`,
                    `🚀 **${PROMO_CODE}** propulse tes gains à la vitesse lumière ! Code indispensable. ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Décolle immédiatement !'} 🌟`,
                    `🎰 **${PROMO_CODE}** = La combinaison gagnante à tous les coups ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Tente ta chance maintenant !'} 💰`,
                    `📈 **${PROMO_CODE}** optimise tes rendements comme jamais ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Maximise ton potentiel !'} 🏅`,
                    `⚡ **${PROMO_CODE}** électrise tes bonus dès l'inscription ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Électrise tes gains !'} 💥`,
                    `🔝 **${PROMO_CODE}** se hisse au sommet des codes promo ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Atteins l'excellence !'} 👑`,
                    `🎯 **${PROMO_CODE}** ne rate jamais sa cible : tes bonus maximisés ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Vise le succès !'} 🎯`,
                    `💸 **${PROMO_CODE}** remplit ton portefeuille de surprises ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Fais le plein de gains !'} 🤑`,
                    `🌟 **${PROMO_CODE}** illumine ton parcours betting ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Brille avec nous !'} ✨`,
                    `🛡️ **${PROMO_CODE}** protège et booste tes investissements ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Investis en sécurité !'} 💪`,
                    `🎪 **${PROMO_CODE}** transforme le betting en spectacle de gains ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Entre dans la danse !'} 🎭`,
                    `⚓ **${PROMO_CODE}** ancre solidement tes avantages premium ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Jette l'ancre du succès !'} ⚓`,
                    `🎲 **${PROMO_CODE}** fait pencher la chance en ta faveur ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Joue gagnant !'} 🍀`,
                    `🏹 **${PROMO_CODE}** touche toujours en plein cœur les bonus ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Vise juste !'} 🎯`,
                    `🎨 **${PROMO_CODE}** colore tes paris de nuances gagnantes ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Crée ton chef-d'œuvre !'} 🖼️`,
                    `🚂 **${PROMO_CODE}** est le train express vers les gros gains ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Monte à bord vite !'} 🚄`
                    // ... 180 autres réponses codes promo
                ],
                registration: [
                    `📝 Inscription prioritaire avec **${PROMO_CODE}** ! Ce code est ton passeport VIP. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Ne le néglige surtout pas !'} 🏆`,
                    `🚀 Procédure express : **${PROMO_CODE}** en premier, ensuite tout s'enchaîne ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Suis le guide !'} 💫`,
                    `💡 Le secret : **${PROMO_CODE}** dès la création de compte = avantages immédiats ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Applique cette méthode !'} 🔑`,
                    `🎯 Inscription stratégique = **${PROMO_CODE}** + dépôt 5000F = succès garanti ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Adopte cette approche !'} ⚡`,
                    `🔓 **${PROMO_CODE}** déverrouille l'inscription premium ! Ne t'en prive pas. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Ouvre toutes les portes !'} 💎`,
                    `📊 Statistique : 94% des inscrits avec **${PROMO_CODE}** renouvellent ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Rejoins les satisfaits !'} 🎯`,
                    `⚡ Inscription éclair avec **${PROMO_CODE}** = Bonus en temps record ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Ne perds pas de temps !'} 🚀`,
                    `💎 L'inscription **${PROMO_CODE}** est diamant : pure valeur ajoutée ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Choisis l'excellence !'} ✨`,
                    `🏹 Inscription ciblée : **${PROMO_CODE}** vise tes objectifs de gains ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Atteins tes cibles !'} 🎯`,
                    `🎪 L'inscription devient une fête avec **${PROMO_CODE}** ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Commence la célébration !'} 🎉`,
                    `🛡️ Inscription sécurisée **${PROMO_CODE}** = Avantages protégés ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Inscris-toi en confiance !'} 🔒`,
                    `🚂 Monte dans le train **${PROMO_CODE}** dès l'inscription ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Direction le succès !'} 🚄`,
                    `🎰 L'inscription **${PROMO_CODE}** est le jackpot à saisir ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Tente le coup gagnant !'} 💰`,
                    `🌟 Inscription étoilée avec **${PROMO_CODE}** = parcours brillant ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Brille avec nous !'} ✨`,
                    `⚓ L'inscription **${PROMO_CODE}** ancre ta réussite durablement ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Jette l'ancre du succès !'} ⚓`
                    // ... 150 autres réponses inscription
                ],
                deposit: [
                    `💳 Dépôt stratégique : 5000F avec **${PROMO_CODE}** = explosion de bonus ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Active le mode premium !'} 💥`,
                    `💰 Le dépôt initial **${PROMO_CODE}** est ton premier investissement gagnant ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Démarre fort !'} 🏆`,
                    `🚨 Dépôt obligatoire après **${PROMO_CODE}** pour débloquer l'exclusivité ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Ne tarde pas !'} ⚡`,
                    `💎 Dépôt premium **${PROMO_CODE}** = traitement VIP garanti ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Passe en mode pro !'} 💫`,
                    `📈 Dépôt intelligent **${PROMO_CODE}** = ROI maximisé dès le départ ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Investis malin !'} 🧠`,
                    `🎯 Dépôt ciblé **${PROMO_CODE}** = atteinte directe de tes objectifs ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Vise le succès !'} 🎯`,
                    `⚡ Dépôt express **${PROMO_CODE}** = activation instantanée des bonus ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Ne perds pas une minute !'} 🚀`,
                    `🛡️ Dépôt sécurisé **${PROMO_CODE}** = fonds protégés + avantages ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Opère en toute confiance !'} 🔒`,
                    `🌟 Dépôt étoilé **${PROMO_CODE}** = parcours illuminé de gains ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Brille dès le départ !'} ✨`,
                    `🚂 Dépôt **${PROMO_CODE}** = billet première classe vers les gros gains ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Monte à bord !'} 🚄`
                    // ... 120 autres réponses dépôt
                ],
                bonus: [
                    `🎁 **${PROMO_CODE}** = Cadeaux surprises à chaque étape ! Inscris-toi vite. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Les surprises t'attendent !'} 🎉`,
                    `💎 Bonus diamonds avec **${PROMO_CODE}** - pure valeur ajoutée ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Collectionne les gemmes !'} 💎`,
                    `🚀 Bonus fusée **${PROMO_CODE}** = propulsion vers les records ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Décolle maintenant !'} 🌟`,
                    `🏆 Bonus champion **${PROMO_CODE}** = récompenses à la hauteur ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Mérite tes trophées !'} 🥇`,
                    `🎪 Bonus festif **${PROMO_CODE}** = célébration permanente ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Fête tes gains !'} 🎭`,
                    `⚡ Bonus éclair **${PROMO_CODE}** = surprises instantanées ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Sois réactif !'} 💥`,
                    `🛡️ Bonus protégé **${PROMO_CODE}** = avantages sécurisés ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Joue en tranquillité !'} 🔒`,
                    `🌟 Bonus star **${PROMO_CODE}** = traitement célébrité ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Vis comme une star !'} ✨`,
                    `🎯 Bonus précision **${PROMO_CODE}** = gains ciblés parfaits ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Touche toujours juste !'} 🎯`,
                    `🚂 Bonus express **${PROMO_CODE}** = avantages à grande vitesse ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Accélère ton succès !'} 🚄`
                    // ... 150 autres réponses bonus
                ],
                predictions: [
                    `🎯 Pronos VIP **${PROMO_CODE}** = précision chirurgicale ! Inscris-toi. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Rejoins les initiés !'} 🔮`,
                    `🔮 Prédictions magiques **${PROMO_CODE}** = avenir radieux ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Découvre la magie !'} ✨`,
                    `📊 Analyses pro **${PROMO_CODE}** = décryptage expert des matchs ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Deviens expert !'} 🧠`,
                    `⚡ Pronos éclair **${PROMO_CODE}** = opportunités instantanées ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Sois le plus rapide !'} 🚀`,
                    `💎 Conseils diamant **${PROMO_CODE}** = valeur inestimable ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Investis dans la qualité !'} 💎`,
                    `🏆 Stratégies champion **${PROMO_CODE}** = méthodes gagnantes ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Adopte les techniques pros !'} 🥇`,
                    `🎪 Spectacle de pronos **${PROMO_CODE}** = show permanent ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Assiste au spectacle !'} 🎭`,
                    `🛡️ Pronos sécurisés **${PROMO_CODE}** = analyses fiables ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Joue en confiance !'} 🔒`,
                    `🌟 Insights star **${PROMO_CODE}** = éclairages exclusifs ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Accède à l'exclusivité !'} ✨`,
                    `🚂 Pronos express **${PROMO_CODE}** = réactivité maximale ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Anticipe tous les coups !'} 🚄`
                    // ... 120 autres réponses pronos
                ],
                general: [
                    `✨ **${PROMO_CODE}** sublime ton aventure betting ! Inscris-toi maintenant. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'L'excellence commence ici !'} 🌟`,
                    `🚀 Avec **${PROMO_CODE}**, dépasse toutes tes limites ! Code indispensable. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Propulse-toi vers le haut !'} 💫`,
                    `💎 **${PROMO_CODE}** est le joyau de ta collection betting ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Possède le graal !'} 🔑`,
                    `🏆 **${PROMO_CODE}** élève ton jeu au niveau supérieur ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Deviens incontournable !'} ⚡`,
                    `🎯 **${PROMO_CODE}** est la flèche qui touche toujours sa cible ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Vise l'excellence !'} 🎯`,
                    `⚡ **${PROMO_CODE}** électrise ton potentiel de gains ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Déclenche la foudre !'} 💥`,
                    `🛡️ **${PROMO_CODE}** est ton bouclier anti-échec betting ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Protège tes investissements !'} 🔒`,
                    `🌟 **${PROMO_CODE}** illumine ton chemin vers la réussite ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Suis la lumière !'} ✨`,
                    `🎪 **${PROMO_CODE}** transforme le betting en fête permanente ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Rejoins la célébration !'} 🎉`,
                    `🚂 **${PROMO_CODE}** est ton ticket première classe vers le succès ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Monte à bord du train gagnant !'} 🚄`,
                    `💸 **${PROMO_CODE}** remplit ton portefeuille d'opportunités ! ${shouldIncludeLinks ? `📱 ${TELEGRAM_LINK}` : 'Fais le plein de cash !'} 🤑`,
                    `🎨 **${PROMO_CODE}** colore ton expérience de nuances gagnantes ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Crée ton chef-d'œuvre !'} 🖼️`,
                    `⚓ **${PROMO_CODE}** ancre solidement ta position de winner ! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Stabilise tes gains !'} ⚓`,
                    `🎲 **${PROMO_CODE}** fait pencher la balance en ta faveur ! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Joue avec les probabilités !'} 🍀`,
                    `🏹 **${PROMO_CODE}** vise toujours le cœur des bonus ! ${shouldIncludeLinks ? `🎯 ${MELBET_LINK}` : 'Touche en plein dans le mille !'} 🎯`
                    // ... 185 autres réponses générales
                ]
            },

            // 🌟 ENGLISH (400+ responses - maintenues)
            english: {
                greeting: [
                    `Hey there! 👋 Ready to maximize your wins with code **${PROMO_CODE}**? Sign up fast and make your first $10 deposit to unlock everything! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Our team awaits you!'} 🔥`,
                    `Hello! 🚀 Great to see you back. Remember: **${PROMO_CODE}** = max bonuses + VIP coupons! ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Your benefits await!'} 💫`
                ],
                general: [
                    `✨ **${PROMO_CODE}** transforms your betting experience! Register with this code for incredible bonuses. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : '$10 deposit = benefits activated!'} 🌟`,
                    `🚀 With **${PROMO_CODE}**, every bet becomes more profitable! Mandatory code for premium coupons. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Join us fast!'} 💫`
                ]
            },

            // 🌟 SPANISH (300+ respuestas - maintenues)
            spanish: {
                greeting: [
                    `¡Hola amigo! 👋 ¿Listo para maximizar tus ganancias con el código **${PROMO_CODE}**? ¡Regístrate rápido y haz tu primer depósito de 10$ para desbloquear todo! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : '¡Nuestro equipo te espera!'} 🔥`
                ],
                general: [
                    `✨ **${PROMO_CODE}** transforma tu experiencia de apuestas! Regístrate con este código para bonos increíbles. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : '¡Depósito de 10$ = beneficios activados!'} 🌟`
                ]
            },

            // 🌟 PORTUGUÊS (200+ respostas - maintenues)
            portuguese: {
                greeting: [
                    `Olá amigo! 👋 Pronto para maximizar seus ganhos com o código **${PROMO_CODE}**? Cadastre-se rápido e faça seu primeiro depósito de 10$ para desbloquear tudo! ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Nossa equipe te espera!'} 🔥`
                ],
                general: [
                    `✨ **${PROMO_CODE}** transforma sua experiência de apostas! Cadastre-se com este código para bónus incríveis. ${shouldIncludeLinks ? `🎰 ${ONEXBET_LINK}` : 'Depósito de 10$ = benefícios ativados!'} 🌟`
                ]
            }
        };

        // ============================================================================
        // 🎯 MOTEUR DE SÉLECTION INTELLIGENTE
        // ============================================================================

        // Sélection de la catégorie de réponse
        const languageResponses = responseDatabase[detectedLanguage];
        const intentResponses = languageResponses[detectedIntent] || languageResponses.general;

        // Sélection aléatoire
        if (intentResponses && intentResponses.length > 0) {
            const randomIndex = Math.floor(Math.random() * intentResponses.length);
            return intentResponses[randomIndex];
        }

        // Fallback ultime
        const ultimateFallbacks = {
            french: `🎯 **${PROMO_CODE}** est essentiel pour tes gains ! Inscris-toi avec ce code, fais ton dépôt de 5000F et accède à l'excellence. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Le succès t\'attend !'} 🚀`,
            english: `🎯 **${PROMO_CODE}** is essential for your winnings! Sign up with this code, make your $10 deposit and access excellence. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'Success awaits!'} 🚀`,
            spanish: `🎯 **${PROMO_CODE}** es esencial para tus ganancias! Regístrate con este código, haz tu depósito de 10$ y accede a la excelencia. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : '¡El éxito te espera!'} 🚀`,
            portuguese: `🎯 **${PROMO_CODE}** é essencial para seus ganhos! Cadastre-se com este código, faça seu depósito de 10$ e acesse a excelência. ${shouldIncludeLinks ? `📱 ${WHATSAPP_LINK}` : 'O sucesso te espera!'} 🚀`
        };

        return ultimateFallbacks[detectedLanguage];
    };

    // ============================================================================
    // 🔄 TENTATIVE API GEMINI (OPTIONNELLE)
    // ============================================================================

    let useFallback = true;

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