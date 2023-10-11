import { useEffect, useState } from 'react'
import './App.css'
import Body from './components/body/Body'
import Header from './components/header/Header'
import { View } from './constants'

type Position = {
  x: number
  y: number
}
function App() {
  const [scale, setScale] = useState<number>(1)
  const [translateX, setTranslateX] = useState<number>(0)
  const [translateY, setTranslateY] = useState<number>(0)
  const [totalCategories, setTotalCategories] = useState(0)
  const [totalServices, setTotalServices] = useState(0)
  const [view, setView] = useState<View>(View.Tree)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  function getPositionAtCenter(element: HTMLElement | null) {
    if (element) {
      const { top, left, width, height } = element.getBoundingClientRect()
      return {
        x: left + width / 2,
        y: top + height / 2,
        left,
        height,
        top,
      }
    } else {
      return null
    }
  }

  const centerBody = () => {
    const centerPosition = getPositionAtCenter(
      document.getElementById('mainBody')
    )
    const containerCenter = getPositionAtCenter(
      document.getElementById('categoryContainer')
    )
    if (centerPosition && containerCenter) {
      setTranslateX(centerPosition.x - 1)
      setTranslateY(centerPosition.y / 2 - 1)
      setPosition({ x: 0, y: 0 })
    }
  }

  useEffect(() => {
    centerBody()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])
  return (
    <div className='container'>
      <Header
        setScale={setScale}
        center={centerBody}
        totalCategories={totalCategories}
        totalServices={totalServices}
        view={view}
        setView={setView}
      />
      <Body
        translateX={translateX}
        translateY={translateY}
        setTranslateX={setTranslateX}
        setTranslateY={setTranslateY}
        scale={scale}
        totalCategories={totalCategories}
        totalServices={totalServices}
        setTotalCategories={setTotalCategories}
        setTotalServices={setTotalServices}
        view={view}
        position={position}
        setPosition={setPosition}
      />
    </div>
  )
}

export default App
