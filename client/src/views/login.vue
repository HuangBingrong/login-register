<template>
	<div class="login-container">
		<div class="login-main">
			<div class="login-title">在线后台管理系统</div>
			<div class="login-content">
				<!-- 注册表单区域 -->
				<el-form
					:model="loginForm"
					status-icon
					:rules="loginRules"
					ref="loginRef"
					label-width="100px"
					class="demo-ruleForm"
				>
					<el-form-item label="邮箱" prop="email">
						<el-input
							type="email"
							v-model="loginForm.email"
							auto-complete="off"
							placeholder="请输入邮箱"
						></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input
							type="password"
							v-model="loginForm.password"
							auto-complete="off"
							placeholder="请输入密码"
						></el-input>
					</el-form-item>
					<el-form-item label="职位" prop="identity">
						<el-select
							v-model="loginForm.identity"
							placeholder="请选择职位"
						>
							<el-option label="经理" value="经理"></el-option>
							<el-option label="员工" value="员工"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							@click="loginSubmitForm('loginRef')"
							size="large"
							>登陆</el-button
						>
					</el-form-item>
					<a href="/register" class="goRegister">没有账号，去注册</a>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 注册信息
			loginForm: {
				email: '',
				password: '',
				identity: ''
			},
			// 验证规则
			loginRules: {
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{
						type: 'email',
						message: '请输入合法的邮箱',
						trigger: 'blur'
					}
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{
						min: 6,
						max: 20,
						message: '长度在 6 到 20 个字符',
						trigger: 'blur'
					}
				],
				identity: [
					{
						required: true,
						message: '请选择职位',
						trigger: 'blur'
					}
				]
			}
		}
	},
	methods: {
		// 提交按钮
		loginSubmitForm(loginRef) {
			this.$refs[loginRef].validate(valid => {
				if (valid) {
					this.$axios
						.post('/user/login', this.loginForm)
						.then(res => {
							// 判断返回的状态码
							if (res.data.meta.status !== 200) {
								this.$message({
									message: res.data.meta.msg,
									type: 'error'
								})
								return
							}
							// 登陆成功
							this.$message({
								message: res.data.meta.msg,
								type: 'success'
							})
							// 获取并保存用户 token 及时间
							const tokenObj = JSON.stringify({
								token: res.data.meta.token,
								date: new Date().getTime()
							})
							window.localStorage.setItem('tokenObj', tokenObj)
							// 跳转 index 页面
							this.$router.push('/index')
						})
				} else {
					return false
				}
			})
		}
	}
}
</script>

<style scoped>
.login-container {
	height: 100%;
	width: 100%;
	background-image: url('../assets/bg.png');
	background-size: 100%;
	background-attachment: fixed;
	position: relative;
}
.login-main {
	position: absolute;
	width: 400px;
	top: 10%;
	left: 50%;
	transform: translateX(-200px);
	box-sizing: border-box;
}
.login-title {
	width: 100%;
	color: #fff;
	font-size: 25px;
	line-height: 100px;
	text-align: center;
}
.login-content {
	width: 100%;
	background-color: #fff;
	padding: 40px 40px 10px 0;
	box-sizing: border-box;
	border-radius: 10px;
}
.goRegister {
	color: #999;
	font-size: 13px;
	position: absolute;
	right: 100px;
	bottom: 35px;
}
</style>
