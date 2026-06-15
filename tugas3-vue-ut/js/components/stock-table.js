Vue.filter(

'rupiah',

function(value){

    return 'Rp ' +

    Number(value)
    .toLocaleString('id-ID');

}

);

Vue.filter(

'buah',

function(value){

    return value + ' buah';

}

);

Vue.component(

'ba-stock-table',

{

template:'#tpl-stock',

props:[

    'stok',

    'upbjjList',

    'kategoriList'

],

data(){

    return{

        filterUpbjj:'',

        filterKategori:'',

        filterReorder:false,

        sortBy:'',

        showForm:false,

        editMode:false,

        selectedIndex:null,

        errorKode:'',

        formInput:{

            kode:'',

            judul:'',

            kategori:'MK Wajib',

            upbjj:'Jakarta',

            lokasiRak:'',

            harga:0,

            qty:0,

            safety:0,

            catatanHTML:''

        }

    }

},

computed:{

    filteredStok(){

        let result = [...this.stok];

        if(this.filterUpbjj){

            result = result.filter(

                item=>

                item.upbjj===

                this.filterUpbjj

            );

        }

        if(

            this.filterUpbjj &&

            this.filterKategori

        ){

            result = result.filter(

                item=>

                item.kategori===

                this.filterKategori

            );

        }

        if(this.filterReorder){

            result = result.filter(

                item=>

                item.qty===0 ||

                item.qty < item.safety

            );

        }

        if(this.sortBy){

            result.sort((a,b)=>{

                if(

                    this.sortBy==='judul'

                ){

                    return a.judul
                    .localeCompare(
                        b.judul
                    );

                }

                if(

                    this.sortBy==='qty'

                ){

                    return a.qty-b.qty;

                }

                if(

                    this.sortBy==='harga'

                ){

                    return a.harga-b.harga;

                }

                return 0;

            });

        }

        return result;

    }

},

watch:{

    filterUpbjj(newValue){

        if(!newValue){

            this.filterKategori='';

        }

    },

    'formInput.kode'(newValue){

    if(this.editMode){

        this.errorKode='';

        return;

    }

    const exist = this.stok.some(

        item =>

        item.kode.toUpperCase() ===
        newValue.toUpperCase()

    );

    this.errorKode =

    exist

    ?

    'Kode sudah digunakan'

    :

    '';
}
},

methods:{

    resetFilter(){

        this.filterUpbjj='';

        this.filterKategori='';

        this.filterReorder=false;

        this.sortBy='';

    },

    bukaTambah(){

        this.editMode=false;

        this.showForm=true;

        this.resetForm();

    },

    bukaEdit(item,index){

        this.editMode=true;

        this.showForm=true;

        this.selectedIndex=index;

        this.formInput={

            ...item

        };

    },

    resetForm(){

        this.formInput={

            kode:'',

            judul:'',

            kategori:'MK Wajib',

            upbjj:'Jakarta',

            lokasiRak:'',

            harga:0,

            qty:0,

            safety:0,

            catatanHTML:''

        };

    },

    simpanData(){

        if(this.errorKode){

            return;

        }

        this.stok.push({

            ...this.formInput

        });

        alert(

            'Data berhasil ditambahkan'

        );

        this.showForm=false;

    },

    updateData(){

        this.$set(

            this.stok,

            this.selectedIndex,

            {

                ...this.formInput

            }

        );

        alert(

            'Data berhasil diperbarui'

        );

        this.showForm=false;

    },

    hapusData(index){

        const konfirmasi=

        confirm(

            'Yakin ingin menghapus data?'

        );

        if(konfirmasi){

            this.stok.splice(

                index,

                1

            );

        }

    }

}

}

);

