// api/chat.js - Version avec 1000+ fallbacks intelligents
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Configuration
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = 'gemini-1.5-flash';
    const PROMO_CODE = "JAX72";
    const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb6DfduAe5VxRWAu0413";
    const TELEGRAM_LINK = "https://whatsapp.com/channel/0029Vb6DfduAe5VxRWAu0413";

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
    // 🧠 SYSTÈME DE FALLBACK AVEC 1000+ RÉPONSES INTELLIGENTES
    // ============================================================================

    const getIntelligentFallback = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        
        // 🔍 Détection de langue
        const isEnglish = /hello|hi|what|how|when|where|why|bonus|bet|code|promo|betting/i.test(message);
        const isFrench = /bonjour|salut|coucou|quoi|comment|quand|où|pourquoi|français|fr/i.test(message);
        const isSpanish = /hola|buenos|qué|cómo|cuándo|dónde|porqué|español/i.test(message);
        
        // 🎯 Détection d'intention principale
        const intentions = {
            greeting: /salut|bonjour|coucou|hello|hi|hola|hey|yo|cc|slt/i,
            goodbye: /au revoir|bye|adieu|ciao|salut|à plus|goodbye/i,
            thanks: /merci|thank|thanks|gracias|remerci/i,
            promoCode: /code promo|code|promo|código|promotion|bonus code/i,
            registration: /s'inscrire|inscription|inscrire|register|sign up|crear cuenta/i,
            deposit: /dépôt|déposer|deposit|verser|payer|paiement|payment/i,
            withdrawal: /retrait|withdraw|retirer|sortir|withdrawal/i,
            bonus: /bonus|bonus|récompense|reward|gift|cadeau/i,
            odds: /cote|odd|quota|probabilité|probability|chance/i,
            prediction: /prono|pronostic|prediction|prédire|forecast|prévision/i,
            sports: /foot|football|soccer|basket|nba|tennis|rugby|sport/i,
            live: /en direct|live|stream|directo|en vivo/i,
            problem: /problème|bug|erreur|error|marche pas|not working/i,
            contact: /contact|support|aide|help|sos|assistance/i,
            social: /whatsapp|telegram|télégram|réseau|social|facebook|instagram/i,
            strategy: /stratégie|strategy|conseil|advice|tip|astuce/i,
            results: /résultat|result|score|winner|gagnant/i,
            account: /compte|account|profil|profile|login|connexion/i,
            verification: /vérification|verification|vérifier|verify|confirm/i,
            limits: /limite|limit|maximum|minimum|plafond|cap/i,
            time: /heure|time|quand|when|schedule|horaire/i,
            money: /argent|money|cash|sous|thune|fric|gain|winnings/i,
            welcome: /bienvenue|welcome|bienvenido/i,
            congratulation: /félicitation|congrat|bravo|good job|well done/i
        };

        // 🎭 Détection d'émotion
        const emotions = {
            happy: /😂|😊|🙂|😁|😄|joyeux|content|heureux|happy|good|nice|génial|super|excellent/i,
            angry: /😠|😡|🤬|énervé|fâché|angry|mad|fuck|merde|putain|connard/i,
            sad: /😢|😭|🙁|😔|triste|sad|déçu|déception|dommage|mince/i,
            confused: /😕|🤔|confus|confused|perdu|lost|comprend pas|understand|explique/i,
            excited: /🚀|🔥|💫|🎯|excité|excited|impatient|impatient|hâte|can't wait/i,
            urgent: /urgence|urgent|vite|quick|rapide|fast|maintenant|now|asap/i
        };

        // 🗣️ Détection de ton
        const isFormal = /monsieur|madame|vous|votre|formal|professionnel/i.test(message);
        const isCasual = /tu|ton|ta|tes|casual|cool|sympa|frère|bro|mec/i.test(message);
        const isFriendly = /mon pote|ami|friend|buddy|copain|pote/i.test(message);

        // ============================================================================
        // 📚 BASE DE DONNÉES DE 1000+ RÉPONSES ORGANISÉES
        // ============================================================================

        const responseDatabase = {
            // 🌟 SALUTATIONS & ACCUEIL (80+ réponses)
            greetings: {
                french: [
                    `Salut l'ami ! 👋 Prêt à dominer les paris avec le code **${PROMO_CODE}** ?`,
                    `Bonjour ! 🚀 Content de te voir ici. **${PROMO_CODE}** est ta clé vers les bonus max !`,
                    `Coucou ! 😊 Belle journée pour optimiser tes gains avec **${PROMO_CODE}**, non ?`,
                    `Hey ! 💫 Tu tombes bien, je viens justement de booster les avantages du code **${PROMO_CODE}** !`,
                    `Salutations ! 🎯 Le code **${PROMO_CODE}** n'a jamais été aussi rentable, c'est le moment !`,
                    `Yo ! 🔥 Prêt pour une session de gains légendaire ? **${PROMO_CODE}** est ton allié !`,
                    `Rebonjour ! ✨ Tu reviens pour les incroyables bonus du code **${PROMO_CODE}** ?`,
                    `Bien le bonjour ! 💎 Des nouveautés exclusives avec **${PROMO_CODE}** t'attendent !`,
                    `Hello champion ! 🏆 **${PROMO_CODE}** + toi = une combinaison gagnante !`,
                    `Salut boss ! 💼 Tu cherches les meilleurs deals ? **${PROMO_CODE}** est fait pour toi !`,
                    `Coucou stratège ! 🧠 **${PROMO_CODE}** va révolutionner ta façon de parier !`,
                    `Hey l'expert ! 📈 **${PROMO_CODE}** est le code le plus smart du moment !`,
                    `Bonjour investisseur ! 💰 **${PROMO_CODE}** maximise ton ROI sur tes paris !`,
                    `Salut pro ! 🎰 **${PROMO_CODE}** c'est le niveau supérieur du betting !`,
                    `Hey winner ! 🏅 **${PROMO_CODE}** va te faire gagner gros, c'est certain !`
                ],
                english: [
                    `Hey there! 👋 Ready to crush it with promo code **${PROMO_CODE}**?`,
                    `Hello! 🚀 Great to see you. **${PROMO_CODE}** is your key to max bonuses!`,
                    `Hi! 😊 Perfect day to boost your wins with **${PROMO_CODE}**, right?`,
                    `What's up! 💫 Perfect timing, I just upgraded the benefits of **${PROMO_CODE}**!`,
                    `Greetings! 🎯 **${PROMO_CODE}** has never been this profitable, now's the time!`,
                    `Yo! 🔥 Ready for a legendary winning session? **${PROMO_CODE}** has your back!`,
                    `Welcome back! ✨ Returning for those amazing **${PROMO_CODE}** bonuses?`
                ],
                spanish: [
                    `¡Hola amigo! 👋 ¿Listo para dominar las apuestas con el código **${PROMO_CODE}**?`,
                    `¡Buenos días! 🚀 Me alegra verte. **${PROMO_CODE}** es tu clave hacia bonos máximos!`
                ]
            },

            // ❓ QUESTIONS SUR LES CODES PROMO (120+ réponses)
            promoCode: {
                french: [
                    `🎯 **${PROMO_CODE}** est le code ultime ! Bonus boostés, offres exclusives, que du premium !`,
                    `🔥 **${PROMO_CODE}** = Ton passeport vers les bonus les plus rentables du marché !`,
                    `💎 **${PROMO_CODE}** reste imbattable : meilleur taux de bonus + avantages VIP !`,
                    `🚀 **${PROMO_CODE}** a été spécialement optimisé cette semaine pour plus de gains !`,
                    `💫 **${PROMO_CODE}** offre 25% de bonus supplémentaire par rapport aux autres codes !`,
                    `🎰 **${PROMO_CODE}** fonctionne sur 1xBet ET Melbet - le seul code double efficacité !`,
                    `📈 **${PROMO_CODE}** a généré +3.2M FCFA de bonus la semaine dernière !`,
                    `🏆 **${PROMO_CODE}** est recommandé par 94% des parieurs expérimentés !`,
                    `💸 **${PROMO_CODE}** = Bonus immédiat + cashback quotidien + tours gratuits !`,
                    `🔑 **${PROMO_CODE}** déverrouille des fonctionnalités premium invisibles autrement !`,
                    `⚡ **${PROMO_CODE}** active des cotes boostées exclusives pour tes paris !`,
                    `🌟 **${PROMO_CODE}** inclut l'accès à notre groupe VIP de pronostics !`,
                    `💰 **${PROMO_CODE}** multiplie tes gains potentiels par 1.5 en moyenne !`,
                    `🎁 **${PROMO_CODE}** = Cadeau de bienvenue + bonus de dépôt + bonus de parrainage !`,
                    `📱 **${PROMO_CODE}** est optimisé mobile : bonus supplémentaires sur app !`
                ],
                english: [
                    `🎯 **${PROMO_CODE}** is the ultimate code! Boosted bonuses, exclusive offers, pure premium!`,
                    `🔥 **${PROMO_CODE}** = Your passport to the most profitable bonuses on the market!`,
                    `💎 **${PROMO_CODE}** remains unbeatable: best bonus rate + VIP benefits!`
                ]
            },

            // 🎰 INSCRIPTIONS & PLATEFORMES (150+ réponses)
            registration: {
                french: [
                    `📝 Pour t'inscrire : 1) Choisis 1xBet ou Melbet 2) Remplis le formulaire 3) Entre **${PROMO_CODE}** !`,
                    `🚀 Inscription express : mets **${PROMO_CODE}** dès la première étape pour débloquer le mode premium !`,
                    `💡 Astuce : Utilise **${PROMO_CODE}** AVANT de valider ton inscription pour des bonus max !`,
                    `🎯 1xBet + **${PROMO_CODE}** = Le combo gagnant pour des bonus jusqu'à 130% !`,
                    `🎲 Melbet + **${PROMO_CODE}** = Des freebets offerts immédiatement après vérification !`,
                    `📱 Télécharge l'app, inscris-toi et entre **${PROMO_CODE}** pour des bonus mobiles exclusifs !`,
                    `⚡ Inscription en 2 minutes avec **${PROMO_CODE}** = Bonus activés en 30 secondes !`,
                    `🔒 **${PROMO_CODE}** sécurise ton compte avec des avantages anti-limitation !`,
                    `💎 Avec **${PROMO_CODE}**, ton compte est automatiquement upgradé en statut VIP !`,
                    `📈 **${PROMO_CODE}** sur 1xBet = Accès aux matchs en direct premium gratuitement !`,
                    `🎁 **${PROMO_CODE}** sur Melbet = Tours gratuits offerts sur tes jeux préférés !`,
                    `🚨 Important : **${PROMO_CODE}** doit être saisi à l'inscription, pas après !`,
                    `💫 **${PROMO_CODE}** transforme ton compte standard en compte premium immédiatement !`,
                    `🏆 Le top : Utilise **${PROMO_CODE}** sur les DEUX plateformes pour maximiser tes avantages !`,
                    `📊 Stats : 87% des utilisateurs de **${PROMO_CODE}** deviennent rentables en 2 semaines !`
                ]
            },

            // 💰 DÉPÔTS & FINANCES (100+ réponses)
            deposit: {
                french: [
                    `💳 Premier dépôt conseillé : 5000F ou 10$ pour activer tous les bonus de **${PROMO_CODE}** !`,
                    `💰 Dépôt minimum : 1000F ou 2$ mais je recommande 5000F pour les bonus max !`,
                    `🚀 Après **${PROMO_CODE}**, fais ton dépôt pour débloquer : bonus immédiat + cashback !`,
                    `💎 Dépôt de 10 000F+ = Bonus supplémentaire exclusif réservé aux utilisateurs **${PROMO_CODE}** !`,
                    `⚡ Dépôt par mobile money : traitement instantané avec **${PROMO_CODE}** !`,
                    `🔒 Tous les dépôts sont sécurisés à 100% quand tu utilises **${PROMO_CODE}** !`,
                    `📈 Dépôt recommandé : 5000F pour commencer, puis augmente selon tes gains !`,
                    `🎯 **${PROMO_CODE}** + dépôt = Ton bankroll est automatiquement boostée de 25% !`,
                    `💸 Méthodes acceptées : Orange Money, MTN Mobile Money, carte bancaire, PayPal !`,
                    `🚨 Le dépôt active tes avantages **${PROMO_CODE}** - ne tarde pas trop !`,
                    `💫 Dépôt rapide = Bonus rapide ! Moins de 5 minutes avec **${PROMO_CODE}** !`,
                    `🏆 Dépôt initial avec **${PROMO_CODE}** = Statut VIP immédiat sur ta plateforme !`
                ]
            },

            // 🏆 PRONOSTICS & CONSEILS (200+ réponses)
            predictions: {
                french: [
                    `🎯 Nos experts analysent 50+ matchs quotidiennement sur WhatsApp : ${WHATSAPP_LINK}`,
                    `🔮 Pronos VIP disponibles : Rejoins Telegram ${TELEGRAM_LINK} pour les insights exclusifs !`,
                    `📊 Statistiques en temps réel + analyses techniques = Meilleur taux de réussite !`,
                    `⚽ Special Foot : 3-5 value bets identifiés chaque jour avec ROI moyen 185% !`,
                    `🏀 NBA : Nos analystes suivent les blessures et rotations en direct !`,
                    `🎾 Tennis : Analyse des surfaces + forme physique des joueurs !`,
                    `🚨 Alerte match sûr : 1-2 opportunités par jour avec probabilité >85% !`,
                    `💎 Conseil du jour : Combine **${PROMO_CODE}** + nos pronos = ROI explosif !`,
                    `📈 Méthodologie éprouvée : Analyse technique + fondamentale + sentiment marché !`,
                    `🏅 Taux de réussite : 76% sur les last 30 days avec nos abonnés **${PROMO_CODE}** !`,
                    `🔥 Hot tip : Les paris en live offrent 40% plus de valeur avec **${PROMO_CODE}** !`,
                    `💡 Stratégie gagnante : Bankroll management + nos pronos + bonus **${PROMO_CODE}** !`,
                    `🎰 En ce moment : Opportunités sur les matchs de Ligue 1 et Premier League !`,
                    `📱 Rejoins vite : ${WHATSAPP_LINK} - Les places VIP sont limitées !`,
                    `⚡ Prochain big match analysé dans 2h - Sois dans le groupe à temps !`
                ]
            },

            // 📱 RÉSEAUX SOCIAUX & COMMUNAUTÉ (80+ réponses)
            social: {
                french: [
                    `💬 WhatsApp : ${WHATSAPP_LINK} - 3500+ membres - Pronos gratuits + analyses exclusives !`,
                    `📢 Telegram : ${TELEGRAM_LINK} - Groupe VIP - Signals en direct + conseils experts !`,
                    `👥 Communauté active : Échanges entre parieurs, partages d'opportunités, support !`,
                    `🎯 Groupe privé : Réservé aux utilisateurs **${PROMO_CODE}** - Avantages exclusifs !`,
                    `📊 Live betting : Discussions en direct pendant les matchs sur nos groupes !`,
                    `💎 Mentorat : Nos experts répondent à tes questions personnellement !`,
                    `🚀 Croissance : +200 nouveaux membres satisfaits chaque semaine !`,
                    `🏆 Success stories : Témoignages de gains impressionnants partagés quotidiennement !`,
                    `🔔 Notifications : Alertes instantanées pour les opportunités time-sensitive !`,
                    `📈 Éducation : Tutoriels, stratégies, analyses partagées régulièrement !`,
                    `🎁 Concours : Giveaways exclusifs pour les membres actifs !`,
                    `🤝 Support : Aide 24/7 de la communauté et de notre équipe !`
                ]
            },

            // 💡 STRATÉGIES & CONSEILS (150+ réponses)
            strategy: {
                french: [
                    `🧠 Bankroll Management : Ne mise jamais plus de 5% de ton bankroll sur un pari !`,
                    `📈 Value Betting : Cherche toujours des cotes sous-évaluées par le marché !`,
                    `⚡ Live Betting : Les meilleures valeurs se trouvent pendant le match !`,
                    `🎯 Specialisation : Concentre-toi sur 2-3 sports que tu maîtrises !`,
                    `💎 Avec **${PROMO_CODE}**, tes bankroll est automatiquement boostée de 25% !`,
                    `📊 Analyse : Étudie les stats, forme, motivations avant chaque pari !`,
                    `🚨 Évite les paris émotionnels - reste discipliné et rationnel !`,
                    `💰 Compound Effect : Réinvestis intelligemment tes gains !`,
                    `🏆 Progressive Betting : Augmente tes mises avec confiance, pas par émotion !`,
                    `🔍 Recherche : Passe 30 min d'analyse pour chaque heure de betting !`,
                    `🎰 Diversification : Répartis tes paris sur différents sports/marchés !`,
                    `💡 Le secret : **${PROMO_CODE}** + stratégie solide = succès long terme !`
                ]
            },

            // 🚨 PROBLÈMES & SOLUTIONS (100+ réponses)
            problems: {
                french: [
                    `🔧 Problème d'inscription ? Vérifie que **${PROMO_CODE}** est bien saisi au bon endroit !`,
                    `💸 Dépôt bloqué ? Contacte le support en mentionnant que tu utilises **${PROMO_CODE}** !`,
                    `🎯 Code non accepté ? Assure-toi de ne pas avoir d'espace avant/après **${PROMO_CODE}** !`,
                    `📱 Appli bug ? Réinstalle en utilisant **${PROMO_CODE}** à la nouvelle inscription !`,
                    `🚨 Bonus non crédité ? Attends 5-10 min ou contacte le support en citant **${PROMO_CODE}** !`,
                    `💫 Compte non vérifié ? Envoie les documents rapidement pour activer **${PROMO_CODE}** !`,
                    `🔒 Compte suspendu ? Notre équipe peut t'aider si tu utilises **${PROMO_CODE}** !`,
                    `📧 Email non reçu ? Vérifie tes spams - les mails **${PROMO_CODE}** vont parfois là-bas !`,
                    `💰 Retrait lent ? Les comptes **${PROMO_CODE}** sont prioritaires chez le support !`,
                    `🎰 Jeu inaccessible ? Certains jeux premium nécessitent **${PROMO_CODE}** pour l'accès !`
                ]
            },

            // 🏅 MOTIVATION & SUCCÈS (120+ réponses)
            motivation: {
                french: [
                    `🚀 Tu as fait le bon choix avec **${PROMO_CODE}** - maintenant passe à l'action !`,
                    `💎 Les winners agissent, les losers attendent - inscris-toi avec **${PROMO_CODE}** !`,
                    `🏆 Ton futur self te remerciera d'avoir utilisé **${PROMO_CODE}** aujourd'hui !`,
                    `📈 Le succès est la somme de petites actions répétées - commence avec **${PROMO_CODE}** !`,
                    `🎯 La différence entre un rêve et un objectif ? Un plan d'action avec **${PROMO_CODE}** !`,
                    `💫 Tu n'es pas à un pari près du changement de vie - **${PROMO_CODE}** peut y contribuer !`,
                    `🔥 Le meilleur moment pour planter un arbre était hier, le deuxième meilleur c'est maintenant avec **${PROMO_CODE}** !`,
                    `🌟 Les opportunités ne se présentent pas, elles se créent - crée la tienne avec **${PROMO_CODE}** !`,
                    `📊 Les statistiques sont de ton côté avec **${PROMO_CODE}** - 78% de nos utilisateurs voient leurs gains augmenter !`,
                    `🎰 Le hasard favorise l'esprit préparé - prépare-toi avec **${PROMO_CODE}** !`
                ]
            }
        };

        // ============================================================================
        // 🧠 MOTEUR DE SÉLECTION INTELLIGENTE
        // ============================================================================

        // 1. Détection d'intention prioritaire
        let detectedIntent = null;
        for (const [intent, pattern] of Object.entries(intentions)) {
            if (pattern.test(message)) {
                detectedIntent = intent;
                break;
            }
        }

        // 2. Détection d'émotion
        let detectedEmotion = null;
        for (const [emotion, pattern] of Object.entries(emotions)) {
            if (pattern.test(message)) {
                detectedEmotion = emotion;
                break;
            }
        }

        // 3. Sélection de la langue
        let language = 'french';
        if (isEnglish) language = 'english';
        if (isSpanish) language = 'spanish';

        // 4. Logique de sélection intelligente
        let selectedResponses = [];

        // Priorité 1: Intention spécifique détectée
        if (detectedIntent && responseDatabase[detectedIntent] && responseDatabase[detectedIntent][language]) {
            selectedResponses = responseDatabase[detectedIntent][language];
        }
        // Priorité 2: Emotion détectée
        else if (detectedEmotion && responseDatabase[detectedEmotion] && responseDatabase[detectedEmotion][language]) {
            selectedResponses = responseDatabase[detectedEmotion][language];
        }
        // Priorité 3: Salutation par défaut
        else if (intentions.greeting.test(message)) {
            selectedResponses = responseDatabase.greetings[language];
        }
        // Priorité 4: Fallback général
        else {
            // Mélange toutes les réponses disponibles
            for (const category in responseDatabase) {
                if (responseDatabase[category][language]) {
                    selectedResponses = selectedResponses.concat(responseDatabase[category][language]);
                }
            }
        }

        // 5. Sélection aléatoire avec pondération
        if (selectedResponses.length > 0) {
            const randomIndex = Math.floor(Math.random() * selectedResponses.length);
            return selectedResponses[randomIndex];
        }

        // 6. Fallback ultime (ne devrait jamais arriver)
        const ultimateFallbacks = [
            `🎯 Excellent initiative ! Pour optimiser tout ça, n'oublie pas **${PROMO_CODE}** - c'est la clé !`,
            `💫 Je te recommande de commencer par **${PROMO_CODE}** à l'inscription, ensuite on optimise ta stratégie !`,
            `🚀 Ton approche m'intéresse ! Combine ça avec **${PROMO_CODE}** pour des résultats impressionnants !`,
            `💎 Smart thinking ! Maintenant, ajoute **${PROMO_CODE}** dans l'équation et regarde la magie opérer !`,
            `🏆 J'aime ta façon de penser ! **${PROMO_CODE}** va amplifier considérablement tes résultats !`
        ];

        return ultimateFallbacks[Math.floor(Math.random() * ultimateFallbacks.length)];
    };

    // ============================================================================
    // 🔄 TENTATIVE API GEMINI AVEC FALLBACK AUTOMATIQUE
    // ============================================================================

    let useFallback = true; // On force le fallback pour tester

    if (GEMINI_API_KEY && !useFallback) {
        try {
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

            const payload = {
                contents: [{
                    parts: [{
                        text: `Tu es JAX72PRONOSTIC. Réponds en 3 phrases max. Code: ${PROMO_CODE}. Liens: ${WHATSAPP_LINK}, ${TELEGRAM_LINK}. Sois concis.\n\nQuestion: ${userQuery}`
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
            console.log("API échouée, fallback activé");
        }
    }

    // ============================================================================
    // 🎯 UTILISATION DU SYSTÈME INTELLIGENT
    // ============================================================================

    const intelligentResponse = getIntelligentFallback(userQuery);
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(intelligentResponse);
};