<template>
	<div class="register-container">
		<div class="register-main">
			<div class="register-title">在线后台管理系统</div>
			<div class="register-content">
				<!-- 注册表单区域 -->
				<el-form
					:model="registerForm"
					status-icon
					:rules="registerRules"
					ref="registerRef"
					label-width="100px"
					class="demo-ruleForm"
				>
					<el-form-item label="用户名" prop="name">
						<el-input
							type="string"
							v-model="registerForm.name"
							auto-complete="off"
							placeholder="请输入用户名"
						></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input
							type="email"
							v-model="registerForm.email"
							auto-complete="off"
							placeholder="请输入邮箱"
						></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input
							type="password"
							v-model="registerForm.password"
							auto-complete="off"
							placeholder="请输入密码"
						></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="password2">
						<el-input
							type="password"
							auto-complete="off"
							v-model="registerForm.password2"
							placeholder="请确认密码"
						></el-input>
					</el-form-item>
					<el-form-item label="职位职位" prop="identity">
						<el-select
							v-model="registerForm.identity"
							placeholder="请选择职位"
						>
							<el-option label="经理" value="经理"></el-option>
							<el-option label="员工" value="员工"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							@click="registerSubmitForm('registerRef')"
							>提交</el-button
						>
						<el-button @click="registerResetForm('registerRef')"
							>重置</el-button
						>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		// 自定义验证密码规则
		const checkPassword = (rule, value, callback) => {
			if (value !== this.registerForm.password) {
				callback(new Error('两次输入密码不一致!'))
			} else {
				callback()
			}
		}
		return {
			// 注册信息
			registerForm: {
				name: '',
				email: '',
				password: '',
				password2: '',
				identity: ''
			},
			// 验证规则
			registerRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
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
				password2: [
					{ required: true, message: '请确认密码', trigger: 'blur' },
					{
						validator: checkPassword,
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
		registerSubmitForm(registerRef) {
			this.$refs[registerRef].validate(valid => {
				if (valid) {
					const registerForm = {
						name: this.registerForm.name,
						email: this.registerForm.email,
						password: this.registerForm.password,
						identity: this.registerForm.identity
					}
					this.$axios
						.post('/user/register', registerForm)
						.then(res => {
							if (res.data.meta.status === 201) {
								this.$message({
									message: res.data.meta.msg,
									type: 'success'
								})
								this.$router.push('/login')
							} else {
								this.$message({
									message: res.data.meta.msg,
									type: 'info'
								})
							}
						})
				} else {
					return false
				}
			})
		},
		// 重置按钮
		registerResetForm(registerRef) {
			this.$refs[registerRef].resetFields()
		}
	}
}
</script>

<style scoped>
.register-container {
	height: 100%;
	width: 100%;
	background-image: url('../assets/bg.png');
	background-size: 100%;
	background-attachment: fixed;
	position: relative;
}
.register-main {
	position: absolute;
	width: 400px;
	top: 10%;
	left: 50%;
	transform: translateX(-200px);
	box-sizing: border-box;
}
.register-title {
	width: 100%;
	color: #fff;
	font-size: 25px;
	line-height: 100px;
	text-align: center;
}
.register-content {
	width: 100%;
	background-color: #fff;
	padding: 40px 40px 10px 0;
	box-sizing: border-box;
	border-radius: 10px;
}
</style>
