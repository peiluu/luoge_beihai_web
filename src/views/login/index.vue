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
import { getUUID } from '@/utils';
import { isURL } from '@/utils/validate';
import { mainChildrenRoutes } from '@/router'
export default {
  data() {
    return {
      captchaPath: '',
      dataForm: {
        username: 'admin', // admin
        password: 'admin', // admin
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
            .then( res => {
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
        .then(res => {
          this.loading = false;
          if (res.code !== 0) {
            this.$message.error(res.msg);
          }
          if(res.data.length === 0){
            this.$message.error('当前帐户暂无访问权限，请联系管理员')
            return
          }
          this.$store.commit('saveSidebarMenuList', res.data || []);
          this.fnAddDynamicMenuRoutes(res.data);
          this.$router.replace({ name: 'home' });
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    // 获取字典列表, 添加并全局变量保存
    getDicts() {
      this.$http
        .get('/sys/dict/type/all')
        .then(res => {
          if (res.code !== 0) {
            return;
          }
          this.$store.commit('app/saveDictList', res.data || [])
        })
        .catch(() => {});
    },
    fnAddDynamicMenuRoutes(menuList = [], routes = []) {
      var temp = [];
      for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].children && menuList[i].children.length >= 1) {
          temp = temp.concat(menuList[i].children);
          continue;
        }
        // 组装路由
        var route = {
          path: '',
          component: null,
          name: '',
          meta: {
            ...window.SITE_CONFIG['contentTabDefault'],
            menuId: menuList[i].id,
            title: menuList[i].name,
          },
        };
        // eslint-disable-next-line
        let URL = (menuList[i].url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)); // URL支持{{ window.xxx }}占位符变量
        if (isURL(URL)) {
          route['path'] = route['name'] = `i-${menuList[i].id}`;
          route['meta']['iframeURL'] = URL;
        } else {
          URL = URL.replace(/^\//, '').replace(/_/g, '-');
          // route['path'] = route['name'] = URL.replace(/\//g, '-');
          route['path'] = URL ? `/${URL}` : URL
          route['name'] = URL.replace(/\//g, '-')
          route['component'] = () => import(`@/views//${URL}`);
        }
        routes.push(route);
      }
      if (temp.length >= 1) {
        return this.fnAddDynamicMenuRoutes(temp, routes);
      }

      routes = [...routes, ...mainChildrenRoutes]
      // 添加路由
      this.$router.addRoute({
        path: '/',
        component: () => import('@/views/main'),
        name: 'main',
        redirect: { name: 'home' },
        meta: { title: '主入口布局' },
        name: 'main-dynamic-menu',
        children: routes,
      });
      this.$router.addRoute({ path: '*', redirect: { name: '404' } });
      window.SITE_CONFIG['dynamicMenuRoutes'] = routes;
    },
  },
};
</script>
