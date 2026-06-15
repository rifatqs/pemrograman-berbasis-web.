Vue.component(

'app-modal',

{

template:`

<div
v-if="show"
class="custom-modal">

<div
class="custom-modal-content">

<h4>

{{title}}

</h4>

<slot></slot>

<div class="mt-3">

<button

class="btn btn-secondary"

@click="$emit('close')">

Tutup

</button>

</div>

</div>

</div>

`,

props:[

'show',

'title'

]

}

);