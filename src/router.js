import Vue from 'vue'
import VueRouter from 'vue-router';

import Home from './components/Home';
import Activity from './components/Activity';
import Learn from './components/Learn';
import Student from './components/Student';
import About from './components/About';
//使用路由
Vue.use(VueRouter);

//配置路由
const routes = [
  {
    path:'/',
    redirect:'/home',
  },
  {
    path:'/home',
    component:Home,
    //别名
    alias:'/',
  },
  {
    path:'/learn',
    name:'learn',
    component:() =>import('./components/Learn'),
  },
  {
    path:'/activity',
    component:() =>import('./components/Activity'),
    redirect:'/activity/academic',
    //redirect:{name:'academic'},
    //redirect(to){
      //return {
        //name:'academic',
     //}
    //}
    children:[
     
      {
        path:'academic',
        name:'academic',
        component:() =>import('./components/Academic'),
      },
      {
        path:'download',
        name:'download',
        component:() =>import('./components/Download'),
      },
      {
        path:'person',
        name:'person',
        component:() =>import('./components/Person'),
      },
    ]
  },
  {
    path:'/student/',
    components:{
      default:() =>import('./components/Download'),
      student:() =>import('./components/Student'),
    }
  },
  {
    path:'/about/',
    component:() =>import('./components/About'),
  },
  
  
];
//
export default new VueRouter ({
  mode:'history',
  routes,
});