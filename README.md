# api-to-redux
A simple class for consume REST API in React with Redux

# How use it ?

```javascript
// Create an api resource
let apiCompany = new API('companies')
```

```javascript
// HTTPS GET api.awesome.com/companies
apiCompany.fetchResource()
```

```javascript
// HTTPS POST api.awesome.com/companies
apiCompany.addResource({name:'Amazon'})
```

```javascript
// HTTPS PUT api.awesome.com/companies
apiCompany.updateResource({id:1,name:'Google'})
```

```javascript
// HTTPS DELETE api.awesome.com/companies
apiCompany.deleteResource(1)
```
