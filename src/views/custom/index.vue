<template>
  <div class="main-content">
    <form-list :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height" :firstLoading="false"
      v-loading="loading" @getSearchParam="getSearchParam" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left">
          </div>
          <div class="toolbar-right">
            <el-button type="success" @click="hanldeEnter()">新增</el-button>
            <el-button @click="batchOperate('batchDel',data)">删除</el-button>
            <el-button @click="batchOperate(1)">标记黑名单</el-button>
            <el-button @click="batchOperate(0)">移除黑名单</el-button>
          </div>
        </div>
      </template>
      <template #hmd="{ data }">
        <span>
          {{ data.hmd == 0 ? '否' : '是' }}
        </span>
      </template>
      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click.stop="hanldeEnter(data)" type="info">编辑</el-button>
            <el-button @click.stop="handleDelete('delete', data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>
    </form-list>

    <!-- dialog  启停 -->
    <el-dialog :title="batchOperateTypeMap[batchOperateType]" :visible.sync="dialogVisible" width="40%"
      :before-close="handleClose">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" class="dialog-form">
        <template>
          <el-form-item label="是否为黑名单" prop="enable">
            <el-select v-model="form.enable" placeholder="请选择">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </template>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog v-if="detailVisible" :visible.sync="detailVisible" width="80%" :before-close="onClose"
      class="detail-dialog" destroy-on-close>
      <Detail :detailInfo="detailInfo" @onOk="onOk" @onClose="onClose" />
    </el-dialog>
  </div>
</template>


<script>
import FormList from '@/components/FormList.vue';
import { deleteBatch, getList, hmdCustomer } from './Api.js';
import Detail from './Detail.vue'
export default {
  name: 'organizationTaxBody',
  components: {
    FormList,
    Detail
  },
  data() {
    return {
      form: {},
      param: {},
      api: require('./Api'),
      loading: false,
      propKey: '',
      columns: [
        { type: "selection", width: 50, fixed: 'left', },
        { title: '序号', type: "index", width: 50, fixed: 'left', },
        { title: "客户名称", width: 160, dataIndex: "gmfMc", showTooltip: true },
        { title: "纳税人识别号", width: 160, dataIndex: "gmfNsrsbh", },
        { title: "开户行", width: 160, dataIndex: "yhzh", },
        { title: "账号", width: 160, dataIndex: "bankaccount", },
        { title: "地址", width: 160, dataIndex: "dzdh", },
        { title: "电话", width: 160, dataIndex: "phone" },
        { title: "联系人", width: 100, dataIndex: "username", align: 'center' },
        { title: "联系人手机", width: 140, dataIndex: "revphone" },
        { title: "黑名单", width: 100, dataIndex: "hmd", slot: "hmd" },
        {
          title: "操作",
          key: "action",
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: "action" }
        }
      ],
      searchList: [
        {
          label: "客户名称",
          key: "gmfMc",
          val: "",
          type: "input",
          placeholder: '请输入'
        },
        {
          label: "黑名单",
          key: "hmd",
          val: '',
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "1", label: "是" },
            { value: "0", label: "否" }]
        },

      ],
      detailVisible: false,
      dialogVisible: false,
      batchOperateType: '',
      taxBodyList: [],
      queryParam: {},
      rules: {
        isDigital: [{ required: true, message: "请选择", trigger: "blur" }],
        lqid: [{ required: true, message: "请输入", trigger: "blur" }],
        secretkey: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      batchOperateTypeMap: {
        'enable': '启停设置',
        'batchEnable': '启停设置',
      },
      editData: {
        operateType: '',
        id: null,
      },
      exportLoading: false,
      detailInfo: {},
    };

  },
  mounted() {
    this.getList()

  },
  computed: {
    height() {
      return window.innerHeight - 310
    },
    selections() {
      return this.$refs.list.getSelections()
    }
  },

  methods: {
    onClose() {
      this.detailVisible = false;
      this.detailInfo = {}
    },
    onOk() {
      this.getList()
      this.onClose()
    },

    //  按钮操作
    // 删除
    handleDelete(type, data) {
      this.$confirm(`是否确定删除当前组织`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            const orgIds = [data.id]
            const { code = '' } = await deleteBatch({ ids: orgIds });
            if (code === '0') {
              this.$message.success('删除成功');
              console.log(this.queryParam, 1111)
              this.$refs.list && this.$refs.list.reload(this.queryParam)
              instance.confirmButtonLoading = false;
              done();
            }
          } else { done(); }
        }
      }).then(async () => {

      }).catch((res => { }))
    },

    // 批量操作
    batchOperate(type, data = {}) {
      this.batchOperateType = type
      if (this.selections.length == 0 && type === 'batchDel') {
        this.$message.warning("未选择客户，请选择客户");
        return;
      }
      this.form = data
      if (type === 'digital') {
        this.dialogVisible = true
        return;
      }
      this.deleteBatch(type);
    },
    // 删除企业
    deleteBatch(type) {
      let tipTxt = '';
      let apiFn = '';
      let hmd = null;
      switch (type) {
        case 'batchDel':
          tipTxt = '是否确定删除当前客户';
          apiFn = deleteBatch;
          break;
        case 1:
          tipTxt = '是否确定将当前客户标记黑名单';
          apiFn = hmdCustomer;
          hmd = 1;
          break;
        case 0:
          tipTxt = '是否确定将当前客户移除黑名单';
          apiFn = hmdCustomer;
          hmd = 0;
          break;
      }
      this.$confirm(tipTxt, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        const ids = this.batchOperateType === 'delete' ? [this.form.id] : this.selections.map((item) => item.id)

        let params = {
          ids
        }
        hmd !== null && (params.hmd = hmd);
        console.log('----ids----', ids, params)
        const { code = '' } = await apiFn(params);
        if (code === '0') {
          this.$message.success('操作成功');
          this.getList();
        }
      }).catch(err => {
        this.$message.error(err.msg || '操作失败')
      })

    },
    //
    async submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const param = {
          orgIds: this.batchOperateType === 'moveOrg' ? [this.form.id] : this.selections.map((item) => item.id),
          ...this.form,
        }
        if (this.batchOperateType === 'batchEnable') {
          this.setEnable(param)
        } else {
          this.moveOrg(param);
        }
      })
    },
    hanldeEnter(data = {}) {
      this.detailInfo = data;
      this.detailVisible = true;

    },
    getList() {
      console.log('--111--', 111)
      this.$refs.list && this.$refs.list.reload()
    },
    getSearchParam(param) {
      this.queryParam = param;
    },

    handleClose() {
      this.dialogVisible = false;
      this.form = {}
    },
    // 表格选择返回
    handleSelection(val) {
      console.log(val)
    }
  }
};
</script>