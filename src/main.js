import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Swipe, SwipeItem, Lazyload, Image as VanImage, Card, Tag, Button, Tab, Tabs, Badge, Sidebar, SidebarItem,
    Collapse, CollapseItem,Checkbox, CheckboxGroup, Stepper, SwipeCell, SubmitBar, Icon, Form, Field, Toast, Notify,
    AddressList, AddressEdit, ContactCard, Popup, Grid, GridItem, PullRefresh, List, Dialog
    } from 'vant'
// 使用vant一定要导入以下css文件
import 'vant/lib/index.css';

createApp(App).use(store).use(router).use(Swipe).use(Lazyload,{
    loading:require('./assets/images/default.png')})
    .use(SwipeItem).use(VanImage).use(Card).use(Tag).use(Button).use(Tab).use(Tabs).use(Badge).use(Sidebar)
    .use(SidebarItem).use(Collapse).use(CollapseItem).use(Checkbox).use(CheckboxGroup).use(Stepper).use(AddressEdit)
    .use(SwipeCell).use(SubmitBar).use(Icon).use(Form).use(Field).use(Toast).use(Notify).use(AddressList)
    .use(ContactCard).use(Popup).use(Grid).use(GridItem).use(PullRefresh).use(List).use(Dialog)
    .mount('#app');
