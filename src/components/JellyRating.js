import Rating from 'react-rating';

function JellyRating({ rating, label, sizing = 40}){
    return (
        <>
            {label && <label>Jellyfish</label>}
            <Rating readonly placeholderRating={rating}
                placeholderSymbol={<img src="/aquariumRatingJelly.gif" width={`${sizing}px`}></img>}
                emptySymbol={<img src="/aquariumRatingJelly.gif" style={{"opacity": 0.4}} width={`${sizing}px`}></img>}
            />
        </>
    )
}

function OverallRating({ rating, label, sizing = 40}) {
    return (
        <>
            {label && <label>Overall</label>}
            <Rating readonly placeholderRating={rating}
                placeholderSymbol={<img src="/aquariumRatingStar.gif" width={`${sizing}px`}></img>}
                emptySymbol={<img src="/aquariumRatingStar.gif" style={{"opacity": 0.4}} width={`${sizing}px`}></img>}
            />
        </>
    )
}

export { JellyRating, OverallRating }