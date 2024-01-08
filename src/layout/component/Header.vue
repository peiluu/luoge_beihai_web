<template>
    <div id="header">
        <div class="left">
            <span class="trigger" @click="toggleCollapsed">
                <i v-if="collapsed" class="el-icon-s-unfold"></i>
                <i v-else class="el-icon-s-fold"></i>
            </span>
            <bread-crump />
        </div>
        <div class="right">
            <div class="out">
                <el-tooltip content="刷新">
                    <img class="out-icon" :src="refreshIcon" alt="" srcset="" @click="refresh">
                </el-tooltip>
                <el-tooltip>
                    <el-button style="padding: 5px;" type="text" @click="showUpgrade(0)">功能更新</el-button>
                </el-tooltip>
                <el-tooltip content="注销">
                    <img class="out-icon" :src="logoutIcon" alt="" srcset="" @click="logoutSys">
                </el-tooltip>
                <el-dropdown trigger="click" @command="changeSystem">
                    <p class="icon-switch">
                        <span>{{currentApp}}</span>
                        <img class="out-icon" :src="switchIcon" alt="" srcset="">
                    </p>
                    <el-dropdown-menu class="custom-dropdown" slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in apps" :key="item.id" :command="index">{{item.applicationName}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="line"></div>
            <img class="avator" :src="avatorIcon" alt="" srcset="">
            <span class="name">{{ username }}</span>
        </div>

        <el-dialog
                title="功能更新"
                :visible.sync="dialogVisible"
                width="800px"
                :show-close="false"
                custom-class="my-dialog">
            <el-form ref="form" label-width="100px">
                <template v-for="(upgrade, index) in upgradeData">
                    <div class="upgrade-card" :key="'divider'+index">
                        <el-divider></el-divider>
                        <div class="card-title">
                            <div class="card-title-left">{{upgrade.title}}</div>
                            <div class="card-title-right">{{upgrade.createTime}}</div>
                        </div>
                        <div class="card-content" :key="'div'+subIndex" v-for="(content,subIndex) in upgrade.contents">
                            {{content}}
                        </div>
                    </div>
                </template>
                <el-divider></el-divider>
                <el-form-item class="form-button">
                    <el-button type="primary" @click="closeUpgrade">我知道了</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import BreadCrump from './BreadCrump.vue'

import avatorIcon from '@/assets/avator.png'
import refreshIcon from '@/assets/refresh.png'
import logoutIcon from '@/assets/logout.png'
import switchIcon from '@/assets/switch.png'

import { auth } from '@/utils/auth';
import { notEmpty } from '@/utils/tool';
import { getHistoryUpgrade,getUpgradeReaded,closeUpgrade } from '@/utils/business'

export default {
    components: {
        BreadCrump
    },
    data() {
        return {
            collapsed: false,
            avatorIcon,
            refreshIcon,
            logoutIcon,
            switchIcon,
            dialogVisible: false,
            upgradeData: [],
            readed:'',
        }
    },
    computed: {
        username() {
            return this.$store.state.user.user && this.$store.state.user.user.userName
        },
        apps() {
            return this.$store.state.app.apps || []
        },
        currentApp() {
            const code = this.$store.state.app.currentAppCode;
            if (this.apps) {
                const res = this.apps.filter(item => code == item.applicationCode);
                if (res.length > 0) {
                    return res[0].applicationName
                }
            }
            return ''
        }
    },
    created(){
        getUpgradeReaded(res=>{
            this.readed = res.data;
            if(this.readed!=1){
                this.showUpgrade(1);
            }
        })
    },
    methods: {
        toggleCollapsed() {
            this.collapsed = !this.collapsed
            this.$store.dispatch('app/updateCollapsed', this.collapsed)
        },
        logoutSys() {
            auth.logout()
        },
        refresh() {
            location.reload()
        },
        changeSystem(index) {
            const data = this.apps[index];
            auth.saveCurrentApp(data.applicationCode);
            this.$store.dispatch('app/saveCurrentApp', data.applicationCode);
            if (notEmpty(data.applicationUrl)) {
                if (data.applicationUrl.indexOf('http') >= 0) {
                    location.href = data.applicationUrl;
                }
                else {
                    location.href = location.host + '/' + data.applicationUrl;
                }
            }
            else {
                auth.changeApp();
            }
        },
        showUpgrade(type){
            let that = this;
            getHistoryUpgrade(type, res=>{
                that.upgradeData = res.data;
                if(res.data.length>0){
                    that.dialogVisible = true;
                }
            })
        },
        closeUpgrade(){
            let that = this;
            closeUpgrade(res=>{
                this.dialogVisible = false;
            })

        }
    }
}
</script>

<style lang="scss">
.el-dropdown-menu {
    top: 35px !important;
}
</style>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

#header {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
        display: flex;
        align-items: center;
        .trigger {
            margin-right: 8px;
            font-size: 18px;
            line-height: $headerHeight;
            cursor: pointer;
            transition: color 0.3s;
        }
        .trigger:hover {
            color: #1890ff;
        }
    }
    .right {
        display: flex;
        align-items: center;
        .avator {
            width: 24px;
            border-radius: 100%;
        }
        .name {
            margin-left: 5px;
            font-weight: bold;
        }
        .line {
            width: 1px;
            height: 20px;
            background: #E4E8EA;
            margin: 0 20px 0 4px;
        }
        .out {
            margin-top: 2px;
            display: flex;
            align-items: center;
            &-icon {
                // font-size: 20px;
                // color: rgb(165, 42, 42);
                cursor: pointer;
                width: 48px;
                height: 48px;
            }
        }
        .icon-switch {
            display: flex;
            align-items: center;
            &>span {
                margin-top: -3px;
                margin-right: -8px;
            }
        }
    }
}

::v-deep {
    .el-dropdown-menu {
        max-height: 400px;
        overflow-y: auto;
    }
}
.custom-dropdown {
    max-height: 400px;
    overflow-y: auto;
}

::v-deep .el-dialog__header{
    background-color: #409EFF;
    box-shadow: 0 1px 2px #e9e9e9;
    padding:5px;
    line-height: 24px !important;
    .el-dialog__title{
        font-size:14px;
        color:#ffffff;
    }
}
::v-deep .el-dialog__body{
    padding: 12px 20px;
}
::v-deep .el-dialog.my-dialog{
    height: auto;
    max-height: 600px;
    overflow-y: auto;
}
.upgrade-card{
    line-height: 30px;
    .card-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .card-title-left{
            font-size: 18px;
        }
        .card-title-right{
            font-size: 14px;color:#cccccc;
        }
    }
    .card-content::before { // 小圆点在这里
        content: '';
        border: 1px solid #000;
        background-color: #000;
        display: inline-block; // 此句为css样式展示重点🏁
        width: 8px;
        height: 8px;
        border-radius: 100%;
    }
}
</style>