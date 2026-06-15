Vue.filter(

'tanggalID',

function(value){

    if(!value) return '';

    const date =
    new Date(value);

    const bulan=[

        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'

    ];

    return date.getDate()
    + ' '
    + bulan[date.getMonth()]
    + ' '
    + date.getFullYear();

}

);

Vue.component(

'do-tracking',

{

template:'#tpl-tracking',

props:[

    'tracking',

    'paket',

    'pengirimanList'

],

data(){

    return{

        keyword:'',

        errorNIM:'',

        paketTerpilih:null,

        progressInput:{},

        formDO:{

            nim:'',

            nama:'',

            ekspedisi:'',

            paketKode:'',

            tanggalKirim:'',

            totalHarga:0

        }

    }

},

computed:{

    generatedDoNumber(){

    const tahun =
    new Date().getFullYear();

    const daftarDO =
    Object.keys(this.tracking);

    let max = 0;

    daftarDO.forEach(item=>{

        const nomor =

        parseInt(
            item.split('-')[1]
        );

        if(nomor > max){

            max = nomor;

        }

    });

    return `DO${tahun}-${String(
        max + 1
    ).padStart(3,'0')}`;

},

    hasilPencarian(){

        if(!this.keyword){

            return this.tracking;

        }

        const hasil={};

        Object.keys(

            this.tracking

        ).forEach(key=>{

            const item=

            this.tracking[key];

            if(

                key
                .toLowerCase()
                .includes(
                    this.keyword
                    .toLowerCase()
                )

                ||

                item.nim
                .includes(
                    this.keyword
                )

            ){

                hasil[key]=item;

            }

        });

        return hasil;

    }

},

watch:{

    'formDO.paketKode'(newValue){

        const dataPaket=

        this.paket.find(

            item=>

            item.kode===newValue

        );

        if(dataPaket){

            this.paketTerpilih=
            dataPaket;

            this.formDO.totalHarga=
            dataPaket.harga;

        }

    },

    'formDO.nim'(newValue){

        if(

            newValue &&
            !/^\d{9}$/.test(
                newValue
            )

        ){

            this.errorNIM=

            'NIM harus 9 digit angka';

        }

        else{

            this.errorNIM='';

        }

    }

},

mounted(){

    this.formDO.tanggalKirim=

    new Date()
    .toISOString()
    .split('T')[0];

},

methods:{

    cariDO(){

        console.log(
            'Cari:',
            this.keyword
        );

    },

    resetSearch(){

        this.keyword='';

    },

    simpanDO(){

        if(this.errorNIM){

            return;

        }

        const nomorDO=

        this.generatedDoNumber;

        this.$set(

            this.tracking,

            nomorDO,

            {

                nim:
                this.formDO.nim,

                nama:
                this.formDO.nama,

                status:
                'Diproses',

                ekspedisi:
                this.formDO.ekspedisi,

                tanggalKirim:
                this.formDO.tanggalKirim,

                paket:
                this.formDO.paketKode,

                total:
                this.formDO.totalHarga,

                perjalanan:[

                    {

                        waktu:
                        new Date()
                        .toLocaleString(),

                        keterangan:
                        'DO berhasil dibuat'

                    }

                ]

            }

        );

        alert(
            'DO berhasil dibuat'
        );

        this.formDO={

            nim:'',

            nama:'',

            ekspedisi:'',

            paketKode:'',

            tanggalKirim:
            new Date()
            .toISOString()
            .split('T')[0],

            totalHarga:0

        };

        this.paketTerpilih=
        null;

    },

    tambahProgress(noDO){

        if(

            !this.progressInput[
                noDO
            ]

        ){

            return;

        }

        this.tracking[
            noDO
        ].perjalanan.push({

            waktu:
            new Date()
            .toLocaleString(),

            keterangan:
            this.progressInput[
                noDO
            ]

        });

        this.progressInput[
            noDO
        ]='';

    }

}

}

);