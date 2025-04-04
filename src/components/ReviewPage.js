import React, { useState, useEffect } from "react"
import Rating from "react-rating"
import { useParams } from "react-router-dom";
import { baseUrl } from "../config";
import Review from "./Review";
import ImageCarousel from "./ImageCarousel";
import "../reviewpage.css"

export default function ReviewPage() {

    let params = useParams();
    let [ovrRating, setOvrRating] = useState(0)
    let [jellyRating, setJellyRating] = useState(0)
    let [reviewContent, setReviewContent] = useState("")
    let [reviewList, setReviewList] = useState([])
    let [imageFile, setImageFile] = useState();
    let [bannerLinks, setBannerLinks] = useState([])

    let [authed, setAuthed] = useState(false)

    useEffect(() => {
        function handleChange() {
            let stored = JSON.parse(localStorage.getItem("userInfo"))
            if (stored) {
                fetch(`${baseUrl}/api/auth/verify/${stored}`).then((res) => setAuthed(res.ok))
            } else {
                setAuthed(false)
            }
        }

        handleChange()
        window.addEventListener('storage', handleChange)
    }, [])

    let [record, setRecord] = useState({
        _id: "",
        properties: {
            name: "",
            address: ""
        }
    });

    useEffect(() => {
        const id = params.id?.toString() || undefined;
        if (id) {
            fetch(`${baseUrl}/api/aquariums/${(id)}`)
                .then((res) => res.json()).then((data) => setRecord(data));

            getReviews()

            fetch(`${baseUrl}/api/upload/${params.id.toString()}`)
                .then((res) => res.json()).then((links) => setBannerLinks(links))
        }
    }, []);

    function getReviews() {
        fetch(`${baseUrl}/api/reviews/${params.id.toString()}`)
            .then((res) => res.json()).then((data) => setReviewList(data.reverse()));
    }

    async function onSubmit(e) {
        e.preventDefault();
        let response = await fetch(`${baseUrl}/api/reviews/${params.id.toString()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reviewContent, jellyRating, ovrRating }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let getReviews = await fetch(`${baseUrl}/api/reviews/${params.id.toString()}`)
            .then((res) => res.json())

        Promise.all([response, getReviews]).then((resolutions) => setReviewList(resolutions[1].flat().reverse()));
    }

    function deleteReview(id) {
        fetch(`${baseUrl}/api/reviews/${id}`, { method: "DELETE" }).then(() => getReviews())
    }

    function uploadImage(e) {
        e.preventDefault()

        let inputFile = imageFile
        if (inputFile) {
            let blob = inputFile.slice(0, inputFile.size, "image/jpg");

            let newFile = new File([blob], inputFile.name, { type: "image/jpeg" });
            let formData = new FormData();
            formData.append("imgfile", newFile);

            const upload = fetch(`${baseUrl}/upload/${params.id.toString()}`, {
                method: "POST",
                body: formData,
            }).then((res) => res.text())

            const getImages = fetch(`${baseUrl}/upload/${params.id.toString()}`)
                .then((res) => res.json())

            Promise.all([upload, getImages]).then((out) => {
                alert(out[0] + "ful upload");
                setBannerLinks(out[1].flat())
            })
        }
    }

    function handleChange(event) {
        event.preventDefault()
        setImageFile(event.target.files[0])
    }

    return (
        <>
            <div className="slide-container">
                <ImageCarousel links={bannerLinks} />
            </div>
            <div className="review-container">

                <div className="review-content">
                    {authed &&
                        <>
                            <p>Upload aquarium photos</p>
                            <input onChange={handleChange} type="file" name="imgfile" accept="image/jpeg" />
                            <button onClick={uploadImage}>Upload</button>
                        </>
                    }
                    <h2>{record.properties.name}</h2>
                    <h3>{record.properties.address}</h3>
                    <form onSubmit={onSubmit} >
                        {authed &&
                            <>
                                <div className="review-form">
                                    <textarea type="text" onChange={(e) => setReviewContent(e.target.value)} />
                                    <label>Jellyfish</label><Rating className="rating" isrequired
                                        placeholderRating={jellyRating} value={jellyRating} onChange={setJellyRating}
                                        placeholderSymbol={<img src="/aquariumRatingJelly.gif" width="75px" className='icon'></img>}
                                        fullSymbol={<img src="/aquariumRatingJelly.gif" width="75px" className='icon'></img>}
                                        emptySymbol={<img src="/aquariumRatingJelly.gif" style={{ "opacity": 0.4 }} width="75px" className='icon'></img>} />
                                    <label>Quality</label><Rating className="rating" isrequired
                                        placeholderRating={ovrRating} value={ovrRating} onChange={setOvrRating}
                                        fullSymbol={<img src="/aquariumRatingStar.gif" width="75px" className='icon'></img>}
                                        placeholderSymbol={<img src="/aquariumRatingStar.gif" width="75px" className='icon'></img>}
                                        emptySymbol={<img src="/aquariumRatingStar.gif" style={{ "opacity": 0.4 }} width="75px" className='icon'></img>} />
                                    <button type="submit">Submit Review</button>
                                </div>
                            </>
                        }
                    </form>
                    <div className="reviews">
                        {reviewList.map((review, index) => {
                            const timestamp = new Date(review.timestamp)
                            return (<div>
                                <Review props={review} key={index} date={timestamp.toString()} />
                                {authed && <button onClick={() => deleteReview(review._id)}>Delete</button>}
                            </div>)
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}