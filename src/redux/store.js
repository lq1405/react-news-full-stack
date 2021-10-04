import {
  createStore,
  combineReducers
} from 'redux';
import {
  LoadingReducer
} from './reducers/loadingReducer';


const reducer = combineReducers({
  LoadingReducer
})

const store = createStore(reducer)

export default store;