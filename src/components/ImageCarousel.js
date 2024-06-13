import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default function ImageCarousel({links}) {
    return (
        <Carousel width={'80%'} showArrows={true} showThumbs={false}>
            {links.map((link, index) => {
                return(
                    <div className="each-slide-effect" key={index}>
                        <div style={{ 'backgroundImage': `url(${link})` }}> 
                        </div>
                    </div>
                )
            })}
        </Carousel>
    )
}