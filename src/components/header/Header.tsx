import React, { useState, useEffect } from 'react'
import './Header.css'
import SendImg from '/center.png'
import { View, zoomLevels } from '../../constants'

// Component Prop And State Types

type Props = {
  setScale: React.Dispatch<React.SetStateAction<number>>
  totalServices: number
  totalCategories: number
  center: () => void
  view: View
  setView: React.Dispatch<React.SetStateAction<View>>
}
const Header = ({
  setScale,
  totalCategories,
  totalServices,
  center,
  view,
  setView,
}: Props) => {
  // State to hold the chosen zoom option
  const [zoom, setZoom] = useState<string>('100%')
  const [selectedIndex, setSelectedIndex] = useState(9)

  // Handles zoom option change
  const onZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setZoom(e.target.value)
    const number: number = Number(e.target.value.replace('%', ''))
    if (number) {
      setScale(number / 100)
    }
  }

  // when zoom state changes change the scale of the body
  useEffect(() => {
    zoomLevels.forEach((level, index) => {
      if (level + '%' === zoom) {
        setSelectedIndex(index)
      }
    })
    const number: number = Number(zoom.replace('%', ''))
    if (number) {
      setScale(number / 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  return (
    <div className='header'>
      <div className='headerLeftContainer'>
        <div className='headerLeft'>
          <div className='headerTitle'>Categories</div>
          <div className='headerNumber'>{totalCategories}</div>
        </div>
        <div className='headerLeft'>
          <div className='headerTitle service'>Services</div>
          <div className='headerNumber service'>{totalServices}</div>
        </div>
      </div>
      <div className='headerRight'>
        {/* View change button */}
        <button
          className='headerBtn textBtn'
          onClick={() => {
            setView(view === View.List ? View.Tree : View.List)
          }}
        >
          {view !== View.List ? 'LIST VIEW' : 'TREE VIEW'}
        </button>

        {/* Center  button */}
        <button
          className='headerBtn iconBtn'
          data-tooltip='bla bla'
          onClick={center}
        >
          <img src={SendImg} className='icon' />
          <span className='toolTipText'>Go To Center</span>
        </button>
        <div className='zoomContainer'>
          <button
            className='headerBtn zoomBtn'
            disabled={selectedIndex == 0}
            onClick={() => {
              setZoom(zoomLevels[selectedIndex - 1] + '%')
            }}
          >
            -
          </button>
          <select className='amount' value={zoom} onChange={onZoomChange}>
            {zoomLevels.map((number, index) => {
              return (
                <option className='amount' key={index}>
                  {number}%
                </option>
              )
            })}
          </select>

          <button
            className='headerBtn zoomBtn'
            disabled={selectedIndex === zoomLevels.length - 1}
            onClick={() => {
              setZoom(zoomLevels[selectedIndex + 1] + '%')
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
