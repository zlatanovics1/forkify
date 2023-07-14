import { TIMEOUT_SEC } from './config.js';

const timeout = function (sec) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request took too long')), sec * 1000)
  );
};

export const AJAX = async function (url, sendData = undefined) {
  try {
    const fetchPromise = sendData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async function (url, sendData) {
//   try {
//     const fetchPromise = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(sendData),
//     });
//     const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
