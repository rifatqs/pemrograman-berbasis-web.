const ApiService = {

    async loadData(){

        try{

            const response = await fetch(
                'data/dataBahanAjar.json'
            );

            return await response.json();

        }

        catch(error){

            console.error(
                'Gagal memuat JSON',
                error
            );

        }

    }

};