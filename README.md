# api-to-redux
A simple class for consume REST API in React with Redux

## Requirements
- React
- Redux
- Redux-thunk
- Whatwg-fetch

# How use it ?
## Fetch, create, update and remove a ressource

```javascript
// Create an api resource
let apiCompany = new API('companies')
```

```javascript
// HTTPS GET api.awesome.com/companies
apiCompany.fetchResource()
// return an action REQUEST_COMPANIES
// return an action RECEIVE_COMPANIES
```

```javascript
// HTTPS POST api.awesome.com/companies
apiCompany.addResource({name:'Amazon'})
// return an action CREATE_COMPANIES
```

```javascript
// HTTPS PUT api.awesome.com/companies
apiCompany.updateResource({id:1,name:'Google'})
// return an action UPDATE_COMPANIES
```

```javascript
// HTTPS DELETE api.awesome.com/companies
apiCompany.deleteResource(1)
// return an action REMOVE_COMPANIES
```
## Nested route
- Todo

## File upload
- Todo

## JWT authentification
- Todo

## Todo
- Add authentification
