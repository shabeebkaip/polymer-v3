import { getProductList } from '@/apiServices/products';
import Image from 'next/image';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

// Custom debounce hook
function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const cancel = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    const debounced = useCallback((...args: any[]) => {
        cancel();
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);
    useEffect(() => cancel, []);
    return debounced;
}

const HeroSearch = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 300 });
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Debounced fetch function
    const fetchProducts = useCallback(async (query: string) => {
        if (!query.trim()) {
            setProducts([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await getProductList({ search: query.trim() });
            setProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetch = useDebounce(fetchProducts, 350);

    // Watch searchQuery and fire debounced fetch
    useEffect(() => {
        if (searchQuery.trim()) {
            debouncedFetch(searchQuery);
        } else {
            setProducts([]);
        }
    }, [searchQuery, debouncedFetch]);

    // Handle position updates when showing dropdown
    useEffect(() => {
        if (searchQuery.trim() && inputRef.current) {
            const updatePosition = () => {
                if (inputRef.current) {
                    const rect = inputRef.current.getBoundingClientRect();
                    const newPosition = {
                        top: rect.bottom + 4, // Just 4px gap below input
                        left: rect.left,
                        width: rect.width
                    };
                    setDropdownPosition(newPosition);
                }
            };
            
            // Initial position with small delay to ensure DOM is ready
            setTimeout(updatePosition, 0);
            
            // Update position on scroll and resize
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
            
            return () => {
                window.removeEventListener('scroll', updatePosition);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [searchQuery]);

    // Keyboard navigation
    useEffect(() => {
        if (!searchQuery.trim()) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                setHighlighted((h) => Math.min(h + 1, products.length - 1));
            } else if (e.key === 'ArrowUp') {
                setHighlighted((h) => Math.max(h - 1, 0));
            } else if (e.key === 'Enter' && highlighted >= 0 && products[highlighted]) {
                router.push(`/products/${products[highlighted]._id}`);
                setSearchQuery('');
                setProducts([]);
            } else if (e.key === 'Escape') {
                setSearchQuery('');
                setProducts([]);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [searchQuery, products, highlighted, router]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setSearchQuery('');
                setProducts([]);
            }
        };
        
        // Use both mousedown and click for better responsiveness
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('click', handleClick);
        
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div className="mt-10 w-full relative mx-auto">
            <div className="relative drop-shadow-lg w-full max-w-4xl mx-auto px-8">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search polymers, compounds, resins..."
                    className="w-full px-8 py-6 rounded-full border-2 border-[var(--green-light)] focus:ring-4 focus:ring-green-200 focus:border-green-500 shadow-xl transition-all duration-300 pr-16 text-lg font-medium placeholder:text-gray-400 bg-white/95 backdrop-blur-sm hover:shadow-2xl"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setHighlighted(-1);
                    }}
                    onFocus={() => {
                        // Just focus, no additional logic needed
                    }}
                    autoComplete="off"
                />
                <div
                    className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-green-500 rounded-full shadow-md hover:bg-green-600 transition-colors duration-200"
                >
                    {loading ? (
                        <span className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        <Image
                            src="/icons/search.svg"
                            alt="Search Icon"
                            width={24}
                            height={24}
                            className="filter brightness-0 invert"
                        />
                    )}
                </div>
            </div>
            {searchQuery.trim() && typeof window !== 'undefined' && dropdownPosition.width > 0 && createPortal(
                <div
                    ref={resultsRef}
                    className="bg-white shadow-2xl rounded-xl border border-gray-200 max-h-80 overflow-auto"
                    style={{ 
                        position: 'fixed',
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                        zIndex: 99999,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : products?.length > 0 ? (
                        <div>
                            {products.map((product, index) => (
                                <div
                                    key={product._id}
                                    className={`p-4 border-b border-gray-100 flex items-center gap-4 cursor-pointer transition-colors duration-150 hover:bg-green-50 ${highlighted === index ? 'bg-green-100' : ''}`}
                                    onClick={() => {
                                        router.push(`/products/${product._id}`);
                                        setSearchQuery('');
                                        setProducts([]);
                                    }}
                                    onMouseEnter={() => setHighlighted(index)}
                                >
                                    <Image
                                        src={product.createdBy?.company_logo || "/assets/default-product.png"}
                                        alt={product.productName}
                                        width={44}
                                        height={44}
                                        className="rounded-full object-cover"
                                    />
                                    <div className='flex flex-col items-start'>
                                        <h3 className="text-base font-semibold text-gray-900">{product.productName}</h3>
                                        <p className="text-xs text-gray-500">{product.createdBy?.company}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No products found for "{searchQuery}"
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

export default HeroSearch;
