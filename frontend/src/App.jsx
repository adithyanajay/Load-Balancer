import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div> 
      <h1 className="text-5xl text-center mtop-100">Hello, Annamic </h1>
      <h1 className="text-2xl text-center mtop-100">Stay cool 😎</h1>
     </div>
    </>
  )
}

export default App
