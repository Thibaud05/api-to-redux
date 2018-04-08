import 'whatwg-fetch'

import config from "./apiConfig"
import actions from "./apiActions"

class API
{
    constructor(resourceName)
    {
        this.url = config.url + '/' + config.version
        this.useJWT = false
        this.resourceName = resourceName
        this.resourceType = '_' + resourceName.toUpperCase()
        this.ressourceUrl = this.url + resourceName + '/'
        this.actions = new actions(this.resourceType)
    }

    auth()
    {
        this.useJWT = true
    }

    nested(resourceName,resourceId)
    {
        this.ressourceUrl = this.url + resourceName + '/' + resourceId + '/' + this.resourceName + '/'
    }

    login(credential)
    {
        return (dispatch) => {
            dispatch(this.actions.requestResource())
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
                    dispatch(this.actions.receiveResource({isLogged:true}))
                    this.setToken(json.token)
                }else{
                    dispatch(this.actions.errorResource(json[0]))
                }
            })
            .catch(ex => console.log('parsing failed', ex))
        }
    }

    fetchResource(id='')
    {
        return (dispatch) => {
            dispatch(this.actions.requestResource())
            let param = this.getParam('GET')
            console.log(param)
            return fetch(this.ressourceUrl + id,param)
                .then(
                    response => response.json(),
                    error => console.log('An error occurred.', error)
                )
                .then(json =>
                    dispatch(this.actions.receiveResource(json))
                )
        }
    }

    addResource(resource,useJson = true)
    {
        return (dispatch) => {
            let param = this.getParam('POST',useJson,resource)
            return fetch(this.ressourceUrl, param)
                .then(response => response.json())
                .then(json => {dispatch(this.actions.addResourceSuccess(json))})
                .catch(ex => console.log('parsing failed', ex))
        }
    }

    updateResource(resource,useJson = true)
    {
        return (dispatch) => {
            let param = this.getParam('PUT',useJson,resource)
            return fetch(this.ressourceUrl + resource.id, param)
                .then(response => response.json())
                .then(json => {dispatch(this.actions.updateResourceSuccess(json))})
                .catch(ex => console.log('parsing failed', ex))
        }
    }

    deleteResource(id)
    {
        return (dispatch) => {
            const param = this.getParam('DELETE')
            return fetch(this.ressourceUrl + id, param)
                .then(response => response.json())
                .then(json => {dispatch(this.actions.deleteResourceSuccess(id))})
                .catch(ex => console.log('parsing failed', ex))
        }
    }

    getParam(method,useJson = true,resource=null)
    {
        let param = {method: method, headers: {}}
        if(useJson) {
            param.headers['Content-Type'] = 'application/json'
            if (resource) {
                param.body = JSON.stringify(resource)
            }
        }else{
            if (resource) {
                param.body = this.objToFormData(resource)
            }
        }
        if(this.useJWT){
            param.headers['Authorization'] = this.getToken()
        }

        return param
    }

    objToFormData(obj)
    {
        let formData = new FormData()
        for (let props in obj){
            if (obj.hasOwnProperty(props))
                formData.append(props, obj[props])

        }
        return formData
    }

    getToken()
    {
        return 'Bearer ' + localStorage.getItem("token")
    }

    setToken(token)
    {
        localStorage.setItem('token', token);
    }

}

export default API
