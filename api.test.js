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

    it('get()', () => {
        fetchMock
            .getOnce(testApi.ressourceUrl, { body: { companies: ['do something'] }, headers: { 'content-type': 'application/json' } })

        const expectedActions = [
            { type: 'REQUEST_COMPANIES', loading: true  },
            { type: 'RECEIVE_COMPANIES', data: { companies: ['do something'] }, loading: false }
        ]
        const store = mockStore()

        return store.dispatch(testApi.get()).then(() => {

            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('create()', () => {
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

        return store.dispatch(testApi.create({name:'Amazon'})).then(() => {

            expect(store.getActions()).toEqual([{ type: 'CREATE_COMPANIES', payload: {id:1, name:'Amazon'} }])
        })
    })

    it('update()', () => {
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

        return store.dispatch(testApi.update({id:1,name:'Google'})).then(() => {

            expect(store.getActions()).toEqual([{ type: 'UPDATE_COMPANIES', payload: {id:1, name:'Google'} }])
        })
    })

    it('delete()', () => {
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

        return store.dispatch(testApi.delete(1)).then(() => {

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

    it('get with auth', () => {
        fetchMock
            .getOnce(testApiWithAuth.ressourceUrl, { body: { companies: ['do something'] }, headers: { 'content-type': 'application/json' } })

        const expectedActions = [
            { type: 'REQUEST_COMPANIES', loading: true  },
            { type: 'RECEIVE_COMPANIES', data: { companies: ['do something'] }, loading: false }
        ]
        const store = mockStore()

        return store.dispatch(testApiWithAuth.get()).then(() => {

            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('create with auth', () => {
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

        return store.dispatch(testApiWithAuth.create({name:'Amazon'})).then(() => {

            expect(store.getActions()).toEqual([{ type: 'CREATE_COMPANIES', payload: {id:1, name:'Amazon'} }])
        })
    })


    it('update() with auth', () => {
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

        return store.dispatch(testApiWithAuth.update({id:1,name:'Google'})).then(() => {

            expect(store.getActions()).toEqual([{ type: 'UPDATE_COMPANIES', payload: {id:1, name:'Google'} }])
        })
    })

    it('delete() with auth', () => {
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

        return store.dispatch(testApiWithAuth.delete(1)).then(() => {

            expect(store.getActions()).toEqual([{ type: 'REMOVE_COMPANIES', payload: 1  }])
        })
    })


})

