<template>
  <div class="">
    <el-card shadow="never">
      <article>
        <h3>项目商品分类名称</h3>
        <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="活动名称">
                <el-input v-model="form.name">
                  <template slot="append"><i
                  class="el-icon-circle-plus-outline"
                  @click="() => remove(node, data)"
                ></i></template>
                </el-input>
              </el-form-item>
            
           
         
        </el-form>
      </article>
      <article class="tree_main">
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <span class="tree_right_icon" title="添加子级">
                <i
                  class="el-icon-circle-plus-outline"
                  @click="() => remove(node, data)"
                ></i>
              </span>
              <span class="tree_right_icon" title="编辑">
                <i
                  class="el-icon-edit-outline"
                  @click="() => remove(node, data)"
                ></i>
              </span>
              <span class="tree_right_icon" title="移除当前">
                <i class="el-icon-delete" @click="() => remove(node, data)"></i>
              </span>
            </span>
          </span>
        </el-tree>
      </article>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rightListPage",
  components: {},
  data() {
    return {
      form: {},
      treeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                  children:[
                    {
                        id: 11,
                        label: "四级 1-1-1",
                        children:[
                            {
                                id: 12,
                                label: "五级 1-1-1",
                            },
                        ]
                    },
                  ]
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
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
</style>