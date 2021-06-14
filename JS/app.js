import { recipes } from "./recipe.js";

let initialIngredients = [];
let initialUstensils = [];
let initialAppliances = [];
let initialUnits = [];
let ingFiltertagList = [];
let appFiltertagList = [];
let ustFiltertagList = [];
let labelTagList = [];
let menuOpen;

/* Use data from main Search input to filter recipes  */
const displayRecipesFromMainSearchInput = (e) => {
  //e.preventDefault();
  const value = e.target.value;
  //console.log(value);
  if (value.length > 2) {
    console.log(value);
  }
  /*
  recipes.map((recipe) => {
    document.querySelector(".recipes").innerHTML += `<div class="recipe">
    <div class="recipe-img">
    </div>
    <div class="recipe__header">
        <h2 class="recipe__body__name">${recipe.name}</h2>
        <p class="recipe__body__time"><i class="far fa-clock"></i> ${recipe.time} min</p>
    </div>
    <div class="recipe__body">
      <div class="recipe__body__ingredients">${recipe.ingredients
        .map((elt) => {
          return `<div>${elt.ingredient} ${
            elt.quantity ? `${elt.unit ? `: ${elt.quantity} ${elt.unit === "grammes" ? "g" : elt.unit}` : ``}` : ""
          } </div>`;
        })
        .join("")}</div>
      <p class="recipe__body__description">${recipe.description}</p>
    </div>
    </div>`;
  });*/
};

/* console log filter tag from input search bar into filterBtn */
const displayTextFromSearchInput = (e) => {
  //e.preventDefault();
  const value = e.target.value;
  if (value.length > 0) {
    console.log(value, initialUstensils);
  }
};

function getInitialTagFromRecipes() {
  recipes.map((elt) => {
    if (!initialAppliances.includes(elt.appliance.toLowerCase())) {
      initialAppliances.push(elt.appliance.toLowerCase());
    }
    elt.ustensils.map((item) => {
      if (!initialUstensils.includes(item.toLowerCase())) {
        initialUstensils.push(item.toLowerCase());
      }
    });
    elt.ingredients.map((item) => {
      if (!initialIngredients.includes(item.ingredient.toLowerCase())) {
        initialIngredients.push(item.ingredient.toLowerCase());
      }
      if (item.unit) {
        if (!initialUnits.includes(item.unit)) {
          initialUnits.push(item.unit);
        }
      }
    });
  });
  return initialUstensils, initialIngredients, initialAppliances, initialUnits;
}

function getUnit(unit) {
  switch (unit) {
    case "grammes":
    case "gramme":
      return "g";

    case "cuillères à soupe":
    case "cuillère à soupe":
      return "c à s";

    case "cuillères à café":
      return "c à c";

    case "Litres":
    case "litre":
      return "L";

    default:
      return unit;
  }
}

/* Use data from recipes.js to create all recipe Card on HomePage  */
function displayAllRecipes() {
  //delete all photographers Cards to avoid duplicate photographer card
  //document.querySelector(".recipes").innerHTML = "";
  recipes.map((recipe) => {
    document.querySelector(".recipes").innerHTML += `<div class="recipe">
    <div class="recipe-img">
    </div>
    <div class="recipe__header">
        <h2 class="recipe__body__name">${recipe.name}</h2>
        <p class="recipe__body__time"><i class="far fa-clock"></i> ${recipe.time} min</p>
    </div>
    <div class="recipe__body">
      <div class="recipe__body__ingredients">${recipe.ingredients
        .map((elt) => {
          return `<div>${elt.ingredient}${
            elt.quantity ? `${elt.unit ? `${": " + elt.quantity + getUnit(elt.unit)}` : ": " + elt.quantity}` : ""
          } </div>`;
        })
        .join("")}</div>
      <p class="recipe__body__description">${recipe.description}</p>
    </div>
    </div>`;
  });
}

displayAllRecipes();
getInitialTagFromRecipes();

//console.log(initialUstensils, initialIngredients, initialAppliances, initialUnits);

//DOM Element
const ingBtn = document.getElementById("ing-btn");
const appBtn = document.getElementById("app-btn");
const ustBtn = document.getElementById("ust-btn");
const ingList = document.getElementById("ingredientsFilterList");
const appList = document.getElementById("applianceFilterList");
const ustList = document.getElementById("ustensilsFilterList");

const createGenericElement = (type, options = {}) => {
  /* options = {
    text : 'text value',
    classes : ['far', 'fa-times-circle'],
    attribute : {
      type : "text",
      role : "image"
    }
  }
   */
  const element = document.createElement(type);

  if (options.text) {
    element.textContent = options.text;
  }
  if (options.classes) {
    options.classes.forEach(function (className) {
      element.classList.add(className);
    });
  }
  const attributeKeys = options.attribute && Object.keys(options.attribute);
  if (options.attribute && attributeKeys.length > 0) {
    attributeKeys.forEach(function (attributeKey) {
      element.setAttribute(attributeKey, options.attribute[attributeKeys]);
    });
  }

  if (options.child) {
    element.appendChild(options.child);
  }

  return element;
};

