<template>
  <div>
    <div class="ticket-content" :style="'height: ' + contentHeight + 'px;'">
      <!--<Step :stepData="{current:3,total:3,title:'发票开具'}"></Step>-->
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="mini"
      >
        <div class="content-invoice">
          <div class="invoice-head">
            <div class="head-left">
              <div class="green" v-if="!isBlank(form.tdys)">
                {{ getArrayName(tdysOptions, form.tdys) }}
              </div>
              <br />
              <div class="gray" v-if="!isBlank(form.cezslxDm)">
                {{ getArrayName(cezslxDmOptions, form.cezslxDm) }}
              </div>
              <div class="gray" v-if="!isBlank(form.jazs)">
                减按征税-{{ getArrayName(jazsOptions, form.jazs) }}
              </div>
            </div>
            <div class="head-center">
              电子发票(<template v-if="form.fppz == '01'"
                >增值税专用发票</template
              ><template v-else>普通发票</template>)
              <div class="bottom-line"></div>
              <div class="bottom-line2"></div>
            </div>
            <div class="head-right"></div>
          </div>
          <div class="invoice-form">
            <div class="invoice-form-content">
              <!--购买方 -->
              <div class="invoice-form-seller">
                <div class="seller-name">购买方信息</div>
                <div class="seller-form-items">
                  <div class="top-bar">
                    <el-checkbox
                      :disabled="form.fppz == '01'"
                      v-model="form.gmfzrrbz"
                      true-label="Y"
                      false-label="N"
                      >是否开票给自然人</el-checkbox
                    >
                    <span
                      v-if="!moreSellerInfo"
                      class="el-dropdown-link"
                      @click="moreSellerInfo = !moreSellerInfo"
                    >
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <span
                      v-else
                      class="el-dropdown-link"
                      @click="moreSellerInfo = !moreSellerInfo"
                    >
                      收起<i class="el-icon-arrow-up el-icon--right"></i>
                    </span>
                  </div>
                  <el-col :span="24">
                    <el-form-item label="名称" prop="gmfmc">
                      <vxe-input size="small" v-model="form.gmfmc">
                        <template #suffix>
                          <i
                            style="
                              cursor: pointer;
                              color: #409eff;
                              font-size: 16px;
                            "
                            class="vxe-icon-menu"
                            @click="showBuyerDlg"
                          ></i>
                        </template>
                      </vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      :class="form.fppz == '01' ? 'is-required' : ''"
                      label="统一社会信用代码/纳税人识别号"
                      prop="gmfnsrsbh"
                    >
                      <vxe-input
                        size="small"
                        v-model="form.gmfnsrsbh"
                      ></vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="moreSellerInfo"
                      label="购买方地址"
                      prop="gmfdz"
                    >
                      <vxe-input size="small" v-model="form.gmfdz"></vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="moreSellerInfo"
                      label="电话"
                      prop="gmfdh"
                    >
                      <vxe-input size="small" v-model="form.gmfdh"></vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="moreSellerInfo"
                      label="购方开户银行"
                      prop="gmfkhh"
                    >
                      <vxe-input size="small" v-model="form.gmfkhh"></vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="moreSellerInfo"
                      label="银行账号"
                      prop="gmfzh"
                    >
                      <vxe-input size="small" v-model="form.gmfzh"></vxe-input>
                    </el-form-item>
                  </el-col>
                </div>
              </div>
              <!--销售方-->
              <div class="invoice-form-seller">
                <div class="seller-name" style="border-left: 2px solid #a15f3b">
                  销售方信息
                </div>
                <div class="seller-form-items">
                  <div class="top-bar" style="{ color: #e6a23c, visibility: form.djkpfs == '1'? 'hidden': '' }">
                    当前可用发票额度：{{ kysyed || 0 }}
                  </div>
                  <el-col :span="24">
                    <el-form-item label="名称" prop="xsfmc">
                      <vxe-input disabled size="small" v-model="form.xsfmc">
                      </vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="统一社会信用代码/纳税人识别号"
                      prop="xsfnsrsbh"
                    >
                      <vxe-input
                        disabled
                        size="small"
                        v-model="form.xsfnsrsbh"
                      ></vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="moreSellerInfo"
                      label="销售方地址"
                      prop="xsfdz"
                    >
                      <vxe-input
                        disabled
                        size="small"
                        v-model="form.xsfdz"
                      ></vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="moreSellerInfo"
                      label="电话"
                      prop="xsfdh"
                    >
                      <vxe-input
                        disabled
                        size="small"
                        v-model="form.xsfdh"
                      ></vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="moreSellerInfo"
                      label="销方开户银行"
                      prop="xsfkhh"
                    >
                      <vxe-input
                        disabled
                        size="small"
                        v-model="form.xsfkhh"
                      ></vxe-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="moreSellerInfo"
                      label="银行账号"
                      prop="xsfzh"
                    >
                      <vxe-input
                        disabled
                        size="small"
                        v-model="form.xsfzh"
                      ></vxe-input>
                    </el-form-item>
                  </el-col>
                </div>
              </div>
            </div>
            <div class="invoice-form-goods">
              <div class="form-goods-toolbar">
                <!-- 左边-->
                <el-popover
                  placement="top"
                  popper-class="el-invoice-popover"
                  width="200"
                  trigger="manual"
                  :content="tipsContent"
                  v-model="addTipsVisible"
                >
                  <el-button
                    style="margin-right: 10px"
                    slot="reference"
                    type="success"
                    @click="insertEvent()"
                    >添加行</el-button
                  >
                </el-popover>

                <el-button style="margin-right: 10px" @click="removeGoods"
                  >删除</el-button
                >

                <el-popover
                  placement="top"
                  popper-class="el-invoice-popover"
                  width="200"
                  trigger="manual"
                  :content="discountContent"
                  v-model="discountVisible"
                >
                  <el-button
                    :disabled="!isBlank(form.cezslxDm) || !isBlank(form.jazs)"
                    slot="reference"
                    @click="insertDiscountRow"
                    >添加折扣</el-button
                  >
                </el-popover>

                <el-switch
                  :disabled="!isBlank(form.cezslxDm)"
                  style="margin-left: 10px"
                  class="switch"
                  active-text="含税"
                  inactive-text="不含税"
                  active-value="1"
                  inactive-value="0"
                  v-model="form.sfhs"
                  @change="toggleSfhs"
                ></el-switch>

                <!--右边 -->
                <el-button
                  size="mini"
                  style="float: right; margin-right: 10px"
                  @click="clearItems"
                  >清空重填</el-button
                >
              </div>
              <div class="form-goods-gird">
                <vxe-table
                  border
                  show-footer
                  show-overflow
                  stripe
                  ref="xTable"
                  class="editable-footer"
                  :row-config="{ isHover: true }"
                  :export-config="{}"
                  :footer-method="footerMethod"
                  :footer-span-method="footerColspanMethod"
                  :footer-cell-class-name="footerCellClassName"
                  :edit-rules="validRules"
                  :edit-config="{ trigger: 'click', mode: 'row' }"
                >
                  <vxe-column type="checkbox" min-width="45"></vxe-column>
                  <vxe-column
                    type="seq"
                    min-width="50"
                    title="序号"
                  ></vxe-column>
                  <!--<vxe-column field="fphxz" min-width="50">
                    <template #default="{row, rowIndex, $rowIndex}">
                      <el-tag v-if="row.fphxz=='01'" type="danger">折扣</el-tag>
                    </template>
                  </vxe-column>-->
                  <vxe-column
                    field="xmmc"
                    min-width="300"
                    title="项目名称"
                    :edit-render="{}"
                  >
                    <template #edit="{ row, rowIndex, $rowIndex }">
                      <vxe-input
                        v-model="row.xmmc"
                        type="text"
                        v-if="row.fphxz == '00'"
                      >
                        <template #suffix>
                          <i
                            style="
                              cursor: pointer;
                              color: #409eff;
                              font-size: 16px;
                            "
                            class="vxe-icon-menu"
                            @click="showGoodsDlg(row, $rowIndex)"
                          ></i>
                        </template>
                      </vxe-input>
                      <span v-else-if="row.fphxz == '02'">{{ row.xmmc }}</span>
                      <span v-else
                        ><el-tag type="danger">折扣</el-tag>{{ row.xmmc }}</span
                      >
                    </template>
                    <template #default="{ row, rowIndex, $rowIndex }">
                      <span v-if="row.fphxz == '00' || row.fphxz == '02'">{{
                        row.xmmc
                      }}</span>
                      <span v-else
                        ><el-tag type="danger">折扣</el-tag>{{ row.xmmc }}</span
                      >
                    </template>
                  </vxe-column>
                  <vxe-column
                    min-width="120"
                    field="ggxh"
                    title="规格型号"
                    :edit-render="{}"
                  >
                    <template #edit="{ row, rowIndex, $rowIndex }">
                      <vxe-input
                        :disabled="
                          form.tdys == '03' ||
                          form.tdys == '05' ||
                          form.tdys == '06'
                        "
                        v-model="row.ggxh"
                        type="text"
                        v-if="row.fphxz == '00'"
                      ></vxe-input>
                      <span v-else>{{ row.ggxh }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column
                    min-width="80"
                    field="dw"
                    title="单位"
                    :edit-render="{}"
                  >
                    <template #edit="{ row, rowIndex, $rowIndex }">
                      <vxe-input
                        :disabled="
                          form.tdys == '03' ||
                          form.tdys == '05' ||
                          form.tdys == '06'
                        "
                        v-model="row.dw"
                        type="text"
                        v-if="row.fphxz == '00'"
                      ></vxe-input>
                      <span v-else>{{ row.dw }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column
                    min-width="80"
                    field="sl"
                    title="数量"
                    :edit-render="{}"
                  >
                    <template #edit="{ row, rowIndex, $rowIndex }">
                      <vxe-input
                        :disabled="form.tdys == '03'"
                        v-model="row.sl"
                        type="text"
                        @blur="calcGoodsPrice(row, $rowIndex, 'sl')"
                        v-if="row.fphxz == '00'"
                      ></vxe-input>
                      <span v-else>{{ row.sl }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column
                    min-width="130"
                    field="dj"
                    :title="form.sfhs == 'Y' ? '单价(含税)' : '单价(不含税)'"
                    :edit-render="{}"
                  >
                    <template #edit="{ row, rowIndex, $rowIndex }">
                      <vxe-input
                        :disabled="!isBlank(form.cezslxDm) || form.tdys == '03'"
                        v-model="row.dj"
                        type="text"
                        @blur="calcGoodsPrice(row, $rowIndex, 'dj')"
                        v-if="row.fphxz == '00'"
                      ></vxe-input>
                      <span v-else>{{ row.dj }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column
                    min-width="130"
                    field="je"
                    :title="form.sfhs == 'Y' ? '金额(含税)' : '金额(不含税)'"
                    :edit-render="{}"
                  >
                    <template #edit="{ row, rowIndex, $rowIndex }">
                      <template v-if="row.fphxz == '00'">
                        <vxe-input
                          v-if="!isBlank(form.cezslxDm)"
                          readonly
                          v-model="row.je"
                          type="text"
                          @click="showCezsDlg"
                        ></vxe-input>
                        <vxe-input
                          v-else
                          v-model="row.je"
                          type="text"
                          @blur="calcGoodsPrice(row, $rowIndex, 'je')"
                        ></vxe-input>
                      </template>
                      <span v-else>{{ row.je }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column min-width="120" field="slv" title="税率/征收率">
                    <template #default="{ row, rowIndex, $rowIndex }">
                      {{ getTaxDesc(row) }}
                      <!-- <vxe-select :transfer="true" v-model="row.slv" placeholder="请选择" @change="calcGoodsPrice(row, $rowIndex,'slv')" v-if="row.fphxz=='00'">
                        <vxe-option v-for="(item, index) in taxRates" :key="index" :value="item.slzsl" :label="getTaxDesc(item)"></vxe-option>
                      </vxe-select>
                      <span v-else>{{row.slv}}</span> -->
                    </template>
                  </vxe-column>
                  <vxe-column
                    min-width="80"
                    field="se"
                    title="税额"
                  ></vxe-column>
                </vxe-table>
              </div>
            </div>
            <div class="invoice-form-price">
              <div class="price-left">
                价税合计（大写）:<span style="margin-left: 20px; color: #000">{{
                  goodsJshjUppercase
                }}</span>
              </div>
              <div class="price-right">
                （小写）:￥<span style="margin-left: 20px; color: #000">{{
                  goodsJshjLowercase
                }}</span>
              </div>
            </div>
            <!-- 特定要素-->
            <div
              v-if="form.tdys == '03'"
              class="invoice-form-remark"
              style="border-bottom: 2px solid #a15f3b"
            >
              <!--建筑服务-->
              <div class="remark-title">
                <div class="remark-left">特定信息-建筑服务</div>
              </div>
              <el-form-item label="土地增值税项目编号" prop="tdzzsxmbh">
                <el-input
                  v-model="form.tdzzsxmbh"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="建筑服务发生地" prop="jzfwfsd">
                <el-cascader
                  style="width: 100%"
                  v-model="form.jzfwfsd"
                  :options="districts"
                  filterable
                  :props="{ value: 'txt', label: 'txt' }"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址" prop="xxdz">
                <el-input
                  v-model="form.xxdz"
                  placeholder="请输入详细地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="建筑项目名称" prop="jzxmmc">
                <el-input v-model="form.jzxmmc" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="跨地（市）标志" prop="kdsbz">
                <el-select
                  style="width: 100%"
                  class="form-inline-input"
                  v-model="form.kdsbz"
                >
                  <el-option key="Y" label="是" value="Y"></el-option>
                  <el-option key="N" label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div
              v-else-if="form.tdys == '05'"
              class="invoice-form-remark"
              style="border-bottom: 2px solid #a15f3b"
            >
              <!--不动产销售-->
              <div class="remark-title">
                <div class="remark-left">特定信息-不动产销售</div>
              </div>
              <el-form-item
                label="不动产单元代码/网签合同备案编号"
                prop="bdcdwdm"
              >
                <vxe-input
                  size="small"
                  v-model="form.bdcdwdm"
                  style="width: 100%"
                >
                  <template #suffix>
                    <i
                      style="cursor: pointer; color: #409eff; font-size: 16px"
                      class="vxe-icon-menu"
                      @click="showHouseDlg"
                    ></i>
                  </template>
                </vxe-input>
              </el-form-item>
              <el-form-item label="不动产地址" prop="bdcdz">
                <el-cascader
                  style="width: 100%"
                  v-model="form.bdcdz"
                  :options="districts"
                  filterable
                  :props="{ value: 'txt', label: 'txt' }"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址" prop="xxdz">
                <el-input
                  v-model="form.xxdz"
                  placeholder="请输入详细地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="跨地（市）标志" prop="kdsbz">
                <el-select
                  style="width: 100%"
                  class="form-inline-input"
                  v-model="form.kdsbz"
                >
                  <el-option key="Y" label="是" value="Y"></el-option>
                  <el-option key="N" label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="土地增值税项目编号" prop="tdzzsxmbh">
                <el-input
                  v-model="form.tdzzsxmbh"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="核定计税价格" prop="hdjsjg">
                <el-input v-model="form.hdjsjg" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="实际成交含税金额" prop="sjcjhsje">
                <el-input
                  v-model="form.sjcjhsje"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="房屋产权证书/不动产权证号" prop="cqzsbh">
                <el-input v-model="form.cqzsbh" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="面积单位" prop="mjdw">
                <el-select class="form-inline-input" v-model="form.mjdw">
                  <el-option key="1" label="平方米" value="平方米"></el-option>
                  <el-option key="2" label="平方千米" value="平方千米"></el-option>
                  <!-- <el-option key="3" label="孔公里" value="孔公里"></el-option> -->
                  <el-option key="4" label="公顷" value="公顷"></el-option>
                  <el-option key="5" label="亩" value="亩"></el-option>
                  <el-option key="6" label="h㎡" value="h㎡"></el-option>
                  <el-option key="7" label="k㎡" value="k㎡"></el-option>
                  <el-option key="8" label="㎡" value="㎡"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div
              v-else-if="form.tdys == '06'"
              class="invoice-form-remark"
              style="border-bottom: 2px solid #a15f3b"
            >
              <!--不动产经营租赁服务-->
              <div class="remark-title">
                <div class="remark-left">特定信息-不动产经营租赁服务</div>
              </div>
              <el-form-item label="不动产地址" prop="bdcdz">
                <el-cascader
                  style="width: 100%"
                  v-model="form.bdcdz"
                  :options="districts"
                  filterable
                  :props="{ value: 'txt', label: 'txt' }"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址" prop="xxdz">
                <el-input
                  v-model="form.xxdz"
                  placeholder="请输入详细地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="租赁期起止" prop="zlqqzList">
                <el-date-picker
                  v-model="form.zlqqzList"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="跨地（市）标志" prop="kdsbz">
                <el-select
                  style="width: 100%"
                  class="form-inline-input"
                  v-model="form.kdsbz"
                >
                  <el-option key="Y" label="是" value="Y"></el-option>
                  <el-option key="N" label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房屋产权证书/不动产权证号" prop="cqzsbh">
                <el-input
                  v-model="form.cqzsbh"
                  placeholder='请输入证书编号，若没有证书填写"无"'
                ></el-input>
              </el-form-item>
              <el-form-item label="面积单位" prop="mjdw">
                <el-select class="form-inline-input" v-model="form.mjdw">
                  <el-option
                    key="1"
                    label="平方千米"
                    value="平方千米"
                  ></el-option>
                  <el-option key="2" label="平方米" value="平方米"></el-option>
                  <el-option key="3" label="孔公里" value="孔公里"></el-option>
                  <el-option key="4" label="公顷" value="公顷"></el-option>
                  <el-option key="5" label="亩" value="亩"></el-option>
                  <el-option key="6" label="hm²" value="hm²"></el-option>
                  <el-option key="7" label="km²" value="km²"></el-option>
                  <el-option key="8" label="㎡" value="㎡"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- 特定要素-->
            <!-- 备注信息-->
            <div class="invoice-form-remark">
              <div class="remark-title">
                <div class="remark-left">备注信息</div>
                <!--<span v-if="!moreRemark" class="el-dropdown-link" @click="moreRemark=!moreRemark">
                  查看更多<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                </span>
                <span v-else="moreRemark" class="el-dropdown-link" @click="moreRemark=!moreRemark">
                  收起更多<i class="el-icon-arrow-up el-icon&#45;&#45;right"></i>
                </span>-->
              </div>
              <el-form-item label="备注" prop="bz" style="width: 80%">
                <el-input
                  type="textarea"
                  v-model="form.bz"
                  placeholder="如开票人对备注文本长度等有特殊需求，应通过自定义附加要素录入"
                ></el-input>
              </el-form-item>
              <el-form-item label="开票人" prop="kpr">
                <el-input v-model="form.kpr"></el-input>
              </el-form-item>
              <!--<el-form-item label="复核人" prop="fhr">
                 <el-input v-model="form.fhr"></el-input>
               </el-form-item>
               <br/>
              <el-form-item v-if="moreRemark" label="选择场景模板" prop="xzcjmb">
                 <el-input v-model="form.fhr"></el-input>
               </el-form-item>
               <br/>
               <el-form-item v-if="moreRemark" label="添加附加内容" style="width: 80%;" prop="tjfjnr">
                 <el-input v-model="form.tjfjnr"></el-input>
               </el-form-item>-->
            </div>
            <!-- 备注信息-->

            <!-- 经办人信息-->
            <!--<div class="invoice-form-remark" style="border-bottom: 0;">
              <div class="remark-title">
                <div class="remark-left">经办人信息</div>
                <span v-if="!moreAgent" class="el-dropdown-link" @click="moreAgent=!moreAgent">
                  查看更多<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                </span>
                <span v-else="moreAgent" class="el-dropdown-link" @click="moreAgent=!moreAgent">
                  收起更多<i class="el-icon-arrow-up el-icon&#45;&#45;right"></i>
                </span>
              </div>
              <el-form-item v-if="moreAgent" label="姓名" prop="gmfjbr">
                <el-input v-model="form.gmfjbr"></el-input>
              </el-form-item>
              <el-form-item v-if="moreAgent" label="国籍（地区）" prop="gj">
                <el-input v-model="form.gj"></el-input>
              </el-form-item>
             <el-form-item v-if="moreAgent" label="证件类型" prop="zjlx">
                <el-input v-model="form.zjlx"></el-input>
             </el-form-item>
              <el-form-item v-if="moreAgent" label="证件号码" prop="jbrsfzjhm">
                <el-input v-model="form.jbrsfzjhm"></el-input>
              </el-form-item>
              <el-form-item v-if="moreAgent" label="自然人纳税人识别号" prop="nsrsbh">
                <el-input v-model="form.nsrsbh"></el-input>
              </el-form-item>
            </div>-->
          </div>
          <!-- 开票人信息-->

          <!-- 经办人信息-->
          <!-- 经办人信息-->
        </div>
      </el-form>
    </div>
    <div class="invoice-tools">
      <el-button @click="saveInvoice(0)">保存</el-button>
      <el-button @click="preview">预览</el-button>
      <el-button type="success" @click="saveInvoice(1)">开票</el-button>
    </div>

    <!--选择购方信息 -->
    <el-dialog
      title="客户档案"
      :visible.sync="buyerVisible"
      width="80%"
      height="600px"
    >
      <!--客户档案-->
      <div style="width: 73%">
        <vxe-toolbar ref="buyerToolbar" custom>
          <template #buttons>
            <vxe-input
              @keyup.enter.native="getCustomerPage"
              @clear="getCustomerPage"
              style="width: 200px"
              v-model="customerQuery.gmfMc"
              placeholder="请输入客户名称/纳税人识别号/标签"
              clearable
            >
              <template #prefix>
                <i
                  style="cursor: pointer; color: #409eff; font-size: 16px"
                  class="vxe-icon-search"
                  @click="getCustomerPage"
                ></i>
              </template>
            </vxe-input>
          </template>
        </vxe-toolbar>
        <vxe-table
          size="mini"
          border
          stripe
          ref="buyerTable"
          height="500"
          @cell-click="buyerClickEvent"
          id="buyerTable"
          :custom-config="{ storage: true }"
          :data="customerData"
        >
          <vxe-column type="radio" min-width="40"></vxe-column>
          <vxe-column
            field="gmfMc"
            min-width="150"
            title="客户名称"
          ></vxe-column>
          <vxe-column
            field="gmfNsrsbh"
            min-width="120"
            title="纳税人识别号"
          ></vxe-column>
          <vxe-column
            field="dzdh"
            min-width="200"
            title="地址、电话"
          ></vxe-column>
          <vxe-column
            field="revphone"
            min-width="100"
            title="收票手机"
          ></vxe-column>
          <vxe-column
            field="revemail"
            min-width="100"
            title="收票邮箱"
          ></vxe-column>
        </vxe-table>
        <vxe-pager
          size="mini"
          :current-page="customerPage.currentPage"
          :page-size="customerPage.pageSize"
          :total="customerPage.totalResult"
          :layouts="[
            'PrevPage',
            'JumpNumber',
            'NextPage',
            'FullJump',
            'Sizes',
            'Total',
          ]"
          @page-change="handleCustomerPageChange"
        >
        </vxe-pager>
      </div>
      <!--常用客户-->
      <div
        class="frenquent-customer"
        :style="frequentExpand ? 'width: 73%;' : 'width: 26%;'"
      >
        <div class="frenquent-customer-title">
          <i
            v-if="frequentExpand"
            @click="expandFrequent(1)"
            class="vxe-icon-arrow-right arrow"
          ></i
          ><i
            v-else
            @click="expandFrequent(0)"
            class="vxe-icon-arrow-left arrow"
          ></i
          >常用客户
        </div>
        <vxe-toolbar style="padding-top: 20px" ref="frequentToolbar" custom>
          <template #buttons>
            <vxe-input
              @keyup.enter.native="getFrequentCustomerPage"
              @clear="getFrequentCustomerPage"
              style="width: 200px"
              v-model="frequentCustomerQuery.gmfMc"
              placeholder="请输入客户名称/纳税人识别号/标签"
              clearable
            >
              <template #prefix>
                <i
                  style="cursor: pointer; color: #409eff; font-size: 16px"
                  class="vxe-icon-search"
                  @click="getFrequentCustomerPage"
                ></i>
              </template>
            </vxe-input>
          </template>
        </vxe-toolbar>
        <vxe-table
          size="mini"
          border
          stripe
          ref="frequentTable"
          height="500"
          id="frequentTable"
          @cell-click="frequentClickEvent"
          :custom-config="{ storage: true }"
          :data="frequentCustomerData"
        >
          <vxe-column type="radio" min-width="40"></vxe-column>
          <vxe-column
            field="gmfMc"
            min-width="150"
            title="客户名称"
          ></vxe-column>
          <vxe-column
            field="gmfNsrsbh"
            min-width="120"
            title="纳税人识别号"
          ></vxe-column>
          <vxe-column
            field="dzdh"
            min-width="200"
            title="地址、电话"
          ></vxe-column>
          <vxe-column
            field="revphone"
            min-width="100"
            title="收票手机"
          ></vxe-column>
          <vxe-column
            field="revemail"
            min-width="100"
            title="收票邮箱"
          ></vxe-column>
        </vxe-table>
        <vxe-pager
          size="mini"
          :current-page="frequentCustomerPage.currentPage"
          :page-size="frequentCustomerPage.pageSize"
          :total="frequentCustomerPage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes']"
          @page-change="handleFrequentCustomerPageChange"
        >
        </vxe-pager>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="closeCustomerDlg">关闭</el-button>
        <el-button type="success" size="mini" @click="addBuyerToCustomer"
          >添加至发票</el-button
        >
      </div>
    </el-dialog>
    <!--选择商品-->
    <ProductProfileModal
      :orgid="form.orgid"
      :dialogVisible="goodsDlgVisible"
      @closeDialog="closeGoodsDlg"
      @handleSubmitProduct="handleSubmitProduct"
    ></ProductProfileModal>
    <!-- 选择房源信息-->
    <HouseInfoDlg
      :dialogVisible="houseDlgVisible"
      @handleClose="closeHouseDlg"
    ></HouseInfoDlg>

    <!--差额征税-->
    <el-drawer
      ref="cedrawer"
      title="差额录入"
      size="40%"
      :visible.sync="cszsDlgVisible"
      direction="rtl"
    >
      <el-form
        class="drawer-form"
        ref="ceForm"
        :inline="true"
        :model="ceForm"
        :rules="ceRules"
        size="mini"
        label-position="top"
      >
        <el-col :span="12">
          <el-form-item label="含税销售额" prop="hsxse">
            <el-input
              v-model="ceForm.hsxse"
              placeholder="请输入"
              @blur="ceil(ceForm, 'hsxse', 2)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣除额" prop="kcje">
            <el-input disabled v-model="ceForm.kcje"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-form
        class="drawer-form"
        ref="ceItemForm"
        :inline="true"
        :model="ceItemForm"
        :rules="ceItemRules"
        size="mini"
        label-position="top"
      >
        <el-form-item label="录入方式" prop="lrfs">
          <el-radio-group v-model="ceItemForm.lrfs">
            <el-radio :label="1">手工录入</el-radio>
            <!--<el-radio :label="2">勾选录入</el-radio>
            <el-radio :label="3">模板录入</el-radio>-->
          </el-radio-group>
        </el-form-item>

        <el-container v-if="ceItemForm.lrfs == 1">
          <el-main>
            <el-col :span="8">
              <el-form-item style="width: 100%" label="凭证类型" prop="pzlx">
                <el-select
                  class="form-inline-input"
                  v-model="ceItemForm.pzlx"
                  size="mini"
                  clearable
                >
                  <el-option
                    v-for="item in pzlxOptions"
                    :key="item.key"
                    :value="item.value"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数电票号码" prop="sdphm">
                <el-input v-model="ceItemForm.sdphm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票代码" prop="fpdm">
                <el-input v-model="ceItemForm.fpdm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票号码" prop="fphm">
                <el-input
                  v-model="ceItemForm.fphm"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="凭证号码" prop="pzhm">
                <el-input v-model="ceItemForm.pzhm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开具日期" prop="kjrq">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  v-model="ceItemForm.kjrq"
                  :default-value="new Date()"
                  placeholder="请选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="凭证合计金额" prop="hjje">
                <el-input
                  type="number"
                  v-model="ceItemForm.hjje"
                  placeholder="请输入"
                  @blur="ceil(ceItemForm, 'hjje', 2)"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="本次扣除金额" prop="kcje">
                <el-input
                  type="number"
                  v-model="ceItemForm.kcje"
                  placeholder="请输入"
                  @blur="ceil(ceItemForm, 'kcje', 2)"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="bz">
                <el-input v-model="ceItemForm.bz"></el-input>
              </el-form-item>
            </el-col>
          </el-main>
          <el-footer>
            <el-button size="mini" @click="clearCeItemForm">清除</el-button>
            <el-button type="success" size="mini" @click="submitCeItemForm"
              >保存并继续</el-button
            >
          </el-footer>
        </el-container>

        <vxe-table
          ref="cetable"
          height="250"
          border
          stripe
          show-header-overflow
          show-overflow
          :row-config="{ isHover: true }"
          :data="ceTableData"
        >
          <vxe-column type="seq" title="序号" width="50"></vxe-column>
          <vxe-column
            field="hjje"
            title="合计金额"
            width="80"
            align="right"
          ></vxe-column>
          <vxe-column
            field="kcje"
            title="扣除金额"
            width="80"
            align="right"
          ></vxe-column>
          <vxe-column field="pzlx" title="凭证类型" width="100" align="center">
            <template slot-scope="scope">
              <slot name="myscope" :data="scope.row">{{
                getArrayName(pzlxOptions, scope.row.pzlx)
              }}</slot>
            </template>
          </vxe-column>
          <vxe-column
            field="sdphm"
            title="数电票号码"
            width="200"
            align="center"
          ></vxe-column>
          <vxe-column
            field="fpdm"
            title="发票代码"
            width="150"
            align="center"
          ></vxe-column>
          <vxe-column
            field="fphm"
            title="发票号码"
            width="150"
            align="center"
          ></vxe-column>
          <vxe-column
            field="pzhm"
            title="凭证号码"
            width="150"
            align="center"
          ></vxe-column>
          <vxe-column
            field="kjrq"
            title="开具日期"
            width="100"
            align="center"
          ></vxe-column>
          <vxe-column
            field="bz"
            title="备注"
            width="150"
            align="center"
          ></vxe-column>
          <vxe-column field="lrfs" title="来源" width="80" align="center">
            <template slot-scope="scope">
              <slot name="myscope" :data="scope.row">{{
                scope.row.lrfs == "2"
                  ? "勾选录入"
                  : scope.row.lrfs == "3"
                  ? "模板录入"
                  : "手工录入"
              }}</slot>
            </template>
          </vxe-column>
          <vxe-column field="opt" title="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <slot name="myscope" :data="scope.row"
                ><el-button type="text" @click="removeCeItem(scope.row)"
                  >删除</el-button
                ></slot
              >
            </template>
          </vxe-column>
        </vxe-table>

        <div class="ce-table-footer">
          <span style="margin-right: 30px"
            >本次扣除金额总计：{{ ceForm.kcje }}</span
          ><span>凭证合计金额总计：{{ ceForm.hjje }}</span>
        </div>
        <div class="demo-drawer__footer" style="text-align: right">
          <el-button @click="$refs.cedrawer.closeDrawer()">取 消</el-button>
          <el-button type="success" @click="submitCeForm">确定</el-button>
        </div>
      </el-form>
    </el-drawer>

    <el-dialog
      title="添加折扣"
      :visible.sync="addDiscountVisible"
      width="500px"
      height="500px"
    >
      <div class="goods-amount">
        <div>
          {{ form.sfhs == "Y" ? "商品金额(含税)" : "商品金额(不含税)" }}
        </div>
        <div class="amount">{{ currentDiscountRow.je }}</div>
      </div>
      <el-form
        ref="zkForm"
        :inline="true"
        :model="zkForm"
        :rules="zkFormRules"
        size="mini"
        label-position="top"
      >
        <el-col :span="24">
          <el-form-item
            :label="form.sfhs == 'Y' ? '折扣金额(含税)' : '折扣金额(不含税)'"
            prop="zkje"
          >
            <el-input
              type="number"
              v-model="zkForm.zkje"
              @blur="ceil(zkForm, 'zkje', 2)"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer">
        <el-button size="mini" @click="addDiscountVisible = !addDiscountVisible"
          >取消</el-button
        >
        <el-button type="success" size="mini" @click="addDiscount"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { numToCny } from "@/utils/tool";
import Step from "@/components/Step.vue";
import HouseInfoDlg from "./HouseInfoDlg.vue";
import ProductProfileModal from "@/components/ProductProfileModal/Index.vue";
import { dynamicUrlMap } from "@/config/constant.js";
import { Calc } from '@/utils/calc'
export default {
  name: "BlueInvoiceEditForm",
  components: {
    Step,
    HouseInfoDlg,
    ProductProfileModal,
  },
  data() {
    return {
      api: require("./Api"),
      invisible: false,
      kysyed: "", //可用授信额度
      moreSellerInfo: false,
      //特定要素
      tdysOptions: [
        { name: "建筑服务", value: "03", key: "jzfw" },
        { name: "不动产销售", value: "05", key: "bdcxs" },
        { name: "不动产经营租赁服务", value: "06", key: "bdczl" },
      ],
      //差额征税
      cezslxDmOptions: [
        { name: "差额征税-全额开票", value: "01", key: "qekp" },
        { name: "差额征税-差额开票", value: "02", key: "cekp" },
      ],
      cszsDlgVisible: false,
      ceForm: {
        kcje: "0.00",
        hjje: "0.00",
        hsxse: "",
      },
      ceRules: {
        hsxse: [{ required: true, message: "内容必填", trigger: "blur" }],
        kcje: [{ required: true, message: "内容必填", trigger: "blur" }],
      },
      ceItemForm: {
        lrfs: "",
      },
      ceItemRules: {
        lrfs: [{ required: true, message: "内容必填", trigger: "blur" }],
        pzlx: [{ required: true, message: "内容必填", trigger: "blur" }],
        sdphm: [
          { min: 20, max: 20, message: "需要填写20位号码", trigger: "blur" },
        ],
        fpdm: [
          { min: 10, max: 12, message: "需要填写10/12位代码", trigger: "blur" },
        ],
        fphm: [{ min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" }],
        hjje: [{ required: true, message: "内容必填", trigger: "blur" }],
        kcje: [{ required: true, message: "内容必填", trigger: "blur" }],
      },
      ceTableData: [],
      pzlxOptions: [
        { name: "数电票", value: "1", key: "sdp" },
        { name: "增值税专用发票", value: "2", key: "zzszyfp" },
        { name: "增值税普通发票", value: "3", key: "zzsptfp" },
        { name: "营业税发票", value: "4", key: "yysfp" },
        { name: "财政票据", value: "5", key: "czpj" },
        { name: "法院裁决书", value: "6", key: "fycjs" },
        { name: "契税完税凭证", value: "7", key: "qswspz" },
        { name: "其他发票类", value: "8", key: "qtfpl" },
        { name: "其他扣除凭证", value: "9", key: "qtkcpz" },
      ],
      //减按征收
      jazsOptions: [
        { name: "销售自己使用过的固定资产", value: "01", key: "gdzc" },
        { name: "住房租赁", value: "02", key: "zfzl" },
      ],
      form: {
        fppz: "", //发票票种，01：数字化电子专；02：数字化电子普
        gmfzrrbz: "", //购买方自然人标志，Y:是
        tdys: "", //特定要素
        cezslxDm: "", //差额征税类型代码，空：非差额发票；01：全额开票；02：差额开票
        sfhs: "N",
      },
      rules: {
        gmfmc: [{ required: true, message: "内容必填", trigger: "blur" }],
        jzfwfsd: [{ required: true, message: "内容必填", trigger: "blur" }],
        bdcdz: [{ required: true, message: "内容必填", trigger: "blur" }],
        jzxmmc: [{ required: true, message: "内容必填", trigger: "blur" }],
        kdsbz: [{ required: true, message: "内容必填", trigger: "blur" }],
        mjdw: [{ required: true, message: "内容必填", trigger: "blur" }],
        zlqqzList: [{ required: true, message: "内容必填", trigger: "blur" }],
        cqzsbh: [{ required: true, message: "内容必填", trigger: "blur" }],
      },
      //客户列表
      buyerVisible: false,
      customerData: [],
      customerPage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
      },
      customerQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      //常用客户
      frequentCustomerData: [],
      frequentCustomerPage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
      },
      frequentCustomerQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      frequentExpand: false,
      //商品列表
      addTipsVisible: false,
      tipsContent: "",
      //折扣行
      discountVisible: false,
      discountContent: "",
      // 折扣弹窗
      addDiscountVisible: false,
      currentDiscountRow: {},
      currentDiscountIndex: 0,
      zkForm: {},
      zkFormRules: {
        zkje: [{ required: true, message: "内容必填" }],
      },
      //商品table编辑校验
      validRules: {
        xmmc: [{ required: true, message: "内容必填" }],
        sl: [{ type: "number", message: "请填写正确数字" }],
        je: [
          { required: true, message: "内容必填" },
          { type: "number", message: "请填写正确数字" },
        ],
        slv: [
          { required: true, message: "内容必填" },
          { type: "number", message: "请填写正确数字" },
        ],
      },
      sumJE: "",
      sumSE: "",
      goodsJshjLowercase: "",
      goodsJshjUppercase: "",
      goodsDlgVisible: false,
      currentGoodsIndex: 0,
      taxRates: [],
      mergeFooterItems: [{ row: 0, col: 1, rowspan: 1, colspan: 3 }],
      //
      districts: [],
      //备注
      moreRemark: false,
      //经办人
      moreAgent: false,

      //房源信息弹窗
      houseDlgVisible: false,
    };
  },
  watch: {
    sumJE(val) {
      const jshj = (
        parseFloat(this.sumJE || 0) + parseFloat(this.sumSE || 0)
      ).toFixed(2);
      this.goodsJshjLowercase = jshj;
      this.form.jshj = jshj;
      this.form.hjse = this.sumSE;
      this.form.hjje = (
        parseFloat(this.form.jshj || 0) - parseFloat(this.form.hjse || 0)
      ).toFixed(2);
    },
    sumSE(val) {
      const jshj = (
        parseFloat(this.sumJE || 0) + parseFloat(this.sumSE || 0)
      ).toFixed(2);
      this.goodsJshjLowercase = jshj;
      this.form.jshj = jshj;
      this.form.hjse = this.sumSE;
    },
    goodsJshjLowercase(val) {
      this.goodsJshjUppercase = numToCny(val);
    },
    "form.fppz"(newVal, oldVal) {
      if (newVal == "01") {
        this.rules.gmfnsrsbh = [
          { required: true, message: "内容必填", trigger: "blur" },
        ];
      } else {
        delete this.rules.gmfnsrsbh;
      }
    },
    "form.tdys"(newVal, oldVal) {
      if (newVal == "06") {
        this.rules.cqzsbh = [
          { required: true, message: "内容必填", trigger: "blur" },
        ];
        this.rules.xxdz = [
          { required: true, message: "内容必填", trigger: "blur" },
          { validator: this.validateXxdz, trigger: "blur" },
        ];
        this.validRules.sl = [
          { required: true, message: "内容必填" },
          { type: "number", message: "请填写正确数字" },
        ];
      } else {
        delete this.rules.cqzsbh;
        if (newVal == "05") {
          this.rules.xxdz = [
            { required: true, message: "内容必填", trigger: "blur" },
            { validator: this.validateXxdz, trigger: "blur" },
          ];
          this.validRules.sl = [
            { required: true, message: "内容必填" },
            { type: "number", message: "请填写正确数字" },
          ];
        } else {
          delete this.rules.xxdz;
          this.validRules.sl = [{ type: "number", message: "请填写正确数字" }];
        }
      }
    },
    "form.gmfzrrbz"(newVal, oldVal) {
      if (newVal == "Y") {
        this.$confirm(
          "<div>除特定业务外的普通发票:</div>" +
            "<div>1、如受票方（发票抬头）为自然人，请根据实际需要提供姓名或姓。如您的姓名为张某某。可在名称栏次填写：张某某、张先生或张女士；</div>" +
            "<div>2、如受票方（发票抬头）为自然人，并要求能将发票归集在个人票夹中展示，需要提供姓名及身份证号（自然人纳税人识别号）；</div>" +
            "<div>3、如受票方（发票抬头）为个体工商户，需提供社会统一信用代码或纳税人识别号，请勿勾选此标识。</div>",
          `请确认`,
          {
            showCancelButton: false,
            dangerouslyUseHTMLString: true,
            confirmButtonText: "我知道了",
            type: "info",
          }
        )
          .then(() => {})
          .catch(() => {});
      }
    },
    "ceItemForm.pzlx"(newVal, oldVal) {
      switch (newVal) {
        case "1":
          delete this.ceItemRules.fpdm;
          delete this.ceItemRules.fphm;
          delete this.ceItemRules.bz;
          this.$set(this.ceItemRules, "sdphm", [
            { required: true, message: "内容必填", trigger: "blur" },
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "kjrq", [
            { required: true, message: "内容必填", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "fpdm", [
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        case "2":
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.bz;
          this.$set(this.ceItemRules, "fpdm", [
            { required: true, message: "内容必填", trigger: "blur" },
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { required: true, message: "内容必填", trigger: "blur" },
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "kjrq", [
            { required: true, message: "内容必填", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        case "3":
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.bz;
          this.$set(this.ceItemRules, "fpdm", [
            { required: true, message: "内容必填", trigger: "blur" },
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { required: true, message: "内容必填", trigger: "blur" },
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "kjrq", [
            { required: true, message: "内容必填", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        case "4":
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.bz;
          this.$set(this.ceItemRules, "fpdm", [
            { required: true, message: "内容必填", trigger: "blur" },
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { required: true, message: "内容必填", trigger: "blur" },
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "kjrq", [
            { required: true, message: "内容必填", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        case "5":
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.fpdm;
          delete this.ceItemRules.fphm;
          delete this.ceItemRules.kjrq;
          delete this.ceItemRules.bz;
          this.$set(this.ceItemRules, "fpdm", [
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        case "6":
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.fpdm;
          delete this.ceItemRules.fphm;
          delete this.ceItemRules.kjrq;
          delete this.ceItemRules.bz;
          this.$set(this.ceItemRules, "fpdm", [
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        case "7":
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.fpdm;
          delete this.ceItemRules.fphm;
          delete this.ceItemRules.kjrq;
          delete this.ceItemRules.bz;
          this.$set(this.ceItemRules, "fpdm", [
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        case "8":
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.fpdm;
          delete this.ceItemRules.fphm;
          delete this.ceItemRules.kjrq;
          this.$set(this.ceItemRules, "bz", [
            { required: true, message: "内容必填", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "fpdm", [
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        case "9":
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.fpdm;
          delete this.ceItemRules.fphm;
          delete this.ceItemRules.kjrq;
          this.$set(this.ceItemRules, "bz", [
            { required: true, message: "内容必填", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "fpdm", [
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
          break;
        default:
          delete this.ceItemRules.sdphm;
          delete this.ceItemRules.fpdm;
          delete this.ceItemRules.fphm;
          delete this.ceItemRules.kjrq;
          delete this.ceItemRules.bz;
          this.$set(this.ceItemRules, "fpdm", [
            {
              min: 10,
              max: 12,
              message: "需要填写10/12位代码",
              trigger: "blur",
            },
          ]);
          this.$set(this.ceItemRules, "fphm", [
            { min: 8, max: 8, message: "需要填写8位号码", trigger: "blur" },
          ]);
          this.$set(this.ceItemRules, "sdphm", [
            { max: 20, min: 20, message: "需要填写20位号码", trigger: "blur" },
          ]);
          this.$refs.ceItemForm.clearValidate();
      }
    },
    ceTableData(array) {
      let hjje = 0.0;
      let kcje = 0.0;
      array.forEach((ceItem) => {
        hjje = Calc.Add(hjje, ceItem.hjje);
        kcje = Calc.Add(kcje, ceItem.kcje);
      });
      this.$set(this.ceForm, "hjje", hjje);
      this.$set(this.ceForm, "kcje", kcje);
    },
  },
  methods: {
    validateXxdz(rule, value, callback) {
      if (
        value.indexOf("街") == -1 &&
        value.indexOf("路") == -1 &&
        value.indexOf("村") == -1 &&
        value.indexOf("乡") == -1 &&
        value.indexOf("镇") == -1 &&
        value.indexOf("道") == -1 &&
        value.indexOf("巷") == -1 &&
        value.indexOf("号") == -1
      ) {
        callback(
          new Error("必须包含“街、路、村、乡、镇、道、巷、号”等关键词之一")
        );
      } else {
        callback();
      }
    },
    /**
     * 清空重填
     */
    clearItems() {
      const $table = this.$refs.xTable;
      $table.remove();
      const record = { fphxz: "00" };
      $table.insertAt(record, -1).then(({ row }) => {
        $table.setEditCell(row, "xmmc");
      });
    },
    clearAll() {
      this.$refs.form.resetFields();
      this.$refs.xTable.remove();
      if (this.$refs.cetable) {
        this.$refs.cetable.remove();
      }
      if (this.$refs.ceForm) {
        this.$refs.ceForm.resetFields();
      }
      this.getSellerInfoById();
    },
    /**
     * 转化税率格式
     */
    getTaxDesc(row) {
      return row.slv == null
        ? ""
        : row.lslbs == 2 || (row.taxclasscode || "").substring(0, 1) == "6"
        ? "不征税"
        : row.lslbs == 1
        ? "免税"
        : row.slv * 100 + "%";
    },
    async getTaxRates() {
      const { code = "", data = {} } = await this.api.getTaxRates();
      if (code === "0") {
        const { slzslList = [] } = data;
        this.taxRates = slzslList;
      }
    },
    /**
     * 是否含税切换
     */
    toggleSfhs($event) {
      let xTable = this.$refs.xTable;
      let tableData = xTable.getTableData().tableData;
      // 计算含税
      if ($event == 1) {
        tableData.forEach((e) => {
          // 金额 = 金额 + 税额
          e.bhsje = e.je;
          e.je = Calc.Add(e.je || 0, e.se || 0) || "";
          if (e.sl != 0 && e.sl) {
            e.dj = Calc.Div(e.je || 0, e.sl || 0) || "";
          }
        });
      } else {
        // 计算不含税
        tableData.forEach((e) => {
          e.je = Calc.Sub(e.je || 0, e.se || 0) || "";
          e.bhsje = e.je;
          if (e.sl != 0 && e.sl) {
            e.dj = Calc.Div(e.je || 0, e.sl || 0) || "";
          }
        });
      }
      xTable.updateFooter();
    },
    /**
     * 计算税额
     */
    getSe(row) {
      let se = "";
      // 如果是不含税的, 税额 = 税率 * 金额
      if (this.form.sfhs == 0 || this.form.sfhs == "N") {
        se = Calc.Mul(row.je || 0, row.slv || 0, 2);
      } else {
        // 如果是含税的, 税额 =  含税金额 - ( 含税金额 / ( 1 + 税率))
        se = Calc.Sub(row.je, Calc.Div(row.je || 0, (row.slv || 0) + 1, 2));
      }
      return se && se != 0 ? parseFloat(se).toFixed(2) : "0.00";
    },
    getBhsje(row) {
      // debugger;
      let bhsje = "";
      // 如果是不含税的, 税额 = 税率 * 金额
      if (this.form.sfhs == 0 || this.form.sfhs == "N") {
        bhsje = row.je;
      } else {
        // 如果是含税的, 税额 =  含税金额 - ( 含税金额 / ( 1 + 税率))
        bhsje = Calc.Div(row.je || 0, (row.slv || 0) + 1, 2);
      }
      return bhsje && bhsje != 0 ? parseFloat(bhsje).toFixed(2) : "0.00";
    },
    /**
     * 商品金额计算
     */
    calcGoodsPrice(row, rowIndex, column) {
      // column sl, dj, je, slv
      switch (column) {
        // 改变数量会影响金额、单价、税额
        case "sl":
          // 如果单价存在
          if (row.dj) {
            // 金额 = 单价 * 数量
            row.je = Calc.Mul(row.sl || 0, row.dj || 0, 2);
          } else if (row.je && row.sl != 0) {
            // 单价不存在，金额存在，数量不为0
            // 单价 = 金额 / 数量
            row.dj = Calc.Div(row.je || 0, row.sl || 0, 2);
          }
          break;
        // 改变单价, 会改变数量、金额，税额
        case "dj":
          // 如果但是金额存在，数量不存在
          if (row.je && row.dj != 0 && !row.sl) {
            // 数量 = 金额 / 单价
            row.sl = Calc.Div(row.je || 0, row.dj, 2);
          } else if (row.sl) {
            // 如果数量存在
            // 金额 = 单价 * 数量
            row.je = Calc.Mul(row.sl || 0, row.dj || 0, 2);
          }
          break;
        // 改变金额可以改变数量、单价、税额
        case "je":
          // 如果数量存在
          if (row.sl) {
            // 单价 = 金额 / 数量
            row.dj = Calc.Div(row.je || 0, row.sl || 0, 2);
          }
          // 如果单价存在，数量不存在
          if (row.dj && !row.sl) {
            // 数量 = 金额 / 单价
            row.sl = Calc.Div(row.je || 0, row.dj || 0, 2);
          }
          break;
      }
      // debugger;
      row.je = row.je ? parseFloat(row.je).toFixed(2) : "";
      row.bhsje = this.getBhsje(row);
      row.se = this.getSe(row);
      this.$refs.xTable.updateFooter();
    },
    /**
     * 选择商品
     */
    matchCb(oldItem, resultItem) {
      let xmmc = "*" + oldItem.taxclassjc + "*" + oldItem.name;
      let spfwjc = oldItem.taxclassjc;
      let ggxh = oldItem.ggxh;
      let dw = oldItem.dw;
      let sl = "";
      let dj = oldItem.dj;
      let je = "";
      let slv = oldItem.sl;
      let se = "";
      let hsje = "";
      let kce = "";
      let sphfwssflhbbm = oldItem.taxclasscode;
      let lslbs = oldItem.lslbs;
      let zzstsgl = oldItem.zzstsgl;
      let xsyhzc = oldItem.xsyhzc;

      let mxxh = this.currentGoodsIndex;
      resultItem.mxxh = mxxh + 1;
      resultItem.xmmc = oldItem.name;
      resultItem.hwhyslwfwmc = xmmc;
      resultItem.spfwjc = spfwjc;
      resultItem.ggxh = ggxh;
      resultItem.dw = dw;
      resultItem.sl = sl;
      resultItem.dj = dj;
      resultItem.je = je;
      resultItem.slv = slv;
      resultItem.se = se;
      resultItem.hsje = hsje;
      resultItem.kce = kce;
      resultItem.sphfwssflhbbm = sphfwssflhbbm;
      resultItem.lslbs = lslbs;
      //  需单独处理下，或后端处理
      resultItem.yhzcbs = "";
      resultItem.zzstsgl = zzstsgl;
      resultItem.xsyhzc = xsyhzc;
    },
    /**
     * 商品列表合计
     */
    sumNum(list, field) {
      let count = 0;
      list.forEach((item) => {
        count += Number(item[field]);
      });
      return count;
    },
    /**
     * 表尾合计
     */
    footerMethod({ columns, data }) {
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return "合计";
          }
          if (["je"].includes(column.property)) {
            if (data[0] && data[0].bhsje) {
              this.sumJE = this.sumNum(data, "bhsje")
                ? this.sumNum(data, "bhsje").toFixed(2)
                : "0.00";
            } else {
              this.sumJE = this.sumNum(data, "je")
                ? this.sumNum(data, "je").toFixed(2)
                : "0.00";
            }
            return this.sumJE;
          }
          if (["se"].includes(column.property)) {
            this.sumSE = this.sumNum(data, "se")
              ? this.sumNum(data, "se").toFixed(2)
              : "0.00";
            return this.sumSE;
          }
          return null;
        }),
      ];
      return footerData;
    },
    footerColspanMethod({ $rowIndex, _columnIndex }) {
      if ($rowIndex === 0) {
        if (_columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 3,
          };
        } else if (_columnIndex === 1 || _columnIndex === 2) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        } else if (_columnIndex === 3) {
          return {
            rowspan: 1,
            colspan: 4,
          };
        } else if (
          _columnIndex === 4 ||
          _columnIndex === 5 ||
          _columnIndex === 6
        ) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    footerCellClassName({ $rowIndex, column, columnIndex }) {
      if (columnIndex === 0) {
        return "footer-title";
      } else if (column.property === "se" || column.property === "je") {
        return "footer-content";
      }
    },
    /**
     * 添加行
     * @param content
     */
    insertEvent(firstLoad) {
      const $table = this.$refs.xTable;
      let tableData = $table.getTableData().tableData;
      if (!firstLoad) {
        if (!this.isBlank(this.form.tdys) && tableData.length > 0) {
          this.showAddGoodsTips("当前模式只能开具一行项目明细");
          return;
        }
        if (!this.isBlank(this.form.cezslxDm) && tableData.length > 0) {
          //差额征税只能一行
          this.showAddGoodsTips("差额征税方式只能开具一行项目明细");
          return;
        }
      }

      $table
        .fullValidate()
        .catch((errMap) => errMap)
        .then((res) => {
          if (res) {
            this.showAddGoodsTips("请先填写发票行明细，在添加新的行");
            return;
          }
          const record = { fphxz: "00" }; //默认正常行
          $table.insertAt(record, -1).then(({ row }) => {
            if (!firstLoad) {
              $table.setEditCell(row, "xmmc");
            }
          });
        });
    },
    showAddGoodsTips(content) {
      this.addTipsVisible = true;
      this.tipsContent = content;
      setTimeout(() => {
        this.addTipsVisible = false;
      }, 3000);
    },
    /**
     * 添加折扣行
     * @param content
     */
    insertDiscountRow() {
      let that = this;
      let xTable = that.$refs.xTable;
      let tableData = xTable.getTableData().tableData;
      let checkedRecords = xTable.getCheckboxRecords(true);
      if (checkedRecords.length <= 0) {
        this.showDiscountTips("请选择被折扣行");
        return;
      }
      if (checkedRecords.length > 1) {
        this.showDiscountTips("暂支持单条记录折扣");
        return;
      }
      let beDiscountRow = checkedRecords[0]; //被折扣行
      if (that.isBlank(beDiscountRow.xmmc)) {
        that.showDiscountTips("添加折扣时项目名称不能为空");
        return;
      }
      if (that.isBlank(beDiscountRow.je) || parseInt(beDiscountRow.je) == 0) {
        that.showDiscountTips("添加折扣时项目金额不能为空或0");
        return;
      }
      if (beDiscountRow.fphxz != "00") {
        that.showDiscountTips("不允许重复增加折扣");
        return;
      }
      this.addDiscountVisible = true;
      this.currentDiscountRow = beDiscountRow;
      this.$set(this, "currentDiscountRow", beDiscountRow);
      this.$set(
        this,
        "currentDiscountIndex",
        xTable.getVTRowIndex(beDiscountRow)
      );
    },
    showDiscountTips(content) {
      this.discountVisible = true;
      this.discountContent = content;
      setTimeout(() => {
        this.discountVisible = false;
      }, 3000);
    },
    /**
     * 折扣弹窗保存
     */
    addDiscount() {
      let that = this;
      that.$refs.zkForm.validate((valid) => {
        if (valid) {
          if (
            parseFloat(that.zkForm.zkje) >
            parseFloat(that.currentDiscountRow.je)
          ) {
            that.$notify({
              title: "警告",
              message: "折扣金额不能超过商品金额",
              type: "warning",
            });
            return;
          }
          that.addDiscountToGoodsItem();
        }
      });
    },
    /**
     * 折扣行加入到表单
     */
    addDiscountToGoodsItem() {
      //添加折扣行
      let that = this;
      let xTable = that.$refs.xTable;
      let tableData = xTable.getTableData().tableData;
      let newRow = { ...that.currentDiscountRow, je: -that.zkForm.zkje };
      const record = {
        xmmc: that.currentDiscountRow.xmmc,
        bhsje: that.zkForm.zkje
          ? parseFloat(-that.zkForm.zkje).toFixed(2)
          : -that.zkForm.zkje,
        je: that.zkForm.zkje
          ? parseFloat(-that.zkForm.zkje).toFixed(2)
          : -that.zkForm.zkje,
        slv: that.currentDiscountRow.slv,
        se: that.getSe(newRow),
        fphxz: "01",
        taxclasscode: that.currentDiscountRow.taxclasscode,
        sphfwssflhbbm: that.currentDiscountRow.sphfwssflhbbm,
        spfwjc: that.currentDiscountRow.spfwjc,
        hwhyslwfwmc: that.currentDiscountRow.hwhyslwfwmc,
        mxxh: that.currentDiscountRow.mxxh + 1,
      };

      let position = -1;
      if (tableData.length > that.currentDiscountIndex + 1) {
        position = that.currentDiscountIndex + 1;
      }
      xTable.insertAt(record, position).then(({ row }) => {
        xTable.setEditCell(row, "xmmc");
        that.$set(that.currentDiscountRow, "fphxz", "02");
      });
      this.addDiscountVisible = false;
      xTable.updateFooter();
    },
    /**
     * 删除商品
     */
    removeGoods() {
      let that = this;
      let xTable = that.$refs.xTable;
      let tableData = xTable.getTableData().tableData;
      let checkedRecords = xTable.getCheckboxRecords(true); //从后往前排
      if (checkedRecords.length <= 0) {
        that.showDiscountTips("请选择行");
        return;
      }
      for (var i = checkedRecords.length - 1; i >= 0; i--) {
        let row = checkedRecords[i];
        if (row.fphxz == "02") {
          that.showDiscountTips("请先删除折扣行");
          return;
        } else if (row.fphxz == "00") {
          xTable.remove(row);
        } else {
          //删除折扣行，同时将被折扣行状态改为正常行
          let index = xTable.getVTRowIndex(row);
          that.$set(tableData[index - 1], "fphxz", "00");
          xTable.remove(row);
        }
      }
    },
    /**
     * 选择商品
     * @param row
     * @param rowIndex
     */
    showGoodsDlg(row, rowIndex) {
      this.goodsDlgVisible = true;
      this.currentGoodsIndex = rowIndex;
    },
    closeGoodsDlg() {
      this.goodsDlgVisible = false;
    },
    handleSubmitProduct(row) {
      this.goodsDlgVisible = false;
      let tableData = this.$refs.xTable.getTableData().tableData;
      this.matchCb(row, tableData[this.currentGoodsIndex]);
      if (!this.isBlank(this.form.cezslxDm)) {
        this.showCezsDlg();
      }
    },
    //差额征税弹窗
    showCezsDlg() {
      // 差额开票自动选中
      if (this.form.cezslxDm == "02") {
        //差额开票
        this.ceItemForm.lrfs = 1;
      } else {
        delete this.ceItemForm.lrfs;
      }
      this.cszsDlgVisible = true;
    },
    submitCeItemForm() {
      //差额征税明细保存
      this.$refs.ceItemForm.validate((valid) => {
        if (valid) {
          let obj = { ...this.ceItemForm };
          this.ceTableData.push(obj);
          this.$refs.xTable.getTableData().tableData[
            this.currentGoodsIndex
          ].kce = this.ceItemForm.kcje;
          this.clearCeItemForm();
        }
      });
    },
    removeCeItem(row) {
      this.ceTableData.remove(row);
    },
    clearCeItemForm() {
      this.ceItemForm = { lrfs: this.ceItemForm.lrfs };
      this.$refs.ceItemForm.clearValidate();
    },
    submitCeForm() {
      //差额征税保存
      this.$refs.ceForm.validate((valid) => {
        if (valid) {
          //计算金额和税额
          let xTable = this.$refs.xTable;
          let tableData = xTable.getTableData().tableData;
          let goods = tableData[0]; //差额征税只允许一行明细
          if (!goods.xmmc || (!goods.slv && goods.slv != 0)) {
            this.$notify({
              title: "警告",
              message: "请先选择项目",
              type: "warning",
            });
            return;
          }
          let price =
            this.form.cezslxDm == "01"
              ? this.ceForm.hsxse
              : Calc.Sub(this.ceForm.hsxse, this.ceForm.kcje, 2);
          goods.se = Calc.Sub(price, Calc.Div(price, 1 + goods.slv, 2), 2);
          goods.je = Calc.Sub(this.ceForm.hsxse, goods.se, 2);
          //将差额数据写入到发票
          this.ceForm.invoiceVariableLevyDetailList = this.ceTableData;
          this.form.invoiceVariableLevy = { ...this.ceForm };
          this.$refs.cedrawer.closeDrawer();

          this.$refs.xTable.updateData();
        }
      });
    },
    //购货方弹窗
    showBuyerDlg() {
      this.buyerVisible = true;
      this.$nextTick(() => {
        this.$refs.buyerTable.connect(this.$refs.buyerToolbar);
        this.$refs.frequentTable.connect(this.$refs.frequentToolbar);
      });
      this.getCustomerPage();
      this.getFrequentCustomerPage();
    },
    async getCustomerPage() {
      const {
        code = "",
        pageNo = 1,
        pageSize = 10,
        totalCount = 0,
        data = [],
      } = await this.api.getCustomerPage(this.customerQuery);
      this.customerData = data;
      this.customerPage = {
        currentPage: pageNo,
        pageSize: pageSize,
        totalResult: totalCount,
      };
    },
    handleCustomerPageChange({ currentPage, pageSize }) {
      this.customerQuery.pageNo = currentPage;
      this.customerQuery.pageSize = pageSize;
      this.getCustomerPage();
    },
    async getFrequentCustomerPage() {
      const {
        code = "",
        pageNo = 1,
        pageSize = 10,
        totalCount = 0,
        data = [],
      } = await this.api.getFrequentCustomerPage(this.frequentCustomerQuery);
      this.frequentCustomerData = data;
      this.frequentCustomerPage = {
        currentPage: pageNo,
        pageSize: pageSize,
        totalResult: totalCount,
      };
    },
    handleFrequentCustomerPageChange({ currentPage, pageSize }) {
      this.frequentCustomerQuery.pageNo = currentPage;
      this.frequentCustomerQuery.pageSize = pageSize;
      this.getFrequentCustomerPage();
    },
    expandFrequent(type) {
      this.frequentExpand = type == 1 ? false : true;
    },
    buyerClickEvent({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
    }) {
      this.$refs.frequentTable.clearRadioRow();
      this.$refs.buyerTable.setRadioRow(row);
    },
    frequentClickEvent({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
    }) {
      this.$refs.buyerTable.clearRadioRow();
      this.$refs.frequentTable.setRadioRow(row);
    },
    addBuyerToCustomer() {
      let selectedRow =
        this.$refs.buyerTable.getRadioRecord() ||
        this.$refs.frequentTable.getRadioRecord();
      this.buyerVisible = false;
      this.$set(this.form, "gmfmc", selectedRow.gmfMc);
      this.$set(this.form, "gmfnsrsbh", selectedRow.gmfNsrsbh);
      this.$set(this.form, "gmfdz", selectedRow.dzdh);
      this.$set(this.form, "gmfdh", selectedRow.phone);
      this.$set(this.form, "gmfkhh", selectedRow.yhzh);
      this.$set(this.form, "gmfzh", selectedRow.bankaccount);

      this.$refs.form.clearValidate();
    },
    closeCustomerDlg() {
      this.buyerVisible = false;
    },
    //根据开票点获取销方信息
    async getSellerInfoById() {
      const { code = "", data = [] } = await this.api.getOrgDetail({
        id: this.form.orgid,
      });
      this.$set(this, "kysyed", data.kysyed);
      this.$set(this.form, "xsfmc", data.nsrmc);
      this.$set(this.form, "xsfnsrsbh", data.nsrsbh);
      this.$set(this.form, "xsfdz", data.address);
      this.$set(this.form, "xsfdh", data.phone);
      this.$set(this.form, "xsfkhh", data.bank);
      this.$set(this.form, "xsfzh", data.bankAccount);
      this.$set(this.form, "kpr", data.kpr);
      this.$set(this.form, "djkpfs", data.djkpfs);
    },
    //保存发票
    async saveInvoice(type) {
      let that = this;
      let tableData = this.$refs.xTable.getTableData().tableData;
      if (tableData.length <= 0) {
        that.$notify({
          title: "警告",
          message: "请填写项目",
          type: "warning",
        });
        return;
      }
      //数电
      that.$nextTick(() => {
        that.$refs.form.validate((valid) => {
          if (valid) {
            //校验商品明细
            const $table = that.$refs.xTable;
            const validRows = $table
              .getTableData()
              .tableData.filter((item) => item.fphxz != "01");
            $table
              .validate(validRows)
              .catch((errMap) => errMap)
              .then((res) => {
                if (res) return;
                //保存
                that.form.fpmxList = tableData;
                that.form.type = type;
                if (type == 1) {
                  //如果为开票请求，需要判断是否超出单张限额
                  that.api.checkOpenInvoice(that.form).then((result) => {
                    //如果超出单张限额，给出提示是否要继续开票
                    if (result && result.code == "0") {
                      let msg = "提交开票成功";
                      if (result.data.sh && result.data.sh == "sh") {
                        msg = "您的开票请求已成功提交，请等待审核";
                      }
                      if (result.data.cxe && result.data.cxe == "cxe") {
                        this.$confirm(
                          `超出单张发票限额，您确定要开票吗？`,
                          "警告",
                          {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                          }
                        )
                          .then(() => {
                            that.api.saveInvoice(that.form).then((res) => {
                              if (res && res.code == "0") {
                                that.$notify({
                                  message: msg,
                                  type: "success",
                                });
                                that.clearAll();
                                that.$router.push({
                                  path: "/buleInvoice/ApplySuccess",
                                  query: {
                                    invoiceId: res.data,
                                  },
                                });
                              }
                            });
                          })
                          .catch(() => {});
                      } else {
                        that.api.saveInvoice(that.form).then((res) => {
                          if (res && res.code == "0") {
                            that.$notify({
                              message: msg,
                              type: "success",
                            });
                            that.clearAll();
                            that.$router.push({
                              path: "/buleInvoice/ApplySuccess",
                              query: {
                                invoiceId: res.data,
                              },
                            });
                          }
                        });
                      }
                    }
                  });
                } else {
                  that.api.saveInvoice(that.form).then((res) => {
                    if (res && res.code == "0") {
                      that.$notify({
                        message: "保存成功",
                        type: "success",
                      });
                      that.$set(that.form, "id", res.data);
                      //  that.clearAll()
                    }
                  });
                }
              });
          }
        });
      });
    },
    //初始化省
    initDistrictDict() {
      this.api.listDistrictDict().then((res) => {
        this.districts = res.data;
      });
    },
    //预览发票
    preview() {
      let that = this;
      let $table = this.$refs.xTable;
      let tableData = $table.getTableData().tableData;
      const validRows = $table
        .getTableData()
        .tableData.filter((item) => item.fphxz != "01");
      //数电
      that.$refs.form.validate((valid) => {
        if (valid) {
          //校验商品明细
          $table
            .validate(validRows)
            .catch((errMap) => errMap)
            .then((res) => {
              if (res) return;
              //保存
              that.form.fpmxList = tableData;
              that.api.saveInvoicePreview(that.form).then((res) => {
                if (res.code === 0) {
                  window.open(
                    dynamicUrlMap[process.env.NODE_ENV].frontUrl +
                      "#/invoice/preview?fpqqlsh=" +
                      res.data,
                    "_blank"
                  );
                } else {
                  this.$message.error(res.msg);
                }

                //  window.open('http://localhost:8080/#/invoice/preview?url=https://s-uat.mideazy.com/midea-sd-invoicesvc/api/service/previewDatas&fpqqlsh=186a64ddbd3743afa413c4c4a6712a32', '_blank')
              });
            });
        }
      });
    },
    //不动产网签合同编号，房源信息弹窗
    showHouseDlg() {
      this.houseDlgVisible = true;
    },
    closeHouseDlg() {
      this.houseDlgVisible = false;
    },
    //发票明细
    loadFpmxList() {
      let xTable = this.$refs.xTable;
      xTable.insert(this.form.fpmxList);
    },
  },
  computed: {
    invoiceId() {
      return this.$route.query.invoiceId;
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
  },
  activated() {
    let obj = {};
    obj.id = this.invoiceId;
    const action =
      this.$route.query.isFormInvoiced == "Y"
        ? "getCopyDetailById"
        : "getInvoiceDetailById";
    this.api[action]({ id: this.invoiceId }).then((res) => {
      this.$refs.xTable.remove();
      this.form = res.data;
      this.form.kdsbz = !this.form.kdsbz ? "N" : "Y";
      this.$set(this.customerQuery, "orgid", this.form.orgid);
      this.$set(this.frequentCustomerQuery, "orgid", this.form.orgid);
      this.getSellerInfoById();
      this.getTaxRates();

      this.loadFpmxList();
    });

    this.initDistrictDict();
  },
};
</script>

<style scoped lang="scss">
@import '../../../styles/variables.scss';
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e9e9e9;
  border-radius: 4px 4px 0 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 20px;
  padding: 10px 0 10px 16px;
}
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
::v-deep .vxe-input--clear-icon {
  margin-right: 10px;
}
.arrow {
  font-size: 14px;
}
.frenquent-customer-title {
  padding: 10px;
  color: $primaryGreenColor;
}
.frenquent-customer {
  background: #fff;
  border: 1px solid #fafafa;
  border-left: none;
  border-radius: 5px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  padding: 0 8px 6px;
  position: absolute;
  right: 0;
  top: 3px;
  transition-delay: 0;
  transition-duration: 0.4s;
  transition-property: width;
  transition-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  z-index: 1001;
}
.vxe-table--ignore-clear.vxe-select--panel {
  z-index: 9998 !important;
}

::v-deep .editable-footer .footer-title {
  font-weight: 600;
  color: $ticket-color;
  text-align: center;
  font-size: 14px;
}
::v-deep .editable-footer .footer-content {
  font-weight: 700;
  color: #000000;
  text-align: center;
  font-size: 14px;
}
::v-deep .editable-footer .footer-content .vxe-cell--item::before {
  content: "\00A5";
  margin-right: 1px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

::v-deep .el-drawer__header {
  color: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid #e7e7e7;
  border-radius: 2px 2px 0 0;
  padding: 20px;
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 700;
}
.drawer-form {
  padding: 20px;
  .el-form-item {
    width: calc(100% - 10px);
  }
}
.el-container {
  background: #f9fafd;
  .el-main {
    padding: 20px 20px 0 20px;
    .el-select {
      width: calc(100% - 10px);
    }
  }
  .el-footer {
    text-align: center;
  }
}
.ce-table-footer {
  text-align: right;
  padding: 20px;
  font-size: 14px;
}
.goods-amount {
  padding: 24px;
  margin: 24px auto;
  background: #f9fafd;
  .amount {
    font-size: 36px;
  }
}
.zk-row {
  color: #fc5541;
}
</style>
