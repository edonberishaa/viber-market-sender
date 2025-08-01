import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface PriceFormProps {
  onProductsChange: (products: Product[]) => void;
}

const defaultProducts: Product[] = [
  { id: "1", name: "Mollë", price: 0, unit: "kg" },
  { id: "2", name: "Banane", price: 0, unit: "kg" },
  { id: "3", name: "Portokall", price: 0, unit: "kg" },
  { id: "4", name: "Domate", price: 0, unit: "kg" },
  { id: "5", name: "Kastravec", price: 0, unit: "kg" },
];

const PriceForm = ({ onProductsChange }: PriceFormProps) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
    onProductsChange(updatedProducts);
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      unit: "kg"
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    onProductsChange(updatedProducts);
  };

  const removeProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    onProductsChange(updatedProducts);
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader className="bg-gradient-to-r from-fresh-green to-fresh-orange text-white rounded-t-lg">
        <CardTitle className="text-2xl">Çmimet e Ditës</CardTitle>
        <CardDescription className="text-white/90">
          Futni çmimet e frutave dhe perimeve për sot
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-end gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor={`name-${product.id}`}>Produkti</Label>
                <Input
                  id={`name-${product.id}`}
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                  placeholder="Emri i produktit"
                  className="mt-1"
                />
              </div>
              <div className="w-32">
                <Label htmlFor={`price-${product.id}`}>Çmimi</Label>
                <Input
                  id={`price-${product.id}`}
                  type="number"
                  value={product.price}
                  onChange={(e) => updateProduct(product.id, "price", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div className="w-20">
                <Label htmlFor={`unit-${product.id}`}>Njësia</Label>
                <Input
                  id={`unit-${product.id}`}
                  value={product.unit}
                  onChange={(e) => updateProduct(product.id, "unit", e.target.value)}
                  placeholder="kg"
                  className="mt-1"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeProduct(product.id)}
                className="mb-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            onClick={addProduct}
            className="w-full bg-fresh-green hover:bg-fresh-green/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Shto Produkt të Ri
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceForm;