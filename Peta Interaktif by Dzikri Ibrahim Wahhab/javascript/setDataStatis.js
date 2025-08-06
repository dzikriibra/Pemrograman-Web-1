// Data Statis
const visitedPlaces = [
  {
    name: "Gunung Bromo",
    coords: [-7.9425, 112.953],
    type: "mountain",
    description: "Gunung Bromo adalah gunung berapi aktif di Jawa Timur yang terkenal dengan matahari terbitnya.",
    images: ["img/bromo1.jpeg", "img/bromo2.jpeg"],
    marker: null,
  },
  {
    name: "Raja Ampat",
    coords: [-0.2346, 130.5121],
    type: "island",
    description: "Raja Ampat adalah surga bawah laut di Papua Barat dengan terumbu karang yang indah.",
    images: ["img/rajaampat1.jpeg", "img/rajaampat2.jpeg", "img/rajaampat3.jpeg"],
    marker: null,
  },
  {
    name: "Bali",
    coords: [-8.4095, 115.1889],
    type: "beach",
    description: "Bali adalah pulau wisata terkenal dengan budaya, pantai, dan kehidupan malamnya.",
    images: ["img/bali1.jpeg", "img/bali2.jpeg", "img/bali3.jpeg"],
    marker: null,
  },
  {
    name: "Danau Toba",
    coords: [2.6666, 98.875],
    type: "lake",
    description: "Danau vulkanik terbesar di Asia Tenggara dengan pulau Samosir di tengahnya.",
    images: ["img/toba1.jpeg", "img/toba2.jpeg"],
    marker: null,
  },
  {
    name: "Labuan Bajo",
    coords: [-8.4962, 119.8877],
    type: "harbor",
    description: "Pintu gerbang menuju Taman Nasional Komodo dan keindahan laut Flores.",
    images: ["img/labuanbajo1.jpeg", "img/labuanbajo2.jpeg"],
    marker: null,
  },
  {
    name: "Candi Borobudur",
    coords: [-7.6079, 110.2038],
    type: "temple",
    description: "Candi Budha terbesar di dunia dan warisan budaya UNESCO.",
    images: ["img/borobudur1.jpeg", "img/borobudur2.jpeg", "img/borobudur3.jpeg", "img/borobudur4.jpeg"],
    marker: null,
  },
  {
    name: "Tana Toraja",
    coords: [-3.0626, 119.8707],
    type: "cultural",
    description: "Daerah pegunungan dengan adat pemakaman unik dan rumah tongkonan.",
    images: ["img/toraja1.jpeg", "img/toraja2.jpeg", "img/toraja3.jpeg"],
    marker: null,
  },
  {
    name: "Wakatobi",
    coords: [-5.3233, 123.5477],
    type: "island",
    description: "Taman Nasional bawah laut terkenal dengan ekosistem laut yang kaya.",
    images: ["img/wakatobi1.jpeg", "img/wakatobi2.jpeg", "img/wakatobi3.jpeg"],
    marker: null,
  },
  {
    name: "Kepulauan Derawan",
    coords: [2.2833, 118.2333],
    type: "island",
    description: "Kepulauan tropis dengan pantai pasir putih dan penyu hijau.",
    images: ["img/derawan1.jpeg", "img/derawan2.jpeg", "img/derawan3.jpeg", "img/derawan4.jpeg"],
    marker: null,
  },
  {
    name: "Pulau Belitung",
    coords: [-2.8674, 107.9786],
    type: "island",
    description: "Pulau dengan pantai berbatu granit dan air jernih.",
    images: ["img/belitung1.jpeg", "img/belitung2.jpeg", "img/belitung3.jpeg", "img/belitung4.jpeg", "img/belitung5.jpeg"],
    marker: null,
  },
];

let dashedLine = null;

