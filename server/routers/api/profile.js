const express = require('express')
const router = express.Router()
const Profile = require('../../modules/Profiles')
const passport = require('passport')

/* 
  @router POST api/profile/add
  @desc 添加信息 接口
  @access private
*/
router.post(
	'/add',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const profileData = {}
		if (req.body.type) profileData.type = req.body.type
		if (req.body.describe) profileData.describe = req.body.describe
		if (req.body.income) profileData.income = req.body.income
		if (req.body.expend) profileData.expend = req.body.expend
		if (req.body.cash) profileData.cash = req.body.cash
		if (req.body.remark) profileData.remark = req.body.remark

		// 保存商品
		new Profile(profileData)
			.save()
			.then(profile => {
				res.json({
					data: profile,
					meta: {
						msg: '保存信息成功',
						status: 201
					}
				})
			})
			.catch(err => res.status(400).json(err))
	}
)

/* 
  @router GET api/profile
  @desc 获取全部信息 接口
  @access private
*/
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.find()
			.then(profile => {
				res.json({
					data: profile,
					meta: {
						msg: '获取信息成功',
						status: 200
					}
				})
			})
			.catch(err => res.status(400).json(err))
	}
)

/* 
  @router GET api/profile/id
  @desc 查找接口
  @access private
*/
router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findById(req.params.id)
			.then(profile => {
				res.json({
					data: profile,
					msg: { msg: '获取数据成功', status: 200 }
				})
			})
			.catch(err => res.status(400).json(err))
	}
)

/* 
  @router POST api/profile/edit/id
  @desc 编辑接口
  @access private
*/
router.post(
	'/edit/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const profileData = {}
		if (req.body.type) profileData.type = req.body.type
		if (req.body.describe) profileData.describe = req.body.describe
		if (req.body.income) profileData.income = req.body.income
		if (req.body.expend) profileData.expend = req.body.expend
		if (req.body.cash) profileData.cash = req.body.cash
		if (req.body.remark) profileData.remark = req.body.remark

		Profile.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: profileData },
			{ new: true }
		)
			.then(profile => {
				res.json({
					data: profile,
					meta: {
						msg: '信息更新成功',
						status: 200
					}
				})
			})
			.catch(err => res.status(400).json(err))
	}
)

/* 
  @router DELETE api/profile/delete
  @desc 删除接口
  @access private
*/
router.delete(
	'/delete/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOneAndDelete({ _id: req.params.id })
			.then(profile => {
				res.json({
					data: profile,
					meta: {
						msg: '删除成功',
						status: 204
					}
				})
			})
			.catch(err => res.status(400).json(err))
	}
)

module.exports = router
