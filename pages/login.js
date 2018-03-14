import React from 'react'
import firebase from 'firebase'
import config from '../credentials/client'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

var uiConfig

export default class SignInScreen extends React.Component {

  static async getInitialProps ({req, query}) {
    const user = req && req.session ? req.session.decodedToken : null
    console.log(user);
    return { user }
  }

  constructor (props) {
    super(props)
    this.state = {
      user: this.props.user,
      client: false,
      signedIn: false // Local signed-in state.
    }
  }

  componentDidMount() {
    firebase.initializeApp(config)

    // firebase.auth().onAuthStateChanged(
    //   (user) => this.setState({signedIn: !!user})
    // )

    uiConfig = {
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ],
      // signInSuccessUrl: '/',
      callbacks: {
        // Avoid redirects after sign-in.
        signInSuccess: () => false
      }
    }
    this.setState({ client: true })
  }

  render() {
    if (!this.state.signedIn) {
      return (
        <div>
          <h1>Slido {this.state.user.name}</h1>
          <p>Please sign-in</p>
          { this.state.client &&
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
          }
        </div>
      )
    }
    return (
      <div>
        <h1>My App</h1>
        <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
      </div>
    )
  }
}
