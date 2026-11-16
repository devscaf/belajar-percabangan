// =====================================================
// SIMULASI BATERAI HP
// Fungsi ini memperbarui angka, warna baterai, dan pesan.
function setBattery(level) {
  level = Number(level);
  if (!Number.isFinite(level) || level < 0 || level > 100) {
    throw new Error("Baterai harus berupa angka 0 sampai 100.");
  }

  level = Math.round(level);
  document.getElementById("batterySlider").value = level;
  document.getElementById("batteryValue").textContent = `${level}%`;
  document.getElementById("batteryNumber").textContent = `${level}%`;

  const fill = document.getElementById("batteryFill");
  const chargingMark = document.getElementById("chargingMark");
  const caption = document.getElementById("batteryCaption");
  fill.style.width = `${level}%`;

  if (level < 20) {
    fill.style.background = "#ef4444";
    chargingMark.classList.add("visible");
    caption.textContent = "Baterai lemah!";
    document.getElementById("batteryResult").textContent =
      "🪫 Baterai di bawah 20%. Segera isi daya HP!";
  } else {
    fill.style.background = "#2fc477";
    chargingMark.classList.remove("visible");
    caption.textContent = "Baterai masih cukup";
    document.getElementById("batteryResult").textContent =
      "🔋 Baterai 20% atau lebih. Belum perlu segera diisi daya.";
  }
}

// =====================================================
// SIMULASI LIFT 4 POSISI (LANTAI 0–3)
// Kabin bergerak dengan properti bottom agar tepat sejajar
// dengan baris lantai yang terlihat pada gedung.
function moveLift(floor) {
  floor = Number(floor);
  if (![1, 2, 3].includes(floor)) {
    throw new Error("Lift hanya bisa menuju lantai 1, 2, atau 3.");
  }

  const lift = document.getElementById("liftCar");
  // Kabin dasar berada di lantai 0 (bottom 8px).
  // Tiap lantai berjarak 25% dari tinggi area gedung.
  lift.style.bottom = `calc(8px + ${floor} * 25%)`;

  document.querySelectorAll(".floor-marker").forEach(marker => marker.classList.remove("active"));
  document.getElementById(`marker${floor}`).classList.add("active");

  document.getElementById("liftResult").textContent = `🛗 Lift sedang bergerak menuju lantai ${floor}...`;
  window.setTimeout(() => {
    document.getElementById("liftResult").textContent = `✅ Lift tiba di lantai ${floor}!`;
  }, 950);
}

// Contoh kode untuk masing-masing editor.
const examples = {
  battery: `let baterai = 15;

if (baterai < 20) {
  setBattery(baterai);
  console.log("Baterai lemah. Ayo isi daya!");
} else {
  setBattery(baterai);
  console.log("Baterai masih cukup.");
}`,
  lift: `let tombol = 2;

if (tombol === 1) {
  moveLift(1);
  console.log("Menuju lantai 1");
} else if (tombol === 2) {
  moveLift(2);
  console.log("Menuju lantai 2");
} else if (tombol === 3) {
  moveLift(3);
  console.log("Menuju lantai 3");
} else {
  console.log("Pilih tombol 1, 2, atau 3.");
}`
};

// Isi editor dengan contoh awal.
Object.entries(examples).forEach(([name, code]) => {
  document.getElementById(`${name}Code`).value = code;
});

// Kontrol manual baterai dan lift.
document.getElementById("batterySlider").addEventListener("input", event => {
  setBattery(event.target.value);
});
document.querySelectorAll("[data-floor]").forEach(button => {
  button.addEventListener("click", () => moveLift(button.dataset.floor));
});

// Tombol Jalankan: tampilkan loading sebentar, kemudian jalankan kode
// dari editor yang sesuai dan perbarui animasi di panel kiri.
document.querySelectorAll("[data-run]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.disabled) return;

    const name = button.dataset.run;
    const code = document.getElementById(`${name}Code`).value;
    const output = document.getElementById(`${name}Output`);
    const label = button.querySelector(".run-label");

    button.disabled = true;
    button.classList.add("loading");
    label.textContent = "Menjalankan...";
    output.textContent = "⏳ Sedang menjalankan kode...";

    window.setTimeout(() => {
      const messages = [];
      const studentConsole = {
        log: (...args) => messages.push(args.map(String).join(" "))
      };

      try {
        // Fungsi simulasi diberikan sebagai alat untuk kode latihan siswa.
        const execute = new Function("setBattery", "moveLift", "console", code);
        execute(setBattery, moveLift, studentConsole);

        output.textContent = messages.length
          ? "✅ Kode berhasil dijalankan dan animasi telah diperbarui.\\n" + messages.join("\\n")
          : "✅ Kode berhasil dijalankan dan animasi telah diperbarui!";
      } catch (error) {
        output.textContent = `❌ Periksa kembali kode kamu:\\n${error.message}`;
      } finally {
        button.disabled = false;
        button.classList.remove("loading");
        label.textContent = "▶ Jalankan Kode";
      }
    }, 1200);
  });
});

// Tombol reset mengembalikan kode awal untuk soal tersebut.
document.querySelectorAll("[data-reset]").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.reset;
    document.getElementById(`${name}Code`).value = examples[name];
    document.getElementById(`${name}Output`).textContent =
      "Contoh kode dikembalikan. Tekan Jalankan Kode untuk mencoba.";
  });
});

// Tampilan awal baterai sesuai nilai awal pada editor.
setBattery(75);
