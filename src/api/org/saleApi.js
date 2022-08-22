import request from '../../utils/request'

export default {
  // 售后单列表
  getSaleList (page) {
    return request({
      url: '/erp/aftersale/v1/service/listall',
      method: 'get',
      params: {
        page: page
      }
    })
  },
  // 售后单详情
  getSaleDetail (rowId) {
    return request({
      url: '/erp/aftersale/v1/service/detail',
      method: 'get',
      params: {
        service_id: rowId
      }
    })
  },
  // 客服审核
  customerServiceReview (rowId, remark, operation) {
    return request({
      url: '/erp/aftersale/v1/service/audit',
      method: 'get',
      params: {
        service_id: rowId,
        remark: remark,
        opt: operation
      }
    })
  },
  // 确认收货
  receiptSure (rowId, receiptRemark) {
    return request({
      url: '/erp/aftersale/v1/service/recsure',
      method: 'get',
      params: {
        service_id: rowId,
        remark: receiptRemark
      }
    })
  },
  // 确认收款
  PaymentSure (rowId, diagnosisRemark, operationPay) {
    return request({
      url: '/erp/aftersale/v1/service/diagnosis',
      method: 'get',
      params: {
        service_id: rowId,
        remark: diagnosisRemark,
        opt: operationPay
      }
    })
  },
  // 获取视频
  getVideo (videoId) {
    return request({
      url: '/erp/videophone/v1/videophone/usersig',
      method: 'get',
      params: {
        user_id: videoId
      }
    })
  }
}
