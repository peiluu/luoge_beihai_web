<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" ref="list">
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left">
            <!-- <el-input @keyup.enter.native="getList" @clear="getList" v-model="param.nsrsbh" style="width: 300px; marginRight: 12px" placeholder="请输入纳税人名称/纳税人识别号码" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search" @click="getList" />
            </el-input> -->
          </div>
          <div class="toolbar-right">
            <vxe-toolbar size="mini">
              <template #buttons>
                <vxe-button content="批量">
                  <template #dropdowns>
                    <vxe-button type="text" content="批量设置蓝字审核" @click="batchOperate('blueReview')" />
                    <vxe-button type="text" content="批量设置红字审核" @click="batchOperate('redReview')" />
                  </template>
                </vxe-button>
              </template>
            </vxe-toolbar>
          </div>
        </div>
      </template>

      <template #enable="{ data }"> {{ data.enable == 'Y' ? '启用' : '未启用' }}</template>
      <template #sflpsh="{ data }"> {{ data.sflpsh == '1' ? '是' : '否' }}</template>
      <template #sfhpsh="{ data }"> {{ data.sfhpsh == '1' ? '是' : '否' }}</template>
      <template #createtime="{ data }"> {{ dateFormat('YYYY-mm-dd', data.createtime) }} </template>

      <template #myscope="{ data }">
        <el-button @click.stop="batchOperate('reviewSet', data)">审核设置</el-button>
      </template>
    </form-list>

    <!-- dialog 提交勾选 -->
    <el-dialog :title="batchOperateTypeMap[batchOperateType]" :visible.sync="dialogVisible" width="55%" :before-close="handleClose">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" class="dialog-form">
        <!-- 蓝字发票审核 -->
        <div v-if="batchOperateType === 'blueReview' || batchOperateType === 'reviewSet'">
          <el-form-item label="蓝字发票是否需要审核" prop="sflpsh">
            <el-select v-model="form.sflpsh" placeholder="请选择">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
          <template v-if="form.sflpsh == 1">
            <el-form-item label="需审核票种" prop="lpshlx">
              <el-select v-model="form.lpshlx" placeholder="请选择" filterable>
                <el-option v-for="item in outputFplxList" :label="item.label" :value="item.value" :key="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="特定业务" prop="lpshtdys">
              <el-select multiple v-model="form.lpshtdys" placeholder="请选择" filterable>
                <el-option v-for="item in tdywList" :label="item.label" :value="item.value" :key="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="审核人员" prop="lpshrxm">
              <CustomeVxePulldown :key="1" :form="form" @submitShr="submitShr" nameKey="lpshrxm" codeKey="lpshr" />
            </el-form-item>
          </template>
        </div>

        <!-- 红字发票审核 -->
        <div v-if="batchOperateType === 'redReview' || batchOperateType === 'reviewSet'">
          <el-form-item label="红字发票是否需要审核" prop="sfhpsh">
            <el-select v-model="form.sfhpsh" placeholder="请选择">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
          <template v-if="form.sfhpsh == 1">
            <el-form-item label="需审核票种" prop="hpshlx">
              <el-select v-model="form.hpshlx" placeholder="请选择" filterable>
                <el-option v-for="item in outputFplxList" :label="item.label" :value="item.value" :key="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="特定业务" prop="hpshtdys">
              <el-select multiple v-model="form.hpshtdys" placeholder="请选择" filterable>
                <el-option v-for="item in tdywList" :label="item.label" :value="item.value" :key="item.value" />
              </el-select>
            </el-form-item>
            <!-- 红字审核人 -->
            <el-form-item label="审核人员" prop="hpshrxm">
              <CustomeVxePulldown :key="2" :form="form" @submitShr="submitShr" nameKey="hpshrxm" codeKey="hpshr" />
            </el-form-item>
          </template>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="auditSet">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { outputFplxList } from '@/config/constant'
import { dateFormat } from '@/utils/tool'

import CustomeVxePulldown from './CustomeVxePulldown.vue';
import { getListByUser, auditSet, getOrgList } from './Api.js'


