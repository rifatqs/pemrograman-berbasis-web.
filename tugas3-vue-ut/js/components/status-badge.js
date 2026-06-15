Vue.component(

'status-badge',

{

props:[

'qty',

'safety',

'catatan'

],

data(){

    return{

        hover:false

    }

},

computed:{

    cleanCatatan(){

        if(!this.catatan){

            return 'Tidak ada catatan';

        }

        return this.catatan.replace(

            /<[^>]*>/g,

            ''

        );

    }

},

template:`

<div

class="position-relative d-inline-block"

@mouseenter="hover=true"

@mouseleave="hover=false">

    <span

    v-if="qty===0"

    class="badge bg-danger">

    🔴 Kosong

    </span>

    <span

    v-else-if="qty<safety"

    class="badge bg-warning text-dark">

    🟠 Menipis

    </span>

    <span

    v-else

    class="badge bg-success">

    🟢 Aman

    </span>

    <div

    v-show="hover"

    class="tooltip-box">

    {{ cleanCatatan }}

    </div>

</div>

`

}

);