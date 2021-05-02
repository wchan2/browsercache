export default class BrowserCache {
  /**
   * Creates a browser cache instead with the associated module name and its corresponding version
   * @param {string} module
   * @param {string} version
   */
  constructor(module, version) {
    this.module = module.toUpperCase();
    this.version = version;
  }

  /**
   * Connects to a storage implementation that implements the methods getItem, setItem and removeItem
   * @param storage
   */
  connectStorage(storage = localStorage) {
    this.storage = storage;
    if (this.shouldInvalidate()) {
      this.clear();
    }
  }

  /**
   * Retrieves an value stored via key
   * @param {string} key - the key that was previously used to store a string value
   * @returns {string}
   */
  getItem(key) {
    return this.storage.getItem(this.managedKey(key));
  }

  /**
   * Stores a value via a key
   * @param {string} key
   * @param {string} value
   */
  setItem(key, value) {
    this.storage.setItem(this.managedKey(key), value);
  }

  /**
   * Removes the value stored with key
   * @param {string} key
   */
  removeItem(key) {
    this.storage.removeItem(this.managedKey(key));
  }

  clear() {
    const managedKeys = this.getManagedKeys();
    managedKeys.forEach((key) => this.storage.removeItem(key));
    this.storage.removeItem(this.managedKeysKey());
  }

  shouldInvalidate() {
    const version = this.storage.getItem(this.module);
    return this.version !== version;
  }

  managedKey(key) {
    const managedKey = `${this.module}.${key}`;
    this.addManagedKey(managedKey);
    return managedKey;
  }

  getManagedKeys() {
    return JSON.parse(this.storage.getItem(this.managedKeysKey()) || '[]');
  }

  addManagedKey(managedKey) {
    const managedKeys = this.getManagedKeys();
    const managedKeySet = new Set(managedKeys);
    managedKeySet.add(managedKey);
    this.storage.setItem(this.managedKeysKey(), JSON.stringify([...managedKeySet]));
  }

  managedKeysKey() {
    return `${this.module}_MANAGED_KEYS`;
  }
}
