import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { name, version } from '../package.json'
import makeRootReducer from '../reducers'
import createLogger from './logger'

const isProd = process.env.NODE_ENV === 'production'

export function configureStore(initialState) {
  const middleware = [thunk]

  let enhancer

  if (!isProd) {
    middleware.push(createLogger())

    // https://github.com/zalmoxisus/redux-devtools-extension#14-using-in-production
    const composeEnhancers = composeWithDevTools({
      // Options: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#options
      name: `${name}@${version}`,
    })

    enhancer = composeEnhancers(applyMiddleware(...middleware))
  } else {
    enhancer = applyMiddleware(...middleware)
  }

  const store = createStore(makeRootReducer(), initialState, enhancer)

  store.asyncReducers = {}

  if (!isProd) {

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot){
      module.hot.accept('../reducers', () => {
        const m = require('../reducers').default
        store.replaceReducer(m(store.asyncReducers))
      })
    }

    // Log the initial state
    // console.log('INITIAL STATE', store.getState())
     
    // Every time the state changes, log it
    // const unsubscribe = store.subscribe(() =>
    //   console.log('SUBSCRIBE', store.getState())
    // )
  }

  return store
}
