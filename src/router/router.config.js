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
    path: '/inputInvoice/enterpriseList/Index',
    name: 'inputInvoiceEnterpriseList',
    meta: { title: '选择企业', tab: true  },
    component: () => import('@/views/inputInvoice/enterpriseList/Index'),
  },
  {
    path: '/inputInvoice/choseDate',
    name: 'inputInvoiceChoseDate',
    meta: { title: '属期选择', tab: true  },
    component: () => import('@/views/inputInvoice/choseDate/Index'),
  },
  {
    path: '/inputInvoice/waitConfirm',
    name: 'inputWaitConfirm',
    meta: { title: '待确认进项红字发票', tab: true  },
    component: () => import('@/views/inputInvoice/waitConfirm/Index'),
  },
  {
    path: '/inputInvoice/invoiceDeductionCheck',
    name: 'invoiceDeductionCheck',
    meta: { name: '发票勾选抵扣', tab: true  },
    component: () =>
      import('@/views/inputInvoice/invoiceDeductionCheck/Index'),
  },
  {
    path: '/inputInvoice/invoiceNotDeductionCheck',
    name: 'invoiceNotDeductionCheck',
    meta: { title: '发票勾选不抵扣', tab: true  },
    component: () =>
      import('@/views/inputInvoice/invoiceNotDeductionCheck/Index'),
  },

  // 发票下载 - 列表
  {
    path: '/invoiceDownload/list',
    name: 'downLoadList',
    meta: { title: '发票下载列表', tab: true  },
    component: () =>
      import('@/views/inputInvoice/invoiceDownload/list/Index'),
  },
  // 发票下载 - 下载
  {
    path: '/invoiceDownload/download',
    name: 'invoiceDownloadDownload',
    meta: { name: '下载发票', tab: true  },
    component: () =>
      import('@/views/inputInvoice/invoiceDownload/download/Index'),
  },
  // 发票下载 - 历史明细
  {
    path: '/invoiceDownload/historyDetail',
    name: 'historyDetail',
    meta: { title: '历史下载明细', tab: true  },
    component: () =>
      import('@/views/inputInvoice/invoiceDownload/list/Index'),
  },

  //  勾选抵扣统计 - 勾选抵扣统计列表
  {
    path: '/deductionStatistics/list',
    name: 'deductionStatisticsList',
    meta: { title: '勾选抵扣统计', tab: true  },
    component: () =>
      import('@/views/inputInvoice/deductionStatistics/list/Index'),
  },
  // 勾选抵扣统计 - 勾选抵扣统计确认 / 申请统计
  {
    path: '/deductionStatistics/applyStatistics',
    // name: 'applyStatistics',
    meta: { name: '抵扣统计表', tab: true  },
    component: () =>
      import(
        '@/views/inputInvoice/deductionStatistics/applyStatistics/Index'
      ),
  },
  //  勾选抵扣统计 - 历史抵扣统计与明细
  {
    path: '/deductionStatistics/historyStatistics',
    name: 'historyStatistics',
    meta: { title: '历史抵扣统计与明细', tab: true  },
    component: () =>
      import(
        '@/views/inputInvoice/deductionStatistics/historyStatistics/Index'
      ),
  },
  //  勾选抵扣统计 - 历史抵扣统计表
  {
    path: '/deductionStatistics/statisticsTable',
    name: 'statisticsTable',
    meta: { title: '抵扣统计表', tab: true  },
    component: () =>
      import(
        '@/views/inputInvoice/deductionStatistics/applyStatistics/Index'
      ),
  },
  //  勾选抵扣统计 - 历史抵扣统计明细
  {
    path: '/deductionStatistics/statisticsDetails',
    name: 'statisticsDetails',
    meta: { title: '抵扣统计明细', tab: true  },
    component: () =>
      import(
        '@/views/inputInvoice/deductionStatistics/statisticsDetails/Index'
      ),
  },

  // 进项 - 发票查验
  {
    path: '/inputInvoice/approveInvoice',
    name: 'approveInvoice',
    meta: { title: '发票查验', tab: true  },
    component: () => import('@/views/inputInvoice/approveInvoice/Index'),
  },
  {
    path: '/foundationaldata/taxableIncomeDetailsSummary/details',
    name: 'TaxableIncomeDetailsSummary',
    meta: { title: '应税收入数据池', tab: true  },
    component: () =>
      import(
        '@/views/foundationalData/taxableIncomeDetailsSummary/details/Index'
      ),
  },
  {
    path: '/foundationaldata/deemedSalesRevenueDetails',
    name: 'DeemedSalesRevenueDetails',
    meta: { title: '视同销售收入明细', tab: true  },
    component: () =>
      import('@/views/foundationalData/deemedSalesRevenueDetails/Index'),
  },
  {
    path: '/foundationaldata/retiredSoldierCollectionDetails',
    name: 'RetiredSoldierCollectionDetails',
    meta: { name: '退役士兵采集明细', tab: true  },
    component: () =>
      import(
        '@/views/foundationalData/retiredSoldierCollectionDetails/Index'
      ),
  },
  {
    path: '/retiredSoldierCollectionDetails/retiredSoldierImport',
    name: 'RetiredSoldierImport',
    meta: { title: '退役士兵导入', tab: true  },
    component: () =>
      import(
        '@/views/foundationalData/retiredSoldierCollectionDetails/RetiredSoldierImport'
      ),
  },
  {
    path: '/foundationaldata/previousOffsetDetail',
    name: 'RetiredSoldierpPreviousOffsetDetail',
    meta: { title: '退役士兵抵减明细', tab: true  },
    component: () =>
      import(
        '@/views/foundationalData/retiredSoldierCollectionDetails/previousOffsetDetail/Index'
      ),
  },
  {
    path: '/foundationaldata/keyPersonnelCollectionDetails',
    name: 'KeyPersonnelCollectionDetails',
    meta: { title: '重点人员采集', tab: true  },
    component: () =>
      import(
        '@/views/foundationalData/keyPersonnelCollectionDetails/Index'
      ),
  },
  {
    path: '/keyPersonnelCollectionDetails/keyPersonnelImport',
    name: 'KeyPersonnelImport',
    meta: { title: '重点人员采集导入', tab: true  },
    component: () =>
      import(
        '@/views/foundationalData/keyPersonnelCollectionDetails/KeyPersonnelImport'
      ),
  },
  {
    path: '/foundationaldata/keyPersonnelPreviousOffsetDetail',
    name: 'KeyPersonnelPreviousOffsetDetail',
    meta: { name: '重点人员抵减明细', tab: true  },
    component: () =>
      import(
        '@/views/foundationalData/keyPersonnelCollectionDetails/previousOffsetDetail/Index'
      ),
  },
  {
    path: '/outputInvoice/blueInvoice/BlueInvoiceForm',
    name: 'blueInvoiceForm',
    meta: { title: '蓝字发票填写', isTab: true, },
    component: () => import('@/views/outputInvoice/blueInvoice/BlueInvoiceForm.vue'),
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
  {
    path: '/expTemplateDetail',
    name: 'expTemplateDetail',
    meta: { redirect: true, name: '模板编辑' },
    component: () =>
      import('@/views/reportTools/templateMng/ExpTemplateDetail.vue'),
  },
  {
    path: '/declareSource',
    name: 'declareSource',
    meta: { redirect: true, name: '申报表配置' },
    component: () => import('@/views/reportTools/DeclareSource.vue'),
  },
];
