import React, { forwardRef } from 'react';
import { ExtractedContent, ContentType, ThemeConfig, AspectRatio } from '../types';
import { CheckCircle2, Quote } from 'lucide-react';

interface SocialCardProps {
  content: ExtractedContent;
  theme: ThemeConfig;
  showCorrectAnswer: boolean;
  aspectRatio: AspectRatio;
}

// Using forwardRef to allow the parent to capture this DOM element for image generation
export const SocialCard = forwardRef<HTMLDivElement, SocialCardProps>(({ content, theme, showCorrectAnswer, aspectRatio }, ref) => {
  
  const isTrivia = content.type === ContentType.TRIVIA;
  const isQuote = content.type === ContentType.QUOTE;
  const isQA = content.type === ContentType.QA;

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'portrait': return 'aspect-[4/5]';
      case 'story': return 'aspect-[9/16]';
      case 'square':
      default: return 'aspect-square';
    }
  };

  return (
    <div 
      ref={ref}
      className={`
        relative w-full ${getAspectRatioClass()} max-w-md mx-auto 
        flex flex-col items-center justify-center p-4 sm:p-6
        ${theme.backgroundClass} ${theme.fontFamily}
        shadow-2xl overflow-hidden select-none
      `}
    >
      {/* Decorative blurred circles for depth if supported by theme */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none mix-blend-overlay"></div>

      {/* Main Card Content Area */}
      <div className={`
        relative z-10 w-full h-full flex flex-col 
        ${theme.cardBgClass} backdrop-blur-md rounded-3xl 
        border border-white/20 shadow-xl overflow-hidden
      `}>
        
        {/* Header / Top Decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 flex-shrink-0"></div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          
          {/* QUOTE MODE */}
          {isQuote && (
            <div className="flex flex-col items-center justify-center h-full">
              <Quote className={`w-10 h-10 mb-4 opacity-80 ${theme.accentColorClass}`} />
              <p className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-6 whitespace-pre-wrap break-words ${theme.textColorClass}`}>
                "{content.text || content.question}"
              </p>
              {(content.author || content.correctAnswer) && (
                <div className="flex items-center gap-2">
                  <div className={`h-px w-6 ${theme.accentColorClass} bg-current`}></div>
                  <p className={`text-base font-medium opacity-80 ${theme.textColorClass}`}>
                    {content.author || content.correctAnswer}
                  </p>
                  <div className={`h-px w-6 ${theme.accentColorClass} bg-current`}></div>
                </div>
              )}
            </div>
          )}

          {/* TRIVIA / QA MODE */}
          {(isTrivia || isQA || content.type === ContentType.OTHER) && (
            <div className="w-full flex flex-col h-full justify-center">
              <h2 className={`text-xl sm:text-2xl font-bold leading-snug mb-4 sm:mb-6 whitespace-pre-wrap break-words ${theme.textColorClass}`}>
                {content.question || content.text}
              </h2>

              {content.options && content.options.length > 0 && (
                <div className="space-y-2 w-full">
                  {content.options.map((option, idx) => {
                    // Simple logic to try and match correct answer if string matches
                    const isCorrect = showCorrectAnswer && content.correctAnswer && 
                      (option.includes(content.correctAnswer) || content.correctAnswer.includes(option));
                    
                    return (
                      <div 
                        key={idx}
                        className={`
                          relative p-3 rounded-lg text-left transition-all
                          border 
                          ${isCorrect 
                            ? 'bg-green-500/20 border-green-500/50' 
                            : 'bg-white/10 border-white/20'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium text-sm sm:text-base leading-tight ${theme.textColorClass}`}>
                            {option}
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Show answer for QA mode or if no options exist but answer exists */}
              {isQA && showCorrectAnswer && content.correctAnswer && (
                <div className={`mt-6 p-4 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4`}>
                   <p className={`text-xs uppercase tracking-widest font-bold mb-1 opacity-70 ${theme.textColorClass}`}>Answer</p>
                   <p className={`text-lg font-bold ${theme.textColorClass}`}>{content.correctAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer padding removed to save space */}
        <div className="h-2"></div>
      </div>
    </div>
  );
});

SocialCard.displayName = 'SocialCard';