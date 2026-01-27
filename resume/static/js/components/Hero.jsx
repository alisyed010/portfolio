import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const highlightedWords = ["correctness", "scale", "clarity", "from scratch"];

const heroCopy = `I don’t chase tools. I chase correctness, scale, and clarity.
AI can assist — but architecture still needs thinking.
I design full stack systems that are predictable under load,
APIs that are easy to extend, and interfaces built from scratch.
Every decision is intentional. Every abstraction justified.
This is full stack engineering — done properly.`;

const Hero = () => {
    const title = "Fullstack Engineer — Systems & Architecture";
    const lines = heroCopy.split('\n');
    const firstLine = lines[0];
    const remainingLines = lines.slice(1);

    // Typewriter effect for first line
    const [displayedText, setDisplayedText] = React.useState('');
    const [isTypingComplete, setIsTypingComplete] = React.useState(false);

    React.useEffect(() => {
        if (displayedText.length < firstLine.length) {
            const timer = setTimeout(() => {
                setDisplayedText(firstLine.slice(0, displayedText.length + 1));
            }, 22); // Optimized for 10-15% faster typewriter
            return () => clearTimeout(timer);
        } else if (displayedText.length === firstLine.length) {
            setIsTypingComplete(true);
        }
    }, [displayedText, firstLine]);

    // Container for remaining lines with stagger
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.09, // Reduced by 10%
                delayChildren: 0.3, // Reduced by ~15%
            },
        },
    };

    // Individual line animation (fade in + slide up)
    const lineVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.43, // Reduced by ~15%
                ease: "easeOut",
            },
        },
    };

    // Render with highlighted keywords
    const renderWithHighlights = (line) => {
        const parts = line.split(new RegExp(`(${highlightedWords.join('|')})`, 'gi'));
        return parts.map((part, index) => {
            if (highlightedWords.includes(part.toLowerCase())) {
                return (
                    <span key={index} className="highlight-accent">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <section className="hero-section">
            <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.58, ease: "easeOut" }} // Reduced by ~15%
            >
                {title}
            </motion.h1>

            <motion.div
                className="hero-copy"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
            >
                {/* First line with typewriter effect */}
                <motion.p className="first-line">
                    {renderWithHighlights(displayedText)}
                    {!isTypingComplete && <span className="cursor">|</span>}
                </motion.p>

                {/* Remaining lines with staggered fade-in */}
                <motion.div
                    className="remaining-copy"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    {remainingLines.map((line, index) => (
                        <motion.p key={index} variants={lineVariants}>
                            {renderWithHighlights(line)}
                        </motion.p>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
