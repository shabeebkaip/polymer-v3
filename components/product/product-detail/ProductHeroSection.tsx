import ImageContainers from "@/components/product/ImageContainers";
import {Award, Heart, Package, Share2} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import ActionButtons from "@/components/shared/ActionButtons";
import {Button} from "@/components/ui/button";
import React from "react";
import { Product } from '@/types/product';
import { UserType } from '@/types/user';

const ProductHeroSection = ({product, user} : {product: Product, user: UserType} ) => {
    const handleShare = () => {
        if (navigator.share) {
                navigator.share({
                title: product.productName,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handleChatClick = () => {
        if (!user || !user._id || !product.createdBy?._id) return;
        setChatUser({
            userId: user._id as string,
            receiverId: product.createdBy._id,
            receiverName: product.createdBy.name,
        });
        router.push(`/chat/${product._id}`);
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                        {product?.productImages && product?.productImages?.length ? (
                            <ImageContainers
                                productImages={product.productImages}
                                isCompact={true}
                            />
                        ) : (
                            <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400"/>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                        {/* Badge */}
                        {product.fdaApproved ? (
                            <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 mb-3"
                            >
                                <Award className="w-4 h-4 mr-1"/>
                                FDA Approved
                            </Badge>
                        ) : null}
                        {product.medicalGrade && !product.fdaApproved ? (
                            <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-800 mb-3"
                            >
                                <Award className="w-4 h-4 mr-1"/>
                                Medical Grade
                            </Badge>
                        ) : null}
                        {!product.fdaApproved && !product.medicalGrade ? (
                            <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-800 mb-3"
                            >
                                <Award className="w-4 h-4 mr-1"/>
                                Industrial Grade
                            </Badge>
                        ) : null}

                        {/* Product Name */}
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            {product.productName}
                        </h1>

                        {/* Key Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {product.price && product.price > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Price:</span>
                                    <span className="font-semibold text-lg text-gray-900">
                        ${product.price}/{product.uom}
                      </span>
                                </div>
                            ) : null}
                            {(product.minimum_order_quantity &&
                                product.minimum_order_quantity > 0) ||
                            (product.minOrderQuantity && product.minOrderQuantity > 0) ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Min Order:</span>
                                    <span className="font-medium text-gray-900">
                        {product.minimum_order_quantity ||
                            product.minOrderQuantity}{" "}
                                        {product.uom}
                      </span>
                                </div>
                            ) : null}
                            {product.stock && product.stock > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Stock:</span>
                                    <span className="font-medium text-gray-900">
                        {product.stock} {product.uom}
                      </span>
                                </div>
                            ) : null}
                            {product.leadTime ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Lead Time:</span>
                                    <span className="font-medium text-gray-900">
                        {product.leadTime}
                      </span>
                                </div>
                            ) : null}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <ActionButtons
                                productId={product._id}
                                uom={product.uom || "Metric Ton"}
                                variant="compact"
                                onChatClick={handleChatClick}
                                user={user}
                            />

                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleShare}
                                className="border-gray-300 text-gray-600 hover:bg-gray-50"
                            >
                                <Share2 className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductHeroSection;