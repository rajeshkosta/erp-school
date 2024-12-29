const DICT = "EDU_APP_PREFERENCES";

const setValue = (a_key, a_value) => {
  let key = `${DICT}.${a_key}`;
  sessionStorage.setItem(key, a_value);
};

const getValue = (a_key) => {
  let key = `${DICT}.${a_key}`;
  let data = sessionStorage.getItem(key);
  return data;
};

const removeKey = (a_key) => {
  let key = `${DICT}.${a_key}`;
  sessionStorage.removeItem(key);
};

const clearAll = () => {
  sessionStorage.clear();
};

export { setValue, getValue, clearAll, removeKey };
