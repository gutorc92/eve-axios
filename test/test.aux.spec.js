import assert from 'assert'
import polyfill from "@babel/polyfill"
import {ApiConfig} from '../src/configApi'

describe('#teste api config', function() {
    it('#basic methods', async function() {
      let config = {
        "url": "user/admin/test",
        "type": "eve",
        "methods": ["POST", "GET"]
      }
      let objConfig = new ApiConfig(config)
      assert(objConfig.hasMethod('POST') === true, )
      assert(objConfig.hasMethod('GET') === true)
      assert.deepEqual(objConfig.methodName('GET'), 'getUserAdminTest')
      assert.deepEqual(objConfig.isEveGet('GET'), true)
      assert.deepEqual(objConfig.parametersList(), [])
      assert.deepEqual(objConfig.getUrl({}), 'user/admin/test')
    });
    it('#parameter methods', async function() {
      let config = {
        "url": "user/{name}",
        "type": "eve",
        "methods": ["POST", "GET"]
      }
      let objConfig = new ApiConfig(config)
      assert(objConfig.hasMethod('POST') === true, )
      assert(objConfig.hasMethod('GET') === true)
      assert.deepEqual(objConfig.methodName('GET'), 'getUserName')
      assert.deepEqual(objConfig.isEveGet('GET'), true)
    });
    it('#list parameteres', async function() {
      let config = {
        "url": "user/{name}/{id}",
        "type": "eve",
        "methods": ["POST", "GET"]
      }
      let objConfig = new ApiConfig(config)
      assert.deepEqual(objConfig.parametersList(), ['name', 'id'])
      assert.deepEqual(objConfig.getUrl({name: 'teste', id: 1}), 'user/teste/1')
    });
});

