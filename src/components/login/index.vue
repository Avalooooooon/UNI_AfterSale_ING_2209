<template>
  <div>
    <div class="main">
    </div>
    <div class="content">
      <div class="login">
        <div class="login-left">
          <div style="margin-left: 15px">
            <div class="title">
              <img class="top-bar" src="../../assets/topbar.png"
                   alt="欢迎登录"/><br/>
              <div class="text">uniwarm服务管理平台</div>
            </div>
            <el-form style="margin-top: 5px" :inline="true" :model="userInfo" class="demo-form-inline">
              <el-input placeholder="账号" v-model="userInfo.username" class="input">
              </el-input>

              <el-input
                placeholder="密码"
                class="input"
                v-model="userInfo.password"
                show-password
                @keyup.enter.native="handleSubmit()"
              ></el-input>
<!--              <el-checkbox class="check" v-model="checked">-->
<!--                <span style="font-size: 16px">自动登录</span>-->
<!--              </el-checkbox>-->
              <el-button type="primary" class="submit" @click.prevent="handleSubmit()">登 录</el-button>
            </el-form>
          </div>
        </div>
        <div class="login-right">
          <img src="../../assets/picture.png" alt="" style="width: 100%;height: 100%">
        </div>
      </div>
      <div class="backgroundOne"></div>
      <div class="backgroundTwo"></div>
    </div>

  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
import cookie from 'js-cookie'
import saleApi from '../../api/org/saleApi'

export default {
  name: 'Login',
  data () {
    return {
      userInfo: {
        bizid: 'uniwarm',
        username: 'dong',
        password: 'donglichao'
      },
      checked: true,
      videoId: '',
      userSig: ''
    }
  },
  methods: {
    handleSubmit () {
      axios({
        url: '/erp/aftersale/v1/service/login',
        method: 'post',
        data: qs.stringify({
          'bizid': this.userInfo.bizid,
          'username': this.userInfo.username,
          'password': this.$md5(this.userInfo.password)
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(
        /**
         * @param res
         * @param res.data.res
         * @param res.data.token
         * @param res.data.headimg
         * @param res.data.video_id
         */
        res => {
          console.log(res.data.video_id)
          this.videoId = res.data.video_id
          sessionStorage.setItem('video_id', res.data.video_id)
          saleApi.getVideo(this.videoId).then(
            /**
             * @param res.usersig
             */
            (res) => {
              console.log(res)
              console.log(res.usersig)
              this.userSig = res.usersig
              sessionStorage.setItem('usersig', res.usersig)
            })
          if (res.data.res === 0) {
            cookie.set('token', res.data.token, {expires: 7})
            sessionStorage.setItem('headimg', res.data.headimg)
            sessionStorage.setItem('username', this.userInfo.username)
            this.$router.replace({
              name: 'Home'
            })
            this.$message.success('登陆成功')
          } else if (res.data.res === 404) {
            this.$router.push('/login')
            this.$message({
              showClose: true,
              message: '用户名或密码错误！',
              type: 'error'
            })
          } else if (res.data.res === 414) {
            this.$router.push('/login')
            this.$message({
              showClose: true,
              message: '请输入用户名和密码！',
              type: 'error'
            })
          }
        })
    }
  }
}
</script>

<style scoped>
.main {
  background: url("../../assets/background.png");
  background-size: 100% 100%;
  height: 100vh;
  /*height: 100%;*/
  position: relative;
  width: 100%;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

ul,
li {
  list-style: none;
}

.content {
  display: block;
  position: fixed;
  _position: relative;
  top: 50%;
  left: 50%;
  width: 1300px;
  height: 720px;
  margin-left: -650px;
  margin-top: -360px;
  z-index: 10;
  /*border: 2px solid red;*/
  /*box-shadow: 2px 2px 4px #A0A0A0, -2px -2px 4px #A0A0A0;*/
  /*background-color: #fff;*/
}

.login {
  /*border: 3px solid #1100ff;*/
  width: 100%;
  height: 100%;
  position: absolute;
  /*position: absolute;*/
  margin: 0 auto;
  bottom: 0;
  background: white;
  border-radius: 12px;
  z-index: 10;
  display: flex;
}

.login-left {
  width: 50%;
  height: 100%;
  float: left;
  /*border: 1px solid red;*/
}

.title {
  height: 200px;
  margin-left: 70px;
  margin-top: 80px;
}

.text {
  font-size: 28px;
  font-weight: 400;
  color: gray;
  margin-top: 18px;
}

.login-right {
  width: 50%;
  height: 100%;
  float: right;
  background-repeat: no-repeat;
}

.input {
  width: 80%;
  height: 60px;
  margin-left: 70px;
  margin-top: 30px;
  font-size: 18px;
}

/deep/ .el-input__inner{
  height: 55px;
}

.check {
  margin-left: 70px;
  margin-top: 40px;
}

.submit {
  width: 80%;
  height: 55px;
  margin-left: 70px;
  margin-top: 70px;
  font-size: 20px;
}

.backgroundOne {
  /*width: 60%;*/
  /*height: 40vh;*/
  /*position: absolute;*/
  /*margin-left: 20%;*/
  width: 96%;
  height: 104%;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  /*border: 2px solid rebeccapurple;*/
  background-color: rgba(255, 255, 255, 0.4);
}

.backgroundTwo {
  width: 92%;
  height: 108%;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  /*border: 2px solid rebeccapurple;*/
  background-color: rgba(255, 255, 255, 0.4);
}

.top-bar {
  width: 185px;
  height: 50px;
  margin-top: 50px;
}

body {
  max-width: 1366px;
  margin-left: auto;
  margin-right: auto;
}
</style>
