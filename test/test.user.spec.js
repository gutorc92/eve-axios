import assert from 'assert'
import polyfill from "@babel/polyfill"
import Api from '../src/'
import config from './configAxiosEve.json'


let api = new Api({
  urls: config,
  baseURL: 'http://localhost:8000',
  headers: {
      'Cache-Control': 'no-cache'
  },
  auth: {
      username: process.env.USER_API || 'admin',
      password: process.env.PASS || 'admin'
  },
  timeout: 1500
})


describe('#teste methods exists', function() {
    it('#find area', async function() {
      try {
        let response = await api.getArea({})
        assert(response !== null)
        assert(response.data !== undefined, 'data is not in response')
        // assert(response.code !== 'ECONNABORTED', 'aborted with timeout')
        // assert(response.data !== undefined, "didn't get a valid response")
      } catch (err) {
        assert(true === false, err)
      }
    });
    it('#find questions', async function() {
      let response = await api.getQuestions({})
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
    });
});
  
describe('#parameters', function() {
    it('respond with page required', async function() {
      try {
        let response = await api.getQuestions({page: 2})
        assert(response !== null)
        assert(response.data !== undefined, 'data is not in response')
        assert(response.data._meta !== null, 'meta is not in response data')
        assert('page' in response.data._meta, 'page is not in response data meta')
        assert(response.data._meta.page, 2, 'It did not get page 2')
      } catch (err) {
        assert(true, false, err)
      }
  });
  it('respond with where required', async function() {
    let emails = ['test1@teste.com', 'test2@teste.com']
    let query = {
      email: {$in: emails }
    }
    try {
      let response = await api.getUser({where: query})
      assert(response !== null)
      assert('data' in response, 'data is not in response')
      assert('_meta' in response.data, 'meta is not in response data')
      assert('total' in response.data._meta, 'total is not in response data meta')
      assert(response.data._meta.total, 2, 'It did not get two results')
    } catch (err) {
      assert(true === false, err)
    }
  });
});

describe('post', function() {
  it('responde with created', async function() {
    try {
      let user = {
        email: 'teste@teste.com',
        name: 'Testando'
      }
      let response = await api.postUserAdmin(user)
      // console.log('response find questions page', response)
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
      assert(response.data._meta !== null, 'meta is not in response data')
    } catch (err) {
      assert(true===false, err)
    }
  });
});