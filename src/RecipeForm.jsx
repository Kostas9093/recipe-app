import React, { useState, useEffect } from 'react'
import IngredientSearch from './IngredientSearch'

function RecipeForm({ onSave, initialData }) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [grams, setGrams] = useState('')
  const [ingredientKey, setIngredientKey] = useState(0)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setIngredients(initialData.ingredients)
    } else {
      setName('')
      setIngredients([])
    }
  }, [initialData])

  const handleAddIngredient = () => {
    if (!selectedIngredient || !grams) return

    setIngredients(prev => [
      ...prev,
      {
        name: selectedIngredient.name,
        id: selectedIngredient.id || selectedIngredient._id || Date.now(),
        grams: parseFloat(grams),
      },
    ])

    setSelectedIngredient(null)
    setGrams('')
    setIngredientKey(prev => prev + 1) // 🔄 Force IngredientSearch remount
  }

  const handleSubmit = async () => {
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0 }

    for (let ing of ingredients) {
      try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${ing.id}.json`)
        const data = await res.json()

        const nutrients = data.product?.nutriments
        if (!nutrients) continue

        const multiplier = ing.grams / 100
        total.calories += (nutrients['energy-kcal_100g'] || 0) * multiplier
        total.protein += (nutrients.proteins_100g || 0) * multiplier
        total.carbs += (nutrients.carbohydrates_100g || 0) * multiplier
        total.fat += (nutrients.fat_100g || 0) * multiplier
      } catch (e) {
        console.warn('Ingredient fetch failed', ing.name)
      }
    }

    onSave({ name, ingredients, total })
  }

  return (
    <div className="mb-6">
      <input
        className="border p-2 w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Recipe Name"
      />

      <div className="flex gap-2 mb-2 items-center">
        <div className="flex-1">
          <IngredientSearch key={ingredientKey} onSelect={setSelectedIngredient} />
        </div>
        <input
          className="border p-2 w-24"
          value={grams}
          type="number"
          onChange={(e) => setGrams(e.target.value)}
          placeholder="Grams"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddIngredient}
        >
          Add
        </button>
      </div>

      <ul className="mb-2 list-disc pl-5 text-sm">
        {ingredients.map((ing, idx) => (
          <li key={idx}>
            {ing.grams}g of {ing.name}
          </li>
        ))}
      </ul>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Save Recipe
      </button>
    </div>
  )
}

export default RecipeForm
