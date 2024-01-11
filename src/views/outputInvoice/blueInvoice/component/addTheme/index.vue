<template>
    <div class="">
        <el-dialog
            title="提示"
            :visible = "visible"
            width="30%"
            @update:visible="updateVisible"
            :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible(false)">取 消</el-button>
                <el-button type="primary" @click="handeOk">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name:'addThemePage',
    props:{
     visible:{
         type:Boolean,
         default:false
     },
 },
    components: {},
    data() {
        return {

        };
    },
    computed: {},
    watch: {},
    methods: {
        /* 更新visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      
      /*确定 */
      handeOk(){
        this.updateVisible(false)
      }
    },
    created() {},
    mounted() {},
    beforeCreate() {},
    beforeMount() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    activated() {},
    }
</script>
<style scoped>
/*@import url(); 引入公共css类*/

</style>