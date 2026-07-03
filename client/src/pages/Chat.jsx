import React, { Fragment } from 'react'
import './chat.css'
import { useState } from 'react'

const Chat = () => {
    const [prompt, setPrompt] = useState('')
    const [msgs, setMsgs] = useState([]);
    let [loading, setLoading] = useState(false);

    async function sendPrompt() {

        if (!prompt.trim()) {
            return;
        }

        try {
            setLoading(true);
            setMsgs((prev) => [...prev, { role: "user", text: prompt }])
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
            setMsgs((prev) => [...prev, { role: 'AI', text: data.response }])
            setPrompt('')
        }
        catch (error) {
            setMsgs((prev) => [...prev, { role: 'AI', text: error.message }])
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
                    {msgs.map((data, idx) => (
                        <Fragment key={idx}>
                            <div className={`msg-wrap ${data.role === 'user' ? 'user-wrap':'ai-wrap'}`}>
                                <p className={`reply ${data.role === 'user' ? 'user-text' : 'ai-text'}`}>{data.text}</p>
                            </div>
                        </Fragment>

                    ))}
                </div>

                {loading && (
                    <p className='reply'>Loading...</p>
                )}
                <div className="user-action">
                    <textarea placeholder='Ask Something...' value={prompt} onChange={(e) => {
                        setPrompt(e.target.value)
                    }}></textarea>

                    <button onClick={sendPrompt}
                        disabled={loading || !prompt.trim()}
                    >{loading ? "Generating..." : "send"}</button>
                </div>

            </div>

        </>
    )
}

export default Chat