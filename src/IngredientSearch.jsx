import React, { useState } from 'react'

function IngredientSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  const search = async (q) => {
    setQuery(q)
    setSelectedProduct(null) // reset selection
    if (q.length < 3) {
      setResults([])
      return
    }

    const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${q}&search_simple=1&action=process&json=1`)
    const data = await res.json()
    setResults(data.products.slice(0, 10))
  }

   const handleSelect = (product) => {
    setSelectedProduct(product)
    setQuery(product.product_name)
    setResults([])
    onSelect({ name: product.product_name, id: product.code }) // tell parent
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
          {results.map((item) => (
            <li
              key={item.code}
              className="p-2 hover:bg-gray-200 cursor-pointer"
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
