import axios from 'axios';
import normalize from 'json-api-normalizer';

export const API_DATA_REQUEST = 'API_DATA_REQUEST';
export const API_DATA_SUCCESS = 'API_DATA_SUCCESS';
export const API_DATA_FAILURE = 'API_DATA_FAILURE';

const callApi = (endpoint, options = {}) => {
    return axios.get(endpoint, options).then((response) => {
        return Object.assign({}, normalize(response.data, { endpoint }));
    });
};

export const CALL_API = Symbol('Call API');

export default store => next => action => {
    const callAPI = action[CALL_API];

    // pass through as not applying Call Api
    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    let { endpoint } = callAPI;
    const { options } = callAPI;

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState());
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }

    const actionWith = (data) => {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_API];
        return finalAction;
    };

    // dispatch 'loading...' request start
    next(actionWith({ type: API_DATA_REQUEST, endpoint }));

    // calls given api endpoint with response normalisation
    //
    return callApi(endpoint, options || {}).then(
        response =>
            next(
                actionWith({
                    response,
                    type: API_DATA_SUCCESS,
                    endpoint,
                })
            ),
        error =>
            next(
                actionWith({
                    type: API_DATA_FAILURE,
                    error: error.message || 'Something bad happened',
                })
            )
    );
};


