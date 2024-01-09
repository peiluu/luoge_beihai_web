<template>
    <div class="home">
        <TabBar :tabs="tabs"></TabBar>
    </div>
</template>

<script>
import TabBar from "./TabBar";
export default {
    components: {TabBar},
    data() {
        return {
            tabs: [],
        }
    },
    created() {
        this.tabs = [
            {"label":"扣缴义务人管理","name":"Obligor"},
            {"label":"人员管理","name":"Employee"},
            {"label":"报送算税","name":"Caltax"},
            {"label":"申报管理","name":"Report"},
            {"label":"缴税管理","name":"Paytax"},
        ];
    }
}
</script>

<style lang="scss" scoped>
.home {
    padding: 10px;
}
</style>