export default {
  name: 'InvoicingReview',
  components: { FormList, CustomeVxePulldown },
  data() {
    return {
      form: { lpshtdys: ['00'], hpshtdys: ['00'], },
      param: {},
      api: require('./Api'),
      outputFplxList: [{ value: '00', label: '全部' }].concat(outputFplxList),
      loading: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "组织编码", width: 100, dataIndex: "code", },
        { title: "组织名称", width: 180, dataIndex: "name", },
        { title: "所属主体", width: 180, dataIndex: "nsrmc", },
        { title: "启用状态", width: 100, dataIndex: "enable", slot: 'enable', align: 'center' },
        { title: "所属账套编码", width: 100, dataIndex: "ssztCode" },
        { title: "蓝票是否需要审核", width: 120, dataIndex: "sflpsh", slot: 'sflpsh', align: 'center' },
        { title: "蓝票审核人员", width: 100, dataIndex: "lpshrxm" },
        { title: "红票是否需要审核", width: 120, dataIndex: "sfhpsh", slot: 'sfhpsh', align: 'center' },
        { title: "红票审核人员", width: 100, dataIndex: "hpshrxm" },
        { title: "开票人员", width: 100, dataIndex: "kpr" },

        { title: "建立时间", width: 100, dataIndex: "createtime", slot: 'createtime', align: 'center' },
        {
          title: "操作",
          key: "action",
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: "action" }
        }
      ],
      searchList: [
        {
          label: "开票组织",
          key: "orgid",
          val: "",
          type: "select",
          placeholder: '请选择',
          options: [],
        },
        {
          label: "所属账套编码",
          key: "ssztCode",
          val: '',
          type: "input",
          placeholder: '请输入'
        },
        // {
        //   label: "所属纳税主体名称",
        //   key: "nsrmc",
        //   val: '',
        //   type: "input",
        //   multiple: true,
        //   placeholder: '请输入',
        //   options: '',
        // },
        {
          label: "所属纳税主体",
          key: "taxBodyId",
          val: '',
          type: "mul-select",
          multiple: true,
          placeholder: '请选择',
          options: [],
        },
      ],
      rules: {
        sflpsh: [{ required: true, message: "请选择", trigger: "blur" }],
        lpshlx: [{ required: true, message: "请选择", trigger: "blur" }],
        lpshtdys: [{ required: true, message: "请选择", trigger: "blur" }],
        lpshrxm: [{ required: true, message: "请选择", trigger: "blur" }],
        sfhpsh: [{ required: true, message: "请选择", trigger: "blur" }],
        hpshlx: [{ required: true, message: "请选择", trigger: "blur" }],
        hpshtdys: [{ required: true, message: "请选择", trigger: "blur" }],
        hpshrxm: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      dialogVisible: false,
      batchOperateType: '',
      batchOperateTypeMap: {
        'blueReview': '批量蓝字发票审核设置',
        'redReview': '批量红字发票审核设置',
        'reviewSet': '审核设置',
      },
      taxBodyList: [],
      orgList: [],
      tdywList: [
        { value: '00', label: '通用' },
        { value: '03', label: '建筑服务' },
        { value: '05', label: '不动产销售' },
        { value: '06', label: '不动产经营租赁' },
      ],
    };
  },
  activated() {
    this.getListByUser();
    this.getOrgList();
  },
  computed: {
    height() {
      return window.innerHeight - 355;
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
    selections() {
      return this.$refs.list.getSelections()
    }
  },

  methods: {
    dateFormat,
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      const index = this.searchList.findIndex((item) => item.key === 'taxBodyId');
      if (code === '0') {
        this.searchList[index].options = [{ value: 'all', label: '全选', slots: { default: 'checkAll' } }].concat(data.map((item) => {
          return {

            ...item,
            value: item.id,
            label: item.nsrmc,
            slots: { default: 'checkbox' }
          }
        }))
      }
    },
    //  获取开票组织
    async getOrgList() {
      const { code = '', data = [] } = await getOrgList({})
      const index = this.searchList.findIndex((item) => item.key === 'orgid');
      if (code === '0') {
        this.searchList[index].options = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        }))
      }
    },

    batchOperate(type, data) {
      if (this.selections.length == 0 && type != 'reviewSet') {
        this.$message.warning("请至少选择一条数据");
        return;
      }
      this.batchOperateType = type
      this.dialogVisible = true;
      // 赋初始值
      if (type === 'reviewSet') {
        this.form = {
          ...data,
          lpshtdys: data?.lpshtdys?.split(',') || [],
          hpshtdys: data?.hpshtdys?.split(',') || [],
        }
      }
    },
    // 审核设置
    async auditSet() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const ids = this.batchOperateType === 'reviewSet' ? [this.form.id] : this.selections.map((item) => item.id)
        const { code = '', data = [] } = await auditSet({
          ids,
          ...this.form,
          lpshtdys: this.form.lpshtdys.join(','),
          hpshtdys: this.form.hpshtdys.join(',')
        });
        if (code === '0') {
          this.$message.success("设置成功");
          this.dialogVisible = false;
          this.getList();
        }
      })
    },
    getList() {
      this.$refs.list.reload()
    },
    handleClose() {
      this.dialogVisible = false;
      this.form = { lpshtdys: ['00'], hpshtdys: ['00'] }
    },
    submitShr(data) {
      this.form = {
        ...this.form,
        ...data,
        lpshr:data.username,
         hpshr:data.username,
      }
      console.log(this.form)
    }
  }
};
</script>

<style lang="scss">
.main-content {
  .el-button--default:hover {
    //color: #606266;
    // border-color: #DCDFE6;
    //  background: #DCDFE6;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /deep/ .vxe-toolbar {
    display: flex;

    .vxe-buttons--wrapper {
      justify-content: flex-end;
      margin-left: 10px;
    }

    button {
      // border-color: #DCDFE6;
    }

    .vxe-button--dropdown.is--active,
    .vxe-button--dropdown:hover {
      button {
        //color: $primaryGreenColor;
        // border-color: $primaryGreenColor;
      }
    }
  }

  .el-dialog__body {
    .el-form-item {
      width: calc(50% - 10px);

      &:first-of-type {
        margin-bottom: 16px;
      }

      .el-form-item__label {
        width: 170px;
      }

      .el-form-item__content {
        width: calc(100% - 180px);
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
}
</style>
