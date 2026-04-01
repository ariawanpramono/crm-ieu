const sidebarContent = `
    <div class="profile-container">
        <a href="#" class="gear-icon-top">⚙️</a>
        <div class="profile-content">
            <img src="assets/image/pp.jpg" alt="Profile" class="profile-img-large">
            <div class="user-info">
                <span class="user-name-big">Sales Admin</span>
                <span class="user-role">Administrator</span>
            </div>
        </div>
    </div>
    <hr class="divider">
    <ul class="menu-list">
        <li onclick="location.href='index.html'">🏠 Dashboard</li>
        <li onclick="location.href='customer.html'">👥 Customer</li>
        <li>📊 Laporan</li>
    </ul>
`;

// Memasukkan isi ke dalam ID sidebar-target
document.getElementById("sidebar-target").innerHTML = sidebarContent;

// Ambil elemen-elemen
const modal = document.getElementById("editModal");
const closeBtn = document.querySelector(".close-btn");
const cancelBtn = document.querySelector(".btn-cancel");

// Fungsi untuk membuka modal (Nanti dipicu oleh tombol pensil)
function openEditModal() {
    modal.style.display = "block";
}

// Fungsi untuk menutup modal
function closeModal() {
    modal.style.display = "none";
}

// Event listener (Klik X atau Batal untuk tutup)
closeBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;

// Tutup modal jika user klik di luar kotak putih
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Sales detail modal
function openSalesDetail(name) {
    // 1. Simulasi data (Nanti ambil dari database)
    let dataBudi = {
        nama: "Budi Santoso",
        nip: "202401001",
        level: "Senior Sales",
        sekolah: [
            { nama: "SMA Negeri 1 Jakarta", status: "Signed", action: "Kick-off" },
            { nama: "SMA Taruna Jaya", status: "Hot", action: "Presentasi" }
        ]
    };

    // 2. Isi data ke Popup
    document.getElementById("popSalesNama").innerText = dataBudi.nama;
    document.getElementById("popSalesNIP").innerText = "NIP: " + dataBudi.nip;
    
    // 3. Isi Tabel di dalam Popup
    let tableHTML = "";
    dataBudi.sekolah.forEach(s => {
        tableHTML += `<tr>
            <td>${s.nama}</td>
            <td><span class="badge ${s.status.toLowerCase()}">${s.status}</span></td>
            <td>${s.action}</td>
        </tr>`;
    });
    document.getElementById("popSalesTableBody").innerHTML = tableHTML;

    // 4. Munculkan Modal
    document.getElementById("salesModal").style.display = "block";
}

function closeSalesModal() {
    document.getElementById("salesModal").style.display = "none";
}

function openSchoolDetail(id) {
    // Simulasi data dengan tambahan Tipe Sekolah
    let dataSekolah = {
        id: "SCH-001",
        nama: "SMA Negeri 1 Jakarta",
        tipe: "Nasional / Negeri", // Bisa diganti: Kristen, Katolik, Islam, dll.
        kota: "Jakarta Selatan",
        alamat: "Jl. Budi Utomo No. 7, Sawah Besar",
        yayasan: "Pemerintah DKI Jakarta",
        kepsek: "Drs. H. Mulyadi",
        pic: "Ibu Siti (0812-3456-7890)",
        status: "Signed",
        siswa: 1200,
        cakupan: "Full Join (Seluruh Angkatan)"
    };

    // Masukkan ke elemen tipe
    document.getElementById("popSchoolTipe").innerText = dataSekolah.tipe;
    
    // ... (kode pengisian data lainnya tetap sama seperti sebelumnya)
    document.getElementById("popSchoolNama").innerText = dataSekolah.nama;
    document.getElementById("popSchoolID").innerText = "ID: " + dataSekolah.id;
    document.getElementById("popSchoolKota").innerText = dataSekolah.kota;
    document.getElementById("popSchoolAlamat").innerText = dataSekolah.alamat;
    document.getElementById("popSchoolYayasan").innerText = dataSekolah.yayasan;
    document.getElementById("popSchoolKepsek").innerText = dataSekolah.kepsek;
    document.getElementById("popSchoolPIC").innerText = dataSekolah.pic;
    document.getElementById("popSchoolSiswa").innerText = dataSekolah.siswa;
    document.getElementById("popSchoolCakupan").innerText = dataSekolah.cakupan;

    document.getElementById("schoolModal").style.display = "block";
}

function closeSchoolModal() {
    document.getElementById("schoolModal").style.display = "none";
}

function openAddModal() {
    document.getElementById("addModal").style.display = "block";
}

function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

// Logika Simpan (Sementara simulasikan ke console dulu)
document.getElementById("addSchoolForm").onsubmit = function(e) {
    e.preventDefault();
    
    const nama = document.getElementById("addNama").value;
    const tipe = document.getElementById("addTipe").value;
    
    alert("Berhasil! Sekolah " + nama + " (" + tipe + ") telah didaftarkan ke sistem.");
    
    closeAddModal();
    this.reset(); // Kosongkan form setelah simpan
};

// Input NPSN
document.getElementById("addSchoolForm").onsubmit = function(e) {
    e.preventDefault();
    
    const idSekolah = document.getElementById("addID").value;
    const namaSekolah = document.getElementById("addNama").value;
    
    // Validasi sederhana: Pastikan ID tidak kosong
    if (idSekolah.trim() === "") {
        alert("PENTING: Nomor Induk Sekolah wajib diisi sebagai identitas utama!");
        return;
    }

    // Simulasi Berhasil
    alert("Berhasil! Sekolah dengan ID " + idSekolah + " (" + namaSekolah + ") telah terdaftar.");
    
    console.log("Data Baru Terdaftar:", {
        pk_id: idSekolah,
        nama: namaSekolah,
        tipe: document.getElementById("addTipe").value
        // ... field lainnya
    });

    closeAddModal();
    this.reset(); // Kosongkan form kembali
};