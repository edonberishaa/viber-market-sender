import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface MessagePreviewProps {
  products: Product[];
  contacts: Contact[];
  onSendMessage: () => void;
}

const MessagePreview = ({ products, contacts, onSendMessage }: MessagePreviewProps) => {
  const { toast } = useToast();
  const selectedContacts = contacts.filter(c => c.selected);
  
  const generateMessage = () => {
    const today = new Date().toLocaleDateString('sq-AL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const validProducts = products.filter(p => p.name.trim() && p.price > 0);
    
    if (validProducts.length === 0) {
      return "🍎🥬 Mirëmëngjesi!\n\nNuk keni produkte të vlefshme për të dërguar sot.";
    }

    let message = `🍎🥬 Mirëmëngjesi!\n\n📅 ${today}\n\n💰 ÇMIMET E DITËS:\n\n`;
    
    validProducts.forEach(product => {
      message += `🔹 ${product.name}: ${product.price.toFixed(0)} L/${product.unit}\n`;
    });
    
    message += `\n✨ Fruta dhe perime të freskëta!\n📞 Për porosi mund të më kontaktoni.\n\nFaleminderit! 🙏`;
    
    return message;
  };

  const copyToClipboard = async () => {
    const message = generateMessage();
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "U kopjua!",
        description: "Mesazhi u kopjua në clipboard.",
      });
    } catch (error) {
      toast({
        title: "Gabim",
        description: "Nuk u arrit të kopjohet mesazhi.",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    const data = {
      date: new Date().toISOString(),
      products: products.filter(p => p.name.trim() && p.price > 0),
      contacts: selectedContacts,
      message: generateMessage()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viber-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Eksportuar!",
      description: "Të dhënat u eksportuan për script automatizimi.",
    });
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader className="bg-gradient-to-r from-fresh-green to-fresh-orange text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Preview Mesazhi
        </CardTitle>
        <CardDescription className="text-white/90">
          Shikoni mesazhin që do të dërgohet
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Message Preview */}
        <div className="mb-6">
          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-fresh-green">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {generateMessage()}
            </pre>
          </div>
        </div>

        {/* Recipients */}
        {selectedContacts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              Marrës ({selectedContacts.length} kontakte):
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedContacts.map(contact => (
                <span
                  key={contact.id}
                  className="px-3 py-1 bg-fresh-green/10 text-fresh-green rounded-full text-sm font-medium"
                >
                  {contact.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-1 min-w-[120px]"
          >
            <Copy className="h-4 w-4 mr-2" />
            Kopjo Mesazhin
          </Button>
          
          <Button
            onClick={exportData}
            variant="outline"
            className="flex-1 min-w-[120px]"
          >
            <Download className="h-4 w-4 mr-2" />
            Eksporto për Script
          </Button>
          
          <Button
            onClick={onSendMessage}
            disabled={selectedContacts.length === 0 || products.filter(p => p.name.trim() && p.price > 0).length === 0}
            className="flex-1 min-w-[120px] bg-fresh-orange hover:bg-fresh-orange/90"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Regjistro Dërgimin
          </Button>
        </div>

        {selectedContacts.length === 0 && (
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Zgjidhni të paktën një kontakt për të vazhduar.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagePreview;