import { useState, useEffect } from "react"
import Rating from "react-rating"
import { useParams } from "react-router-dom";
import Review from "./Review";
import ImageCarousel from "./ImageCarousel";
import "../reviewpage.css"
import { baseUrl } from "../config";
import { useAuth } from "../hooks/AuthProvider";

export default function ReviewPage() {
    const { id } = useParams();
    const auth = useAuth();

    let [ovrRating, setOvrRating] = useState(0)
    let [jellyRating, setJellyRating] = useState(0)
    let [reviewContent, setReviewContent] = useState("")
    let [reviewList, setReviewList] = useState([])
    let [imageFile, setImageFile] = useState();
    let [bannerLinks, setBannerLinks] = useState([])

    let [record, setRecord] = useState({
        _id: "",
        properties: {
            name: "",
            address: ""
        }
    });

    function setup() {
        if (id) {
            fetch(`${baseUrl}/api/aquariums/${id}`)
                .then((res) => res.json()).then((data) => setRecord(data));

            fetch(`${baseUrl}/api/upload/${id}`)
                .then((res) => res.json()).then((links) => setBannerLinks(links));

            getReviews();
        }
    }

    useEffect(() => {
        setup()
    }, [])

    function getReviews() {
        fetch(`${baseUrl}/api/reviews/${id}`)
            .then((res) => res.json()).then((data) => setReviewList(data.reverse()));
    }

    async function onSubmit(e) {
        e.preventDefault();
        let response = await fetch(`${baseUrl}/api/reviews/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reviewContent, jellyRating, ovrRating }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let getReviews = await fetch(`${baseUrl}/api/reviews/${id}`)
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

            const upload = fetch(`${baseUrl}/upload/${id}`, {
                method: "POST",
                body: formData,
            }).then((res) => res.text())

            const getImages = fetch(`${baseUrl}/upload/${id}`)
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
                    {auth.authed &&
                        <>
                            <p>Upload aquarium photos</p>
                            <input onChange={handleChange} type="file" name="imgfile" accept="image/jpeg" />
                            <button onClick={uploadImage}>Upload</button>
                        </>
                    }
                    <h2>{record.properties.name}</h2>
                    <h3>{record.properties.address}</h3>
                    <form onSubmit={onSubmit} >
                        {auth.authed &&
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
                                {auth.authed && <button onClick={() => deleteReview(review._id)}>Delete</button>}
                            </div>)
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}