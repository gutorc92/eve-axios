import QueryBuilder from './mongoBuilder'
import isEmpty from 'lodash.isempty'

let getCollection = ({
  url,
  where = {},
  page = undefined,
  max = undefined,
  sort = undefined,
  embedded = undefined,
  projection = undefined,
  aggregate = undefined
}) => {
    const queryString = require("query-string");
    let queryObject = {};
    if (!isEmpty(where)) {
        queryObject.where = QueryBuilder(where);
    }
    if (aggregate) {
        queryObject.aggregate = QueryBuilder(aggregate);
    }
    queryObject.projection = projection;
    queryObject.max_results = max;
    queryObject.page = page;
    queryObject.embedded = embedded;
    if (sort) {
        if (typeof sort === "object") {
        const parseSort = (str, sign = 1) => (sign > 0 ? str : "-" + str);
        const fields = Object.keys(sort).map(key => parseSort(key, sort[key]));
        sort = fields.join(",");
        }
        queryObject.sort = sort;
    }
    let query = queryString.stringify(queryObject)
    if (query) {
      return ("/" + url + "?" + query).replace(
        "//",
        "/"
      );
    } else {
      return ("/" + url).replace(
        "//",
        "/"
      );
    }
};


export {getCollection}