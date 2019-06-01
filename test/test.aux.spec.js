import assert from 'assert'
import polyfill from "@babel/polyfill"
import {ApiConfig} from '../src/aux'

describe('#teste api config', function() {
    it('#basica methods', async function() {
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
    });
});