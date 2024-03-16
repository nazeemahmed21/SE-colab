import React, { createContext, useState } from 'react';

const LabContext = createContext({
    isOwner: false,
    setIsOwner: () => {} 
});

export const LabProvider = ({ children }) => {
    const [isOwner, setIsOwner] = useState(false);

    return (
        <LabContext.Provider value={{ isOwner, setIsOwner }}>
            {children}
        </LabContext.Provider>
    );
};

export default LabContext;