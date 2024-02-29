import React, { useState } from 'react'
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap'
import { uploadVideoAPI } from '../services/allAPI';

function Add({ setUploadVideoResponse }) {
    const [uploadVideo, setUploadVideo] = useState({ caption: "", imageUrl: "", youtubeLink: "" })
    console.log(uploadVideo);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        setUploadVideo({ ...uploadVideo, caption: "", imageUrl: "", youtubeLink: "" })
    }
    const handleShow = () => setShow(true);

    const getYoutubeEmbedLink = (link) => {
        if (link.includes("v=")) {
            let videoId = link.split("v=")[1].slice(0, 11)
            setUploadVideo({ ...uploadVideo, youtubeLink: `https://www.youtube.com/embed/${videoId}` })
        } else {
            setUploadVideo({ ...uploadVideo, youtubeLink: "" })
            alert("Input proper youtube link!!!")
        }
    }

    const handleUpload = async () => {
        // store upload video in http://localhost:3000/videos
        const { caption, imageUrl, youtubeLink } = uploadVideo
        if (caption && imageUrl && youtubeLink) {
            // proceed to store video from http://localhost:5173/home to http://localhost:3000/videos
            const result = await uploadVideoAPI(uploadVideo)
            console.log(result);
            if (result.status >= 200 && result.status < 300) {
                alert(`Video '${result.data.caption}' uploaded successfully!!!`)
                setUploadVideoResponse(result.data)
                handleClose()
            } else {
                alert('API Call Failed... Please try after some time!!!')
            }
        } else {
            alert("Please fill the form completely!!!")
        }
    }
    // https://www.youtube.com/watch?v=SqcY0GlETPk
    // https://www.youtube.com/embed/SqcY0GlETPk
    return (
        <>
            <div className="d-flex align-items-center">
                <h5>Upload A Video</h5>
                <button onClick={handleShow} className='btn bg-info ms-2 rounded-pill border-white'><i style={{ height: '20px', paddingTop: '3px' }} className="fa-solid fa-plus text-white"></i></button>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Video Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='fw-semibold'>Please fill the following details!!!</p>
                    <div className='border rounded border-secondary p-3'>
                        <FloatingLabel
                            controlId="floatingInputCaption"
                            label="Video Caption"
                            className="mb-3"
                        >
                            <Form.Control value={uploadVideo.caption} onChange={e => setUploadVideo({ ...uploadVideo, caption: e.target.value })} type="text" placeholder="Video Caption" />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingInputImg"
                            label="Image Url"
                            className="mb-3"
                        >
                            <Form.Control value={uploadVideo.imageUrl} onChange={e => setUploadVideo({ ...uploadVideo, imageUrl: e.target.value })} type="text" placeholder="Image Url" />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingInputLink"
                            label="Youtube Video Link"
                            className=""
                        >
                            <Form.Control value={uploadVideo.youtubeLink} onChange={e => getYoutubeEmbedLink(e.target.value)} type="text" placeholder="Youtube Video Link" />
                        </FloatingLabel>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} variant="info">Upload</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Add