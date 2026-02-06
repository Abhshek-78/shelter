class NiaChatBot {
    constructor() {
        this.name = 'Nia';
        this.isOpen = false;
        this.messages = [];
        this.rules = this.initializeRules();
        this.init();
    }

    initializeRules() {
        return {
            // Greeting rules
            greeting: {
                patterns: ['hi', 'hello', 'hey', 'greetings'],
                responses: [
                    'Hello! I\'m Nia. How can I help you today?',
                    'Hi there! What can I do for you?',
                    'Greetings! How can I assist?'
                ]
            },
            // Issue/Problem rules - more specific
            issue: {
                patterns: ['problem', 'issue', 'broken', 'error', 'bug', 'not working'],
                responses: [
                    'I\'m sorry to hear that. Could you describe what\'s happening?',
                    'I\'d like to help! Can you tell me more about the issue?',
                    'What seems to be the problem? Please give me details.'
                ]
            },
            // Help/Support rules
            help: {
                patterns: ['help', 'support', 'assist', 'can you help'],
                responses: [
                    'Of course! What do you need help with?',
                    'I\'m here to help. What can I assist you with?',
                    'Sure! How can I support you?'
                ]
            },
            // Contact/Information rules
            contact: {
                patterns: ['contact us', 'reach out', 'phone', 'email', 'address'],
                responses: [
                    'You can reach us through the contact form on this page.',
                    'Email us or fill out our contact form. We\'ll respond within 24 hours.',
                    'Use the contact form above or call us during business hours.'
                ]
            },
            // Listing/Property rules
            listing: {
                patterns: ['listing', 'property', 'apartment', 'house', 'rent'],
                responses: [
                    'Interested in listings? Browse our available properties.',
                    'We have many great properties available. What are you looking for?',
                    'Check out our listings section to find your ideal property.'
                ]
            },
            // Account/Login rules
            account: {
                patterns: ['login', 'sign up', 'password', 'account', 'register'],
                responses: [
                    'You can log in or sign up using the links at the top.',
                    'Account issues? Try the login or signup pages at the top of the site.',
                    'Need to log in? Look for the login/signup links in the navigation.'
                ]
            },
            // Thank you rules
            thanks: {
                patterns: ['thanks', 'thank you', 'appreciate', 'thx'],
                responses: [
                    'You\'re welcome! Anything else I can help with?',
                    'Happy to help! Need anything else?',
                    'My pleasure! Let me know if you need more.'
                ]
            },
            // Goodbye rules
            goodbye: {
                patterns: ['bye', 'goodbye', 'farewell'],
                responses: [
                    'Goodbye! Feel free to reach out anytime.',
                    'Have a great day!',
                    'Bye! Don\'t hesitate to contact us.'
                ]
            },
            // Default rule for unmatched messages
            default: {
                patterns: [],
                responses: [
                    'I\'m not sure about that. Could you rephrase it?',
                    'Could you give me more details?',
                    'I didn\'t understand. Can you be more specific?',
                    'I don\'t have an answer for that. Could you tell me more?',
                    'Sorry, I don\'t know how to respond to that. What else can I help with?'
                ]
            }
        };
    }

    init() {
        this.createChatbotDOM();
        this.attachEventListeners();
    }

    createChatbotDOM() {
        // Create main chatbot container
        const chatbotHTML = `
            <div id="nia-chatbot-widget" class="nia-chatbot-widget">
                <div class="nia-chat-header">
                    <h4><i class="fa-solid fa-robot"></i> ${this.name}</h4>
                    <button id="nia-close-btn" class="nia-close-btn">&times;</button>
                </div>
                <div id="nia-messages-container" class="nia-messages-container">
                    <div class="nia-message bot-message">
                        <div class="message-content">Hi! I'm ${this.name}, your virtual assistant. How can I help you resolve your issue today?</div>
                    </div>
                </div>
                <div class="nia-input-area">
                    <input type="text" id="nia-user-input" class="nia-input" placeholder="Type your message..." autocomplete="off">
                    <button id="nia-send-btn" class="nia-send-btn">Send</button>
                </div>
            </div>
            <button id="nia-toggle-btn" class="nia-toggle-btn">
                <span class="nia-icon"><i class="fa-solid fa-robot"></i></span>
                <span class="nia-label">${this.name}</span>
            </button>
        `;

        // Insert into page
        const container = document.createElement('div');
        container.innerHTML = chatbotHTML;
        document.body.appendChild(container);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('nia-toggle-btn');
        const closeBtn = document.getElementById('nia-close-btn');
        const sendBtn = document.getElementById('nia-send-btn');
        const userInput = document.getElementById('nia-user-input');
        const chatbot = document.getElementById('nia-chatbot-widget');

        // Toggle chatbot
        toggleBtn.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.toggleChatbot());

        // Send message on button click
        sendBtn.addEventListener('click', () => this.handleUserMessage());

        // Send message on Enter key
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserMessage();
            }
        });

        // Auto-close when clicking outside (optional)
        document.addEventListener('click', (e) => {
            if (!chatbot.contains(e.target) && !toggleBtn.contains(e.target) && this.isOpen) {
               
            }
        });
    }

    toggleChatbot() {
        const chatbot = document.getElementById('nia-chatbot-widget');
        const toggleBtn = document.getElementById('nia-toggle-btn');

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            chatbot.classList.add('active');
            toggleBtn.classList.add('active');
            document.getElementById('nia-user-input').focus();
        } else {
            chatbot.classList.remove('active');
            toggleBtn.classList.remove('active');
        }
    }

    handleUserMessage() {
        const userInput = document.getElementById('nia-user-input');
        const userMessage = userInput.value.trim();

        if (!userMessage) return;

        // Add user message to chat
        this.addMessage(userMessage, 'user');

        // Clear input
        userInput.value = '';
        userInput.focus();

        // Get and add bot response
        setTimeout(() => {
            const botResponse = this.getBotResponse(userMessage);
            this.addMessage(botResponse, 'bot');
        }, 500); 
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('nia-messages-container');

        const messageDiv = document.createElement('div');
        messageDiv.className = `nia-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message;

        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);

        // Auto-scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message
        this.messages.push({
            text: message,
            sender: sender,
            timestamp: new Date()
        });
    }

    getBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase().trim();

        // Special commands
        if (lowerMessage === 'repeat' || lowerMessage === 'what did you say') {
            return 'Sure! Let me repeat my previous response... Could you ask your question again so I can help you better?';
        }

        if (lowerMessage === 'i don\'t know' || lowerMessage === 'dunno' || lowerMessage === 'idk') {
            return 'That\'s okay! Tell me what you need help with and I\'ll do my best to assist you.';
        }

        // Find the best matching rule with confidence score
        let bestMatch = null;
        let highestScore = 0;

        for (const [key, rule] of Object.entries(this.rules)) {
            if (key === 'default') continue;

            for (const pattern of rule.patterns) {
                const score = this.calculateMatchScore(lowerMessage, pattern.toLowerCase());
                
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = rule;
                }
            }
        }

        // Only return if confidence score is high enough (above 0.5)
        if (bestMatch && highestScore > 0.5) {
            return this.getRandomResponse(bestMatch.responses);
        }

        // Default response if no confident match
        return this.getRandomResponse(this.rules.default.responses);
    }

    calculateMatchScore(userMessage, pattern) {
        // Exact word match (highest score)
        const words = userMessage.split(/\s+/);
        if (words.includes(pattern)) {
            return 1.0;
        }

        // Partial match at the beginning or as complete phrase
        if (userMessage.startsWith(pattern) || userMessage.endsWith(pattern)) {
            return 0.9;
        }

        // Word boundary match (as a complete word within the message)
        const regex = new RegExp(`\\b${pattern}\\b`);
        if (regex.test(userMessage)) {
            return 0.8;
        }

        // Contains the pattern as substring (lowest score)
        if (userMessage.includes(pattern)) {
            return 0.4;
        }

        return 0;
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getConversationHistory() {
        return this.messages;
    }

    clearHistory() {
        this.messages = [];
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.niaChatBot = new NiaChatBot();
});
