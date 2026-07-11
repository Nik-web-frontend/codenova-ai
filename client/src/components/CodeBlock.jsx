import { React, useState } from 'react';
import hljs from 'highlight.js'
import './codeBlock.css'
import "highlight.js/styles/github-dark.css"
import { FiCheck, FiCopy } from 'react-icons/fi';

const languageNames = {
    js: "JavaScript",
    javascript: "JavaScript",
    py: "Python",
    python: "Python",
    cpp: "C++",
    csharp: "C#",
    ts: "TypeScript",
    bash: "Bash",
};

const CodeBlock = ({ children, className }) => {

    const [copyStatus, setCopyStatus] = useState("copy");

    if (!className) {
        return <code>{children}</code>
    }

    const lang = className.replace("language-", "")
    const result = hljs.highlight(children, {
        language: lang
    })

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(children)
            setCopyStatus("copied")

        }
        catch (error) {
            setCopyStatus('failed')
        }
        finally {
            setTimeout(() => {
                setCopyStatus("copy")
            }, 2000)
        }

    }


    return (
        <div className="code-block">
            <div className="code-header">
                <span>{languageNames[lang] || lang}</span>
                <button
                    className="copy-btn"
                    onClick={handleCopy}
                >
                    {copyStatus === "copied" ? (
                        <>
                            <FiCheck />
                            Copied
                        </>
                    ) : copyStatus === "failed" ? (
                        "Copy Failed"
                    ) : (
                        <>
                            <FiCopy />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre>
                <code
                    dangerouslySetInnerHTML={{
                        __html: result.value,
                    }}
                />
            </pre>
        </div>

    );
}

export default CodeBlock