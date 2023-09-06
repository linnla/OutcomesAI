import CallApi, { CallApiPromise } from '../../api/CallApi';
import { validateRequiredAttributes } from '../../utils/ValidationUtils';

export const validateRow = (newRow, oldRow, isNew) => {
  const requiredAttributes = ['last_name', 'first_name', 'email'];
  const attributeNames = ['Last Name', 'First Name', 'Email'];

  return new Promise(async (resolve, reject) => {
    try {
      await validateRequiredAttributes(
        requiredAttributes,
        attributeNames,
        newRow
      );
      const updatedRow = {
        ...newRow,
      };
      resolve(updatedRow);
    } catch (error) {
      reject(error);
    }
  });
};

export const saveRow = (newRow, oldRow, isNew) => {
  return new Promise(async (resolve, reject) => {
    let method;
    if (isNew) {
      method = 'POST';
    } else {
      method = 'PUT';
    }

    try {
      const response = await CallApiPromise(
        method,
        'practitioners',
        newRow,
        null
      );
      let savedRow = {
        id: response.data.id,
        full_name: response.data.full_name,
        practice_id: newRow.practice_id,
        last_name: newRow.last_name,
        first_name: newRow.first_name,
        suffix: newRow.suffix,
        prefix: newRow.prefix,
        email: newRow.email,
      };
      if (isNew) {
        const newPractitioner = {
          practice_id: newRow.practice_id,
          practitioner_id: savedRow.id,
        };
        await CallApiPromise(
          method,
          'practice_practitioner',
          newPractitioner,
          null
        );
      }
      resolve(savedRow);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteRow = (rowId, rows) => {
  return new Promise(async (resolve, reject) => {
    console.log(rowId);

    try {
      await CallApi('DELETE', 'practitioners', { id: rowId }, null);
      const deletedRow = rows.find((r) => r.id === rowId);
      rows = rows.filter((r) => r.id !== rowId);

      resolve({ data: deletedRow });
    } catch (error) {
      reject(error);
    }
  });
};
