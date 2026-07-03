import React from 'react'
import './chat.css'
import { useState } from 'react'

const Chat = () => {
    const [prompt, setPrompt] = useState('')
    const [reply, setReply] = useState('');
    let [loading, setLoading] = useState(false);

    async function sendPrompt() {

        if (!prompt.trim()) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                }),
            });

            if (!response.ok) {
                throw new Error("Server error");
            }
            const data = await response.json();
            setReply(data.response)
            setPrompt('')
        }
        catch (error) {
            setReply(error.message);
        }
        finally {
            setLoading(false)

        }

    }

    return (
        <>
            <div className="navbar">
                <h1>CodeNova AI</h1>
            </div>
            <div className="prompt-container">
                <div className="reply-container">
                    {loading ? <p className='reply'>Loading...</p> : <p className='reply'>{reply}</p>}
                </div>

                <div className="user-action">
                    <textarea placeholder='Ask Something...' value={prompt} onChange={(e) => {
                        setPrompt(e.target.value)
                    }}></textarea>

                    <button onClick={() => {
                        sendPrompt()
                    }}
                    disabled={loading || !prompt.trim()}
                    >{loading ? "Generating..." : "send"}</button>
                </div>

            </div>

        </>
    )
}

export default Chat