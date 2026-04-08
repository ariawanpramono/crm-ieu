const currentUser = {
    nama: "Budi Santoso",
    role: "sales_admin", // ganti: "sales", "sales_head", "sales_admin"
    wilayah: "Jakarta"
};


const schoolData = [
    {
        id: "SCH-001",
        nama: "SMA Negeri 1 Jakarta",
        tipe: "Nasional / Negeri",
        status: "signed",
        sales: "Budi Santoso",
        rm: "Andi Wijaya"
    },
    {
        id: "SCH-002",
        nama: "SMA Taruna Jaya",
        tipe: "Islam",
        status: "hot",
        sales: "Budi Santoso",
        rm: "Andi Wijaya"
    },
    {
        id: "SCH-003",
        nama: "SMA Bina Bangsa",
        tipe: "Kristen",
        status: "approach",
        sales: "Sari Lestari",
        rm: "Andi Wijaya"
    }
];

let selectedSchoolId = null;

function getVisibleSchools() {
    if (currentUser.role === "sales_admin" || currentUser.role === "sales_head") {
        return schoolData;
    }

    if (currentUser.role === "sales") {
        return schoolData.filter(item => item.sales === currentUser.nama);
    }

    return [];
}

function canEditSchool() {
    return currentUser.role === "sales_admin" || currentUser.role === "sales_head";
}

function renderCustomerTable() {
    const tableBody = document.getElementById("customerTableBody");
    if (!tableBody) return;

    const visibleSchools = getVisibleSchools();

    tableBody.innerHTML = "";

    visibleSchools.forEach(sekolah => {
        tableBody.innerHTML += `
            <tr>
                <td>${sekolah.id}</td>
                <td>
                    <a href="javascript:void(0)" onclick="openSchoolDetail('${sekolah.id}')" class="link-detail">
                        ${sekolah.nama}
                    </a>
                </td>
                <td>${sekolah.tipe}</td>
                <td><span class="badge ${sekolah.status}">${formatStatus(sekolah.status)}</span></td>
                <td>
                    <a href="javascript:void(0)" onclick="openSalesDetail('${sekolah.sales}')" class="link-user">
                        ${sekolah.sales}
                    </a>
                </td>
                <td>${sekolah.rm}</td>
                <td class="action-column">
                 ${canEditSchool()
                ? `<button class="btn-edit-icon" onclick="openEditModal('${sekolah.id}')">✏️</button>`
                : `-`
            }
                </td>
            </tr>
        `;
    });
}

function formatStatus(status) {
    if (status === "hot") return "Hot Prospect";
    if (status === "signed") return "Signed";
    if (status === "approach") return "Initial Approach";
    if (status === "cold") return "Cold Lead";
    return status;
}

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

// Update summary numbers
document.addEventListener('DOMContentLoaded', function () {
    updateDashboardStats();
});

// Simulasi data dashboard
function updateDashboardStats() {
    const hotCount = document.getElementById('hotCount');
    const signedCount = document.getElementById('signedCount');
    const totalCount = document.getElementById('totalCount');

    if (hotCount) hotCount.textContent = '15';
    if (signedCount) signedCount.textContent = '8';
    if (totalCount) totalCount.textContent = '32';
}

// Memasukkan isi ke dalam ID sidebar-target
document.getElementById("sidebar-target").innerHTML = sidebarContent;

