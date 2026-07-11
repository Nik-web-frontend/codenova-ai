import React, { Fragment } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './chat.css'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import CodeBlock from '../components/CodeBlock'

import { FiArrowUp } from "react-icons/fi";


const Chat = () => {
    const mock = true;
    const [prompt, setPrompt] = useState('')
    const [msgs, setMsgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const replyContainerRef = useRef(null);
    const textareaRef = useRef(null);
    const lastAIReplyRef = useRef(null);


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
                    response: `
# React

React is an open-source **JavaScript library** for building user interfaces.

\`useState\`
---

## Features

- Component-Based Architecture
- Virtual DOM
- JSX Support
- One-Way Data Flow

### Installation

Run the following command:

\`\`\`bash
npm create vite@latest
\`\`\`

### Example Component

\`\`\`javascript
function App() {
    return (
        <h1>Hello, React!</h1>
    );
}

export default App;
\`\`\`

### Inline Code

Use \`useState\` to create state.

Example:

\`const [count, setCount] = useState(0)\`

### Blockquote

> React lets you build user interfaces from reusable components.

### Ordered List

1. Install Node.js
2. Create a React project
3. Run the development server

### Table

| Hook | Purpose |
|------|---------|
| useState | Manage state |
| useEffect | Side effects |
| useRef | Access DOM |

### Link

Visit the official React website:

https://react.dev

### Task List

- [x] Install React
- [x] Learn JSX
- [ ] Learn Context API

> Horizontal Line

---
# This is a H1 
## this is H2 

this is a smaple paragraph, Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, magni consequuntur atque in deleniti molestias distinctio mollitia laudantium aliquam harum vero explicabo vitae, molestiae porro voluptatum accusamus dolore autem consequatur! Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, magni consequuntur atque in deleniti molestias distinctio mollitia laudantium aliquam harum vero explicabo vitae, molestiae porro voluptatum accusamus dolore autem consequatur! 

Happy Coding 🚀
`
                }
                // console.log(data.response)
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
        }
        catch (error) {
            setMsgs((prev) => [...prev, { role: 'AI', text: error.message }])
        }
        finally {
            setLoading(false)
            textareaRef.current.style.height = "auto";
        }

    }



    useEffect(() => {
        if (lastAIReplyRef.current) {
            lastAIReplyRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [msgs]);


    return (
        <>
            <div className="prompt-container">
                <div className="reply-container" ref={replyContainerRef}>
                    <div className="reply-content">
                        {msgs.map((data, idx) => (
                            <Fragment key={idx}>
                                <div className={`msg-wrap ${data.role === 'user' ? 'user-wrap' : 'ai-wrap'} `}>

                                    {
                                        data.role === 'user' ?
                                            <p className='reply user-text'>{data.text}</p> :
                                            (
                                                <div className="reply ai-text"
                                                    ref={
                                                        data.role === "AI" && idx === msgs.length - 1
                                                            ? lastAIReplyRef
                                                            : null
                                                    }
                                                >
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code: CodeBlock
                                                        }} >{data.text}</ReactMarkdown>

                                                </div>
                                            )
                                    }
                                </div>
                            </Fragment>

                        ))}
                    </div>
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

                    <button
                        className="send-btn"
                        onClick={sendPrompt}
                        disabled={loading || !prompt.trim()}
                    >
                        <FiArrowUp size={20} />
                    </button>
                </div>

            </div>

        </>
    )
}

export default Chat