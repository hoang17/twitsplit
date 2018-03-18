import configureStore from './configureStore'

let store = configureStore({})

import { VisibilityFilters } from '../constants'

import { helloWorld, setMessage } from '../actions/hello'

import { getJsonAPI } from '../actions/jsonAPI'

import { setClock, startClock, addCount } from '../actions/next'

import { setRuntimeVariable } from '../actions/runtime'

import { addTodo, toggleTodo, setVisibilityFilter } from '../actions/todo'

// Log the initial state
console.log('INITIAL STATE', store.getState())
 
// Every time the state changes, log it
const unsubscribe = store.subscribe(() =>
  console.log('SUBSCRIBE', store.getState())
)
 
// Dispatch some actions

// store.dispatch(helloWorld())
// store.dispatch(setMessage('Hi ya!'))
store.dispatch(getJsonAPI())
// store.dispatch(setClock())
// store.dispatch(startClock())
// store.dispatch(addCount())
// store.dispatch(addCount())
// store.dispatch(addCount())
// store.dispatch(addCount())
// store.dispatch(setRuntimeVariable('redux', 'OK'))

// store.dispatch(addTodo('Learn about actions'))
// store.dispatch(addTodo('Learn about reducers'))
// store.dispatch(addTodo('Learn about store'))
// store.dispatch(toggleTodo(0))
// store.dispatch(toggleTodo(1))
// store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))
 
// Stop listening to state updates
unsubscribe()
