import React, { useEffect, useState } from 'react'
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap'
import { addCategoryAPI, getAVideoAPI, getCategoryAPI, removeCategoryAPI, updateCategoryAPI } from '../services/allAPI';
import VideoCard from './VideoCard';

function Category({ removeCategoryVideoResponse }) {
  const [allCategories, setAllCategories] = useState([])
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState("")

  const handleClose = () => {
    setShow(false)
    setCategoryName("")
  }
  const handleShow = () => setShow(true);
  const handleAddCategory = async () => {
    if (categoryName) {
      const result = await addCategoryAPI({ categoryName, allVideos: [] })
      handleClose()
      getAllcategories()
    } else {
      alert('Please fill the form completely')
    }
  }

  const getAllcategories = async () => {
    const result = await getCategoryAPI()
    setAllCategories(result.data)
  }
  // console.log(allCategories);

  useEffect(() => {
    getAllcategories()
  }, [removeCategoryVideoResponse])

  const handleRemoveCategory = async (cId) => {
    await removeCategoryAPI(cId)
    getAllcategories()
  }

  const dragOverCategory = (e) => {
    e.preventDefault()
    console.log("Dragging over category");
  }

  const videoDropped = async (e, categoryId) => {
    const videoId = e.dataTransfer.getData("videoId")
    console.log(`Video Dropped with vId: ${videoId}, inside category Id: ${categoryId}`);
    // get details of videoId
    const { data } = await getAVideoAPI(videoId)
    console.log(data);
    // get category details where we have add video
    let selectedCategory = allCategories.find(item => item.id == categoryId)
    selectedCategory.allVideos.push(data)
    console.log(selectedCategory);
    await updateCategoryAPI(categoryId, selectedCategory)
    getAllcategories()
  }

  const videoDragStarted = (e, videoId, categoryId) => {
    console.log(`Drag started from category Id: ${categoryId} with video id: ${videoId}`);
    let dataShare = { videoId, categoryId }
    e.dataTransfer.setData("removeVideoDetails", JSON.stringify(dataShare))
  }

  return (
    <>
      <div className="d-flex justify-content-around">
        <h3 className='fw-semibold'>All Categories</h3>
        <Button variant="info" onClick={handleShow} className='rounded-pill border-white'><i style={{ height: '20px', paddingTop: '3px' }} className="fa-solid fa-plus text-white"></i></Button>
      </div>
      <div className="container-fluid mt-3">
        {allCategories.length > 0 ? allCategories.map((item, index) => (
          <div droppable="true" onDragOver={(e) => dragOverCategory(e)} onDrop={(e) => videoDropped(e, item?.id)} key={index} className="border rounded p-3 mb-2">
            <div className='d-flex justify-content-between'>
              <h5>{item.categoryName}</h5>
              <button onClick={() => handleRemoveCategory(item.id)} className="btn"><i style={{ height: '20px', paddingTop: '3px' }} className="fa-solid fa-trash-can text-danger"></i></button>
            </div>
            <div className="row mt-2">
              {
                item.allVideos?.length > 0 && item.allVideos?.map((video, index) => (
                  <div draggable onDragStart={(e) => videoDragStarted(e, video.id, item.id)} key={index} className='col-lg-6'>
                    <VideoCard insideCategory={true} displayData={video} />
                  </div>
                ))
              }
            </div>
          </div>
        ))
          :
          <div className="text-danger fw-bolder">
            No Categories are added yet!!!
          </div>
        }
      </div >
      <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please fill the details!!!</p>
          <FloatingLabel
            controlId="floatingInputCaption"
            label="Caption"
            className="mb-3"
          >
            <Form.Control value={categoryName} onChange={e => setCategoryName(e.target.value)} type="text" placeholder="Category Name" />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="info" onClick={handleAddCategory}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Category