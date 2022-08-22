<template>
  <div>
    <div class="top">
      <table style="width: 100%;">
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
          <td style="width: 800px; align-content: center;">
            <div class="top-router">
              <div class="top-router-inner">
                <ul>
                  <li>
                    <router-link :class="{'router-link-exact-active': routerLinkIsActive('/customerService')}"
                                 to="/customerService" exact>客服
                    </router-link>
                  </li>
                  <li>|</li>
                  <li>
                    <router-link :class="{'router-link-exact-active': routerLinkIsActive('/feedback')}"
                                 to="/feedback" active-class="active" router-link-active>反馈
                    </router-link>
                  </li>
                  <li>|</li>
                  <li>
                    <router-link :class="{'router-link-exact-active': routerLinkIsActive('/organization')}"
                                 to="/organization" active-class="active" router-link-active>组织
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td>
            <div class="top-workbench">
<!--              <div style="position: absolute; right: 80px">-->
<!--                <i class="el-icon-bell" style="font-size: 30px"/>-->
<!--              </div>-->
              <span style="line-height: 100px">{{username}}</span>
              <div
                style="
                  /*margin-left: 35px;*/
                  /*margin-top: 10px;*/
                  /*position: absolute;*/
                  /*right: 0;*/
                  /*border: 1px solid black;*/
                "
              >
                <el-dropdown>
                  <div class="author">
                    <img :src="url + headImg" alt="">
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item ><span @click="logout()">退出</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <router-view/>
  </div>
</template>

<script>
import cookie from 'js-cookie'

export default {
  name: 'home',
  created () {
    this.headImg = sessionStorage.getItem('headimg')
    this.username = sessionStorage.getItem('username')
  },
  data () {
    return {
      url: 'https://www.uniwarm.net',
      headImg: '',
      username: ''
    }
  },
  methods: {
    // 退出登录
    logout () {
      cookie.set('token', '')
      window.location.href = '/login'
    },
    routerLinkIsActive (path) {
      /**
       * 判断当前路由地址是否以传入地址参数相匹配，并返回结果决定是否激活路由状态。
       * 路由对象被vue监测，路由对象一旦发生变化跟其相关的值都要更新，从而影响activeCSS样式类的开关
       */
      return this.$route.path.startsWith(path)
    }
  }

}
</script>

<style scoped>
ul,
li {
  list-style: none;
}

.top {
  width: 100%;
  height: 100px;
  min-width: 1400px;
  position: relative;
  background-color: #ffffff;
  display: flex;
  /*border: 1px solid red;*/
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
  float: left;
  padding-left: 40px;
  box-sizing: border-box;
  /*margin-left: 40px;*/
  /*border: 1px solid black;*/
}

.top-workbench {
  display: flex;
  float: right;
  box-sizing: border-box;
  padding-right: 40px;
  justify-content: flex-end;
  width: 300px;
  /*float: right;*/
  /*height: 100px;*/
  /*line-height: 100px;*/
  right: 200px;
  /*border: 1px solid blue;*/
  /*display: flex;*/
  /*position: relative;*/
}

a {
  text-decoration: none;
  color: #000000;
}

.author {
  width: 40px;
  height: 40px;
  margin-top: 30px;
  margin-left: 30px;
  border-radius: 50px;
  display: flex;
  box-sizing: border-box;
  border: 1px solid lightgray;
  /*position: absolute;*/
  /*right: 0;*/
  /*top: 30px;*/
}

.router-link-exact-active {
  color: #d79432;
}

a:hover {
  color: #d79432;
  cursor: pointer;
}
</style>
