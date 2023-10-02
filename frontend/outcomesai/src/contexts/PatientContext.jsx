import { createContext, useState, useContext, useEffect, useRef } from 'react';
import CallApiPromise from '../api/CallApi';
import UserContext from './UserContext';

const staticDefaultPatient = {
  practice_id: '',
  id: '',
  user_id: '',
  full_name: '',
  last_name: '',
  first_name: '',
  birthdate: '',
  gender_birth: '',
  gender_identity: '',
  race: '',
  ethnicity: '',
  email: '',
  cell_phone: '',
  postal_code: '',
  city: '',
  county: '',
  state: '',
  state_code: '',
  country_code: '',
  ehr_id: null,
  chart_id: '',
  status: '',
  created_at: '',
  updated_at: '',
};

const PatientContext = createContext(staticDefaultPatient);

function PatientProvider({ children }) {
  const { practiceId } = useContext(UserContext);
  const [patients, setPatients] = useState([]);
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

  const fetchAllPatients = async (practiceId) => {
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
    const table = 'practice_patients';
    const query_params = {
      practice_id: practiceId,
    };
    console.log(query_params);

    try {
      const response = await CallApiPromise(method, table, null, query_params);
      setPatients(response.data.data);
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
      fetchAllPatients(practiceId);
    }
  }, [practiceId]);

  return (
    <PatientContext.Provider value={{ patients, fetchAllPatients }}>
      {children}
    </PatientContext.Provider>
  );
}

export { PatientProvider };
export default PatientContext;
