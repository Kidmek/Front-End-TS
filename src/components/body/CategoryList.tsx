import { useState } from 'react'
import { Category, Type } from '../../constants'
import Check from '/check.svg'
import Edit from '/edit.svg'
import Times from '/times.svg'
import './CategoryList.css'

type Props = {
  category: Category
  depth: Array<number>
  addCategory: (depth: Array<number>, name: string, type: Type) => void
  deleteUpdateCategory: (
    depth: Array<number>,
    id: string,
    name: string,
    isUpdate: boolean,
    type: Type
  ) => void
}
function CategoryList({
  category,
  depth,
  addCategory,
  deleteUpdateCategory,
}: Props) {
  const [addNew, setAddNew] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [title, setTitle] = useState<string>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedType, setSelectedType] = useState<Type>(Type.Category)

  return (
    <div>
      <div className='singleCategory list'>
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
          <div className='btnList list'>
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
          <div className='btnList list'>
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
      {(category.subCategories.length || showModal || addNew) && (
        <div className='innerCategoryList'>
          {category?.subCategories?.map((singleCategory, index) => {
            return (
              <CategoryList
                key={index}
                category={singleCategory}
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
              <div className='addNewContainer list'>
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
  )
}

export default CategoryList
