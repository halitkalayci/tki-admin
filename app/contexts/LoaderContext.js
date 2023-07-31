"use client"
import { createContext, useEffect, useState } from "react";

export const LoaderContext = createContext();

export const LoaderProvider = (props) => {
    const [requestCount, setRequestCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (requestCount > 0)
            setIsLoading(true)
        else
            setIsLoading(false)
    }, [requestCount])

    const requestStart = () => {
        setRequestCount(requestCount + 1)
    }
    const requestEnd = () => {
        let newRequestCount = requestCount - 1;
        if (newRequestCount <= 0) newRequestCount = 0;
        setRequestCount(newRequestCount)
    }

    return <LoaderContext.Provider value={{ requestStart, requestEnd }}>
        {isLoading && <div className="overlay">
            <div className="overlay__inner">
                <div className="overlay__content"><span className="spinner"></span></div>
            </div>
        </div>}
        {props.children}
    </LoaderContext.Provider>
}