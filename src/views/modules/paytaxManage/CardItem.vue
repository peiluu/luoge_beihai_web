<template>
    <div class="card-item">
        <div class="card-content">
            <div class="card-content-left">
                <div class="p-title">{{title}}</div>
                <div class="p-value">{{total}}</div>
            </div>
            <div class="card-content-right">
                <img :src="icon">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "CardItem",
        props: {
            label: String,
            options: Array,
            optionValue: Number,
            title: String,
            total: Number,
            icon: String
        },
        data() {
            return {

            }
        },
        methods: {

        },
    };
</script>

<style lang="scss" scoped>
    .cacl-card{
        display: flex;
        padding: 10px;

    }
    .card-item{
        padding: 10px;
        width:50%;
        margin-right: 1%;
        background-color: #FFFFFF;
        border-radius: 10px;

        .card-title{
            margin: 0 15px ;
        }
    }
    .card-item:last-child{
        margin-right: 0;
    }
    .card-content{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 20px;
    }
    .card-content-left{
        padding: 20px;
        .p-title{
            color:#979797;
            font-size: 18px;
            &::before{
                content:'';
                display:inline-block;
                width:8px;
                height:8px;
                margin: 1px 5px;
                border-radius:50%;
                background: #F79A54;
            }
        }
        .p-value{
            font-size: 34px;
            color: #333333;
            font-weight: 400;
            text-align: center;
        }
    }
    .card-content-right{
        margin-right: 50px;
        img{
            width: 100px;
            height: 100px;
        }
    }

</style>
