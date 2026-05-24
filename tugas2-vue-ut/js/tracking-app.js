var app = new Vue({
    el: '#app',
    data: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        pengirimanList: [
            { kode: "REG", nama: "Reguler (3-5 hari)" },
            { kode: "EXP", nama: "Ekspres (1-2 hari)" }
        ],
        paket: [
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
        ],

        // Input data penampung transaksi baru
        formDO: {
            nim: '', nama: '', ekspedisi: '', paketKode: '', tanggalKirim: '', totalHarga: 0
        },
        errorNIM: '',
        paketTerpilih: null, // Berperan memetakan isi paket yang terikat drop down

        tracking: {
            "DO2026-0001": {
                nim: "123456789", nama: "Rina Wulandari", status: "Dalam Perjalanan", ekspedisi: "Reguler (3-5 hari)",
                tanggalKirim: "2026-05-20", paket: "PAKET-UT-001", total: 120000,
                perjalanan: [
                    { waktu: "2026-05-20 10:12:20", keterangan: "Penerimaan di Loket Hub UT Pusat" },
                    { waktu: "2026-05-22 14:07:56", keterangan: "Paket lolos sortir penyortiran wilayah" }
                ]
            }
        }
    },
    mounted() {
        // Otomatis mengeset input tanggal kirim form ke tanggal hari ini secara lokal
        const hariIni = new Date().toISOString().split('T')[0];
        this.formDO.tanggalKirim = hariIni;
    },
    computed: {
        // Menghitung & generate nomor DO berikutnya secara aman berbasis tahun kalender berjalan saat ini
        generatedDoNumber() {
            const tahunAktif = new Date().getFullYear(); // Dinamis mengambil tahun saat ini (2026)
            const keys = Object.keys(this.tracking);
            
            // Menyaring runutan nomor urut yang memiliki prefiks tahun aktif
            const filterTahun = keys.filter(k => k.startsWith(`DO${tahunAktif}-`));
            
            if (filterTahun.length === 0) {
                return `DO${tahunAktif}-0001`;
            }
            
            // Menemukan indeks urutan angka paling tinggi yang tercatat
            const urutanAngka = filterTahun.map(k => parseInt(k.split('-')[1]));
            const maxSequence = Math.max(...urutanAngka);
            const nextSequence = String(maxSequence + 1).padStart(4, '0');
            
            return `DO${tahunAktif}-${nextSequence}`;
        }
    },
    watch: {
        // WATCHER 1: Mendeteksi penukaran opsi paket untuk update instan detail isi & harga objek referensi
        'formDO.paketKode': function(newKode) {
            if (!newKode) {
                this.paketTerpilih = null;
                this.formDO.totalHarga = 0;
                return;
            }
            const dataPaket = this.paket.find(p => p.kode === newKode);
            this.paketTerpilih = dataPaket;
            this.formDO.totalHarga = dataPaket.harga; // Otomatis mengisi total biaya
        },
        
        // WATCHER 2: Memvalidasi pola masukan NIM agar patuh aturan angka murni sepanjang 9 karakter
        'formDO.nim': function(newNIM) {
            const regexAngka = /^[0-8]+$/; // Sederhana cek deret angka
            if (newNIM && (newNIM.length !== 9 || isNaN(newNIM))) {
                this.errorNIM = 'NIM Mahasiswa wajib berupa 9 digit kombinasi angka murni!';
            } else {
                this.errorNIM = '';
            }
        }
    },
    methods: {
        simpanDO() {
            if (this.errorNIM) return;

            const targetDoKey = this.generatedDoNumber;
            const waktuSekarang = new Date().toISOString().replace('T', ' ').substring(0, 19);

            // Memasukkan entri data reaktif ke dalam daftar manifes pelacakan
            this.$set(this.tracking, targetDoKey, {
                nim: this.formDO.nim,
                nama: this.formDO.nama,
                status: "Diproses di Gudang",
                ekspedisi: this.formDO.ekspedisi,
                tanggalKirim: this.formDO.tanggalKirim,
                paket: this.formDO.paketKode,
                total: this.formDO.totalHarga,
                perjalanan: [
                    { waktu: waktuSekarang, keterangan: "Delivery Order berhasil dicetak oleh sistem admisi" }
                ]
            });

            // Reset Form sesudah input berhasil disubmit
            this.formDO.nim = '';
            this.formDO.nama = '';
            this.formDO.ekspedisi = '';
            this.formDO.paketKode = '';
            this.formDO.totalHarga = 0;
            this.formDO.tanggalKirim = new Date().toISOString().split('T')[0];
        }
    }
});