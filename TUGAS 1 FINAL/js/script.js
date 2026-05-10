// LOGIN
const loginForm = document.getElementById("loginForm");

if(loginForm){
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user = dataPengguna.find(
            u => u.email === email && u.password === password
        );

        if(user){
            localStorage.setItem("userLogin", user.nama);
            window.location.href = "dashboard.html";
        }else{
            alert("email/password yang anda masukkan salah");
        }
    });
}

// MODAL
function openModal(id){
    document.getElementById(id).style.display = "block";
}

function closeModal(id){
    document.getElementById(id).style.display = "none";
}

// GREETING
const greeting = document.getElementById("greeting");

if(greeting){
    const jam = new Date().getHours();

    if(jam < 12){
        greeting.innerHTML = "Selamat Pagi ☀️";
    }else if(jam < 18){
        greeting.innerHTML = "Selamat Siang 🌤️";
    }else{
        greeting.innerHTML = "Selamat Malam 🌙";
    }
}

// TRACKING
function cariTracking() {

    const nomor = document.getElementById("nomorDO").value;
    const hasil = document.getElementById("hasilTracking");

    const data = dataTracking[nomor];

    if (!data) {
        hasil.innerHTML = `
            <div class="tracking-card">
                <h2>❌ Data tidak ditemukan</h2>
                <p>    Nomor Delivery Order tidak tersedia.</p>
            </div>
        `;
        return;
    }

    let perjalananHTML = "";

    data.perjalanan.forEach(item => {

        perjalananHTML += `
            <div class="timeline-item">
                <strong>${item.waktu}</strong>
                <p>${item.keterangan}</p>
            </div>
        `;
    });

    let statusClass = "dikirim";
    let progress = "40%";

    if (data.status === "Dalam Perjalanan") {
        statusClass = "perjalanan";
        progress = "75%";
    }

    if (data.status === "Selesai Antar") {
        statusClass = "selesai";
        progress = "100%";
    }

    hasil.innerHTML = `

    <div class="tracking-card">

        <div class="tracking-header">
            <h2>🚚 Tracking Pengiriman</h2>

            <div class="status ${statusClass}">
                ${data.status}
            </div>
        </div>

        <div class="detail-grid">

            <div class="detail-box">
                <h4>Nama Mahasiswa</h4>
                <p>${data.nama}</p>
            </div>

            <div class="detail-box">
                <h4>Ekspedisi</h4>
                <p>${data.ekspedisi}</p>
            </div>

            <div class="detail-box">
                <h4>Tanggal Kirim</h4>
                <p>${data.tanggalKirim}</p>
            </div>

            <div class="detail-box">
                <h4>Jenis Paket</h4>
                <p>${data.paket}</p>
            </div>

            <div class="detail-box">
                <h4>Total Pembayaran</h4>
                <p>${data.total}</p>
            </div>

            <div class="detail-box">
                <h4>Nomor DO</h4>
                <p>${data.nomorDO}</p>
            </div>

        </div>

        <h3>Riwayat Perjalanan Paket</h3>

        <div class="timeline">
            ${perjalananHTML}
        </div>

    </div>
    `;
}

// STOK BAHAN AJAR
const stokList = document.getElementById("stokList");

if(stokList){
    tampilkanStok();
}

function tampilkanStok(){
    stokList.innerHTML = "";

    dataBahanAjar.forEach(item => {
        stokList.innerHTML += `
            <div class="stok-card">
                <img src="${item.cover}" alt="${item.namaBarang}">

                <div class="stok-info">
                    <h3>${item.namaBarang}</h3>
                    <p><strong>Kode:</strong> ${item.kodeBarang}</p>
                    <p><strong>Jenis:</strong> ${item.jenisBarang}</p>
                    <p><strong>Edisi:</strong> ${item.edisi}</p>
                    <p><strong>Stok:</strong> ${item.stok}</p>
                </div>
            </div>
        `;
    });
}

function tambahStok(){
    const kode = document.getElementById("kodeBarang").value;
    const nama = document.getElementById("namaBarang").value;
    const stok = document.getElementById("stokBarang").value;
    const foto = document.getElementById("fotoBarang").files[0];

    if(kode === "" || nama === "" || stok === ""){
        alert("Semua data harus diisi!");
        return;
    }

    let imageURL = "https://via.placeholder.com/300x300.png?text=Buku+Baru";

    if(foto){
        imageURL = URL.createObjectURL(foto);
    }

    dataBahanAjar.push({
        kodeLokasi:"CUSTOM",
        kodeBarang:kode,
        namaBarang:nama,
        jenisBarang:"BMP",
        edisi:"1",
        stok:stok,
        cover:imageURL
    });

    tampilkanStok();

    alert("Data stok berhasil ditambahkan!");

    document.getElementById("kodeBarang").value = "";
    document.getElementById("namaBarang").value = "";
    document.getElementById("stokBarang").value = "";
    document.getElementById("fotoBarang").value = "";
}

// LOGOUT
function logout(){
    localStorage.removeItem("userLogin");
    window.location.href = "login.html";
}
