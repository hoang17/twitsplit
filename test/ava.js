import test from 'ava'

const fn = () => {
	throw new TypeError('🦄')
}

test('throws', t => {
	const error = t.throws(() => {
		fn()
	}, TypeError)

	t.is(error.message, '🦄')
})
