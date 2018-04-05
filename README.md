# api-to-redux
A simple class for consume REST API in React with Redux

## Requirements
- React
- Redux
- Redux-thunk
- Whatwg-fetch
- redux-mock-store
- fetch-mock

# How use it ?
## Fetch, create, update and remove a ressource

First define your url and version in `apiConfig.js`

```javascript
let apiCompany = new API('companies')

apiCompany.fetchResource()
// HTTPS GET api.awesome.com/companies, dispatch REQUEST_COMPANIES and RECEIVE_COMPANIES

apiCompany.addResource({name:'Amazon'})
// HTTPS POST api.awesome.com/companies and dispatch CREATE_COMPANIES

apiCompany.updateResource({id:1,name:'Google'})
// HTTPS PUT api.awesome.com/companies and dispatch UPDATE_COMPANIES

apiCompany.deleteResource(1)
// HTTPS DELETE api.awesome.com/companies/1 and dispatch REMOVE_COMPANIES
```
## Nested route
```javascript
// Create an api resource
let apiLeaders = new API('leaders')
```

```javascript
apiLeaders.nested('companies',1)
apiLeaders.fetchResource()
// HTTPS GET api.awesome.com/companies/1/leaders
// return an action REQUEST_LEADERS
// return an action RECEIVE_LEADERS
```

```javascript
apiLeaders.nested('companies',1)
apiLeaders.addResource({name:'Larry Page'})
// HTTPS POST api.awesome.com/companies/1/leaders
// return an action CREATE_LEADERS
```

```javascript
apiLeaders.nested('companies',1)
apiLeaders.updateResource({id:1,name:'Sundar Pichai'})
// HTTPS PUT api.awesome.com/companies/1/leaders
// return an action UPDATE_LEADERS
```

```javascript
apiLeaders.nested('companies',1)
apiLeaders.deleteResource(1)
// HTTPS DELETE api.awesome.com/companies/1/leaders/1
// return an action REMOVE_LEADERS
```

## File upload
- Todo

## JWT authentification
- Todo
