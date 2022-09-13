<template>
  <div class="main">
    <div class="box-left">
      <div class="top-bar">
        <div class="headimg">
          <img :src="'https://www.uniwarm.net' + headimg" alt="" />
        </div>
        <div class="customerServiceInfo">
          <div style="width: 100%; height: 25px; display: flex">
            <h6>会话客服{{ userId }}</h6>
            <div class="submit-offline">提交下线</div>
          </div>
          <div style="width: 100%; height: 25px">
            <span style="font-size: 11px; color: #d79432">在线</span>
            <span style="font-size: 11px; margin-left: 20px"
              >本次工作时长：1小时20分钟</span
            >
          </div>
        </div>
      </div>
      <div class="callInfo">
        <div class="callnum">今日服务人数 {{ servicenum }} 人</div>
        <el-button
          :class="isAddingIssue ? 'addbtnOn' : 'addbtnOff'"
          type="warning"
          size="mini"
          @click="checkAddIssue()"
          >创建服务</el-button
        >
      </div>
      <!--电话主页列表-->
      <div class="itemlist">
        <div
          :class="
            isItemChecking == item.id
              ? 'checking-itemlist-line'
              : 'itemlist-line'
          "
          v-for="item in historyList"
          :key="item.id"
        >
          <div class="itemmmain" @click="checkDetail(item)">
            <div class="title">
              <div class="itemname">{{ item.message }}</div>
              <div class="iteminfo">{{ item.code }}</div>
            </div>
            <div class="detail">
              <div class="itemname">&nbsp;</div>
              <div class="iteminfo">{{ item.date }}</div>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
        <div style="width: 10vh">&nbsp;</div>
      </div>
    </div>

    <div class="box-right">
      <!--电话列表详情-->
      <div class="itemdetail" v-if="showdetail">
        <div class="detail-title">
          <div class="title-item">
            {{ phoneDetailInfo.detail.id }} &nbsp;(ID)
          </div>
          <div class="title-item">{{ phoneDetailInfo.detail.problem }}</div>
        </div>
        <div class="detail-info">
          <div class="info-line">
            <div class="info-item-multi">
              联系方式：&nbsp;&nbsp;&nbsp;{{ phoneDetailInfo.detail.phone }}
            </div>
            <div class="info-item-multi">
              回话类型：&nbsp;&nbsp;&nbsp;{{ phoneDetailInfo.detail.type }}
            </div>
            <div class="info-item-multi">
              接待客服：&nbsp;&nbsp;&nbsp;{{ phoneDetailInfo.detail.name }}
            </div>
            <div class="info-item-multi">
              会话时间：&nbsp;&nbsp;&nbsp;{{ phoneDetailInfo.detail.time }}
            </div>
          </div>
          <div class="info-line">
            <div class="info-item">
              咨询产品：&nbsp;&nbsp;&nbsp;{{ phoneDetailInfo.detail.product }}
            </div>
          </div>
          <div class="info-line">
            <div class="info-item">
              用户问题：&nbsp;&nbsp;&nbsp;{{
                phoneDetailInfo.detail.problemdetail
              }}
            </div>
          </div>
          <div class="info-line">
            <div class="info-item">
              解决方式：&nbsp;&nbsp;&nbsp;{{ phoneDetailInfo.state }}
            </div>
          </div>
          <div class="info-line">
            <div class="info-item">售后单：&nbsp;&nbsp;&nbsp;</div>
            <el-upload
              class="upload-demo"
              action="/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :http-request="uploadFile"
              :file-list="form.fileList"
            >
              <el-button class="addlist" size="mini" type="primary"
                >添加售后单</el-button
              >
            </el-upload>
          </div>
        </div>
      </div>

      <!--电话新增服务单（新增任务）-->
      <div class="newissue" v-if="showNewissue">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="服务单名称 :">
            <el-input
              size="small"
              v-model="form.name"
              placeholder="请输入服务单名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系方式 :">
            <el-input
              size="small"
              v-model="form.phone"
              placeholder="请输入联系方式"
            ></el-input>
          </el-form-item>
          <el-form-item label="咨询产品 :">
            <el-select
              size="small"
              style="width: 100%"
              v-model="form.consultProduct"
              multiple
              collapse-tags
              placeholder="请选择咨询产品"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户问题 :">
            <el-input
              size="small"
              type="textarea"
              :rows="5"
              v-model="form.desc"
            ></el-input>
          </el-form-item>
          <el-form-item label="会话截图 :">
            <div class="screenshot">
              <div class="screenshot-picture"></div>
              <div class="screenshot-picture"></div>
              <div class="screenshot-picture"></div>
              <div class="screenshot-picture"></div>
            </div>
          </el-form-item>
          <el-form-item label="解决方式 :">
            <el-select
              style="width: 100%"
              size="small"
              v-model="form.type"
              placeholder="请选择解决方式"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="uploadlist" label="售后单 :">
            <el-upload
              class="upload-demo"
              action="/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :http-request="uploadFile"
              :file-list="form.fileList"
            >
              <div class="edit">
                <div class="buttons">
                  <el-button
                    class="addbtn"
                    size="mini"
                    @click="toApplyChooseMat"
                    >添加售后单</el-button
                  >
                </div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button
              class="handleSaveEnd"
              size="mini"
              type="primary"
              @click="onSubmit"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      userId: "", // 客服id
      userSig: "",
      servicenum: "10", //今日服务人数
      // sdkAppID: 1400589788,
      showdetail: false, // 是否显示“电话列表详情”
      showNewissue: false, // 是否显示“创建服务单详情”
      isItemChecking: -1, // 是否正在查看列表详情（查看的item.id）
      isAddingIssue: false, // 是否正在创建服务单
      phoneDetailInfo: {},
      headimg: "",
      // 会话项列表
      historyList: [
        {
          id: "1",
          message: "111关于快递停发通知造成的发货延误",
          date: "2022.2.10 14:47",
          code: "SF14619616184583",
          name: "客服001",
          state: "维修保养申请1",
          detail: {
            name: "小小白",
            id: "1314520",
            phone: "123456789",
            type: "视频",
            customerServiceName: "0001",
            time: "2022.2.14 16:54",
            product: "黑色公文包",
            problem: "巴拉巴拉巴拉巴拉巴拉巴拉",
            way: "退换处理",
            problemdetail:
              "加加加包袋签收15天之内破损，二维码未激活，申请无理由退换货，已经与客服进行沟通。",
          },
        },
        {
          id: "2",
          message: "222关于快递停发通知造成的发货延误",
          date: "2022.2.10 14:47",
          code: "SF14619616184583",
          name: "客服002",
          state: "维修保养申请2",
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
            problemdetail:
              "一一包袋签收15天之内破损，二维码未激活，申请无理由退换货，已经与客服进行沟通。",
          },
        },
        {
          id: "3",
          message: "333关于快递停发通知造成的发货延误",
          date: "2022.2.10 14:47",
          code: "SF14619616184583",
          name: "客服001",
          state: "维修保养申请1",
          detail: {
            name: "小小白",
            id: "1314520",
            phone: "123456789",
            type: "视频",
            customerServiceName: "0001",
            time: "2022.2.14 16:54",
            product: "黑色公文包",
            problem: "巴拉巴拉巴拉巴拉巴拉巴拉",
            way: "退换处理",
            problemdetail:
              "QQQ包袋签收15天之内破损，二维码未激活，申请无理由退换货，已经与客服进行沟通。",
          },
        },
      ],
      // 售后单列表
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
      // 服务单-解决方式列表
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    };
  },

  created() {
    this.headimg = sessionStorage.getItem("headimg");
    this.userId = sessionStorage.getItem("video_id");
    console.log("当前登陆的客服的ID", this.userId);
    this.userSig = sessionStorage.getItem("usersig");
  },

  methods: {
    // 点击显示“创建服务单详情”
    checkAddIssue() {
      this.showdetail = false; //是否显示“电话列表详情”
      this.showNewissue = true; // 是否显示“创建服务单详情”
      this.isItemChecking = -1; // 更新正在查看的列表id
      this.isAddingIssue = true; // 改变“创建服务”按钮样式
    },
    // 点击显示“电话列表详情”
    checkDetail(item) {
      console.log(item);
      this.phoneDetailInfo = item;
      this.showNewissue = false; // 是否显示“创建服务单详情”
      this.showdetail = true; //是否显示“电话列表详情”
      this.isItemChecking = item.id; // 更新正在查看的列表id
      this.isAddingIssue = false; // 还原“创建服务”按钮样式
    },
  },
};
</script>

