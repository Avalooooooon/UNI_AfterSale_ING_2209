<template>
  <div class="main">
    <div class="Detail" style="background-color: #f3f4f9;">
      <div style="box-sizing: border-box;padding: 0 40px">
        <table style=" width:100%">
          <tr style="height: 30px;line-height: 30px;">
            <td style="width: 100px;min-width: 100px;height: 60px" colspan="4">
              <i class="el-icon-collection"></i>
              <span style="font-size: 17px;font-weight: 600;margin-left: 10px">单号 : <span
                style="margin-left: 30px">{{ aftersaleInfo.orderId }}</span></span>
            </td>
            <td class="header_table_td_status">
              <el-button
                size="mini"
                type="warning"
                @click="handleReturn()"
              >返回
              </el-button>
            </td>
          </tr>
          <tr class="header_table_tr">
            <td class="header_table_td_key">申请人 ：</td>
            <td class="header_table_td_value">{{ aftersaleInfo.name }}</td>
            <td class="header_table_td_key">服务账号 ：</td>
            <td class="header_table_td_value">{{ Detaildata.user_id }}</td>
            <td class="header_table_td_status">进度</td>
          </tr>
          <tr class="header_table_tr">
            <td class="header_table_td_key">售后类型 ：</td>
            <td>
              {{
                aftersaleInfo.service_type === 'repair' ? '维修' :
                  aftersaleInfo.service_type === 'upkeep' ? '保养' : ''
              }}
            </td>
            <td class="header_table_td_key">服务商品 ：</td>
            <td>{{ this.aftersaleInfo.product_name }}</td>
            <td class="header_table_td_status" style="font-size: 20px;font-weight: 700">
              {{
                Detaildata.progress === 'audit' ? '审核' :
                  Detaildata.progress === 'mailing' ? '寄件' :
                    Detaildata.progress === 'diagnosis' ? '诊断' :
                      Detaildata.progress === 'process' ? '处理' :
                        Detaildata.progress === 'receiving' ? '收货' :
                          Detaildata.progress === 'done' ? '完成' :
                            Detaildata.progress === 'mailback' ? '寄回' :
                              Detaildata.progress === 'recback' ? '收货' :
                                Detaildata.progress === 'cancel' ? '取消' : ''

              }}
            </td>
          <tr class="header_table_tr">
            <td class="header_table_td_key">申请时间 ：</td>
            <td>{{ aftersaleInfo.create_time }}</td>
            <td></td>
            <td></td>
            <td class="header_table_td_status" style="color: #e6a23c">
              <!--              <span @click="handleReview()">审核</span>-->
            </td>
          </tr>
        </table>
      </div>
      <div style="line-height: 40px;border-bottom: 1px solid #E4E7ED; margin: 20px 35px 0;">
        <div style="width: 40px;text-align: center;line-height: 40px;color: #D79432;border-bottom: 3px solid #D79432">
          详情
        </div>
      </div>
      <div class="bottomInfo">
        <div class="codeDetail-left">
          <table style="width: 100%">
            <tr class="table_tr">
              <td class="footer_table_td_key">申请人 ：</td>
              <td class="footer_table_td_value">{{ aftersaleInfo.name }}</td>
              <td class="footer_table_td_key">申请时间 ：</td>
              <td class="footer_table_td_value">{{ aftersaleInfo.create_time }}</td>
            </tr>
            <tr class="table_tr">
              <td class="footer_table_td_key">联系人 ：</td>
              <td class="footer_table_td_value">{{ Detaildata.name }}</td>
              <td class="footer_table_td_key">联系电话 ：</td>
              <td class="footer_table_td_value">{{ Detaildata.phone }}</td>
            </tr>
            <tr class="table_tr">
              <td>联系地址 ：</td>
              <td colspan="3">{{ Detaildata.address }}</td>
            </tr>
            <tr class="table_tr">
              <td>问题描述 ：</td>
              <td colspan="3">{{ Detaildata.description }}</td>
            </tr>
            <tr class="table_tr">
              <td>实际图片 ：</td>
              <td colspan="3">
                <ul id="pic_list">
                  <li v-for="a in Detaildata.service_image" :key="a" style="margin-right: 25px">
                    <div class="demo-image__preview">
                      <el-image
                        style="width: 60px; height: 60px"
                        :src="'http://www.bizspace.cn:8690'+ a"
                        :preview-src-list="srcList">
                      </el-image>
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
            <tr class="table_tr">
              <td colspan="4">用户寄件物流 ：{{ mailingObj.agency }} {{ mailingObj.number }}</td>
            </tr>
            <tr class="table_tr">
              <td colspan="4">客服寄件物流 ：{{ receivingObj.agency }} {{ recbackObj.agency }} {{ receivingObj.number }}
                {{ recbackObj.number }}
              </td>
            </tr>
          </table>
        </div>
        <div class="codeDetail-right">
          <h3 style="margin: 40px 50px">售后单流程</h3>
          <div class="aftersaleStep">
            <div class="step">
              <el-timeline>
                <el-timeline-item
                  :color="this.orderStep.length ===  1? '#D79432' : (this.orderStep.length < 1) ? '#253647' : '#999999'"
                  timestamp="订单审核" placement="top">
                  <el-card v-show="this.orderStep.length > 0">
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ auditObj.date }}</h4>
                      <div>
                        {{ auditObj.text }}<br>
                        操作人：{{ auditObj.operator }}
                        <el-button style="position: absolute;right: 10px;top: 10px" v-if="auditObj.status === 'wait'"
                                   type="warning" size="mini"
                                   @click="dialogFormVisible = true">审核
                        </el-button>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item
                  :color="this.orderStep.length ===  2? '#D79432' : (this.orderStep.length < 2) ? '#253647' : '#999999'"
                  timestamp="用户寄件" placement="top">
                  <el-card v-show="this.orderStep.length > 1">
                    <!--                    && this.orderStep[1] !== null-->
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ mailingObj.date }}</h4>
                      <div>
                        联系人：{{ mailingObj.name }}
                        <span style="margin-left: 30px">联系电话：{{ mailingObj.phone }}</span><br>
                        联系地址：{{ mailingObj.address }}<br>
                        物流公司：{{ mailingObj.agency }}
                        <span style="margin-left: 30px">物流单号：{{ mailingObj.number }}</span><br>
                        操作人：{{ mailingObj.operator }}
                        <el-button v-show="this.orderStep.length  === 2"
                                   style="position: absolute;right: 10px;top: 10px" type="warning" size="mini"
                                   @click="receiptpage = true">收货
                        </el-button>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item
                  :color="this.orderStep.length ===  3? '#D79432' : (this.orderStep.length < 3) ? '#253647' : '#999999'"
                  timestamp="专家诊断" placement="top">
                  <el-card v-show="this.orderStep.length > 2">
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ diagnosisObj.date }}</h4>
                      <div>
                        {{ diagnosisObj.text }}<br>
                        操作人：{{ diagnosisObj.operator }}
                        <el-button v-show="this.orderStep.length  === 3"
                                   style="position: absolute;right: 10px;top: 10px" type="warning" size="mini"
                                   @click="diagnosispage = true">收款
                        </el-button>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item v-if="normal"
                                  :color="this.orderStep.length ===  4? '#D79432' : (this.orderStep.length < 4) ? '#253647' : '#999999'"
                                  timestamp="专家处理" placement="top">
                  <el-card v-show="this.orderStep.length > 3">
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ processObj.date }}</h4>
                      <div>
                        {{ processObj.text }}<br>
                        操作人：{{ processObj.operator }}
                        <el-button v-show="this.orderStep.length  === 4"
                                   style="position: absolute;right: 10px;top: 10px" type="warning" size="mini"
                                   @click="processpage = true">发货
                        </el-button>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item v-if="normal"
                                  :color="this.orderStep.length ===  5? '#D79432' : (this.orderStep.length < 5) ? '#253647' : '#999999'"
                                  timestamp="用户收货" placement="top">
                  <el-card v-show="this.orderStep.length > 4">
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ receivingObj.date }}</h4>
                      <div>
                        联系人：{{ receivingObj.name }}
                        <span style="margin-left: 30px">联系电话：{{ receivingObj.phone }}</span><br>
                        联系地址：{{ receivingObj.address }}<br>
                        物流公司：{{ receivingObj.agency }}
                        <span style="margin-left: 30px">物流单号:{{ receivingObj.number }}</span><br>
                        操作人：{{ receivingObj.operator }}
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item v-if="normal"
                                  :color="this.orderStep.length ===  6? '#D79432' : (this.orderStep.length < 6) ? '#253647' : '#999999'"
                                  timestamp="已完成" placement="top">
                  <el-card v-show="this.orderStep.length > 5">
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ doneObj.date }}</h4>
                      <div>
                        {{ doneObj.text }}<br>
                        操作人：{{ doneObj.operator }}
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item v-if="diagnosisObj.status === 'cancel'"
                                  :color="this.orderStep.length ===  4? '#D79432' : (this.orderStep.length < 4) ? '#253647' : '#999999'"
                                  timestamp="订单寄回" placement="top">
                  <el-card v-show="this.orderStep.length > 3">
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ mailbackObj.date }}</h4>
                      <div>
                        {{ mailbackObj.text }}<br>
                        操作人：{{ mailbackObj.operator }}
                        <el-button v-show="this.orderStep.length === 5" style="position: absolute;right: 10px;top: 10px"
                                   type="warning" size="mini"
                                   @click="processpage = true">发货
                        </el-button>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item v-if="diagnosisObj.status === 'cancel'"
                                  :color="this.orderStep.length ===  5? '#D79432' : (this.orderStep.length < 5) ? '#253647' : '#999999'"
                                  timestamp="用户收货" placement="top">
                  <el-card v-show="this.orderStep.length > 5">
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ recbackObj.date }}</h4>
                      <div>
                        联系人：{{ recbackObj.name }}
                        <span style="margin-left: 30px">联系电话：{{ recbackObj.phone }}</span><br>
                        联系地址：{{ recbackObj.address }}<br>
                        物流公司：{{ recbackObj.agency }}
                        <span style="margin-left: 30px">物流单号：{{ recbackObj.number }}</span><br>
                        操作人：{{ recbackObj.operator }}
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item v-if="diagnosisObj.status === 'cancel'"
                                  :color="this.orderStep.length ===  6? '#D79432' : (this.orderStep.length < 6) ? '#253647' : '#999999'"
                                  timestamp="已取消" placement="top">
                  <el-card v-show="this.orderStep.length > 6">
                    <div style="position: relative">
                      <h4 style="color: rgba(114, 194, 45)">{{ cancelObj.date }}</h4>
                      <div>
                        {{ cancelObj.text }}<br>
                        操作人：{{ cancelObj.operator }}
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
              <!--              售后单审核-->
              <el-dialog title="售后单审核" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center>
                <el-form>
                  <el-form-item label="审核情况 : " :label-width="formLabelWidth">
                    <el-radio @change="check()" v-model="operation" label="pass">审核通过</el-radio>
                    <el-radio @change="check()" v-model="operation" label="reject">不予审核</el-radio>
                  </el-form-item>
                  <el-form-item label="反馈 : " :label-width="formLabelWidth">
                    <el-input
                      type="textarea"
                      placeholder="请描述所需服务"
                      v-model="remark"
                      maxlength="100"
                      rows="5"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="handleCancel()">取 消</el-button>
                  <el-button type="primary" @click="handleReview()">确 定</el-button>
                </div>
              </el-dialog>
              <!--              确认收货-->
              <el-dialog title="确定已接收货物吗？" :close-on-click-modal="false" :visible.sync="receiptpage">
                <el-form>
                  <el-form-item>
                    <el-input
                      type="textarea"
                      placeholder="请输入操作备注"
                      v-model="receiptremark"
                      maxlength="100"
                      rows="5"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="receiptCancel()">取 消</el-button>
                  <el-button type="primary" @click="receiptReview()">确 定</el-button>
                </div>
              </el-dialog>
              <!--              专家诊断收款-->
              <el-dialog title="售后单收款？" :close-on-click-modal="false" :visible.sync="diagnosispage" center>
                <el-form>
                  <el-form-item label="收款情况 : " :label-width="formLabelWidth">
                    <el-radio @change="checkPayment()" v-model="operationPay" label="paid">已收款</el-radio>
                    <el-radio @change="checkPayment()" v-model="operationPay" label="cancel">未收款</el-radio>
                  </el-form-item>
                  <el-form-item label="备注 : " :label-width="formLabelWidth">
                    <el-input
                      type="textarea"
                      placeholder="请描述所需服务"
                      v-model="diagnosisremark"
                      maxlength="100"
                      rows="5"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="diagnosisCancel()">取 消</el-button>
                  <el-button type="primary" @click="diagnosisReview()">确 定</el-button>
                </div>
              </el-dialog>
              <!--              客服发货寄回-->
              <el-dialog title="发货信息填写" :close-on-click-modal="false" :visible.sync="processpage" center>
                <el-form :label-position="labelPosition" label-width="100px" :model="formOrder">
                  <el-form-item label="收件人 ：">
                    <el-input v-model="formOrder.name"></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式 ：">
                    <el-input v-model="formOrder.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="联系地址 ：">
                    <el-input v-model="formOrder.address"></el-input>
                  </el-form-item>
                  <el-form-item label="物流方式 ：">
                    <el-input v-model="formOrder.agency"></el-input>
                  </el-form-item>
                  <el-form-item label="快递单号 ：">
                    <el-input v-model="formOrder.number"></el-input>
                  </el-form-item>
                  <el-form-item label="备注 : ">
                    <el-input
                      type="textarea"
                      placeholder="请输入备注"
                      v-model="formOrder.remark"
                      maxlength="100"
                      rows="5"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="processCancel()">取 消</el-button>
                  <el-button type="primary" @click="processReview()">提 交</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cookie from 'js-cookie'
