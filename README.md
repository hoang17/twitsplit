# TwitSplit

### Overview

This project is a fork/branch from my another project [Slido](https://github.com/hoang17/slido) (Both Slido and TwitSplit are my personal projects that I started and coded alone by myself)

The project uses React.js and [Next](https://github.com/zeit/next.js) for front end and supporting server side rendering.

Backend using node.js and Firebase is for real time database.

[Ava](https://github.com/avajs/ava) is used for testing framework.

Redux support has beed added and in the `redux` branch (now merged with `master`)

I tried to test all logic of the application in the `test` directory.

### Installation

Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone https://github.com/hoang17/slido.git slido

# Change directory
cd slido

# Install NPM dependencies
yarn
#or
npm install

# Then simply start the app in development mode
yarn dev
```

Then open http://localhost:3000/

**Note:** You need to install [Nodemon](https://github.com/remy/nodemon).
It watches for any changes in your  node.js app and automatically restarts the
server. Once installed, instead of `node server.js` use `nodemon server.js`. It will
save you a lot of time in the long run, because you won't need to manually
restart the server each time you make a small change in code. To install, run
`sudo npm install -g nodemon` or `yarn global add nodemon`.


For production build:

```bash
# Build for production
yarn build

# Then run the app
yarn start
```

Run test:

```bash
# Run all test cases
yarn test
```

To run with Docker:

```bash
# Build image
docker build -t slido .

# Run on port 2000
docker run -p 2000:3000 -d slido
```
