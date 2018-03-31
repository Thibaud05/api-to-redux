import 'whatwg-fetch'

class API
{
    constructor(resourceName)
    {
        this.url = 'https://api.awesome.com/'
       this.resourceName = resourceName
        this.resourceType = '_' + resourceName.toUpperCase()
        this.ressourceUrl = this.url + resourceName + '/'
    }

    nested(resourceName,resourceId){
        this.ressourceUrl = this.url + resourceName + '/' + resourceId + '/' + this.resourceName + '/'
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

    addResource(resource,useJson = true)
    {
        return (dispatch) => {
            let param = {
                method: 'POST',
                body: resource
            }
            if(useJson){
                param.headers = {'Content-Type': 'application/json'}
                param.body = JSON.stringify(resource)
            }else{
                param.body = this.objToFormData(resource)
            }
            return fetch(this.ressourceUrl, param)
                .then(response => response.json())
                .then(json => {dispatch(this.addResourceSuccess(json))})
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

    updateResource(resource,useJson = true)
    {
        return (dispatch) => {
            let param = {
                method: 'PUT',
                body: resource
            }
            if(useJson){
                param.headers = {'Content-Type': 'application/json'}
                param.body = JSON.stringify(resource)
            }else{
                param.body = this.objToFormData(resource)
            }
            return fetch(this.ressourceUrl + resource.id, param)
                .then(response => response.json())
                .then(json => {dispatch(this.updateResourceSuccess(json))})
                .catch(ex => console.log('parsing failed', ex))
        }
    }
    
    updateResourceSuccess (resource)
    {
        return {
            type: 'UPDATE' + this.resourceType,
            payload : resource
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

    objToFormData(obj){
        let formData = new FormData()
        for (let props in obj){
            if (obj.hasOwnProperty(props))
                formData.append(props, obj[props])

        }
        return formData
    }
}
export default API
