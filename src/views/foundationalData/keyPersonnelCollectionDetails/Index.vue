<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list
      :columns="columns"
      :searchKey="propsKey"
      :searchRow="searchList"
      :api="api"
      :param="param"
      :height="height"
      @handleSelection="handleSelection"
      v-loading="loading"
      :tableCounterShow="true"
      ref="list"
      @getNextList="getNextList"
      @getSearchParam="getSearchParam"
      :firstLoading="false"
    >
      <!-- 操作按钮 -->
      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click="addLine(data)" type="primary">编辑</el-button>
            <el-button @click.stop="handleDelete(data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>

      <template #quota="{ data }">{{ formatMoney(data.quota) }}</template>
      <template #yhzclx="{ data }">{{ yhzclxMap[data.yhzclx] }}</template>
      <template #smonth="{ data }"> {{ dateFormat('YYYY-MM', data.smonth) }} </template>
      <template #emonth="{ data }"> {{ dateFormat('YYYY-MM', data.emonth) }} </template>
      <!-- 中间按钮部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addLine({})" type="primary">新增</el-button>
            <!-- <el-button @click="previousOffsetDetail">抵减明细</el-button> -->
            <el-button type="primary" @click="previousOffsetDetail">抵减明细</el-button>
            <el-button @click="handleImport">导入</el-button>
            <!-- <el-button @click="handleExport">导入模板下载</el-button> -->
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>
    </form-list>
    <el-dialog :title="`${editForm.id ? '编辑' : '新增'}`" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="editForm.nsrsbh" filterable placeholder="请选择" @change="e => getUpdteOrgList(e)">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会计主体名称" prop="orgid">
          <el-select v-model="editForm.orgid" :disabled="!editForm.nsrsbh" filterable placeholder="请选择">
            <el-option v-for="item in orgIdList" :key="item.id" :label="item.name" :value="parseFloat(item.id)"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="姓名" prop="idName">
          <el-input v-model="editForm.idName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="所属类型" prop="yhzclx">
          <el-select v-model="editForm.yhzclx" filterable placeholder="请选择">
            <el-option label="纳入全国防止返贫监测和衔接推进乡村振兴信息系统的脱贫人口" value="01013612" />
            <el-option label="在人力资源社会保障部门公共就业服务机构登记失业半年以上的人员" value="01013613" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="身份类型" prop="idtype">
          <el-select v-model="editForm.soldierId" filterable placeholder="请选择">
            <el-option label="身份证" value="01013612" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="身份证号码" prop="idCard">
          <el-input v-model="editForm.idCard" placeholder="请输入" />
        </el-form-item>

        <el-form-item v-if="editForm.yhzclx == '01013613'" label="证件编码" prop="zjbm">
          <el-input v-model="editForm.zjbm" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="享受优惠起始月份" prop="smonth">
          <el-date-picker v-model="editForm.smonth" type="month" placeholder="请选择" value-format="yyyyMM" />
          <!-- <el-date-picker v-model="editForm.smonth" type="month" placeholder="请选择" value-format="yyyyMM" :picker-options="pickerOptions" /> -->
        </el-form-item>
        <!--
        <el-form-item label="已抵减月份" prop="enjoyTime">
          <el-input v-model="editForm.enjoyTime" placeholder="请输入" disabled />
        </el-form-item> -->
        <el-form-item label="定额标准（元/每年）" prop="quota">
          <el-input v-model="editForm.quota" :min="0" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="享受优惠终止月份" prop="emonth">
          <!-- <el-date-picker v-model="editForm.emonth" type="month" value-format="yyyyMM" placeholder="请选择" :picker-options="pickerOptions" /> -->
          <el-date-picker v-model="editForm.emonth" type="month" value-format="yyyyMM" placeholder="请选择" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="saveData">保 存</el-button>
      </span>
    </el-dialog>

    <custom-import
      dialogTitle="导入重点人群信息"
      :dialogVisible="dialogimportVisible"
      @handleClose="handleImportClose"
      @handleOk="handleImportOk"
      downloadTemplateApi=""
      downloadTemplateName="重点人群_导入模板"
      upApi="/taxBody/importTaxBodyExcelInfo"
      importApi="/taxBody/importTaxBodyInfo"
      upTitle="上传重点人群信息"
      :importColumns="importColumns"
    ></custom-import>
  </div>
</template>

