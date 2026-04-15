// ==========================================
// 1. DATA MASTER & KONFIGURASI
// ==========================================
const currentUser = {
    nama: "Budi Santoso",
    role: "sales_admin", 
    wilayah: "Jakarta"
};

// Logika Reset Otomatis jika terdeteksi data lama di LocalStorage
let rawData = localStorage.getItem('crm_data_sekolah');
let schoolData;

if (rawData) {
    schoolData = JSON.parse(rawData);
    // Jika data lama belum punya field "kota", kita paksa reset agar struktur baru masuk
    if (!schoolData[0].hasOwnProperty('kota')) {
        localStorage.removeItem('crm_data_sekolah');
        location.reload();
    }
}

// Data Default (Jika LocalStorage kosong)
if (!schoolData) {
    schoolData = [
        { 
            id: "SCH-001", nama: "SMA Negeri 1 Jakarta", tipe: "Nasional", 
            status: "signed", sales: "Budi Santoso", rm: "Andi Wijaya",
            lat: -6.1751, lng: 106.8271, kota: "Jakarta Pusat", yayasan: "-",
            alamat: "Jl. Budi Utomo No.7", kepsek: "Drs. M. Zulkifli", 
            picNama: "Ibu Rahma", picKontak: "812345678", siswa: 1200 
        },
        { 
            id: "SCH-002", nama: "SMA Taruna Jaya", tipe: "Sekolah Islam", 
            status: "hot", sales: "Budi Santoso", rm: "Andi Wijaya",
            lat: -6.2146, lng: 106.8451, kota: "Jakarta Selatan", yayasan: "Yayasan Taruna",
            alamat: "Jl. Tebet Raya", kepsek: "H. Ahmad S.Pd", 
            picNama: "Pak Haji", picKontak: "812999888", siswa: 850 
        }
    ];
}

function saveData() {
    localStorage.setItem('crm_data_sekolah', JSON.stringify(schoolData));
}

let mapInstance = null;
let selectedSchoolId = null;
let statusChartInstance = null;

// ==========================================
// 2. FUNGSI LOGIKA DASAR (HELPERS)
// ==========================================
function getVisibleSchools() {
    if (currentUser.role === "sales_admin" || currentUser.role === "sales_head") {
        return schoolData;
    }
    return schoolData.filter(item => item.sales === currentUser.nama);
}

function canEditSchool() {
    return currentUser.role === "sales_admin" || currentUser.role === "sales_head";
}

function formatStatus(status) {
    const labels = {
        'hot': 'Hot Prospect',
        'signed': 'Signed',
        'approach': 'Initial Approach'
    };
    return labels[status] || status;
}

// ==========================================
// 3. FUNGSI DETAIL & EDIT TERPADU
// ==========================================
function openSchoolDetail(id) {
    const sekolah = schoolData.find(item => item.id === id);
    if (!sekolah) return;

    // Isi Data ke Modal Detail
    document.getElementById("popSchoolNama").innerText = sekolah.nama;
    document.getElementById("popSchoolID").innerText = "ID: " + sekolah.id;
    document.getElementById("popSchoolTipe").innerText = sekolah.tipe || "-";
    document.getElementById("popSchoolKota").innerText = sekolah.kota || "-";
    document.getElementById("popSchoolAlamat").innerText = sekolah.alamat || "-";
    document.getElementById("popSchoolYayasan").innerText = sekolah.yayasan || "-";
    document.getElementById("popSchoolKepsek").innerText = sekolah.kepsek || "-";
    document.getElementById("popSchoolPIC").innerText = (sekolah.picNama || "") + " (+62 " + (sekolah.picKontak || "-") + ")";
    document.getElementById("popSchoolSiswa").innerText = sekolah.siswa || "0";
    
    // Tampilkan Koordinat
    const coords = (sekolah.lat && sekolah.lng) ? `${sekolah.lat}, ${sekolah.lng}` : "Belum diatur";
    document.getElementById("popSchoolCoords").innerText = coords;

    // Badge Status
    const st = document.getElementById("popSchoolStatus");
    st.innerText = formatStatus(sekolah.status);
    st.className = "badge " + sekolah.status;

    // Link Tombol Edit di dalam Detail
    document.getElementById("btnEditDetail").onclick = function() {
        closeSchoolModal();
        openEditModal(id);
    };

    document.getElementById("schoolModal").style.display = "block";
}

