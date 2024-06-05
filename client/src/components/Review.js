import Rating from 'react-rating';

export default function Review({props, date}) {
    return(
        <div className='review'>
            <p>Review by {props.name} on {date}</p>
            <label>Jellyfish</label><Rating readonly placeholderRating={props.jellyRating}/>
            <label>Overall</label><Rating readonly placeholderRating={props.ovrRating}/>
            <p>{props.content}</p>
        </div>
    )
}