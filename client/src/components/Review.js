import Rating from 'react-rating';

export default function Review({props, date}) {
    return(
        <>
            <p>Review by {props.name} on {date}</p>
            <Rating readonly placeholderRating={props.jellyRating}/>
            <Rating readonly placeholderRating={props.ovrRating}/>
            <p>{props.content}</p>
        </>
    )
}