import Check from '/check.svg'
import Edit from '/edit.svg'
import Times from '/times.svg'
import { useState } from 'react'

import './CategoryTree.css'
import { Category, Type } from '../../constants'

type Props = {
  category: Category
  showHorizontal: boolean
  depth: Array<number>
  hasSiblings: boolean
  addCategory: (depth: Array<number>, name: string, type: Type) => void
  deleteUpdateCategory: (
    depth: Array<number>,
    id: string,
    name: string,
    isUpdate: boolean,
    type: Type
  ) => void
}
function CategoryTree({
  category,
  showHorizontal,
  hasSiblings,
  depth,
  addCategory,
  deleteUpdateCategory,
}: Props) {
  const [addNew, setAddNew] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [title, setTitle] = useState<string>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedType, setSelectedType] = useState<Type>(Type.Category)

  // function getPositionAtCenter(element: HTMLElement | null) {
  //   if (element) {
  //     const { top, left, width, height } = element.getBoundingClientRect()
  //     return {
  //       x: left + width / 2,
  //       y: top + height / 2,
  //     }
  //   } else {
  //     return { x: 0, y: 0 }
  //   }
  // }

  // function getDistanceBetweenElements(
  //   a: HTMLElement | null,
  //   b: HTMLElement | null
  // ) {
  //   const aPosition = getPositionAtCenter(a)
  //   const bPosition = getPositionAtCenter(b)

  //   return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y)
  // }

  //   const distance: number = getDistanceBetweenElements(
  //     document.getElementById('x'),
  //     document.getElementById('y')
  //   )

  //   console.log(
  //     getDistanceBetweenElements(
  //       document.getElementById('0'),
  //       document.getElementById('1')
  //     )
  //   )

  return (
    <div className={`categoriesListContainer  ${!hasSiblings ? 'single' : ''}`}>
      <div className='singleWrapper'>
        <div className='line' id={category.id} />
        <div className={`singleCategory  ${!showHorizontal ? '' : ''}`}>
          {!edit ? (
            <div
              className={`categoryTitle d${depth.length} ${
                category.type === Type.Service ? 'service' : 'category'
              }`}
            >
              {category.name}
            </div>
          ) : (
            <input
              className='categoryTitle input'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}
          {edit ? (
            <div className='btnList'>
              <button
                className='btn inputTimes'
                onClick={() => {
                  setTitle('')
                  setEdit(false)
                }}
              >
                <img src={Times} />
              </button>
              <button
                className='btn check'
                onClick={() => {
                  setTitle('')
                  if (title) {
                    deleteUpdateCategory(
                      depth,
                      category.id,
                      title,
                      true,
                      category.type
                    )
                  }
                  setEdit(false)
                }}
              >
                <img src={Check} />
              </button>
            </div>
          ) : (
            <div className='btnList'>
              {category.type !== Type.Service && (
                <button className='btn' onClick={() => setShowModal(true)}>
                  +
                </button>
              )}
              <button
                className='btn edit'
                onClick={() => {
                  setTitle(category.name)
                  setEdit(true)
                }}
              >
                <img src={Edit} />
              </button>
              <button
                className='btn times'
                onClick={() => {
                  const response = confirm('Are You Sure?')
                  if (response) {
                    deleteUpdateCategory(
                      depth,
                      category.id,
                      category.name,
                      false,
                      category.type
                    )
                  }
                }}
              >
                <img src={Times} />
              </button>
            </div>
          )}
        </div>

        <div className='innerLineContainer'>
          {(category.subCategories.length > 1 ||
            (category.subCategories.length == 1 && addNew)) && (
            <div className='line' />
          )}
          {(category.subCategories.length > 1 ||
            (category.subCategories.length == 1 && addNew)) && (
            <div className='horizontalLine' id={depth.join('')} />
          )}
          {(category.subCategories.length || showModal || addNew) && (
            <div
              className={`categoriesList ${
                category.subCategories.length <= 1 ? 'single' : ''
              }`}
            >
              {category?.subCategories?.map((singleCategory, index) => {
                return (
                  <CategoryTree
                    key={index}
                    category={singleCategory}
                    showHorizontal={
                      singleCategory.subCategories.length > 1 ||
                      (singleCategory.subCategories.length == 1 && addNew)
                    }
                    hasSiblings={category.subCategories.length > 1}
                    depth={[...depth, index]}
                    addCategory={addCategory}
                    deleteUpdateCategory={deleteUpdateCategory}
                  />
                )
              })}
              {showModal && (
                <div className='modal'>
                  <p>What do you want to create?</p>
                  <div>
                    <button
                      className='btn-category'
                      onClick={() => {
                        setSelectedType(Type.Category)
                        setAddNew(true)
                        setShowModal(false)
                      }}
                    >
                      Category
                    </button>
                    <button
                      className='btn-category'
                      onClick={() => {
                        setSelectedType(Type.Service)
                        setAddNew(true)
                        setShowModal(false)
                      }}
                    >
                      Service
                    </button>
                  </div>
                </div>
              )}
              {addNew && (
                <div className='lineContainer'>
                  <div className='line' />
                  <div className='addNewContainer'>
                    <input
                      className='categoryTitle input '
                      title={
                        selectedType === Type.Category
                          ? 'Category Name'
                          : 'Service Name'
                      }
                      placeholder={
                        selectedType === Type.Category
                          ? 'Category Name'
                          : 'Service Name'
                      }
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
                            addCategory(depth, title, selectedType)
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

export default CategoryTree
