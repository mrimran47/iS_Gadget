'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import Footer from '@/components/seller/Footer';
import Loading from '@/components/Loading';
import { assets } from '@/assets/assets';

const ProductList = () => {
  const { router } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchSellerProduct = async () => {
    setLoading(true);
    setErr('');
    try {
     
      const res = await fetch('/api/product/seller-list', {
        method: 'GET',
        credentials: 'include',           // send Clerk cookies
        headers: { Accept: 'application/json' }


      });

      if (!res.ok) {
        // If this is an HTML error page, trying to parse JSON would throw "<!DOCTYPE ...".
        const text = await res.text();
        throw new Error(`HTTP ${res.status} – ${text.slice(0, 120)}`);
      }

      const data = await res.json();
      if (!data?.success) throw new Error(data?.message || 'Failed to load products');

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (e) {
      console.error(e);
      setErr(e.message || 'Something went wrong');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`/api/product/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (!data.success) {
      alert(data.message);
      return;
    }

    // Refresh list after delete
    setProducts(prev => prev.filter(item => item._id !== id));

  } catch (error) {
    alert("Failed to delete product.");
  }
};


  useEffect(() => {
    fetchSellerProduct();
  }, []);

  return (
  <div className="flex-1 min-h-screen flex flex-col justify-between">
    {loading ? (
      <Loading />
    ) : (
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>

        {err ? (
          <p className="text-red-600 text-sm mb-4">{err}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm mb-4">No products found.</p>
        ) : null}

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                <th className="px-4 py-3 font-medium truncate hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 font-medium truncate">Price</th>
                {/* Action column only on sm+ */}
                <th className="px-4 py-3 font-medium truncate hidden sm:table-cell">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-500">
              {products.map((p) => {
                const img = p?.image?.[0] || p?.images?.[0] || '/placeholder.png';
                const price = p?.offerPrice ?? p?.price ?? 0;

                return (
                  <tr key={p._id || p.id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3">
                      <div className="flex items-center gap-3 truncate">
                        <div className="bg-gray-500/10 rounded p-2 shrink-0">
                          <Image
                            src={img}
                            alt={`${p.name} image`}
                            className="w-16 h-16 object-cover"
                            width={128}
                            height={128}
                          />
                        </div>
                        <span className="truncate w-full">{p.name}</span>
                      </div>

                      {/* Mobile-only action buttons */}
                      <div className="sm:hidden mt-2 flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/product/${p._id || p.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-white rounded-md"
                        >
                          Visit
                          <Image className="h-3.5 w-3.5" src={assets.redirect_icon} alt="open" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 hidden sm:table-cell">{p.category}</td>
                    <td className="px-4 py-3">{price} ৳</td>

                    {/* Desktop/tablet action column */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => router.push(`/product/${p._id || p.id}`)}
                          className="flex items-center gap-1 px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-md transition"
                        >
                          <span className="hidden md:block">Visit</span>
                          <Image className="h-3.5 w-3.5" src={assets.redirect_icon} alt="open" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}
    <Footer />
  </div>
);

};

export default ProductList;
