new Vue({

el:'#app',

data:{

    tab:'stok',

    upbjjList:[],

    kategoriList:[],

    pengirimanList:[],

    paket:[],

    stok:[],

    tracking:{}

},

async mounted(){

    const data =

    await ApiService.loadData();

    this.upbjjList =
    data.upbjjList;

    this.kategoriList =
    data.kategoriList;

    this.pengirimanList =
    data.pengirimanList;

    this.paket =
    data.paket;

    this.stok =
    data.stok;

    /* convert tracking array ke object */

    if(data.tracking){

        data.tracking.forEach(item=>{

            const key =

            Object.keys(item)[0];

            this.$set(

                this.tracking,

                key,

                item[key]

            );

        });

    }

}

});