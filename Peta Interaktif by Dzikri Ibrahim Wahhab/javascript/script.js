const map = L.map("map").setView([-6.9147, 107.6098], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Locate Me feature
let userMarker;
let accuracyCircle;

document.getElementById("locateMeBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung oleh browser ini.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      // Hapus marker & circle sebelumnya jika ada
      if (userMarker) {
        map.removeLayer(userMarker);
      }
      if (accuracyCircle) {
        map.removeLayer(accuracyCircle);
      }

      // Hapus visitedPlaces dulu supaya fokus ke lokasi user
      visitedPlaces.forEach((place) => {
        if (place.marker && map.hasLayer(place.marker)) {
          map.removeLayer(place.marker);
        }
      });
      if (dashedLine && map.hasLayer(dashedLine)) {
        map.removeLayer(dashedLine);
      }

      // Tambahkan marker lokasi pengguna
      userMarker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`Lokasi Anda<br>Akurasi: ${Math.round(accuracy)} meter`)
        .openPopup();

      // Tambahkan lingkaran akurasi
      accuracyCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        color: "#28a745",
        fillColor: "#28a745",
        fillOpacity: 0.2,
      }).addTo(map);

      // Pusatkan peta ke lokasi pengguna
      map.setView([latitude, longitude], 16);
    },
    (error) => {
      alert("Gagal mendapatkan lokasi: " + error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
});

// Fungsi dipanggil saat klik tombol highlight
document.getElementById("highlightBtn").addEventListener("click", () => {
  showVisitedPlaces();

  const isMobile = window.innerWidth <= 576;
  if (isMobile) {
    document.getElementById("sidebar").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 600);
});

// sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const main = document.getElementById("main");
  const isMobile = window.innerWidth <= 576;

  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");

  if (!isMobile) {
    main.classList.toggle("shifted");
  }

  if (isMobile) {
    setTimeout(() => {
      map.invalidateSize();
    }, 600);
  }
}
