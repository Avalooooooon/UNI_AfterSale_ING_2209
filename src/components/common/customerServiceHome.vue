<template>
  <div>
    <div class="box">
      <ul>
        <li>
          <div>
            <router-link to="/customerService/conversation"
                         :class="{'active': routerLinkIsActive('/customerService/conversation')}"
                         exact>
              会话
            </router-link>
          </div>
        </li>
        <li>
          <div>
            <router-link to="/customerService/video"
                         :class="{'active': routerLinkIsActive('/customerService/video')}"
                         exact>
              视频
            </router-link>
          </div>
        </li>
        <li>
          <div>
            <router-link to="/customerService/phone"
                         :class="{'active': routerLinkIsActive('/customerService/phone')}"
                         exact>
              电话
            </router-link>
          </div>
        </li>
        <li>
          <div>
            <router-link to="/customerService/salesOrder"
                         :class="{'active': routerLinkIsActive('/customerService/salesOrder')}"
                         exact>
              售后单
            </router-link>
          </div>
        </li>
        <li>
          <div>
            <router-link to="/customerService/serviceOrder"
                         :class="{'active': routerLinkIsActive('/customerService/serviceOrder')}"
                         exact>
              服务单
            </router-link>
          </div>
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'customerServiceHome',
  created () {
  },
  data () {
    return {}
  },
  methods: {
    routerLinkIsActive (path) {
      return this.$route.path.startsWith(path)
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

ul, ol, li {
  list-style: none;
}

.box {
  width: 100%;
  height: 70px;
  background-color: #F3F4F9;
  border-bottom: 2px solid #E7E7EA;

  ul {
    width: 100%;
    height: 100%;
    display: flex;
    color: black;

    li {
      margin-left: 75px;
      line-height: 90px;
      width: 100px;
      font-size: 12px;
      text-align: center;
    }

    li:nth-of-type(1) {
      margin-left: 10px;
    }
  }
}

.active {
  color: #d79432;
  font-weight: 600;
  line-height: 90px;
}

a {
  text-decoration: none;
  color: black;
}

a:active {
  color: #d79432;
}

a:hover {
  color: #d79432;
  cursor: pointer;
}

</style>
