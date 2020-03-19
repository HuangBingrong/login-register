const JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt
const opts = {}
const User = require('../modules/Users')
const keys = require('../config/keys')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey

module.exports = passport => {
	passport.use(
		new JwtStrategy(opts, (jwt_payload, done) => {
			User.findById(jwt_payload.id, (err, user) => {
				if (err) {
					return done(err, false)
				}
				if (user) {
					return done(null, user)
				} else {
					return done(null, false)
					// or you could create a new account
				}
			})
		})
	)
}
