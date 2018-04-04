import 'whatwg-fetch'

import config from "./apiConfig"
import actions from "./apiActions"

class API
{
    constructor(resourceName,useJWT=false)
    {
        this.url = config.url + '/' + config.version
        this.useJWT = useJWT
        this.resourceName = resourceName
        this.resourceType = '_' + resourceName.toUpperCase()
        this.ressourceUrl = this.url + resourceName + '/'
        this.actions = new actions(this.resourceType)
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
            return fetch(this.ressourceUrl + id,{
                headers: {'Authorization': this.getToken()}
            })
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
                .then(json => {dispatch(this.actions.addResourceSuccess(json))})
                .catch(ex => console.log('parsing failed', ex))
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
                .then(json => {dispatch(this.actions.updateResourceSuccess(json))})
                .catch(ex => console.log('parsing failed', ex))
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
                .then(json => {dispatch(this.actions.deleteResourceSuccess(id))})
                .catch(ex => console.log('parsing failed', ex))
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
