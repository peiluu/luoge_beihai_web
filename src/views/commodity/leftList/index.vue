<template>
  <div class="">
    <el-card shadow="never">
      <article v-loading="loading">
        <h3>项目商品分类名称</h3>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="form.name">
              <template slot="append">
                <div @click="() => handleAddClassification('', '', 1)">
                  <i class="el-icon-circle-plus-outline"></i>
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </article>
      <article class="tree_main">
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          :props="{ children: 'childList' }"
          :expand-on-click-node="false"
          style = "overflow: auto;"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <span class="tree_right_icon" title="添加子级">
                <i
                  class="el-icon-circle-plus-outline"
                  @click="() => handleAddClassification(node, data, 2,)"
                ></i>
              </span>
              <span
                class="tree_right_icon"
                title="编辑"
                @click="() => handleEdit(node, data,)"
              >
                <i class="el-icon-edit-outline"></i>
              </span>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @confirm="handleConfirm(node,data)"
              >
                <span class="tree_right_icon" slot="reference" title="移除当前">
                  <i
                    class="el-icon-delete"
                    
                  ></i>
                </span>
              </el-popconfirm>
            </span>
          </span>
        </el-tree>
      </article>
    </el-card>
    <app-edite-name
      v-if="nameVisible"
      :visible.sync="nameVisible"
      :active-id="activeId"
      :is-edite = "isEdite"
      :edite-name = "editeName"
    ></app-edite-name>
  </div>
</template>

<script>
import AppEditeName from '../componetns/editeCommodityClassificationName/';
import {getcommondityTreeList,delectcommonditySingle} from '../api.js'
export default {
  name: "rightListPage",
  components: {
    AppEditeName
  },
  data() {
    return {
      form: {},
      treeData: [],
      nameVisible: false,
      activeId: 0,
      loading: false,
      isEdite: false,
      editeName: '',
    };
  },
  computed: {},
  watch: {},
  methods: {
   /**
    * @description: 添加数据
    * @return {*}
    * postcommondityAddSingle
    */   
   handleAddClassification(node,data,type){
    this.isEdite = false;
    this.activeId = type === 1 ? 0 : data.id;
    
    this.nameVisible = true;
   },
   /* 删除确认 */
   handleConfirm(node,data){
    if(data?.id){
      
      delectcommonditySingle({id:data.id || null}).then(res=>{
        console.log(res)
        if(res.code === '0'){
          this.$message.success(res.msg);
        }
      }).fianlly(()=>{

      })
    }
   },
   /* 编辑 */
   handleEdit(node,data){
  
    this.isEdite = true;
    this.activeId = data.id || null;
    this.editeName = data.name || ''
    this.nameVisible = true;
   },
   handlerInit(){
    this.handlerGetList()
   },
   /* 获取数据 */
   handlerGetList(){
    this.loading = false;
    getcommondityTreeList().then(res=>{
      console.log(res)
      if(res.code === '0'){
        console.log(res.data)
        this.treeData = res.data.childList;
        console.log(this.handlerPrsoneData(this.treeData),"data")
      }else{
        this.$message.error(res.msg);
      }
    }).catch((e)=>{
      this.$message.error(e.msg);
    }).fianlly(()=>{
      this.loading = false;
    })
   },

   
   /* 递归整理数据 */
   handlerPrsoneData(data){
    if(data && data.length > 0){
      data.forEach(item=>{
        item.label = item.name;
        item.value = item.id;
        if(item.childList && item.childList.length > 0){
          this.handlerPrsoneData(item.childList)
        }
      })
    }
    return data
   }
  },
  created() {},
  mounted() {
    this.handlerInit()
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped lang="scss">
/*@import url(); 引入公共css类*/
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree_right_icon {
  padding: 0 4px;
}
.tree_main {
  height: calc(100vh - 262px);
}
.el-icon-circle-plus-outline {
  cursor: pointer;
}
</style>