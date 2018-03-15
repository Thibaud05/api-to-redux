import 'whatwg-fetch'

class API
{
    constructor(resourceName)
    {
        this.url = 'https://api.awesome.com/'
        this.resourceType = '_' + resourceName.toUpperCase()
        this.ressourceUrl = this.url + resourceName + '/'
    }

    fetchResource()
    {
        return (dispatch) => {
            dispatch(this.requestResource())
            return fetch(this.ressourceUrl)
                .then(
                    response => response.json(),
                    error => console.log('An error occurred.', error)
                )
                .then(json =>
                    dispatch(this.receiveResource(json))
                )
        }
    }
    requestResource()
    {
        return {
            type: 'REQUEST' + this.resourceType,
            loading : true
        }
    }
    receiveResource(data)
    {
        return {
            type: 'RECEIVE' + this.resourceType,
            data : data,
            loading : false
        }
    }



    addResource(resource)
    {
        return (dispatch) => {
            return fetch(this.ressourceUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(resource)
            })
                .then(response => response.json())
                .then(json => {
                    dispatch(this.addResourceSuccess(json))
                })
                .catch(ex => console.log('parsing failed', ex))
        }
    }
    addResourceSuccess(data)
    {
        return {
            type: 'CREATE' + this.resourceType,
            payload : data
        }
    }


    updateResource(resource)
    {
        return (dispatch) => {
            return fetch(this.ressourceUrl + resource.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resource)
            })
                .then(response => response.json())
                .then(json => {dispatch(this.updateResourceSuccess(json))})
                .catch(ex => console.log('parsing failed', ex))
        }
    }
    updateResourceSuccess (company)
    {
        return {
            type: 'UPDATE' + this.resourceType,
            payload : company
        }
    }


    deleteResource(id)
    {
        return (dispatch) => {
            return fetch(this.ressourceUrl + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(json => {dispatch(this.deleteResourceSuccess(id))})
                .catch(ex => console.log('parsing failed', ex))
        }
    }
    deleteResourceSuccess(id)
    {
        return {
            type: 'REMOVE' + this.resourceType,
            payload : id
        }
    }

}

export default API
