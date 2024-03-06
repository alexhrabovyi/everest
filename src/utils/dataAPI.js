import products from './products.json';
import news from './news.json';

export function getCategoriesAndSubcategories() {
  const categories = products.map((c) => {
    const dataSubcategories = c.subcategories;

    const subcategories = dataSubcategories.map((subC) => ({
      name: subC.name,
      id: subC.id,
    }));

    return {
      name: c.name,
      id: c.id,
      imgId: c.imgId,
      imgAlt: c.imgAlt,
      subcategories,
    };
  });

  return categories;
}

export function getCategoryAndSubcategories(categoryId) {
  const category = products.find((c) => c.id === categoryId);

  const subcategories = category.subcategories.map((subC) => ({
    name: subC.name,
    id: subC.id,
    imgId: subC.imgId,
    imgAlt: subC.imgAlt,
  }));

  return {
    name: category.name,
    id: category.id,
    subcategories,
  };
}

export function getCategoryAndSubcategory(categoryId, subcategoryId) {
  const category = products.find((c) => c.id === categoryId);
  const subcategory = category.subcategories.find((s) => s.id === subcategoryId);

  return {
    name: category.name,
    id: category.id,
    subcategory,
  };
}

export function getSubcategoryFilters(categoryId, subcategoryId) {
  const subCategoryProducts = getCategoryAndSubcategory(categoryId, subcategoryId)
    .subcategory.products;

  const filters = {};

  subCategoryProducts.forEach((p) => {
    const specsFilters = p['specs-filters'];

    Object.entries(specsFilters).forEach(([name, value]) => {
      if (!filters[name]) {
        filters[name] = new Set();
      }

      if (typeof value === 'string') {
        filters[name].add(value);
      } else {
        value.forEach((v) => {
          filters[name].add(v);
        });
      }
    });
  });

  return filters;
}

function filterBySpecs(subcategoryProducts, searchParams) {
  let filters = {};

  searchParams.entries().forEach(([key, value]) => {
    if (!filters[key]) {
      filters[key] = [];
    }

    filters[key].push(value);
  });

  filters = Object.entries(filters);

  const filteredProducts = [];

  subcategoryProducts.forEach((p) => {
    const productFilters = p['specs-filters'];

    let isSuitable = true;

    filters.forEach(([name, value]) => {
      if (productFilters[name]) {
        if (typeof productFilters[name] === 'string') {
          if (!value.includes(productFilters[name])) {
            isSuitable = false;
          }
        } else if (typeof productFilters[name] === 'object') {
          let includesSuitableValue = false;

          productFilters[name].forEach((pfValue) => {
            if (value.includes(pfValue)) includesSuitableValue = true;
          });

          isSuitable = includesSuitableValue;
        }
      } else {
        isSuitable = false;
      }
    });

    if (isSuitable) filteredProducts.push(p);
  });

  return filteredProducts;
}

function getMinAndMaxPrice(subcategoryProducts) {
  const prices = subcategoryProducts.map((p) => +p.price);
  prices.sort((a, b) => a - b);

  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];

  return {
    minPrice,
    maxPrice,
  };
}

function filterByPrice(subcategoryProducts, minPrice, maxPrice) {
  return subcategoryProducts.filter((p) => +p.price >= minPrice && +p.price <= maxPrice);
}

export function getFilteredProductsAndMinMaxPrice(categoryId, subcategoryId, searchParams) {
  const category = products.find((c) => c.id === categoryId);
  const subcategory = category.subcategories.find((s) => s.id === subcategoryId);
  const subcategoryProducts = subcategory.products;

  let searchParamsMinPrice = searchParams.get('minPrice');
  let searchParamsMaxPrice = searchParams.get('maxPrice');

  searchParams.delete('minPrice');
  searchParams.delete('maxPrice');

  const filteredBySpecsProducts = filterBySpecs(subcategoryProducts, searchParams);
  const { minPrice, maxPrice } = getMinAndMaxPrice(filteredBySpecsProducts);

  let filteredProducts;

  if (searchParamsMinPrice !== null) {
    searchParamsMinPrice = +searchParamsMinPrice;
    searchParamsMaxPrice = +searchParamsMaxPrice;

    filteredProducts = filterByPrice(
      filteredBySpecsProducts,
      searchParamsMinPrice,
      searchParamsMaxPrice,
    );
  } else {
    filteredProducts = filteredBySpecsProducts;
  }

  return {
    filteredProducts,
    minPrice,
    maxPrice,
  };
}
// news

export function getNewsPreviews() {
  const newsPrevies = news.map((n) => ({
    name: n.name,
    id: n.id,
    date: n.date,
    views: n.views,
    previewImgId: n.previewImgId,
  }));

  return newsPrevies;
}
