function getContrastColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "black" : "white";
}

const form = document.querySelector("#form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  document.querySelector('.loader-container').style.display = 'block';
  const query = form.elements.query.value;
  fetch("/palette", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      query: query,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const palette = data.palette;
      const description = data.description;
      const container = document.querySelector(".container");
      container.innerHTML = "";
      if (data.message) {
        const descriptionElement = document.querySelector("#description");
        descriptionElement.textContent = data.message;
        document.querySelector('.loader-container').style.display = 'none';
        return; // Exit out of the function early since it's a message, not a color palette
    }

      for (const color of palette) {
        const div = document.createElement("div");
        div.classList.add("color");
        div.style.backgroundColor = color;
        div.style.width = `calc(100% / ${palette.length})`;
        container.appendChild(div);

        div.addEventListener("click", function () {
          navigator.clipboard.writeText(color);
        });

        const span = document.createElement("span");
        span.innerText = color;
        span.style.color = getContrastColor(color);
        div.appendChild(span);
        container.appendChild(div);

        div.addEventListener("click", function (e) {
          navigator.clipboard.writeText(color);

          // Create a tooltip element
          const tooltip = document.createElement("div");
          tooltip.classList.add("copied-tooltip");
          tooltip.innerText = "Copied!";

          // Append tooltip to the body (to position it absolutely)
          document.body.appendChild(tooltip);

          // Position the tooltip next to the cursor
          tooltip.style.left = `${e.clientX + 10}px`; // 10px offset from the cursor
          tooltip.style.top = `${e.clientY + 10}px`;

          // Show the tooltip
          tooltip.style.opacity = "1";

          // Hide and remove the tooltip after 1 second
          setTimeout(() => {
            tooltip.style.opacity = "0";
            setTimeout(() => {
              document.body.removeChild(tooltip);
            }, 300);
          }, 1000);
        });
      }
      const descriptionElement = document.querySelector("#description");
      descriptionElement.textContent = description;

      // New logic to show/hide the divider
      const dividerLine = document.getElementById("dividerLine");
      if (description.trim() === "") {
        dividerLine.style.display = "none";
      } else {
        dividerLine.style.display = "block";
      }
      
      document.querySelector('.loader-container').style.display = 'none';
    });
});

// Array of placeholders
const placeholders = [
  'Try "Google Logo"',
  'How about "Italy Flag"?',
  'Maybe "Sunrise"?',
  'What about "Ocean Waves"?',
  'Ever tried "Autumn Leaves"?',
  'Find colors for "Instagram"?',
  'Explore the shades of "Moonlit Night"',
  'How about the hues of "Desert Sunset"?',
  'Try "Cherry Blossom" for spring vibes',
  'Search for "Winter Chill" colors',
  'Get the palette of "Indian Flag"',
  'Find shades for "City Skyline"?',
  'Explore colors of "Tropical Paradise"',
  'How about "Vintage Retro"?',
  'Discover the "Mountain Peak" tones',
  'What are the colors of "Sunset at Beach"?',
  'Search for "Spring Meadows"?',
  'Get inspired with "Rainy Day" hues',
  'How about exploring "Space Galaxy"?',
  'Dive into the "Coral Reef" palette',
  'Need colors for "Urban Street Art"?',
  'Try "Romantic Evening" for soft shades',
  // Add as many as you like
];

// Reference to the input field
const inputField = document.querySelector('input[name="query"]');

// Function to change the placeholder
let i = 0;
function changePlaceholder() {
  const randomIndex = Math.floor(Math.random() * placeholders.length);
  inputField.placeholder = placeholders[randomIndex];
}

// Change the placeholder every 3 seconds
setInterval(changePlaceholder, 3200);
