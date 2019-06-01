import assert from 'assert'
import polyfill from "@babel/polyfill"
import api from '../src/api'

describe('#find users ()', function() {
    it('respond with matching records', async function() {
      let response = await api.getUser({ max: 4})
      assert(response !== null)
      assert(response.code !== 'ECONNABORTED', 'aborted with timeout')
      assert(response.data !== undefined, "didn't get a valid response")
    });
  });
  
  describe('#find questions', function() {
    it('respond with matching records', async function() {
      let response = await api.getQuestions({})
      // console.log('response find questions', response)
      assert(response !== null)
    });
  });
  
  describe('#parameters', function() {
    it('respond with page required', async function() {
      let response = await api.getQuestions({page: 2})
      // console.log('response find questions page', response)
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
      assert(response.data._meta !== null, 'meta is not in response data')
      assert('page' in response.data._meta, 'page is not in response data meta')
      assert(response.data._meta.page, 2, 'It did not get page 2')
  });
});

describe('#where builder parameter', function() {
  it('respond with page required', async function() {
    let emails = ['gutorc@hotmail.com', 'ziul@ziul.com']
    let query = {
      email: {$in: emails }
    }
    let response = await api.getUser({where: query})
    assert(response !== null)
    assert('data' in response, 'data is not in response')
    assert('_meta' in response.data, 'meta is not in response data')
    assert('total' in response.data._meta, 'total is not in response data meta')
    assert(response.data._meta.total, 2, 'It did not get two results')
  });
});