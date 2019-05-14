import assert from 'assert'
import polyfill from "@babel/polyfill"
import api from '../src/api'

describe('#find()', function() {
    it('respond with matching records', async function() {
      for (let key of Object.keys(api)) {
        console.log('api', key)
      }
      let response = await api.getuser()
      assert(response !== null)
    });
});