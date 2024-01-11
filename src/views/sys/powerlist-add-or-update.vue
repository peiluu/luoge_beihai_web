<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="权限中文名" prop="pname">
        <el-input v-model="dataForm.pname" placeholder="权限中文名"></el-input>
      </el-form-item>
      <el-form-item label="调用标志" prop="powertype">
          <el-input v-model="dataForm.powertype" placeholder="权限调用标志"></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="plisturl">
          <el-input v-model="dataForm.plisturl" placeholder="权限字典数据获取路径"></el-input>
      </el-form-item>
      <el-form-item label="展现方式" prop="viewtype">
        <el-select v-model="dataForm.viewtype" placeholder="展现方式">
          <el-option
              v-for="item in vt"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="pstate">
        <el-switch
            v-model="dataForm.pstate"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
        </el-switch>

      </el-form-item>



      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      vt:[{
        value: 1,
        label: '列表'
      }, {
        value: 2,
        label: '树'
      }],
      dataForm: {
        id: '',
        powertype: '',
        plisturl: '',
        pstate: '',
        viewtype: '',
        pname: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        powertype: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        plisturl: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        pstate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        viewtype: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        pname: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/sys/powerlist/${this.dataForm.id}`).then(res => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        //if(this.dataForm.pstate==0)this.dataForm.pstate=fasle;else this.dataForm.pstate=true;
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
       // if(this.dataForm.pstate)this.dataForm.pstate=1;else this.dataForm.pstate=0;
        this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/powerlist/', this.dataForm).then(res => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
