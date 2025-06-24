"use client";

import React, { useEffect } from "react";
import Categories from "./Categories";
import { useSharedState } from "@/stores/sharedStore";

const CategoryWrapper = () => {
  const { industries, productFamilies, fetchIndustries, fetchProductFamilies } =
    useSharedState();

  useEffect(() => {
    fetchIndustries();
    fetchProductFamilies();
  }, [fetchIndustries, fetchProductFamilies]);

  return (
    <Categories industries={industries} productFamiliesList={productFamilies} />
  );
};

export default CategoryWrapper;
