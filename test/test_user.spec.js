import assert from 'assert'
import api from '../src/api'

describe('#find()', function() {
    it('respond with matching records', async function() {
      let response = await api.getUsers()
      assert(response !== null)
    });
});