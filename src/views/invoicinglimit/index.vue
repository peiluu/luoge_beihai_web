<template>
  <div>
    <form-list :columns="columns" :searchKey="propsKey" :searchRow="searchList" :api="api" :param="param" :height="height"
      :firstLoading="false" v-loading="loading" @getSearchParam="getSearchParam" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left">
          </div>
          <div class="toolbar-right">
            <!-- <el-button @click="openDigitalBatch('Y')">开通数电</el-button> -->
            <el-button type="success" @click="hanldeEnter('add')">维护</el-button>
          </div>
        </div>
      </template>
      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click.stop="hanldeEnter('edit', data)" type="info">编辑</el-button>
            <el-button @click.stop="handleDelete('delete', data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>
    </form-list>
    <el-dialog :title="batchOperateTypeMap[batchOperateType]" :visible.sync="dialogVisible" width="40%"
      :before-close="handleClose">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" class="dialog-form">
        <template>
          <el-form-item label="是否为黑名单" prop="enable">
            <el-select v-model="form.enable" placeholder="请选择">
              <el-option label="是" value="Y" />
              <el-option label="否" value="N" />
            </el-select>
          </el-form-item>
        </template>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="submit">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="detailVisible"
      :visible.sync="detailVisible"
      width="80%"
      :before-close="onClose"
      class="detail-dialog"
      destroy-on-close
    >
      <Detail :detailInfo="detailInfo" @onOk="onOk" @onClose="onClose"/>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { listCascaderDict, selectYtList, deleteBatch, setIsDigital, getListAll,getList, selectQyList, downLoadApplyList, exportTaxBodyInfo } from './Api.js';
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
        { title: '序号', type: "index", width: 70, fixed: 'left', },
        { title: "主体名称", width: 160, dataIndex: "gmfMc", },
        { title: "限制税率", width: 160, dataIndex: "gmfNsrsbh", },
        { title: "限制约束", width: 160, dataIndex: "yhzh", },
        { title: "限制结果", width: 160, dataIndex: "bankaccount", },
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
          label: "纳税主体",
          key: "gmfMc",
          val: "",
          type: "input",
          placeholder: '请输入'
        },

      ],
      detailVisible: false,
      dialogVisible: false,
      districts: [],
      qyList: [],
      batchOperateType: '',
      propsKey: '',
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
      detailInfo: {
        operateType: '',
        id: null
      },
    };

  },
  mounted() {
    this.listCascaderDict();


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
      this.detailInfo = {
        operateType: '',
        id: null,
      }
    },
    onOk(){
      this.getList()
      this.onClose()
    },
    // 获取纳税主体
    async getListAll() {
      const { code = '', data = [] } = await getList({})
      const index = this.searchList.findIndex((item) => item.key === 'gmfMc');
      if (code === '0') {
        this.propsKey = data && data[0].id
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            value: item.id,
            label: `${item.gmfMc} `
          }
        }))
      }
    },
    // 获取区域
    async listCascaderDict() {
      const { code = '', data = [] } = await listCascaderDict()
      // if (code === '0') {
      //   const index = this.searchList.findIndex((item) => item.key === 'areaList');
      //   this.searchList[index].options = data
      // }
    },
    /**
    * @desption 【组织管理】获取区域选择下拉
    */
    async selectQyList() {
      const { code = '', data = [] } = await selectQyList({})
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key === 'region');
        debugger;
        if (index !== -1) {
          this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
            return {
              value: item,
              label: item
            }
          }))
        }

      }
    },
    /**
     * @desption 【组织管理】获取业态选择下拉
     */
    async selectYtList() {
      const { code = '', data = [] } = await selectYtList()
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key === 'businessFormat');
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            value: item,
            label: item
          }
        }))
      }
    },

    //  按钮操作
    // 删除
    handleDelete(type, data) {
      if (this.selections.length == 0 && type == 'batchDel') {
        this.$message.warning("未选择组织，请选择组织");
        return;
      }
      this.$confirm(`是否确定删除当前组织`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const orgIds = type === 'delete' ? [data.id] : this.selections.map((item) => item.id)
        const { code = '' } = await delOrg({ orgIds });
        if (code === '0') {
          this.$message.success('删除成功');
          console.log(this.queryParam,1111)
          this.$refs.list && this.$refs.list.reload(this.queryParam)
        }
      }).catch((res => { }))
    },

    openDigitalBatch(isDigital) {
      if (this.selections.length == 0) {
        this.$message.warning("未选择客户，请选择客户");
        return;
      }
      if (!this.selections.every((item) => item.lqid && item.secretkey)) {
        this.$message.warning("乐企ID和乐企密钥不能为空");
        return;
      }
      this.$confirm(`确定要开通数电吗`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.selections.map((item) => item.id);
        const { code = '' } = await this.api.openDigitalBatchApi({ ids, "isDigital": isDigital });
        if (code === '0') {
          this.$message.success('操作成功');
          this.getList();
        }
      }).catch((res => { }))
    },

    // 批量操作
    // batchOperate(type, data = {}) {
     
    //   console.log(this.selections,"=")
    //   this.batchOperateType = type;
    //   this.form = {
    //     ...data,
    //     taxBodyId: data && data.taxBodyId && data.taxBodyId.toString()
    //   }
    //   if (type === 'batchDel') {
    //     if (!this.data || this.data.length === 0) {
    //       console.warn('this.data is empty or not defined!');
    //       return;
    //     }
    //     deleteBatch()
        
    //   } else {
    //     if (this.selections.length == 0 && ['batchEnable'].includes(type)) {
    //       this.$message.warning("未选择组织，请选择组织");
    //       return;
    //     } else {
    //       this.dialogVisible = true
    //     }

    //   }
    // },
    batchOperate(type, data = {}) {
      this.batchOperateType = type
      if (this.selections.length == 0 && type === 'batchDel') {
        this.$message.warning("未选择企业，请选择企业");
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
      let switchType = null;
      switch (type) {
        case 'batchDel' :
          tipTxt = '是否确定删除当前企业';
          apiFn = deleteBatch;
          break;
        case 1:
          tipTxt = '是否确定将当前企业标记黑名单';
          apiFn = deleteBatch;
          switchType = 1;
          break;
        case 2:
          tipTxt = '是否确定将当前企业移除黑名单';
          apiFn = deleteBatch;
          switchType = 2;
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
        switchType !== null && (params.switchType=switchType);
        console.log('----ids----',ids, params)
        const { code = '' } = await apiFn(params);
        if (code === '0') {
          this.$message.success('操作成功');
          this.getList();
        }
      }).catch(err=>{
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
    // 切换数电开通
    // async setIsDigital() {
    //   this.$refs["ruleForm"].validate(async valid => {
    //     if (!valid) return;
    //     const { code = '' } = await setIsDigital(this.form);
    //     if (code === '0') {
    //       this.$message.success('操作成功');
    //       this.dialogVisible = false
    //       this.getList();
    //     }
    //   })
    // },
    hanldeEnter(operateType, data = {}) {
      this.detailInfo = {
        operateType,
        id: data.id
      }
      this.detailVisible = true;

      // if (operateType === 'add') {
      //   sessionStorage.setItem('clearTaxBody', 1)
      // }
      // this.$router.push({
      //   path: '/custom/Detail',
      //   query: {
      //     operateType,
      //     id: data.id
      //   }
      // })
      // this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    },
    getList() {
      console.log('--111--',111)
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
    handleSelection(val){
      console.log(val)
    }
  }
};
</script>