import saleApi from '../../../../api/org/saleApi'
import axios from 'axios'

export default {
  data () {
    return {
      activeName: 'first',
      bizid: 'uniwarm',
      token: '',
      rowId: '',
      Detaildata: [],
      srcList: [], // 图片列表
      aftersaleInfo: {
        name: '',
        service_type: '',
        create_time: '',
        product_name: '',
        orderId: ''
      },
      orderStep: [],
      Allinfo: [],
      centerDialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      operation: 'pass',
      remark: '',
      normal: true,
      ship: true,
      receiptpage: false,
      receiptremark: '',
      diagnosispage: false,
      operationPay: 'paid',
      diagnosisremark: '',
      processpage: false,
      labelPosition: 'right',
      formOrder: {
        name: '',
        phone: '',
        address: '',
        agency: '',
        number: '',
        remark: ''
      },
      auditObj: {
        status: '',
        text: '',
        date: '',
        operator: ''
      },
      mailingObj: {
        name: '',
        phone: '',
        address: '',
        agency: '',
        number: '',
        date: '',
        operator: ''
      },
      diagnosisObj: {
        status: '',
        text: '',
        date: '',
        operator: ''
      },
      processObj: {
        text: '',
        date: '',
        operator: ''
      },
      receivingObj: {
        name: '',
        phone: '',
        address: '',
        agency: '',
        number: '',
        date: '',
        operator: ''
      },
      doneObj: {
        text: '',
        date: '',
        operator: ''
      },
      mailbackObj: {
        text: '',
        date: '',
        operator: ''
      },
      recbackObj: {
        name: '',
        phone: '',
        address: '',
        agency: '',
        number: '',
        date: '',
        operator: ''
      },
      cancelObj: {
        text: '',
        date: '',
        operator: ''
      }
    }
  },
  created () {
    this.token = cookie.get('token')
    console.log(this.token)
    this.token = cookie.get('token')
    this.rowId = this.$route.query.service_id
    this.Detail()
    this.aftersaleInfo.name = sessionStorage.getItem('name')
    this.aftersaleInfo.service_type = sessionStorage.getItem('service_type')
    this.aftersaleInfo.create_time = sessionStorage.getItem('create_time')
    this.aftersaleInfo.product_name = sessionStorage.getItem('product_name')
    this.aftersaleInfo.orderId = sessionStorage.getItem('orderId')
    if (this.operation === 'pass') {
      this.remark = '订单审核已通过,请将产品寄到： 北京市海淀区学院路15号院北发大厦B座407,收件人：熊先生，收件电话：13810925485'
    }
  },
  methods: {
    // 获取详情
    Detail () {
      saleApi.getSaleDetail(this.rowId).then(
        /**
         * @param res 响应
         * @param res.detail 详情
         * @param res.user_id 用户ID
         * @param res.detail.orderStep.dt 备注
         * @param res.detail.orderStep.edit_time 编辑时间
         * @param res.detail.orderStep.operator 操作人
         * @param res.detail.orderStep.pg 状态
         * @param res.service_image 图片
         */
        res => {
          this.Detaildata = res
          this.orderStep = res.detail
          console.log(this.orderStep.length)
          // console.log(this.orderStep)
          let imgPathList = this.Detaildata.service_image
          // 遍历图片链接
          for (let i = 0; i < imgPathList.length; i++) {
            this.srcList.push('http://www.bizspace.cn:8690' + imgPathList[i])
          }
          console.log(this.Allinfo)
          for (let i = 0; i < this.orderStep.length; i++) {
            switch (this.orderStep[i].pg) {
              case 'audit':
                // 返回的信息中如果有 /n 换行的话，使用JSON就解析不了了
                let dtAuditString = this.orderStep[i].dt.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                this.auditObj = JSON.parse(dtAuditString)
                this.auditObj.date = this.orderStep[i].edit_time
                this.auditObj.operator = this.orderStep[i].operator
                continue
              case 'mailing':
                this.mailingObj = JSON.parse(this.orderStep[i].dt)
                this.mailingObj.date = this.orderStep[i].edit_time
                this.mailingObj.operator = this.orderStep[i].operator
                continue
              case 'diagnosis':
                let dtDiagnosisString = this.orderStep[i].dt.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                this.diagnosisObj = JSON.parse(dtDiagnosisString)
                if (this.diagnosisObj.status === 'paid') {
                  this.normal = true
                } else if (this.diagnosisObj.status === 'cancel') {
                  this.normal = false
                }
                this.diagnosisObj.date = this.orderStep[i].edit_time
                this.diagnosisObj.operator = this.orderStep[i].operator
                continue
              case 'process':
                let dtProcessString = this.orderStep[i].dt.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                this.processObj = JSON.parse(dtProcessString)
                this.processObj.date = this.orderStep[i].edit_time
                this.processObj.operator = this.orderStep[i].operator
                continue
              case 'receiving':
                this.receivingObj = JSON.parse(this.orderStep[i].dt)
                this.receivingObj.date = this.orderStep[i].edit_time
                this.receivingObj.operator = this.orderStep[i].operator
                continue
              case 'done':
                let dtDoneString = this.orderStep[i].dt.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                this.doneObj = JSON.parse(dtDoneString)
                this.doneObj.date = this.orderStep[i].edit_time
                this.doneObj.operator = this.orderStep[i].operator
                continue
              case 'mailback':
                let dtMailbackString = this.orderStep[i].dt.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                this.mailbackObj = JSON.parse(dtMailbackString)
                this.mailbackObj.date = this.orderStep[i].edit_time
                this.mailbackObj.operator = this.orderStep[i].operator
                continue
              case 'recback':
                this.recbackObj = JSON.parse(this.orderStep[i].dt)
                this.recbackObj.date = this.orderStep[i].edit_time
                this.recbackObj.operator = this.orderStep[i].operator
                continue
              case 'cancel':
                let dtCancelString = this.orderStep[i].dt.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                this.cancelObj = JSON.parse(dtCancelString)
                this.cancelObj.date = this.orderStep[i].edit_time
                this.cancelObj.operator = this.orderStep[i].operator
            }
          }
          console.log(this.orderStep)
          if (this.normal === false) {
            this.orderStep.splice(1, 0, null)
          }
        })
    },
    // 详情返回列表
    handleReturn () {
      this.$router.push('/customerService/salesOrder')
    },
    // 审核提交
    handleReview () {
      this.dialogFormVisible = false
      saleApi.customerServiceReview(this.rowId, this.remark, this.operation).then(() => {
        this.Detail()
        this.$message.success('提交成功')
        this.remark = ''
      })
      this.Detail()
    },
    // 审核取消
    handleCancel () {
      this.dialogFormVisible = false
    },
    // 客服审核通过/不通过
    check () {
      if (this.operation === 'pass') {
        this.remark = '订单审核已通过,请将产品寄到： 北京市海淀区学院路15号院北发大厦B座407,收件人：熊先生，收件电话：13810925485'
      } else if (this.operation === 'reject') {
        this.remark = '非常抱歉，Uniwarm暂时不能处理您提交的服务项目,如需其他服务请重新提交服务单。'
      }
    },
    // 收货取消
    receiptCancel () {
      this.receiptpage = false
      this.receiptremark = ''
    },
    // 收货确定
    receiptReview () {
      saleApi.receiptSure(this.rowId, this.receiptremark).then(() => {
        this.$message.success('收货成功')
        this.receiptpage = false
        this.receiptremark = ''
        this.Detail()
      })
    },
    // 专家诊断选择是否已支付
    checkPayment () {
    },
    // 收款取消
    diagnosisCancel () {
      this.diagnosispage = false
      this.diagnosisremark = ''
    },
    // 确认收款
    diagnosisReview () {
      saleApi.PaymentSure(this.rowId, this.diagnosisremark, this.operationPay).then(() => {
        this.diagnosispage = false
        this.diagnosisremark = ''
        this.$message.success('收款成功')
        this.Detail()
      })
    },
    // 发货取消
    processCancel () {
      this.processpage = false
      this.formOrder = {}
    },
    // 客服发货寄回提交
    processReview () {
      let formOrderStr = JSON.stringify(this.formOrder)
      axios({
        url: '/api/aftersale/v1/service/mail',
        method: 'post',
        params: {
          'bizid': this.bizid,
          'token': this.token,
          'service_id': this.rowId
        },
        data: formOrderStr,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        console.log(res)
        this.processpage = false
        this.formOrder = {}
        this.Detail()
        this.ship = false
        this.$message.success('发货成功！')
      })
    }
  }
}
</script>

