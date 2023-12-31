
function getKey(key) {
  return 'ZIKAO_' + key
}

export function getItem(key) {
  let value = localStorage.getItem(getKey(key))
  try {
    value = JSON.parse(value)
    return value
  } catch (error) {
    console.log(error)
  }
  return value;
}


export function setItem(key, value) {
  return localStorage.setItem(getKey(key), JSON.stringify(value))
}

export class StorageUtil {
  constructor(key, defaultVal) {
    this.defaultVal = defaultVal || {}
    this.key = getKey(key)
  }
  getValue() {
    return getItem(this.key) || this.defaultVal
  }
  setValue(value) {
    return setItem(this.key, value)
  }

  merge(value) {
    const oldValue = this.getValue()
    const newValue = Object.assign({}, oldValue, value)
    return this.setValue(newValue)
  }

  remove() {
    localStorage.removeItem(this.key)
  }
}

export const answerStorage = new StorageUtil('USER_ANSWER')