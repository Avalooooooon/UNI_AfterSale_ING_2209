<template>
  <div class="content">
    <div class="top">
      <table style="width: 100%">
        <tr>
          <td>
            <div class="logo">
              <img
                style="height: 26px"
                src="../../assets/uniwarm.png"
                alt="Uniwarm 服务管理平台"
              />
            </div>
          </td>
          <td style="width: 800px; align-content: center">
            <div class="top-router">
              <div class="top-router-inner">
                <ul>
                  <li>
                    <router-link to="/customerService" class="one">
                      客服
                    </router-link>
                  </li>
                  <li>|</li>
                  <li>
                    <router-link to="/"> 反馈</router-link>
                  </li>
                  <li>|</li>
                  <li>
                    <router-link to="/"> 组织</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td>
            <div class="top-workbench">
              <div style="margin-top: 5px; position: absolute; right: 80px">
                <i class="el-icon-bell" style="font-size: 30px"/>
              </div>
              <div
                style="
                  margin-left: 35px;
                  margin-top: 10px;
                  position: absolute;
                  right: 0;
                "
              >
                <el-dropdown>
                  <div class="author">
                    <img :src="url + headImg" alt="">
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="logout()">退出</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="below">
      <div class="check-bar">
        <el-tabs
          style="width: calc(100% - 80px); position: absolute; bottom: 0"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane label="会话" name="conversation"></el-tab-pane>
          <el-tab-pane label="视频" name="video"></el-tab-pane>
          <el-tab-pane label="电话" name="phone"></el-tab-pane>
          <el-tab-pane label="售后单" name="afterSalesOrder"></el-tab-pane>
          <el-tab-pane label="服务单" name="serviceOrder"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import cookie from 'js-cookie'

export default {
  created () {
    if (this.$route.params.activeName) {
      sessionStorage.setItem('activeName', this.$route.params.activeName)
      this.activeName = sessionStorage.getItem('activeName')
    } else {
      // this.activeName = 'afterSalesOrder'
      if (sessionStorage.getItem('activeName') === null ||
        sessionStorage.getItem('activeName') === '') {
        this.activeName = 'afterSalesOrder'
      } else {
        this.activeName = sessionStorage.getItem('activeName')
      }
    }
    this.headImg = sessionStorage.getItem('headimg')
    console.log(this.headImg)
  },
  data () {
    return {
      activeName: '',
      url: 'http://www.bizspace.cn:8690',
      headImg: ''

    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
      switch (this.activeName) {
        case 'conversation':
          this.$router.push({
            name: 'Conversation',
            params: {activeName: this.activeName}
          })
          return
        case 'video':
          this.$router.push({
            name: 'Video',
            params: {activeName: this.activeName}
          })
          return
        case 'phone':
          this.$router.push('/login')
          return
        case 'serviceOrder':
          this.$router.push('/login')
          return
        default:
          this.$router.push({
            name: 'SalesOrder',
            params: {activeName: this.activeName}
          })
      }
    },
    // 退出登录
    logout () {
      cookie.set('token', '')
      window.location.href = '/login'
    }
  }
}
</script>

<style scoped>
ul,
li {
  list-style: none;
}

.content {
  background-color: #f3f4f9;
  width: 100%;
  /*border: 1px solid black;*/
}

.top {
  width: 100%;
  height: 100px;
  position: relative;
  background-color: #ffffff;
  display: flex;
  /*border: 1px solid red;*/
}

.below {
  width: 100%;
  height: 70px;
  background-color: rgba(0, 0, 0, 0);
  position: relative;
  /*border: 1px solid blue;*/
}

.top-router {
  height: 100px;
  line-height: 100px;
  text-align: center;
  position: relative;
  /*border: 1px solid black;*/
}

.top-router-inner {
  width: 430px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  /*border: 2px solid red;*/
}

.top-router-inner ul {
  width: 100%;
  display: flex;
  text-align: center;
}

.top-router-inner ul li {
  flex: 1;
  font-weight: 550;
  font-size: 14px;
}

.logo {
  margin-left: 40px;
}

.top-workbench {
  width: 300px;
  float: right;
  height: 100px;
  line-height: 100px;
  right: 40px;
  /*border: 1px solid blue;*/
  display: flex;
  position: relative;
}

.check-bar {
  width: 100%;
  height: 78px;
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  padding: 0 40px;
}

/deep/ .el-tabs__item {
  padding: 0 60px;
  font-size: 14px;
}

a {
  text-decoration: none;
  color: #000000;
}

.one.router-link-active {
  text-decoration: none;
  color: #d79432;
}

.check-bar /deep/ .el-tabs__item.is-active {
  color: #d79432 !important;
}

.check-bar /deep/ .el-tabs__active-bar {
  background-color: #d79432 !important;
}

/deep/ .el-tabs__item {
  color: #000000;
}

.author {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  display: flex;
}
</style>
