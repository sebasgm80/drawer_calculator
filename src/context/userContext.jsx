import { createContext, useState, useContext, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
  const [resultsList, setResultsList] = useState(() => {
    const savedResults = localStorage.getItem('resultsList');
    return savedResults ? JSON.parse(savedResults) : [];
  });

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('resultsList', JSON.stringify(resultsList));
    console.log("Updated Results List in Context:", resultsList);
  }, [resultsList]);

  const addResult = (result) => {
    setResultsList(prevResults => {
      const updatedResults = [...prevResults, { ...result, id: prevResults.length + 1, name: `Mueble ${prevResults.length + 1}` }];
      console.log("Adding Result:", result);
      return updatedResults;
    });
  };

  const updateResultName = (id, newName) => {
    setResultsList(prevResults => prevResults.map(result => result.id === id ? { ...result, name: newName } : result));
  };

  const removeResult = (id) => {
    setResultsList(prevResults => prevResults.filter(result => result.id !== id));
  };

  const recalculateResult = (id, newResult) => {
    setResultsList(prevResults => prevResults.map(result => result.id === id ? { ...newResult, id, name: result.name } : result));
  };

  return (
    <UserContext.Provider value={{ user, setUser, resultsList, addResult, updateResultName, removeResult, recalculateResult }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
