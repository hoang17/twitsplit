import React from 'react'
import store from '../store'
// import { bindActionCreators } from 'redux'
// import configureStore from '../store/configureStore'
// import withRedux from 'next-redux-wrapper'

class Page extends React.Component {
  render () {
    return (
      <div>Hello Redux</div>
    )
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     // addCount: bindActionCreators(addCount, dispatch),
//     // startClock: bindActionCreators(startClock, dispatch)
//   }
// }
//
// const mapStateToProps = state => {
//   return {
//     // todos: getVisibleTodos(state.todos, state.visibilityFilter)
//   }
// }
//
// export default withRedux(configureStore, null, mapDispatchToProps)(Page)

export default Page
