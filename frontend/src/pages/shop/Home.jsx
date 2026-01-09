import React from "react";
import LatestCollection from "../../components/product/LatestCollection";
import Mainpage from "../../components/product/Mainpage";
import BestSeller from "../../components/product/BestSeller";
const Home = () => {
  return (
    <div>
      <Mainpage />
      <LatestCollection />
      <BestSeller />

    </div>
  );
};

export default Home;
