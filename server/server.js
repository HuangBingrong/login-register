const express = require('express')
const app = express()
const mongoose = require('mongoose')
const keys = require('./config/keys')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')

// request cors
app.use(cors())

// connect mongoose
mongoose
	.connect(keys.mongodbURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('mongodb connected')
	})
mongoose.set('useFindAndModify', false)

// configuration passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.use('/', express.static(__dirname + '/./client'))
// configuration body-parse
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const user = require('./routers/api/user')
const profile = require('./routers/api/profile')

// use the routing
app.use('/api/user', user)
app.use('/api/profile', profile)

// // 测试接口
// app.get('/', (req, res) => {
// 	res.json({ msg: '这是一个根路径' })
// })

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`server runing on port ${port} `)
})
