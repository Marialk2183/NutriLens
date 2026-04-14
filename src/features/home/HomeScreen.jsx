import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GHIRing } from '../../components/common/GHIRing';
import { MealCard } from '../../components/common/MealCard';
import { Plus } from 'lucide-react';

export const HomeScreen = () => {
  const { user } = useAuth();
  const { meals } = useData();
  const navigate = useNavigate();

  const todayMeals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return meals.filter(m => new Date(m.timestamp) >= today);
  }, [meals]);

  const totals = useMemo(() => {
    return todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      fiber: acc.fiber + (meal.carbs * 0.2)
    }), { calories: 0, protein: 0, fiber: 0 });
  }, [todayMeals]);

  const caps = { calories: 2000, protein: 100, fiber: 30 };
  const getProgress = (current, max) => Math.min(100, (current / max) * 100);

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto h-full flex flex-col pt-6 relative">
      <div className="hidden md:flex items-center gap-4 mb-8">
        <div>
          <p className="text-gray-500 font-medium">Good morning,</p>
          <h2 className="font-bold text-3xl text-forest">{user?.displayName?.split(' ')[0] || 'Friend'}</h2>
        </div>
      </div>

      {/* Grid wrapper for Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full pb-20">
        
        {/* Left Column (Budget Rings) */}
        <div className="md:col-span-12 lg:col-span-4">
            <div className="relative glass-panel p-6 h-full flex flex-col justify-center min-h-[220px]">
              <h3 className="font-bold text-xl text-forest mb-6">Body Budget</h3>
              <div className="flex justify-between items-end px-2">
                  <div className="flex flex-col items-center">
                      <GHIRing score={Math.round(getProgress(totals.calories, caps.calories))} size={70} />
                      <span className="text-xs font-bold text-gray-400 mt-3 pt-1">Calories</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <GHIRing score={Math.round(getProgress(totals.protein, caps.protein))} size={70} />
                      <span className="text-xs font-bold text-gray-400 mt-3 pt-1">Protein</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <GHIRing score={Math.round(getProgress(totals.fiber, caps.fiber))} size={70} />
                      <span className="text-xs font-bold text-gray-400 mt-3 pt-1">Fiber</span>
                  </div>
              </div>
            </div>
        </div>

        {/* Right Column (Meals) */}
        <div className="md:col-span-12 lg:col-span-8">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-xl text-forest">Today's Meals</h3>
               <button 
                  onClick={() => navigate('/scan')}
                  className="hidden md:flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-forest-light transition"
               >
                  <Plus size={18} /> New Meal
               </button>
            </div>
            
            {todayMeals.length === 0 ? (
              <div className="glass-panel w-full flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-16 h-16 bg-cream rounded-full mb-4 opacity-50"></div>
                  <p className="text-gray-400 font-medium italic">No meals logged today. Time to eat!</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
              >
                {todayMeals.map((meal) => (
                  <motion.div 
                    key={meal.id}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                  >
                    <MealCard meal={meal} />
                  </motion.div>
                ))}
              </motion.div>
            )}
        </div>
      </div>

      <button 
        onClick={() => navigate('/scan')}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-coral text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-30"
        aria-label="Log New Meal"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};
