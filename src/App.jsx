import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Définitions et Constantes Globales MISES À JOUR ---
const PROMO_CODE = "JAX72"; // NOUVEAU CODE PROMO
const BOT_NAME = "JAX72PRONOSTIC"; // Nom du Bot mis à jour
const BOT_AVATAR_URL = 'https://img.icons8.com/color/48/000000/chatbot.png'; // Optionnel : icône de bot

// Liens affiliés et sociaux (non modifiés)
const AFFILIATE_LINK = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";
const MELBET_LINK = "https://melbet.com";

// La route que le client va appeler (cette route sera gérée par la fonction Serverless)
const API_ROUTE = "/api/chat";

// --- LOGIQUE D'INTÉGRATION GEMINI (Via Proxy Serverless) ---
// (Fonction conservée, mise à jour pour utiliser le nouveau PROMO_CODE)
const getAiResponse = async (userQuery, maxRetries = 5) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(API_ROUTE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userQuery })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erreur Serverless: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();

            if (text) {
                return text;
            } else {
                throw new Error("Réponse de l'API vide ou mal formée.");
            }

        } catch (error) {
            console.error("Tentative API échouée:", error);
            if (attempt === maxRetries - 1) {
                return `🚨 Erreur de connexion au service IA : ${error.message}. Si vous êtes en local, assurez-vous que votre fonction Serverless (\`/api/chat.js\`) est lancée. Code promo : **${PROMO_CODE}**.`;
            }
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return `🚨 Erreur interne. Le service IA est temporairement indisponible. Code promo : **${PROMO_CODE}**.`;
};

