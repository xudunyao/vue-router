<template>
  <div id="app">
    <div class="nav-box">
      <router-link to="/home">首页</router-link>
      <router-link :to="{name:'learn'}">学习</router-link>
      <router-link to="/student">学生</router-link>
      <router-link to="/about">关于</router-link>
      <router-link to="/activity">活动</router-link>
      <div>os</div>
      <div>window</div>
      <div>window1</div>
      <div>os2</div>
        <div>window2</div>
        <div>os3</div>
      <div>window2</div>
      <div>window3</div>
    </div>
    <div class="content">
       <router-view></router-view>
    </div>
  </div>
</template>

<script>


export default {
  name: 'App',
  methods:{
    test:function (){
      this.$router.push('/home');
    }
  }
}
</script>

<style>
a{
  text-decoration: none;
}
#app{
  height: 600px;
  display:flex;
  justify-content:space-between;
 
}
.nav-box{
  border:1px solid red;
  width:200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.content{
   flex-grow: 1;
   text-align: center;
   border:1px solid blue;
}
</style>
