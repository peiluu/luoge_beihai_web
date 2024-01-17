<template>
  <div>
    <div class="main-content page-redInfoConfirm" :style="'min-height: ' + contentHeight + 'px;'">
      <el-button icon="el-icon-back" size="mini" @click="close" style="marginBottom: 8px">返回</el-button>

      <Step v-if="['queryBlue', 'addRecord'].includes(operateType)" :stepData="{ current: 2, total: 3, title: '预填发票申请单' }"></Step>
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" :disabled="['detail', 'confirmDetail'].includes(operateType)">

        <!-- 手工补录 -->
        <div class="content-header header-form" v-if="isAddRecord">
          <div class="header-info">
            <div class="header-left" />
            <div class="header-right">
              <el-form-item label="所属组织" prop="orgid">
                <el-select v-model="form.orgid" placeholder="请选择">
                  <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发票种类" prop="lzfppzDm">
                <el-select v-model="form.lzfppzDm" placeholder="请选择" filterable>
                  <el-option v-for="item in fplxList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
                <!-- <el-select v-model="form.lzfppzDm" placeholder="请选择">
                  <el-option label="增值税专用发票" value="01" />
                  <el-option label="普通发票" value="02" />
                  <el-option label="机动车统一销售发票" value="03" />
                  <el-option label="二手车统一销售发票" value="04" />
                </el-select> -->
              </el-form-item>
              <el-form-item label="纸质发票标志" prop="sfzzfpbz">
                <el-select v-model="form.sfzzfpbz" placeholder="请选择">
                  <el-option label="纸质发票" value="Y" />
                  <el-option label="电子发票" value="N" />
                </el-select>

              </el-form-item>
            </div>
          </div>

          <div class="header-info">
            <div class="header-left">原发票信息</div>
            <div class="header-right">
              <el-form-item label="发票金额" prop="lzhjje">
                <el-input v-model="form.lzhjje" placeholder="请输入" @blur="changeFixed('lzhjje')" />
              </el-form-item>
              <el-form-item label="发票税额" prop="lzhjse">
                <el-input v-model="form.lzhjse" placeholder="请输入" @blur="changeFixed('lzhjse')" />
              </el-form-item>
              <el-form-item label="发票号码" prop="lzfphm">
                <el-input v-model="form.lzfphm" placeholder="请输入" maxlength="20" />
              </el-form-item>
              <el-form-item label="发票代码" prop="lzfpdm">
                <el-input v-model="form.lzfpdm" placeholder="请输入" maxlength="20" />
              </el-form-item>
            </div>
          </div>
        </div>

        <!-- 操作红冲 || 查看红字确认单详情（提交完成后查看） -->
        <div class="content-header" v-if="isInvoiceRed || ['detail', 'waitConfirm'].includes(operateType)">
          <div class="header-left">原发票信息：</div>
          <div class="header-right">
            <div class="txt txt-small">发票金额 : {{ formatMoney(form.lzhjje) }}</div>
            <div class="txt">发票税额 : {{ formatMoney(form.lzhjse) }}</div>
            <div class="txt">发票号码: {{ form.lzfphm }}</div>
            <div class="txt">发票代码: {{ form.lzfpdm }}</div>
             <!-- 查看确认单信息中，发票代码用ylppzdm -->
            <!-- <div class="txt">发票种类:
             
              <div v-if="['detail', 'edit', 'waitConfirm'].includes(operateType)"> {{ fplxMap[form.ylppzdm] }}</div>
              <div v-else> {{ fplxMap[form.lzfppzDm] }}</div>
            </div> -->

          </div>
        </div>

        <!-- 查看确认单详情 （从列表进入查看）-->
        <div class="content-header" v-if="['confirmDetail'].includes(operateType)">
          <div class="header-left">确认单信息：</div>
          <div class="header-right">
            <div class="txt">红字发票信息确认单状态：{{ form.hzqrxxztDm != null ? confirmStatusMap[form.hzqrxxztDm].label : '' }}</div>
            <div class="txt">红字发票信息确认单审核状态：{{ form.shzt != null ? examineStatusMap[form.shzt].label : '' }}</div>
            <div class="txt">实际抵扣税额（元）：{{ (form.hzcxse * -1).toFixed(2) || 0 }}</div>
          </div>
        </div>

        <div class="detail-form">
          <el-form-item label="（销售方）纳税人名称" prop="xsfmc">
            <!-- 手工补录 -->
            <el-input v-model="form.xsfmc" placeholder="请输入" disabled maxlength="100" />
          </el-form-item>
          <el-form-item label="（购买方）纳税人名称" prop="gmfmc">
            <el-input v-model="form.gmfmc" placeholder="请输入" :disabled="!isAddRecord" maxlength="100" />
          </el-form-item>

          <!-- <el-form-item label="入账状态" prop="rzzt">
          <el-input v-model="form.rzzt" placeholder="请输入" :disabled="!isAddRecord" />
        </el-form-item> -->

          <el-form-item label="（销售方）纳税人识别号码" prop="xsfnsrsbh">
            <el-input v-model="form.xsfnsrsbh" placeholder="请输入" maxlength="26" disabled />
          </el-form-item>
          <el-form-item label="（购买方）纳税人识别号码" prop="gmfnsrsbh">
            <el-input v-model="form.gmfnsrsbh" placeholder="请输入" maxlength="26" :disabled="!isAddRecord" />
          </el-form-item>
          <el-form-item label="开票日期" prop="lzkprq">
            <el-date-picker v-model="form.lzkprq" value-format="yyyy-MM-dd" placeholder="请选择" :disabled="!isAddRecord" :picker-options="{
              disabledDate(time) { return time.getTime() > Date.now(); }
            }" />
          </el-form-item>
          <div>
            <!-- <el-form-item label="增值税用途状态" prop="diretion">
            <el-input v-model="form.diretion" placeholder="请输入" :disabled="!isAddRecord" />
          </el-form-item> -->
            <!-- <el-form-item label="入账状态" prop="lzkprq">
            <el-date-picker v-model="form.lzkprq" value-format="yyyy-MM-dd" placeholder="请选择" :disabled="!isAddRecord" :picker-options="pickerOptions" />
          </el-form-item> -->
          </div>
        </div>

        <!-- 手工补录、选择蓝票红冲、状态为草稿中（hzqrxxztDm == 00）可以修改红冲原因和金额 -->
        <el-form-item label="开具红字发票原因" prop="chyyDm" class="reason-form">
          <el-select v-model="form.chyyDm" placeholder="请选择" :disabled="!isInvoiceRed && !isAddRecord">
            <el-option value="01" label="开票有误" />

            <!-- <template v-if="form.cezslxDm != '02'"> -->
            <el-option v-if="!hideChyyBack" value="02" label="销货退回" />
            <el-option v-if="!hideChyyStop" value="03" label="服务中止" />
            <el-option value="04" label="销售折让" />
            <!-- </template> -->
          </el-select>

          <el-switch class="switch" active-text="含税" inactive-text="不含税" active-value="Y" inactive-value="N" v-model="form.sfhs" @change="toggleSfhs"
            :disabled="['confirmdetail', 'detail', 'waitConfirm'].includes(operateType)"></el-switch>
          <span v-if="isAddRecord" class="reason-form-tip">注：发票序号与发票项目填写时，必须与原发票顺序保持一致</span>
        </el-form-item>

        <div class="custom-vxe-table">
          <div class="table-toolbar">
            <el-button v-if="isAddRecord" type="success" size="mini" @click="insertEvent()">添加行</el-button>
          </div>
          <!-- cezslxDm：征税方式 0-普通征税 2-差额征税（只能全额红冲，不能修改任何数据） -->
          <vxe-table align="center" border show-footer show-overflow ref="xTable" class="editable-footer" :row-config="{ isHover: true }" :export-config="{}" :footer-method="footerMethod"
            :footer-span-method="footerColspanMethod" :footer-cell-class-name="footerCellClassName" :data="hzqrdmxList" :edit-rules="validRules"
            :edit-config="{ showIcon: isAddRecord || (isInvoiceRed && form.cezslxDm != '2'), enabled: isAddRecord || (isInvoiceRed && form.cezslxDm != '2'), trigger: 'click', mode: 'row' }">
            <!-- 手工补录 || 部分红冲可以删除数据，开票有误 || 差额征税只能全额红冲，不能删除项目 || 差额-->
            <vxe-column field="xh" type="seq" title="操作" min-width="40" v-if="isAddRecord || isInvoiceRed && (form.chyyDm != '01' && form.cezslxDm != '2') && hzqrdmxList.length > 1">
              <template #default="{ row, rowIndex }">
                <i class="el-icon-remove-outline" @click="deleteLine(rowIndex)" />
              </template>
            </vxe-column>

            <!-- 只有手工补录才能修改商品 -->
            <vxe-column field="mxxh" min-width="130" title="原发票序号" :edit-render="{ autofocus: '.vxe-input--inner', enabled: isAddRecord }">
              <template #edit="{ row }">
                <vxe-input v-model="row.mxxh" type="text" maxlength="8" />
              </template>
            </vxe-column>

            <!-- <vxe-column field="hwhyslwfwmc" min-width="250" title="项目名称" :edit-render="{ autofocus: '.vxe-input--inner', enabled: isAddRecord }">
              <template #edit="{ row, rowIndex, $rowIndex }">
                <vxe-input v-model="row.b" type="text">
                  <template #suffix>
                    <i style="cursor: pointer;color: #409EFF;font-size: 16px;" class="vxe-icon-menu" @click="showGoodsDlg(row, $rowIndex)"></i>
                  </template>
                </vxe-input>
              </template>
            </vxe-column> -->
            <vxe-column field="xmmc" min-width="250" title="项目名称" :edit-render="{ autofocus: '.vxe-input--inner', enabled: isAddRecord }">
              <template #edit="{ row, rowIndex, $rowIndex }">
                <vxe-input v-model="row.hwhyslwfwmc" type="text" v-if="isAddRecord">
                  <template #suffix>
                    <i style="cursor: pointer;color: #409EFF;font-size: 16px;" class="vxe-icon-menu" @click="showGoodsDlg(row, $rowIndex)"></i>
                  </template>
                </vxe-input>
                <!-- 非折扣行 -->
                <span v-else-if="row.fphxz != 1">{{ row.hwhyslwfwmc }}</span>
                <!-- 折扣行 -->
                <span v-else><el-tag type="danger">折扣</el-tag>{{ row.hwhyslwfwmc }}</span>
              </template>
              <template #default="{ row }">
                <!-- 非折扣行 -->
                <span v-if="row.fphxz != 1">{{ row.hwhyslwfwmc }}</span>
                <!-- 折扣行 -->
                <span v-else><el-tag type="danger">折扣</el-tag>{{ row.hwhyslwfwmc }}</span>
              </template>
            </vxe-column>
            
            <vxe-column min-width="80" field="ggxh" title="规格型号">
              <template #edit="{ row }">
                
                <vxe-input v-model="row.ggxh" type="text"></vxe-input>
              </template>
            </vxe-column>
            <vxe-column min-width="80" field="dw" title="单位">
              <template #edit="{ row }">
                <vxe-input v-model="row.dw" type="text"></vxe-input>
              </template>
            </vxe-column>
            <!-- 手工补录 || 可以发起红冲时，销售退回02、服务中止03 （且不是tspz不是建筑服务03，建筑服务只能修改金额）可以修改数量 -->
            <!-- 销货退回，只允许修改数量，自动计算金额和税额，不能修改单价，不能直接修改金额；
              如蓝字发票没有数量仅有金额，则允许修改金额，税额自动计算，数量不能修改
              如蓝字发票有数量和金额，则只允许修改数量，税额自动计算，不能修改金额 -->
            <!-- <vxe-column min-width="80" field="fpspsl" title="数量" :edit-render="{ enabled: isAddRecord || isInvoiceRed && form.chyyDm == '02' || isInvoiceRed && form.chyyDm == '03' && form.tspz != '03' }"
              class-name="isred"> -->
            <vxe-column min-width="80" field="fpspsl" title="数量" :edit-render="{ enabled: isAddRecord || (isInvoiceRed && ['02', '03'].includes(form.chyyDm) && form.tspz != '03') }" class-name="isred">
              <template #edit="{ row, rowIndex, $rowIndex }">

                <vxe-input maxlength="31" type="text" v-model="row.fpspsl" @blur="calcGoodsPrice(row, $rowIndex, 'fpspsl')" :disabled="(isInvoiceRed && form.chyyDm == '02' && (row.sl == null)) ? true : false" />
              </template>
            </vxe-column>

            <!-- 只有手工补录才能修改单价 -->
            <vxe-column min-width="120" field="fpspdj" :title="form.sfhs == 'Y' ? '单价(含税)' : '单价(不含税)'" :edit-render="{ enabled: isAddRecord }" class-name="isred">
              <template #edit="{ row, rowIndex, $rowIndex }">
                <vxe-input maxlength="31" v-model="row.fpspdj" type="text" @blur="calcGoodsPrice(row, $rowIndex, 'fpspdj')" />
              </template>
            </vxe-column>
            <!-- 手工补录 || 可以发起红冲时，服务中止03、销售折让04可以修改金额 -->
            <vxe-column min-width="120" field="je" :title="form.sfhs == 'Y' ? '金额(含税)' : '金额(不含税)'" :edit-render="{ enabled: isAddRecord || (isInvoiceRed && ['03', '04', '02'].includes(form.chyyDm)) }" class-name=" isred">
              <template #edit="{ row, rowIndex, $rowIndex }">
                
                <!-- 销货退回02，只允许修改数量，自动计算金额和税额，不能修改单价，不能直接修改金额；
              如蓝字发票没有数量仅有金额，则允许修改金额，税额自动计算，数量不能修改
              如蓝字发票有数量和金额，则只允许修改数量，税额自动计算，不能修改金额 -->
                <vxe-input maxlength="21" v-model="row.je" type="text" @blur="calcGoodsPrice(row, $rowIndex, 'je')" :disabled="(isInvoiceRed && (form.chyyDm == '02' && row.je && row.sl)) ? true : false"></vxe-input>
              </template>
            </vxe-column>

            <vxe-column min-width="120" field="sl1" title="税率/征收率">
              <template #default="{ row }">
                {{ getTaxDesc(row) }}
                <!-- <vxe-select :transfer="true" v-model="row.sl1" placeholder="请选择" @change="calcGoodsPrice(row, $rowIndex, 'sl1')">
                  <vxe-option v-for="(item, index) in taxRates" :key="index" :value="item.slzsl" :label="getTaxDesc(item)"></vxe-option>
                </vxe-select> -->
              </template>
            </vxe-column>
            <vxe-column min-width="80" field="se" title="税额" class-name="isred" />
          </vxe-table>

          <div class="table-price">
            <div class="price-left">价税合计(大写):<span>{{ goodsJshjUppercase }}</span></div>
            <div class="price-right">(小写):<span>{{ goodsJshjLowercase }}</span></div>
          </div>
        </div>
      </el-form>
    </div>

    <div class="fixed-footer">
      <!-- 预填申请单 -->
      <el-button @click="close">{{ ['addRecord', 'queryBlue'].includes(this.operateType) ? '上一步' : '关闭' }}</el-button>
      <!-- 允许红冲 -->
      <template v-if="isInvoiceRed || isAddRecord">
        <el-button type="success" @click="validData('save')">保存</el-button>
        <el-button type="success" @click="validData('submit')">提交</el-button>
      </template>

      <!-- 待我确认的 -->
      <template v-if="['waitConfirm'].includes(operateType)">
        <el-button type="success" @click="confirm('Y')">通过</el-button>
        <el-button @click="confirm('N')">驳回</el-button>
      </template>
    </div>
    <!-- 选择行商品 -->
    <ProductProfileModal :orgid="form.orgid" :tdys="form.tspz" :dialogVisible="goodsDlgVisible" @closeDialog="closeGoodsDlg" @handleSubmitProduct="handleSubmitProduct"></ProductProfileModal>

    <!-- 红字信息单确认 -->
    <ConfirnModal :lrfsf="lrfsf" @handleOk="handleOk" ref="confirnModal" />
  </div>
