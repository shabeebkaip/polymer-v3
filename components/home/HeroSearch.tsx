import { getProductList } from '@/apiServices/products';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const HeroSearch = () => {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // For debounce
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // If input is empty, clear products
        if (!searchQuery.trim()) {
            setProducts([]);
            return;
        }

        setLoading(true);

        // Debounce: Clear previous timeout
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            getProductList({ search: searchQuery.trim() })
                .then((response) => {
                    setProducts(response.data || []);
                })
                .catch((error) => {
                    setProducts([]);
                    console.error("Error fetching products:", error);
                })
                .finally(() => setLoading(false));
        }, 400); // 400ms delay after user stops typing

        // Clean up timeout on unmount or before next effect
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchQuery]);

    return (
        <>
            <div className="mt-10 w-full relative ">
                <div
                    className="w-10 h-10
                    bg-gradient-to-r
                    from-[var(--green-gradient-from)]
                    via-[var(--green-gradient-via)]
                    to-[var(--green-gradient-to)]
                    rounded-full flex justify-center items-center absolute top-2 2xl:right-66 xl:right-56 lg:right-44 md:right-32 sm:right-28 right-4"
                >
                    <Image
                        src="/icons/search.svg"
                        alt="Arrow Icon"
                        width={20}
                        height={20}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search Polymers"
                        className="w-full md:w-4/6 px-4 py-4  rounded-full border-1 border-[var(--green-light)]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {
                searchQuery &&
                <div className="bg-white shadow-md md:w-4/6 ">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : products?.length > 0 ? (
                        <div>
                            {products.map((product, index) => (
                                <div key={index} className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/products/${product._id}`)}>
                                    <div className="flex items-center justify-start">
                                        <div>
                                            <Image
                                                src={product.createdBy?.company_logo || "/assets/default-product.png"}
                                                alt={product.productName}
                                                width={50}
                                                height={50}
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className='flex flex-col items-start'>
                                            <h3 className="text-lg font-semibold">{product.productName}</h3>
                                            <p className="text-sm text-gray-500">{product.createdBy?.company}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No products found for "{searchQuery}"
                        </div>
                    )}
                </div>
            }
        </>
    );
};

export default HeroSearch;
