import { recipes } from "./recipe.js";

let initialIngredients = [];
let ingToDisplay = [];
let initialUstensils = [];
let ustToDisplay = [];
let initialAppliances = [];
let appToDisplay = [];
// initialUnits only used to view units and create/modify getUnit() function
let initialUnits = [];
let ingFiltertagList = [];
let appFiltertagList = [];
let ustFiltertagList = [];
let labelTagList = [];
let menuOpen;
let recipeToDisplay = [];
let searchTerm = "";

/* Use data from recipes.js to create all recipe Card on HomePage  */
function displayAllRecipes(recipesDisplayed) {
  document.querySelector(".recipes").innerHTML = "";
  if (recipesDisplayed.length === 0) {
    document.querySelector(
      ".recipes"
    ).innerHTML += `<div class="nomatch">Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>`;
  } else {
    recipesDisplayed.map((recipe) => {
      document.querySelector(".recipes").innerHTML += `<div class="recipe" data-id='${recipe.id}'>
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
}

function getAllTagToDisplayFromMainInput(arrIng, arrApp, arrUst, arrOfRecipe) {
  arrOfRecipe.map((elt) => {
    if (!arrApp.includes(elt.appliance.toLowerCase())) {
      arrApp.push(elt.appliance.toLowerCase());
    }
    elt.ustensils.map((item) => {
      if (!arrUst.includes(item.toLowerCase())) {
        arrUst.push(item.toLowerCase());
      }
    });
    elt.ingredients.map((item) => {
      if (!arrIng.includes(item.ingredient.toLowerCase())) {
        arrIng.push(item.ingredient.toLowerCase());
      }
    });
  });
  return arrIng, arrApp, arrUst;
}
const filterRecipes = () => {
  return recipes.filter((recipe) => {
    //1-verify matching with searchTerm form input
    console.log(labelTagList);
    const ustLabelAvailable = labelTagList.filter((label) => label.type === "ust");
    const ingLabelAvailable = labelTagList.filter((label) => label.type === "ing");
    const appLabelAvailable = labelTagList.filter((label) => label.type === "app");

    const valueToSearch = searchTerm.toLowerCase();

    const isRecipeTextMatchingSearch =
      valueToSearch && valueToSearch.length > 2
        ? recipe.description.toLowerCase().includes(valueToSearch) || recipe.name.toLowerCase().includes(valueToSearch)
        : true;

    //2-verify for recipe if tags are matching with
    const isMatchingSelectedIngredientTag =
      ingLabelAvailable.length > 0
        ? recipe.ingredients.some((item) => {
            return labelTagList.some((label) => label.type === "ing" && item.ingredient.toLowerCase() === label.data);
          })
        : true;

    const isMatchingSelectedApplianceTag =
      appLabelAvailable.length > 0 ? labelTagList.some((label) => label.type === "app" && recipe.appliance.toLowerCase() === label.data) : true;

    const isMatchingSelectedUstensilsTag =
      ustLabelAvailable.length > 0
        ? recipe.ustensils.some((item) => {
            return labelTagList.some((label) => label.type === "ust" && item.toLowerCase() === label.data);
          })
        : true;

    return isRecipeTextMatchingSearch && isMatchingSelectedIngredientTag && isMatchingSelectedApplianceTag && isMatchingSelectedUstensilsTag;
  });
};

/* Use data from main Search input and filter tags to filter recipes */
const renderElements = () => {
  recipeToDisplay = filterRecipes();

  displayAllRecipes(recipeToDisplay);
  ingToDisplay = [];
  appToDisplay = [];
  ustToDisplay = [];

  getAllTagToDisplayFromMainInput(ingToDisplay, appToDisplay, ustToDisplay, recipeToDisplay);
  recipeToDisplay = [];
};

/* console log filter tag from input search bar into filterBtn */
const displayTextFromSearchInput = (e) => {
  const value = e.target.value;
  //DOM Element
  const ingBtnList = document.querySelectorAll(".ingfilterBtn");
  const appBtnList = document.querySelectorAll(".appfilterBtn");
  const ustBtnList = document.querySelectorAll(".ustfilterBtn");

  if (value.length > 0) {
    if (e.target.id === "ing") {
      ingBtnList.forEach((elt) => {
        if (!elt.textContent.includes(value.toLowerCase())) {
          elt.classList.add("hidden");
        } else {
          elt.classList.remove("hidden");
        }
      });
    } else if (e.target.id === "app") {
      appBtnList.forEach((elt) => {
        if (!elt.textContent.includes(value.toLowerCase())) {
          elt.classList.add("hidden");
        } else {
          elt.classList.remove("hidden");
        }
      });
    } else if (e.target.id === "ust") {
      ustBtnList.forEach((elt) => {
        if (!elt.textContent.includes(value.toLowerCase())) {
          elt.classList.add("hidden");
        } else {
          elt.classList.remove("hidden");
        }
      });
    }
  } else {
    if (e.target.id === "ing") {
      ingBtnList.forEach((elt) => {
        elt.classList.remove("hidden");
      });
    }
    if (e.target.id === "app") {
      appBtnList.forEach((elt) => {
        elt.classList.remove("hidden");
      });
    }
    if (e.target.id === "ust") {
      ustBtnList.forEach((elt) => {
        elt.classList.remove("hidden");
      });
    }
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

displayAllRecipes(recipes);
getInitialTagFromRecipes();

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
    },
    child : childItem
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

const returnTypeFromColor = (color) => {
  switch (color) {
    case "blue":
      return "ing";
    case "green":
      return "app";
    case "orange":
      return "ust";
    default:
      break;
  }
};
const displayItem = (e, color) => {
  const label = document.getElementById("label");

  // 1. Create the button
  const value = e.target.textContent;
  const button = createGenericElement("span", { text: value, attribute: { id: value } });
  //verify type (ing, app, or ust)
  const type = returnTypeFromColor(color);
  //create data to push into labelTagList
  const data = { type: type, data: value };

  // 3. create font awesome element
  const i = createGenericElement("i", { classes: ["far", "fa-times-circle"] });
  const iBtn = createGenericElement("button", { classes: ["closeBtnFilter"], child: i });
  // 4. addeventListener to remove filterTag
  iBtn.addEventListener("click", () => {
    const id = document.getElementById(value);
    label.removeChild(id);
    labelTagList = [...labelTagList].filter((label) => label !== data);
    //console.log(labelTagList);
    renderElements();
  });
  // 5. insert Font awesome elt

  const labelToCheck = labelTagList.filter((label) => label.type === type && label.data === value);

  if (!labelToCheck.length) {
    labelTagList = [...labelTagList, data];

    button.appendChild(iBtn);
    // 6. Insert class to button
    button.classList.add("labelTag");
    // 7. Display backgroundcolor
    returnBackgroundColor(color, button);
    //8. insert button to label div
    label.appendChild(button);
  }
  renderElements();
  e.target.parentNode.parentNode.style.display = "none";
};

function displayIngredientsFilterMenu() {
  //if menuOpen, onclick not launch
  if (menuOpen === "ingredients") return;
  menuOpen = "ingredients";
  const x = document.querySelector(".filtersTags > #ingredientsFilterList");
  x.parentElement.style.display = "block";
  const input = createGenericElement("input", { attribute: { id: "ing" } });
  input.setAttribute("placeholder", "Recherche un ingrédient");
  const span = createGenericElement("span", { classes: ["fas", "fa-chevron-up"] });
  if (!x.children[0]) {
    x.appendChild(input);
    x.appendChild(span);
  }
  input.addEventListener("keyup", displayTextFromSearchInput);
  span.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.parentNode.parentNode.style.display = "none";
  });
  //reset input field
  x.children[0].value = "";

  if (x.children[0].localName === "input") {
    if (ingToDisplay.length > 0) {
      //remove all child with class filterBtn inserted from initialIngredients 1st time
      const childToRemove = document.querySelectorAll("#ingredientsFilterList > .ingfilterBtn");
      for (let i = 0; i < childToRemove.length; i++) {
        x.removeChild(childToRemove[i]);
      }
      ingFiltertagList = [];
      ingToDisplay
        .map((item) => {
          if (!ingFiltertagList.includes(item)) {
            ingFiltertagList.push(item);
            const button = createGenericElement("button", { text: item, classes: ["ingfilterBtn"] });
            x.appendChild(button);
          }
        })
        .join("");
    } else {
      initialIngredients
        .map((item) => {
          if (!ingFiltertagList.includes(item)) {
            ingFiltertagList.push(item);
            const button = createGenericElement("button", { text: item, classes: ["ingfilterBtn"] });
            x.appendChild(button);
          }
        })
        .join("");
    }
  }
}

function displayAppliancesFilterMenu() {
  if (menuOpen === "appliances") return;
  menuOpen = "appliances";
  const x = document.querySelector(".filtersTags > #applianceFilterList");
  x.parentElement.style.display = "block";
  const input = createGenericElement("input", { attribute: { id: "app" } });
  input.setAttribute("placeholder", "Recherche un appareil");
  const span = createGenericElement("span", { classes: ["fas", "fa-chevron-up"] });
  if (!x.children[0]) {
    x.appendChild(input);
    x.appendChild(span);
  }
  input.addEventListener("keyup", displayTextFromSearchInput);
  span.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.parentNode.parentNode.style.display = "none";
  });
  //reset input field
  x.children[0].value = "";

  if (x.children[0].localName === "input") {
    if (appToDisplay.length > 0) {
      appToDisplay
        .map((item) => {
          if (!appFiltertagList.includes(item)) {
            appFiltertagList.push(item);
            const button = createGenericElement("button", { text: item, classes: ["appfilterBtn"] });
            x.appendChild(button);
          }
        })
        .join("");
    } else {
      initialAppliances
        .map((item) => {
          if (!appFiltertagList.includes(item)) {
            appFiltertagList.push(item);
            const button = createGenericElement("button", { text: item, classes: ["appfilterBtn"] });
            x.appendChild(button);
          }
        })
        .join("");
    }
  }
}

function displayUstensilsFilterMenu() {
  if (menuOpen === "ustensils") return;
  menuOpen = "ustensils";
  const x = document.querySelector(".filtersTags > #ustensilsFilterList");
  x.parentElement.style.display = "block";
  const input = createGenericElement("input", { attribute: { id: "ust" } });
  input.setAttribute("placeholder", "Recherche un ustensile");
  const span = createGenericElement("span", { classes: ["fas", "fa-chevron-up"] });
  if (!x.children[0]) {
    x.appendChild(input);
    x.appendChild(span);
  }
  input.addEventListener("keyup", displayTextFromSearchInput);
  span.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.parentNode.parentNode.style.display = "none";
  });
  //reset input field
  x.children[0].value = "";

  if (x.children[0].localName === "input") {
    if (ustToDisplay.length > 0) {
      ustToDisplay
        .map((item) => {
          if (!ustFiltertagList.includes(item)) {
            ustFiltertagList.push(item);
            const button = createGenericElement("button", { text: item, classes: ["ustfilterBtn"] });
            x.appendChild(button);
          }
        })
        .join("");
    } else {
      initialUstensils
        .map((item) => {
          if (!ustFiltertagList.includes(item)) {
            ustFiltertagList.push(item);
            const button = createGenericElement("button", { text: item, classes: ["ustfilterBtn"] });
            x.appendChild(button);
          }
        })
        .join("");
    }
  }
}

function isFilterTagsMenuOpen(e) {
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

function displayBtn() {
  const ingfilterBtn = document.querySelectorAll(".ingfilterBtn");
  ingfilterBtn.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      const color = "blue";
      displayItem(e, color);
    });
  });
  const appfilterBtn = document.querySelectorAll(".appfilterBtn");
  appfilterBtn.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      const color = "green";
      displayItem(e, color);
    });
  });
  const ustfilterBtn = document.querySelectorAll(".ustfilterBtn");
  ustfilterBtn.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      const color = "orange";
      displayItem(e, color);
    });
  });
}

ingBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isFilterTagsMenuOpen(e);
  displayIngredientsFilterMenu();
  displayBtn();
});
appBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isFilterTagsMenuOpen(e);
  displayAppliancesFilterMenu();
  displayBtn();
});
ustBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isFilterTagsMenuOpen(e);
  displayUstensilsFilterMenu();
  displayBtn();
});

document.body.addEventListener("click", isFilterTagsMenuOpen);

const input = document.querySelector("input.search__bar");

input.addEventListener("keyup", (e) => {
  searchTerm = e.target.value;
  renderElements();
});
