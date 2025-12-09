"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

const SearchPage = () => {
    const params = useParams();
    const query = params?.query;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await fetch(`/api/search?query=${query}`);
                const data = await res.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (query) getProducts();
    }, [query]);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-5">
                Search Results for "{decodeURIComponent(query || "")}"
            </h1>

            {loading && <p>Loading...</p>}
            {!loading && products.length === 0 && (
                <p className="text-gray-500">No products found matching your search.</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-4">
                {products.map((product) => (
                    // FIX: Change 'data={product}' to 'product={product}' to match the prop name expected by ProductCard
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default SearchPage;