<style scoped>

.main {
  /*border: 1px solid black;*/
  height: 100%;
  background-color: #f3f4f9;
}

.Detail {
  /*border: 1px solid red;*/
  /* margin: 0px 40px ; */
  /*height: calc(100vh - 190px);*/
  height: 100%;
  font-size: 14px;
}

.codeInfo {
  width: 100%;
  max-width: 1920px;
  /* border-bottom: 1px solid lightgray; */
}

.bottomInfo {
  margin: 0 40px;
  /*border: 1px solid blue;*/
  line-height: 40px;
  /* border: 1px solid black; */
  display: flex;
  /*height: calc(100vh - 440px);*/
  height: 100%;
}

.codeDetail-left {
  /*margin-top: 40px;*/
  width: 60%;
  min-width: 900px;
  max-width: 1200px;
  float: left;
  border-right: 1px solid rgba(0, 0, 0, 0.07);
  overflow-y: auto;
}

.codeDetail-left::-webkit-scrollbar {
  width: 6px;
}

.codeDetail-left::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.codeDetail-left:hover::-webkit-scrollbar-thumb {
  background: #E4E7ED;
}

.codeDetail-left:hover::-webkit-scrollbar-track {
  background: #F3F4F9;
}

.codeDetail-right {
  width: 40%;
  /*min-width: 500px;*/
  /*border: 1px solid black;*/
  height: calc(100vh - 400px);
  /*height: 100%;*/
  float: right;
  border-left: 1px solid lightgray;
  overflow: auto;
}

