# eve-axios

Promise based HTTP client for api build up on [eve-framework](https://docs.python-eve.org/)

## Installing

Using npm:

```bash
$ npm install axios
```

## Example

```js

// declare endpoits
let config =  [
        {
            "url": "area",
            "type": "eve",
            "methods": ["GET"]
        },
        {
            "url": "questions",
            "type": "eve",
            "methods": ["GET"]
        },
        {
            "url": "user",
            "type": "eve",
            "methods": ["GET"]
        },
        {
            "url": "user/admin",
            "type": "eve",
            "methods": ["POST"]
        },
        {
            "url": "area/{name}",
            "type": "eve",
            "methods": ["GET"] 
        }
    ]

let api = new Api({
  urls: config,
  baseURL: 'http://localhost:8000',
  headers: {
      'Cache-Control': 'no-cache'
  },
  timeout: 1500
})

// return areas
api.getArea({})

// return page 2 
api.getQuestions({page: 2})

// sort by name
api.getUser({sort: {name: 1}})

```