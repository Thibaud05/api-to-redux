import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'

import API from "./api"
import LocalStorageMock from "./LocalStorageMock"

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

global.localStorage = new LocalStorageMock



const token = 'cK.Jf5L_KD6ddsd=s5'

describe('TEST REST API CRUD', () => {

    const testApi = new API('companies')

    afterEach(() => {
        fetchMock.reset()
        fetchMock.restore()
    })

    it('constructor', () => {
        expect(testApi.useJWT).toBe(false);
        expect(testApi.ressourceUrl).toBe('http://127.0.0.1:3333/companies/');
    });

    it('fetchResource()', () => {
        fetchMock
            .getOnce(testApi.ressourceUrl, { body: { companies: ['do something'] }, headers: { 'content-type': 'application/json' } })

        const expectedActions = [
            { type: 'REQUEST_COMPANIES', loading: true  },
            { type: 'RECEIVE_COMPANIES', data: { companies: ['do something'] }, loading: false }
        ]
        const store = mockStore()

        return store.dispatch(testApi.fetchResource()).then(() => {

            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('addResource()', () => {
        const param = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name":"Amazon"}' }

        fetchMock
            .postOnce({
                matcher: function(url, opts) {
                    expect(opts).toEqual(param)
                    return (url === testApi.ressourceUrl);
                },
                response: {id:1,name:'Amazon'}
            })

        const store = mockStore()

        return store.dispatch(testApi.addResource({name:'Amazon'})).then(() => {

            expect(store.getActions()).toEqual([{ type: 'CREATE_COMPANIES', payload: {id:1, name:'Amazon'} }])
        })
    })

    it('updateResource()', () => {
        const param = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{"id":1,"name":"Google"}' }

        fetchMock
            .putOnce({
                matcher: function(url, opts) {
                    expect(opts).toEqual(param)
                    return (url === (testApi.ressourceUrl + '1'));
                },
                response: {id:1,name:'Google'}
            })

        const store = mockStore()

        return store.dispatch(testApi.updateResource({id:1,name:'Google'})).then(() => {

            expect(store.getActions()).toEqual([{ type: 'UPDATE_COMPANIES', payload: {id:1, name:'Google'} }])
        })
    })

    it('deleteResource()', () => {
        const param = { method: 'DELETE', headers: { 'Content-Type': 'application/json' }}

        fetchMock
            .deleteOnce({
                matcher: function(url, opts) {
                    expect(opts).toEqual(param)
                    return (url === (testApi.ressourceUrl + '1'));
                },
                response: {id:1}
            })

        const store = mockStore()

        return store.dispatch(testApi.deleteResource(1)).then(() => {

            expect(store.getActions()).toEqual([{ type: 'REMOVE_COMPANIES', payload: 1  }])
        })
    })

    it('nested()', () => {

        const nestedApi = new API('leaders')
        nestedApi.nested('companies',1)
        expect(nestedApi.ressourceUrl).toBe('http://127.0.0.1:3333/companies/1/leaders/');
    });

    it('auth()', () => {

        const authApi = new API('leaders')
        authApi.auth()
        expect(authApi.useJWT).toBe(true);
    });



    it('login', () => {
        const testAuth = new API('login')
        const param = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"email":"e@mail.com","password":"secret"}' }

        fetchMock
            .postOnce({
                matcher: function(url, opts) {
                    expect(opts).toEqual(param)
                    return (url === testAuth.ressourceUrl);
                },
                response: {token:token}
            })

        const store = mockStore()

        return store.dispatch(testAuth.login({email:"e@mail.com",password:"secret"})).then(() => {

            const actions = [
                { type: 'REQUEST_LOGIN', loading: true },
                { type: 'RECEIVE_LOGIN', loading: false, data: { isLogged: true }},
            ]
            expect(store.getActions()).toEqual(actions)
        })
    })

    const testApiWithAuth = new API('companies')
    testApiWithAuth.auth()

    it('fetchResource with auth', () => {
        fetchMock
            .getOnce(testApiWithAuth.ressourceUrl, { body: { companies: ['do something'] }, headers: { 'content-type': 'application/json' } })

        const expectedActions = [
            { type: 'REQUEST_COMPANIES', loading: true  },
            { type: 'RECEIVE_COMPANIES', data: { companies: ['do something'] }, loading: false }
        ]
        const store = mockStore()

        return store.dispatch(testApiWithAuth.fetchResource()).then(() => {

            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('addResource with auth', () => {
        const param = { method: 'POST', headers: { 'Content-Type': 'application/json',Authorization: 'Bearer ' + token }, body: '{"name":"Amazon"}' }

        fetchMock
            .postOnce({
                matcher: function(url, opts) {
                    expect(opts).toEqual(param)
                    return (url === testApiWithAuth.ressourceUrl);
                },
                response: {id:1,name:'Amazon'}
            })

        const store = mockStore()

        return store.dispatch(testApiWithAuth.addResource({name:'Amazon'})).then(() => {

            expect(store.getActions()).toEqual([{ type: 'CREATE_COMPANIES', payload: {id:1, name:'Amazon'} }])
        })
    })


    it('updateResource() with auth', () => {
        const param = { method: 'PUT', headers: { 'Content-Type': 'application/json',Authorization: 'Bearer ' + token }, body: '{"id":1,"name":"Google"}' }

        fetchMock
            .putOnce({
                matcher: function(url, opts) {
                    expect(opts).toEqual(param)
                    return (url === (testApiWithAuth.ressourceUrl + '1'));
                },
                response: {id:1,name:'Google'}
            })

        const store = mockStore()

        return store.dispatch(testApiWithAuth.updateResource({id:1,name:'Google'})).then(() => {

            expect(store.getActions()).toEqual([{ type: 'UPDATE_COMPANIES', payload: {id:1, name:'Google'} }])
        })
    })

    it('deleteResource() with auth', () => {
        const param = { method: 'DELETE', headers: { 'Content-Type': 'application/json' ,Authorization: 'Bearer ' + token }}

        fetchMock
            .deleteOnce({
                matcher: function(url, opts) {
                    expect(opts).toEqual(param)
                    return (url === (testApiWithAuth.ressourceUrl + '1'));
                },
                response: {id:1}
            })

        const store = mockStore()

        return store.dispatch(testApiWithAuth.deleteResource(1)).then(() => {

            expect(store.getActions()).toEqual([{ type: 'REMOVE_COMPANIES', payload: 1  }])
        })
    })


})