.codeDetail-right::-webkit-scrollbar {
  width: 6px;
}

.codeDetail-right::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.codeDetail-right:hover::-webkit-scrollbar-thumb {
  background: #E4E7ED;
}

.codeDetail-right:hover::-webkit-scrollbar-track {
  background: #F3F4F9;
}

#pic_list {
  display: flex;
}

#pic_list li {
  width: 40px;
  height: 40px;
  list-style: none;
  float: left;
}

.header_table_td_key {
  font-size: 14px;
  font-weight: 600;
  width: 100px;
  min-width: 100px;
  padding-left: 40px;
}

.header_table_tr {
  height: 30px;
  line-height: 30px;
}

.header_table_td_value {
  font-size: 14px;
  width: 350px;
  min-width: 350px;
}

.header_table_td_status {
  letter-spacing: 2px;
  float: right;
}

.footer_table_td_key {
  width: 100px;
  /* min-width: 70px; */
}

.footer_table_td_value {
  /* min-width: 200px; */
}

.aftersaleStep {
  width: 100%;
  box-sizing: border-box;
  height: 95%;
  padding-left: 60px;
  /*border: 1px solid red;*/
  /* border: 1px solid black; */
  display: flex;
  margin-top: 40px;
}

.step {
  width: calc(100% - 50px);
  height: 100%;
  /*border: 1px solid black;*/
  float: left;
}

.operating {
  width: 50px;
  height: 100%;
  /*border: 1px solid black;*/
  float: right;
}

.operating ul li {
  width: 50px;
  text-align: center;
  list-style: none;
  margin-bottom: 50px;
}

.table_tr {
  height: 70px;
}
</style>
