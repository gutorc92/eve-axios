import assert from 'assert'
import polyfill from "@babel/polyfill"
import QueryBuilder from '../src/mongoBuilder'

describe('empty query', function() {
    it('respond with empty string', function() {
     let query = {}
     assert.deepEqual(QueryBuilder(query), '{}', 'not compiled')
    });
  });
  
  