function openEditModal(id) {
    const sekolah = schoolData.find(item => item.id === id);
    if (!sekolah) return;
    selectedSchoolId = id;
    document.getElementById("editID").value = sekolah.id;
    document.getElementById("editNama").value = sekolah.nama;
    document.getElementById("editStatus").value = sekolah.status;
    document.getElementById("editSales").value = sekolah.sales;
    document.getElementById("editRM").value = sekolah.rm;
    document.getElementById("editModal").style.display = "block";
}

function openEditDetailModal(id) {
    const sekolah = schoolData.find(item => item.id === id);
    if (!sekolah) return;
    selectedSchoolId = id;

    document.getElementById("edDetID").value = sekolah.id;
    document.getElementById("edDetNama").value = sekolah.nama;
    document.getElementById("edDetTipe").value = sekolah.tipe || "";
    document.getElementById("edDetKota").value = sekolah.kota || "";
    document.getElementById("edDetYayasan").value = sekolah.yayasan || "";
    document.getElementById("edDetKepsek").value = sekolah.kepsek || "";
    document.getElementById("edDetPICNama").value = sekolah.picNama || "";
    document.getElementById("edDetPICKontak").value = sekolah.picKontak || "";
    document.getElementById("edDetLat").value = sekolah.lat || "";
    document.getElementById("edDetLng").value = sekolah.lng || "";

    document.getElementById("editDetailModal").style.display = "block";
}

function openSalesDetail(nama) {
    document.getElementById("popSalesNama").innerText = nama;
    document.getElementById("salesModal").style.display = "block";
}

// ==========================================
// 4. RENDER TAMPILAN (UI)
// ==========================================
function renderCustomerTable() {
    const tableBody = document.getElementById("customerTableBody");
    if (!tableBody) return;

    const visibleSchools = getVisibleSchools();
    tableBody.innerHTML = "";

    visibleSchools.forEach(sekolah => {
        tableBody.innerHTML += `
            <tr>
                <td>${sekolah.id}</td>
                <td><a href="javascript:void(0)" onclick="openSchoolDetail('${sekolah.id}')" class="link-detail">${sekolah.nama}</a></td>
                <td>${sekolah.tipe}</td>
                <td><span class="badge ${sekolah.status}">${formatStatus(sekolah.status)}</span></td>
                <td><a href="javascript:void(0)" onclick="openSalesDetail('${sekolah.sales}')" class="link-user">${sekolah.sales}</a></td>
                <td>${sekolah.rm}</td>
                <td class="action-column">
                    ${canEditSchool() ? `<button class="btn-edit-icon" onclick="openEditModal('${sekolah.id}')">✏️</button>` : `-`}
                </td>
            </tr>
        `;
    });
}

function updateDashboardStats() {
    const hotCount = document.getElementById('hotCount');
    const signedCount = document.getElementById('signedCount');
    const approachCount = document.getElementById('approachCount'); // Pastikan ID sesuai HTML

    if (!schoolData) return; // Jaga-jaga kalau data belum dimuat

    // 1. Hitung Hot Prospect (Data 'hot' atau 'hot prospect')
    if (hotCount) {
        hotCount.textContent = schoolData.filter(s => {
            const st = s.status.toLowerCase().trim();
            return st === 'hot' || st === 'hot prospect';
        }).length;
    }

    // 2. Hitung Signed (Data 'signed')
    if (signedCount) {
        signedCount.textContent = schoolData.filter(s => {
            const st = s.status.toLowerCase().trim();
            return st === 'signed';
        }).length;
    }

    // 3. Hitung Initial Approach (Data 'approach' atau 'initial approach')
    if (approachCount) {
        approachCount.textContent = schoolData.filter(s => {
            const st = s.status.toLowerCase().trim();
            return st === 'approach' || st === 'initial approach';
        }).length;
    }
}

