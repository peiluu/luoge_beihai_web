<template>
  <div class="">
    <el-form ref="medicalClinicFormRef" :model="form" :rules="rules">
      <el-form-item label="业务流水号" prop="ylywlsh">
        <el-input
          v-model="form.ylywlsh"
          placeholder="请输入业务流水号"
        ></el-input>
      </el-form-item>
      <el-form-item label="门诊号" prop="mzh">
        <el-input v-model="form.mzh" placeholder="请输入门诊号"></el-input>
      </el-form-item>
      <el-form-item label="就诊时间" prop="mzjzsj">
        <el-date-picker
          v-model="form.mzjzsj"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          style="width: 100%"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="医疗机构类型">
        <el-select
          style="width: 100%"
          class="form-inline-input"
          v-model="form.yljglxDm"
          clearable
          filterable
        >
          <!-- yljglxDmOption -->
          <el-option
            v-for="item in yljglxDmOption"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其他医疗机构类型">
        <el-input
          v-model="form.tyljglx"
          placeholder="请填写上述医疗机构类型代码没有的类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="医保类型代码">
        <el-select
          style="width: 100%"
          class="form-inline-input"
          v-model="form.yblxDm"
          clearable
          filterable
        >
          <!-- yblxDmOption -->
          <el-option
            v-for="item in yblxDmOption"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其他医保类型">
        <el-input
          v-model="form.qtyblx"
          placeholder="请填写上述医保类型代码没有的类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="医保编号" prop="ybbh">
        <el-input v-model="form.ybbh" placeholder="请填写医保编号"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="xbDm">
        <el-select
          style="width: 100%"
          class="form-inline-input"
          v-model="form.xbDm"
          clearable
        >
          <!-- genderOption -->
          <el-option
            v-for="item in genderOption"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医保统筹基金支付">
        <el-input
          v-model="form.ybtcjjzfje"
          placeholder="请填写医保统筹基金支付"
        ></el-input>
      </el-form-item>
      <el-form-item label="其他支付">
        <el-input v-model="form.tzfje" placeholder="请填写其他支付"></el-input>
      </el-form-item>
      <el-form-item label="个人账户支付">
        <el-input
          v-model="form.grzhzfje"
          placeholder="请填写个人账户支付"
        ></el-input>
      </el-form-item>
      <el-form-item label="个人现金支付">
        <el-input v-model="form.rxjzfje" placeholder="个人现金支付"></el-input>
      </el-form-item>
      <el-form-item label="个人自付">
        <el-input v-model="form.grzfje" placeholder="个人自付"></el-input>
      </el-form-item>
      <el-form-item label="个人自费">
        <el-input
          v-model="form.grzfje1"
          placeholder="请填写个人自费"
        ></el-input>
      </el-form-item>
      <el-form-item
      v-for="(domain, index) in form.sszdyysList"
      :label="editableIndex === index ? '' : domain.sszdyysmc"
      :key="`${domain.sszdyysxh}sszdyysnr${index}`"
      :prop="`sszdyysnr${index}`"
      :rules="getRules(domain, index)"
    >
    <template slot="label">
      <div v-if="editableIndex === index">
        <el-input
          v-model="editableLabels[index]"
          @blur="saveLabel(index, domain)"
          size="small"
          placeholder="输入省自定义要素"
        ></el-input>
      </div>
      <div v-else @click="editLabel(index, domain.sszdyysmc)">
        {{ domain.sszdyysmc }}
      </div>
    </template>
      <el-input v-model="domain.sszdyysnr"></el-input>
      <el-button @click.prevent="removeDomain(domain)" v-if="index > 0">删除</el-button>
    </el-form-item>
      <el-form-item label="省市自定义要素" v-show="form.sszdyysList.length < 10">
        <el-button type="primary" @click="handleAddCounst">添 加</el-button>
        <el-button type="primary" @click="handleParesonData">查 看</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDictionary } from '@/utils'
