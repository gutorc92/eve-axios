import assert from 'assert'
import polyfill from "@babel/polyfill"
import QueryBuilder from '../dist/mongoBuilder'

describe('empty query', function() {
    it('respond with empty string', function() {
     let query = {}
     assert.deepEqual(QueryBuilder(query), '{}', 'not compiled')
    });
  });
  
  