import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "Eat colorfully.",
  "Your body is a reflection of your lifestyle.",
  "Nourish to flourish.",
  "Small steps every day.",
  "Food is fuel."
];

export const LoginScreen = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const [activeQuote, setActiveQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      navigate('/home');
    } catch (err) {
      setError(err.message || "Authentication failed. Make sure your Firebase API keys are in .env");
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (err) {
      setError("Failed to sign in. Make sure your Firebase API keys are in .env");
    }
  };

  return (
    <div className="flex bg-white min-h-screen relative w-full overflow-hidden">
      {/* Background Blobs */}
      <div className="bg-blobs opacity-60">
        <div className="blob blob-1"></div>
        <div className="blob blob-2 scale-150"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="w-full min-h-screen flex flex-col md:flex-row relative z-10 p-4 md:p-10 container mx-auto">
        
        {/* Left Side: Creative Flying Animation */}
        <div className="md:w-1/2 flex flex-col justify-center items-start pt-10 md:pt-0 shrink-0 px-4 md:px-12 relative h-[30vh] md:h-full">
            <h1 className="font-extrabold text-5xl md:text-7xl text-forest tracking-tight mb-2">NutriLens</h1>
            <p className="text-xl md:text-2xl text-forest-light font-medium mb-12">See your food.<br/>Know your body.</p>

            <div className="relative h-20 w-full overflow-hidden hidden md:block">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeQuote}
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral to-sage"
                >
                  "{quotes[activeQuote]}"
                </motion.p>
              </AnimatePresence>
            </div>
            
            {/* Playful Floating Shapes Desktop */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute bottom-20 left-10 hidden md:block w-32 h-32 border-[16px] border-sunny/30 rounded-full" />
            <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-40 right-20 hidden md:block w-16 h-16 bg-sage/40 rounded-xl rotate-12" />
        </div>

        {/* Right Side: Auth Forms */}
        <div className="md:w-1/2 flex items-center justify-center h-full flex-1">
          <div className="glass-panel w-full max-w-md p-8 md:p-10 text-center relative overflow-hidden bg-white/90">
             
             {/* Simple accent decors inside the panel */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-coral/10 rounded-bl-full z-0" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage/10 rounded-tr-full z-0" />

             <div className="relative z-10">
                 <h2 className="font-bold text-2xl text-forest mb-6">{isLogin ? "Welcome Back!" : "Start Your Journey"}</h2>
                 
                 <form onSubmit={handleAuth} className="flex flex-col gap-4 text-left mb-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 block">Email</label>
                      <input 
                        type="email" required
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-forest focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 block">Password</label>
                      <input 
                        type="password" required
                        value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-forest focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
                      />
                    </div>
                    
                    {error && <p className="text-coral text-sm mt-1 bg-coral/10 p-2 rounded-lg text-center font-medium">{error}</p>}
                    
                    <button type="submit" className="w-full py-3.5 bg-forest text-white font-bold rounded-xl shadow-lg hover:bg-forest-light hover:-translate-y-1 transition-all mt-2">
                       {isLogin ? "Sign In" : "Register Now"}
                    </button>
                 </form>

                 <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-sm text-gray-400 font-medium">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                 </div>

                 <button
                    onClick={handleGoogle}
                    type="button"
                    className="w-full py-3.5 bg-white text-forest font-bold rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </button>

                  <p className="text-sm text-gray-500 mt-8">
                     {isLogin ? "New to NutriLens?" : "Already have an account?"}
                     <button onClick={() => setIsLogin(!isLogin)} className="text-sage font-bold ml-2 hover:text-coral transition-colors">
                        {isLogin ? "Create Account" : "Sign In"}
                     </button>
                  </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
