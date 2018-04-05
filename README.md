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

```javascript
// Create an api resource
let apiCompany = new API('companies')
```

```javascript
apiCompany.fetchResource()
// HTTPS GET api.awesome.com/companies
// return an action REQUEST_COMPANIES
// return an action RECEIVE_COMPANIES
```

```javascript
apiCompany.addResource({name:'Amazon'})
// HTTPS POST api.awesome.com/companies
// return an action CREATE_COMPANIES
```

```javascript
apiCompany.updateResource({id:1,name:'Google'})
// HTTPS PUT api.awesome.com/companies
// return an action UPDATE_COMPANIES
```

```javascript
apiCompany.deleteResource(1)
// HTTPS DELETE api.awesome.com/companies/1
// return an action REMOVE_COMPANIES
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