// Weather-circle
function getWeatherHTML(weather) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  return `
    <div style="text-align: center; margin-top: 10px;">
      <img src="${iconUrl}" alt="Cuaca" style="width: 100px; height: 100px; filter: drop-shadow(1px 1px 1px #000);" />
      <div style="font-size: 1.3em; font-weight: bold;">${weather.temp}&deg;C</div>
      <div style="font-size: 1.1em; text-transform: capitalize;">${weather.description}</div>
    </div>
  `;
}

// Card for Place Info
function createPopupHTML(place, weather) {
  const imageId = `carousel-${place.name.replace(/\s+/g, "")}`;
  const images = place.images;

  return `
    <div class="popup-container" style="width: 250px; font-family: 'Segoe UI', sans-serif; text-align: center;">
      <h3 style="font-size: 1.6em; padding-top: 0.8rem; padding-bottom: 0.8rem;">${place.name}</h3>

      <div style="position: relative;">
        <button class="prev-btn" data-id="${imageId}" 
          style="position: absolute; left: 5px; top: 40%; background: rgba(0,0,0,0.5); 
          color: white; border: none; font-size: 20px; cursor: pointer;">‹</button>

        <img id="${imageId}" 
          class="carousel-image"
          src="${images[0]}" 
          data-index="0" 
          data-images='${JSON.stringify(images)}' 
          style="width: 100%; height: auto; border-radius: 8px; transition: opacity 0.4s ease;" />

        <button class="next-btn" data-id="${imageId}" 
          style="position: absolute; right: 5px; top: 40%; background: rgba(0,0,0,0.5); 
          color: white; border: none; font-size: 20px; cursor: pointer;">›</button>
      </div>

      <p style="font-size: 1.1em; color: #444; margin-top: 10px;">${place.description}</p>

      <div style="margin-top: 10px;">
        ${weather ? getWeatherHTML(weather) : "<span style='color: gray'>Memuat cuaca...</span>"}
      </div>
    </div>
  `;
}

// API weather
function fetchWeather(coords, callback) {
  const [lat, lon] = coords;
  const apiKey = "9a81ddef53c90a3b8fa365c681e015c5";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      callback({
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    })
    .catch(() => callback(null));
}

function showVisitedPlaces() {
  if (dashedLine) map.removeLayer(dashedLine);

  visitedPlaces.forEach((place) => {
    if (!place.marker) {
      const iconUrl = `icons/${place.type}.png`;
      const customIcon = L.icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      place.marker = L.marker(place.coords, { icon: customIcon });
    }

    if (!map.hasLayer(place.marker)) {
      place.marker.addTo(map);
    }

    fetchWeather(place.coords, (weather) => {
      place.marker.bindPopup(createPopupHTML(place, weather));
      place.marker.openPopup();
    });
  });

  const lineCoordinates = visitedPlaces.map((place) => place.coords);
  dashedLine = L.polyline(lineCoordinates, {
    color: "blue",
    weight: 3,
    dashArray: "8, 8",
  }).addTo(map);

  const bounds = L.latLngBounds(visitedPlaces.map((p) => p.coords));
  map.flyToBounds(bounds, {
    padding: [52, 52],
    duration: 1.5,
    maxZoom: 13,
  });

  if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }
  if (accuracyCircle) {
    map.removeLayer(accuracyCircle);
    accuracyCircle = null;
  }
}

map.on("popupopen", () => {
  function changeImage(img, images, newIndex) {
    img.classList.add("fade-out");

    setTimeout(() => {
      img.src = images[newIndex];
      img.setAttribute("data-index", newIndex);

      img.classList.remove("fade-out");
      img.classList.add("fade-in");

      setTimeout(() => img.classList.remove("fade-in"), 500);
    }, 250); // separuh durasi buat efek keluar
  }

  document.querySelectorAll(".next-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const img = document.getElementById(id);
      const images = JSON.parse(img.getAttribute("data-images"));
      let index = parseInt(img.getAttribute("data-index"));
      index = (index + 1) % images.length;
      changeImage(img, images, index);
    });
  });

  document.querySelectorAll(".prev-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const img = document.getElementById(id);
      const images = JSON.parse(img.getAttribute("data-images"));
      let index = parseInt(img.getAttribute("data-index"));
      index = (index - 1 + images.length) % images.length;
      changeImage(img, images, index);
    });
  });
});

