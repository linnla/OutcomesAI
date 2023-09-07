import { createContext, useState, useContext, useEffect, useRef } from 'react';
import CallApiPromise from '../api/CallApi';
import UserContext from './UserContext';

const OfficeContext = createContext();

function OfficeProvider({ children }) {
  const { practiceId } = useContext(UserContext);
  const [offices, setOffices] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // New state to track fetching status
  const fetchedPracticeIds = useRef(new Set()); // Keep track of fetched practice IDs

  /*
  const fetchAll = async (practiceId) => {
    // Exit if practiceId is undefined, already fetching, or data for this practiceId was fetched
    if (!practiceId || isFetching || fetchedPracticeIds.current.has(practiceId))
      return;

    setIsFetching(true); // Mark as fetching

    const method = 'GET';
    const table = 'offices';
    const query_params = {
      practice_id: practiceId,
    };
    console.log(query_params);

    try {
      const response = await CallApiPromise(method, table, null, query_params);
      setOffices(response.data.data);
      fetchedPracticeIds.current.add(practiceId); // Add to fetched list
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
      // Handle error appropriately
    } finally {
      setIsFetching(false); // Mark fetching as done
    }
  };
  */

  const fetchAll = async (practiceId) => {
    // Exit if practiceId is undefined, already fetching, or data for this practiceId was fetched
    if (
      !practiceId ||
      isFetching ||
      fetchedPracticeIds.current.has(practiceId)
    ) {
      return; // Simply return as no action is taken
    }

    setIsFetching(true); // Mark as fetching

    const method = 'GET';
    const table = 'offices';
    const query_params = {
      practice_id: practiceId,
    };
    console.log(query_params);

    try {
      const response = await CallApiPromise(method, table, null, query_params);
      setOffices(response.data.data);
      fetchedPracticeIds.current.add(practiceId); // Add to fetched list
      return response.data.data; // If needed, you can return the fetched data here
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error; // Throw the error which will reject the promise implicitly
    } finally {
      setIsFetching(false); // Mark fetching as done
    }
  };

  useEffect(() => {
    if (practiceId) {
      // Only fetch if practiceId is available
      fetchAll(practiceId);
    }
  }, [practiceId]);

  return (
    <OfficeContext.Provider value={{ offices, fetchAll }}>
      {children}
    </OfficeContext.Provider>
  );
}

export { OfficeProvider };
export default OfficeContext;
