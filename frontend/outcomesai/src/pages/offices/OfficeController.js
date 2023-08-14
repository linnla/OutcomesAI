/*
This is a file for only communication interface with a server.
In real developing you should delete "virtual axios" parts in this file
and use real axios parts alternatively.
*/

// import axios from "controllers/axios"

let rows = [
  {
    id: 1,
    name: 'Manhattan Beach',
    virtual: 'No',
    postal_code: '90266',
    city: 'Manhattan Beach',
    state: 'CA',
    status: 'Active',
  },
  {
    id: 2,
    name: 'South Torrance',
    virtual: 'No',
    postal_code: '90505',
    city: 'Torrance',
    state: 'CA',
    status: 'Active',
  },
  {
    id: 3,
    name: 'North Torrance',
    virtual: 'No',
    postal_code: '90504',
    city: 'Torrance',
    state: 'CA',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Santa Monica',
    virtual: 'No',
    postal_code: '90405',
    city: 'Santa Monica',
    state: 'CA',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Beverly Hills',
    virtual: 'No',
    postal_code: '90211',
    city: 'Beverly Hills',
    state: 'CA',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Westlake Village',
    virtual: 'No',
    postal_code: '91362',
    city: 'Westlake Village',
    state: 'CA',
    status: 'Active',
  },
];

const getAll = () => {
  //real axios
  // return axios.get('/seller', {});

  //virtual axios
  return new Promise((resolve, reject) => {
    const res = { data: rows };
    resolve(res);
  });
};

const saveRow = (row) => {
  console.log(row);

  //real axios
  // return axios.patch('/seller', row);

  //virtual axios
  return new Promise((resolve, reject) => {
    if (row.isNew) rows.push(row);
    else rows = rows.map((r) => (r.id === row.id ? row : r));
    resolve({ data: row });
  });
};

const deleteRow = (rowId) => {
  console.log(rowId);
  //real axios
  // return axios.delete(`/seller/${rowId}`);

  //virtual axios
  return new Promise((resolve, reject) => {
    const deletedRow = rows.find((r) => r.id === rowId);
    rows = rows.filter((r) => r.id !== rowId);
    resolve({ data: deletedRow });
  });
};

const OfficeController = {
  getAll,
  saveRow,
  deleteRow,
};

export default OfficeController;