// eye-icons
const highlightBtn = document.getElementById("highlightBtn");
const highlightIcon = document.getElementById("highlightIcon");
let highlightMode = false;

// Misalnya ini adalah posisi awal map kamu (koordinat dan zoom saat load)
const defaultView = {
  center: [-6.893558098934743, 107.62118016672784],
  zoom: 13,
};

function resetHighlight() {
  // Hapus marker dari map
  visitedPlaces.forEach((place) => {
    if (place.marker && map.hasLayer(place.marker)) {
      map.removeLayer(place.marker);
    }
  });

  // Hapus garis
  if (dashedLine) {
    map.removeLayer(dashedLine);
    dashedLine = null;
  }
}

// Show & Hide Highlight
highlightBtn.addEventListener("click", () => {
  highlightMode = !highlightMode;

  if (highlightMode) {
    highlightIcon.classList.remove("bi-eye-fill");
    highlightIcon.classList.add("bi-eye-slash-fill");

    console.log("Highlight Aktif");
    showVisitedPlaces(); // tampilkan marker dan garis
  } else {
    highlightIcon.classList.remove("bi-eye-slash-fill");
    highlightIcon.classList.add("bi-eye-fill");

    console.log("Highlight Nonaktif");
    resetHighlight(); // hapus marker dan garis

    // Kembalikan posisi peta ke awal
    map.flyTo(defaultView.center, defaultView.zoom, {
      duration: 1.5,
    });
  }
  // Ganti isi tombol + ikon
  highlightBtn.innerHTML = ` 
    <i id="highlightIcon" class="bi ${highlightMode ? "bi-eye-slash-fill" : "bi-eye-fill"}"></i> 
    ${highlightMode ? "Unhighlight Visited Places" : "Highlight Visited Places"}
  `;

  // Ambil ulang referensi ikon karena sudah terganti oleh innerHTML baru
  highlightIcon = document.getElementById("highlightIcon");
});

// Card Place Sidebar
function renderHistoryCards() {
  const container = document.getElementById("history-container");
  container.innerHTML = "";

  visitedPlaces.forEach((place) => {
    const card = document.createElement("div");
    card.className = "card mb-2 shadow-sm";
    card.innerHTML = `
  <div class="row g-0">
    <div class="col-4">
      <img src="${place.images[0]}" class="img-fluid rounded-start sidebar-img" alt="${place.name}" />
    </div>
    <div class="col-8">
      <div class="card-body py-2 pe-2">
        <h6 class="card-title mb-1">${place.name}</h6>
        <p class="card-text small text-muted mb-0 truncate-description">${place.description}</p>
      </div>
    </div>
  </div>
`;

    container.appendChild(card);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  renderHistoryCards();
});
// Akhir Card Place Sidebar

// fungsi search sidebar
function renderHistoryCards(keyword = "") {
  const container = document.getElementById("history-container");
  container.innerHTML = "";

  visitedPlaces
    .filter((place) => place.name.toLowerCase().includes(keyword.toLowerCase()))
    .forEach((place) => {
      const card = document.createElement("div");
      card.className = "card mb-2 shadow-sm";
      card.innerHTML = `
        <div class="row g-0">
          <div class="col-4">
            <img src="${place.images[0]}" class="img-fluid rounded-start sidebar-img" alt="${place.name}" />
          </div>
          <div class="col-8">
            <div class="card-body py-2 pe-2">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="card-title mb-1">${place.name}</h6>
              </div>
              <p class="card-text small text-muted mb-0 truncate-description">${place.description}</p>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  renderHistoryCards();

  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim();
    renderHistoryCards(keyword);
  });
});
// Akhir fungsi search sidebar
