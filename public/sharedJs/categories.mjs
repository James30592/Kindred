// Class to store category type and category info in a tree structure of nested
// objects for all categories present.
export class CategoryInfo {
  constructor(){
    this.catTypes = {};
  }

  // Given a category type and category, adds both, just the category, or
  // neither of them depending on what already exists in this.
  // data should be an object and all the key: value pairs from data will be
  // added in to the CategoryInfo object at the correct place.
  checkAndAddCategoryWithType(categoryTypeName, categoryName, data = null){
    const catOrTypeExists = this._doesCategoryOrTypeExist(categoryTypeName, categoryName);
    if (catOrTypeExists === "nor"){
      this._addTypeAndCategory(categoryTypeName, categoryName, data);
    }
    else if (catOrTypeExists === "typeOnly"){
      this._addCategory(categoryTypeName, categoryName, data);
    };
  }

  // Returns an array of objects where each object contains the
  // categoryTypeName and categoryName, for every unique category in this.
  getAllCategories() {
    const allUniqueCategories = [];

    for (let catType in this.catTypes) {
      for (let category in this.catTypes[catType]?.categories) {
        const thisCatAndType = {
          categoryType: catType,
          category: category
        };
        allUniqueCategories.push(thisCatAndType);
      };
    };

    return allUniqueCategories;
  }

  // Returns "typeAndCat" if categoryType and category exists in the tree, "typeOnly" if only
  // the categoryType exists and "nor" if neither the category nor the categoryType exists.
  _doesCategoryOrTypeExist(categoryTypeName, categoryName){
    if (!(categoryTypeName in this.catTypes)) {
      return "nor";
    }
    else if (!(categoryName in (this.catTypes.categoryTypeName?.categories ?? []))) {
      return "typeOnly";
    }
    else {
      return "typeAndCat";
    };
  }

  _addTypeAndCategory(categoryTypeName, categoryName, data){
    this.catTypes[categoryTypeName] = {
      categories: {}
    };
    this._addCategory(categoryTypeName, categoryName, data);
  }

  _addCategory(categoryTypeName, categoryName, data){
    this.catTypes[categoryTypeName].categories[categoryName] = null;
    if (data) {
      this._setData(categoryTypeName, categoryName, data);
    };
  }

  _setData(categoryTypeName, categoryName, data) {
    this.catTypes[categoryTypeName].categories[categoryName] = {};
    for (let key in data) {
      this.catTypes[categoryTypeName].categories[categoryName][key] = data[key];
    };
  }
}



// Given an array of checkbox DOM objects, returns a CategoryInfo object
// containing information on all selected checkboxes.
export function getSelectedCategoryInfo(categoryCheckboxes){
  let selectedCategoryInfo = new CategoryInfo();

  categoryCheckboxes.forEach(function(checkbox){
    if (checkbox.checked) {
      const catTypeAndCat = checkbox.getAttribute("name").split(".");
      selectedCategoryInfo.checkAndAddCategoryWithType(catTypeAndCat[0],
        catTypeAndCat[1]);
    };
  });

  return selectedCategoryInfo;
}




// {
//   catTypes: {
//     answeredQIds: [],
//     catType1: {
//       answeredQIds: [],
//       categories: {
//         category1: {
//           answeredQIds: []
//         }
//       }
//     }
//   }
// }





// // Class to store category type and category info in a tree structure of nested
// // objects for all categories present.
// export class CategoryInfo {
//   constructor(){
//     this.catTypes = {};
//   }
//
//   // Given a category type and category, adds both, just the category, or
//   // neither of them depending on what already exists in this.
//   // data should be an object and all the key: value pairs from data will be
//   // added in to the CategoryInfo object at the correct place.
//   checkAndAddCategoryWithType(categoryTypeName, categoryName, data = null){
//     const catOrTypeExists = this._doesCategoryOrTypeExist(categoryTypeName, categoryName);
//     if (catOrTypeExists === "nor"){
//       this._addTypeAndCategory(categoryTypeName, categoryName, data);
//     }
//     else if (catOrTypeExists === "typeOnly"){
//       this._addCategory(categoryTypeName, categoryName, data);
//     };
//   }
//
//   // Returns "typeAndCat" if categoryType and category exists in the tree, "typeOnly" if only
//   // the categoryType exists and "nor" if neither the category nor the categoryType exists.
//   _doesCategoryOrTypeExist(categoryTypeName, categoryName){
//     if (!(categoryTypeName in this.catTypes)) {
//       return "nor";
//     }
//     else if (!(categoryName in (this.catTypes.categoryTypeName?.categories ?? []))) {
//       return "typeOnly";
//     }
//     else {
//       return "typeAndCat";
//     };
//   }
//
//   _addTypeAndCategory(categoryTypeName, categoryName, data){
//     this.catTypes[categoryTypeName] = {
//       categories: {
//         [categoryName]: null
//       }
//     };
//
//     if (data) {
//       _setData(this.catTypes[categoryTypeName].categories[categoryName], data);
//     };
//   }
//
//   _addCategory(categoryTypeName, categoryName, data){
//     this.catTypes[categoryTypeName].categories[categoryName] = null;
//
//     if (data) {
//       _setData(this.catTypes[categoryTypeName].categories[categoryName], data);
//     };
//   }
//
//   _setData(categoryRef, data) {
//     categoryRef = {};
//     for (let key in data) {
//       categoryRef[key] = data.key;
//     };
//   }
// }