<style lang = "scss" scoped>
$img-size-base: 50px;
$box-left-width: 22%;
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.main {
  width: 100vw;
  height: calc(100vh - 175px);
  background-color: #f3f4f9;
  display: flex;
}

.box-left {
  width: $box-left-width;
  min-width: 350px;
  height: 100%;
  overflow: hidden;
  .top-bar {
    width: 100%;
    height: 100px;
    /*border-bottom: 1px solid #D5D7DD;*/
    display: flex;
    .headimg {
      width: $img-size-base;
      height: $img-size-base;
      margin: 25px 20px 25px 40px;
      position: relative;
      img {
        width: $img-size-base;
        height: $img-size-base;
        border-radius: $img-size-base;
        position: absolute;
        top: 50%;
        margin-top: calc($img-size-base / -2);
      }
    }
    .customerServiceInfo {
      height: 50px;
      margin-top: 25px;
      width: calc(100% - 110px);
      position: relative;
      .submit-offline {
        font-size: 11px;
        margin-left: 20px;
        padding: 0 5px;
        color: #d79432;
        border: 1px solid #d79432;
        border-radius: 3px;
        height: 16px;
        line-height: 16px;
        cursor: pointer;
      }
    }
  }
  .callInfo {
    width: 100%;
    height: 30px;
    background-color: #d5d7dd;
    display: flex;
    flex-direction: row;
    .callnum {
      width: 65%;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      text-align: center;
    }
    .addbtnOn {
      width: 35%;
      background-color: #2b5bdd;
      border: #a1a4ac;
      border-radius: 0;
    }
    .addbtnOff {
      width: 35%;
      background-color: #a1a4ac;
      border: #a1a4ac;
      border-radius: 0;
    }
  }
  .itemlist {
    width: 100%;
    height: calc(100% - 130px); //100% - 100px - 30px
    overflow: auto;
    display: flex;
    flex-direction: column;
    .checking-itemlist-line {
      width: 100%;
      padding-top: 2vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #fff;
    }
    .itemlist-line {
      width: 100%;
      padding-top: 2vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .itemmmain {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      cursor: pointer;
      .itemname {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 1vh;
      }
      .iteminfo {
        font-size: 10px;
        color: #616369;
      }
      .title {
        width: 70%;
        padding-left: 5%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
      }
      .detail {
        width: 30%;
        padding-right: 5%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
    .el-divider {
      margin: 1vh 0 0;
    }
  }
}

.box-right {
  width: 78%;
  height: 100%;
  min-width: 650px;
  background-color: #e9ebf4;
  position: relative;
  /*z-index: 1;*/
  overflow: hidden;
  /*border-right: 1px solid lightgrey;*/
  overflow-y: scroll;
}
</style>