<script>
import moment from 'moment';
import FormList from '@/components/FormList.vue';
import { regCollection } from '@/config/constant';
import { previousOffsetDetail, getListByUser, delOrg, updateOrg, saveOrg, downLoadList, getOrgList } from './Api.js';
import CustomImport from '@/components/CustomImport'
export default {
  name: 'KeyPersonnelCollectionDetails',
  components: {
    FormList,
    CustomImport
  },
  props: {},
  data() {
    return {
      dialogimportVisible: false,
      form: {},
      api: require('./Api'),
      param: {},
      loading: false,
      columns: [
        { type: 'selection', width: 50 },
        { title: '序号', type: 'index', width: 50 },
        { title: '纳税主体名称', width: 210, dataIndex: 'nsrmc' },
        { title: '纳税主体识别号', width: 180, dataIndex: 'nsrsbh' },
        { title: '会计主体名称', width: 210, dataIndex: 'orgname' },
        { title: '姓名', width: 100, dataIndex: 'idName' },

        { title: '身份证号', width: 180, dataIndex: 'idCard' },
        { title: '证件编码', width: 180, dataIndex: 'zjbm' },
        { title: '享受优惠起始月份', width: 120, dataIndex: 'smonth', slot: 'smonth', align: 'center' },
        { title: '已抵减月份', width: 100, dataIndex: 'enjoyTime', align: 'right' },
        { title: '定额标准', width: 100, dataIndex: 'quota', slot: 'quota', align: 'right' },
        { title: '享受优惠终止月份', width: 120, dataIndex: 'emonth', slot: 'emonth', align: 'center' },
        { title: '所属类型 ', width: 100, dataIndex: 'yhzclx', slot: 'yhzclx' },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],
      importColumns: [
        { title: "纳税主体名称", width: 210, dataIndex: "nsrmc"},
        { title: "纳税主体识别号", width: 180, dataIndex: "nsrsbh"},
      ],
      searchList: [
        {
          label: '纳税主体名称',
          key: 'nsrsbh',
          val: '',
          type: 'select',
          placeholder: '请选择',
          options: [],
          isQueryNext: true,
          nextPropskey: 'orgid',
        },
        {
          label: '会计主体名称',
          key: 'orgid',
          val: '',
          type: 'select',
          placeholder: '请选择',
        },
        {
          label: '姓名',
          key: 'idName',
          val: '',
          type: 'input',
          placeholder: '请输入',
        },
      ],
      selectIds: [],
      errorDialog: false,
      errorMsg: '',
      backDialog: false,
      backMsg: '',
      queryParam: {},
      propsKey: '',
      dialogVisible: false,
      editForm: {},
      rules: {
        nsrsbh: [{ required: true, message: '请选择', trigger: 'blur' }],
        orgid: [{ required: true, message: '请选择', trigger: 'blur' }],
        idName: [{ required: true, message: '请输入', trigger: 'blur' }],
        soldierId: [{ required: true, message: '请输入', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入', trigger: 'blur' }, { ...regCollection.idCard }],
        smonth: [{ required: true, message: '请选择', trigger: 'blur' }],
        yhzclx: [{ required: true, message: '请选择', trigger: 'blur' }],
        zjbm: [{ required: true, message: '请输入', trigger: 'blur' }],
        quota: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: this.verifyQuota, trigger: 'blur' },
        ],
      },
      taxBodyList: {},
      orgIdList: {},
      yhzclxMap: {
        '01013612': '纳入全国防止返贫监测和衔接推进乡村振兴信息系统的脱贫人口',
        '01013613': '在人力资源社会保障部门公共就业服务机构登记失业半年以上的人员',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
    };
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam();
    }
  },
  mounted() {
    this.getListByUser();
  },
  watch: {},
  computed: {
    height() {
      return window.innerHeight - 310;
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
  },

  methods: {
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({});
      if (code === '0') {
        this.taxBodyList = data;
        this.searchList[0].options = [{ value: '', label: '全部' }].concat(
          data.map(item => {
            return {
              ...item,
              value: item.nsrsbh,
              label: `${item.nsrmc} ${item.nsrsbh}`,
            };
          }),
        );
        if (!this.$route.query.nsrsbh) {
          // 直接访问
          this.getOrgList('');
          this.getList();
        }
      }
    },
    // 获取组织
    async getOrgList(nsrsbh) {
      const { code = '', data = [] } = await getOrgList({
        nsrsbh,
        isInvoice: 'N',
      });
      if (code === '0') {
        // 查询
        this.searchList[1].options = [{ value: '', label: '全部' }].concat(
          data.map(item => {
            return {
              ...item,
              value: item.id,
              label: item.name + ' ' + item.code,
            };
          }),
        );
        this.searchList[1].val = '';
        this.param.orgid = '';
        const { ssq, tbzq } = this.$route.query;
        this.propsKey = `${nsrsbh}_${ssq}_${tbzq}`;
      }
    },

    async getUpdteOrgList(nsrsbh, type) {
      const { code = '', data = [] } = await getOrgList({ nsrsbh, isInvoice: 'N' });
      if (code === '0') {
        this.orgIdList = data;
        if (type !== 'init') {
          this.editForm = { ...this.editForm, orgid: '' };
        }
      }
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh } = this.$route.query;
      this.$set(this.param, 'nsrsbh', nsrsbh);
      this.searchList[0].val = nsrsbh;
      this.$refs.list.handleGetData(this.param);
      this.getOrgList(nsrsbh);
    },

    getList() {
      this.$refs.list && this.$refs.list.reload();
    },

    //抵减明细
    async previousOffsetDetail() {
      this.$router.push({
        path: '/foundationaldata/keyPersonnelPreviousOffsetDetail',
        query: this.$route.query,
      });
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    handleDelete(data) {
      this.$refs.list.deleteData(data);
    },

    //导出
    async handleExport() {
      const fileName = `招用重点人群明细.xlsx`;
      await downLoadList({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName,
      });
    },
    // 处理多选
    handleSelection(rows) {
      this.selectIds = [];
      rows.forEach(item => {
        this.selectIds.push(item.id);
      });
    },
    getSearchParam(param) {
      this.queryParam = param;
    },
    handleClose(row, data) {
      this.dialogVisible = false;
      this.editForm = {};
    },
    addLine(row) {
      this.editForm = row.enjoyTime ? row : { ...row, enjoyTime: 0 };
      this.dialogVisible = true;
      if (row.id) {
        this.getUpdteOrgList(row.nsrsbh, 'init');
      }
    },
    getNextList(val) {
      this.getOrgList(val);
    },

    saveData() {
      this.$refs['editForm'].validate(async valid => {
        if (!valid) return;
        const { smonth, emonth } = this.editForm;
        // 招用退役士兵和重点人群的36个月应该算头不算尾
        if (moment(emonth).diff(moment(smonth), 'month') > 35) {
          this.$message.warning('享受优惠起始月份和终止月份相差不能超过36个月');
          return;
        }

        const api = this.editForm.id ? updateOrg : saveOrg;
        const { code = '' } = await api(this.editForm);
        if (code === '0') {
          this.$message.success('操作成功');
          this.handleClose();
          this.getList();
        }
      });
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt);
    },
    verifyQuota(rule, value, callback) {
      let pattern = /^([-+])?\d+(\.[0-9]{1,2})?$/;
      if (value < 6000 || value > 7800 || !pattern.test(value)) {
        callback('请输入6000-7800范围内最多保留2位小数的数字');
      } else {
        callback();
      }
    },
     // 导入
    handleImport() {
      this.dialogimportVisible = true
    },
    handleImportClose(){
      this.dialogimportVisible = false
    },
    handleImportOk(){
      this.handleImportClose()
      this.getList()
    },
    judgeDateRange(time1Str, time2Str, m) {
      const time1 = new Date(time1Str);
      const time2 = new Date(time2Str);
      const year1 = time1.getFullYear();
      const year2 = time2.getFullYear();
      const month1 = time1.getMonth() + 1;
      const month2 = time2.getMonth() + 1;
      const day1 = time1.getDate();
      const day2 = time2.getDate();
      if (year2 === year1) {
        // 判断两个日期 是否是同年
        if (month2 - month1 > m) {
          // 相差是否 在m个月中
          return false;
        } else if (month2 - month1 === m) {
          // 如果正好为 m月 判断天数
          if (day2 > day1) {
            return false;
          }
        }
      } else {
        // 不同年
        if (year2 - year1 > 1) {
          return false;
        } else if (year2 - year1 === 1) {
          if (month2 > m || month1 + m - month2 < 12) {
            return false;
          } else if (month1 + m - month2 === 12) {
            // 正好为m月 判断天数
            if (day2 > day1) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__body {
  .el-form-item {
    width: calc(50% - 10px);
    margin-bottom: 16px;

    .el-form-item__label {
      width: 280px;
    }

    .el-form-item__content {
      width: calc(100% - 280px);

      .el-select,
      .el-date-editor,
      .vxe-select,
      .vxe-input,
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>
