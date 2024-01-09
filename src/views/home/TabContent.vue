<template>
    <!--扣缴义务人-->
    <div v-if="tabName=='Obligor'">
        <Obligor></Obligor>
    </div>
    <!--员工管理-->
    <div v-else-if="tabName=='Employee'">
        <Employee></Employee>
    </div>
    <!--报送算税-->
    <div v-else-if="tabName=='Caltax'">
        <Caltax></Caltax>
    </div>
    <!--申报管理-->
    <div v-else-if="tabName=='Report'">
        <Report></Report>
    </div>
    <!--缴税管理-->
    <div v-else-if="tabName=='Paytax'">
        <Paytax></Paytax>
    </div>
</template>

<script>
    import Obligor from './subs/Obligor.vue'
    import Employee from './subs/Employee.vue'
    import Caltax from './subs/Caltax.vue'
    import Report from './subs/Report.vue'
    import Paytax from './subs/Paytax.vue'
export default {
    components: {
        Obligor,
        Employee,
        Caltax,
        Report,
        Paytax
    },
    props:{
        tabName: String
    },
    data() {
        return {
            tabs: [],
        }
    },
    created() {

    }
}
</script>

<style lang="scss" scoped>
    ::v-deep .cacl-card{
        display: flex;
        padding: 10px 0;
    }
    ::v-deep .card-item{
        padding: 10px;
        width: 33.3%;
        margin-right: 1%;
        background-color: #FFFFFF;
        border-radius: 10px;

        .card-title{
            margin: 0 15px ;
        }
    }
    ::v-deep .card-item:last-child{
        margin-right: 0;
    }
    ::v-deep .card-content{
        display: flex;
    }
    ::v-deep .card-content-left{
        width:60%;
        .p-title{
            color:#979797;
            font-size: 14px;
            padding-top:10px;
            /*&::before{
                content:'';
                display:inline-block;
                width:8px;
                height:8px;
                margin: 1px 5px;
                border-radius:50%;
                background: #F79A54;
            }*/
        }
        .p-value{
            font-size: 44px;
            color: #333333;
            font-weight: 700;
        }
    }
    ::v-deep .card-content-right{
        width:40%;
        text-align:right;
        img{
            width: 86px;
            height: 86px;
        }
    }
    ::v-deep .flex-layout{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    ::v-deep .el-divider--horizontal{
        margin: 12px 0;
    }
    ::v-deep .mid-margin-15{
        margin-left:15px;
        font-size: 18px;
    }
</style>
