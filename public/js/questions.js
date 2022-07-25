import { QuestionsPage } from "./modules/questions/questionsPage.mjs";
import { AutoMode } from "./modules/questions/components/questionsMode.mjs";
import { SearchMode } from "./modules/questions/components/questionsMode.mjs";



// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// Create the search modes.
const autoQModeDiv = document.querySelector(".auto-mode");
const searchQModeDiv = document.querySelector(".search-mode");
const autoQMode = new AutoMode(autoQModeDiv, categoryTypeName, categoryName);
const searchQMode = new SearchMode(searchQModeDiv, categoryTypeName, categoryName);
const allQModes = [autoQMode, searchQMode];

// Create the search page.
const questionsPage = new QuestionsPage(allQModes, categoryTypeName, categoryName);
questionsPage.init();

// Event listeners for mode change buttons, maybe put this inside QuestionsPage 
// init method later.
document.querySelector(".auto-queue-mode-btn").addEventListener("click", async () => {
  await questionsPage.switchQMode(autoQMode);
});
document.querySelector(".search-mode-btn").addEventListener("click", async () => {
  await questionsPage.switchQMode(searchQMode);
});

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPage.setQMode(autoQMode);
};