<template>
  <div class="main">
    <div class="topbar">
      <div class="headimg">
        <img :src="'https://www.uniwarm.net' + headimg" alt="" />
      </div>
      <div class="customerServiceInfo">
        <div class="firstrow" style="width: 100%; height: 25px; display: flex">
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
        <div class="lastrow" style="width: 100%; height: 25px">
          <span style="font-size: 11px; color: #d79432">在线</span>
          <span style="font-size: 11px; margin-left: 20px"
            >本次工作时长：1小时20分钟</span
          >
        </div>
      </div>
      <div class="newtask">
        <el-button
          type="primary"
          size="mini"
          v-if="isMainpage"
          @click="checkAddIssue()"
          >创建任务</el-button
        >
      </div>
    </div>
    <!--电话主页列表-->
    <div class="itemlist" v-if="showlist">
      <div class="itemlist-line" v-for="item in historyList" :key="item.id">
        <div class="itemmmain">
          <div class="title">
            <div class="itemname">{{ item.message }}</div>
            <div class="iteminfo">{{ item.code }}</div>
          </div>
          <div class="detail">
            <div class="itemname">客服:</div>
            <div class="iteminfo">{{ item.detail.name }}</div>
          </div>
          <div class="detail">
            <div class="itemname">创建时间：</div>
            <div class="iteminfo">{{ item.date }}</div>
          </div>
          <div class="detail">
            <div class="itemname">状态:</div>
            <div class="iteminfo">{{ item.state }}</div>
          </div>
          <div class="check" @click="checkDetail(item)">查看</div>
        </div>
        <el-divider></el-divider>
      </div>
    </div>

    <!--电话列表详情-->
    <div class="itemdetail" v-if="showdetail">
      <div class="detail-title">
        <div class="title-item">{{ phoneDetailInfo.detail.id }} &nbsp;(ID)</div>
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
                <el-button class="addbtn" size="mini" @click="toApplyChooseMat"
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
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      userId: "",
      userSig: "",
      // sdkAppID: 1400589788,
      showlist: true,
      showdetail: false,
      showNewissue: false,
      isMainpage: true,
      phoneDetailInfo: {},
      headimg: "",
      // 会话项列表
      historyList: [
        {
          id: "1",
          message: "关于快递停发通知造成的发货延误",
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
          message: "关于快递停发通知造成的发货延误",
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
          message: "关于快递停发通知造成的发货延误",
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
    // 创建服务
    checkAddIssue() {
      this.showlist = false;
      this.showdetail = false;
      this.showNewissue = true;
      this.isMainpage = false;
    },
    // 查看已有的服务详情
    checkDetail(item) {
      console.log(item);
      this.phoneDetailInfo = item;
      this.showlist = false;
      this.showNewissue = false;
      this.showdetail = true;
      this.isMainpage = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$img-size-base: 60px;
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.main {
  width: 100vw;
  // height: calc(100vh - 175px);
  background-color: #f3f4f9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topbar {
  width: 97vw;
  height: 12vh;
  margin: 15px 0;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: white;
  position: relative;
  .headimg {
    width: $img-size-base;
    height: 100%;
    margin: 0 10px;
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
    margin-top: auto 0;
    width: calc(100% - 100px);
    height: 100%;
    right: 0px;
    margin-top: 3vh;
    // display: flex;
    // flex-direction: column;
    // .firstrow{
    // }
  }
  .newtask {
    position: absolute;
    right: 80px;
    top: 50%;
    margin-top: -13px;
    .el-button {
      width: 100px;
      border-radius: 2px;
    }
  }
}

.itemlist {
  width: 86vw;
  height: calc(86vh - 205px); //(100vh-175px) - 12vh - 2vh - 15px*2
  display: flex;
  flex-direction: column;
  margin-top: 2vh;
  // background-color: rgb(51, 235, 255);
  .itemlist-line {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .itemmmain {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      position: relative;
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
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
      }
      .detail {
        width: 10%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .check {
        color: #d79432;
        font-size: 12px;
        cursor: pointer;
        position: absolute;
        right: 0;

        .el-icon-arrow-left {
          font-weight: bolder;
        }
      }
    }
    .el-divider {
      margin: 1vh 0;
    }
  }
}

.itemdetail {
  width: 86vw;
  height: calc(84vh - 205px); //(100vh-175px) - 12vh - 4vh - 15px*2
  display: flex;
  flex-direction: column;
  margin-top: 4vh;
  .detail-title {
    font-size: 14px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    margin-bottom: 3vh;
    .title-item {
      width: 25vw;
    }
  }
  .detail-info {
    font-size: 14px;
    color: #616369;
    display: flex;
    flex-direction: column;
    // margin-bottom: 1vh;
    .info-line {
      display: flex;
      flex-direction: row;
      margin-bottom: 4vh;
      .info-item-multi {
        width: 15vw;
      }
      .upload-demo {
        padding: 10px;
        border-radius: 6px;
        border: 1px dashed #d9d9d9;
      }
      .upload-demo:hover {
        color: #ad8633;
      }
    }
  }
}

.newissue {
  width: 86vw;
  display: flex;
  flex-direction: column;
  margin-top: 2vh;
  .screenshot {
    width: 100%;
    /*height: 80px;*/
    /*border: 1px solid black;*/
    /*display: block;*/
    margin-top: 30px;
    display: flex;
    .screenshot-picture {
      width: 60px;
      height: 60px;
      border: 1px solid lightgray;
      margin-right: 5px;
    }
  }

  .uploadlist {
    .upload-demo:hover {
      border-color: #409eff;
    }

    .upload-demo {
      width: 330px;
      height: 160px;
      padding: 2px 10px 10px;
      border: 1px solid #d4d7dd;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-content: flex-start;
      ::v-deep .el-upload-list.el-upload-list--text {
        order: -2;
        padding-bottom: 5px;
      }

      ::v-deep .el-upload-list__item-name {
        color: #d79432;
      }
      .edit {
        // order: 100;
        height: 3vh;
        width: 10vw;
        // 售后单部分的“添加售后单”按钮
        .addbtn {
          order: 3;
          height: 3vh;
          width: 10vw;
          padding: 0;
          background-color: rgb(243, 244, 249);
          color: #d79432;
          border: 1px solid #d79432;
          border-radius: 3px;
          //按钮内字体大小
          font-size: 10px;
        }
      }
    }

    .upload-demo {
      // width: 330px;
      // height: 240px;
      // padding: 2px 10px 10px;
      // border: 1px dashed #d9d9d9;
      // border-radius: 6px;
      // overflow: hidden;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;

      // // 三个内容位置及样式
      // // 提示语
      // // .el-upload__tip {
      // //   order: 2;
      // //   margin: 0;
      // //   height: 3vh;
      // //   line-height: 3vh;
      // // }
      // // 文件列表
      // .el-upload-list.el-upload-list--text {
      //   order: -2;
      //   padding-bottom: 5px;
      // }
      // // 按钮和按钮内字体大小
      // .buttons .el-button--medium {
      //   font-size: 8px;
      // }
    }

    ::v-deep {
      .el-upload-list__item-name {
        color: #d79432;
      }
    }
    ::v-deep .el-upload-list__item-name {
      color: #d79432;
    }
  }

  // ::v-deep .uploadlist .el-upload-list__item-name {
  //   color: #d79432;
  // }

  // ::v-deep {
  //   .el-upload-list__item-name {
  //     color: #d79432;
  //   }
  //   .el-icon-document:before {
  //     color: #d79432;
  //   }
  //   .el-upload-list__item .el-icon-upload-success {
  //     color: #d79432;
  //   }
  // }
}
</style>
