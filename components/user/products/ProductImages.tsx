import React from "react";
import ImageUpload from "../../shared/ImageUpload";

const ProductImages = ({}) => {
  return (
    <>
      <div className="col-span-3 ">
        <h4 className="text-xl">Product Images</h4>
      </div>
      <div className="col-span-3">
        <ImageUpload
          onFilesUpload={(files) => {}}
          previews={[]}
          setPreviews={() => {}}
          onImageClick={() => {}}
          width="100%"
          height="200px"
        />
      </div>
    </>
  );
};

export default ProductImages;
