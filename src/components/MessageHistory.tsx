import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Download, Trash2 } from "lucide-react";

interface HistoryEntry {
  id: string;
  date: string;
  products: Array<{ name: string; price: number; unit: string; }>;
  contacts: Array<{ name: string; }>;
  message: string;
}

const MessageHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('viber-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  const exportToCSV = () => {
    if (history.length === 0) return;

    const csvHeaders = ['Data', 'Produktet', 'Çmimet', 'Kontaktet', 'Mesazhi'];
    const csvRows = history.map(entry => [
      entry.date,
      entry.products.map(p => p.name).join('; '),
      entry.products.map(p => `${p.name} (${p.price % 1 === 0 ? p.price.toFixed(0) : p.price} L/${p.unit})`).join(', '),
      entry.products.map(p => `${p.price % 1 === 0 ? p.price.toFixed(0) : p.price} L/${p.unit}`).join('; '),
      entry.contacts.map(c => c.name).join('; '),
      `"${entry.message.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viber-historik-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    if (confirm('Jeni i sigurt që doni të fshini të gjithë historikun?')) {
      localStorage.removeItem('viber-history');
      setHistory([]);
    }
  };

  const addToHistory = (entry: Omit<HistoryEntry, 'id'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString()
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('viber-history', JSON.stringify(updatedHistory));
  };

  // Expose addToHistory function globally so other components can use it
  useEffect(() => {
    (window as any).addToViberHistory = addToHistory;
  }, [history]);

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader className="bg-gradient-to-r from-fresh-red to-fresh-orange text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <History className="h-6 w-6" />
          Historiku i Mesazheve
        </CardTitle>
        <CardDescription className="text-white/90">
          Të gjitha mesazhet e dërguara
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {history.length > 0 && (
          <div className="flex gap-2 mb-4">
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Eksporto CSV
            </Button>
            <Button
              onClick={clearHistory}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Pastro Historikun
            </Button>
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nuk keni mesazhe të dërguar ende.</p>
            <p className="text-sm">Historiku do të shfaqet këtu pasi të dërgoni mesazhin e parë.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg bg-card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">
                    {new Date(entry.date).toLocaleDateString('sq-AL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {entry.contacts.length} kontakte
                  </span>
                </div>
                
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">Produktet: </span>
                    <span className="text-muted-foreground">
                      {entry.products.map(p => `${p.name} (${p.price % 1 === 0 ? p.price.toFixed(0) : p.price} L/${p.unit})`).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Kontaktet: </span>
                    <span className="text-muted-foreground">
                      {entry.contacts.map(c => c.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageHistory;