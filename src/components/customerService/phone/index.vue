<template>
  <div class="main">
    <div class="topbar">
      <span class="headimg">
        <img
          style="width: 50px; height: 50px"
          :src="'https://www.uniwarm.net' + headimg"
          alt=""
        />
      </span>
      <div class="customerServiceInfo">
        <div style="width: 100%; height: 25px; display: flex">
          <span style="font-size: 14px; font-weight: bold"
            >会话客服{{ userId }}</span
          >
          <div
            style="
              font-size: 11px;
              margin-left: 20px;
              padding: 0 5px;
              color: #d79432;
              border: 1px solid #d79432;
              border-radius: 3px;
              height: 16px;
              line-height: 16px;
              cursor: pointer;
            "
          >
            提交下线
          </div>
        </div>
        <div style="width: 100%; height: 25px">
          <span style="font-size: 11px; color: #d79432">在线</span>
          <span style="font-size: 11px; margin-left: 20px"
            >本次工作时长：1小时20分钟</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      loginType: 2, // github 登录只使用默认账号登录
      userId: "",
      userSig: "",
      sdkAppID: 1400589788,
      checkDetail: true,
      conversationSlip: false,
      historyService: true,
      historyDetail: false,
      historyDetailInfo: {},
      headimg: "",
      form: {
        name: "",
        phone: "",
        consultProduct: "",
        desc: "",
        type: "",
        fileList: [
          {
            name: "food.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          },
          {
            name: "food2.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          },
        ],
      },
      historyList: [
        {
          id: "1",
          message: "关于快递停发通知造成的发货延误",
          date: "2022.2.10 14:47",
          code: "SF14619616184583",
          name: "客服001",
          detail: {
            name: "小白",
            id: "1314520",
            phone: "123456789",
            type: "视频",
            customerServiceName: "0001",
            time: "2022.2.14 16:54",
            product: "黑色公文包",
            problem: "巴拉巴拉巴拉巴拉巴拉巴拉",
            way: "退换处理",
          },
        },
        {
          id: "2",
          message: "关于快递停发通知造成的发货延误",
          date: "2022.2.10 14:47",
          code: "SF14619616184583",
          name: "客服002",
          detail: {
            name: "小黑",
            id: "16516161",
            phone: "18649461613",
            type: "电话",
            customerServiceName: "0001",
            time: "2022.2.14 16:54",
            product: "白色鳄鱼皮包",
            problem: "美国弄完就公婆我今儿个胖娃价格",
            way: "维修保养",
          },
        },
      ],
      buttonSelected: "historySlip",
    };
  },

  created() {
    this.headimg = sessionStorage.getItem("headimg");
    this.userId = sessionStorage.getItem("video_id");
    console.log("当前登陆的客服的ID", this.userId);
    this.userSig = sessionStorage.getItem("usersig");
  },
};
</script>

<style lang="scss" scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.main {
  width: 100%;
  /* min-width: 100%; */
  height: calc(100vh - 175px);
  margin: 0 auto;
  background-color: #f3f4f9;
  display: flex;
  flex-direction: column;
}

.top-bar {
  width: 100vw;
  height: 10vh;
  /*border: 1px solid blue;*/
  display: flex;
  flex-direction: row;
  background-color: aqua;
  .headimg{
    width: 50px;
    height: 50px;
    border-radius: 50px;
    margin: 25px 20px 25px 40px;
  }
}

/* .customerServiceInfo {
  height: 50px;
  margin-top: 25px;
  width: calc(100% - 110px);
  position: relative;
} */
</style>
