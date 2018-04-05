import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'

import API from "./api"

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)


describe('TEST REST API CRUD', () => {

    const testApi = new API('companies')

    afterEach(() => {
        fetchMock.reset()
        fetchMock.restore()
    })

    it('constructor', () => {
        expect(testApi.resourceType).toBe('_COMPANIES');
        expect(testApi.useJWT).toBe(false);
        expect(testApi.ressourceUrl).toBe('https://api.awesome.com/companies/');
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
                name: 'LoginSuccess',
                matcher: function(url, opts) {
                    expect(opts).toEqual(param)
                    return (url === testApi.ressourceUrl);
                },
                response: {id:1,name:'Amazon'}
            })

        const expectedActions = [
            { type: 'CREATE_COMPANIES', payload: {id:1, name:'Amazon'}  },
        ]
        const store = mockStore()

        return store.dispatch(testApi.addResource({name:'Amazon'})).then(() => {

            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})
