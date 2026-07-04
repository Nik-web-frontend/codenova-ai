import React, { Fragment } from 'react'
import './chat.css'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

const Chat = () => {
    const mock = true;
    const [prompt, setPrompt] = useState('')
    const [msgs, setMsgs] = useState([]);
    let [loading, setLoading] = useState(false);
    const replyContainerRef = useRef(null);
    const textareaRef = useRef(null);

    async function sendPrompt() {

        if (!prompt.trim() || loading) {
            return;
        }

        try {
            setLoading(true);
            setMsgs((prev) => [...prev, { role: "user", text: prompt }])
            let data;
            if (mock) {
                data = {
                    response: `This is a fake response for: ${prompt}`
                }
            }
            else {
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

                data = await response.json();
            }

            setMsgs((prev) => [...prev, { role: 'AI', text: data.response }])
            setPrompt('')
            textareaRef.current.style.height = "auto";
        }
        catch (error) {
            setMsgs((prev) => [...prev, { role: 'AI', text: error.message }])
        }
        finally {
            setLoading(false)

        }

    }

    useEffect(() => {
        if (replyContainerRef.current) {
            replyContainerRef.current.scrollTop = replyContainerRef.current.scrollHeight;
        }
    }, [msgs])


    return (
        <>
            <div className="navbar">
                <h1>CodeNova AI</h1>
            </div>
            <div className="prompt-container">
                <div className="reply-container" ref={replyContainerRef}>
                    {msgs.map((data, idx) => (
                        <Fragment key={idx}>
                            <div className={`msg-wrap ${data.role === 'user' ? 'user-wrap' : 'ai-wrap'}`}>
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
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}

                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !loading) {
                                e.preventDefault();
                                sendPrompt()
                            }
                        }}

                        ref={textareaRef}
                    ></textarea>

                    <button onClick={sendPrompt}
                        disabled={loading || !prompt.trim()}
                    >{loading ? "Generating..." : "send"}</button>
                </div>

            </div>

        </>
    )
}

export default Chat