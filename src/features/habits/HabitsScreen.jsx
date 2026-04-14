import React from 'react';
import { useData } from '../../context/DataContext';
import { Flame, CheckCircle, Circle } from 'lucide-react';
import { ProgressBar } from '../../components/common/ProgressBar';

export const HabitsScreen = () => {
    const { habits, updateHabit } = useData();

    const activeHabit = habits[0] || null;

    const toggleMicroHabit = async (habitId, microHabitId, currentCompleted) => {
        if (!activeHabit) return;
        const newMicroHabits = activeHabit.microHabits.map(m => 
            m.id === microHabitId ? { ...m, completed: !currentCompleted } : m
        );
        await updateHabit(habitId, { microHabits: newMicroHabits });
    };

    if (!activeHabit) {
        return <div className="p-6 pt-10 text-center"><p className="text-gray-500">No active habits.</p></div>
    }

    const completedDays = activeHabit.completedDays.length;
    const progress = (completedDays / 21) * 100;
    
    const allDone = activeHabit.microHabits.every(m => m.completed);

    const quotes = [
        "Small steps every day lead to big results.",
        "Your body is a reflection of your lifestyle.",
        "Consistency is more important than perfection."
    ];
    const todayQuote = quotes[new Date().getDay() % quotes.length];

    return (
        <div className="p-4 md:p-8 pt-6 min-h-screen flex flex-col pb-24 w-full max-w-4xl mx-auto">
            <h2 className="font-bold text-3xl text-forest mb-6">Habits</h2>

            <div className="glass-panel p-6 mb-8 relative overflow-hidden bg-white/60">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-bold text-sage mb-1 block">ACTIVE CHALLENGE</span>
                        <h3 className="font-bold text-xl text-forest max-w-[200px] leading-tight">{activeHabit.title}</h3>
                    </div>
                    <div className="flex flex-col items-center bg-cream p-2 rounded-xl">
                        <Flame className={activeHabit.streak > 0 ? "text-coral" : "text-gray-300"} size={28} fill={activeHabit.streak > 0 ? "currentColor" : "none"} />
                        <span className="text-[10px] font-bold text-forest mt-1">{activeHabit.streak} Days</span>
                    </div>
                </div>

                <div className="mb-2 flex justify-between text-xs text-gray-500 font-medium">
                    <span>Day {completedDays}</span>
                    <span>21 Days</span>
                </div>
                <ProgressBar progress={progress} />
            </div>

            <div className="mb-auto">
                <h3 className="font-semibold text-lg text-forest mb-4">Daily Checklist</h3>
                <div className="space-y-3">
                    {activeHabit.microHabits.map((micro) => (
                        <div 
                            key={micro.id} 
                            onClick={() => toggleMicroHabit(activeHabit.id, micro.id, micro.completed)}
                            className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors shadow-sm ${micro.completed ? 'bg-sage/10 border-sage/30' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                        >
                            {micro.completed ? (
                                <CheckCircle className="text-sage" size={24} />
                            ) : (
                                <Circle className="text-gray-300" size={24} />
                            )}
                            <span className={`font-medium text-sm ${micro.completed ? 'text-forest line-through opacity-70' : 'text-forest'}`}>
                                {micro.text}
                            </span>
                        </div>
                    ))}
                </div>
                {allDone && (
                    <div className="mt-6 text-center">
                        <div className="inline-block bg-forest text-cream px-4 py-2 rounded-full text-sm font-bold shadow-md">
                           🎉 All done for today!
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 text-center pb-6">
                <p className="text-gray-400 font-medium italic text-sm px-6">"{todayQuote}"</p>
            </div>
        </div>
    );
};
