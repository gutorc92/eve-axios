import assert from 'assert'
import polyfill from "@babel/polyfill"
import Api from '../src'
import config from './configAxiosEve.json'


let api = new Api({
  urls: config,
  baseURL: "http://localhost:8000",
  headers: {
    "Cache-Control": "no-cache"
  },
  auth: {
      username: process.env.USER_API || null,
      password: process.env.PASS || ''
  },
  timeout: 1500
});

if (process.env.TOKEN) {
  api.addToken(process.env.TOKEN);
}

describe('Test root', function () {
    it("# get root", async function() {
      try {
        let response = await api.get('/');
        assert(response !== null);
        assert(
          response.data !== undefined,
          `data is not in response, ${response.code}`
        );
      } catch (err) {
        assert(true === false, err);
      }
    });
    it("# get routes", async function() {
      try {
        let response = await api.get("/");
        assert(response !== null);
        let links = response.data._links.child.map(x => x.href);
        assert(links.length > 0);
      } catch (err) {
        assert(true === false, err);
      }
    });
    it("# check HATEOAS", async function() {
      try {
        let response = await api.get("/");
        response = await api.getEntity({ max: 3, sort: "-teste,_created", page:4 });
        assert(response !== null);
        let meta = response.data._meta;
        assert(meta.max_results === 3);
        assert(meta.page === 4);
      } catch (err) {
        assert(true === false, err);
      }
    });
    it("# check links", async function () {
      try {
        let response = await api.get("/");
        let links = response.data._links.child.map(x => x.href);
        response = await api._get(links[1],{ max: 3, sort: "-teste,_created", page: 4, aggregate:{"teste":1} });
        assert(response !== null);
        let _links = response.data._links;
        assert(_links.parent.href === '/');
      } catch (err) {
        assert(true === false, err);
      }
    });
    it("# get all", async function () {
      try {
        let response = await api.get("/");
        let links = response.data._links.child.map(x => x.href);
        let data = await api.getAll(links[1], { max: 3, sort: "-teste,_created", aggregate: { "teste": 1 } });
        assert(data !== null);
      } catch (err) {
        assert(true === false, err);
      }
    });
})



describe('Test methods exists', function() {
    it('# get by id', async function() {
      assert.notEqual(-1, Object.keys(api).indexOf('getAreaById'))
    });
});

describe('Axios get', function() {
  it('# respond a normal get', async function() {
    try {
      let response = await api.get('areas')
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
    } catch (err) {
      assert(true, false, err)
    }
  });
});

describe('Post', function() {
  it('response with created', async function() {
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
      const data = response.data
      response = await api.deleteUserAdmin({id: data['_id'], etag: data['_etag']})
      assert.deepEqual(response.status, 204, 'deleting working well')
    } catch (err) {
      assert(true===false, err)
    }
  });
});

describe('Put', function() {
  it('response with updated', async function() {
    try {
      let user = {
        email: 'teste1@teste.com',
        name: 'Testando'
      }
      let response = await api.postUserAdmin(user)
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
      assert(response.data._meta !== null, 'meta is not in response data')
      response = await api.getUserById({id: response.data['_id']})
      assert.deepEqual(response.status, 200, 'get working well')
      const data = response.data
      user = {name: 'Teste', email: 'teste1@teste.com'}
      response = await api.putUserAdmin({id: data['_id'], etag: data['_etag'], data: user})
      assert.deepEqual(response.status, 200, 'put working well')
    } catch (err) {
      assert(true===false, err)
    }
  });
});

describe('Authorization', function() {
  it('response 200', async function() {
    try {
      // api.addToken('123456')
      let response = await api.get("/");
      assert.deepEqual(response.status, 200, 'authentication')
      // api.unsetToken()
      // console.log(response.config.headers)
      // api.get("/").catch( error => {
      //   console.log(error);
      // })
      // assert.deepEqual(response2.status, 401, 'unset token')
    } catch (err) {
      assert(true===false, err)
    }
  });
});

describe('patch', function() {
  it('responde with updated', async function() {
    try {
      let user = {
        email: 'teste2@teste.com',
        name: 'Testando'
      }
      api.addToken('123456')
      api.unsetToken()
      let response = await api.postUserAdmin(user)
      assert(response !== null)
      assert(response.data !== undefined, 'data is not in response')
      assert(response.data._meta !== null, 'meta is not in response data')
      response = await api.getUserById({id: response.data['_id']})
      assert.deepEqual(response.status, 200, 'get working well')
      const data = response.data
      user = {name: 'Teste'}
      response = await api.patchUserAdmin({id: data['_id'], etag: data['_etag'], data: user})
      assert.deepEqual(response.status, 200, 'patch working well')
    } catch (err) {
      assert(true===false, err)
    }
  });
});

describe('Aggreation', function() {
  it('response 200', async function() {
    try {
      let response = await api.getAgPlanCount({
        aggregate: {'$value': ['teste']}
      })
      assert(response.config.url.match(/aggregate=/) !== null)
    } catch (err) {
      assert(true===false, err)
    }
  });
  it('responde 200 method name', async function() {
    try {
      let response = await api.planCount({
        aggregate: {'$value': ['teste']}
      })
      assert(response.config.url.match(/aggregate=/) !== null)
    } catch (err) {
      assert(true===false, err)
    }
  });
});