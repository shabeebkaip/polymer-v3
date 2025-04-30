import React from "react";

const FeaturedSuppliers: React.FC = () => {
  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col  items-center gap-14">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center ">
          <h2>Featured Suppliers</h2>
          <p>
            As new technologies like cryptocurrency develop, the real estate
            sector is changing drastically. It is important to understand both
            how these technologies and the traditional real estate market work.{" "}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuppliers;
