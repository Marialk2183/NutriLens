import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { getHealthScoreColor, getHealthScoreBgColor } from '../../utils/healthScore';

export const InsightsScreen = () => {
    const { meals } = useData();

    const weekData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const now = new Date();
        const past7 = new Date(now);
        past7.setDate(now.getDate() - 6);
        past7.setHours(0,0,0,0);

        const mappedDays = [];
        for(let i=0; i<7; i++) {
            const d = new Date(past7);
            d.setDate(d.getDate() + i);
            mappedDays.push({ label: days[d.getDay()], totalGHI: 0, count: 0 });
        }

        meals.forEach(m => {
            const d = new Date(m.timestamp);
            if (d >= past7) {
                const diffTime = Math.abs(now - d);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const idx = 6 - diffDays;
                if (idx >= 0 && idx < 7) {
                    mappedDays[idx].totalGHI += m.healthScore;
                    mappedDays[idx].count += 1;
                }
            }
        });

        return mappedDays.map(d => ({
            label: d.label,
            avg: d.count > 0 ? Math.round(d.totalGHI / d.count) : 0
        }));

    }, [meals]);

    const patternAvg = useMemo(() => {
        const highEnergyMeals = meals.filter(m => m.mood === '😄' || m.mood === '🙂');
        if (highEnergyMeals.length === 0) return 0;
        const sum = highEnergyMeals.reduce((acc, m) => acc + m.healthScore, 0);
        return Math.round(sum / highEnergyMeals.length);
    }, [meals]);

    return (
        <div className="p-4 md:p-8 pt-6 min-h-screen pb-24 max-w-6xl mx-auto w-full">
            <h2 className="font-bold text-3xl text-forest mb-6">Your Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
               <div className="flex flex-col gap-8">
                    <div className={`glass-panel p-6 text-white shadow-lg ${patternAvg > 60 ? 'bg-forest border-forest-light' : 'bg-coral border-red-400'}`}>
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <span className="text-3xl">🌱</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-1">Pattern Spotted</h4>
                                <p className="text-sm opacity-90 leading-relaxed">
                                   {patternAvg > 0 
                                     ? `This week your highest energy meals averaged a positive Gut Health Index of ${patternAvg}. Keep up the great combos!`
                                     : "Log more meals with positive moods to spot patterns!"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-xl text-forest mb-4">Weekly GHI Average</h3>
                        <div className="flex items-end justify-between h-56 glass-panel bg-white/70 p-6 shadow-sm border border-white pb-4">
                            {weekData.map((d, i) => (
                                <div key={i} className="flex flex-col items-center flex-1 h-full">
                                    <div className="w-full pr-1 md:pr-2 pl-1 md:pl-2 flex-1 flex items-end justify-center">
                                        <div 
                                            className={`w-full max-w-[30px] rounded-t-sm transition-all duration-700 ease-out shadow-sm ${getHealthScoreBgColor(d.avg)}`}
                                            style={{ height: `${d.avg}%`, minHeight: d.avg > 0 ? '4px' : '0' }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 mt-3 font-semibold">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
               </div>

               <div>
                    <h3 className="font-bold text-xl text-forest mb-4">Mood-Food Timeline</h3>
                    <div className="relative pl-4 border-l-2 border-sage/30 space-y-6 ml-2 glass-panel p-6 bg-white/40">
                        {meals.length === 0 && <p className="text-gray-400 font-medium">No meals logged yet.</p>}
                        {meals.slice(0, 10).map((meal, i) => {
                            const date = new Date(meal.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
                            const time = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div key={meal.id} className="relative group cursor-pointer hover:-translate-y-0.5 transition-transform">
                                    <span className={`absolute -left-[32px] top-4 w-4 h-4 rounded-full border-[3px] border-cream shadow-sm ${getHealthScoreBgColor(meal.healthScore)}`} />
                                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white group-hover:shadow-md flex items-center justify-between ml-2">
                                        <div>
                                            <p className="font-bold text-forest truncate max-w-[180px] md:max-w-xs">{meal.foodName}</p>
                                            <p className="text-xs text-gray-400 mt-1 font-medium">{date} at {time}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl drop-shadow-sm">{meal.mood}</span>
                                            <div className="flex flex-col items-end">
                                              <span className={`text-xs font-bold text-gray-400 uppercase tracking-wide`}>GHI</span>
                                              <span className={`text-lg font-extrabold leading-none ${getHealthScoreColor(meal.healthScore)}`}>{meal.healthScore}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
               </div>
            </div>
        </div>
    );
};
