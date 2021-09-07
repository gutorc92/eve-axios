import assert from 'assert'
import polyfill from "@babel/polyfill"
import {ApiConfig} from '../dist/configApi'

describe('#teste api config', function() {
    it('#basic methods', async function() {
      let config = {
        "url": "user/admin/test",
        "type": "eve",
        "methods": ["POST", "GET"]
      }
      let objConfig = new ApiConfig(config)
      assert(objConfig.hasMethod('POST') === true, 'post method')
      assert(objConfig.hasMethod('GET') === true)
      assert.deepEqual(objConfig.methodName('GET'), 'getUserAdminTest')
      assert.deepEqual(objConfig.isEveGet('GET'), true)
      assert.deepEqual(objConfig.parametersList(), [])
      assert.deepEqual(objConfig.getUrl({}), 'user/admin/test')
      assert.deepEqual(objConfig.getUrlById({id: 2}), 'user/admin/test/2')
      assert.deepEqual(objConfig.hasByID(), true)
      assert.deepEqual(objConfig.methodNameById(), 'getUserAdminTestById')
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
        "methods": ["POST", "GET"],
        "byID": false
      }
      let objConfig = new ApiConfig(config)
      assert.deepEqual(objConfig.parametersList(), ['name', 'id'])
      assert.deepEqual(objConfig.hasByID(), false)
      assert.deepEqual(objConfig.getUrl({name: 'teste', id: 1}), 'user/teste/1')
    });
    it('#aggregate config', async function() {
      let config = {
        "url": "plan/count",
        "type": "eve/aggregate",
        "methods": ["GET"],
        "byID": false
      }
      let objConfig = new ApiConfig(config)
      assert.deepEqual(objConfig.methodName('GET'), 'getAgPlanCount')
      assert.deepEqual(objConfig.isAggregate('GET'), true)
      assert.deepEqual(objConfig.parametersList(), [])
      assert.deepEqual(objConfig.getUrl({}), 'plan/count')
    });
});

