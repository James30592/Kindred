import { CategoryInfo } from "../../sharedJs/categoryInfo.mjs";



// Objects to represent checkbox selection checkboxes for all categories / 
// category types.
export class CategoryCheckboxes {
    #checkboxes;
    categoryInfo;

    constructor(categoryCheckboxes) {
        this.#checkboxes = categoryCheckboxes;
    }
    
    // Given an array of checkbox DOM objects, returns a CategoryInfo object
    // containing information on all selected checkboxes.
    getSelectedCategoryInfo() {
        let selectedCategoryInfo = new CategoryInfo();
      
        this.#checkboxes.forEach(function(checkbox){
          if (checkbox.checked) {
            const catTypeAndCat = checkbox.getAttribute("name").split(".");
            selectedCategoryInfo.checkAndAddCategoryWithType(catTypeAndCat[0],
              catTypeAndCat[1]);
          };
        });
        
        this.categoryInfo = selectedCategoryInfo;
        return this.categoryInfo;
    }
}