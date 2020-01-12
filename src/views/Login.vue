<template>
<div class="login">
    <div class="ms-login">
        <div class="ms-title">多主题系统</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
            <el-form-item prop="username">
                <el-input v-model="ruleForm.username" placeholder="用户名">
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                          @keyup.enter.native="submitForm('ruleForm')">
                </el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </div>
            <p class="login-tips">Tips :<br/> 用户名admin，密码随便填（浅灰）<br/> 用户名oyyl，密码随便填（深黑）</p>
        </el-form>
    </div>
</div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
/*                        this.$store.dispatch('GetUserInfo', this.ruleForm).then(() => {
                            this.$message.closeAll();
                            this.$router.push('/');
                        }).catch((msg) => {
                            this.$message({
                                showClose: true,
                                type: 'error',
                                message: msg
                            });
                        })*/
                        this.$router.push('/main')
                    } else {
                        return false;
                    }
                });
            }

        }
    }
</script>
