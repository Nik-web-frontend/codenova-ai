import React, { Fragment } from 'react'
import ReactMarkdown from 'react-markdown'
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
                    response: "React is an open-source **JavaScript library** for building user interfaces (UIs) or UI components. It was developed and is maintained by Facebook (now Meta) and a community of individual developers and companies.\n\nHere's a breakdown of what that means and its core characteristics:\n\n1.  **JavaScript Library, Not a Framework:**\n    *   **Library:** React focuses specifically on the \"view\" layer of an application, meaning it's concerned with *what the user sees*. It doesn't dictate how you handle routing, data management, or other aspects of your application, though it integrates well with other libraries for those purposes.\n    *   **Framework:** A framework (like Angular) often provides a more comprehensive, opinionated structure for an entire application.\n\n2.  **Component-Based Architecture:**\n    *   This is React's most fundamental concept. You build UIs by breaking them down into small, isolated, and reusable pieces called **components**.\n    *   Think of it like building with LEGO bricks: each brick (component) has its own functionality and appearance, and you combine them to create a larger structure (your application's UI).\n    *   Examples: A button, a navigation bar, a user profile card, or an entire form can all be components.\n\n3.  **Declarative Programming:**\n    *   React encourages a declarative style of programming. Instead of telling the application *how* to update the UI step-by-step (e.g., \"find this element, remove it, create a new element, add text, then append it\"), you describe *what* you want the UI to look like based on the current state.\n    *   React then efficiently figures out the necessary changes to update the UI. This makes your code easier to read, reason about, and debug.\n\n4.  **Virtual DOM:**\n    *   To achieve its efficiency, React uses a **Virtual DOM** (Document Object Model). The DOM is a programming interface for HTML and XML documents, and directly manipulating it is often slow.\n    *   When the state of your application changes, React first creates a virtual representation of the UI in memory (the Virtual DOM). It then compares this new Virtual DOM with the previous one, calculates the minimal set of changes needed, and only then updates the *real* DOM where necessary. This process is called \"reconciliation\" and significantly boosts performance.\n\n5.  **JSX (JavaScript XML):**\n    *   React components are typically written using **JSX**, a syntax extension for JavaScript. It allows you to write HTML-like code directly within your JavaScript files.\n    *   Example: `const element = <h1>Hello, React!</h1>;`\n    *   While it looks like HTML, it's actually JavaScript under the hood and gets compiled into regular JavaScript function calls. JSX makes UI code more intuitive and keeps rendering logic and markup together.\n\n6.  **Unidirectional Data Flow (One-Way Data Binding):**\n    *   In React, data typically flows in one direction: from parent components down to child components via properties (props).\n    *   If a child component needs to communicate back up to a parent, it usually does so by calling a function passed down as a prop. This predictable data flow makes applications easier to understand and debug.\n\n**What can you use React for?**\n\n*   **Single-Page Applications (SPAs):** Websites that load a single HTML page and dynamically update content as the user interacts, providing a fluid, app-like experience (e.g., Gmail, Trello).\n*   **Complex User Interfaces:** Building interactive and dynamic UIs for large-scale web applications.\n*   **Mobile Applications (with React Native):** React Native allows you to use React's principles and JavaScript to build truly native iOS and Android mobile apps.\n*   **Desktop Applications (with Electron):** You can use React within frameworks like Electron to create cross-platform desktop applications.\n\nIn essence, React helps developers build fast, scalable, and manageable front-end web applications by breaking down the UI into reusable components and efficiently managing how those components update and display data.```js function App() { return <h1>Hello</h1>;} ```"
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

                                {
                                    data.role === 'user' ?
                                        <p className='reply user-text'>{data.text}</p> :
                                        <div className="reply ai-text">
                                            <ReactMarkdown>{data.text}</ReactMarkdown>

                                        </div>
                                }
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