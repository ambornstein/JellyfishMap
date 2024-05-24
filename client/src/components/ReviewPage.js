import React, { useState, useEffect } from "react"
import Rating from "react-rating"
import { useParams } from "react-router-dom";
import { baseUrl } from "../config";
import Review from "./Review";

export default function ReviewPage() {
    let params = useParams();
    let [ovrRating, setOvrRating] = useState(0)
    let [jellyRating, setJellyRating] = useState(0)
    let [reviewContent, setReviewContent] = useState("")
    let [reviewList, setReviewList] = useState([])

    let [record, setRecord] = useState({
        _id: "",
        properties:{
            name:"",
            address:""
        }
    });

    useEffect(() => {
        async function fetchData() {
            const id = params.id?.toString() || undefined;
            if(!id) return;
            const response = await fetch(`${baseUrl}/aquariums/${params.id.toString()}`);
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const record = await response.json();
            if (!record) {
                console.warn(`Record with id ${id} not found`);
                return;
            }
            console.log(record)
            setRecord(record);

            const reviews = await fetch(`${baseUrl}/reviews/${params.id.toString()}`);
            if (!reviews.ok) {
                throw new Error(`HTTP error! status: ${reviews.status}`);
            }
            const reviewSet = await reviews.json();
            if (!reviewSet) {
                console.warn(`Record with id ${id} not found`);
                return;
            }

            console.log(reviewSet)
            setReviewList(reviewSet.reverse())
        }
        fetchData()
    }, [params, setRecord, setReviewList, reviewList]);

      async function onSubmit(e) {
        e.preventDefault();
        let response;
        response = await fetch(`${baseUrl}/reviews/${params.id.toString()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({reviewContent, jellyRating, ovrRating}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    
    return(
        <>
            <div className="review-container">
                <img alt="Placeholder Aquarium" src="https://media.istockphoto.com/id/153782658/photo/biggest-aquarium-in-the-world-atlanta-georgia.jpg?s=612x612&w=0&k=20&c=aTGApHF81O05Dj1aXwI4bUPgji-w1raxC89cacVdHJw="></img>
                <h2>{record.properties.name}</h2>
                <h3>{record.properties.address}</h3>
                <form onSubmit={onSubmit}>
                    <input type="text" onChange={(e) => setReviewContent(e.target.value) } />
                    <label>Jellyfish</label><Rating isrequired placeholderRating={jellyRating} value={jellyRating} onChange={setJellyRating} />
                    <label>Quality</label><Rating isrequired placeholderRating={ovrRating} value={ovrRating} onChange={setOvrRating}/>
                    <button type="submit">Submit Review</button>
                </form>
                {reviewList.map((review, index) => {
                    const timestamp = new Date(review.timestamp)
                    console.log(review.timestamp)
                    return (<Review props={review} key={index} date={timestamp.toString()}/>)
                })}
            </div>
        </>
    )
    
}