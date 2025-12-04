import { motion } from "framer-motion"
import { Search, Calendar } from "lucide-react"

export default function LogMealForm({ mealForm, onChange, onSubmit, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Log Your Meal</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type <span className="text-red-500">*</span>
          </label>
          <select
            id="mealType"
            name="mealType"
            value={mealForm.mealType}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACK">Snack</option>
            <option value="PRE_WORKOUT">Pre-Workout</option>
            <option value="POST_WORKOUT">Post-Workout</option>
          </select>
        </div>

        <div>
          <label htmlFor="mealDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="mealDate"
              name="mealDate"
              value={mealForm.mealDate}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="foodItem" className="block text-sm font-medium text-gray-700 mb-1">
          Food Item <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            id="foodItem"
            name="foodItem"
            placeholder="e.g., Grilled chicken breast, Brown rice..."
            value={mealForm.foodItem}
            onChange={onChange}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label htmlFor="servingSize" className="block text-sm font-medium text-gray-700 mb-1">
            Serving Size
          </label>
          <input
            type="number"
            id="servingSize"
            name="servingSize"
            placeholder="e.g., 100"
            value={mealForm.servingSize}
            onChange={onChange}
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            value={mealForm.unit}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="grams">grams</option>
            <option value="oz">oz</option>
            <option value="cups">cups</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
            <option value="ml">ml</option>
          </select>
        </div>

        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
            Calories <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            placeholder="e.g., 250"
            value={mealForm.calories}
            onChange={onChange}
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
            Protein (g)
          </label>
          <input
            type="number"
            id="protein"
            name="protein"
            placeholder="e.g., 25"
            value={mealForm.protein}
            onChange={onChange}
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
            Carbs (g)
          </label>
          <input
            type="number"
            id="carbs"
            name="carbs"
            placeholder="e.g., 30"
            value={mealForm.carbs}
            onChange={onChange}
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
            Fat (g)
          </label>
          <input
            type="number"
            id="fat"
            name="fat"
            placeholder="e.g., 10"
            value={mealForm.fat}
            onChange={onChange}
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Any additional notes about this meal..."
          value={mealForm.notes}
          onChange={onChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-vertical"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding...' : 'Add to Log'}
      </motion.button>
    </motion.div>
  )
}