</template>

<script>
import Step from "@/components/Step.vue";
import { numToCny, dateFormat, } from "@/utils/tool";

import { fplxMap, fplxList } from '@/config/constant.js'

import ProductProfileModal from "@/components/ProductProfileModal/Index.vue";
import ConfirnModal from "@/components/ConfirnModal/Index.vue";
import { examineStatusMap, confirmStatusMap } from '../constant'
import {
  addRedInvoice,
  getTaxRates,
  getRedInvoice,
  invoiceInfo,
  queryBlueInvoiceById,
  submitRedInvoice,
  getOrgList,
} from "./Api";

/**
 * @description  发票确认单 - 可编辑
 */
export default {
  name: "RedInfoConfirm",
  components: { Step, ProductProfileModal, ConfirnModal },
  data() {
    return {
      form: {
        sfhs: 'N',
        chyyDm: '01'
      },
      fplxMap,
      examineStatusMap,
      confirmStatusMap,
      // 商品列表
      hzqrdmxList: [],
      // 可用税率
      taxRates: [],
      hzcxje: '', // 红冲金额
      hzcxse: '', // 红冲税额
      goodsDlgVisible: false,
      goodsJshjUppercase: '',
      goodsJshjLowercase: '',
      orgList: [],
      // 表格验证
      validRules: {
        lzfpmxxh: [{ required: true, message: '原发票序号不能为空' },
        { type: 'number', message: '请输入数字' }],
        hwhyslwfwmc: [{ required: true, message: '项目名称不能为空' }],
        // 商品数量
        fpspsl: [{ type: 'number', message: '请填写正确数字', trigger: "blur" },
        { pattern: /^([-+])?\d+(\.[0-9]{1,10})?$/, message: '请输入最多10位小数的数字' }],
        fpspdj: [{ type: 'number', message: '请填写正确数字' },
        { pattern: /^([-+])?\d+(\.[0-9]{1,10})?$/, message: '请输入最多10位小数的数字' }],
        je: [{ required: true, message: '金额不能为空' }, { type: 'number', message: '请填写正确数字' }, { pattern: /^([\\+ \\-]?(([1-9]\d{0,9})|([0-9]\d*.\d?[1-9]{1})))([.]\d{0,2})?$/, message: '金额不能为0' }],
        sl1: [{ required: true, message: '税率/征收率不能为空' }]
      },
      rules: {
        lzhjje: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^\d+(\.[0-9]{1,2})?$/, message: "请输入最多2位小数的数字" }],
        lzhjse: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^\d+(\.[0-9]{1,2})?$/, message: "请输入最多2位小数的数字" }],
        gmfmc: [{ required: true, message: "请输入", trigger: "blur" },],
        gmfnsrsbh: [{ required: true, message: "请输入", trigger: "blur" }],
        lzfphm: [{ required: true, message: "请输入", trigger: "blur" }],
        chyyDm: [{ required: true, message: "请选择", trigger: "blur" }],
        orgid: [{ required: true, message: "请选择", trigger: "blur" }],
        lzfppzDm: [{ required: true, message: "请选择", trigger: "blur" }],
        lzkprq: [{ required: true, message: "请选择", trigger: "blur" }],
        sfzzfpbz: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      lrfsf: '',
      hideChyyBack: false, // 隐藏销路退回冲红原因
      hideChyyStop: false,  // 隐藏服务中止冲红原因
      fplxList: [
        { value: '4', label: '增值税专用发票' },
        { value: '3', label: '增值税普通发票' },
        { value: '2', label: '增值税电子专用发票' },
        { value: '1', label: '增值税电子普通发票' },
        { value: '31', label: '数电增值税专用发票' },
        { value: '32', label: '数电增值税普通发票' }
      ],
    };
  },
  activated() {
    /**
     * operateType - 操作类型共有一下几种情况:
     * addRecord - 手工补录（可以编辑所有的表单），
     * queryBlue - 选择蓝票红冲，可以提交红冲
     * edit - 编辑（可以提交红冲），
     * detail - 查看详情（不能修改任何内容）
     * confirmdetail - 查看确认详情（不能修改任何内容），
     * waitConfirm - 等待我方确认，可以操作同意驳回
     */

    const { id = "", operateType = '', blueInvoiceId = '', isFormInvoiced = 'N' } = this.$route.query;
    this.getTaxRates();
    this.getOrgList();
    // 查询蓝票信息 (新增红字信息单 || 从已开票红冲)
    if (operateType === 'queryBlue') {
      // sessionStorage.setItem('clearRedInvoice', 0);

      this.queryBlueInvoiceById(blueInvoiceId, isFormInvoiced);
      return;
    }

    // 手工补录 - 初始化数据
    if (operateType === 'addRecord' && sessionStorage.getItem('clearRedInvoice') == 1) {
      this.initForm();
      return;
    }
    if (id) {
      // 查询红字申请单详情
      this.getRedInvoice(id)
    }
  },
  mounted() {
    if (this.operateType === 'addRecord') {
      this.initForm();
    }
  },
  watch: {
    // 红冲金额
    hzcxje(val) {
      this.goodsJshjLowercase = (parseFloat(this.hzcxje || 0) + parseFloat(this.hzcxse || 0)).toFixed(2)
    },
    // 红冲税额
    hzcxse(val) {
      this.goodsJshjLowercase = (parseFloat(this.hzcxje || 0) + parseFloat(this.hzcxse || 0)).toFixed(2)
    },
    goodsJshjLowercase(val) {
      this.goodsJshjUppercase = numToCny(val)
    },
    // 查蓝票
    'form.lzfppzDm': {
      handler(newV) {
        if (['queryBlue', 'addRecord'].includes(this.operateType)) {
          // 专票购买方纳税人识别号为必填
          this.rules.gmfnsrsbh[0].required = ['2', '4', '31'].includes(newV)
        }

      },
      deep: true
    },
    // 查红字单信息
    'form.ylppzdm': {
      handler(newV) {
        if (['detail', 'edit', 'waitConfirm'].includes(this.operateType)) {
          // 专票购买方纳税人识别号为必填
          this.rules.gmfnsrsbh[0].required = ['2', '3', '31'].includes(newV)
        }
      },
      deep: true
    },
  },

  computed: {
    query() {
      return this.$route.query
    },
    operateType() {
      return this.$route.query.operateType;
    },
    contentHeight() {
      return window.innerHeight - 156;
    },
    // 判断是否是手工补录
    isAddRecord() {
      return this.operateType === 'addRecord'
    },
    // 判断红冲是非手工补录下的的红红冲：选择蓝票红冲或者已提交的红字信息单状态为草稿中, 可以修改红冲
    isInvoiceRed() {
      return ['queryBlue', 'edit'].includes(this.operateType)
    },
  },

  methods: {
    dateFormat(fmt, date) {
      return dateFormat(fmt, date)
    },
    initForm() {
      this.form = {
        sfhs: 'N',
        chyyDm: '01',
        xsfmc: this.$route.query.nsrmc,
        xsfnsrsbh: this.$route.query.nsrsbh,
      }
      this.hzqrdmxList = [{}];
      sessionStorage.setItem('clearRedInvoice', 0);
    },
    // 获取当前用户可以开票的主体列表
    async getOrgList() {
      const { code = '', data = [] } = await getOrgList({
        taxBodyId: this.query.taxBodyId
      })
      if (code === '0') {
        this.orgList = data;
      }
    },

    // 获取可用税率
    async getTaxRates() {
      const { code = "", data = {} } = await getTaxRates();
      if (code === "0") {
        const { slzslList = [] } = data;
        this.taxRates = slzslList;
      }
    },

    // 转化税率格式
    getTaxDesc(row = {}) {
      return row.sl1 == null ? '' :
        (row.lslbs == 2 || (row.taxclasscode || '').substring(0, 1) == '6' ? '不征税' :
          (row.lslbs == 1 ?
            '免税' :
            row.sl1 * 100 + '%'))
    },
    // 查看红字确认单申请详情，查看 / 红冲 /
    async getRedInvoice(id) {
      const { code = '', data = {} } = await getRedInvoice({ id })
      debugger;
      if (code === '0') {
        this.form = {
          ...this.form,
          ...data,
          lzkprq: dateFormat('YYYY-mm-dd', data.lzkprq),
          lzfptdyslxDm: data.lzfpTdyslxDm, // 蓝字发票特定要素类型代码
        };
       
        // 当前身份，销方收到的购方发起的，购方收到的销方发起的
        this.lrfsf = data.lrfsf == '0' ? '1' : '0'
        this.hzqrdmxList = data?.hzqrdmxList ? data?.hzqrdmxList.map((item) => {
          return {
            ...item,
            je: item.spje,
            fpspdj: item.spdj,
            bhsje: this.getBhsje(item, 'spje')
          }
        }) : []
      }
    },

    // 查询蓝字发票详情，非手工补录
    async queryBlueInvoiceById(id, isFormInvoiced) {
      // 从已开票复制进入 || 选择蓝票红冲
      const api = isFormInvoiced == 'Y' ? invoiceInfo : queryBlueInvoiceById;
      const { code = "", data = {} } = await api({ id });
      delete data.id
      if (code === "0") {
        this.form = {
          sfhs: 'N',
          chyyDm: '01',
          ...data,
          lzhjse: data.hjse, // 蓝字合计税额
          lzhjje: data.hjje,  // 蓝字合计金额额
          lzfphm: data.fphm,
          lzfpdm: data.fpdm,
          lzkprq: dateFormat('YYYY-mm-dd', data.kprq),
          lzfptdyslxDm: data.tspz, // 蓝字发票特定要素类型代码
          lzfppzDm: data.fplx, // 发票种类
          invoiceId: id, // 蓝字发票id
          xsfmc: data.xsfmc,
          xsfnsrsbh: data.xsfnsrsbh,
          gmfmc: data.gmfmc,
          gmfnsrsbh: data.gmfnsrsbh,
          orgid: data.orgId,
          cezslxDm: data.zsfs, // 征税方式
          sfzzfpbz: 'N', // 纸质发票标志, N电子发票
        };
        // this.hzqrdmxList = data.invoiceDetailList || []
        const { detailList = [] } = data;
        console.log(data)
        debugger;
        // 商品列表，参数名称转化
        this.hzqrdmxList = detailList ? detailList?.map((item, index) => {
          return {
            ...item,
            ...this.transformParam(item, detailList[index], index + 1),
            bhsje: this.getBhsje(item, 'xmje')
          }
        }) : [];
        console.log(this.hzqrdmxList,"09")
        debugger;
        this.$nextTick(() => {
          this.dealChyy();
        })
      }
    },

    // 转化蓝票参数与红票参数保持一致
    transformParam(resultItem, oldItem, xh) {
      debugger;
      // 货物或应税劳务、服务名称拼写
      resultItem.hwhyslwfwmc = oldItem.xmmc;
      // 项目名称
      resultItem.xmmc = oldItem.ysxmmc;
      // 商品服务简称
      resultItem.spfwjc = oldItem.spfwjc;
      // 税率
      resultItem.sl1 = oldItem.slv;
      // 数量 (转化为负数）
      resultItem.fpspsl = oldItem.fpspsl ? -1 * oldItem.fpspsl : oldItem.fpspsl
      // 金额（转化为负数）
      resultItem.je = oldItem.je ? -1 * oldItem.je : oldItem.je;
      // 单价（不需要转化为负数）
      resultItem.fpspdj = oldItem.fpspdj
      // resultItem.fpspdj = oldItem.xmdj ? -1 * oldItem.xmdj : oldItem.xmdj;
      // 税额（转化为负数）
      resultItem.se = -1 * oldItem.se;
      // 商品和服务税收分类合并编码
      resultItem.taxclasscode = oldItem.spbm;
      resultItem.sphfwssflhbbm = oldItem.spbm;
      // 对应蓝字发票明细序号
      resultItem.lzfpmxxh = oldItem.lzfpmxxh || xh;
      // 序号
      resultItem.xh = oldItem.mxxh || xh;
      resultItem.zzstsgl = oldItem.zzstsgl
      resultItem.lslbs = oldItem.lslbs
      debugger;
      return resultItem
    },
    // 蓝字发票金额和税额添加两位小数
    changeFixed(key) {
      // const value = this.form[key];
      // this.form = {
      //   ...this.form,
      //   [key]: value ? parseFloat(value).toFixed(2) : ''
      // }
    },

    /**
     * @description 提交表单，验证数据格式
     */
    async validData(type) {
      // 验证表单数据
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;


        // 需要添加商品明细
        if (this.hzqrdmxList.length == 0) {
          this.$message.warning('请添加商品明细！')
          return false;
        }
        // // 验证表格数据
        const errMap = await this.$refs.xTable.fullValidate(true).catch(errMap => errMap)
        if (errMap) return;
        // 蓝字票面金额（价税合计）
        const lzjshj = (parseFloat(this.form.lzhjje) + parseFloat(this.form.lzhjse)).toFixed(2)
        // 红冲金额不能大于票面金额(价税合计)！ || 红冲金额 || 红冲税额
        if (this.goodsJshjLowercase * -1 > lzjshj || this.hzcxje * -1 > this.form.lzhjje || this.hzcxse * -1 > this.form.lzhjse) {
          this.$message.warning('红冲金额不能大于票面金额！')
          return;
        }

        // 判断全额红冲，票面金额要等于填写的价税合计
        if (this.form.chyyDm === '01' && (lzjshj != this.goodsJshjLowercase * -1 || this.form.lzhjje != this.hzcxje * -1 || this.form.lzhjse != this.hzcxse * -1)) {
          this.$message.warning('请全额红冲！')
          return;
        }

        // // 判断部分红冲，票面金额要大于填写的价税合计
        // if (this.form.chyyDm !== '01' && !(this.form.hzcxje > this.goodsJshjLowercase)) {
        //   this.$message.warning('请部分红冲！')
        //   return;
        // }
        // return;
        //

        // taxclasscode 1.2 开头 货物劳务 3开头服务
        // 原蓝字发票商品服务编码仅为货物或劳务时，红冲原因不允许选择“服务中止”；商品服务编码仅为服务时，红冲原因不允许选择“销货退回”。
        // 销货退回
        if (this.form.chyyDm == '02' && this.hzqrdmxList.every((item) => item.sphfwssflhbbm && ['3'].includes(item.sphfwssflhbbm[0]))) {
          this.$message.warning('原蓝字发票商品服务编码仅为服务，红冲原因请勿选择销货退回')
          return;
        }
        if (this.form.chyyDm == '03' && this.hzqrdmxList.every((item) => item.sphfwssflhbbm && ['1', '2'].includes(item.sphfwssflhbbm[0]))) {
          this.$message.warning('原蓝字发票商品服务编码仅为货物或劳务，红冲原因请勿选择服务中止')
          return;
        }
        this.submitData(type);
      })
    },
    getBhsje(row, key) {
      let bhsje = '';
      if (this.form.sfhs == 'Y') {
        // 如果是含税的, 不含税金额 = 金额 - 税额
        bhsje = Calc.Sub(row[key] || 0, row.se || 0, 2)
      } else {
        // 如果是不含税的, 不含税金额 = 金额
        bhsje = row[key];
      }
      bhsje = bhsje > 0 ? -1 * bhsje : bhsje
      return bhsje && bhsje != 0 ? parseFloat(bhsje).toFixed(2) : '0.00'
    },

    // 提交数据
    async submitData(type) {
      const api = type === "save" ? addRedInvoice : submitRedInvoice;
      const { code = "", data = {}, msg = '' } = await api({
        ...this.form,
        lrfsf: '0', // 购销方身份，目前只做为销方发起
        // lzfppzDm: 'N', // 蓝字发票票种代码
        hzqrdmxList: this.hzqrdmxList,
        hzcxje: this.hzcxje, // 红冲金额
        hzcxse: this.hzcxse, // 红冲税额
        // sfzzfpbz: 'Y', // 纸质发票标志
      });

      if (code !== "0"){
        this.$message.error(msg);
        
      }else{
        const cousntMsg = type === "save" ? '保存成功' : '您提交的红字发票信息表，已成功申请';
        this.$message.success(cousntMsg);
        const path = type === 'save' ? '/redInvoice/infoTable' : '/redInvoice/redApplySuccess';
        const { nsrmc = '', nsrsbh = '', taxBodyId = '' } = this.query;

        this.$router.push({
          path,
          query: {
            nsrmc, nsrsbh, taxBodyId,
            id: data.id
          }
        });
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      }
      
    },
    handleSubmitProduct(row) {
      this.goodsDlgVisible = false;
      let tableData = this.$refs.xTable.getTableData().tableData;
      this.matchCb(row, tableData[this.currentGoodsIndex]);
      this.$nextTick(() => {
        this.dealChyy();
      })
    },

    // 是否含税切换
    toggleSfhs($event) {
      let xTable = this.$refs.xTable;
      let tableData = xTable.getTableData().tableData;
      // 计算含税
      if ($event == 'Y') {
        tableData.forEach(e => {
          // 金额 = 金额 + 税额
          e.bhsje = e.je
          e.je = Calc.Add(e.je || 0, e.se || 0) || ''
          if (e.fpspsl != 0 && e.fpspsl) {
            e.fpspdj = Calc.Div(e.je || 0, e.fpspsl || 0, 10) || ''
          }
        });
      } else {
        // 计算不含税
        tableData.forEach(e => {
          e.je = Calc.Sub(e.je || 0, e.se || 0) || ''
          e.bhsje = e.je
          if (e.fpspsl != 0 && e.fpspsl) {
            e.fpspdj = Calc.Div(e.je || 0, e.fpspsl || 0, 10) || ''
          }
        })
      }
      xTable.updateFooter();
    },
    //商品金额计算
    calcGoodsPrice(row, rowIndex, column) {
      debugger;
      // column fpspsl, dj, je, sl1
      // 计算税额
      const getSe = (row) => {
        let se = '';
        if (this.form.sfhs == 'Y') {
          // 如果是含税的, 税额 =  含税金额 - ( 含税金额 / ( 1 + 税率))
          se = Calc.Sub(row.je, Calc.Div(row.je || 0, ((row.sl1 || 0) + 1), 2))
        } else {
          // 如果是不含税的, 税额 = 税率 * 金额
          se = Calc.Mul(row.je || 0, row.sl1 || 0, 2);
        }
        return se && se != 0 ? parseFloat(se).toFixed(2) : '0.00';
      }
      switch (column) {
        // 改变数量会影响金额、单价、税额
        case 'fpspsl':
          // 转化负数 非折扣行
          if (row.fphxz != 1) {
            row.fpspsl = row.fpspsl == 0 ? 0 : row.fpspsl > 0 ? -1 * row.fpspsl : row.fpspsl;
          }

          // 如果单价存在
          if (row.fpspdj) {
            // 如果非手工补录情况下的红冲。理由是服务中止03，销售折让04, 修改数量时, 金额不自动计算
            // if (!(this.isInvoiceRed && ['03'].includes(this.form.chyyDm))) {
            // 金额 = 单价 * 数量
            row.je = Calc.Mul(row.fpspsl || 0, row.fpspdj || 0);
            // 转化负数
            row.je = row.je > 0 ? -1 * row.je : row.je;
            // }
          } else if (row.je && row.fpspsl && row.fpspsl.fpspsl != 0) {
            // 单价不存在，金额存在，数量不为0
            // 单价 = 金额 / 数量
            // 如果非手工补录情况下的红冲。理由是销售退回02, 服务中止03，销售折让04, 修改数量时, 单价不自动计算
            // if (!(this.isInvoiceRed && ['02', '03', '04'].includes(this.form.chyyDm))) {
            row.fpspdj = Calc.Div(row.je || 0, row.fpspsl || 0, 10);
            // 转化负数
            // row.fpspdj = row.fpspdj < 0 ? -1 * row.fpspdj : row.fpspdj;
            // }
          }
          row.se = getSe(row)
          break
        // 改变单价, 会改变数量、金额，税额
        case 'fpspdj':
          // 转化正数
          row.fpspdj = row.fpspdj < 0 ? -1 * row.fpspdj : row.fpspdj
          // 如果但是金额存在，数量不存在
          if (row.je && row.fpspdj && row.fpspdj != 0 && !row.fpspsl) {
            // 数量 = 金额 / 单价
            row.fpspsl = Calc.Div(row.je || 0, row.fpspdj || 0, 10);
            // 转化负数
            row.fpspsl = row.fpspsl > 0 ? -1 * row.fpspsl : row.fpspsl;
          } else if (row.fpspsl) {
            // 如果数量存在
            // 金额 = 单价 * 数量
            row.je = Calc.Mul(row.fpspsl || 0, row.fpspdj || 0);
            // 转化负数
            row.je = row.je > 0 ? -1 * row.je : row.je;
          }
          row.se = getSe(row)
          break
        // 改变金额可以改变数量、单价、税额
        case 'je':
          // 转化负数 非折扣行
          if (row.fphxz != 1) {
            row.je = row.je > 0 ? -1 * row.je : row.je
          }
          // 如果数量存在
          if (row.fpspsl) {
            // 如果非手工补录情况下的红冲。理由是服务中止03，销售折让04， 修改金额时, 单价不自动计算
            // if (!(this.isInvoiceRed && ['03', '04'].includes(this.form.chyyDm))) {
            // 单价 = 金额 / 数量
            row.fpspdj = Calc.Div(row.je || 0, row.fpspsl || 0, 10);
            // 转化负数
            // row.fpspdj = row.fpspdj > 0 ? -1 * row.fpspdj : row.fpspdj
            // }
          }
          // 如果单价存在，数量不存在
          if (row.fpspdj && !row.fpspsl) {
            // 如果非手工补录情况下的红冲。理由是服务中止03, 销售折让04， 修改金额时, 数量不自动计算
            //  if (!(this.isInvoiceRed && ['03', '04'].includes(this.form.chyyDm))) {
            // 数量 = 金额 / 单价
            row.fpspsl = Calc.Div(row.je || 0, row.fpspdj || 0, 10);
            // 转化负数
            row.fpspsl = row.fpspsl > 0 ? -1 * row.fpspsl : row.fpspsl
            //}
          }
          row.se = getSe(row)
          break
        // 改变税率，只影响税额
        case 'sl1':
          // if (row.sl1 != 0) {
          row.se = getSe(row)
          // }
          break
      }
      row.bhsje = this.getBhsje(row, 'je');
      row.je = row.je ? parseFloat(row.je).toFixed(2) : ''
    },
    // 选择商品
    matchCb(oldItem, resultItem) {
      // 特定要素
      resultItem.tdys = oldItem.tdys;
      // 税率
      resultItem.sl1 = oldItem.sl;

      // 税率
      resultItem.sl1 = oldItem.sl;
      // 规则型号
      resultItem.ggxh = oldItem.ggxh || '-';
      // 单位
      resultItem.dw = oldItem.dw || '-';
      // 单价
      resultItem.fpspdj = oldItem.dj;
      // 商品和服务税收分类合并编码
      resultItem.sphfwssflhbbm = oldItem.taxclasscode;
      // 税率相关

      resultItem.taxclasscode = oldItem.taxclasscode;

      resultItem.lslbs = oldItem.lslbs
      resultItem.zzstsgl = oldItem.zzstsgl

      // 项目名称
      resultItem.xmmc = oldItem.name;
      // 商品服务简称
      resultItem.spfwjc = oldItem.taxclassjc;
      // 货物或应税劳务、服务名称
      resultItem.hwhyslwfwmc = "*" + oldItem.taxclassjc + "*" + oldItem.name;
      // 序号
      resultItem.xh = this.currentGoodsIndex + 1;
      // 数量
      resultItem.fpspsl = '';
      // 金额
      resultItem.je = '';
      // 税额
      resultItem.se = '';
      return resultItem

    },
    //商品列表
    sumNum(list, field) {
      let count = 0
      list.forEach(item => {
        count += Number(item[field] || 0)
      })
      return count
    },

    sumNumJE(list, field) {
      let count = 0
      list.forEach(item => {
        count += Number(item[field] || 0)
      })
      return count
    },
    footerMethod({ columns, data }) {
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return '合计'
          }
          if (['je'].includes(column.property)) {
            if (data[0] && data[0].bhsje) {
              this.hzcxje = this.sumNum(data, 'bhsje') ? this.sumNum(data, 'bhsje').toFixed(2) : "0.00";
            } else {
              this.hzcxje = this.sumNum(data, 'je') ? this.sumNum(data, 'je').toFixed(2) : "0.00";
            }
            return this.hzcxje;
          }

          if (['se'].includes(column.property)) {
            this.hzcxse = this.sumNum(data, 'se') ? this.sumNum(data, 'se').toFixed(2) : "0.00";
            return this.hzcxse;
          }
          return null
        }),
      ]
      return footerData
    },
    footerColspanMethod({ $rowIndex, _columnIndex }) {
      if ($rowIndex === 0) {
        if (_columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 5
          }
        } else if ([1, 2, 3, 4].includes(_columnIndex)) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else if (_columnIndex === 5 || _columnIndex === 7) {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    },
    footerCellClassName({ $rowIndex, column, columnIndex }) {
      if (columnIndex === 0) {
        return 'footer-title'
      } else if (column.property === 'se' || column.property === 'je') {
        return 'footer-content'
      }
    },
    insertEvent(firstLoad) {
      const $table = this.$refs.xTable
      const record = {}
      this.hzqrdmxList.push({})
      $table.insertAt(record, -1).then(({ row }) => {
        if (!firstLoad) {
          $table.setEditCell(row, 'xmmc')
        }
      })
    },
    deleteLine(rowIndex) {
      this.hzqrdmxList.splice(rowIndex, 1)
      this.$nextTick(() => {
        this.dealChyy();
      })
    },
    /**
     * @description 处理冲红原因
     * 如原蓝字发票商品服务编码仅为货物或劳务时，红冲原因不允许选择“服务中止”；
     * 商品服务编码仅为服务时，红冲原因不允许选择“销货退回”。
     * sphfwssflhbbm: 01、02开头 货物劳务 ||  03开头服务
     */
    dealChyy() {
      // 销货退回
      this.hideChyyBack = this.hzqrdmxList.length > 0 && this.hzqrdmxList.every((item) => item.sphfwssflhbbm && ['3'].includes(item.sphfwssflhbbm[0]))
      // 服务中止
      this.hideChyyStop = this.hzqrdmxList.length > 0 && this.hzqrdmxList.every((item) => item.sphfwssflhbbm && ['1', '2'].includes(item.sphfwssflhbbm[0]))

    },
    // showOption(type) {
    //   // 销货退回
    //   if (type === '02') {
    //     this.hzqrdmxList.length > 0 && this.hzqrdmxList.every((item) => item.sphfwssflhbbm == '01' || item.sphfwssflhbbm == '02')
    //   }
    //   // 服务中止
    //   if (type === '03') {
    //     this.hzqrdmxList.length > 0 && this.hzqrdmxList.every((item) => item.sphfwssflhbbm == '03')
    //   }
    //   return true
    // },

    showGoodsDlg(row, rowIndex) {
      this.goodsDlgVisible = true;
      this.currentGoodsIndex = rowIndex;
    },
    closeGoodsDlg() {
      this.goodsDlgVisible = false;
    },
    // 红字信息单确认回调
    handleOk() {
      this.close()
    },

    // 红字信息单确认
    confirm(qrlx) {
      this.$refs.confirnModal.confirm(qrlx, this.form, []);
    },
    close() {
      this.form = { sfhs: 'N' }
      this.hzqrdmxList = [{}]
      // 返回上一步 || 回到列表页面
      const { level = '', isFormInvoiced = '', nsrmc = '', nsrsbh = '', taxBodyId = '', isFormTodoList } = this.query;
      // 从已开票进入的, 返回上一步直接返回已开票页面·
      if (isFormInvoiced == 'Y') {
        this.$router.push({ path: '/outputInvoice/invoicedList/Index' });
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
        return;
      }
      // 从待办事项页面进入的, 返回上一步直接返回待办事项页面·
      if (isFormTodoList == 'Y') {
        this.$router.push({ path: '/todo/red-font', query: { activeName: 2 } });
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
        return;
      }

      // output 销项 || input 进项 || 红字信息单
      const urlMap = {
        outputWaitConfirm: '/outputInvoice/waitConfirm',
        inputWaitConfirm: '/inputInvoice/waitConfirm',
        addRecord: '/redInvoice/addApplyForm',
        queryBlue: '/redInvoice/addApplyForm',
      }
      //const backWaitConfirmPath = level === 'output' ? '/outputInvoice/waitConfirm/Index' : '/inputInvoice/waitConfirm/Index';
      // 返回进项/销项待确认红字列表
      //const path = ['output', 'input'].includes(level) ? backWaitConfirmPath : ['addRecord', 'queryBlue'].includes(this.operateType) ? '/redInvoice/addApplyForm' : '/redInvoice/infoTable';
      this.$router.push({
        path:'/outputInvoice/redInvoice/infoTable/Index',
        query: { nsrmc, nsrsbh, taxBodyId }
      });
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    },
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss'; //导入外部scss文件
</style>

