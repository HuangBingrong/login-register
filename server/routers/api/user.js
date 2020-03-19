const express = require('express')
const router = express.Router()
const User = require('../../modules/Users')
const bcrypt = require('bcrypt')
const tools = require('../../tools/tools')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

/* 
  @router GET api/user/test
  @desc 测试 接口
  @access public
*/
router.get('/test', (req, res) => {
	res.json({ msg: '测试接口成功' })
})

/* 
  @router POST api/user/register
  @desc 注册 接口
  @access public
*/
router.post('/register', (req, res) => {
	// 判断邮箱是否被注册
	User.findOne({ email: req.body.email })
		.then(result => {
			if (result) {
				// 已注册
				return res.json({
					data: null,
					meta: {
						msg: '邮箱已存在!',
						status: 400
					}
				})
			} else {
				// 生成一个头像
				const avatar = gravatar.url(req.body.email, {
					s: '200',
					r: 'pg',
					d: 'mm'
				})
				// 未注册 实例化 User 数据对象
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: tools.encrypt(req.body.password),
					identity: req.body.identity,
					avatar
				})
				// 把数据保存到数据库中
				newUser
					.save()
					.then(user =>
						res.json({
							data: user,
							meta: {
								msg: '注册成功',
								status: 201
							}
						})
					)
					.catch(err => res.status(400).json(err))
			}
		})
		.catch(err => {
			res.status(400).json(err)
		})
})

/*
  @router POST api/users/login
  @desc 登陆 接口
  @access public
 */
router.post('/login', (req, res) => {
	// 判断邮箱是否存在
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				// 邮箱不存在
				return res.json({
					data: null,
					meta: {
						msg: '邮箱或密码错误!',
						status: 404
					}
				})
			} else {
				// 解析数据库密码 判断是否和登陆密码一致
				const verify = bcrypt.compareSync(
					req.body.password,
					user.password
				)
				if (!verify)
					return res.json({
						data: null,
						meta: {
							msg: '邮箱或密码错误！',
							status: 404
						}
					})
				// 定义一个生成 token 的数据源
				const rule = {
					id: user.id,
					emial: user.email,
					name: user.name,
					identity: user.identity
				}
				// 登陆成功生成一个 token
				jwt.sign(
					rule,
					keys.secretOrKey,
					{ expiresIn: 100 },
					(err, token) => {
						if (err) throw err
						res.json({
							data: null,
							meta: {
								msg: '登陆成功',
								status: 200,
								token: 'Bearer ' + token
							}
						})
					}
				)
			}
		})
		.catch(err => {
			res.status(400).json(err)
		})
})

/* 
  @router GET api/user/current
  @desc 根据 token 获取用户信息
  @access private
*/
router.get(
	'/current',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({
			data: {
				name: req.user.name,
				email: req.user.email,
				avatar: req.user.avatar,
				identity: req.user.identity
			},
			meta: {
				msg: '获取用户信息成功 ',
				status: 200
			}
		})
	}
)

module.exports = router