const returnBackgroundColor = (color, elt) => {
  switch (color) {
    case "blue":
      elt.style.backgroundColor = "#3282f7";
      break;
    case "green":
      elt.style.backgroundColor = "#68d9a4";
      break;
    case "orange":
      elt.style.backgroundColor = "#ed6454";
      break;

    default:
      break;
  }
};
const displayItem = (e, color) => {
  const label = document.getElementById("label");

  // insert width only one time for the div element
  /*if (!label.hasChildNodes()) {
    label.style.width = "100%";
  }*/

  // 1. Create the button
  const value = e.target.textContent;
  const button = createGenericElement("span", { text: value, attribute: { id: value } });

  // 3. create font awesome element
  const i = createGenericElement("i", { classes: ["far", "fa-times-circle"] });
  const iBtn = createGenericElement("button", { classes: ["closeBtnFilter"], child: i });
  // 4. addeventListener to remove filterTag
  iBtn.addEventListener("click", () => {
    const id = document.getElementById(value);
    label.removeChild(id);
    labelTagList = [...labelTagList].filter((label) => label !== value);
  });
  // 5. insert Font awesome elt
  if (!labelTagList.includes(value)) {
    labelTagList.push(value);

    button.appendChild(iBtn);
    // 6. Insert class to button
    button.classList.add("labelTag");
    // 7. Display backgroundcolor
    returnBackgroundColor(color, button);
    //8. insert button to label div
    label.appendChild(button);
  }
};

function displayIngredientsFilterMenu() {
  //si menuOpen ne lance pas onclick
  if (menuOpen === "ingredients") return;
  menuOpen = "ingredients";
  const x = document.querySelector(".filtersTags > #ingredientsFilterList");
  x.parentElement.style.display = "block";
  const input = createGenericElement("input");
  input.setAttribute("placeholder", "Recherche un ingrédient");
  const span = createGenericElement("span", { classes: ["fas", "fa-chevron-up"] });
  if (!x.children[0]) {
    x.appendChild(input);
    x.appendChild(span);
  }
  input.addEventListener("keypress", displayTextFromSearchInput);
  span.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.parentNode.parentNode.style.display = "none";
  });

  if (x.children[0].localName === "input") {
    initialIngredients
      .map((item) => {
        if (!ingFiltertagList.includes(item)) {
          ingFiltertagList.push(item);
          const button = createGenericElement("button", { text: item, classes: ["filterBtn"] });
          x.appendChild(button);
        }
      })
      .join("");
  }
}

function displayAppliancesFilterMenu() {
  if (menuOpen === "appliances") return;
  menuOpen = "appliances";
  const x = document.querySelector(".filtersTags > #applianceFilterList");
  x.parentElement.style.display = "block";
  const input = createGenericElement("input");
  input.setAttribute("placeholder", "Recherche un appareil");
  const span = createGenericElement("span", { classes: ["fas", "fa-chevron-up"] });
  if (!x.children[0]) {
    x.appendChild(input);
    x.appendChild(span);
  }
  input.addEventListener("keypress", displayTextFromSearchInput);
  span.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.parentNode.parentNode.style.display = "none";
  });

  if (x.children[0].localName === "input") {
    initialAppliances
      .map((item) => {
        if (!appFiltertagList.includes(item)) {
          appFiltertagList.push(item);
          const button = createGenericElement("button", { text: item, classes: ["filterBtn"] });
          x.appendChild(button);
        }
      })
      .join("");
  }
  /*x.innerHTML = `<input class="filtersTags__search" type="text" placeholder="Recherche un appareil" />
  <span class="fas fa-chevron-up item"></span>${initialAppliances.map((item) => `<button class="filterBtn">${item}</button>`).join("")}`;*/
}

function displayUstensilsFilterMenu() {
  if (menuOpen === "ustensils") return;
  menuOpen = "ustensils";
  const x = document.querySelector(".filtersTags > #ustensilsFilterList");
  x.parentElement.style.display = "block";
  const input = createGenericElement("input");
  input.setAttribute("placeholder", "Recherche un ustensile");
  const span = createGenericElement("span", { classes: ["fas", "fa-chevron-up"] });
  if (!x.children[0]) {
    x.appendChild(input);
    x.appendChild(span);
  }
  input.addEventListener("keypress", displayTextFromSearchInput);
  span.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.parentNode.parentNode.style.display = "none";
  });

  if (x.children[0].localName === "input") {
    initialUstensils
      .map((item) => {
        if (!ustFiltertagList.includes(item)) {
          ustFiltertagList.push(item);
          const button = createGenericElement("button", { text: item, classes: ["filterBtn"] });
          x.appendChild(button);
        }
      })
      .join("");
  }
  /*
  x.innerHTML = `<input class="filtersTags__search" type="text" placeholder="Recherche un ustensile" />
  <span class="fas fa-chevron-up item"></span>${initialUstensils.map((item) => `<button class="filterBtn">${item}</button>`).join("")}`;
  */
}

function isFilterTagsMenuOpen(e) {
  //console.log(menuOpen);

  /*if (e.target.classList.includes("closeBtn")) {
    console.log("ici");
  }*/

  if (ingList && !ingList.contains(e.target)) {
    ingList.parentElement.style.display = "none";
    menuOpen = undefined;
  }

  if (appList && !appList.contains(e.target)) {
    appList.parentElement.style.display = "none";
    menuOpen = undefined;
  }

  if (ustList && !ustList.contains(e.target)) {
    ustList.parentElement.style.display = "none";
    menuOpen = undefined;
  }
}

function displayBtn(color) {
  const filterBtn = document.querySelectorAll("button.filterBtn");
  filterBtn.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      displayItem(e, color);
    });
  });
}

ingBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isFilterTagsMenuOpen(e);
  displayIngredientsFilterMenu();
  const color = "blue";
  displayBtn(color);
});
appBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isFilterTagsMenuOpen(e);
  displayAppliancesFilterMenu();
  const color = "green";
  displayBtn(color);
});
ustBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isFilterTagsMenuOpen(e);
  displayUstensilsFilterMenu();
  const color = "orange";
  displayBtn(color);
});

document.body.addEventListener("click", isFilterTagsMenuOpen);

const input = document.querySelector("input.search__bar");

input.addEventListener("keypress", displayRecipesFromMainSearchInput);
