import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus, Users } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone?: string;
  selected: boolean;
}

interface ContactManagerProps {
  onContactsChange: (contacts: Contact[]) => void;
}

const ContactManager = ({ onContactsChange }: ContactManagerProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('viber-contacts');
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        setContacts(parsed);
        onContactsChange(parsed);
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    }
  }, [onContactsChange]);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem('viber-contacts', JSON.stringify(contacts));
    onContactsChange(contacts);
  }, [contacts, onContactsChange]);

  const addContact = () => {
    if (!newContactName.trim()) return;
    
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim() || undefined,
      selected: false
    };
    
    setContacts([...contacts, newContact]);
    setNewContactName("");
    setNewContactPhone("");
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const toggleContact = (id: string, selected: boolean) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, selected } : contact
    ));
  };

  const toggleAll = (selected: boolean) => {
    setContacts(contacts.map(contact => ({ ...contact, selected })));
  };

  const selectedCount = contacts.filter(c => c.selected).length;

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader className="bg-gradient-to-r from-fresh-orange to-fresh-yellow text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="h-6 w-6" />
          Kontaktet
        </CardTitle>
        <CardDescription className="text-white/90">
          Menaxhoni kontaktet dhe zgjidhni kush do të marrë mesazhin
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Add new contact */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Shto Kontakt të Ri</h3>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="contactName">Emri</Label>
              <Input
                id="contactName"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="Emri i kontaktit"
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="contactPhone">Telefoni (opsional)</Label>
              <Input
                id="contactPhone"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder="+355 69 123 4567"
                className="mt-1"
              />
            </div>
            <Button
              onClick={addContact}
              disabled={!newContactName.trim()}
              className="self-end bg-fresh-orange hover:bg-fresh-orange/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contacts list */}
        {contacts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Lista e Kontakteve ({selectedCount} të zgjedhur)
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAll(true)}
                >
                  Zgjidh Të Gjithë
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAll(false)}
                >
                  Hiq Të Gjithë
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                  <Checkbox
                    checked={contact.selected}
                    onCheckedChange={(checked) => toggleContact(contact.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{contact.name}</div>
                    {contact.phone && (
                      <div className="text-sm text-muted-foreground">{contact.phone}</div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeContact(contact.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {contacts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nuk keni kontakte të ruajtura ende.</p>
            <p className="text-sm">Shtoni kontaktin e parë më sipër.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactManager;