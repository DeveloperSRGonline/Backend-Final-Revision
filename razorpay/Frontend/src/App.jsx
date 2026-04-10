import { useEffect, useState } from "react"
import axios from "axios"
import "./App.css" 
import PaymentButton from "./PaymentButton"

const App = () => {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:3000/api/products/get-item')
      .then((res) => {
        setProduct(res.data.product)
        console.log(res.data.product)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleBuyNow = () => {
    alert(`Proceeding to buy: ${product?.title}`)
  }

  if (!product) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="container">
      <div className="product-card">
        <div className="image-wrapper">
          <img src={product.image} alt={product.title} className="product-image" />
        </div>
        <div className="product-content">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-description">{product.description}</p>
          <div className="product-footer">
            <span className="product-price">
              ₹{(product.price.amount / 100).toFixed(2)}
            </span>
            <PaymentButton /> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default App