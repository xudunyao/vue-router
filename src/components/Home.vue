<template>
    <div class="home">
        <button @click="matchUrlSuffix(allUrl[0])">预览文件jpg</button> <button @click="matchUrlSuffix(allUrl[1])">预览文件pdf</button> <button @click="matchUrlSuffix(allUrl[2])">预览文件docx</button> <button @click="matchUrlSuffix(allUrl[3])">预览文件xlsx</button>
      <iframe class="filename" :src="url" width="100%" height="580"></iframe>
      <a href="https://misuyunpu.oss-cn-shenzhen.aliyuncs.com/09595250.jpg" target="_blank">生生世世少</a>
       <a href="https://view.officeapps.live.com/op/view.aspx?src=https://misuyunpu.oss-cn-shenzhen.aliyuncs.com/New%20DOCX%20%E6%96%87%E6%A1%A3.docx" target="_blank">少</a>
    </div>
   
</template>

<script>


export default {
  data(){
      return {
          message:'',
          url:'',
          allUrl:['https://misuyunpu.oss-cn-shenzhen.aliyuncs.com/09595250.jpg','https://misuyunpu.oss-cn-shenzhen.aliyuncs.com/%E8%AE%B8%E6%95%A6%E9%81%A5-%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91.pdf','https://misuyunpu.oss-cn-shenzhen.aliyuncs.com/New%20DOCX%20%E6%96%87%E6%A1%A3.docx','https://misuyunpu.oss-cn-shenzhen.aliyuncs.com/New%20XLSX%20%E5%B7%A5%E4%BD%9C%E8%A1%A8.xlsx']
      }
  },
  methods:{
      inputChange(){
            this.message = this.message.replace(/[^\d.]/g, '');

      },
      inputBlur(){

      },
      matchUrlSuffix(url){
          let sub = url.split('.');
          console.log(sub[sub.length-1]);
          if(sub[sub.length-1] == "docx" || sub[sub.length-1]== "xlsx"){
              console.log(url);
              this.url = "https://view.officeapps.live.com/op/view.aspx?src=" + url; 
          }else{
               console.log(url);
              this.url = url;
          }
      },

  }
}
</script>