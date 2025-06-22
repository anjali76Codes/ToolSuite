import React, { useState } from 'react';
import AIPalette from './AIPalette'; // Import AIPalette

const ChatWithAI = () => {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState(''); // To store the AI-generated hex codes

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;  // Don't send empty messages

        const userMessage = { sender: 'user', text: message };
        setConversation([...conversation, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAR-CYUMVkUoWiV3ld6yx6iOVE8nKMLXQo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }], // Send user message to AI model
                }),
            });

            const data = await response.json();
            const aiMessageText = data.candidates[0]?.content?.parts[0]?.text || '';

            // Extract hex codes from the AI-generated response (only hex values)
            const hexCodePattern = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
            const hexCodes = aiMessageText.match(hexCodePattern) || [];

            // If no hex codes are found, we fall back to a predefined set of colors inspired by a tropical rainforest at dawn
            let hexCodeMessage;
            if (hexCodes.length > 0) {
                hexCodeMessage = {
                    sender: 'AI',
                    text: hexCodes.join(', '),  // Join the hex codes with commas
                };
            } else {
                // Fallback hex codes based on tropical rainforest dawn imagery
                hexCodeMessage = {
                    sender: 'AI',
                    text: '#004225, #437A76, #654321, #BDB76B, #E2BADB, #FF8042', // These are representative hex codes
                };
            }

            setAiPrompt(hexCodeMessage.text); // Save only hex codes as prompt
            setConversation([...conversation, userMessage, hexCodeMessage]);

        } catch (error) {
            console.error('Error:', error);
            setConversation([...conversation, { sender: 'AI', text: 'Sorry, something went wrong. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-4 bg-white rounded-3xl shadow-lg flex flex-col gap-4">
            <div className="flex flex-col space-y-4 overflow-y-auto max-h-[400px] p-4 bg-gray-50 rounded-3xl">
            {conversation.map((msg, index) => (
    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} space-x-2`}>
        {msg.sender === 'AI' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})(,\s*#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}))*$/.test(msg.text) ? (
            // Render palette instead of plain text
            <div className="max-w-xs p-4 rounded-3xl bg-gray-200">
                <p className="font-semibold mb-2 text-sm text-gray-700">AI Generated Palette:</p>
                <div className="grid grid-cols-3 gap-2">
                    {msg.text.split(',').map((color, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div
                                className="w-12 h-12 rounded-md border shadow"
                                style={{ backgroundColor: color.trim() }}
                                title={color.trim()}
                            />
                            <span className="text-xs font-mono mt-1 text-gray-600">{color.trim()}</span>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            // Normal message bubble
            <div className={`max-w-xs px-4 py-2 rounded-3xl ${msg.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>
                <p>{msg.text}</p>
            </div>
        )}
    </div>
))}

                {loading && <p className="text-center italic text-gray-600">AI is thinking...</p>}
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Ask something..."
                    className="flex-1 p-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-purple-500 text-white rounded-3xl hover:bg-purple-600 transition-all"
                >
                    Send
                </button>
            </div>

            {/* Display AI-generated hex codes */}
            {aiPrompt && <AIPalette onApply={(colors) => console.log('Generated Colors:', colors)} prompt={aiPrompt} />}
        </div>
    );
};

export default ChatWithAI;
