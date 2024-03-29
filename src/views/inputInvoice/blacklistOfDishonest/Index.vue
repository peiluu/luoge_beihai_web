<template>
  <div class="main-content">
    <form-list :columns="columns" :searchRow="searchList" :api="api" :height="height" ref="list">
      <template #gxfsf="row"> {{ row.data.gxfsf == 0 ? '销售方' : '购买方' }}</template>
      <template #ykjhzfpbz="row">{{ row.data.ykjhzfpbz === 'Y' ? '已开具' : '未开具' }}</template>
      <template #shzt="row">
        <span :class="row.data.shzt != null ? examineStatusMap[row.data.shzt].class : ''">
          {{ row.data.shzt != null ? examineStatusMap[row.data.shzt].label : '-' }}</span
        >
      </template>
      <template #hzqrxxztDm="row">
        <span :class="row.data.hzqrxxztDm != null ? confirmStatusMap[row.data.hzqrxxztDm].class : ''">
          {{ row.data.hzqrxxztDm != null ? confirmStatusMap[row.data.hzqrxxztDm].label : '-' }}</span
        >
      </template>

      <!-- 操作按钮 -->
      <template #myscope="{ data }">
        <template>
          <el-button @click.stop="addOrEdit(data)" type="success">修改</el-button>
        </template>
      </template>

      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addOrEdit({})">新增</el-button>
            <el-button @click="dels">删除</el-button>
            <el-button @click="importExc">导入</el-button>
            <el-button @click="downloadNoList">导出</el-button>
          </div>
        </div>
      </template>
    </form-list>
    <!-- 新增 -->
    <el-dialog :title="`${editForm.id ? '修改' : '新增'}失信人员黑名单`" :visible.sync="addVisible" width="1000px" :before-close="handleAddClose" class="black-dialog">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="纳税人识别号" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="纳税人名称" prop="nsrmc">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="企业类别" prop="qylb">
          <el-radio-group v-model="editForm.qylb">
            <el-radio v-for="item in qylbOpts" :key="item.value" :label="item.label" :value="item.value"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="风险类型" prop="fxlx">
          <el-select v-model="editForm.fxlx">
            <el-option v-for="item in fxlxOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="dq">
          <el-input v-model="editForm.dq" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="所属税务机关名称" prop="ssswjgmc">
          <el-input v-model="editForm.ssswjgmc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="经营地点" prop="jydd">
          <el-input v-model="editForm.jydd" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="法定责任人及相关责任人" prop="fdzrr">
          <el-input v-model="editForm.fdzrr" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="生效日期" prop="shengxrq">
          <el-date-picker value-format="yyyyMMdd" v-model="editForm.shengxrq" type="date" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="失效日期" prop="shixrq">
          <el-date-picker value-format="yyyyMMdd" v-model="editForm.shixrq" type="date" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="备注" prop="bz" class="full-item">
          <el-input v-model="editForm.bz" type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item label="案件描述" prop="ajms" class="full-item">
          <el-input v-model="editForm.ajms" type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddClose">取 消</el-button>
        <el-button type="success" @click="saveData">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { confirmStatusMap, chyyDmMap, examineStatusMap } from '@/views/outputInvoice/redInvoice/constant';
