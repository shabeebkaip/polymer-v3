import React from "react";

interface ProductValueCardProps {
    label: string;
    value: string | number;
}

const ProductValueCard: React.FC<ProductValueCardProps> = ({ label, value }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-600">
                {label}
            </span>
            <p className="text-gray-900 font-medium">
                {value}
            </p>
        </div>
    );
};
export default ProductValueCard;
