import BrowserCache from './browsercache';

describe('BrowserCache', () => {
  let bcache;
  let storageStub;
  const module = 'unittest';
  const version = '1.0.0';
  beforeEach(() => {
    const cache = {};
    storageStub = {
      getItem: (key) => cache[key],
      setItem: (key, value) => { cache[key] = value; },
      removeItem: (key) => delete cache[key],
    };
    bcache = new BrowserCache(module, version);
    bcache.connectStorage(storageStub);
  });

  describe('behaves like a cache', () => {
    it('can set items', () => {
      bcache.setItem('foo', 'bar');
      expect(bcache.getItem('foo')).toEqual('bar');
    });

    it('can remove items', () => {
      bcache.setItem('foo', 'bar');
      bcache.removeItem('foo');
      expect(bcache.getItem('foo')).toBeUndefined();
    });

    it('can clear items', () => {
      bcache.setItem('foo', 'bar');
      bcache.setItem('baz', 'qux');
      bcache.clear();
      expect(bcache.getItem('foo')).toBeUndefined();
      expect(bcache.getItem('baz')).toBeUndefined();
    });
  });

  describe('invalidates cache on setting on the different version in the same module', () => {
    let newCache;
    beforeEach(() => {
      bcache.setItem('foo', 'bar');
      bcache.setItem('baz', 'qux');
      newCache = new BrowserCache(module, '1.0.1');
      newCache.connectStorage(storageStub);
    });

    it('invalidates the cache', () => {
      expect(bcache.getItem('foo')).toBeUndefined();
      expect(bcache.getItem('bar')).toBeUndefined();
      expect(newCache.getItem('foo')).toBeUndefined();
      expect(newCache.getItem('bar')).toBeUndefined();
    });
  });

  describe('modularizes the storage', () => {
    let bcache2;
    beforeEach(() => {
      bcache2 = new BrowserCache('unittest2', '1.0.0');
      bcache2.connectStorage(storageStub);
    });

    it('can isolate the setting of items', () => {
      bcache.setItem('foo', 'bar');
      bcache2.setItem('foo', 'baz');
      expect(bcache.getItem('foo')).toEqual('bar');
      expect(bcache2.getItem('foo')).toEqual('baz');
    });

    it('can isolate the removal of items', () => {
      bcache.setItem('foo', 'bar');
      bcache2.setItem('foo', 'baz');
      bcache.removeItem('foo');

      bcache.setItem('bar', 'baz');
      bcache2.setItem('bar', 'qux');
      bcache2.removeItem('bar');

      expect(bcache.getItem('foo')).toBeUndefined();
      expect(bcache2.getItem('foo')).toEqual('baz');
      expect(bcache.getItem('bar')).toEqual('baz');
      expect(bcache2.getItem('bar')).toBeUndefined();
    });

    it('can isolate the clearing of the cache', () => {
      bcache.setItem('foo', 'bar');
      bcache.setItem('bar', 'baz');
      bcache2.setItem('foo', 'baz');
      bcache2.setItem('bar', 'qux');
      bcache.clear();
      expect(bcache.getItem('foo')).toBeUndefined();
      expect(bcache.getItem('bar')).toBeUndefined();
      expect(bcache2.getItem('foo')).toEqual('baz');
      expect(bcache2.getItem('bar')).toEqual('qux');

      bcache.setItem('foo', 'bar');
      bcache.setItem('bar', 'baz');
      bcache2.clear();
      expect(bcache2.getItem('foo')).toBeUndefined();
      expect(bcache2.getItem('bar')).toBeUndefined();
      expect(bcache.getItem('foo')).toEqual('bar');
      expect(bcache.getItem('bar')).toEqual('baz');
    });
  });
});
