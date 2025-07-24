import React, { useState } from 'react'
import Select from 'react-select'

function IngredientSearch({ onAdd }) {
  const [options, setOptions] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = async (value) => {
    setInputValue(value)

    if (value.length < 2) return

    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${value}&search_simple=1&action=process&json=1`
    )
    const data = await res.json()

    const cleaned = data.products
      .filter(p => p.product_name && p.nutriments)
      .map(p => ({
        label: p.product_name,
        value: p.code,
        data: {
          name: p.product_name,
          calories: p.nutriments['energy-kcal_100g'],
          protein: p.nutriments['proteins_100g'],
          fat: p.nutriments['fat_100g'],
          carbs: p.nutriments['carbohydrates_100g']
        }
      }))

    setOptions(cleaned)
  }

  const handleSelect = (selected) => {
    if (selected && selected.data) {
      onAdd(selected.data)
      setInputValue('')
    }
  }

  return (
    <Select
      options={options}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      inputValue={inputValue}
      placeholder="Search for food..."
      noOptionsMessage={() => 'Type to search...'}
    />
  )
}

export default IngredientSearch
