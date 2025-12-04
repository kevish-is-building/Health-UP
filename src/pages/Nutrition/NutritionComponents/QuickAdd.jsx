import { motion } from "framer-motion"

export default function QuickAdd({ items, onQuickAdd, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Snack Add</h2>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <QuickAddItem 
            key={item.id} 
            item={item} 
            index={index} 
            onClick={() => onQuickAdd(item)} 
            isLoading={isLoading}
          />
        ))}
      </div>
    </motion.div>
  )
}

function QuickAddItem({ item, index, onClick, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={isLoading ? undefined : onClick}
      className={`flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <span className="text-3xl mb-2">{item.icon}</span>
      <span className="text-sm text-gray-700">{item.name}</span>
      {item.calories && (
        <span className="text-xs text-gray-500 mt-1">{item.calories} cal</span>
      )}
    </motion.div>
  )
}