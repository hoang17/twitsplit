import Link from 'next/link'
import Button from 'material-ui/Button'
import Ty from 'material-ui/Typography'

export default ({ login }) => {
  return (
    <div>
      <Ty variant="display1" gutterBottom>Please Login</Ty>
      <p/>
      <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      <p/>
      <Ty variant="subheading" gutterBottom>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Ty>
    </div>
  )
}
