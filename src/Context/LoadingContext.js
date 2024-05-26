'use client'
import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <LoadingContext.Provider value={{ isDisabled, setIsDisabled }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
