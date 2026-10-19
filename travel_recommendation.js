document.addEventListener("DOMContentLoaded", () => {
  const btnSearch = document.getElementById("btnSearch");
  const btnClear = document.getElementById("btnClear");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");

  // Search function
  const handleSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = "";

    if (!query) return;

    fetch("travel_recommendation_api.json")
      .then((response) => response.json())
      .then((data) => {
        let results = [];

        // Match Beach keyword variations
        if (query.includes("beach")) {
          results = data.beaches;
        } 
        // Match Temple keyword variations
        else if (query.includes("temple")) {
          results = data.temples;
        } 
        // Match Country keywords or specific country names
        else {
          const matchedCountry = data.countries.find(
            (c) => c.name.toLowerCase().includes(query)
          );

          if (matchedCountry) {
            results = matchedCountry.cities;
          } else if (query.includes("country") || query.includes("countries")) {
            // Display cities from all countries if generic keyword is used
            data.countries.forEach((country) => {
              results = results.concat(country.cities);
            });
          }
        }

        displayResults(results);
      })
      .catch((error) => console.error("Error fetching recommendations:", error));
  };

  // Render cards to the DOM
  const displayResults = (items) => {
    if (items.length === 0) {
      resultsContainer.innerHTML = `<div class="card" style="padding: 20px;"><p>No results found. Try searching for 'beach', 'temple', or 'japan'.</p></div>`;
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="card-info">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <button class="btn-primary" style="margin-top: 10px;">Visit</button>
        </div>
      `;

      resultsContainer.appendChild(card);
    });
  };

  // Clear function
  const handleClear = () => {
    searchInput.value = "";
    resultsContainer.innerHTML = "";
  };

  btnSearch.addEventListener("click", handleSearch);
  btnClear.addEventListener("click", handleClear);
});
