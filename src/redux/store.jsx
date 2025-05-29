import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import clientReducer from './reducers.jsx';

const store = createStore(clientReducer, applyMiddleware(thunk));

export default store;