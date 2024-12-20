import { JellyRating, OverallRating } from "./JellyRating";
import Rating from 'react-rating';

export default function Review({props, date}) {
    return(
        <div className='review'>
            <p>Review by {props.name} on {date}</p>
            <JellyRating rating={props.jellyRating} sizing={75} label={true}></JellyRating>
            <OverallRating rating={props.ovrRating} sizing={75} label={true}></OverallRating>
            <p>{props.content}</p>
        </div>
    )
}