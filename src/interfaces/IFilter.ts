import ProductFilter from "./ProductFilter";

export default interface IFilter {
    savedFilter: ProductFilter,
    currentFilter: ProductFilter
}