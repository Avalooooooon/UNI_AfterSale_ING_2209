<template>
  <div class="box" id="box"><!--      :style="{'min-width': this.width}"-->
    <div class="content">
      <div class="selectchoose">
        <div style="margin-top: 30px">
          <div class="selects">
            <span class="selecters">售后类型：</span>
            <el-select
              v-model="formData.saletype"
              size="mini"
              style="width: 150px;min-width: 50px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span class="selecters">服务商品 :</span>
            <el-select
              v-model="formData.serviceshop"
              size="mini"
              style="width: 150px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span class="selecters">售后ID :</span>
              <el-input style="width: 150px" size="mini" v-model="formData.aftersaleId"></el-input>
<!--            <el-select-->
<!--              v-model="formData.aftersaleId"-->
<!--              size="mini"-->
<!--              style="width: 150px"-->
<!--              placeholder="请选择"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in options"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value"-->
<!--              >-->
<!--              </el-option>-->
<!--            </el-select>-->
            <span class="selecters">最后操作人 :</span>
            <el-select
              v-model="formData.lastname"
              size="mini"
              style="width: 150px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span class="selecters">最后操作时间 :</span>
            <el-date-picker
              size="mini"
              v-model="formData.lasttime"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </div>
          <div class="button-check">
            <el-button type="primary" size="mini">筛选</el-button>
            <el-button type="primary" size="mini" @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="main-left">
          <ul style="margin-top: 10px">
            <li
              v-for="item in items"
              v-bind:key="item"
              class="collection-item"
              :class="{ active_li: activeName === item }"
              @click="selected(item)"
            >
              <a :class="{ active_a: activeName === item }"> {{ item }}</a>
            </li>
          </ul>
        </div>
        <div class="main-right">
          <div class="user_skills" style="margin-top: 20px">
            <!--header-cell-style="color:black"-->
            <el-table
              class="tableBox"
              :data="tableData"
              :show-overflow-tooltip="true"
              style="font-size: 13px"
              v-loading="loading"
              element-loading-background="rgba(233,235,244,0.8)"
            >
              <el-table-column label="ID" width="280">
                <template slot-scope="scope">
                    <span style="margin-left: 10px; font-weight: 600">{{
                        scope.row.id
                      }}</span>
                </template>
              </el-table-column>
              <el-table-column label="售后类型" width="140">
                <template slot-scope="scope">
                    <span style="color: gray">
                      {{
                        scope.row.service_type === 'repair'
                          ? '维修'
                          : scope.row.service_type === 'upkeep'
                            ? '保养'
                            : ''
                      }}
                    </span>
                </template>
              </el-table-column>
              <el-table-column label="服务商品" width="400">
                <template slot-scope="scope">
                  <span></span>
                  <span style="color: gray">{{
                      scope.row.product_name
                    }}</span>
                </template>
              </el-table-column>
              <el-table-column label="申请人" width="250">
                <template slot-scope="scope">
                    <span></span
                    ><span style="color: gray">{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="申请时间" width="250">
                <template slot-scope="scope">
                    <span></span
                    ><span style="color: gray">{{
                    scope.row.create_time
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                  <span></span>
                  <span style="color: gray">
                      {{
                      scope.row.progress === 'audit'
                        ? '审核'
                        : scope.row.progress === 'mailing'
                          ? '寄件'
                          : scope.row.progress === 'diagnosis'
                            ? '诊断'
                            : scope.row.progress === 'process'
                              ? '处理'
                              : scope.row.progress === 'receiving'
                                ? '收货'
                                : scope.row.progress === 'done'
                                  ? '完成'
                                  : scope.row.progress === 'mailback'
                                    ? '寄回'
                                    : scope.row.progress === 'recback'
                                      ? '收货'
                                      : scope.row.progress === 'cancel'
                                        ? '取消'
                                        : ''
                    }}
                    </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="200px" align="center">
                <template slot-scope="scope">
                    <span
                      style="
                        font-weight: 600;
                        color: #d79432;
                        margin-left: 50px;
                        cursor: pointer;
                      "
                      @click="handleCheck(scope.row)"
                    >
                      查看
                    </span>
                  <el-dropdown>
                      <span
                        class="el-dropdown-link"
                        style="
                          font-weight: 600;
                          color: #d79432;
                          margin-left: 50px;
                          font-size: 13px;
                        "
                      >
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>编辑</el-dropdown-item>
                      <el-dropdown-item>激活</el-dropdown-item>
                      <el-dropdown-item>关闭</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="sysBox">
            <el-pagination
              class="pagination"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pagerow"
              layout="total, prev, pager, next"
              :total="parseInt(total)"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import saleApi from '../../../api/org/saleApi'
import cookie from 'js-cookie'

export default {
  data () {
    return {
      items: [
        '全部',
        '订单审核',
        '用户寄件',
        '专家诊断',
        '专家处理',
        '用户收货',
        '已完成',
        '客服寄回',
        '已取消'
      ],
      activeName: '全部',
      listInfo: {
        bizid: 'uniwarm',
        token: ''
      },
      total: '',
      pagerow: 10,
      // 当前页
      currentPage: 1,
      // 数据
      tableData: [],
      // 查询条件
      searchObj: [],
      formData: {
        saletype: '',
        serviceshop: '',
        afterSaleId: '',
        lastname: '',
        lasttime: ''
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      aftersaleId: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      currentRow: null,
      width: '',
      loading: true
    }
  },
  created () {
    this.loading = true
    this.listInfo.token = cookie.get('token')
    this.saleList()
  },
  mounted () {
    // this.width = document.documentElement.clientWidth + 'px'
  },
  methods: {
    selected (item) {
      this.activeName = item
    },
    // 查看详情
    handleCheck (row) {
      console.log(row)
      sessionStorage.setItem('name', row.name)
      sessionStorage.setItem('service_type', row.service_type)
      sessionStorage.setItem('create_time', row.create_time)
      sessionStorage.setItem('product_name', row.product_name)
      sessionStorage.setItem('orderId', row.id)
      this.$router.push({
        path: '/customerService/salesOrder/detail',
        query: {
          service_id: row.id
        }
      })
    },
    // 售后单列表
    saleList () {
      saleApi.getSaleList(this.currentPage - 1).then(
        /**
         * @param res 响应数据
         * @param res.data 页面数据
         * @param res.total 总条数
         */
        (res) => {
          this.tableData = res.data
          this.total = res.total
          this.loading = false
        })
    },
    // 分页器查询指定的数据
    handleCurrentChange (currentPage) {
      console.log(currentPage)
      this.loading = true
      this.currentPage = currentPage
      this.saleList()
    },
    // 重置
    handleReset () {
      this.formData = {}
    }
  }
}
</script>

<style scoped>
/*选中样式*/
.active_a {
  width: 100%;
  color: #d79432;
  font-weight: 600;
  font-size: 14px;
}

.active_li {
  width: 100%;
  color: black;
  font-weight: 600;
  box-sizing: border-box;
  border-right: 3px solid #d79432;
  font-size: 14px;
}

/*未选中样式*/
.collection-item {
  font-size: 14px;
  /*padding: 10px 2px;*/
  /*margin-bottom: 5px;*/
}

.selectchoose {
  width: 100%;
  min-width: 100%;
  height: 90px;
  /*line-height: 90px;*/
  background-color: #f3f4f9;
  position: relative;
  display: flex;
}

.selects {
  float: left;
}

.button-check {
  float: right;
  position: absolute;
  right: 40px;
}

.selecters {
  margin-left: 40px;
  font-size: 14px;
  color: gray;
}

.main {
  width: 100%;
  /*border: 1px solid black;*/
  display: flex;
  background-color: #e9ebf4;
}

.main-left {
  width: 182px;
  height: calc(100vh - 265px);
  border-right: 1px solid #c3c8ce;
  /* overflow-x: hidden; */
  background-color: #e9ebf4;
  z-index: 20;
  /*overflow: hidden;*/
  overflow-y: auto;
}

.main-left ul li {
  /*width: 100%;*/
  height: 40px;
  line-height: 40px;
  padding: 0 59px;
  list-style: none;
  /*text-align: center;*/
  font-size: 14px;
  color: gray;
  margin-top: 30px;
}

.main-left ul li:hover {
  color: #d79432;
  /*font-weight: 600;*/
  cursor: pointer;
}

.main-right {
  width: calc(100% - 182px);
  height: calc(100vh - 265px);
  background-color: #e9ebf4;
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  /*overflow-x: scroll;*/
}

.main-right::-webkit-scrollbar {
  width: 6px;
}

.main-right::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.main-right:hover::-webkit-scrollbar-thumb {
  background: #E4E7ED;
}

.main-right:hover::-webkit-scrollbar-track {
  background: #F3F4F9;
}

.el-table th,
.el-table tr,
.el-table td {
  background-color: transparent !important;
}

.sysBox {
  width: 100%;
  position: absolute;
  right: 40px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.pagination {
  /*position: fixed;*/
  /*right: 40px;*/
  /* margin-top: 50px; */
  float: right;
  margin-bottom: 30px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 14px;
}

/*===============================*/
/*.user_skills{*/
/*  width: 50%;*/
/*  margin: auto;*/
/*}*/
.user_skills /deep/ .el-table--fit {
  padding: 0 20px;
}

.user_skills /deep/ .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}

.user_skills /deep/ .el-table .el-table__cell {
  padding: 14px 0;
}

.user_skills /deep/ .el-table tr {
  background-color: transparent !important;
}

.user_skills /deep/ .el-table th {
  background-color: transparent !important;
}

.user_skills /deep/ .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
}

/deep/ .el-dialog li {
  background: rgba(255, 255, 255, 0);
  -webkit-box-sizing: border-box;
}

/deep/ .el-pager li {
  background: rgba(255, 255, 255, 0);
  -webkit-box-sizing: border-box;
}

/deep/ .el-pagination .btn-next {
  background: center center no-repeat rgba(255, 255, 255, 0);
}

/deep/ .el-pagination .btn-prev {
  background: center center no-repeat rgba(255, 255, 255, 0);
}

.box {
  width: 100%;
  margin: 0 auto;
  height: calc(100% - 175px);
  /*overflow-x: scroll;*/
}

/*.content{*/
/*  border: 1px solid red;*/
/*}*/

/deep/ .el-pager li.active {
  color: #d79432;
}
</style>
