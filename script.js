// =====================================================
// SIMULASI BATERAI HP
// Memperbarui angka, warna baterai, dan pesan.
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
// SIMULASI LIFT 3 LANTAI (LANTAI 1–3)
// Lantai 1 adalah posisi awal. Input selain 1, 2, atau 3 ditolak.
function moveLift(floor) {
  floor = Number(floor);

  const result = document.getElementById("liftResult");

  if (![1, 2, 3].includes(floor)) {
    result.textContent = "⚠️ Pilih angka 1, 2, atau 3 saja!";
    return;
  }

  const lift = document.getElementById("liftCar");

  // Lantai 1 berada di posisi terbawah; lantai 2 dan 3 di atasnya.
  lift.style.bottom = `calc(8px + ${(floor - 1) * 33.333}% )`;

  document.querySelectorAll(".floor-marker").forEach(marker => {
    marker.classList.remove("active");
  });

  document.getElementById(`marker${floor}`).classList.add("active");

  result.textContent = `🛗 Lift sedang bergerak menuju lantai ${floor}...`;

  window.setTimeout(() => {
    result.textContent = `✅ Lift tiba di lantai ${floor}!`;
  }, 2300);
}


// =====================================================
// CONTOH KODE UNTUK MASING-MASING EDITOR.
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
  moveLift(tombol);
  console.log("Pilih angka 1, 2, atau 3 saja!");
}`
};


// =====================================================
// ISI EDITOR DENGAN CONTOH AWAL.
Object.entries(examples).forEach(([name, code]) => {
  document.getElementById(`${name}Code`).value = code;
});


// =====================================================
// KONTROL MANUAL BATERAI DAN LIFT.
document.getElementById("batterySlider").addEventListener("input", event => {
  setBattery(event.target.value);
});

document.querySelectorAll("[data-floor]").forEach(button => {
  button.addEventListener("click", () => {
    moveLift(button.dataset.floor);
  });
});


// =====================================================
// TOMBOL JALANKAN KODE.
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
        // Fungsi simulasi disediakan sebagai alat latihan siswa.
        const execute = new Function(
          "setBattery",
          "moveLift",
          "console",
          code
        );

        execute(setBattery, moveLift, studentConsole);

        output.textContent = messages.length
          ? "✅ Kode berhasil dijalankan dan animasi telah diperbarui.\n" +
            messages.join("\n")
          : "✅ Kode berhasil dijalankan dan animasi telah diperbarui!";
      } catch (error) {
        output.textContent =
          `❌ Periksa kembali kode kamu:\n${error.message}`;
      } finally {
        button.disabled = false;
        button.classList.remove("loading");
        label.textContent = "▶ Jalankan Kode";
      }
    }, 1200);
  });
});


// =====================================================
// TOMBOL RESET KODE.
document.querySelectorAll("[data-reset]").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.reset;

    document.getElementById(`${name}Code`).value = examples[name];
    document.getElementById(`${name}Output`).textContent =
      "Contoh kode dikembalikan. Tekan Jalankan Kode untuk mencoba.";
  });
});


// =====================================================
// TAMPILAN AWAL.
setBattery(75);
moveLift(1);
