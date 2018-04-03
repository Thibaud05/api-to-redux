import 'whatwg-fetch'

class API
{
    constructor(resourceName)
    {
        this.url = 'https://api.awesome.com/'
        this.useJWT = useJWT
        this.resourceName = resourceName
        this.resourceType = '_' + resourceName.toUpperCase()
        this.ressourceUrl = this.url + resourceName + '/'
    }

    nested(resourceName,resourceId){
        this.ressourceUrl = this.url + resourceName + '/' + resourceId + '/' + this.resourceName + '/'
    }

    getToken(){
        return 'Bearer ' + localStorage.getItem("token")
    }

    setToken(token){
        localStorage.setItem('token', token);
    }

    login(credential)
    {
        return (dispatch) => {
            dispatch(this.requestResource())
            return fetch(this.ressourceUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credential.email,
                    password: credential.password,
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.token){
                    dispatch(this.receiveResource({isLogged:true}))
                    this.setToken(json.token)
                }else{
                    dispatch(this.errorResource(json[0]))
                }
            })
            .catch(ex => console.log('parsing failed', ex))
        }
    }

    fetchResource(id='')
    {
        return (dispatch) => {
            dispatch(this.requestResource())
            return fetch(this.ressourceUrl + id,{
                headers: {'Authorization': this.getToken()}
            })
                .then(
                    response => response.json(),
                    error => console.log('An error occurred.', error)
                )
                .then(json =>
                    dispatch(this.receiveResource(json))
                )
        }
    }

    errorResource(data)
    {
        return {
            type: 'ERROR' + this.resourceType,
            data : data,
            loading : false
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
