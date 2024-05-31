
<template>
  <el-dialog 
  :visible="visible" 
  :title="$t('user.setdatapermission')" 
  @update:visible="updateVisible"
  :before-close="handleClose"
  :close-on-click-modal="false" 
  :close-on-press-escape="false" >
  <el-container style="height: 450px; border: 1px solid #eee" v-loading="loading">
      <el-header>
        请选择数据权限类型：
        <el-select v-model="selectpermissionid" filterable placeholder="请选择权限类型" @change="changePermissionType">
          <el-option
              v-for="item in permissionlist"
              :key="item.id"
              :label="item.pname"
              :value="item.id">
          </el-option>
        </el-select>
       
      </el-header>
      <el-main >
        <div  class="table-wrap">
        <el-checkbox class="check-page-all"
                     v-model="checkPageAll"
                     @change="checkPageAllEv($event)"></el-checkbox>
          <el-table ref="tableRef11"
                    :data="tableData"
                    style="width: 100%"
                    row-key="id"
                    border
                    default-expand-all
                    :tree-props="{children: 'children'}">
            <el-table-column type="selection"
                           width="55">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.pageCheck"
                           @change="pageCheckEv(scope)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
              prop="pname"
              label="权限名称"
              sortable>
          </el-table-column>

        </el-table>
        </div>
      </el-main>
    </el-container>
    <article slot="footer">
      <el-button  type="" @click="updateVisible(false)" :loading="permissionLoading">取 消</el-button>
      <el-button  type="primary" @click="setPermission()" :loading="permissionLoading" :disabled="!selectpermissionid || loading">{{ $t('datapower.setdatapermission') }}</el-button>
    </article>
  </el-dialog>

</template>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.table-wrap {
  position: relative;
}
.check-page-all {
  position: absolute;
  top: 15px;
  left: 11px;
  z-index: 100;
}
::v-deep .el-dialog{
  margin-top:5vh !important;
}
::v-deep .el-dialog__body{
  padding-top: 10px;
}
</style>

