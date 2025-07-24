import React from 'react'

function NutritionSummary({ recipe, portions }) {
  const portion = portions || 1
  const perPortion = {
    calories: recipe.total.calories / portion,
    protein: recipe.total.protein / portion,
    carbs: recipe.total.carbs / portion,
    fat: recipe.total.fat / portion,
  }

  return (
    <div className="mt-4 p-4 border rounded bg-gray-100">
      <h3 className="font-bold mb-2">Nutrition Summary</h3>
      <p>Total (whole recipe):</p>
      <ul>
        <li>Calories: {recipe.total.calories.toFixed(1)}</li>
        <li>Protein: {recipe.total.protein.toFixed(1)}g</li>
        <li>Carbs: {recipe.total.carbs.toFixed(1)}g</li>
        <li>Fat: {recipe.total.fat.toFixed(1)}g</li>
      </ul>
      <p className="mt-2">Per Portion (÷ {portion}):</p>
      <ul>
        <li>Calories: {perPortion.calories.toFixed(1)}</li>
        <li>Protein: {perPortion.protein.toFixed(1)}g</li>
        <li>Carbs: {perPortion.carbs.toFixed(1)}g</li>
        <li>Fat: {perPortion.fat.toFixed(1)}g</li>
      </ul>
    </div>
  )
}

export default NutritionSummary

