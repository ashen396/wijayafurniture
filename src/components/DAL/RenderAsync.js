import { useEffect, useState } from "react"

//Calls function from the render method to receive data and render webpage
export default function RenderAsync({ promiseFn, fallback = null, render }) {
    const [state, setState] = useState(null)

    useEffect(() => {
        promiseFn()
            .then((response) => setState({ response, error: null }))
            .catch((error) => setState({ response: null, error }))
    }, [promiseFn])

    if (state === null) {
        return fallback
    }
    return render(state)
}