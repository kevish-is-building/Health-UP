import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { toastUtils } from "../../../lib/toastUtils";
import nutritionApi from "../../../lib/nutrition";
import Header from "./MealHeader";
import LogMealForm from "./LogMealForm";
import TodaySummary from "./TodaySummary";
import QuickAdd from "./QuickAdd";
import RecentMeals from "./RecentMeals";

export default function NutritionTracker() {
  const { user, isAuthenticated } = useAuth();
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for meal logging form
  const [mealForm, setMealForm] = useState({
    mealType: "BREAKFAST",
    mealDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    foodItem: "",
    servingSize: "",
    unit: "grams",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  });

  // State for nutrition summary
  const [nutritionSummary, setNutritionSummary] = useState({
    calories: { current: 0, target: 2100 },
    protein: { current: 0, target: 120 },
    carbs: { current: 0, target: 230 },
    fat: { current: 0, target: 70 },
  });

  // State for recent meals
  const [recentMeals, setRecentMeals] = useState([]);

  // Quick add food items from backend
  const [quickAddItems, setQuickAddItems] = useState([]);

  // Fetch nutrition data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setRecentMeals([]);
      setNutritionSummary({
        calories: { current: 0, target: 2100 },
        protein: { current: 0, target: 120 },
        carbs: { current: 0, target: 230 },
        fat: { current: 0, target: 70 },
      });
      setQuickAddItems([]);
      return;
    }

    const fetchNutritionData = async () => {
      setIsLoading(true);
      try {
        // Fetch recent meals
        const mealsResponse = await nutritionApi.getMealLogs({ limit: 10 });
        const meals = mealsResponse.items || mealsResponse.meals || mealsResponse || [];
        
        // Transform meal data for UI
        const transformedMeals = meals.map(meal => ({
          id: meal.id || meal._id,
          type: meal.mealType || meal.type,
          time: formatMealTime(meal.mealDate || meal.dateTime || meal.createdAt),
          calories: meal.calories || 0,
          items: meal.items || 1,
          icon: getMealIcon(meal.mealType || meal.type),
          foodItem: meal.foodItem
        }));
        setRecentMeals(transformedMeals);

        // Fetch daily summary
        const summaryResponse = await nutritionApi.getDailySummary();
        if (summaryResponse) {
          setNutritionSummary({
            calories: { 
              current: summaryResponse.calories?.current || summaryResponse.totalCalories || 0, 
              target: summaryResponse.calories?.target || 2100 
            },
            protein: { 
              current: summaryResponse.protein?.current || summaryResponse.totalProtein || 0, 
              target: summaryResponse.protein?.target || 120 
            },
            carbs: { 
              current: summaryResponse.carbs?.current || summaryResponse.totalCarbs || 0, 
              target: summaryResponse.carbs?.target || 230 
            },
            fat: { 
              current: summaryResponse.fat?.current || summaryResponse.totalFat || 0, 
              target: summaryResponse.fat?.target || 70 
            },
          });
        }

        // Fetch quick add presets
        const presetsResponse = await nutritionApi.getPresets();
        const presets = presetsResponse.items || presetsResponse.presets || presetsResponse || [];
        setQuickAddItems(presets.length > 0 ? presets : [
          { id: 1, name: "Coffee", icon: "☕", calories: 5, protein: 0, carbs: 0, fat: 0 },
          { id: 2, name: "Apple", icon: "🍎", calories: 95, protein: 0, carbs: 25, fat: 0 },
          { id: 3, name: "Eggs", icon: "🥚", calories: 70, protein: 6, carbs: 0, fat: 5 },
          { id: 4, name: "Rice", icon: "🍚", calories: 200, protein: 4, carbs: 45, fat: 0 },
        ]);
      } catch (error) {
        console.error('Failed to fetch nutrition data:', error);
        toastUtils.error.loadFailed('nutrition data');
        
        // Set fallback data
        setQuickAddItems([
          { id: 1, name: "Coffee", icon: "☕", calories: 5, protein: 0, carbs: 0, fat: 0 },
          { id: 2, name: "Apple", icon: "🍎", calories: 95, protein: 0, carbs: 25, fat: 0 },
          { id: 3, name: "Eggs", icon: "🥚", calories: 70, protein: 6, carbs: 0, fat: 5 },
          { id: 4, name: "Rice", icon: "🍚", calories: 200, protein: 4, carbs: 45, fat: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNutritionData();
  }, [isAuthenticated]);

  // Helper function to format meal time
  const formatMealTime = (dateTime) => {
    if (!dateTime) return 'Unknown time';
    try {
      const date = new Date(dateTime);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      if (isToday) {
        return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      } else {
        return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      }
    } catch {
      return 'Unknown time';
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealForm({
      ...mealForm,
      [name]: value,
    });
  };

  // Handle adding a meal to the log
  const handleAddMeal = async () => {
    // Validate form
    if (!mealForm.foodItem || !mealForm.calories) {
      toastUtils.error.validationError('Please fill in the food item and calories');
      return;
    }

    if (mealForm.calories <= 0) {
      toastUtils.error.validationError('Calories must be greater than 0');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare meal data for backend
      const mealData = {
        mealType: mealForm.mealType,
        mealDate: mealForm.mealDate ? new Date(mealForm.mealDate).toISOString() : new Date().toISOString(),
        foodItem: mealForm.foodItem.trim(),
        servingSize: mealForm.servingSize ? parseFloat(mealForm.servingSize) : undefined,
        unit: mealForm.unit,
        calories: parseFloat(mealForm.calories),
        protein: mealForm.protein ? parseFloat(mealForm.protein) : undefined,
        carbs: mealForm.carbs ? parseFloat(mealForm.carbs) : undefined,
        fat: mealForm.fat ? parseFloat(mealForm.fat) : undefined,
        notes: mealForm.notes ? mealForm.notes.trim() : undefined,
      };

      // Save to backend
      const savedMeal = await nutritionApi.logMeal(mealData);

      // Create meal object for UI
      const newMeal = {
        id: savedMeal.id || savedMeal._id,
        type: mealForm.mealType,
        time: formatMealTime(savedMeal.mealDate || savedMeal.dateTime || new Date()),
        calories: parseFloat(mealForm.calories),
        items: 1,
        icon: getMealIcon(mealForm.mealType),
        foodItem: mealForm.foodItem
      };

      // Add to recent meals
      setRecentMeals([newMeal, ...recentMeals]);

      // Update nutrition summary
      setNutritionSummary({
        calories: {
          ...nutritionSummary.calories,
          current: nutritionSummary.calories.current + parseFloat(mealForm.calories || 0),
        },
        protein: {
          ...nutritionSummary.protein,
          current: nutritionSummary.protein.current + parseFloat(mealForm.protein || 0),
        },
        carbs: {
          ...nutritionSummary.carbs,
          current: nutritionSummary.carbs.current + parseFloat(mealForm.carbs || 0),
        },
        fat: {
          ...nutritionSummary.fat,
          current: nutritionSummary.fat.current + parseFloat(mealForm.fat || 0),
        },
      });

      // Reset form
      setMealForm({
        mealType: "BREAKFAST",
        mealDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
        foodItem: "",
        servingSize: "",
        unit: "grams",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        notes: "",
      });

      toastUtils.success.mealLogged();
    } catch (error) {
      console.error('Failed to add meal:', error);
      toastUtils.error.saveFailed('meal');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle quick add item
  const handleQuickAdd = async (item) => {
    setIsSaving(true);
    try {
      // Use quick add API if available, otherwise use regular log meal
      let savedMeal;
      if (item.presetId) {
        savedMeal = await nutritionApi.quickAddMeal({ presetId: item.presetId || item.id });
      } else {
        // Fallback to regular meal logging
        const mealData = {
          mealType: 'SNACK',
          mealDate: new Date().toISOString(),
          foodItem: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        };
        savedMeal = await nutritionApi.logMeal(mealData);
      }

      // Create new meal object for UI
      const newMeal = {
        id: savedMeal.id || savedMeal._id || Date.now(),
        type: "SNACK",
        time: formatMealTime(savedMeal.mealDate || savedMeal.dateTime || new Date()),
        calories: item.calories,
        items: 1,
        icon: item.icon,
        foodItem: item.name
      };

      // Add to recent meals
      setRecentMeals([newMeal, ...recentMeals]);

      // Update nutrition summary
      setNutritionSummary({
        calories: {
          ...nutritionSummary.calories,
          current: nutritionSummary.calories.current + item.calories,
        },
        protein: {
          ...nutritionSummary.protein,
          current: nutritionSummary.protein.current + (item.protein || 0),
        },
        carbs: {
          ...nutritionSummary.carbs,
          current: nutritionSummary.carbs.current + (item.carbs || 0),
        },
        fat: {
          ...nutritionSummary.fat,
          current: nutritionSummary.fat.current + (item.fat || 0),
        },
      });

      toastUtils.success.mealLogged();
    } catch (error) {
      console.error('Failed to quick add meal:', error);
      toastUtils.error.saveFailed('meal');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to get icon based on meal type
  const getMealIcon = (mealType) => {
    switch (mealType) {
      case "BREAKFAST":
      case "Breakfast":
        return "☕";
      case "LUNCH":
      case "Lunch":
        return "🍴";
      case "SNACK":
      case "Snack":
        return "🍎";
      case "DINNER":
      case "Dinner":
        return "🍽️";
      case "PRE_WORKOUT":
        return "💪";
      case "POST_WORKOUT":
        return "🏋️";
      default:
        return "🍽️";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Header Component */}
      <Header onAddNewMeal={() => alert("Open add new meal modal")} />

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading nutrition data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Log Meal Form Component */}
            <LogMealForm
              mealForm={mealForm}
              onChange={handleInputChange}
              onSubmit={handleAddMeal}
              isLoading={isSaving}
            />

            {/* Recent Meals Component */}
            {!isAuthenticated ? (
              <div className="py-8 text-center text-gray-600">Please log in to view your meal history.</div>
            ) : recentMeals.length === 0 ? (
              <div className="py-8 text-center text-gray-600">No meals logged yet. Add your first meal above!</div>
            ) : (
              <RecentMeals meals={recentMeals} />
            )}
          </div>

          <div className="space-y-6">
            {/* Today's Summary Component */}
            <TodaySummary summary={nutritionSummary} />

            {/* Quick Add Component */}
            <QuickAdd items={quickAddItems} onQuickAdd={handleQuickAdd} isLoading={isSaving} />
          </div>
        </div>
      )}
    </div>
  );
}
