import { useNavigate } from 'react-router-dom';
import { Boxes } from './ui/background-boxes';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Hammer, Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useLoad } from '../state/LoadContext';

const Prompting = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setIsLoaded } = useLoad();
    
    // Extended list of suggestions
    const allTags = [
        "Landing Page", "Portfolio", "E-commerce", "Blog", "Dashboard",
        "Corporate Website", "Restaurant Menu", "Photography Gallery", 
        "Music Player", "Social Media App", "News Portal", "Travel Blog",
        "Fashion Store", "Tech Startup", "Real Estate", "Educational Platform",
        "Fitness Tracker", "Recipe Blog", "Art Gallery", "Event Planning",
        "Medical Clinic", "Law Firm", "Gaming Website", "Crypto Exchange",
        "Streaming Platform", "Job Board", "Wedding Planner", "Pet Care",
        "Interior Design", "Car Dealership", "Food Delivery", "Banking App",
        "Weather App", "Calendar App", "Chat Application", "Video Conference"
    ];
    
    // Creative prompts for animation
    const creativePrompts = [
        "Create a modern landing page with hero section and contact form",
        "Build a responsive portfolio with project gallery and animations",
        "Design a dark-themed dashboard with charts and data tables",
        "Make a restaurant website with menu cards and booking system",
        "Build an e-commerce product page with reviews and cart",
        "Create a blog layout with sidebar and article cards",
        "Design a music player interface with playlist controls",
        "Build a social media feed with posts and interactions",
        "Make a travel booking site with search and filters",
        "Create a fitness app dashboard with progress tracking",
        "Design a real estate listing page with property cards",
        "Build a news portal with article grid and categories",
        "Make a photography portfolio with lightbox gallery",
        "Create a corporate website with services and testimonials",
        "Design a crypto exchange interface with trading charts"
    ];
    
    // Get 5 random tags for display
    const getRandomTags = () => {
        const shuffled = [...allTags].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    };
    
    const [displayTags] = useState(() => getRandomTags());
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    
    // Animate through different prompts
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromptIndex(prev => (prev + 1) % creativePrompts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [creativePrompts.length]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleCreateClick();
        }
    };
    
    const handleCreateClick = async () => {
        if (!prompt.trim() && !selectedImage) return;
        if (isLoading) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('prompt', prompt.trim());
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generate`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const { steps, basefiles } = response.data;
            setIsLoaded(true);
            console.log('hello');
            navigate('/magic', {state: {steps, basefiles, prompt}});
            window.location.href = '/magic';
            setIsLoaded(false);
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen relative overflow-hidden font-sans">
                
            <div className="absolute inset-0 bg-black w-full h-full">
                <div className="absolute inset-0 w-full h-full bg-black z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
                <Boxes className="scale-100 transform-none" />
            </div>
            
            <motion.div 
                className="z-30 flex flex-col items-center gap-8 p-8 sm:p-10 rounded-xl backdrop-blur-md bg-white/5 border border-gray-800/80 max-w-xl w-[95%] relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                
                <div className="flex flex-col gap-2 w-full items-center">
                    <motion.p 
                        className="text-gray-300 text-sm mb-2 font-['Space_Grotesk'] tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Describe your website or upload an image for reference
                    </motion.p>
                    
                    {/* Image Upload Section */}
                    {imagePreview && (
                        <motion.div 
                            className="relative w-full mb-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative bg-black/40 border border-gray-700/70 rounded-lg p-3">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-full h-32 object-cover rounded-md"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                    
                    <div className="flex space-x-3 w-full">
                        <motion.div
                            className="relative flex-grow"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <input 
                                type="text" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full p-4 text-gray-200 bg-black/60 border border-gray-700/90 rounded-lg
                                        backdrop-blur-lg focus:border-blue-500/50 focus:outline-none focus:ring-1 
                                        focus:ring-blue-500/50 placeholder-gray-500 transition-all duration-300
                                        shadow-[0_0_15px_rgba(0,0,0,0.2)] pr-12 font-['Inter'] tracking-wide text-sm" 
                                placeholder="Enter your prompt here..." 
                            />
                            {prompt && (
                                <button 
                                    onClick={() => setPrompt('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    ×
                                </button>
                            )}
                        </motion.div>
                        
                        {/* Image Upload Button */}
                        <motion.label 
                            className="px-4 py-4 text-gray-200 bg-black/80 border border-gray-700/80
                                    rounded-lg shadow-lg hover:shadow-blue-900/2 
                                    transition-all duration-300 font-medium flex items-center justify-center
                                    min-w-[52px] aspect-square cursor-pointer"
                            whileHover={{ 
                                scale: 1.05, 
                                background: "#1f2937",
                                color: "#60a5fa"
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Upload className="w-5 h-5" />
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </motion.label>
                        
                        <motion.button 
                            className={`px-4 py-4 text-gray-200 bg-black/80 border border-gray-700/80
                                    rounded-lg shadow-lg hover:shadow-blue-900/2 
                                    transition-all duration-300 font-medium flex items-center justify-center
                                    min-w-[52px] aspect-square ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            onClick={handleCreateClick}
                            disabled={isLoading}
                            whileHover={!isLoading ? { 
                                scale: 1.05, 
                                background: "#ffffff",
                                color: "black"
                            } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Hammer className="w-5 h-5" />
                            )}
                        </motion.button>
                    </div>
                    
                    <motion.div 
                        className="flex flex-wrap gap-2 mt-4 text-xs relative w-full justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        {displayTags.map((tag, index) => (
                            <motion.span 
                                key={tag}
                                className="px-3 py-1.5 bg-gradient-to-r from-black/60 to-black/40 text-gray-400 
                                        border border-gray-800/70 rounded-full backdrop-blur-sm
                                        hover:border-blue-600/40 hover:text-blue-300 cursor-pointer 
                                        transition-all duration-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]
                                        flex items-center gap-1.5 font-['Space_Grotesk'] tracking-wide text-[11px]"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { delay: 0.8 + index * 0.1, duration: 0.4 }
                                }}
                                whileHover={{ 
                                    scale: 1.05,
                                    backgroundColor: "rgba(10, 10, 20, 0.6)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setPrompt(prev => prev ? `${prev}, ${tag}` : tag)}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/70 opacity-70"></div>
                                {tag}
                            </motion.span>
                        ))}
                        
                        <div className="mt-8 w-full">
                            <div className="w-full border-t border-gray-800/40 pt-4">
                                <motion.div 
                                    className="flex justify-center items-center text-[11px] text-gray-400 font-['Space_Grotesk'] tracking-wide"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    transition={{ delay: 1.2, duration: 0.8 }}
                                >
                                    <motion.span
                                        key={currentPromptIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center"
                                    >
                                        {creativePrompts[currentPromptIndex]}
                                    </motion.span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default Prompting;