var app = new Vue({
    el: '#app',
    data: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        filterUpbjj: '',
        filterKategori: '',
        filterReorder: false,
        sortBy: '',
        
        // Form Input Model untuk item baru
        formInput: {
            kode: '', judul: '', kategori: 'MK Wajib', upbjj: 'Jakarta',
            lokasiRak: '', harga: 0, qty: 0, safety: 10, catatanHTML: ''
        },
        errorMsg: { kode: '' },
        selectedItem: null, // Wadah untuk edit operasional

        stok: [
            { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
            { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
            { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
            { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" }
        ]
    },
    computed: {
        // Optimasi: Memproses gabungan seluruh filter & sort dalam 1 pipeline computed agar tidak recompute berulang
        filteredStok() {
            let result = [...this.stok];

            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }
            // Sifat dependensi: Filter kategori dievaluasi jika filter utama wilayah terisi
            if (this.filterUpbjj && this.filterKategori) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }
            if (this.filterReorder) {
                result = result.filter(item => item.qty < item.safety || item.qty === 0);
            }
            if (this.sortBy) {
                result.sort((a, b) => {
                    if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
                    if (this.sortBy === 'qty') return a.qty - b.qty;
                    if (this.sortBy === 'harga') return a.harga - b.harga;
                    return 0;
                });
            }
            return result;
        }
    },
    watch: {
        // WATCHER 1: Otomatis membersihkan filter kategori jika filter induk daerah dikosongkan (Dependent Clean)
        filterUpbjj(newVal) {
            if (!newVal) {
                this.filterKategori = '';
            }
        },
        // WATCHER 2: Real-time validation untuk mencegah duplikasi kode mata kuliah saat input di form
        'formInput.kode': function(newKode) {
            const exists = this.stok.some(item => item.kode.toUpperCase() === newKode.toUpperCase());
            if (exists) {
                this.errorMsg.kode = 'Peringatan: Kode MK ini sudah terdaftar di gudang!';
            } else {
                this.errorMsg.kode = '';
            }
        }
    },
    methods: {
        resetFilter() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterReorder = false;
            this.sortBy = '';
        },
        setEditData(item) {
            // Melakukan klon objek sederhana agar perubahan input di modal bersifat sementara sebelum di-save
            this.selectedItem = Object.assign({}, item);
        },
        saveEdit() {
            const index = this.stok.findIndex(i => i.kode === this.selectedItem.kode);
            if (index !== -1) {
                this.stok[index].qty = this.selectedItem.qty;
            }
        },
        submitForm() {
            if (this.errorMsg.kode) return;
            // fallback catatan
            if (!this.formInput.catatanHTML) {
                this.formInput.catatanHTML =
                    '<span>-</span>';
            }

            // push data baru
            this.stok.push({
                ...this.formInput,
                kode:
                this.formInput.kode.toUpperCase()
            });

            // TUTUP MODAL
            const modalElement =
                document.getElementById(
                    'modalTambah'
                );
            const modalInstance =
                bootstrap.Modal.getInstance(
                    modalElement
                );
            modalInstance.hide();

            // ALERT SUKSES
            alert(
                'Data berhasil ditambahkan!'
            );

            // RESET FORM
            this.formInput = {
                kode: '',
                judul: '',
                kategori: 'MK Wajib',
                upbjj: 'Jakarta',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 10,
                catatanHTML: ''

            };

        }
    }
});