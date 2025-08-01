import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PriceForm from "@/components/PriceForm";
import ContactManager from "@/components/ContactManager";
import MessagePreview from "@/components/MessagePreview";
import MessageHistory from "@/components/MessageHistory";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface Contact {
  id: string;
  name: string;
  phone?: string;
  selected: boolean;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  const handleSendMessage = () => {
    const validProducts = products.filter(p => p.name.trim() && p.price > 0);
    const selectedContacts = contacts.filter(c => c.selected);

    if (validProducts.length === 0 || selectedContacts.length === 0) {
      toast({
        title: "Gabim",
        description: "Duhet të keni të paktën një produkt me çmim dhe një kontakt të zgjedhur.",
        variant: "destructive",
      });
      return;
    }

    // Add to history
    const historyEntry = {
      date: new Date().toISOString(),
      products: validProducts,
      contacts: selectedContacts,
      message: generateMessage(validProducts)
    };

    // Use the global function to add to history
    if ((window as any).addToViberHistory) {
      (window as any).addToViberHistory(historyEntry);
    }

    toast({
      title: "U regjistrua!",
      description: `Mesazhi u regjistrua për ${selectedContacts.length} kontakte. Përdorni të dhënat e eksportuara për automatizim.`,
    });
  };

  const generateMessage = (validProducts: Product[]) => {
    const today = new Date().toLocaleDateString('sq-AL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let message = `🍎🥬 Mirëmëngjesi!\n\n📅 ${today}\n\n💰 ÇMIMET E DITËS:\n\n`;
    
    validProducts.forEach(product => {
      const formattedPrice = product.price % 1 === 0 ? product.price.toFixed(0) : product.price.toString();
      message += `🔹 ${product.name}: ${formattedPrice} L/${product.unit}\n`;
    });
    
    message += `\n✨ Fruta dhe perime të freskëta!\n📞 Për porosi mund të më kontaktoni.\n\nFaleminderit! 🙏`;
    
    return message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-fresh-green/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-fresh-green to-fresh-orange bg-clip-text text-transparent">
            🍎 Viber Market Sender
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Menaxhoni çmimet e frutave dhe perimeve, zgjidhni kontaktet dhe krijoni mesazhe të bukura për Viber
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            <PriceForm onProductsChange={setProducts} />
            <ContactManager onContactsChange={setContacts} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <MessagePreview 
              products={products} 
              contacts={contacts} 
              onSendMessage={handleSendMessage}
            />
            <MessageHistory />
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-card rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-fresh-green">🚀 Si të përdorni aplikacionin:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1️⃣ Futni Çmimet</h3>
              <p className="text-muted-foreground">Shtoni produktet dhe çmimet e tyre për ditën e sotme. Mund të shtoni produkte të reja ose të redaktoni ato ekzistuese.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2️⃣ Zgjidhni Kontaktet</h3>
              <p className="text-muted-foreground">Shtoni kontaktet dhe zgjidhni kush do të marrë mesazhin. Kontaktet ruhen automatikisht për herët e tjera.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3️⃣ Dërgoni dhe Automatizoni</h3>
              <p className="text-muted-foreground">Kopjoni mesazhin ose eksportoni të dhënat për të krijuar një script automatizimi që kontrollon Viber Desktop.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
