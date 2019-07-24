import assert from 'assert'
import polyfill from "@babel/polyfill"
import Api from '../src'
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
    it('#get area', async function() {
      try {
        let response = await api.getArea({})
        assert(response !== null)
        assert(response.data !== undefined, 'data is not in response')
      } catch (err) {
        assert(true === false, err)
      }
    });
    it('#get questions', async function() {
      let response = await api.getQuestions({})
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
    });
    it('# get by id', async function() {
      assert.notEqual(-1, Object.keys(api).indexOf('getAreaById'))
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
  it('sort parameter', async function() {
    try {
      let response = await api.getUser({sort: {name: 1}})
      assert(response !== null)
      assert('data' in response, 'data is not in response')
      assert('_meta' in response.data, 'meta is not in response data')
      assert('total' in response.data._meta, 'total is not in response data meta')
      assert(response.data._meta.total, 3, 'It did not get three results')
      assert.deepEqual(response.data._items[0].name, 'Abraham Lincoln')
    } catch (err) {
      assert(true === false, err)
    }
  });
  it('parameter on url', async function() {
    try {
      let response = await api.getAreaName({name: 'IDP'})
      assert(response !== null)
      assert('data' in response, 'data is not in response')
      assert('_meta' in response.data, 'meta is not in response data')
      assert('total' in response.data._meta, 'total is not in response data meta')
      assert.deepEqual(response.data._meta.total, 1, 'It did not get one results')
      assert.deepEqual(response.data._items[0].name, 'IDP')
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
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
      assert(response.data._meta !== null, 'meta is not in response data')
      response = await api.getUserById({id: response.data['_id']})
      assert.deepEqual(response.status, 200, 'get working well')
    } catch (err) {
      assert(true===false, err)
    }
  });
});

describe('authorization', function() {
  it('responde 200', async function() {
    try {
      api.addToken('123456')
      let response = await api.getStyle({})
      console.log('response', response)
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
      assert(response.data._meta !== null, 'meta is not in response data')
    } catch (err) {
      assert(true===false, err)
    }
  });
});