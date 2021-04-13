<template>
  <nav-bar>
    <template v-slot:default>地址管理</template>
  </nav-bar>
  <div class="address-con">
<!--    <van-address-list-->
<!--        v-model="chosenAddressId"-->
<!--        :list="list"-->
<!--        :disabled-list="disabledList"-->
<!--        disabled-text="以下地址超出配送范围"-->
<!--        default-tag-text="默认"-->
<!--        @add="onAdd"-->
<!--        @edit="onEdit"-->
<!--    />-->
    <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
    />
  </div>
</template>

<script>
import navBar from 'components/common/navBar';
import { getAddress } from 'network/address'
import { reactive, toRefs, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'

export default {
  name: "addressList",
  setup(){
    const chosenAddressId = ref(1)
    const router = useRouter()
    const state = reactive({
      list:[],
    })

    onMounted(()=>{
      getAddress().then(res=>{
        if(res.data.length == 0){
          state.list = []
          return
        }else{
          // console.log(res);
          state.list = res.data.map(item=>{
            return{
              id:item.id,
              name:item.name,
              tel:item.phone,
              address:`${item.province}${item.city}${item.county}${item.address}`,
              iaDefault:!!item.is_default
            }
          })
        }

      })
    })

    const onAdd = ()=>{
      router.push({path:'/addressEdit', query:{type:'add'}})
    }

    const onEdit = (item)=>{
      router.push({path:'/addressEdit', query:{type:'edit',addressId:item.id}})
    }



    return {
      ...toRefs(state),
      chosenAddressId,
      onAdd,
      onEdit,
    }
  },
  components:{
    navBar,
  }
}
</script>

<style lang="scss">
.address-con{
  margin-top: 48px;

}
.van-address-list__bottom{
  bottom: 66px !important;
}
</style>