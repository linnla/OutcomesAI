import axios from 'axios';

export async function getPatientsByChartID(chartID) {
  // Usage example

  const url = `${config.baseUrl}${config.stage}/${table}`;
  const url = 'https://outcomesaidrchrono.com/api/patients';
  const fields = { chart_id: chartID };
  getList(url, fields)
    .then((items) => {
      if (items) {
        console.log('Items:', items);
      } else {
        console.log('Failed to retrieve items.');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getAccessToken() {
  // Define your constants or functions for retrieving tokens and secrets
  const refreshToken = 'pUtwtFAoHM9OfVxNKZ5JTFgKx15dHB';
  const clientId = 'bQWG7dyDDqYh3WB3sU6DyYAoZzzw7fo3laSwWdu8';
  const clientSecret =
    'Ji9lvSd2Asz5zcj719luYGLEAn3nCZ3rjA8bCFnGgoMAElpLHowowYEUX5jrFBhGDLJa3tiKhvArVjmASCFOl46lCWYeMGlRe5FW17EP6VOgQcfTzQPAlQBrV6VGRn7V';

  const fields = new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const url = 'https://drchrono.com/o/token';

  try {
    const response = await axios.post(url, fields, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status !== 200) {
      console.error(`Status code ${response.status} returned for ${url}`);
      return null;
    } else {
      const accessToken = response.data.access_token;
      return accessToken;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getList(url = null, fields = null) {
  const accessToken = await getAccessToken();

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const method = 'GET';

  const items = [];

  // On the initial request, pass the fields
  let response;
  if (!fields) {
    response = await axios.get(url, {
      headers,
    });
  } else {
    response = await axios.get(url, {
      headers,
      params: fields,
    });
  }

  if (response.status === 200) {
    const responseJson = response.data;

    let results;
    if ('results' in responseJson) {
      results = responseJson.results;
    } else if ('data' in responseJson) {
      results = responseJson.data;
    }

    items.push(...results);
    url = responseJson.next;
  } else {
    drchronoHttpErrorCode(response.status, url);
    console.log(response);
    return null;
  }

  while (url) {
    response = await axios.get(url, {
      headers,
    });

    if (response.status === 200) {
      const responseJson = response.data;
      const results = responseJson.results;
      items.push(...results);
      url = responseJson.next;
    } else {
      drchronoHttpErrorCode(response.status, url);
      console.log(response);
      return null;
    }
  }

  return items;
}

function drchronoHttpErrorCode(status, url) {
  switch (status) {
    case 400:
      console.error(`response.status ${status} bad request for ${url}`);
      console.log(`response.status ${status} bad request for ${url}`);
      break;
    case 401:
      console.error(`response.status ${status} invalid parameter for ${url}`);
      console.log(`response.status ${status} invalid parameter for ${url}`);
      break;
    case 403:
      console.error(
        `response.status ${status} drchrono permissions issue ${url}`
      );
      console.log(
        `response.status ${status} drchrono permissions issue ${url}`
      );
      break;
    case 429:
      console.error(
        `response.status ${status} drchrono API limit reached for ${url}`
      );
      console.log(
        `response.status ${status} drchrono API limit reached for ${url}`
      );
      break;
    default:
      console.error(`response.status ${status} for ${url}`);
      console.log(`response.status ${status} for ${url}`);
  }
}
