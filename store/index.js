import { fetchEvents } from '../actions/events'
import { fetchQuestions } from '../actions/questions'

import configureStore from './configureStore'

let store = configureStore({})

// Log the initial state
console.log('INITIAL STATE', store.getState())
 
// Every time the state changes, log it
const unsubscribe = store.subscribe(() =>
  console.log('SUBSCRIBE', store.getState())
)
 
// Dispatch some actions
store.dispatch(fetchEvents())
store.dispatch(fetchQuestions())
 
// Stop listening to state updates
unsubscribe()
