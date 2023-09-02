import axios from 'axios';
import { config } from '../config/Config';
import { getToken } from '../utils/AuthService';
import HandleTokenError from './HandleTokenError';

export const getRequest = (method, table, body, query_params) => {
  return new Promise(async (resolve, reject) => {
    const url = `${config.baseUrl}${config.stage}/${table}`;
    console.log('getRequest:', method, table, body, query_params, url);

    const token = await getToken();
    if (token instanceof Error) {
      const tokenError = new Error('Token error');
      reject(tokenError);
      return;
    }

    axios
      .get(url, {
        headers: {
          Authorization: token,
        },
        params: query_params,
      })
      .then((response) => {
        console.log('getRequest response:', response.data.data[0]);
        resolve(response.data.data[0]);
      })
      .catch((error) => {
        if (
          error.response.data.errorMessage ===
          'A database result was required but none was found'
        ) {
          if (table === 'postal_codes') {
            reject(
              `Postal code ${query_params.postal_code} is not a valid postal code`
            );
          }
        } else {
          reject(error.response.data.errorDescription);
        }
      });
  });
};

const CallApi = async (method, table, body, query_params) => {
  const url = `${config.baseUrl}${config.stage}/${table}`;

  console.log(method, table, body, query_params, url);

  try {
    const token = await getToken();

    // Check for token error and handle
    if (token instanceof Error) {
      return <HandleTokenError error={token} />;
    }

    let response;
    switch (method) {
      case 'GET':
        response = await axios.get(url, {
          headers: {
            Authorization: token,
          },
          params: query_params,
        });
        break;
      case 'POST':
        response = await axios.post(url, body, {
          headers: {
            Authorization: token,
          },
        });
        break;
      case 'PUT':
        response = await axios.put(url, body, {
          headers: {
            Authorization: token,
          },
        });
        break;
      case 'DELETE':
        response = await axios.delete(url, {
          headers: {
            Authorization: token,
          },
          data: body,
        });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    console.log(response);
    return response;
  } catch (error) {
    console.error(`Error on ${method} request:`, error);
    const errorMessage = error.response.data.errorMessage;
    throw errorMessage;
  }
};

export const CallApiPromise = (method, table, body, query_params) => {
  return new Promise(async (resolve, reject) => {
    const url = `${config.baseUrl}${config.stage}/${table}`;

    console.log(method, table, body, query_params, url);

    try {
      const token = await getToken();

      // Check for token error and handle
      if (token instanceof Error) {
        return reject(new HandleTokenError({ error: token }));
      }

      let response;
      switch (method) {
        case 'GET':
          response = await axios.get(url, {
            headers: {
              Authorization: token,
            },
            params: query_params,
          });
          break;
        case 'POST':
          response = await axios.post(url, body, {
            headers: {
              Authorization: token,
            },
          });
          break;
        case 'PUT':
          response = await axios.put(url, body, {
            headers: {
              Authorization: token,
            },
          });
          break;
        case 'DELETE':
          response = await axios.delete(url, {
            headers: {
              Authorization: token,
            },
            data: body,
          });
          break;
        default:
          reject(`Unsupported method: ${method}`);
      }

      console.log('CallApiPromise response', response);
      resolve(response);
    } catch (error) {
      console.error(`Error on ${method} request:`, error);
      const errorMessage =
        error.response?.data?.errorMessage || 'Unknown error';
      reject(errorMessage);
    }
  });
};

export default CallApi;
