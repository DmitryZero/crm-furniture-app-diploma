export default interface IPagination {
    totalNumberPages: number,
    currentNumberPage: number,
    isNewFilterRequest: boolean,
    updatePagination: boolean
}