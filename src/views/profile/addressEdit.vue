<template>
  <nav-bar>
    <template v-slot:default>{{ title }}</template>
  </nav-bar>
  <div class="address-edit">
    <van-address-edit
        :area-list="areaList"
        :address-info="addressInfo"
        show-postal
        :show-delete="type=='edit'"
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
    />
  </div>
</template>

<script>
import navBar from 'components/common/navBar';
import { reactive, toRefs, onMounted } from 'vue';
import { tdist } from 'utils/address';
import { useRoute, useRouter } from 'vue-router';
import { addressAdd, getAddressDetail, addressEdit, addressDelete } from 'network/address';
import { Toast } from 'vant'

export default {
  name: "addressEdit",
  setup(){
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      areaList: {
        province_list:[],
        city_list:[],
        county_list:[],
      },
      searchResult:[],
      // 通过type判断是新增还是编辑
      type:'add',
      addressId:'',
      addressInfo:{},
      title:{},
    })

    onMounted(()=>{
      // 构造省市县集合
      let _province_list = {}
      let _city_list = {}
      let _county_list = {}

      tdist.getLev1().forEach(p=>{
        _province_list[p.id]=p.text
        tdist.getLev2(p.id).forEach(c=>{
          _city_list[c.id] = c.text
          tdist.getLev3(c.id).forEach(cou=>{
            _county_list[cou.id] = cou.text
          })
        })
      })

      state.areaList.province_list = _province_list
      state.areaList.city_list = _city_list
      state.areaList.county_list = _county_list

      const { type, addressId } = route.query
      state.type = type
      state.addressId = addressId

      if(state.type == 'edit'){
        getAddressDetail(addressId).then(res=>{
          // address: "饭兜花园1101"
          // city: "北京市"
          // county: "东城区"
          // created_at: "2021-04-06T05:53:52.000000Z"
          // id: 384
          // is_default: 1
          // name: "野人"
          // phone: "13345678901"
          // province: "北京"
          // updated_at: "2021-04-06T05:53:52.000000Z"
          const addressDetail = res

          let _areaCode = ''
          let province = tdist.getLev1()

          Object.entries(state.areaList.county_list).forEach(([id, text])=>{
            if(text == addressDetail.county){
              // 通过县区获取省份
              const provinceIndex = province.findIndex(item=>item.id.substr(0,2) == id.substr(0,2))
              const cityItem = Object.entries(state.areaList.city_list)
                  .filter(([cityId, city])=> (cityId.substr(0, 4) == id.substr(0, 4)))[0]
              if(province[provinceIndex].text == addressDetail.province && cityItem[1] == addressDetail.city){
                _areaCode = id
              }
            }
          })

          state.addressInfo = {
            name:addressDetail.name,
            tel:addressDetail.phone,
            province: addressDetail.province,
            city:addressDetail.city,
            county:addressDetail.county,
            areaCode:_areaCode,
            addressDetail: addressDetail.address,
            isDefault: !!addressDetail.is_default
          }

          console.log(state.addressInfo);
        })
      }
    })

    const onSave = (content)=>{
      console.log('onsave调用');
      const params = {
        name:content.name,
        phone:content.tel,
        province:content.province,
        city:content.city,
        county:content.county,
        address:content.addressDetail,
        is_default:content.isDefault ? 1 : 0,
      }
      console.log(state.type);
      if(state.type == 'edit'){
        addressEdit(state.addressId, params)
        Toast.success('地址修改成功')
        setTimeout(()=>{
          router.push('/addressList')
        },600)
      }else if(state.type == 'add'){
        addressAdd(params).then(res=>{
          Toast.success('地址添加成功')
          setTimeout(()=>{
            router.push('/addressList')
          },600)
        }).catch(err=>{

        })
      }
    }

    if(state.type == 'add'){
      state.title = '新增地址'
    }else{
      state.title = '编辑地址'
    }

    const onDelete = ()=>{
      addressDelete(state.addressId)
      Toast.success('地址删除成功')
      setTimeout(()=>{
        router.push('/addressList')
      },600)
    }

    return {
      ...toRefs(state),
      onSave,
      onDelete,
    }
  },
  components:{
    navBar,
  }
}
</script>

<style scoped>
.address-edit{
  margin-top: 52px;
}
</style>