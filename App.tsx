import React, { useState, useRef, useEffect } from 'react';
import { extractContentFromImage } from './services/geminiService';
import { AppState, ContentType, ExtractedContent, ThemeConfig, AspectRatio } from './types';
import { FileUpload } from './components/FileUpload';
import { SocialCard } from './components/SocialCard';
import { toPng } from 'html-to-image';
import { 
  Download, 
  RotateCcw, 
  Edit2, 
  Eye, 
  EyeOff, 
  Palette,
  Check,
  Layout,
  Smartphone,
  Square
} from 'lucide-react';

const THEMES: ThemeConfig[] = [
  // 1. Sunset Vibes
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    backgroundClass: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    cardBgClass: 'bg-black/20',
    textColorClass: 'text-white',
    accentColorClass: 'text-yellow-300',
    fontFamily: 'font-sans'
  },
  // 2. Ocean
  {
    id: 'ocean',
    name: 'Deep Ocean',
    backgroundClass: 'bg-gradient-to-bl from-blue-600 via-teal-500 to-emerald-600',
    cardBgClass: 'bg-white/10',
    textColorClass: 'text-white',
    accentColorClass: 'text-teal-200',
    fontFamily: 'font-sans'
  },
  // 3. Modern Dark
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    backgroundClass: 'bg-slate-900',
    cardBgClass: 'bg-slate-800/80',
    textColorClass: 'text-slate-100',
    accentColorClass: 'text-brand-400',
    fontFamily: 'font-sans'
  },
  // 4. Elegant
  {
    id: 'elegant',
    name: 'Elegant',
    backgroundClass: 'bg-[#F5E6D3]', // Beige
    cardBgClass: 'bg-white/60',
    textColorClass: 'text-stone-800',
    accentColorClass: 'text-stone-600',
    fontFamily: 'font-serif'
  },
  // 5. Retro Pop
  {
    id: 'retro-pop',
    name: 'Retro Pop',
    backgroundClass: 'bg-yellow-300',
    cardBgClass: 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    textColorClass: 'text-black',
    accentColorClass: 'text-pink-500',
    fontFamily: 'font-sans'
  },
  // 6. Forest
  {
    id: 'forest',
    name: 'Deep Forest',
    backgroundClass: 'bg-gradient-to-tr from-green-900 to-emerald-800',
    cardBgClass: 'bg-white/10 border-white/10',
    textColorClass: 'text-emerald-50',
    accentColorClass: 'text-emerald-300',
    fontFamily: 'font-serif'
  },
  // 7. Cyberpunk
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    backgroundClass: 'bg-zinc-950',
    cardBgClass: 'bg-zinc-900/90 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]',
    textColorClass: 'text-cyan-400',
    accentColorClass: 'text-pink-500',
    fontFamily: 'font-sans'
  },
  // 8. Luxury
  {
    id: 'luxury',
    name: 'Luxury Gold',
    backgroundClass: 'bg-neutral-900',
    cardBgClass: 'bg-black/40 border border-yellow-600/40',
    textColorClass: 'text-yellow-50',
    accentColorClass: 'text-yellow-500',
    fontFamily: 'font-serif'
  },
  // 9. Blueprint
  {
    id: 'blueprint',
    name: 'Blueprint',
    backgroundClass: 'bg-blue-700',
    cardBgClass: 'bg-blue-600/50 border-2 border-white/30 border-dashed',
    textColorClass: 'text-white',
    accentColorClass: 'text-blue-200',
    fontFamily: 'font-mono'
  },
  // 10. Coffee
  {
    id: 'coffee',
    name: 'Coffee Break',
    backgroundClass: 'bg-[#D7CCC8]',
    cardBgClass: 'bg-white shadow-lg',
    textColorClass: 'text-amber-900',
    accentColorClass: 'text-amber-600',
    fontFamily: 'font-serif'
  },
  // 11. Minimalist
  {
    id: 'minimalist',
    name: 'Minimalist',
    backgroundClass: 'bg-gray-100',
    cardBgClass: 'bg-white border border-gray-200',
    textColorClass: 'text-gray-900',
    accentColorClass: 'text-gray-500',
    fontFamily: 'font-sans'
  },
  // 12. Night Sky
  {
    id: 'night-sky',
    name: 'Night Sky',
    backgroundClass: 'bg-gradient-to-b from-indigo-950 via-purple-950 to-black',
    cardBgClass: 'bg-white/5 border border-white/10',
    textColorClass: 'text-indigo-100',
    accentColorClass: 'text-purple-300',
    fontFamily: 'font-serif'
  },
  // 13. Pastel Dream
  {
    id: 'pastel',
    name: 'Pastel Dream',
    backgroundClass: 'bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200',
    cardBgClass: 'bg-white/70 backdrop-blur-xl',
    textColorClass: 'text-gray-700',
    accentColorClass: 'text-purple-500',
    fontFamily: 'font-sans'
  },
  // 14. Neon Nights
  {
    id: 'neon',
    name: 'Neon Nights',
    backgroundClass: 'bg-black',
    cardBgClass: 'bg-black border-2 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]',
    textColorClass: 'text-green-400',
    accentColorClass: 'text-white',
    fontFamily: 'font-mono'
  },
  // 15. Vintage Paper
  {
    id: 'vintage',
    name: 'Vintage Paper',
    backgroundClass: 'bg-[#f0e6d2]',
    cardBgClass: 'bg-[#fdfbf7] shadow-md border border-[#e8dcc5]',
    textColorClass: 'text-warm-gray-900',
    accentColorClass: 'text-red-800',
    fontFamily: 'font-serif'
  },
  // 16. Ruby Red
  {
    id: 'ruby',
    name: 'Ruby Red',
    backgroundClass: 'bg-gradient-to-br from-red-900 to-red-700',
    cardBgClass: 'bg-black/30 border-t border-red-500/30',
    textColorClass: 'text-red-50',
    accentColorClass: 'text-red-300',
    fontFamily: 'font-serif'
  },
  // 17. Royal Purple
  {
    id: 'royal',
    name: 'Royal Purple',
    backgroundClass: 'bg-purple-900',
    cardBgClass: 'bg-indigo-950/80 border border-yellow-500/30',
    textColorClass: 'text-purple-50',
    accentColorClass: 'text-yellow-400',
    fontFamily: 'font-serif'
  },
  // 18. Slate Orange
  {
    id: 'slate-orange',
    name: 'Slate & Orange',
    backgroundClass: 'bg-slate-800',
    cardBgClass: 'bg-slate-700 border-l-4 border-orange-500',
    textColorClass: 'text-white',
    accentColorClass: 'text-orange-500',
    fontFamily: 'font-sans'
  },
  // 19. Minty
  {
    id: 'minty',
    name: 'Minty Fresh',
    backgroundClass: 'bg-emerald-100',
    cardBgClass: 'bg-white border-2 border-emerald-200',
    textColorClass: 'text-emerald-900',
    accentColorClass: 'text-emerald-500',
    fontFamily: 'font-sans'
  },
  // 20. Monochrome
  {
    id: 'monochrome',
    name: 'Monochrome',
    backgroundClass: 'bg-white',
    cardBgClass: 'bg-black text-white',
    textColorClass: 'text-white',
    accentColorClass: 'text-gray-400',
    fontFamily: 'font-sans'
  },
  // 21. Chocolate
  {
    id: 'chocolate',
    name: 'Chocolate',
    backgroundClass: 'bg-gradient-to-tr from-[#3E2723] to-[#5D4037]',
    cardBgClass: 'bg-[#FFF8E1]/10 border border-[#FFF8E1]/20',
    textColorClass: 'text-[#FFF8E1]',
    accentColorClass: 'text-orange-200',
    fontFamily: 'font-serif'
  },
  // 22. Bubblegum
  {
    id: 'bubblegum',
    name: 'Bubblegum',
    backgroundClass: 'bg-pink-500',
    cardBgClass: 'bg-white/90 border-4 border-pink-300',
    textColorClass: 'text-pink-600',
    accentColorClass: 'text-pink-400',
    fontFamily: 'font-sans'
  },
  // 23. Terminal
  {
    id: 'terminal',
    name: 'Terminal',
    backgroundClass: 'bg-[#1a1b26]',
    cardBgClass: 'bg-[#24283b] border border-[#414868]',
    textColorClass: 'text-[#7aa2f7]',
    accentColorClass: 'text-[#9ece6a]',
    fontFamily: 'font-mono'
  },
  // 24. Abstract
  {
    id: 'abstract',
    name: 'Abstract Art',
    backgroundClass: 'bg-gradient-to-r from-violet-600 to-indigo-600',
    cardBgClass: 'bg-white/10 backdrop-blur-md border border-white/20',
    textColorClass: 'text-white',
    accentColorClass: 'text-yellow-400',
    fontFamily: 'font-sans'
  }
];

