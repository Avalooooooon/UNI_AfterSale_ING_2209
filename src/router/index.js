import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const routes = [
  {
    path: '/login',
    component: () => import('../components/login')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/common/home'),
    redirect: '/customerService/salesOrder',
    children: [
      // 客服
      {
        path: '/customerService',
        name: 'CustomerService',
        component: () => import('../components/common/customerServiceHome'),
        redirect: '/customerService/salesOrder',
        children: [
          // 会话
          {
            path: 'conversation',
            name: 'Conversation',
            component: () => import('../components/customerService/conversation')
          },
          // 视频
          {
            path: 'video',
            name: 'Video',
            component: () => import('../components/customerService/video')
          },
          // 电话
          {
            path: 'phone',
            name: 'Phone',
            component: () => import('../components/customerService/phone')
          },
          // 售后单
          {
            path: 'salesOrder',
            name: 'SalesOrder',
            component: () => import('../components/customerService/salesOrder')
          },
          // 售后单 -> 详情
          {
            path: 'salesOrder/detail',
            name: 'AftersaleDetail',
            component: () => import('../components/customerService/salesOrder/aftersaleDetail')
          },
          // 服务单
          {
            path: 'serviceOrder',
            name: 'ServiceOrder',
            component: () => import('../components/customerService/serviceOrder')
          }
        ]
      },
      // 反馈
      {
        path: '/feedback',
        name: 'Feedback',
        component: () => import('../components/common/feedbackHome')
      },
      // 组织
      {
        path: '/organization',
        name: 'Organization',
        component: () => import('../components/common/organizationHome')
      }
    ]
  },
  {
    path: '*',
    component: () => import('../components/common/404')
  }
]

const router = new Router({
  // linkExactActiveClass: 'active',
  routes,
  mode: 'history'
})
export default router

// export default new Router({
//   mode: 'history',
//   routes: [
//     {
//       path: '/login',
//       name: 'Login',
//       component: Login
//     },
//     // 客服
//     {
//       path: '/customerService',
//       name: 'CustomerService',
//       component: SalesOrder,
//       redirect: '/customerService/salesOrder',
//       children: [
//         // 售后单
//         {
//           path: 'salesOrder',
//           name: 'SalesOrder',
//           component: SalesOrder
//         }
//       ]
//     },
//     // 售后单详情
//     {
//       path: '/customerService/salesOrder/detail',
//       name: 'AftersaleDetail',
//       component: AftersaleDetail
//     },
//     // 会话
//     {
//       path: '/customerService/conversation',
//       name: 'Conversation',
//       component: Conversation
//     },
//     // 视频
//     {
//       path: '/customerService/video',
//       name: 'Video',
//       component: Video
//     }
//   ]
// })
