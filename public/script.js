const baseURL = "https://server-5fjjz6ugna-ue.a.run.app";

function createTableRow(track) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${track.artist}</td>
    <td>${track.track}</td>
    <td><img src="${track.album_image_url}" alt="Album Cover"></td>
    <td><a href="${track.preview_url}" target="_blank">Preview</a></td>
  `;

  return row;
}

function clearTable() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
}

function displayTracks(tracks) {
  const tbody = document.querySelector("tbody");
  clearTable();
  tracks.forEach((track) => {
    const row = createTableRow(track);
    tbody.appendChild(row);
  });
}

function searchTracks() {
  const genreInput = document.getElementById("genre-input");
  const genre = genreInput.value.trim();

 const params = new URLSearchParams({ q: genre }).toString();

  if (genre) {
    const url = `${baseURL}/api/tracks?${params}`;
    fetch(url)
      .then((response) => response.json())
      .then((tracks) => {
        displayTracks(tracks);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchTracks();
  }
}

const searchBtn = document.getElementById("search-btn");
const genreInput = document.getElementById("genre-input");

searchBtn.addEventListener("click", searchTracks);
genreInput.addEventListener("keydown", handleKeyPress);
