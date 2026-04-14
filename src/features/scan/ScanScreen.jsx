import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeFood, compressImage } from '../../utils/gemini';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { FlipCard } from '../../components/common/FlipCard';
import { getHealthScoreColor } from '../../utils/healthScore';
import { MoodPicker } from '../../components/common/MoodPicker';

export const ScanScreen = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mood, setMood] = useState('🙂');
  const [step, setStep] = useState('capture');

  const fileInputRef = useRef(null);
  const { addMeal } = useData();
  const navigate = useNavigate();

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
          const base64 = await compressImage(file);
          setImageSrc(base64);
          await processImage(base64);
      } catch (err) {
          setError("Failed to process image");
      }
    }
  };

  const processImage = async (base64) => {
      setStep('analyze');
      setLoading(true);
      setError(null);
      try {
          const analysis = await analyzeFood(base64);
          setResult(analysis);
          setLoading(false);
      } catch (err) {
          setError("Analysis failed. Please try again.");
          setLoading(false);
          setStep('capture');
      }
  };

  const handleSave = async () => {
      if (!result) return;
      await addMeal({
          ...result,
          mood,
          imageBase64: imageSrc
      });
      navigate('/home');
  };

  return (
    <div className="min-h-full flex flex-col p-4 md:p-8 max-w-4xl mx-auto pt-6 w-full relative">
      <h2 className="font-bold text-3xl text-forest mb-6">Scan Your Meal</h2>

      {step === 'capture' && (
          <div className="flex-1 flex flex-col items-center pt-4 md:pt-10">
             <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleCapture}
             />
             
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full max-w-md md:max-w-2xl h-64 md:h-96 border-2 border-dashed border-sage/50 rounded-3xl flex flex-col items-center justify-center bg-white/50 cursor-pointer hover:bg-white/80 hover:border-sage transition-all shadow-sm"
             >
                <div className="w-20 md:w-24 h-20 md:h-24 bg-cream rounded-full flex items-center justify-center text-forest mb-6 shadow-sm">
                  <Camera size={40} className="opacity-80" />
                </div>
                <p className="font-bold text-lg text-forest mb-2">Tap to snap or upload</p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                   <ImageIcon size={16} /> From gallery or camera
                </p>
             </div>
             
             {error && <p className="text-coral mt-6 text-sm font-medium text-center bg-coral/10 p-3 rounded-lg max-w-md">{error}</p>}
          </div>
      )}

      {step === 'analyze' && loading && (
          <div className="flex-1 flex flex-col items-center justify-center pt-20">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="w-16 h-16 border-4 border-sage border-t-forest rounded-full mb-6"
             />
             <p className="font-medium text-forest animate-pulse">NutriLens is analyzing...</p>
          </div>
      )}

      {step === 'analyze' && !loading && result && (
          <div className="flex-1 flex flex-col items-center pb-10 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center w-full mb-4">
                  <h3 className="font-bold text-xl text-forest">Analysis Done!</h3>
                  <button onClick={() => setStep('capture')} className="text-gray-400 hover:text-coral transition-colors"><X size={24}/></button>
              </div>

              <div className="h-[400px] w-full mb-8 relative z-10">
                 <FlipCard 
                    className="w-full h-full"
                    front={<FrontCard imageSrc={imageSrc} result={result} />}
                    back={<BackCard result={result} />}
                 />
              </div>

              <button 
                  onClick={() => setStep('mood')}
                  className="w-full py-4 bg-forest text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all z-0"
              >
                  Looks Right - Log It
              </button>
          </div>
      )}

      {step === 'mood' && (
          <div className="flex-1 flex flex-col justify-center items-center pb-20 w-full max-w-md mx-auto">
              <h3 className="font-bold text-2xl text-forest mb-2 text-center">How did it make you feel?</h3>
              <p className="text-gray-500 mb-10 text-center">Track your mood to see nutritional patterns</p>
              
              <div className="glass-panel w-full p-8 mb-10">
                 <MoodPicker value={mood} onChange={setMood} />
              </div>

              <button 
                  onClick={handleSave}
                  className="w-full py-4 bg-sage text-forest font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all"
              >
                  Save to My Data
              </button>
          </div>
      )}
    </div>
  );
};

const FrontCard = ({ imageSrc, result }) => (
    <div className="w-full h-full bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col relative border border-gray-100">
        {imageSrc && <img src={imageSrc} className="w-full h-56 object-cover" alt="Scanned food" />}
        <div className="p-6 flex-1 flex flex-col justify-center items-center relative">
            <div className={`absolute -top-12 right-6 w-24 h-24 rounded-full shadow-2xl flex items-center justify-center bg-white border-[6px] border-white z-20`}>
                <span className={`text-3xl font-extrabold ${getHealthScoreColor(result.healthScore)}`}>{result.healthScore}</span>
            </div>
            <h4 className="font-bold text-xl text-forest w-full pr-20">{result.foodName}</h4>
            <p className="text-sm text-gray-500 font-medium w-full mt-2">Tap card for macro details</p>
        </div>
    </div>
);

const BackCard = ({ result }) => (
    <div className="w-full h-full bg-forest text-cream rounded-3xl shadow-sm p-6 flex flex-col justify-between border border-forest-light">
        <div>
            <h4 className="font-bold text-xl mb-6 text-white border-b border-white/20 pb-2">Macros</h4>
            <div className="space-y-4">
                <MacroRow label="Calories" val={result.calories} max={800} />
                <MacroRow label="Protein" val={`${result.protein}g`} max={50} raw={result.protein} />
                <MacroRow label="Carbs" val={`${result.carbs}g`} max={80} raw={result.carbs} />
                <MacroRow label="Fat" val={`${result.fat}g`} max={40} raw={result.fat} />
            </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mt-4">
            <p className="font-medium text-sm text-white/90">"{result.verdict}"</p>
            <p className="text-sm font-bold text-sage mt-3 border-t border-white/10 pt-2">💡 Tip: {result.tip}</p>
        </div>
    </div>
);

const MacroRow = ({ label, val, max, raw }) => {
    const num = typeof raw === 'number' ? raw : (typeof val === 'number' ? val : 0);
    const w = Math.min(100, (num / max) * 100);
    return (
        <div className="flex items-center gap-3">
            <span className="w-16 text-xs text-gray-300">{label}</span>
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-sage" style={{ width: `${w}%` }} />
            </div>
            <span className="w-10 text-xs font-bold text-right">{val}</span>
        </div>
    );
};