// ==========================================
// 5. MANAJEMEN FORM (SUBMIT)
// ==========================================
function initForms() {
    const addForm = document.getElementById("addSchoolForm");
    const editForm = document.getElementById("editForm");
    const editDetailForm = document.getElementById("editDetailForm");

    // Submit Tambah
    if (addForm) {
        addForm.onsubmit = function (e) {
            e.preventDefault();
            // ... (Kode tambah sekolah tetap sama seperti sebelumnya) ...
            const id = document.getElementById("addID").value.trim();
            const nama = document.getElementById("addNama").value.trim();
            schoolData.push({
                status: "approach",
                id: id, nama: nama, tipe: document.getElementById("addTipe").value,
                kota: document.getElementById("addKota").value, status: "approach",
                sales: currentUser.nama, rm: "Andi Wijaya",
                kepsek: document.getElementById("addKepsek").value,
                picNama: document.getElementById("addPICNama").value,
                picKontak: document.getElementById("addPICKontak").value.replace(/^0+/, ''),
                siswa: document.getElementById("addSiswa").value,
                lat: null, lng: null, yayasan: "", alamat: ""
            });
            refreshAll(); closeAddModal(); addForm.reset();
        };
    }

    // Submit Edit Tabel (Hanya 3 field)
    if (editForm) {
        editForm.onsubmit = function (e) {
            e.preventDefault();
            const idx = schoolData.findIndex(s => s.id === selectedSchoolId);
            schoolData[idx].status = document.getElementById("editStatus").value;
            schoolData[idx].sales = document.getElementById("editSales").value;
            schoolData[idx].rm = document.getElementById("editRM").value;
            refreshAll(); closeEditModal();
        };
    }

    // Submit Edit Detail (Lengkap)
    if (editDetailForm) {
        editDetailForm.onsubmit = function (e) {
            e.preventDefault();
            const idx = schoolData.findIndex(s => s.id === selectedSchoolId);
            schoolData[idx].tipe = document.getElementById("edDetTipe").value;
            schoolData[idx].kota = document.getElementById("edDetKota").value;
            schoolData[idx].yayasan = document.getElementById("edDetYayasan").value;
            schoolData[idx].kepsek = document.getElementById("edDetKepsek").value;
            schoolData[idx].picNama = document.getElementById("edDetPICNama").value;
            schoolData[idx].picKontak = document.getElementById("edDetPICKontak").value.replace(/^0+/, '');
            schoolData[idx].lat = document.getElementById("edDetLat").value ? parseFloat(document.getElementById("edDetLat").value) : null;
            schoolData[idx].lng = document.getElementById("edDetLng").value ? parseFloat(document.getElementById("edDetLng").value) : null;
            refreshAll(); closeEditDetailModal();
            alert("Informasi Detail Berhasil Diperbarui!");
        };
    }
}
    const addForm = document.getElementById("addSchoolForm");
    const editForm = document.getElementById("editForm");
    const editDetailForm = document.getElementById("editDetailForm");

    // Submit Tambah
    if (addForm) {
        addForm.onsubmit = function (e) {
            e.preventDefault();
            // ... (Kode tambah sekolah tetap sama seperti sebelumnya) ...
            const id = document.getElementById("addID").value.trim();
            const nama = document.getElementById("addNama").value.trim();
            schoolData.push({
                id: id, nama: nama, tipe: document.getElementById("addTipe").value,
                kota: document.getElementById("addKota").value, status: "approach",
                sales: currentUser.nama, rm: "Andi Wijaya",
                kepsek: document.getElementById("addKepsek").value,
                picNama: document.getElementById("addPICNama").value,
                picKontak: document.getElementById("addPICKontak").value.replace(/^0+/, ''),
                siswa: document.getElementById("addSiswa").value,
                lat: null, lng: null, yayasan: "", alamat: ""
            });
            refreshAll(); closeAddModal(); addForm.reset();
        };
    }

