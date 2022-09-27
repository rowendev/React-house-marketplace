import React, { useState } from "react";
import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import Spinner from "../components/Spinner";
import Slider from "../components/Slider";

function Explore() {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="explore">
      <header>
        <p className="pageHeader">瀏覽物件</p>
      </header>
      <main>
        {/* slider */}
        <Slider />
        {/* <p className="exploreCategoryHeading">分類</p> */}
        <div className="exploreCategories">
          <Link to="/category/rent">
            <p className="exploreCategoryHeading">租房</p>
            <img
              src={rentCategoryImage}
              alt="rent"
              className="exploreCategoryImg"
            />
          </Link>
          <Link to="/category/sale">
            <p className="exploreCategoryHeading">買房</p>
            <img
              src={sellCategoryImage}
              alt="sell"
              className="exploreCategoryImg"
            />
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;
