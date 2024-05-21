<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-header">
          <h2 class="login-brand">{{ $t('brand.lg') }}</h2>
        </div>
        <div class="login-body">
          <h3 class="login-title">{{ $t('login.title') }}</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmitHandle()"
            status-icon
          >
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" :placeholder="$t('login.username')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-user"></use></svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-lock"></use></svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
                    <span slot="prefix" class="el-input__icon">
                      <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-safetycertificate"></use></svg>
                    </span>
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmitHandle()" class="w-percent-100" :loading="loading">{{
                $t('login.title')
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="login-footer">
          <p>©2022 罗格科技（北京）有限公司</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import { getUUID, fnAddDynamicMenuRoutes } from '@/utils';
export default {
  data() {
    return {
      captchaPath: '',
      dataForm: {
        username: '', // admin
        password: '', // admin
        uuid: '',
        captcha: '',
      },
      loading: false,
    };
  },
  computed: {
    dataRule() {
      return {
        username: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        captcha: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
      };
    },
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.captchaPath = `${process.env.VUE_APP_APIURL}/captcha?uuid=${this.dataForm.uuid}`;
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.loading = true;
          this.$http
            .post('/login', this.dataForm)
            .then((res) => {
              if (res.code !== 0) {
                this.loading = false;
                this.getCaptcha();
                return this.$message.error(res.msg);
              }
              const { roleList = [], token = '' } = res.data;
              Cookies.set('token', token);
              Cookies.set('roleList', JSON.stringify(roleList));
              // 登录成功后获取菜单
              this.getMenus(roleList);
              this.getDicts();
            })
            .catch((e) => {
              console.log(e);
              this.loading = false;
              this.$message.error(e.msg || '登录失败');
              this.getCaptcha();
            });
        });
      },
      1000,
      { leading: true, trailing: false },
    ),
    // 获取菜单
    getMenus(roleList) {
      this.$http
        .get('/sys/menu/nav')
        .then((res) => {
          if (res.code !== 0) {
            this.$message.error(res.msg);
          }
          if (res.data.length === 0) {
            this.$message.error('当前帐户暂无访问权限，请联系管理员');
            this.getCaptcha();
            return;
          }
          this.$store.commit('app/saveSidebarMenuList', res.data || []);
          // 添加动态路由
          fnAddDynamicMenuRoutes(res.data, [], this.$router);
          setTimeout(() => {
            this.loading = false;
            this.$router.replace({ name: 'home' });
          }, 100);
        })
        .catch((e) => {
          this.getCaptcha();
          this.loading = false;
        });
    },
    // 获取字典列表, 添加并全局变量保存
    getDicts() {
      this.$http
        .get('/sys/dict/type/all')
        .then((res) => {
          if (res.code !== 0) {
            return;
          }
          this.$store.commit('app/saveDictList', res.data || []);
        })
        .catch(() => {});
    },
  },
};
</script>
