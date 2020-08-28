<template>
    <div class="activity">

           <div>
                <router-link :to="{name:'academic'}">学术讨论</router-link>
                <router-link :to="{name:'person'}">个人中心</router-link>
                <router-link :to="{name:'download'}">资源下载</router-link>
                 <div>WINDOW不同文件的修改</div>
           </div>
        
           <router-view></router-view>
        
    </div>
    
</template>
<style>
    .activity{
        display:flex;
        flex-direction: column;
    }
</style>