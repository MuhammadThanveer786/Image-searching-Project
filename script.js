const accessKey = "g1jKwrKryAiAzzbU2mWf7TV7AxCyu3_Zf2BV4RA9Yp8";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword = "";
let page = 1;

async function searchImages() {
  keyword = searchBox.value.trim();
  console.log("Searching for:", keyword);

  if (!keyword) {
    alert("Please enter a search term!");
    return;
  }

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

  console.log("API URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("API Response Data:", data);

    const results = data.results;

    if (page === 1) {
      searchResult.innerHTML = "";
    }

    results.forEach((result) => {
      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || keyword;
      image.style.width = "100%";
      image.style.borderRadius = "5px";
      image.style.cursor = "pointer";

      // When clicking the image, show lightbox
      image.addEventListener("click", () => {
        showLightbox(result.urls.full);
      });

      searchResult.appendChild(image);
    });

    if (data.total_pages > page) {
      showMoreBtn.style.display = "block";
    } else {
      showMoreBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  searchImages();
});

showMoreBtn.addEventListener("click", () => {
  page++;
  searchImages();
});

// ------- Lightbox functionality --------

let currentImageUrl = "";

const lightbox = document.createElement("div");
lightbox.id = "lightbox";
lightbox.style.position = "fixed";
lightbox.style.top = 0;
lightbox.style.left = 0;
lightbox.style.width = "100%";
lightbox.style.height = "100%";
lightbox.style.background = "rgba(0, 0, 0, 0.8)";
lightbox.style.display = "none";
lightbox.style.justifyContent = "center";
lightbox.style.alignItems = "center";
lightbox.style.flexDirection = "column";
lightbox.style.zIndex = 9999;
document.body.appendChild(lightbox);

const lightboxImg = document.createElement("img");
lightboxImg.style.maxWidth = "90%";
lightboxImg.style.maxHeight = "80%";
lightboxImg.style.borderRadius = "10px";
lightboxImg.style.cursor = "pointer";
lightbox.appendChild(lightboxImg);

const downloadBtn = document.createElement("a");
downloadBtn.textContent = "Download";
downloadBtn.style.marginTop = "20px";
downloadBtn.style.background = "#ff3929";
downloadBtn.style.color = "white";
downloadBtn.style.padding = "10px 20px";
downloadBtn.style.borderRadius = "5px";
downloadBtn.style.textDecoration = "none";
downloadBtn.style.fontSize = "16px";
lightbox.appendChild(downloadBtn);

const closeBtn = document.createElement("span");
closeBtn.textContent = "×";
closeBtn.style.position = "absolute";
closeBtn.style.top = "20px";
closeBtn.style.right = "30px";
closeBtn.style.fontSize = "40px";
closeBtn.style.color = "white";
closeBtn.style.cursor = "pointer";
lightbox.appendChild(closeBtn);

function showLightbox(imageUrl) {
  currentImageUrl = imageUrl;
  lightboxImg.src = imageUrl;
  lightbox.style.display = "flex";
}

downloadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentImageUrl) {
    downloadImage(currentImageUrl);
  }
});

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

async function downloadImage(imageUrl) {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = "unsplash-image.jpg";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);

    console.log("Download triggered!");
  } catch (error) {
    console.error("Download failed:", error);
    alert("Sorry, download failed!");
  }
}
