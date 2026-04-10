function loadSharedBouquet() {
    const params = new URLSearchParams(location.search);
    const encoded = params.get("bouquet");

    if (!encoded) return; // normal mode

    const data = JSON.parse(decodeURIComponent(encoded));

    // Load bouquet + accessory into localStorage (safe)
    localStorage.setItem("flowers", JSON.stringify(data.flowers));
    localStorage.setItem("accessory", data.accessory);

    // Load note ONLY into the UI (NOT into localStorage)
    const noteBox = document.getElementById("note-box");
    noteBox.value = data.note || "";

    // Lock the note so it cannot be edited
    noteBox.readOnly = true;
    noteBox.classList.add("locked-note");

     // HIDE buttons in shared mode
    document.getElementById("new-arrangement-btn").style.display = "none";
    document.getElementById("share-btn").style.display = "none";

    // Play confetti when viewing a shared bouquet
confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
});

    renderBouquet();
}


// ---------------- FLOWERS ----------------

const flowerList = Array.from({ length: 12 }, (_, i) => ({
  name: `flower-${i + 2}`,
  src: `flower-${i + 2}.png`
}));

const accessoryList = Array.from({ length: 6 }, (_, i) => ({
  name: `accessory-${i + 1}`,
  src: `accessory-${i + 1}.png`
}));

// Load previous selections or empty
let selectedFlowers = JSON.parse(localStorage.getItem("flowers") || "[]");


// ---------------- LOAD FLOWERS ----------------

function loadFlowerOptions() {
    const grid = document.getElementById("flower-grid");

    flowerList.forEach(f => {
        const wrapper = document.createElement("div");
        wrapper.className = "flower-wrapper";

        const btn = document.createElement("button");
        btn.className = "item-btn";

        btn.innerHTML = `
            <img src="${f.src}" class="item-img spin">
            <div class="badge" id="badge-${f.name}">0</div>
        `;


        // Add flower (duplicates allowed)
        btn.onclick = () => addFlower(f);

        wrapper.appendChild(btn);
        grid.appendChild(wrapper);
    });

    updateBadges();
}


// ---------------- ADD FLOWER (duplicates allowed) ----------------

function addFlower(flower) {
    if (selectedFlowers.length >= 7) return;

    selectedFlowers.push(flower);
    localStorage.setItem("flowers", JSON.stringify(selectedFlowers));

    updateBadges();

    const nextBtn = document.getElementById("next-btn");
    nextBtn.disabled = selectedFlowers.length !== 7;

    if (selectedFlowers.length === 7) {
        nextBtn.onclick = () => location.href = "accessories.html";
    }
}


// ---------------- BADGE UPDATE ----------------

function updateBadges() {
    flowerList.forEach(f => {
        const count = selectedFlowers.filter(x => x.name === f.name).length;
        const badge = document.getElementById(`badge-${f.name}`);

        // Button disabled unless exactly 7 flowers selected
        document.getElementById("next-btn").disabled = selectedFlowers.length !== 7;

        if (count > 0) {
            badge.textContent = count;
            badge.style.display = "flex";
        } else {
            badge.style.display = "none";
        }
    });
}


// ---------------- CLEAR SELECTION ----------------

function clearSelection() {
    selectedFlowers = [];
    localStorage.setItem("flowers", "[]");
    updateBadges();

    const nextBtn = document.getElementById("next-btn");
    nextBtn.disabled = true;   // stays disabled until 7 flowers selected
}

// ---------------- ACCESSORIES ----------------

function loadAccessoryOptions() {
  const grid = document.getElementById("accessory-grid");

  accessoryList.forEach(a => {
    const btn = document.createElement("button");
    btn.className = "item-btn";

    btn.innerHTML = `
      <img src="${a.src}" class="item-img accessory-img">
    `;

    btn.onclick = () => chooseAccessory(a.src);

    grid.appendChild(btn);
  });
}

function chooseAccessory(src) {
  localStorage.setItem("accessory", src);
  location.href = "final.html";
}


// ---------------- FINAL BOUQUET ----------------

function renderBouquet() {
    const flowers = JSON.parse(localStorage.getItem("flowers") || "[]");
    const accessory = localStorage.getItem("accessory");

    const shuffled = [...flowers].sort(() => Math.random() - 0.5);

    for (let i = 1; i <= 7; i++) {
        const slot = document.getElementById(`slot${i}`);

        if (shuffled[i - 1]) {
            slot.src = shuffled[i - 1].src;
            slot.style.display = "block";
        } else {
            slot.style.display = "none";
        }
    }

    const acc = document.getElementById("accessory");
    if (accessory && accessory !== "none") {
        acc.src = accessory;
        acc.style.display = "block";
    } else {
        acc.style.display = "none";
    }
}

function newArrangement() {
    renderBouquet();
}


// ---------------- NOTE TAB ----------------

function toggleNote() {
  const box = document.getElementById("note-box");
  box.style.display = box.style.display === "block" ? "none" : "block";
}


// ---------------- SHARE ----------------

function shareBouquet() {
    const flowers = JSON.parse(localStorage.getItem("flowers") || "[]");
    const accessory = localStorage.getItem("accessory") || "";
    const note = localStorage.getItem("note") || "";

    const data = {
        flowers,
        accessory,
        note
    };

    const encoded = encodeURIComponent(JSON.stringify(data));

    const shareUrl = `${location.origin}${location.pathname}?bouquet=${encoded}`;

    navigator.clipboard.writeText(shareUrl);
    alert("Your bouquet link has been copied!");
}

function saveNote() {
    const params = new URLSearchParams(location.search);
    if (params.get("bouquet")) return; // shared mode → do nothing

    const noteBox = document.getElementById("note-box");
    localStorage.setItem("note", noteBox.value);
}


