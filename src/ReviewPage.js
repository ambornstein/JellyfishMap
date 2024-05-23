import { useParams } from "react-router-dom"

export default function ReviewPage() {
    let { id } = useParams()
    return(<div>{id}</div>)
}