// --- Composant Principal de l'Application ---
const App = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Bonjour ! Je suis ${BOT_NAME}, votre assistant personnel pour les meilleurs bonus. Mon objectif est simple : vous assurer le **BONUS MAXIMAL** sur 1xBet et Melbet grâce au code **${PROMO_CODE}**. Que puis-je faire pour vous aujourd'hui ?`,
            sender: 'bot',
            isTyping: false
        }
    ]);
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false); // État pour l'enregistrement vocal

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const formatMessageText = useCallback((text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let parts = text.split(urlRegex);
        const regexBold = /\*\*(.*?)\*\*/g;

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                const url = part.trim();
                let display = url.length > 50 ? url.substring(0, 50) + '...' : url;

                if (url.includes('1xbet') || url.includes('refpa58144')) {
                    display = "🎰 1xBet - Inscription avec Bonus Max 🚀";
                } else if (url.includes('melbet')) {
                    display = "🎲 MelBet - Plateforme de Paris Sportifs 🏆";
                } else if (url.includes('whatsapp')) {
                    display = "💬 Rejoindre notre WhatsApp";
                } else if (url.includes('telegram') || url.includes('t.me')) {
                    display = "📢 Rejoindre notre Telegram";
                }

                return (
                    <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-anchor"
                    >
                        {display}
                    </a>
                );
            }

            const textWithBold = part.split(regexBold).map((subPart, i) => {
                if (i % 2 === 1) {
                    return <strong key={i} className="promo-code-bold">{subPart}</strong>;
                }
                return subPart;
            });

            return <span key={index}>{textWithBold}</span>;
        });
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        const newUserMessage = {
            id: Date.now(),
            text: trimmedInput,
            sender: 'user',
            isTyping: false
        };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');

        setIsBotTyping(true);
        let botResponseText = "";

        try {
            botResponseText = await getAiResponse(trimmedInput);
        } catch (error) {
            console.error("Erreur de traitement:", error);
            botResponseText = "🚨 Une erreur de traitement inattendue est survenue.";
        } finally {
            setIsBotTyping(false);
        }

        setTimeout(() => {
            const newBotMessage = {
                id: Date.now() + 1,
                text: botResponseText,
                sender: 'bot',
                isTyping: false
            };
            setMessages(prev => [...prev, newBotMessage]);
        }, 300);
    };

    // --- LOGIQUE MULTIMODALE FACTICE ---

    // Gère le clic sur le bouton d'importation de fichier (Image)
    const handleFileIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Gère la sélection de fichier (Image)
    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            // L'ajout d'une image nécessite un backend compatible avec Gemini (multimodal)
            const mediaMessage = {
                id: Date.now(),
                text: `[Image : ${file.name}] Fichier prêt à être envoyé. (Implémentation multimodale requise pour l'envoi au serveur)`,
                sender: 'user',
                type: 'image',
                isTyping: false
            };
            setMessages(prev => [...prev, mediaMessage]);
            // Logique pour envoyer le fichier à l'API (à implémenter)
            // Exemple : getAiResponse("Analyser cette image", file);
        }
        // Réinitialise la valeur pour permettre l'importation du même fichier
        event.target.value = null;
    };

    // Gère l'enregistrement vocal
    const handleVoiceStart = () => {
        // Logique pour démarrer l'enregistrement (MediaRecorder API) (à implémenter)
        setIsRecording(true);
        console.log("Enregistrement vocal démarré...");
    };

    const handleVoiceStop = () => {
        // Logique pour arrêter l'enregistrement et traiter l'audio (à implémenter)
        setIsRecording(false);
        const audioMessage = {
            id: Date.now() + 2,
            text: "[Message Vocal] Enregistré. (Implémentation de l'API vocale requise pour la transcription et l'envoi)",
            sender: 'user',
            type: 'audio',
            isTyping: false
        };
        setMessages(prev => [...prev, audioMessage]);
        console.log("Enregistrement vocal arrêté et traité.");
    };

    // --- Composant d'une Bulle de Message ---
    const MessageBubble = ({ message }) => {
        const isBot = message.sender === 'bot';

        let content;
        if (message.type === 'image' || message.type === 'audio') {
            // Affichage simple des messages multimédias (à améliorer avec des aperçus/lecteurs)
            content = <span style={{ fontStyle: 'italic' }}>{formatMessageText(message.text)}</span>;
        } else {
            content = formatMessageText(message.text);
        }

        return (
            <div className={`message-row ${isBot ? 'bot-row' : 'user-row'}`}>
                {isBot && (
                    <img src={BOT_AVATAR_URL} alt="Bot Avatar" className="avatar bot-avatar" />
                )}
                <div
                    className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}
                >
                    {content}
                </div>
                {!isBot && (
                    <div className="avatar user-avatar">
                        <span style={{ fontSize: '1.2rem' }}>👤</span>
                    </div>
                )}
            </div>
        );
    };

    // --- Rendu de l'interface ---
    return (
        <div className="app-container">
            <style jsx="true">{`
                /* Reset et base mobile-first - THÈME SOMBRE NOUVEAU */
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .app-container {
                    min-height: 100vh;
                    min-height: 100dvh;
                    background: #0d1117; /* Fond sombre très foncé (GitHub Dark) */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    /* Police non modifiée selon la demande */
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                }

                .chat-card {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #161b22; /* Conteneur de chat un peu plus clair */
                    overflow: hidden;
                    position: relative;
                }

                /* Avatar Styling */
                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin: 0 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }

                .bot-avatar {
                    background: #238636; /* Vert doux */
                    margin-right: 8px;
                    margin-left: 0;
                }

                .user-avatar {
                    background: #58a6ff; /* Bleu doux */
                    margin-left: 8px;
                    margin-right: 0;
                }

                /* Header du Chatbot - Style minimaliste et sombre */
                .chat-header {
                    padding: 15px 20px;
                    background: #161b22; /* Fond d'en-tête (identique à chat-card) */
                    border-bottom: 1px solid #30363d; /* Ligne de séparation douce */
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 60px;
                    flex-shrink: 0;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    min-width: 0;
                }

                .status-dot {
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    margin-right: 8px;
                    flex-shrink: 0;
                    background-color: #238636; /* Vert en ligne */
                    transition: background-color 0.3s;
                }

                .status-dot.typing {
                    background-color: #f6e05e; /* Jaune lors de la saisie */
                    animation: pulse 1.5s infinite;
                }

                .header-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #c9d1d9; /* Texte blanc/gris clair */
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .header-subtitle {
                    font-size: 12px;
                    font-weight: 500;
                    color: #79c0ff; /* Bleu pour le code promo */
                    background: rgba(88, 166, 255, 0.1);
                    padding: 4px 8px;
                    border-radius: 4px;
                    margin-left: 8px;
                    white-space: nowrap;
                    border: 1px solid #30363d;
                }

                /* Bannières des Partenaires - Boutons élégants */
                .banner-container {
                    display: flex;
                    gap: 10px;
                    padding: 12px 20px;
                    background: #161b22;
                    border-bottom: 1px solid #30363d;
                    flex-shrink: 0;
                }

                .bet-banner {
                    flex: 1;
                    padding: 10px 8px;
                    border-radius: 8px;
                    text-align: center;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    color: #c9d1d9;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
                }

                .bet-banner-1xbet {
                    background: #007bff; /* Bleu 1xBet */
                }

                .bet-banner-1xbet:hover {
                    background: #0069d9;
                    transform: translateY(-1px);
                }

                .bet-banner-melbet {
                    background: #ffc107; /* Jaune MelBet */
                    color: #161b22; /* Texte foncé sur jaune */
                }

                .bet-banner-melbet:hover {
                    background: #e0a800;
                    transform: translateY(-1px);
                }

                /* Zone des Messages - Propre et sombre */
                .messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    background: #161b22;
                    -webkit-overflow-scrolling: touch;
                }

                .message-row {
                    display: flex;
                    align-items: flex-end; /* Alignement du bas de la bulle avec l'avatar */
                }

                .bot-row {
                    justify-content: flex-start;
                }

                .user-row {
                    justify-content: flex-end;
                }

                .message-bubble {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px; /* Forme de bulle moderne */
                    font-size: 15px;
                    line-height: 1.4;
                    word-wrap: break-word;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
                }

                .bot-bubble {
                    background: #21262d; /* Bulle Bot Gris foncé */
                    border: 1px solid #30363d;
                    color: #c9d1d9; /* Texte clair */
                    border-bottom-left-radius: 4px; /* Coin près de l'avatar plus carré */
                }

                .user-bubble {
                    background: #58a6ff; /* Bulle Utilisateur Bleu */
                    color: #0d1117; /* Texte très foncé sur bleu */
                    border-bottom-right-radius: 4px; /* Coin près de l'avatar plus carré */
                }

                .promo-code-bold {
                    font-weight: 700;
                    color: #ffc107; /* Jaune pour mettre en évidence le code promo */
                }

                .link-anchor {
                    font-size: 14px;
                    font-weight: 600;
                    text-decoration: none;
                    color: #c9d1d9;
                    background: #238636; /* Vert pour les liens d'action */
                    padding: 8px 12px;
                    border-radius: 6px;
                    display: block;
                    margin: 8px 0;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                /* Zone de Saisie - AVEC BOUTONS MULTIMODAUX */
                .input-form {
                    padding: 15px 20px;
                    border-top: 1px solid #30363d;
                    display: flex;
                    align-items: center;
                    background: #161b22;
                    gap: 8px;
                    flex-shrink: 0;
                }

                .chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border-radius: 20px;
                    border: 1px solid #484f58;
                    background: #0d1117; /* Fond d'input très foncé */
                    color: #c9d1d9; /* Texte clair */
                    font-size: 16px;
                    min-height: 48px;
                    transition: all 0.3s ease;
                }

                .chat-input:focus {
                    outline: none;
                    border-color: #58a6ff;
                    box-shadow: 0 0 0 1px #58a6ff;
                }

                .chat-input::placeholder {
                    color: #8b949e;
                }

                /* Boutons d'action */
                .action-button {
                    background: none;
                    border: none;
                    color: #8b949e;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 50%;
                    transition: all 0.2s;
                    font-size: 20px;
                    line-height: 1;
                    flex-shrink: 0;
                }

                .action-button:hover {
                    color: #c9d1d9;
                    background: #21262d;
                }

                .action-button.send {
                    background: #238636; /* Bouton Envoyer Vert */
                    color: #fff;
                    font-size: 16px;
                    border-radius: 20px;
                    padding: 12px 18px;
                    min-height: 48px;
                    font-weight: 600;
                }

                .action-button.send:hover:not(:disabled) {
                    background: #2ea043;
                    transform: translateY(-1px);
                }

                .action-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                /* Bouton Enregistrement Vocal - Animation */
                .action-button.record.active {
                    color: #f85149; /* Rouge vif pour l'enregistrement */
                    animation: mic-pulse 1.5s infinite;
                }

                @keyframes mic-pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                /* Indicateur de saisie du bot - Simple et sobre */
                .typing-indicator-dots {
                    padding: 8px 14px;
                    border-radius: 18px;
                    background: #21262d;
                    border: 1px solid #30363d;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .dot {
                    height: 6px;
                    width: 6px;
                    background: #79c0ff; /* Bleu doux */
                    border-radius: 50%;
                    animation: bounce 1.4s infinite;
                }

                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }

                /* Media Queries pour Desktop (Conservé mais ajusté au nouveau thème) */
                @media (min-width: 769px) {
                    .app-container {
                        padding: 20px;
                        position: relative;
                    }

                    .chat-card {
                        width: 100%;
                        max-width: 700px;
                        height: 85vh;
                        border-radius: 16px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
                    }
                    
                    .chat-header {
                        padding: 20px;
                        min-height: 70px;
                        border-radius: 16px 16px 0 0;
                    }

                    .messages-area {
                        padding: 25px;
                    }

                    .message-bubble {
                        max-width: 65%;
                        font-size: 16px;
                        padding: 14px 18px;
                    }

                    .input-form {
                        padding: 20px 25px;
                        border-radius: 0 0 16px 16px;
                    }
                }
                
                /* Scrollbar personnalisée sombre */
                .messages-area::-webkit-scrollbar {
                    width: 6px;
                }

                .messages-area::-webkit-scrollbar-track {
                    background: #161b22;
                }

                .messages-area::-webkit-scrollbar-thumb {
                    background: #30363d;
                    border-radius: 3px;
                }

                .messages-area::-webkit-scrollbar-thumb:hover {
                    background: #484f58;
                }
            `}</style>

            <div className="chat-card">

                {/* En-tête du Chatbot */}
                <div className="chat-header">
                    <div className="header-content">
                        <img src={BOT_AVATAR_URL} alt="Bot Avatar" className="avatar" style={{ marginRight: '10px' }} />
                        <div>
                            <h1 className="header-title">
                                {BOT_NAME}
                            </h1>
                            <span className="header-subtitle">Code: {PROMO_CODE}</span>
                        </div>
                    </div>
                    {/* Indicateur de statut en haut pour les grands écrans */}
                    <span className={`status-dot ${isBotTyping ? 'typing' : 'idle'}`}></span>
                </div>

                {/* Bannières 1xBet et MelBet */}
                <div className="banner-container">
                    <a href={AFFILIATE_LINK} target="_blank" rel="noopener noreferrer" className="bet-banner bet-banner-1xbet">
                        🎰 1xBet
                    </a>
                    <a href={MELBET_LINK} target="_blank" rel="noopener noreferrer" className="bet-banner bet-banner-melbet">
                        🎲 MelBet
                    </a>
                </div>

                {/* Zone des Messages */}
                <div className="messages-area">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}

                    {/* Indicateur de saisie du bot */}
                    {isBotTyping && (
                        <div className="message-row bot-row">
                            <img src={BOT_AVATAR_URL} alt="Bot Avatar" className="avatar bot-avatar" />
                            <div className="typing-indicator-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Zone de Saisie - AVEC VOIX ET FICHIER */}
                <form onSubmit={handleSend} className="input-form">
                    {/* Bouton d'importation de fichier (Image) */}
                    <button
                        type="button"
                        className="action-button"
                        onClick={handleFileIconClick}
                        disabled={isBotTyping || isRecording}
                        title="Importer un fichier (Image)"
                    >
                        🖼️
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileImport}
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={isBotTyping || isRecording}
                    />

                    {/* Champ de saisie */}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isRecording ? "🎤 Enregistrement en cours..." : "💬 Tapez votre message ou utilisez la voix..."}
                        disabled={isBotTyping || isRecording}
                        className="chat-input"
                    />

                    {/* Bouton Enregistrement Vocal / Arrêt */}
                    <button
                        type="button"
                        className={`action-button record ${isRecording ? 'active' : ''}`}
                        onClick={isRecording ? handleVoiceStop : handleVoiceStart}
                        disabled={isBotTyping}
                        title={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement vocal"}
                    >
                        {isRecording ? '⏹️' : '🎤'}
                    </button>

                    {/* Bouton Envoyer */}
                    <button
                        type="submit"
                        className="action-button send"
                        disabled={!input.trim() || isBotTyping || isRecording}
                    >
                        {isBotTyping ? '...' : '🚀'}
                    </button>
                </form>

            </div>

        </div>
    );
};

export default App;