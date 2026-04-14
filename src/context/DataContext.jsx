import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, query, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { mockMeals, mockHabits } from '../mockData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMeals([]);
      setHabits([]);
      setLoading(false);
      return;
    }

    const fetchMockDataOnce = async () => {
        let unsubscribeMeals = () => {};
        let unsubscribeHabits = () => {};

        try {
          const mealsRef = collection(db, `users/${user.uid}/meals`);
          unsubscribeMeals = onSnapshot(query(mealsRef), (snapshot) => {
            if (snapshot.empty) {
                setMeals([]);
            } else {
                const loadedMeals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.timestamp - a.timestamp);
                setMeals(loadedMeals);
            }
          }, (err) => {
             console.error("Firestore error for meals:", err);
          });

          const habitsRef = collection(db, `users/${user.uid}/habits`);
          unsubscribeHabits = onSnapshot(query(habitsRef), (snapshot) => {
             if (snapshot.empty) {
                 setHabits([]);
             } else {
                 setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
             }
          }, (err) => {
             console.error("Firestore error for habits:", err);
          });

        } catch (e) {
          console.error("Error connecting to Firestore:", e);
        }
        
        setLoading(false);

        return () => {
          unsubscribeMeals();
          unsubscribeHabits();
        };
    };

    fetchMockDataOnce();
  }, [user]);

  const addMeal = async (mealData) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/meals`), {
        ...mealData,
        timestamp: Date.now()
      });
    } catch(err) {
      console.error("Could not save to Firestore! Make sure your database is provisioned and API keys are correct.", err);
      throw err;
    }
  };

  const updateHabit = async (habitId, newData) => {
    if (!user) return;
    try {
      const habitRef = doc(db, `users/${user.uid}/habits`, habitId);
      await updateDoc(habitRef, newData);
    } catch(err) {
      console.error("Could not save habit to firestore! Make sure your database is provisioned and API keys are correct.", err);
      throw err;
    }
  };

  const value = {
    meals,
    habits,
    addMeal,
    updateHabit,
    loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
