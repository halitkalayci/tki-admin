"use client"
import { createContext, useState } from "react";

export const LoaderContext = createContext();

export const LoaderProvider = (props) => {
    const [requestCount, setRequestCount] = useState(0)

    const requestStart = () => {
        setRequestCount(requestCount + 1)
    }
    const requestEnd = () => {
        let newRequestCount = requestCount - 1;
        if (newRequestCount <= 0) newRequestCount = 0;
        setRequestCount(newRequestCount)
    }

    return <LoaderContext.Provider value={{ requestStart, requestEnd }}>
        {requestCount > 0 && <div className="overlay">
            <div className="overlay__inner">
                <div className="overlay__content"><span className="spinner"></span></div>
            </div>
        </div>}
        {props.children}
    </LoaderContext.Provider>
}