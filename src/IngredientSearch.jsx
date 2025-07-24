import React, { useState } from 'react'

function IngredientSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  const handleSearch = async (value) => {
    setQuery(value)
    setSelectedItem(null)

    if (value.length < 3) {
      setResults([])
      return
    }

    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        value
      )}&search_simple=1&action=process&json=1&page_size=10`
    )
    const data = await res.json()
    setResults(data.products || [])
  }

  const handleSelect = (item) => {
    setSelectedItem(item)
    setQuery(item.product_name || '')
    setResults([])
    onSelect(item)
  }

  return (
    <div className="relative">
      <input
        className="border p-2 w-full"
        placeholder="Search food ingredient..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        disabled={selectedItem !== null}
      />
      {results.length > 0 && (
        <ul className="absolute bg-white border w-full z-10 max-h-60 overflow-y-auto">
          {results.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item.product_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default IngredientSearch
