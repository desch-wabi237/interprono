import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Définitions et Constantes Globales ---
const PROMO_CODE = "JAX72";
const BOT_NAME = "INTER PRONOSTIC";

// Liens affiliés et sociaux
const AFFILIATE_LINK = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb6DfduAe5VxRWAu0413";
const MELBET_LINK = "https://melbet.com";

// La route que le client va appeler
const API_ROUTE = "/api/chat"; 

// --- Reconnaissance Vocale ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'fr-FR';
}

// --- LOGIQUE D'INTÉGRATION GEMINI ---
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
                return `🚨 Erreur de connexion au service IA : ${error.message}. Code promo : **${PROMO_CODE}**.`;
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
            text: `🌙 **Bienvenue chez ${BOT_NAME}** ! 🚀\n\nJe suis votre expert en bonus betting. Utilisez le code promo **${PROMO_CODE}** pour obtenir le **BONUS MAXIMUM** sur 1xBet et Melbet. Comment puis-je vous aider ?`, 
            sender: 'bot', 
            isTyping: false 
        }
    ]);
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // --- Reconnaissance Vocale ---
    const startListening = () => {
        if (!recognition) {
            alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
            return;
        }

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Erreur reconnaissance vocale:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
        setIsListening(false);
    };

    // --- Gestion des Fichiers Images ---
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setSelectedImage(e.target.result);
                    
                    // Ajouter un message avec l'image
                    const newImageMessage = {
                        id: Date.now(),
                        text: `📸 Image importée: ${file.name}`,
                        sender: 'user',
                        isTyping: false,
                        image: e.target.result
                    };
                    setMessages(prev => [...prev, newImageMessage]);
                    
                    // Réinitialiser l'input file
                    event.target.value = '';
                };
                reader.readAsDataURL(file);
            } else {
                alert("Veuillez sélectionner un fichier image valide.");
            }
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    const formatMessageText = useCallback((text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let parts = text.split(urlRegex);
        const regexBold = /\*\*(.*?)\*\*/g;

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                const url = part.trim();
                let display = url.length > 50 ? url.substring(0, 50) + '...' : url;
                
                if (url.includes('1xbet') || url.includes('refpa58144')) {
                    display = "🎰 1xBet - Bonus Exclusif 🚀";
                } else if (url.includes('melbet')) {
                    display = "🎲 MelBet - Offre Spéciale 🏆";
                } else if (url.includes('whatsapp')) {
                    display = "💬 WhatsApp - Pronostics Gratuits";
                } else if (url.includes('telegram') || url.includes('t.me')) {
                    display = "📢 Telegram - Analyses Expert";
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
        if (!trimmedInput && !selectedImage) return;
        
        // Message texte
        if (trimmedInput) {
            const newUserMessage = { 
                id: Date.now(), 
                text: trimmedInput, 
                sender: 'user', 
                isTyping: false 
            };
            setMessages(prev => [...prev, newUserMessage]);
        }
        
        setInput('');
        setSelectedImage(null);
        
        setIsBotTyping(true);
        let botResponseText = "";

        try {
            botResponseText = await getAiResponse(trimmedInput || "L'utilisateur a partagé une image");
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

    // --- Composant d'une Bulle de Message ---
    const MessageBubble = ({ message }) => {
        const isBot = message.sender === 'bot';
        
        return (
            <div className={`message-row ${isBot ? 'bot-row' : 'user-row'}`}>
                <div 
                    className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}
                >
                    {message.image && (
                        <div className="image-container">
                            <img src={message.image} alt="Uploaded" className="uploaded-image" />
                        </div>
                    )}
                    {formatMessageText(message.text)}
                </div>
            </div>
        );
    };

    // --- Rendu de l'interface ---
    return (
        <div className="app-container">
            <style jsx="true">{`
                /* Reset et base mobile-first */
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    -webkit-tap-highlight-color: transparent;
                }

                html, body {
                    height: 100%;
                    overflow: hidden;
                }

                .app-container {
                    min-height: 100vh;
                    min-height: 100dvh;
                    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    color: #e0e0e0;
                    touch-action: manipulation;
                }
                
                .chat-card {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: rgba(18, 18, 18, 0.95);
                    backdrop-filter: blur(20px);
                    overflow: hidden;
                    position: relative;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                /* Header sombre avec accent - OPTIMISÉ MOBILE */
                .chat-header {
                    padding: 12px 16px;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 60px;
                    flex-shrink: 0;
                    position: relative;
                    overflow: hidden;
                }

                .chat-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(74, 74, 240, 0.1) 0%, transparent 50%);
                    pointer-events: none;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    min-width: 0;
                    position: relative;
                    z-index: 2;
                    gap: 10px;
                }

                .status-dot {
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    flex-shrink: 0;
                    background: linear-gradient(135deg, #4a4af0, #8b5cf6);
                    box-shadow: 0 0 10px rgba(74, 74, 240, 0.5);
                }

                .status-dot.typing {
                    animation: pulse 1.5s infinite;
                }

                .status-dot.listening {
                    background: linear-gradient(135deg, #ef4444, #f59e0b);
                    animation: pulse 0.8s infinite;
                }

                .header-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #ffffff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                    flex: 1;
                    min-width: 0;
                }

                .header-subtitle {
                    font-size: 12px;
                    font-weight: 600;
                    color: #8b5cf6;
                    background: rgba(139, 92, 246, 0.2);
                    padding: 4px 8px;
                    border-radius: 12px;
                    white-space: nowrap;
                    border: 1px solid rgba(139, 92, 246, 0.3);
                    backdrop-filter: blur(10px);
                    flex-shrink: 0;
                }

                /* Bannières sombres - OPTIMISÉ MOBILE */
                .banner-container {
                    display: flex;
                    gap: 8px;
                    padding: 12px;
                    background: rgba(26, 26, 26, 0.9);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    flex-shrink: 0;
                    backdrop-filter: blur(10px);
                }

                .bet-banner {
                    flex: 1;
                    padding: 12px 8px;
                    border-radius: 10px;
                    text-align: center;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 12px;
                    transition: all 0.3s ease;
                    min-height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .bet-banner::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transition: left 0.6s;
                }

                .bet-banner:hover::before {
                    left: 100%;
                }

                .bet-banner-1xbet {
                    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
                }

                .bet-banner-1xbet:active {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
                }

                .bet-banner-melbet {
                    background: linear-gradient(135deg, #7c2d12 0%, #9a3412 100%);
                }

                .bet-banner-melbet:active {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(124, 45, 18, 0.4);
                }

                /* Zone des messages sombre - OPTIMISÉ MOBILE */
                .messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                    -webkit-overflow-scrolling: touch;
                    min-height: 0;
                }

                .message-row {
                    display: flex;
                    margin-bottom: 12px;
                }

                .bot-row {
                    justify-content: flex-start;
                }

                .user-row {
                    justify-content: flex-end;
                }

                .message-bubble {
                    max-width: 85%;
                    padding: 14px 16px;
                    border-radius: 16px;
                    font-size: 14px;
                    line-height: 1.4;
                    word-wrap: break-word;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    position: relative;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .bot-bubble {
                    background: rgba(39, 39, 42, 0.9);
                    color: #e4e4e7;
                    border-bottom-left-radius: 6px;
                }

                .user-bubble {
                    background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
                    color: white;
                    border-bottom-right-radius: 6px;
                }

                .promo-code-bold {
                    font-weight: 700;
                    color: #8b5cf6;
                }

                .user-bubble .promo-code-bold {
                    color: #fbbf24;
                }

                .link-anchor {
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: none;
                    color: white;
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    padding: 10px 14px;
                    border-radius: 8px;
                    display: block;
                    margin: 8px 0;
                    text-align: center;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                }

                .link-anchor:active {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                }

                /* Conteneur d'image - OPTIMISÉ MOBILE */
                .image-container {
                    margin-bottom: 10px;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .uploaded-image {
                    width: 100%;
                    max-width: 250px;
                    height: auto;
                    border-radius: 10px;
                    display: block;
                }

                /* Zone de saisie sombre avec boutons - OPTIMISÉ MOBILE */
                .input-form {
                    padding: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                    background: rgba(23, 23, 23, 0.95);
                    gap: 12px;
                    flex-shrink: 0;
                    backdrop-filter: blur(10px);
                }

                .input-main-row {
                    display: flex;
                    gap: 10px;
                    align-items: flex-end;
                    width: 100%;
                }

                .input-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    min-width: 0;
                }

                .chat-input {
                    padding: 14px 16px;
                    border-radius: 12px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    background: rgba(39, 39, 42, 0.9);
                    color: #e4e4e7;
                    font-size: 16px;
                    min-height: 50px;
                    -webkit-appearance: none;
                    transition: all 0.3s ease;
                    font-weight: 500;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    width: 100%;
                }

                .chat-input:focus {
                    outline: none;
                    border-color: #8b5cf6;
                    background: rgba(39, 39, 42, 1);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
                }

                .chat-input::placeholder {
                    color: #9ca3af;
                    font-weight: 500;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    width: 100%;
                    padding: 4px 0;
                }

                .icon-button {
                    padding: 12px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(39, 39, 42, 0.9);
                    color: #9ca3af;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 44px;
                    min-height: 44px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    font-size: 16px;
                }

                .icon-button:active {
                    background: rgba(55, 55, 60, 0.9);
                    color: #e4e4e7;
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-1px);
                }

                .icon-button.recording {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.3);
                    animation: pulse 1s infinite;
                }

                .icon-button.upload {
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                    border-color: rgba(34, 197, 94, 0.3);
                }

                .chat-button {
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 16px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    border: none;
                    min-height: 50px;
                    min-width: 80px;
                    -webkit-appearance: none;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
                    border: 1px solid rgba(139, 92, 246, 0.3);
                    flex-shrink: 0;
                }

                .chat-button:active:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
                }

                .chat-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                /* Aperçu image sélectionnée */
                .image-preview {
                    margin-top: 8px;
                    padding: 10px;
                    background: rgba(39, 39, 42, 0.9);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .preview-image {
                    width: 50px;
                    height: 50px;
                    border-radius: 8px;
                    object-fit: cover;
                    flex-shrink: 0;
                }

                .preview-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-width: 0;
                }

                .preview-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #e4e4e7;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .remove-image {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 6px;
                    padding: 6px 10px;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .remove-image:active {
                    background: rgba(239, 68, 68, 0.3);
                }

                /* Typing indicator sombre */
                .typing-indicator-container {
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 12px;
                }

                .typing-indicator-dots {
                    padding: 14px 16px;
                    border-radius: 16px;
                    background: rgba(39, 39, 42, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }

                .dot {
                    height: 8px;
                    width: 8px;
                    background: linear-gradient(135deg, #8b5cf6, #a855f7);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite;
                }

                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }

                /* Animations */
                @keyframes pulse {
                    0%, 100% { 
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.7;
                        transform: scale(1.1);
                    }
                }

                @keyframes bounce {
                    0%, 80%, 100% { 
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% { 
                        transform: scale(1.1);
                        opacity: 1;
                    }
                }

                /* ===== MEDIA QUERIES POUR MOBILE ===== */
                
                /* Petits téléphones (iPhone SE, etc.) */
                @media (max-width: 360px) {
                    .chat-header {
                        padding: 10px 12px;
                        min-height: 55px;
                    }

                    .header-title {
                        font-size: 14px;
                    }

                    .header-subtitle {
                        font-size: 10px;
                        padding: 3px 6px;
                    }

                    .banner-container {
                        padding: 10px;
                        gap: 6px;
                    }

                    .bet-banner {
                        padding: 10px 6px;
                        font-size: 11px;
                        min-height: 40px;
                    }

                    .messages-area {
                        padding: 12px;
                        gap: 10px;
                    }

                    .message-bubble {
                        max-width: 90%;
                        padding: 12px 14px;
                        font-size: 13px;
                    }

                    .input-form {
                        padding: 12px;
                        gap: 10px;
                    }

                    .input-main-row {
                        gap: 8px;
                    }

                    .chat-input {
                        padding: 12px 14px;
                        font-size: 14px;
                        min-height: 46px;
                    }

                    .action-buttons {
                        gap: 6px;
                    }

                    .icon-button {
                        min-width: 42px;
                        min-height: 42px;
                        padding: 10px;
                        font-size: 14px;
                    }

                    .chat-button {
                        padding: 12px 16px;
                        font-size: 14px;
                        min-height: 46px;
                        min-width: 70px;
                    }

                    .uploaded-image {
                        max-width: 200px;
                    }
                }

                /* Téléphones moyens */
                @media (min-width: 361px) and (max-width: 480px) {
                    .chat-header {
                        padding: 12px 14px;
                    }

                    .header-title {
                        font-size: 15px;
                    }

                    .bet-banner {
                        font-size: 12px;
                    }

                    .message-bubble {
                        max-width: 88%;
                    }
                }

                /* Tablettes et grands téléphones */
                @media (min-width: 481px) and (max-width: 768px) {
                    .chat-header {
                        padding: 15px 20px;
                        min-height: 70px;
                    }

                    .header-title {
                        font-size: 18px;
                    }

                    .header-subtitle {
                        font-size: 13px;
                        padding: 5px 10px;
                    }

                    .banner-container {
                        padding: 15px;
                        gap: 10px;
                    }

                    .bet-banner {
                        padding: 14px 10px;
                        font-size: 13px;
                    }

                    .messages-area {
                        padding: 20px;
                    }

                    .message-bubble {
                        max-width: 80%;
                        padding: 16px 18px;
                    }

                    .input-form {
                        padding: 20px;
                    }

                    .chat-input {
                        min-height: 54px;
                    }

                    .chat-button {
                        min-height: 54px;
                    }
                }

                /* Desktop */
                @media (min-width: 769px) {
                    .app-container {
                        padding: 20px;
                    }

                    .chat-card {
                        width: 100%;
                        max-width: 900px;
                        height: 90vh;
                        border-radius: 20px;
                        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    }

                    .chat-header {
                        padding: 20px 25px;
                        min-height: 80px;
                        border-radius: 20px 20px 0 0;
                    }

                    .header-title {
                        font-size: 20px;
                    }

                    .header-subtitle {
                        font-size: 14px;
                    }

                    .banner-container {
                        padding: 20px;
                        gap: 12px;
                    }

                    .bet-banner {
                        padding: 16px 12px;
                        font-size: 14px;
                        min-height: 50px;
                    }

                    .bet-banner:hover {
                        transform: translateY(-2px);
                    }

                    .messages-area {
                        padding: 25px;
                    }

                    .message-bubble {
                        max-width: 70%;
                        padding: 18px 20px;
                        font-size: 15px;
                    }

                    .input-form {
                        padding: 20px;
                        border-radius: 0 0 20px 20px;
                    }

                    .chat-input {
                        padding: 16px 20px;
                        min-height: 56px;
                    }

                    .chat-button:hover:not(:disabled) {
                        transform: translateY(-2px);
                    }

                    .icon-button:hover {
                        background: rgba(55, 55, 60, 0.9);
                        transform: translateY(-1px);
                    }
                }

                /* Orientation paysage sur mobile */
                @media (max-height: 500px) and (orientation: landscape) {
                    .chat-header {
                        min-height: 50px;
                        padding: 8px 12px;
                    }

                    .banner-container {
                        padding: 8px 12px;
                    }

                    .bet-banner {
                        min-height: 36px;
                        padding: 8px 6px;
                        font-size: 11px;
                    }

                    .messages-area {
                        padding: 12px;
                    }

                    .input-form {
                        padding: 12px;
                    }

                    .chat-input {
                        min-height: 44px;
                        padding: 10px 14px;
                    }

                    .chat-button {
                        min-height: 44px;
                        min-width: 70px;
                        padding: 10px 16px;
                    }
                }

                /* Support iOS Safari */
                @supports (-webkit-touch-callout: none) {
                    .app-container {
                        min-height: -webkit-fill-available;
                    }
                    
                    .chat-card {
                        height: -webkit-fill-available;
                    }
                    
                    .messages-area {
                        padding-bottom: env(safe-area-inset-bottom);
                    }
                }

                /* Scrollbar sombre */
                .messages-area::-webkit-scrollbar {
                    width: 4px;
                }

                .messages-area::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 2px;
                }

                .messages-area::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6, #a855f7);
                    border-radius: 2px;
                }

                .messages-area::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #a855f7, #8b5cf6);
                }
            `}</style>

            <div className="chat-card">
                
                {/* En-tête sombre */}
                <div className="chat-header">
                    <div className="header-content">
                        <span className={`status-dot ${isListening ? 'listening' : isBotTyping ? 'typing' : 'idle'}`}></span>
                        <h1 className="header-title">
                            {BOT_NAME}
                        </h1>
                        <span className="header-subtitle">Code: {PROMO_CODE}</span>
                    </div>
                </div>

                {/* Bannières */}
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
                    
                    {/* Indicateur de saisie */}
                    {isBotTyping && (
                        <div className="typing-indicator-container">
                            <div className="typing-indicator-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Zone de Saisie avec fonctionnalités avancées */}
                <form onSubmit={handleSend} className="input-form">
                    <div className="input-main-row">
                        <div className="input-container">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="💬 Tapez votre message..."
                                disabled={isBotTyping} 
                                className="chat-input"
                            />
                            
                            {/* Aperçu de l'image sélectionnée */}
                            {selectedImage && (
                                <div className="image-preview">
                                    <img src={selectedImage} alt="Preview" className="preview-image" />
                                    <div className="preview-info">
                                        <div className="preview-name">Image sélectionnée</div>
                                        <button type="button" onClick={removeImage} className="remove-image">
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <button
                            type="submit"
                            disabled={(!input.trim() && !selectedImage) || isBotTyping} 
                            className="chat-button"
                        >
                            {isBotTyping ? '...' : '🚀'}
                        </button>
                    </div>

                    {/* Boutons d'action */}
                    <div className="action-buttons">
                        <button 
                            type="button" 
                            onClick={isListening ? stopListening : startListening}
                            className={`icon-button ${isListening ? 'recording' : ''}`}
                            disabled={isBotTyping}
                        >
                            {isListening ? '⏹️' : '🎤'}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="icon-button upload"
                            disabled={isBotTyping}
                        >
                            📸
                        </button>
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                </form>

            </div>
            
        </div>
    );
};

export default App;