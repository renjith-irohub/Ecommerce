import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {

    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);





  if (!visible || !showSearch) return null;

  return (
    <div className="border-t border-b bg-gray-50 text-center py-4">
      <div className="inline-flex items-center justify-center border border-gray-300 px-4 py-2 rounded-full w-3/4 sm:w-1/2 bg-white shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm px-2"
          type="text"
          placeholder="Search products..."
        />
      </div>
    </div>
  );
};

export default SearchBar;




