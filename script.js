document.addEventListener('DOMContentLoaded', () => {
    const SYSTEM_PROMPT = `You are the official portfolio AI assistant for Akhil Singh. Your ONLY job is to answer questions about Akhil, his background, his skills, and his projects based strictly on the following context.

=== AKHIL'S PORTFOLIO CONTEXT ===
- Name: Akhil Singh (Akhil)
- Role: AI & Data Science Engineer, Machine Learning Engineer
- Education: B.Tech in Computer Science from Babu Banarasi Das University, Lucknow (Sep 2022 – Jun 2026). Intermediate and High School from Sun Flower Public School, Ballia, UP.
- Core Skills: Python, Machine Learning, LLMs, Groq API, SQL, FastAPI, Pandas, Streamlit, Deep Learning, Git, GitHub, RAG, TensorFlow.
- Featured Projects:
  1. Hypertension Risk Prediction: Machine learning model predicting high blood pressure with 85% accuracy using Random Forest and 5,000+ patient records (Built with Python, ML).
  2. AgenticNews Desk: Autonomous Telegram bot delivering news using Python, LangChain, Groq, LLaMA-3.3, and Tavily API.
  3. Sentiment Analysis: NLP tool analyzing text sentiment (Positive/Negative) with 90%+ accuracy.
  4. Ai-Code-Assistant: MERN stack + Gemini API collaborative team project for real-time code auditing and video communication.
  5. Voice-A.I.-Assistant (Nexus AI): Python-based hands-free desktop assistant using Gemini 2.5 Flash and Windows SAPI.
  6. AskYouTube: RAG web app turning YouTube videos into live chat streams using FastAPI, LangChain, FAISS, and Google Gemini.
- Philosophy: Values discipline (linking coding focus to gym/fitness discipline), open-source contributions, and practical real-world impact.
=================================

STRICT RULES:
1. You must ONLY answer questions related to Akhil, his portfolio, his projects, his education, and his technical skills.
2. If a user asks about anything unrelated to Akhil or his portfolio (such as general programming help, math questions, writing code for them, recipes, weather, general world knowledge, etc.), you MUST politely decline and say: "I am restricted to answering questions about Akhil's portfolio, background, and projects only! Feel free to ask me about his ML projects or tech stack."
3. Keep your answers concise, professional, and friendly.`;

    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const closeChat = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-chat');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');

    if (chatToggle && chatBox) {
        chatToggle.addEventListener('click', () => {
            chatBox.classList.toggle('hidden');
            chatInput.focus();
        });

        closeChat.addEventListener('click', () => {
            chatBox.classList.add('hidden');
        });

        const sendMessage = async () => {
            const userText = chatInput.value.trim();
            if (!userText) return;

            appendMessage(userText, 'user');
            chatInput.value = '';

            const loadingId = appendMessage("Thinking...", 'bot', true);

            try {
                const response = await fetch('/.netlify/functions/chat', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            { role: "user", content: userText }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const data = await response.json();
                const botReply = data.choices[0].message.content;
                
                document.getElementById(loadingId).remove();
                appendMessage(botReply, 'bot');

            } catch (error) {
                console.error("Error:", error);
                const loadingElement = document.getElementById(loadingId);
                if (loadingElement) loadingElement.remove();
                appendMessage(`⚠️ **Error:** Could not connect to AI assistant.`, 'bot');
            }
        };

        function appendMessage(text, sender, isLoading = false) {
            const msgDiv = document.createElement('div');
            const id = 'msg-' + Date.now();
            msgDiv.id = id;
            
            msgDiv.classList.add('p-3', 'max-w-[85%]', 'text-sm', 'shadow-sm', 'border');
            
            if (sender === 'user') {
                msgDiv.classList.add('bg-saffron/10', 'text-white', 'rounded-l-md', 'rounded-tr-md', 'border-saffron/50', 'self-end');
            } else {
                msgDiv.classList.add('bg-stone', 'text-gray-300', 'rounded-r-md', 'rounded-bl-md', 'border-saffron/20', 'self-start');
                if (isLoading) msgDiv.classList.add('animate-pulse', 'italic', 'text-gray-500');
            }
            
            const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
            msgDiv.innerHTML = formattedText;
            
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            return id;
        }

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});
