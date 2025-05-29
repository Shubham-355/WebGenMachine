"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  
  const [tileCount, setTileCount] = useState(800);

  useEffect(() => {
    const updateTileCount = () => {
      const cols = 40;
      const tileSize = window.innerWidth / cols;
      const rows = Math.ceil(window.innerHeight / tileSize);
      setTileCount(rows * cols);
    };

    updateTileCount();
    window.addEventListener("resize", updateTileCount);

    return () => {
      window.removeEventListener("resize", updateTileCount);
    };
    }, []);
  
  const letterIndices: number[] = []; 
  
  const [randomWordTiles, setRandomWordTiles] = useState<{[key: number]: {letter: string, fadeIn: boolean, delay: number}}>({});

  const aiPromptWords = [
    "PROMPT", "GEN", "AI", "CREATE", "IDEA", 
    "DESIGN", "VISUAL", "ART", "WEB", "CONTENT",
    "CODE", "UI", "UX", "THEME", "LAYOUT",
    "STYLE", "MODERN", "CLEAN", "PIXEL", "COLOR",
    "GRID", "FLOW", "FORM", "FONT", "SHAPE",
    "TEXT", "IMAGE", "ICON", "LOGO", "BRAND",
    "APP", "SITE", "PAGE", "VIEW", "MODEL",
    "DATA", "USER", "CLICK", "SCROLL", "FADE",
    "SLIDE", "ZOOM", "BLUR", "SHARP", "BOLD",
    "LIGHT", "DARK", "HERO", "CARD", "MENU"
  ];
    
  useEffect(() => {
    const showRandomWord = () => {
      const numWords = Math.floor(Math.random() * 3) + 2;
      
      for (let wordCount = 0; wordCount < numWords; wordCount++) {
        const wordPool = wordCount % 2 === 0 ? 
          aiPromptWords.filter(w => w.length <= 4) : 
          aiPromptWords;
        const word = wordPool[Math.floor(Math.random() * wordPool.length)];
        
        let attempts = 0;
        let validPosition = false;
        let startPos = 0;
        
        while (!validPosition && attempts < 30) {
          const row = Math.floor(Math.random() * 35) + 2;
          const col = Math.floor(Math.random() * (18 - word.length));
          startPos = row * 20 + col;
          
          validPosition = true;
          for (let i = 0; i < word.length; i++) {
            if (randomWordTiles[startPos + i]) {
              validPosition = false;
              break;
            }
          }
          attempts++;
        }
        
        if (!validPosition && wordCount % 2 === 0) {
          const singleChar = word[0];
          for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * 700) + 50;
            if (!randomWordTiles[randomIndex]) {
              setTimeout(() => {
                setRandomWordTiles(prev => ({
                  ...prev, 
                  [randomIndex]: { 
                    letter: singleChar, 
                    fadeIn: true,
                    delay: 0
                  }
                }));
                
                setTimeout(() => {
                  setRandomWordTiles(prev => ({
                    ...prev,
                    [randomIndex]: {
                      ...prev[randomIndex],
                      fadeIn: false
                    }
                  }));
                  
                  setTimeout(() => {
                    setRandomWordTiles(prev => {
                      const newState = {...prev};
                      delete newState[randomIndex];
                      return newState;
                    });
                  }, 500);
                }, 2000);
              }, i * 200);
            }
          }
          continue;
        }
        
        if (!validPosition) continue;
        
        setTimeout(() => {
          for (let i = 0; i < word.length; i++) {
            setTimeout(() => {
              setRandomWordTiles(prev => ({
                ...prev, 
                [startPos + i]: { 
                  letter: word[i], 
                  fadeIn: true,
                  delay: i * 250
                }
              }));
            }, i * 250);
          }
          
          setTimeout(() => {
            for (let i = word.length - 1; i >= 0; i--) {
              setTimeout(() => {
                setRandomWordTiles(prev => ({
                  ...prev,
                  [startPos + i]: {
                    ...prev[startPos + i],
                    fadeIn: false
                  }
                }));
                
                setTimeout(() => {
                  setRandomWordTiles(prev => {
                    const newState = {...prev};
                    delete newState[startPos + i];
                    return newState;
                  });
                }, 800);
              }, (word.length - 1 - i) * 250);
            }
          }, 3500 + word.length * 150);
        }, wordCount * 600);
      }
      
      for (let i = 0; i < 5; i++) {
        const randomLetter = aiPromptWords[Math.floor(Math.random() * aiPromptWords.length)][0];
        const randomIndex = Math.floor(Math.random() * 700) + 50;
        
        if (!randomWordTiles[randomIndex]) {
          setTimeout(() => {
            setRandomWordTiles(prev => ({
              ...prev, 
              [randomIndex]: { 
                letter: randomLetter, 
                fadeIn: true,
                delay: 0
              }
            }));
            
            const stayTime = Math.random() * 2500 + 1500;
            setTimeout(() => {
              setRandomWordTiles(prev => ({
                ...prev,
                [randomIndex]: {
                  ...prev[randomIndex],
                  fadeIn: false
                }
              }));
              
              setTimeout(() => {
                setRandomWordTiles(prev => {
                  const newState = {...prev};
                  delete newState[randomIndex];
                  return newState;
                });
              }, 500);
            }, stayTime);
          }, i * 500);
        }
      }
    };
    
    const interval = setInterval(showRandomWord, 6000);
    
    showRandomWord();
    
    return () => clearInterval(interval);
  }, [randomWordTiles]);
  
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-wrap h-full w-full z-0",
        className,
      )}
      {...rest}
    >
      <div className="absolute inset-0 grid grid-cols-20 md:grid-cols-30 lg:grid-cols-40 gap-0">
        {Array.from({ length: tileCount }).map((_, index) => {
          const letter = null;
          const randomTile = randomWordTiles[index];
          const isWebGenLetter = letterIndices.includes(index);
          
          return (
            <motion.div
              key={index}
              className={`relative aspect-square border border-gray-800/60 ${(letter || randomTile) ? 'font-bold text-xs flex items-center justify-center text-gray-300' : ''}`}
              animate={isWebGenLetter ? {} : {}}
              whileHover={{
                backgroundColor: "#ffffff",
                boxShadow: (letter || randomTile) ? `0 0 20px rgba(255,255,255,0.8)` : `0 0 15px rgba(255,255,255,0.5)`,
                color: (letter || randomTile) ? "#ffffff" : undefined,
                scale: (letter || randomTile) ? 1.1 : 1,
                transition: { duration: 0.2 },
              }}
            >
              {randomTile ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: randomTile.fadeIn ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: randomTile.fadeIn ? randomTile.delay / 1000 : 0 }}
                >
                  {randomTile.letter}
                </motion.span>
              ) : (
                letter || null
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