export default {
  name: 'WaitConfirm',
  components: {
    FormList,
  },

  data() {
    const fxlxOpts = [
      { value: '1', label: '涉税风险' },
      { value: '2', label: '合同纠纷' },
      { value: '3', label: '其他' },
    ];
    const qylbOpts = [
      { value: '1', label: '失信企业' },
      { value: '2', label: '黑名单企业' },
    ];
    return {
      api: require('./Api'),
      // 待处理的发票数量
      confirmStatusMap,
      examineStatusMap,
      chyyDmMap,
      fxlxOpts,
      qylbOpts,
      columns: [
        { type: 'selection', width: 50 },
        { title: '序号', type: 'index' },
        { title: '企业类别', dataIndex: 'qylb', width: 130 },
        { title: '风险类型', width: 130, dataIndex: 'fxlx' },
        { title: '企业名称', width: 200, dataIndex: 'qymc' },
        { title: '地区', width: 130, dataIndex: 'dq' },
        { title: '所属税务机关名称', width: 200, dataIndex: 'ssswjgmc' },
        { title: '纳税人识别号', width: 180, dataIndex: 'nsrsbh' },
        { title: '经营地点', width: 180, dataIndex: 'jydd' },
        { title: '案件描述', width: 180, dataIndex: 'ajms' },
        { title: '数据来源', dataIndex: 'sjly', slot: 'sjly', width: 100 },
        { title: '生效日期', dataIndex: 'shengxrq', align: 'center', width: 100 },
        { title: '失效日期', dataIndex: 'shixrq', align: 'center', width: 100 },
        { title: '法定责任人及相关责任人', width: 170, dataIndex: 'fdzrr' },
        { title: '备注', width: 170, dataIndex: 'bz', showTooltip: true },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],
      searchList: [
        { label: '企业名称', key: 'qymc', val: '', type: 'input', placeholder: '请输入' },
        { label: '纳税人识别号', key: 'nsrsbh', val: '', type: 'input', placeholder: '请输入' },
        {
          label: '企业类别',
          key: 'qylb',
          val: '',
          type: 'select',
          options: qylbOpts,
        },
        {
          label: '风险类型',
          key: 'fxlx',
          val: '',
          type: 'select',
          options: fxlxOpts,
        },
      ],
      addVisible: false,
      editForm: {},
      rules: {
        nsrsbh: [{ required: true, message: '请输入', trigger: 'change' }],
        nsrmc: [{ required: true, message: '请输入', trigger: 'change' }],
        qylb: [{ required: true, message: '请选择', trigger: 'change' }],
        fxlx: [{ required: true, message: '请选择', trigger: 'change' }],
      },
    };
  },
  mounted() {
    // this.handleOk();
  },

  // 同一页面切换会触发更新
  computed: {
    height() {
      return window.innerHeight - 340;
    },
  },

  methods: {
    // 导入
    importExc() {},
    // 新增/修改
    addOrEdit(row = {}) {
      console.log('----row----', row);
      this.editForm = row;
      this.addVisible = true;
    },
    // 批量删除
    dels() {},
    // 关闭弹窗
    handleAddClose() {
      this.addVisible = false;
      setTimeout(() => {
        this.$refs.editForm.resetFields();
      }, 100);
    },
    // 保存
    saveData() {
      this.$refs['editForm'].validate(async valid => {
        if (!valid) return;
        // const { code = '' } = await updateDrawback([{ ...this.editForm }]);
        // if (code === '0') {
        //   this.$message.success('操作成功');
        //   this.handleClose();
        //   this.getList();
        // }
      });
    },
    // handleOk() {
    //   this.$refs.list.reload();
    // },
    confirm(qrlx, data, e) {
      const selections = this.$refs.list.getSelections();
      if (!selections.length) {
        this.$message.warning('请至少选择一条数据');
        return;
      }
      if (selections.find(item => item.gxfsf == 0) && selections.find(item => item.gxfsf == 1)) {
        this.$message.warning('请勿同时操作进项票和销项票');
        return;
      }
      // 操作的时候取反
      this.gxfsf = selections[0].gxfsf == 0 ? '1' : '0';
      this.$refs.confirnModal.confirm(qrlx, data, selections);
      if (e) e.preventDefault();
    },
    async downloadNoList() {
      const fileName = `失信人员黑名单.xlsx`;
      await this.api.downLoadNoOpenList({
        reqData: { ...this.queryParam },
        fileName,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.black-dialog {
  /deep/ .el-form-item {
    width: calc(50% - 10px);
    &.full-item {
      width: 100%;
    }
    .el-form-item__label {
      width: 180px;
    }

    .el-form-item__content {
      width: calc(100% - 180px);

      .el-select,
      .el-date-editor,
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>
