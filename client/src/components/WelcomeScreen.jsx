import { useMemo } from "react";
import "./welcomeScreen.css";

const greetings = [
    "What's on your mind today?",
    "How can I help you today?",
    "What would you like to build?",
    "Need help with coding?",
    "Let's build something awesome.",
    "Ready to solve a problem?",
    "Ask me anything.",
    "What are we creating today?"
];

const WelcomeScreen = () => {

    const greeting = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * greetings.length);
        return greetings[randomIndex];
    }, []);

    return (
        <div className="welcome-screen">

            <div className="greeting-wrapper">

                <div className="blob blob1"></div>
                <div className="blob blob2"></div>
                <div className="blob blob3"></div>

                <h1 className="greeting">
                    {greeting}
                </h1>

            </div>

        </div>
    );
};

export default WelcomeScreen;