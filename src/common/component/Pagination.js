import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({
  totalPageNum,
  currentPage,
  onPageChange,
  className = "display-center list-style-none",
}) => {
  return (
    <ReactPaginate
      nextLabel="next >"
      onPageChange={onPageChange}
      pageRangeDisplayed={5}
      pageCount={totalPageNum}
      forcePage={currentPage - 1}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      activeClassName="active"
      className={className}
    />
  );
};

export default Pagination;
