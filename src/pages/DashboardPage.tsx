import { ProductCard } from "../features/dashboard/components/ProductCard";
import { MOCK_PRODUCTS } from "../features/dashboard/mocks/items";

;

export const DashboardPage = () => {
  return (
    <div className="grid">
      {MOCK_PRODUCTS.map((product) => (
        <ProductCard 
          key={product.id} 
          name={product.name} 
          price={product.price} 
        />
      ))}
    </div>
  );
};