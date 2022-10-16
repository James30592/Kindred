// Class to store category type and category info in a tree structure of nested
// objects for all categories present.
export class CategoryInfo {
  catTypes = {};

  // Where catInfo is an optional category info style object (just the data, not 
  // an actual instance of this class - from when stringified and sent using fetch).
  // dbCatTypes is a list of categoryType documents as returned from doing find 
  // of category types in DB.
  constructor(catInfo = null, dbCatTypes = null) {
    if (catInfo) {
      this.catTypes = catInfo.catTypes;
    };

    if (dbCatTypes) {
      this.#constructFromCatTypes(dbCatTypes);
    };
  }

  // Construct this category info based on a given array of category types and 
  // their nested categories (as a result of a dib find on category types).
  #constructFromCatTypes(dbCatTypes) {
    for (let catType of dbCatTypes) {
      for (let cat of catType.categories) {
        const isRecData = {isRecommendable: cat.isRecommendable};
        this.checkAndAddCategoryWithType(catType.name, cat.name, isRecData);
      };
    };
  }

  // Given a category type and category, adds both, just the category, or
  // neither of them depending on what already exists in this.
  // data should be an object and all the key: value pairs from data will be
  // added in to the CategoryInfo object at the correct place.
  checkAndAddCategoryWithType(categoryTypeName, categoryName, data = null) {
    const catOrTypeExists = this._doesCategoryOrTypeExist(categoryTypeName, categoryName);
    if (catOrTypeExists === "nor"){
      this._addTypeAndCategory(categoryTypeName, categoryName, data);
    }
    else if (catOrTypeExists === "typeOnly"){
      this._addCategory(categoryTypeName, categoryName, data);
    };
  }

  // Creates a clone of this category info object and returns it, along with new 
  // data for each category which is calculated using the higher order getDataFunc and args.
  cloneWithData(getDataFunc, args) {
    const newCatInfo = new CategoryInfo();

    const allCategoriesWithTypes = this.getAllCategories();

    for (let categoryWithType of allCategoriesWithTypes) {
      const catTypeName = categoryWithType.categoryType;
      const categoryName = categoryWithType.category;
      const data = getDataFunc(catTypeName, categoryName, args);

      newCatInfo.checkAndAddCategoryWithType(catTypeName, categoryName, data);
    };

    return newCatInfo;
  }

  // Returns an array of objects where each object contains the
  // categoryTypeName and categoryName, for every unique category in this.
  getAllCategories(inclData = false) {
    const allUniqueCategories = [];

    for (let catType in this.catTypes) {
      for (let category in this.catTypes[catType]?.categories) {
        const thisCatAndType = {
          categoryType: catType,
          category: category
        };

        if (inclData) {
          const catData = this.catTypes[catType].categories[category];
          for (let key in catData) {
            thisCatAndType[key] = catData[key];
          };
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