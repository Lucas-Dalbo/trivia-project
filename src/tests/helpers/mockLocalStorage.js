// Referência de mock manual de localStorage;
// https://thewebdev.info/2022/02/24/how-to-mock-local-storage-in-jest-tests/
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key];
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();

export default localStorageMock;
