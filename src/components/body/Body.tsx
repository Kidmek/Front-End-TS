import './Body.css'
import CategoryTree from './CategoryTree'
import Up from '/up.png'
import Check from '/check.svg'
import Times from '/times.svg'

import { useState } from 'react'
import { Category, Type, View } from '../../constants'
import CategoryList from './CategoryList'

// Component Prop And State Types
type Props = {
  scale: number
  translateX: number
  setTranslateX: React.Dispatch<React.SetStateAction<number>>
  translateY: number
  setTranslateY: React.Dispatch<React.SetStateAction<number>>
  totalServices: number
  setTotalServices: React.Dispatch<React.SetStateAction<number>>
  totalCategories: number
  setTotalCategories: React.Dispatch<React.SetStateAction<number>>
  view: View
  position: Position
  setPosition: React.Dispatch<React.SetStateAction<Position>>
}
type Position = {
  x: number
  y: number
}
type SingleCategory = {
  id: string
  name: string
  type: Type
  subCategories: Array<Category>
}

const Body = ({
  scale,
  translateX,
  setTranslateX,
  translateY,
  setTranslateY,
  setPosition,
  position,
  totalCategories,
  totalServices,
  setTotalCategories,
  setTotalServices,
  view,
}: Props) => {
  // States for knowing dragging state and position
  const [dragging, setDragging] = useState<boolean>(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Complete Categories
  const [categories, setCategories] = useState<Array<SingleCategory>>([])

  // Input state
  const [title, setTitle] = useState<string>('')

  // State to show/hide the input
  const [addNew, setAddNew] = useState<boolean>(false)

  // Recursive Function Used to locate a node by depth and then add to subcategories or delete or update a category
  const findAndAlterCategory = (
    categories: Array<SingleCategory>,
    depth: Array<number>,
    name: string,
    isDelete: boolean,
    isUpdate: boolean,
    id: string,
    type: Type
  ) => {
    // Base case
    if (depth.length == 1) {
      // Delete
      if (isDelete) {
        categories = categories.filter((category) => category.id !== id)
        return categories
      }
      // Update
      else if (isUpdate) {
        categories = categories.map((category) => {
          if (category.id === id) {
            category.name = name
            return category
          } else {
            return category
          }
        })
        return categories
      }
      // Add
      else {
        categories[depth[0]].subCategories.push({
          type: type,
          id: depth
            .join('')
            .concat(categories[depth[0]].subCategories.length.toString()),
          name: name,
          subCategories: [],
        })
      }
    } else {
      // take out the first depth and find categories by it then send it back to the function finally update state
      const newDepth = depth.shift()
      if (newDepth !== undefined) {
        const res = findAndAlterCategory(
          categories[newDepth].subCategories,
          depth,
          name,
          isDelete,
          isUpdate,
          id,
          type
        )
        if (res !== undefined) {
          categories[newDepth].subCategories = res
        }
      }
    }
  }

  // Handles when the add button is pressed
  const handleAddCategory = (
    depth: Array<number>,
    name: string,
    type: Type
  ) => {
    const newCategories = categories

    // No Recursion required add to base categories
    if (depth.length == 0) {
      newCategories.push({
        type: type,
        id: depth.join('').concat(newCategories.length.toString()),
        name: name,
        subCategories: [],
      })

      // Add to total(visible in header)
      if (type === Type.Category) {
        setTotalCategories(totalCategories + 1)
      } else {
        setTotalServices(totalServices + 1)
      }
      setCategories(newCategories)
    } else {
      // Start recursion
      findAndAlterCategory(newCategories, depth, name, false, false, name, type)
      if (type === Type.Category) {
        setTotalCategories(totalCategories + 1)
      } else {
        setTotalServices(totalServices + 1)
      }
      setCategories([...newCategories])
    }
  }

  //Handles when delete or update is initiated
  const handleDeleteUpdateCategory = (
    depth: Array<number>,
    id: string,
    name: string,
    isUpdate: boolean,
    type: Type
  ) => {
    let newCategories = categories

    // No recursion required first layer of elements
    if (depth.length == 1) {
      newCategories = !isUpdate
        ? newCategories.filter((category) => category.id !== id)
        : newCategories.map((category) => {
            if (category.id === id) {
              category.name = name
              return category
            } else {
              return category
            }
          })

      // If delete deduce total for header
      if (!isUpdate) {
        if (type === Type.Category) {
          setTotalCategories(totalCategories - 1)
        } else {
          setTotalServices(totalServices - 1)
        }
      }
      setCategories(newCategories)
    } else {
      // Recursion
      findAndAlterCategory(
        newCategories,
        depth,
        name,
        !isUpdate,
        isUpdate,
        id,
        type
      )

      // If delete deduce total for header
      if (!isUpdate) {
        if (type === Type.Category) {
          setTotalCategories(totalCategories - 1)
        } else {
          setTotalServices(totalServices - 1)
        }
      }
      setCategories([...newCategories])
    }
  }

  // Start the dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true)
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  // Stop the dragging
  const handleMouseUp = () => {
    setDragging(false)
  }

  // While dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      })
    }
  }

  // Handles panning with the four buttons on each side
  const handlePan = (direction: string) => {
    const step = 50
    switch (direction) {
      case 'up':
        setTranslateY(translateY - step)
        break
      case 'down':
        setTranslateY(translateY + step)
        break
      case 'left':
        setTranslateX(translateX - step)
        break
      case 'right':
        setTranslateX(translateX + step)
        break
      default:
        break
    }
  }
  return (
    <div className='body' id='mainBody'>
      {/* The Four Panning Buttons */}
      <button onClick={() => handlePan('down')} className='navigateBtn up'>
        <img src={Up} className='upImg' />
      </button>
      <button onClick={() => handlePan('left')} className='navigateBtn right'>
        <img src={Up} className='upImg' />
      </button>
      <button onClick={() => handlePan('up')} className='navigateBtn down'>
        <img src={Up} className='upImg' />
      </button>
      <button onClick={() => handlePan('right')} className='navigateBtn left'>
        <img src={Up} className='upImg' />
      </button>
      {/*  */}
      <div
        style={{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transition: 'transform 1s',
          zIndex: '-1',
        }}
      >
        <div
          className='categoryContainer'
          id='categoryContainer'
          onMouseLeave={handleMouseUp}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            transition: `${dragging ? '' : 'top 1s , left 1s'}`,
          }}
        >
          <div
            className={`tile  ${view === View.List ? 'list' : ''} ${
              dragging ? 'dragging' : ''
            }`}
          >
            <div>Categories</div>
            <button className='btn add' onClick={() => setAddNew(true)}>
              +
            </button>
          </div>

          {/* If View Button is on List or View */}
          {view !== View.List ? (
            <div className='lineContainer'>
              {(categories.length > 1 ||
                (categories.length == 1 && addNew)) && (
                <div className='line'></div>
              )}
              {(categories.length > 1 ||
                (categories.length == 1 && addNew)) && (
                <div className='horizontalLine'></div>
              )}
              <div className={`categoriesList `}>
                {categories?.map((category, index) => {
                  return (
                    <CategoryTree
                      key={index}
                      hasSiblings={categories.length > 1}
                      category={category}
                      showHorizontal={
                        categories.length > 1 ||
                        (categories.length == 1 && addNew)
                      }
                      depth={[index]}
                      addCategory={handleAddCategory}
                      deleteUpdateCategory={handleDeleteUpdateCategory}
                    />
                  )
                })}
                {/* New input */}
                {addNew && (
                  <div className='lineContainer'>
                    <div className='line'></div>

                    <div className='addNewContainer'>
                      <input
                        className='categoryTitle input '
                        title='Category Name'
                        placeholder='Category Name'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <div className='btnList'>
                        <button
                          className='btn inputTimes'
                          onClick={() => {
                            setTitle('')
                            setAddNew(false)
                          }}
                        >
                          <img src={Times} />
                        </button>
                        <button
                          className='btn check'
                          onClick={() => {
                            setTitle('')
                            if (title) {
                              handleAddCategory([], title, Type.Category)
                            }
                            setAddNew(false)
                          }}
                        >
                          <img src={Check} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='categoryListView'>
              {categories?.map((category, index) => {
                return (
                  <CategoryList
                    key={index}
                    category={category}
                    depth={[index]}
                    addCategory={handleAddCategory}
                    deleteUpdateCategory={handleDeleteUpdateCategory}
                  />
                )
              })}
              {/* New input */}
              {addNew && (
                <div className='lineContainer'>
                  <div className='addNewContainer'>
                    <input
                      className='categoryTitle input '
                      title='Category Name'
                      placeholder='Category Name'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className='btnList list'>
                      <button
                        className='btn inputTimes'
                        onClick={() => {
                          setTitle('')
                          setAddNew(false)
                        }}
                      >
                        <img src={Times} />
                      </button>
                      <button
                        className='btn check'
                        onClick={() => {
                          setTitle('')
                          if (title) {
                            handleAddCategory([], title, Type.Category)
                          }
                          setAddNew(false)
                        }}
                      >
                        <img src={Check} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Body
