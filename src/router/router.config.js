// 模块路由(基于主入口布局页面)
export const moduleRoutes = {
  path: '/',
  component: () => import('@/views/main'),
  name: 'main',
  // redirect: { name: 'index' },
  meta: { title: '主入口布局' },
  children: [
    // { path: '/index', component: () => import('@/views/index'), name: 'index', meta: { title: '首页', isTab: true } }
  ],
};
// 本地路由配置，有公共左侧菜单导航，有公共头部，不在菜单导航中显示（菜单导航由后台配置）
export const mainChildrenRoutes = [
  {
    path: '/custom/Detail',
    name: 'customDetail',
    meta: { title: '客户信息', isTab: true },
    component: () => import('@/views/custom/Detail'),
  },
  {
    path: '/redInvoice/redInfoConfirm',
    name: 'redInfoConfirm',
    meta: { title: '预填发票申请单', isTab: true },
    component: () => import('@/views/outputInvoice/redInvoice/redInfoConfirm/Index.vue'),
  },
  {
    path: '/redInvoice/addApplyForm',
    name: 'addApplyForm',
    meta: { title: '新增红色信息表', isTab: true },
    component: () => import('@/views/outputInvoice/redInvoice/addApplyForm/Index.vue'),
  },
  {
    path: '/outputInvoice/redInvoice/infoTable/Index',
    name: 'infoTable',
    meta: { title: '红票信息申请列表', isTab: true, },
    component: () => import('@/views/outputInvoice/redInvoice/infoTable/Index.vue'),
  },
  {
    path: '/outputInvoice/blueInvoice/BlueInvoiceForm',
    name: 'blueInvoiceForm',
    meta: { title: '蓝字发票填写', isTab: true, },
    component: () => import('@/views/outputInvoice/blueInvoice/BlueInvoiceForm.vue'),
  },
  // 红字发票开具 - 新增红字发票申请单 - 提交成功
  {
    path: '/redInvoice/redApplySuccess',
    name: 'redApplySuccess',
    meta: { title: '提交成功', isTab: true },
    component: () =>
      import('@/views/outputInvoice/redInvoice/redApplySuccess/Index'),
  },
];

// 页面路由(独立页面), 无公共左侧菜单导航，无公共头部。如：登录页
export const pageRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    name: '404',
    meta: { title: '404未找到' },
    beforeEnter(to, from, next) {
      // 拦截处理特殊业务场景
      // 如果, 重定向路由包含__双下划线, 为临时添加路由
      if (/__.*/.test(to.redirectedFrom)) {
        return next(to.redirectedFrom.replace(/__.*/, ''));
      }
      next();
    },
  },
  { path: '/login', component: () => import('@/views/login/index'), name: 'login', meta: { title: '登录' } },
  {
    path: '/invoice/preview',
    name: 'preview',
    meta: { redirect: true, name: '发票预览' },
    component: () => import('@/views/invoice/Preview.vue'),
  },
];
