'use client'
const { createContext, useState } = require("react");

export const DataContext = createContext();

export default function DataContextProvider({ children }) {

    const [userData, setUserData] = useState([]);
    const [count, setCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <DataContext.Provider value={{ userData, setUserData, count, setCount, isLoading, setIsLoading }}>
            {children}
        </DataContext.Provider>
    )
}