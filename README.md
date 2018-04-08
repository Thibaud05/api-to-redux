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
let apiLeaders = new API('leaders')
apiLeaders.nested('companies',1)

apiLeaders.fetchResource()
// HTTPS GET api.awesome.com/companies/1/leaders, dispatch REQUEST_LEADERS and RECEIVE_LEADERS

apiLeaders.addResource({name:'Larry Page'})
// HTTPS POST api.awesome.com/companies/1/leaders and dispatch CREATE_LEADERS

apiLeaders.updateResource({id:1,name:'Sundar Pichai'})
// HTTPS PUT api.awesome.com/companies/1/leaders and dispatch UPDATE_LEADERS

apiLeaders.deleteResource(1)
// HTTPS DELETE api.awesome.com/companies/1/leaders/1 and dispatch REMOVE_LEADERS
```
## File upload
- Todo

## JWT authentification
- Todo
