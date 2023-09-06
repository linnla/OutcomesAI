import { createContext, useState, useContext, useEffect, useRef } from 'react';
import CallApi from '../api/CallApi';
import UserContext from './UserContext';

const PractitionerContext = createContext();

function PractitionerProvider({ children }) {
  const { practiceId } = useContext(UserContext);
  const [practitioners, setPractitioners] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // New state to track fetching status
  const fetchedPracticeIds = useRef(new Set()); // Keep track of fetched practice IDs

  const fetchAll = async (practiceId) => {
    // Exit if practiceId is undefined, already fetching, or data for this practiceId was fetched
    if (!practiceId || isFetching || fetchedPracticeIds.current.has(practiceId))
      return;

    setIsFetching(true); // Mark as fetching

    const method = 'GET';
    const table = 'practice_practitioners';
    const query_params = {
      practice_id: practiceId,
    };
    console.log(query_params);

    try {
      const response = await CallApi(method, table, null, query_params);
      setPractitioners(response.data.data);
      fetchedPracticeIds.current.add(practiceId); // Add to fetched list
    } catch (error) {
      console.error('Failed to fetch:', error);
      // Handle error appropriately
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
    <PractitionerContext.Provider value={{ practitioners, fetchAll }}>
      {children}
    </PractitionerContext.Provider>
  );
}

export { PractitionerProvider };
export default PractitionerContext;
