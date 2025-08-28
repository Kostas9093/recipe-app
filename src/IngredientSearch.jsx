import React, { useState } from 'react'
import { NUTRITION_DB } from './NutritionDB'

function IngredientSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  const search = (q) => {
    setQuery(q)
    setSelectedProduct(null) // reset selection
    if (q.length < 3) {
      setResults([])
      return
    }
      // simple case-insensitive search
    const matches = Object.keys(NUTRITION_DB).filter(item =>
      item.toLowerCase().includes(q.toLowerCase())
    )

    setResults(matches.slice(0, 10))
  }
   
  

    const handleSelect = (name) => {
    setQuery(name)
    setResults([])
    onSelect({ name }) // just send the name back
  }
  return (
    <div className="relative">
      <input
        className="border p-2 w-full"
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder="Search ingredients..."
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto">
          {results.map((name, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default IngredientSearch
