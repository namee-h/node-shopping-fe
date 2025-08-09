import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import Pagination from "../../common/component/Pagination";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import LoadingSpinner from "../../common/component/LoadingSpinner";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const { productList, totalPageNum, loading } = useSelector(
    (state) => state.product
  );
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });

  useEffect(() => {
    const currentPage = query.get("page") || 1;
    const currentName = query.get("name") || "";

    setSearchQuery({
      page: currentPage,
      name: currentName,
    });
  }, [query]);

  useEffect(() => {
    dispatch(getProductList({ ...searchQuery }));
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();
    navigate("?" + queryString);
  }, [searchQuery, navigate]);

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const renderContent = () => {
    const emptyProduct =
      searchQuery.name !== "" && !loading && productList.length === 0;
    const noResult =
      searchQuery.name !== "" && !loading && productList.length > 0;
    const landingProduct = productList.length > 0 && !loading;

    if (loading) {
      return (
        <div className="text-align-center empty-bag">
          <LoadingSpinner />
        </div>
      );
    }

    if (landingProduct) {
      return productList.map((item) => (
        <Col md={3} sm={12} key={item._id}>
          <ProductCard item={item} />
        </Col>
      ));
    }

    if (noResult) {
      return (
        <div className="text-align-center empty-bag">
          <h2>{searchQuery.name}와 일치하는 결과가 없습니다</h2>
        </div>
      );
    }

    // 상품이 없을 때
    if (emptyProduct) {
      return (
        <div className="text-align-center empty-bag">
          <h2>등록된 상품이 없습니다!</h2>
        </div>
      );
    }
  };

  return (
    <Container>
      <Row>{renderContent()}</Row>

      <Pagination
        totalPageNum={totalPageNum}
        currentPage={searchQuery.page}
        onPageChange={handlePageClick}
      />
    </Container>
  );
};

export default LandingPage;
