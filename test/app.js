const { expect } = require('chai')
const sinon = require('sinon')

const Event = require('../models/event')

describe('Event', () => {
  it('should contain event name', (done) => {
    expect(Event({eventName: ''})).to.throw(TypeError)
    done()
  })
})