// ==========================================
// 6. FUNGSI PETA (LEAFLET.JS)
// ==========================================
function renderMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    mapInstance = L.map('map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(mapInstance);

    const markerGroup = L.featureGroup();

    schoolData.forEach(sekolah => {
    if (sekolah.lat && sekolah.lng) {
        let colorClass = 'marker-approach'; // Default Biru

        // Normalisasi status ke huruf kecil untuk pengecekan
        const statusData = sekolah.status.toLowerCase();

        if (statusData === 'signed') {
            colorClass = 'marker-signed';
        } else if (statusData === 'hot') {
            colorClass = 'marker-hot';
        } else if (statusData === 'approach' || statusData === 'initial approach') {
            // Jika datanya "approach" ATAU "initial approach", tetap pakai class biru
            colorClass = 'marker-approach';
        }

        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class='marker-pin ${colorClass}'></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        const marker = L.marker([sekolah.lat, sekolah.lng], { icon: customIcon });
        marker.bindPopup(`<b>${sekolah.nama}</b><br>${formatStatus(sekolah.status)}`);
        marker.addTo(markerGroup);
    }
});

    markerGroup.addTo(mapInstance);
    if (schoolData.some(s => s.lat && s.lng)) {
        mapInstance.fitBounds(markerGroup.getBounds(), { padding: [50, 50] });
    } else {
        mapInstance.setView([-6.2000, 106.8166], 11);
    }
    setTimeout(() => { mapInstance.invalidateSize(); }, 400);
}

// ==========================================
// 7. GRAFIK (CHART.JS)
// ==========================================
function renderStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const dataStatus = [
        schoolData.filter(s => s.status === 'signed').length,
        schoolData.filter(s => s.status === 'hot').length,
        schoolData.filter(s => s.status === 'approach').length
    ];

    if (statusChartInstance) { statusChartInstance.destroy(); }

    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Signed', 'Hot Prospect', 'Initial Approach'],
            datasets: [{
                data: dataStatus,
                backgroundColor: ['#28a745', '#f0ad4e', '#17a2b8'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// ==========================================
// 8. GLOBAL HELPERS
// ==========================================
function refreshAll() {
    saveData();
    renderCustomerTable();
    updateDashboardStats();
    renderStatusChart();
    renderMap();
}

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

// Fungsi Buka Tutup Modal
function closeEditModal() { document.getElementById("editModal").style.display = "none"; }
function openAddModal() { document.getElementById("addModal").style.display = "block"; }
function closeAddModal() { document.getElementById("addModal").style.display = "none"; }
function closeSalesModal() { document.getElementById("salesModal").style.display = "none"; }
function closeSchoolModal() { document.getElementById("schoolModal").style.display = "none"; }

// Sidebar Loader
const sbTarget = document.getElementById("sidebar-target");
if (sbTarget) {
    sbTarget.innerHTML = `
        <div class="profile-container">
            <a href="#" class="gear-icon-top">⚙️</a>
            <div class="profile-content">
                <img src="assets/image/pp.jpg" alt="Profile" class="profile-img-large">
                <div class="user-info">
                    <span class="user-name-big">${currentUser.nama}</span>
                    <span class="user-role">${currentUser.role.replace('_', ' ').toUpperCase()}</span>
                </div>
            </div>
        </div>
        <hr class="divider">
        <ul class="menu-list">
            <li onclick="location.href='index.html'">Dashboard</li>
            <li onclick="location.href='customer.html'">Customer</li>
            <li>Laporan</li>
        </ul>
    `;
}

function closeEditDetailModal() { document.getElementById("editDetailModal").style.display = "none"; }

// Update link di openSchoolDetail
function openSchoolDetail(id) {
    // ... (kode pengisian data detail tetap sama) ...
    document.getElementById("btnEditDetail").onclick = function() {
        closeSchoolModal();
        openEditDetailModal(id); // <--- Pakai fungsi baru
    };
    document.getElementById("schoolModal").style.display = "block";
}

// ==========================================
// 9. JALANKAN SAAT LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    refreshAll();
    initForms();
});




