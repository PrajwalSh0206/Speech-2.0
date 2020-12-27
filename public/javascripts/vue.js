var app = new Vue({
    el: '#app',
    data: {
      message:[],
      text:'',
      seen:false,
      file:'',
      audio:'',
    },
    methods:{
      audiofile:function(){
        this.audio=this.$refs.file1.files[0]
        console.log(this.$refs.file1.files[0])
        let formData = new FormData();
        formData.append('file', this.audio);
        this.seen=true
          axios.post( '/audio',
            formData,
          ).then( response=>{
            this.seen=false
            msg=response.data.filetext
            this.message.push({message:msg,type:"audio",src:response.data.audio})
          })
          .catch(function(){
            console.log('FAILURE!!');
          });
      },
      handleFileUpload:function(){
      this.file = this.$refs.file.files[0];
      let formData = new FormData();
        formData.append('file', this.file);
        this.seen=true
          axios.post( '/files',
            formData,
          ).then( response=>{
            this.seen=false
            arrdata=response.data.filetext
            arrdata.forEach(  element => {
              this.pdf(element)
            });
            
          })
          .catch(function(){
            console.log('FAILURE!!');
          });
    },
  
    pdf:function(element){
      axios.post('/hear',{message:element})
            .then(response=> {
                this.message.push({message:element,type:"pdf",src:response.data.data})
                setTimeout(()=>{
                  content.scrollTo(0,content.scrollHeight);
                },500)
            })
            .catch(function (error) {
              console.log(error);
            });   
  
    },
      add: function(){
        if(this.text!="")
        {
          this.seen=true
          var content=document.querySelector("#content")
          axios.post('/hear',{message:this.text})
            .then(response=> {
                this.message.push({message:this.text,type:"text",src:response.data.data})
                this.text=""
                this.seen=false
                setTimeout(()=>{
                  content.scrollTo(0,content.scrollHeight);
                },500)
            })
            .catch(function (error) {
              console.log(error);
            });   
       
        }
        else{
          alert("Enter a text")
        }
      }
    },
    filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }}
  })