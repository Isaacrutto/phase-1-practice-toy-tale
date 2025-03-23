let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.querySelector("#toy-collection");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display all toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      });
  }

  function renderToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => updateLikes(toy, card));

    toyCollection.appendChild(card);
  }

  // Add new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ name, image, likes: 0 })
    })
      .then(response => response.json())
      .then(toy => renderToy(toy));

    toyForm.reset();
  });

  // Update likes
  function updateLikes(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  fetchToys();
});