<script>
import debounce from "lodash/debounce"
export default {
  name: "data-permission-set",
  props:{
    visible:{
      type:Boolean,
      default:false
    }
  },
  data () {

    return {
      // 全选状态
      checkPageAll: false,
      // 选中数据集合
      selectionAllData: [],
      //checkedKeys: false,
      
      selectpermissionid:null,//选中的权限类型id
      selectedPermissionObj:null,//选中的权限类型详细信息
      permissionlist:[],//所有权限类型详细信息列表
      // 表格数据
      //tableData: [{"id":1,"parentId":null,"pname":"胡托权限名称1"},{"id":2,"parentId":null,"pname":"胡托权限名称2"},{"id":3,"parentId":null,"pname":"胡托权限名称3","children":[{"id":31,"parentId":3,"pname":"胡托权限名称31","children":[{"id":311,"parentId":31,"pname":"胡托权限名称311"},{"id":312,"parentId":31,"pname":"胡托权限名称312","children":[{"id":3121,"parentId":312,"pname":"胡托权限名称3121"},{"id":3122,"parentId":312,"pname":"胡托权限名称3122"}]}]},{"id":32,"parentId":3,"pname":"胡托权限名称32"}]},{"id":4,"parentId":null,"pname":"胡托权限名称4"}],
      tableData: [],
      //选中用户权限信息
      //selectUserPermissionList:[],
      dataForm: {
        userid: ''
      },
      permissionLoading: false,
      loading:false,
    }
  },
  computed: {
    dataRule () {
      return {

      }
    }
  },
  //created () {
    //this.initData()
  //},
  methods: {
    init () {
      this.visible = true
      this.getPermissionList()
      this.$nextTick(() => {
        //this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          //this.getInfo()
        }
      })
      // console.log("userid:",this.dataForm.userid);
      //this.initData();
    },
    // 数据初始化 绑定 pageCheck 属性
    initData () {
      let bindCheck = (data) => {
        data.forEach(item => {
          // item.pageCheck = false
          //this.$set(item, 'pageCheck', item.pageCheck)
          //console.log(item.pname,"选中");
          //console.log("item.pageCheck:",item.pageCheck)
          if(item.pageCheck){
            //console.log("set to data:",item.pageCheck)
            this.selectionAllData.push(item);
          }
          if (item.children && item.children.length) {
            bindCheck(item.children)
          }
        });
      }
      bindCheck(this.tableData)
    },
    updateVisible(value){
      this.$emit('update:visible', value);
    },
    //切换权限类型
    changePermissionType(e){
      this.selectionAllData=[];
      // console.log(e);
      // console.log("selected Permission Type:",this.selectpermissionid);
      //要从permissionList中找到选中的权限类型列表，再通过接口去获取权限列表
      this.selectedPermissionObj=this.filterById(this.permissionlist, e);
      // console.log("selectedPermissionObj",this.selectedPermissionObj);
      this.getAPermissionList(this.selectedPermissionObj.url);
      //this.initData();
    },
    //提交授权
    setPermission(){
      // console.log("setPermission:",this.selectionAllData);
      this.permissionLoading = true;
      this.loading = true;
      var permissionBody={"userid":this.dataForm.userid,"permissiontype":this.selectedPermissionObj.powertype,"permissionlist":this.selectionAllData}
      // console.log("permissionBody:",permissionBody);
      this.$http["post"]('/sys/userdatapermission/setUserPermission', permissionBody).then(res => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.open();
           
          }
        })
      }).catch(() => {
        
      }).finally(()=>{
        this.loading = false;
        this.permissionLoading = false;
      })
    },
    // 点击全选
    checkPageAllEv (state) {
      let checkAll = (data, checked) => {
        for (let item of data) {
          // item.pageCheck = checked
          this.$set(item, 'pageCheck', checked)
          if (item.children && item.children.length) {
            checkAll(item.children, checked)
          }
        }
      }
      checkAll(this.tableData, state)
      this.selectionAllData = []
      this.mapChecked(this.tableData)
      // console.log("selectionAllData", this.selectionAllData)
    },
    // 行点击
    pageCheckEv (scope) {
      // 如果是勾选  则 自身 以及 所有子集都需要选中  所有父集也都需要选中
      // 如果是勾销  则 自身 以及 所有子集都需要取消  所有父级则需要逐级判断其子集是否有勾选的子集
      // 此外 无论是勾选还是勾销  都需要判断对全选状态的影响

      // 处理自身以及子集选中状态
      this.handleCheckAll(scope.row, scope.row.pageCheck)
      // 处理父级
      if (scope.row.parentId) {
        let parents = this.getParent(this.tableData, scope.row.parentId)
        if (scope.row.pageCheck) {
          // 如果是勾选 所有父集都需要选中
          parents.forEach(item => {
            this.$set(item, "pageCheck", true)
          })
        } else {
          // 如果是勾销 所有父级则需要逐级判断其子集是否有勾选的子集
          // 因为 parents 是逐级递归获取的  所以循环父集合也是逐级处理
          // 只有当上级父元素处理完成 才能处理上上一级元素
          // 因为上上一级元素的处理是根据其子集情况 即包含了上级父元素的处理状态
          // 万幸的是 object 是复杂数据类型  当你改变了上级父元素的处理状态 那么上上一级元素中的其处理状态也会变化
          parents.forEach(item => {
            let isCheck = item.children.some(child => child.pageCheck)
            this.$set(item, "pageCheck", isCheck)
          })
        }
      }
      // 处理对全选状态的影响
      this.checkPageAll = this.isCheckAllEv(this.tableData)

      this.selectionAllData = []
      this.mapChecked(this.tableData)
      // console.log("selectionAllData", this.selectionAllData)
    },
    // 获取选中的数据  使用该方法前需要将 selectionAllData 原有数据清空
    mapChecked (rows) {
      let that = this
      for (let item of rows) {
        if (item.pageCheck) {
          that.selectionAllData.push(item)
          if (item.children && item.children.length) {
            that.mapChecked(item.children)
          }
        }
      }
    },
    // 处理自身以及子集选中状态
    handleCheckAll (row, checked) {
      let that = this
      that.$set(row, 'pageCheck', checked)
      if (row.children && row.children.length) {
        row.children.forEach(item => {
          that.handleCheckAll(item, checked)
        })
      }
    },
    // 判断数据是否全部选中
    isCheckAllEv (data) {
      let isCheckAll = true
      let fn = (arr) => {
        for (let item of arr) {
          if (!item.pageCheck) {
            isCheckAll = false
            break
          }
          if (item.children && item.children.length) {
            fn(item.children)
          }
        }
      }
      fn(data)
      return isCheckAll
    },
    // 逐级获取父级  父级集合
    getParent (data, parentId) {
      let parents = []
      let fn = (arr, parentId) => {
        for (let item of arr) {
          if (item.id == parentId) {
            parents.push(item)
            if (item.parentId) {
              // 注意 此处用的 data 即还是得从原来得查找范围重新开始查找
              fn(data, item.parentId)
            }
            break
          }
          if (item.children && item.children.length) {
            fn(item.children, parentId)
          }
        }
      }
      fn(data, parentId)
      return parents
    },
// 获取信息
    getPermissionList () {
      this.$http.get(`/sys/powerlist/page`).then(res => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.permissionlist = res.data.list;
        // console.log("permissionlist:",this.permissionlist)
        //if(this.dataForm.pstate==0)this.dataForm.pstate=fasle;else this.dataForm.pstate=true;
      }).catch(() => {})
    },
    // 获取选中的一组权限字典信息
    getAPermissionList (url) {
      this.loading = true;
      /*-------------先获取外部的所有权限清单-------------*/
      this.$http.get(`/sys/userdatapermission/getPermissionList?userid=`+this.dataForm.userid+'&permissiontypeid='+this.selectedPermissionObj.id).then(res => {
      //this.$http.get(`http://localhost:8080/PTCM/sys/powerlist/testpowerlist`).then(res => {
      if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.tableData = res.data;
        // console.log("Apermissionlist:",this.tableData);
        this.initData();
        //if(this.dataForm.pstate==0)this.dataForm.pstate=fasle;else this.dataForm.pstate=true;
      }).catch(() => {}).finally(()=>{
        this.loading = false;
      });
        // console.log("this.tableData:",this.tableData);
    },
    isInPermissionList (arr, value){
      var len = arr.length, //数组长度
          item;
      for (var i = 0; i < len; i++) {
        item = JSON.parse(JSON.stringify(arr[i]))
        if(item.permissionid==value){
          return true;
        }
      }
      return false;
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
    handleClose(){
    this.updateVisible(false)
  },
  open() {
        this.$confirm('是否继续授权?是将继续停留，否会关闭弹窗！', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$emit('refreshDataList')
          
        }).catch(() => {
          this.$emit('refreshDataList')
          this.updateVisible(false)       
        });
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
              
              // this.visible = false
              this.$emit('refreshDataList')
              this.updateVisible(false)
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
   
  },
  
 
}

</script>