const INITIAL_CONTENT: ExtractedContent = {
  type: ContentType.OTHER,
  text: "Upload a file to get started!"
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent>(INITIAL_CONTENT);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(THEMES[0]);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('portrait');
  const [showAnswer, setShowAnswer] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Ref for the card to enable downloading
  const cardRef = useRef<HTMLDivElement>(null);

  // Load fonts manually to avoid CORS issues with html-to-image
  useEffect(() => {
    const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,600&family=Space+Mono:wght@400;700&display=swap';
    
    // Check if style already exists to avoid duplicates
    if (document.getElementById('google-fonts-inline')) return;

    fetch(fontUrl)
      .then(res => res.text())
      .then(css => {
        const style = document.createElement('style');
        style.id = 'google-fonts-inline';
        style.textContent = css;
        document.head.appendChild(style);
      })
      .catch(err => console.error('Failed to load fonts:', err));
  }, []);

  const handleFileSelect = async (base64: string, mimeType: string) => {
    setAppState(AppState.PROCESSING);
    setErrorMsg(null);
    try {
      const content = await extractContentFromImage(base64, mimeType);
      setExtractedContent(content);
      setAppState(AppState.EDITING);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      setAppState(AppState.ERROR);
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `encuestamano-${selectedRatio}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Download failed', err);
        setErrorMsg("Could not download image. Try taking a screenshot!");
      }
    }
  };

  const handleUpdateContent = (field: keyof ExtractedContent, value: any) => {
    setExtractedContent(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setExtractedContent(INITIAL_CONTENT);
    setShowAnswer(false);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-purple-500 rounded-lg shadow-sm"></div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Encuestamano</h1>
          </div>
          {appState !== AppState.IDLE && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-8 flex flex-col">
        
        {appState === AppState.ERROR && (
           <div className="max-w-xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
             <div className="text-red-500 mt-0.5">⚠️</div>
             <div>
               <h3 className="text-sm font-bold text-red-800">Error Processing File</h3>
               <p className="text-sm text-red-700">{errorMsg || "Unknown error occurred"}</p>
               <button 
                onClick={() => setAppState(AppState.IDLE)} 
                className="mt-2 text-xs font-semibold text-red-800 underline"
               >
                 Try Again
               </button>
             </div>
           </div>
        )}

        {/* Upload State */}
        {(appState === AppState.IDLE || appState === AppState.PROCESSING) && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8 max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Turn Handwriting into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">Viral Posts</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Upload a photo of your study notes, trivia questions, or handwritten quotes. 
                We'll digitize them into stunning social media cards instantly.
              </p>

              {/* Aspect Ratio Selector (Only visible when IDLE) */}
              {!isLoading(appState) && (
                <div className="flex flex-col items-center gap-3 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Format</span>
                  <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                    <RatioButton 
                      label="Square" 
                      value="square" 
                      current={selectedRatio} 
                      onClick={setSelectedRatio} 
                      icon={<Square className="w-4 h-4" />}
                    />
                    <RatioButton 
                      label="Portrait" 
                      value="portrait" 
                      current={selectedRatio} 
                      onClick={setSelectedRatio} 
                      icon={<Layout className="w-4 h-4" />}
                    />
                    <RatioButton 
                      label="Story" 
                      value="story" 
                      current={selectedRatio} 
                      onClick={setSelectedRatio} 
                      icon={<Smartphone className="w-4 h-4" />}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isLoading={isLoading(appState)} 
            />
          </div>
        )}

        {/* Editor & Preview State */}
        {appState === AppState.EDITING && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in slide-in-from-bottom-8 duration-700 flex-1">
            
            {/* Left Column: Editor & Controls */}
            <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
              
              {/* Content Editor */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-xs font-bold tracking-wider">
                  <Edit2 className="w-4 h-4" /> Content Editor
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <label className="block text-sm font-semibold text-slate-700">
                        {extractedContent.type === ContentType.QUOTE ? 'Quote Text' : 'Question / Headline'}
                      </label>
                      <span className="text-xs text-slate-400 font-normal">One per line</span>
                    </div>
                    <textarea 
                      value={extractedContent.question || extractedContent.text || ''}
                      onChange={(e) => handleUpdateContent(extractedContent.type === ContentType.QUOTE ? 'text' : 'question', e.target.value)}
                      className="w-full min-h-[80px] p-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-y"
                    />
                  </div>

                  {(extractedContent.type === ContentType.TRIVIA || extractedContent.options) && (
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <label className="block text-sm font-semibold text-slate-700">Options</label>
                        <span className="text-xs text-slate-400 font-normal">One per line</span>
                      </div>
                      <textarea 
                        value={extractedContent.options?.join('\n') || ''}
                        onChange={(e) => handleUpdateContent('options', e.target.value.split('\n'))}
                        className="w-full min-h-[100px] p-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                      />
                    </div>
                  )}

                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      {extractedContent.type === ContentType.QUOTE ? 'Author' : 'Correct Answer'}
                    </label>
                    <input 
                      type="text"
                      value={extractedContent.author || extractedContent.correctAnswer || ''}
                      onChange={(e) => handleUpdateContent(extractedContent.type === ContentType.QUOTE ? 'author' : 'correctAnswer', e.target.value)}
                      className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-xs font-bold tracking-wider">
                  <Palette className="w-4 h-4" /> Visual Style
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`
                        relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                        ${selectedTheme.id === theme.id ? 'border-brand-500 bg-brand-50' : 'border-transparent hover:bg-slate-50'}
                      `}
                    >
                      <div className={`w-8 h-8 rounded-full shadow-sm flex-shrink-0 ${theme.backgroundClass} border border-black/10`}></div>
                      <span className={`text-sm font-medium ${selectedTheme.id === theme.id ? 'text-brand-900' : 'text-slate-600'}`}>
                        {theme.name}
                      </span>
                      {selectedTheme.id === theme.id && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-600">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-7 order-1 lg:order-2 sticky top-24 self-start">
              <div className="bg-slate-100 rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-center gap-8 border border-slate-200/50 shadow-inner min-h-[500px]">
                
                <div className="w-full flex justify-between gap-2">
                   {/* Aspect Ratio Toggle (Also in editor view for quick switch) */}
                   <div className="flex bg-white p-1 rounded-lg shadow-sm">
                      <button onClick={() => setSelectedRatio('square')} className={`p-2 rounded-md ${selectedRatio === 'square' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}><Square className="w-4 h-4" /></button>
                      <button onClick={() => setSelectedRatio('portrait')} className={`p-2 rounded-md ${selectedRatio === 'portrait' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}><Layout className="w-4 h-4" /></button>
                      <button onClick={() => setSelectedRatio('story')} className={`p-2 rounded-md ${selectedRatio === 'story' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}><Smartphone className="w-4 h-4" /></button>
                   </div>

                   <button 
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
                   >
                     {showAnswer ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                     {showAnswer ? 'Hide Answer' : 'Show Answer'}
                   </button>
                </div>

                <div className="relative shadow-2xl rounded-sm overflow-hidden transform transition-transform hover:scale-[1.01] duration-500 w-full flex justify-center">
                   <SocialCard 
                    ref={cardRef} 
                    content={extractedContent} 
                    theme={selectedTheme} 
                    showCorrectAnswer={showAnswer}
                    aspectRatio={selectedRatio}
                  />
                </div>

                <button 
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer Credit */}
      <footer className="py-6 text-center text-slate-400 text-sm font-medium border-t border-slate-100">
        <p>Creado por Felipe Martínez Y.</p>
      </footer>
    </div>
  );
}

function isLoading(state: AppState) {
  return state === AppState.PROCESSING;
}

const RatioButton = ({ label, value, current, onClick, icon }: { label: string, value: AspectRatio, current: AspectRatio, onClick: (v: AspectRatio) => void, icon: React.ReactNode }) => (
  <button
    onClick={() => onClick(value)}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
      ${current === value 
        ? 'bg-brand-500 text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-50'
      }
    `}
  >
    {icon}
    {label}
  </button>
);