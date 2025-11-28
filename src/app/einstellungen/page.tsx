'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Settings,
  User,
  Building,
  CreditCard,
  Bell,
  Shield,
  Users,
  Palette,
  Globe,
  Mail,
  Plus,
  Pencil,
  Trash2,
  Key,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock-Daten für Benutzer
const teamMembers = [
  { id: '1', name: 'Max Mustermann', email: 'max@benchtrust.de', role: 'Admin', avatar: 'MM', lastActive: 'Heute, 10:34' },
  { id: '2', name: 'Lisa Schmidt', email: 'lisa@benchtrust.de', role: 'Buchhaltung', avatar: 'LS', lastActive: 'Heute, 09:15' },
  { id: '3', name: 'Tom Weber', email: 'tom@benchtrust.de', role: 'Viewer', avatar: 'TW', lastActive: 'Gestern' },
];

// Rollen
const roles = [
  { id: 'admin', name: 'Admin', description: 'Vollzugriff auf alle Funktionen' },
  { id: 'accounting', name: 'Buchhaltung', description: 'Zugriff auf Buchhaltung und Rechnungen' },
  { id: 'viewer', name: 'Viewer', description: 'Nur-Lese-Zugriff auf Berichte' },
];

export default function EinstellungenPage() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('BenchTrust GmbH');
  const [email, setEmail] = useState('kontakt@benchtrust.de');
  const [taxId, setTaxId] = useState('DE123456789');
  const [address, setAddress] = useState('Musterstraße 123, 10115 Berlin');
  const [currency, setCurrency] = useState('EUR');
  const [language, setLanguage] = useState('de');
  const [fiscalYearStart, setFiscalYearStart] = useState('januar');
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  
  const handleSave = () => {
    toast({
      title: "Einstellungen gespeichert",
      description: "Ihre Änderungen wurden erfolgreich übernommen.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Kontoeinstellungen und Präferenzen
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Unternehmen</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Benachrichtigungen</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Abrechnung</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sicherheit</span>
          </TabsTrigger>
        </TabsList>

        {/* Unternehmen */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unternehmensprofil</CardTitle>
              <CardDescription>
                Grundlegende Informationen über Ihr Unternehmen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                  <Building className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Logo hochladen
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    PNG oder JPG, max. 2MB
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firmenname</Label>
                  <Input 
                    id="companyName" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Steuernummer / USt-IdNr.</Label>
                  <Input 
                    id="taxId" 
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscalYear">Geschäftsjahresbeginn</Label>
                  <Select value={fiscalYearStart} onValueChange={setFiscalYearStart}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="januar">Januar</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="juli">Juli</SelectItem>
                      <SelectItem value="oktober">Oktober</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea 
                    id="address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Speichern</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regionale Einstellungen</CardTitle>
              <CardDescription>
                Währung, Sprache und Formatierung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="GBP">Britisches Pfund (GBP)</SelectItem>
                      <SelectItem value="CHF">Schweizer Franken (CHF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Sprache</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zeitzone</Label>
                  <Select defaultValue="europe-berlin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-berlin">Europe/Berlin (CET)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                      <SelectItem value="america-new-york">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>Speichern</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team-Mitglieder</CardTitle>
                  <CardDescription>
                    Verwalten Sie Ihr Team und deren Zugriffsrechte
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Einladen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Team-Mitglied einladen</DialogTitle>
                      <DialogDescription>
                        Senden Sie eine Einladung an ein neues Team-Mitglied
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="invite-email">E-Mail-Adresse</Label>
                        <Input id="invite-email" placeholder="neue.person@firma.de" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invite-role">Rolle</Label>
                        <Select defaultValue="viewer">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map(role => (
                              <SelectItem key={role.id} value={role.id}>
                                <div>
                                  <div className="font-medium">{role.name}</div>
                                  <div className="text-xs text-muted-foreground">{role.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Einladung senden</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Benutzer</TableHead>
                      <TableHead>Rolle</TableHead>
                      <TableHead>Letzte Aktivität</TableHead>
                      <TableHead className="w-[100px]">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                              {member.avatar}
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.lastActive}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rollen & Berechtigungen</CardTitle>
              <CardDescription>
                Definieren Sie Zugriffsrechte für verschiedene Rollen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benachrichtigungen */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>E-Mail-Benachrichtigungen</CardTitle>
              <CardDescription>
                Legen Sie fest, welche E-Mails Sie erhalten möchten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Wöchentlicher Finanzbericht</div>
                  <div className="text-sm text-muted-foreground">
                    Zusammenfassung Ihrer KPIs jeden Montag
                  </div>
                </div>
                <Button 
                  variant={weeklyReport ? 'default' : 'outline'}
                  onClick={() => setWeeklyReport(!weeklyReport)}
                >
                  {weeklyReport ? 'Aktiv' : 'Inaktiv'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Budget-Warnungen</div>
                  <div className="text-sm text-muted-foreground">
                    Benachrichtigung bei Budgetüberschreitungen
                  </div>
                </div>
                <Button 
                  variant={budgetAlerts ? 'default' : 'outline'}
                  onClick={() => setBudgetAlerts(!budgetAlerts)}
                >
                  {budgetAlerts ? 'Aktiv' : 'Inaktiv'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Rechnungs-Erinnerungen</div>
                  <div className="text-sm text-muted-foreground">
                    Erinnerung an überfällige Rechnungen
                  </div>
                </div>
                <Button 
                  variant={emailNotifications ? 'default' : 'outline'}
                  onClick={() => setEmailNotifications(!emailNotifications)}
                >
                  {emailNotifications ? 'Aktiv' : 'Inaktiv'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Abrechnung */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktueller Plan</CardTitle>
              <CardDescription>
                Ihr aktives Abonnement und Nutzung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                <div>
                  <Badge className="mb-2">Professional</Badge>
                  <div className="text-2xl font-bold">€49/Monat</div>
                  <div className="text-sm text-muted-foreground">
                    Abrechnung monatlich, nächste Zahlung am 1.12.2024
                  </div>
                </div>
                <Button variant="outline">Plan ändern</Button>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Benutzer</span>
                  <span>3 von 10 verwendet</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full w-[30%] bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zahlungsmethode</CardTitle>
              <CardDescription>
                Ihre hinterlegte Zahlungsmethode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 bg-muted rounded flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">Visa •••• 4242</div>
                    <div className="text-sm text-muted-foreground">Läuft ab 12/2025</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Ändern</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sicherheit */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Passwort ändern</CardTitle>
              <CardDescription>
                Aktualisieren Sie Ihr Passwort regelmäßig
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Aktuelles Passwort</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Neues Passwort</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex justify-end">
                <Button>Passwort ändern</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zwei-Faktor-Authentifizierung</CardTitle>
              <CardDescription>
                Erhöhen Sie die Sicherheit Ihres Kontos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <div className="font-medium">2FA ist deaktiviert</div>
                    <div className="text-sm text-muted-foreground">
                      Schützen Sie Ihr Konto mit einem zweiten Faktor
                    </div>
                  </div>
                </div>
                <Button>Aktivieren</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktive Sitzungen</CardTitle>
              <CardDescription>
                Geräte, auf denen Sie angemeldet sind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Chrome auf Windows</div>
                      <div className="text-sm text-muted-foreground">Berlin, Deutschland • Aktiv jetzt</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">Aktuell</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Safari auf iPhone</div>
                      <div className="text-sm text-muted-foreground">Berlin, Deutschland • Vor 2 Stunden</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">Abmelden</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
