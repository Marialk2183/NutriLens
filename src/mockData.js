export const mockMeals = [
  {
    id: 'meal-1',
    foodName: 'Avocado Toast with Egg',
    calories: 350,
    protein: 14,
    carbs: 28,
    fat: 22,
    healthScore: 88,
    verdict: 'Excellent balance of healthy fats and protein.',
    tip: 'Try adding a sprinkle of seeds for extra crunch and fiber.',
    allergens: ['Egg', 'Gluten'],
    mood: '😄',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    imageBase64: ''
  },
  {
    id: 'meal-2',
    foodName: 'Grilled Chicken Salad',
    calories: 420,
    protein: 35,
    carbs: 15,
    fat: 26,
    healthScore: 92,
    verdict: 'High protein and great vegetable variety.',
    tip: 'Use olive oil and lemon as dressing to keep sugars low.',
    allergens: [],
    mood: '🙂',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    imageBase64: ''
  },
  {
    id: 'meal-3',
    foodName: 'Pepperoni Pizza Slice',
    calories: 320,
    protein: 12,
    carbs: 34,
    fat: 15,
    healthScore: 35,
    verdict: 'High in sodium and saturated fats.',
    tip: 'Pair with a side salad for some added fiber and volume.',
    allergens: ['Dairy', 'Gluten'],
    mood: '😐',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    imageBase64: ''
  },
  {
    id: 'meal-4',
    foodName: 'Berry Smoothie Bowl',
    calories: 280,
    protein: 8,
    carbs: 45,
    fat: 6,
    healthScore: 78,
    verdict: 'Fantastic antioxidant profile but a bit sugar-heavy.',
    tip: 'Add a scoop of protein powder to reduce insulin spikes.',
    allergens: [],
    mood: '😄',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    imageBase64: ''
  },
  {
    id: 'meal-5',
    foodName: 'Cheeseburger',
    calories: 550,
    protein: 24,
    carbs: 42,
    fat: 30,
    healthScore: 42,
    verdict: 'Provides protein but high in saturated fats.',
    tip: 'Swap out the standard bun for a lettuce wrap or whole grain option.',
    allergens: ['Dairy', 'Gluten', 'Soy'],
    mood: '😫',
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
    imageBase64: ''
  }
];

export const mockHabits = [
  {
    id: 'challenge-1',
    title: '21-Day Whole Food Challenge',
    streak: 5,
    completedDays: [1, 2, 3, 4, 5],
    lastChecked: Date.now() - 1000 * 60 * 60 * 2,
    microHabits: [
      { id: 'h1', text: 'Drink 1 glass of water before morning coffee', completed: true },
      { id: 'h2', text: 'Include a green vegetable at lunch', completed: true },
      { id: 'h3', text: 'Eat no refined sugar today', completed: false }
    ]
  }
];