function openEditModal(id) {
    const sekolah = schoolData.find(item => item.id === id);
    if (!sekolah) return;

    selectedSchoolId = id;

    const editId = document.getElementById("editID");
    const editNama = document.getElementById("editNama");
    const editStatus = document.getElementById("editStatus");
    const editSales = document.getElementById("editSales");
    const editRM = document.getElementById("editRM");

    if (editId) editId.value = sekolah.id;
    if (editNama) editNama.value = sekolah.nama;
    if (editStatus) editStatus.value = sekolah.status;
    if (editSales) editSales.value = sekolah.sales;
    if (editRM) editRM.value = sekolah.rm;

    document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Tutup modal jika user klik di luar kotak putih
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
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

document.addEventListener("DOMContentLoaded", function () {
    const addForm = document.getElementById("addSchoolForm");

    if (addForm) {
        addForm.onsubmit = function (e) {
            e.preventDefault();

            const idSekolah = document.getElementById("addID").value.trim();
            const namaSekolah = document.getElementById("addNama").value.trim();
            const tipe = document.getElementById("addTipe").value;
            const status = document.getElementById("addStatus").value;
            const sales = currentUser.nama;
            const rm = "Andi Wijaya";

            if (idSekolah === "") {
                alert("PENTING: Nomor Induk Sekolah wajib diisi sebagai identitas utama!");
                return;
            }

            if (namaSekolah === "") {
                alert("Nama sekolah wajib diisi!");
                return;
            }

            const isDuplicate = schoolData.some(item => item.id === idSekolah);
            if (isDuplicate) {
                alert("Nomor Induk Sekolah sudah terdaftar. Gunakan ID yang unik!");
                return;
            }

            const newSchool = {
                id: idSekolah,
                nama: namaSekolah,
                tipe: tipe,
                status: status,
                sales: sales,
                rm: rm
            };

            schoolData.push(newSchool);
            renderCustomerTable();
            closeAddModal();
            addForm.reset();

            alert(`Berhasil! Sekolah ${namaSekolah} dengan ID ${idSekolah} telah ditambahkan.   `);
        };
    }
});
const addForm = document.getElementById("addSchoolForm");
if (addForm) {
    addForm.onsubmit = function (e) {
        e.preventDefault();
        // ... kode yang sudah ada
    };
}

function filterTable() {
    const keyword = document.getElementById("searchSekolah").value.toLowerCase();
    const status = document.getElementById("filterStatus").value;
    const rows = document.querySelectorAll("#customerTableBody tr");

    rows.forEach(row => {
        const nama = row.cells[1].textContent.toLowerCase();
        const badgeClass = row.cells[3].querySelector(".badge")?.className || "";
        const matchKeyword = nama.includes(keyword);
        const matchStatus = status === "all" || badgeClass.includes(status);
        row.style.display = matchKeyword && matchStatus ? "" : "none";
    });
}

// Fix error null di customer.html
function initForms() {
    // Cek apakah form ada dulu
    const addForm = document.getElementById("addSchoolForm");
    const editForm = document.getElementById("editForm");

    if (addForm) {
        addForm.onsubmit = function (e) {
            e.preventDefault();
            const idSekolah = document.getElementById("addID").value;
            if (idSekolah.trim() === "") {
                alert("Nomor Induk Sekolah wajib diisi!");
                return;
            }
            alert(`Berhasil! Sekolah ID ${idSekolah} tersimpan.`);
            closeAddModal();
            addForm.reset();
        };
    } else {
        console.log("addSchoolForm tidak ditemukan - mungkin bukan halaman customer");
    }

    if (editForm) {
        editForm.onsubmit = function (e) {
            e.preventDefault();

            const sekolah = schoolData.find(item => item.id === selectedSchoolId);
            if (!sekolah) return;

            sekolah.nama = document.getElementById("editNama").value;
            sekolah.status = document.getElementById("editStatus").value;
            sekolah.sales = document.getElementById("editSales").value;
            sekolah.rm = document.getElementById("editRM").value;

            renderCustomerTable();
            closeEditModal();
            alert("Data sekolah berhasil diupdate!");
        };
    }
}

// Filter tabel customer
function filterTable() {
    const keyword = document.getElementById("searchSekolah")?.value.toLowerCase() || "";
    const status = document.getElementById("filterStatus")?.value || "all";
    const rows = document.querySelectorAll("#customerTableBody tr");

    rows.forEach(row => {
        const nama = row.cells[1]?.textContent.toLowerCase() || "";
        const badgeClass = row.cells[3]?.querySelector(".badge")?.className || "";
        const matchKeyword = nama.includes(keyword);
        const matchStatus = status === "all" || badgeClass.includes(status);
        row.style.display = matchKeyword && matchStatus ? "" : "none";
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const addForm = document.getElementById("addSchoolForm");

    if (addForm) {
        addForm.onsubmit = function (e) {
            e.preventDefault();

            const idSekolah = document.getElementById("addID").value;
            const namaSekolah = document.getElementById("addNama").value;
            const tipe = document.getElementById("addTipe").value;

            if (idSekolah.trim() === "") {
                alert("PENTING: Nomor Induk Sekolah wajib diisi sebagai identitas utama!");
                return;
            }

            alert(`Berhasil! Sekolah ${namaSekolah} (${tipe}) dengan ID ${idSekolah} telah terdaftar.`);
            closeAddModal();
            addForm.reset();
        };
    }

    const hotCount = document.getElementById("hotCount");
    const signedCount = document.getElementById("signedCount");
    const totalCount = document.getElementById("totalCount");

    if (hotCount) hotCount.textContent = "15";
    if (signedCount) signedCount.textContent = "8";
    if (totalCount) totalCount.textContent = "32";
});

// Inisialisasi saat halaman load
document.addEventListener('DOMContentLoaded', function () {
    renderCustomerTable();
    initForms();
    updateDashboardStats(); // Untuk index.html
    // loadCustomerData(); // Load data ke tabel customer
});