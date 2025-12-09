import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import FilterSidebar from "./FilterSidebar";
import Loading from "./Loading";

const HomeProducts = () => {
  const { products, router, filters, handleFilterChange, loading } = useAppContext();
  const displayProducts = products || [];

  return (
    <div className="flex flex-col items-center pt-14">
      
      <div className="w-full mb-6 md:w-[400px] md:flex-shrink-0"> 
        <FilterSidebar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </div>

      <p className="text-2xl font-medium text-left w-full">Home products</p>

      {loading ? (
        <div className="w-full text-center py-10">
          <Loading/>
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="w-full text-center py-10">
          <p className="text-lg font-medium text-red-500">
            No products found matching your filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
          {displayProducts.map((product, index) => 
            product ? <ProductCard key={index} product={product} /> : null
          )}
        </div>
      )}

      <button 
        onClick={() => router.push('/all-products')} 
        className="px-12 py-2.5 border rounded text-gray-900/70 hover:bg-gradient-to-r from-[#0A1625] to-[#0C1A2E] hover:text-white transition"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
