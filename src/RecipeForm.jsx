import React, { useState, useEffect } from 'react'
import IngredientSearch from './IngredientSearch'

function RecipeForm({ onSave, initialData }) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [grams, setGrams] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setIngredients(initialData.ingredients)
    }
  }, [initialData])

  const handleSubmit = () => {
    const total = ingredients.reduce(
      (acc, ing) => {
        const multiplier = ing.grams / 100
        acc.calories += (ing.calories || 0) * multiplier
        acc.protein += (ing.protein || 0) * multiplier
        acc.carbs += (ing.carbs || 0) * multiplier
        acc.fat += (ing.fat || 0) * multiplier
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )

    onSave({ name, ingredients, total })
  }

  const handleAddIngredient = () => {
    if (!selectedIngredient || !grams) return

    setIngredients([
      ...ingredients,
      {
        name: selectedIngredient.product_name || selectedIngredient.name,
        grams: parseFloat(grams),
        calories: selectedIngredient.nutriments?.energy_kcal || 0,
        protein: selectedIngredient.nutriments?.proteins || 0,
        carbs: selectedIngredient.nutriments?.carbohydrates || 0,
        fat: selectedIngredient.nutriments?.fat || 0
      }
    ])

    setSelectedIngredient(null)
    setGrams('')
  }

  return (
    <div className="mb-6">
      <input
        className="border p-2 w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Recipe Name"
      />

      <div className="mb-2">
        <IngredientSearch onSelect={setSelectedIngredient} />
      </div>

      {selectedIngredient && (
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 w-24"
            value={grams}
            type="number"
            onChange={(e) => setGrams(e.target.value)}
            placeholder="Grams"
          />
          <button className="bg-blue-500 text-white px-4" onClick={handleAddIngredient}>
            Add
          </button>
        </div>
      )}

      <ul className="mb-2 list-disc pl-5">
        {ingredients.map((ing, idx) => (
          <li key={idx}>{ing.grams}g of {ing.name}</li>
        ))}
      </ul>

      <button className="bg-green-600 text-white px-4 py-2" onClick={handleSubmit}>
        Save Recipe
      </button>
    </div>
  )
}

export default RecipeForm