export default {
  name: "medicalClinicPage",
  components: {},
  props: {
    dataSource:{
        type:Object,
        default:()=> ({})
    }
  },
  data() {
    return {
        genderOption:getDictionary('gender')?.dataList,//性别下拉
        yljglxDmOption:getDictionary('yljglx')?.dataList,//医疗机构类型下拉数据
        yblxDmOption:getDictionary('yblx')?.dataList,//医保类型下拉数据
        editableIndex: -1,
        editableLabels: [],
        form:{
          ylywlsh:'',
          sszdyysList:[
                {
                    "sszdyysxh": 1,
                    "sszdyysmc": '省自定义要素(点击编辑)',
                    "sszdyysnr":'',
                    "ywlx":1
                }
            ],
        },
        rules: {
        ylywlsh: [
            { required: true, message: '内容必填', trigger: 'change' }
          ],
          mzh: [
            { required: true, message: '内容必填', trigger: 'change' }
          ],
          mzjzsj: [
            { required: true, message: '内容必填', trigger: 'change' }
          ],
          ybbh: [
            { required: true, message: '内容必填', trigger: 'change' }
          ],
          xbDm: [
            { required: true, message: '内容必填', trigger: 'change' }
          ],
        }
    };
  },
  computed: {},
  watch: {
    dataSource:{
      handler(val){
        this.handleInit(val);
      }
    }
  },
  methods: {
    handleInit(data){
      if(data.sszdyysList && data.sszdyysList.length <=0 || (Object.keys(data).length <=0)){
        data.sszdyysList.push({
            "sszdyysxh": 1,
            "sszdyysmc": '省自定义要素(点击编辑)',
            "sszdyysnr":'',
            "ywlx":1
          })
      }
      this.form = {...data};
    },
    handleAddCounst(){
        console.log("Add")
        if(this.form.sszdyysList.length >= 10){
            this.$message.warning("最多可添加十条！");
            return
        }
        let obj = {
            "sszdyysxh": this.form.sszdyysList.length,
            "sszdyysmc": `省自定义要素(点击编辑)`,
            "sszdyysnr":'',
            "ywlx":1
        };
        this.form.sszdyysList.push(obj);
    },
    /* 删除 */
    removeDomain(row){

        let index = this.form.sszdyysList.indexOf(row);
        if (index !== -1 && this.form.sszdyysList.length > 1) {
            this.form.sszdyysList.splice(index, 1);
        }
        
    },
    /* 整合返回数据内容 */
    handleParesonData(){
        console.log(this.form,"0")
        this.submitForm();
    },
    /* 编辑label */
    editLabel(index, label) {
      this.editableIndex = index;
      this.$nextTick(() => {
        if (this.editableLabels[index] === undefined) {
          this.editableLabels[index] = label;
        }
      });
    },
    /* 保存label */
    saveLabel(index, domain) {
    const trimmedLabel = this.editableLabels[index] ? this.editableLabels[index].trim() : '';
      if (trimmedLabel === '') {
        this.editableLabels[index] = '省自定义要素(点击编辑)';
      }
      domain.sszdyysmc = this.editableLabels[index];
      this.editableIndex = -1;
    },
    async validateForm() {
      try {
        await this.$refs.medicalClinicFormRef.validate();
        console.log(this.form);
        this.form.sszdyysList = this.form.sszdyysList.filter(k=> ((k.sszdyysmc??'') !=='' && (k.sszdyysnr??'')!=='') || (k.sszdyysmc !=='省自定义要素(点击编辑)' && (k.sszdyysnr??'')!==''))
        this.$emit('update:dataSource', this.form);
        return true;
      } catch (error) {
        console.log('error submit!!');
        return false;
      }
    },
      getRules(domain, index) {
      const defaultLabel = '省自定义要素(点击编辑)';
      return [
        {
          validator: (rule, value, callback) => {
           
            const trimmedLabel = (domain.sszdyysmc??'') !=='' ? domain.sszdyysmc.trim() : '';
            const trimmedValue = (domain.sszdyysnr??'') !=='' ? domain.sszdyysnr.trim():'';
            if (trimmedLabel !== defaultLabel && (trimmedLabel??'') !== '' && (trimmedValue??'') === '') {
              callback(new Error('内容不能为空！'));
              return
            }else if(trimmedLabel === defaultLabel && (trimmedValue??'') !== ''){
                console.log("执行2")
                 callback(new Error('标题不能为 省自定义要素(点击编辑)！'));
                 return
            } else {
                console.log("执行3")
              callback();
            }
          },
          trigger: ['blur','change']
        }
      ];
    }
  },
  created() {
    console.log(this.dataSource,"元数据")
  },
  mounted() {
    this.handleInit(this.dataSource);
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
<style scoped>
/*@import url(); 引入公共css类*/
::v-deep .el-form-item__label {
  cursor: pointer;
}
</style>