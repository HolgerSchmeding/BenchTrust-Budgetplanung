'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Edit,
  Trash2,
  TrendingDown,
  Euro,
  Download,
  Calendar,
  Building2,
  Wallet,
  Server,
  Megaphone,
  Briefcase
} from 'lucide-react';

const months = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

const costCategories = [
  { id: 'personnel', name: 'Personalkosten', icon: 'users' },
  { id: 'infrastructure', name: 'Infrastruktur', icon: 'server' },
  { id: 'marketing', name: 'Marketing', icon: 'megaphone' },
  { id: 'operations', name: 'Betrieb', icon: 'briefcase' },
  { id: 'other', name: 'Sonstiges', icon: 'wallet' },
];

interface MonthlyCost {
  amount: number;
}

interface CostItem {
  id: string;
  name: string;
  category: string;
  description: string;
  monthlyAmount: number;
  startMonth: number;
  endMonth: number;
  monthlyCosts?: { [month: number]: MonthlyCost };
}

const initialCostItems: CostItem[] = [
  { id: 'cost1', name: 'Gehälter', category: 'personnel', description: 'Löhne und Gehälter Mitarbeiter', monthlyAmount: 12000, startMonth: 0, endMonth: 11 },
  { id: 'cost2', name: 'Sozialabgaben', category: 'personnel', description: 'AG-Anteile Sozialversicherung', monthlyAmount: 2400, startMonth: 0, endMonth: 11 },
  { id: 'cost3', name: 'Weiterbildung', category: 'personnel', description: 'Schulungen und Kurse', monthlyAmount: 500, startMonth: 0, endMonth: 11 },
  { id: 'cost4', name: 'Cloud Hosting', category: 'infrastructure', description: 'Server, Storage, CDN', monthlyAmount: 1500, startMonth: 0, endMonth: 11 },
  { id: 'cost5', name: 'SaaS Tools', category: 'infrastructure', description: 'Slack, GitHub, Figma, etc.', monthlyAmount: 800, startMonth: 0, endMonth: 11 },
  { id: 'cost6', name: 'Domain & SSL', category: 'infrastructure', description: 'Domains und Zertifikate', monthlyAmount: 50, startMonth: 0, endMonth: 11 },
  { id: 'cost7', name: 'Google Ads', category: 'marketing', description: 'Suchmaschinenwerbung', monthlyAmount: 2000, startMonth: 0, endMonth: 11 },
  { id: 'cost8', name: 'Content Marketing', category: 'marketing', description: 'Blog, Social Media, Content', monthlyAmount: 500, startMonth: 0, endMonth: 11 },
  { id: 'cost9', name: 'Events & Sponsoring', category: 'marketing', description: 'Messen, Konferenzen', monthlyAmount: 1000, startMonth: 3, endMonth: 8 },
  { id: 'cost10', name: 'Büro & Miete', category: 'operations', description: 'Büroräume und Nebenkosten', monthlyAmount: 1500, startMonth: 0, endMonth: 11 },
  { id: 'cost11', name: 'Versicherungen', category: 'operations', description: 'Betriebsversicherungen', monthlyAmount: 200, startMonth: 0, endMonth: 11 },
  { id: 'cost12', name: 'Rechts- & Steuerberatung', category: 'operations', description: 'Rechtsanwalt, Steuerberater', monthlyAmount: 500, startMonth: 0, endMonth: 11 },
  { id: 'cost13', name: 'Sonstige Kosten', category: 'other', description: 'Diverse Ausgaben', monthlyAmount: 300, startMonth: 0, endMonth: 11 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function getCostItemMonthlyAmount(item: CostItem, monthIndex: number): number {
  if (monthIndex < item.startMonth || monthIndex > item.endMonth) return 0;
  if (item.monthlyCosts && item.monthlyCosts[monthIndex]) return item.monthlyCosts[monthIndex].amount;
  return item.monthlyAmount;
}

function getCostItemYearlyAmount(item: CostItem): number {
  let total = 0;
  for (let m = 0; m <= 11; m++) total += getCostItemMonthlyAmount(item, m);
  return total;
}

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'personnel': return <Building2 className="h-4 w-4" />;
    case 'infrastructure': return <Server className="h-4 w-4" />;
    case 'marketing': return <Megaphone className="h-4 w-4" />;
    case 'operations': return <Briefcase className="h-4 w-4" />;
    default: return <Wallet className="h-4 w-4" />;
  }
}

export default function BudgetplanungPage() {
  const [costItems, setCostItems] = useState<CostItem[]>(initialCostItems);
  const [isAddCostOpen, setIsAddCostOpen] = useState(false);
  const [isEditCostOpen, setIsEditCostOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<CostItem | null>(null);
  const [isDeleteCostOpen, setIsDeleteCostOpen] = useState(false);
  const [deletingCost, setDeletingCost] = useState<CostItem | null>(null);
  const [isCostPlanningOpen, setIsCostPlanningOpen] = useState(false);
  const [planningCost, setPlanningCost] = useState<CostItem | null>(null);
  const [newCost, setNewCost] = useState<Partial<CostItem>>({ name: '', category: 'operations', description: '', monthlyAmount: 0, startMonth: 0, endMonth: 11 });

  const totalYearlyCosts = costItems.reduce((sum, item) => sum + getCostItemYearlyAmount(item), 0);
  const totalMonthlyCostsAvg = totalYearlyCosts / 12;

  const monthlyTotalCosts = months.map((_, monthIndex) => costItems.reduce((sum, item) => sum + getCostItemMonthlyAmount(item, monthIndex), 0));

  const costsByCategory = costCategories.map(cat => ({
    ...cat,
    items: costItems.filter(item => item.category === cat.id),
    total: costItems.filter(item => item.category === cat.id).reduce((sum, item) => sum + getCostItemYearlyAmount(item), 0),
  })).filter(cat => cat.items.length > 0);

  const handleAddCost = () => {
    if (newCost.name && newCost.monthlyAmount !== undefined) {
      const cost: CostItem = { id: `cost${Date.now()}`, name: newCost.name || '', category: newCost.category || 'other', description: newCost.description || '', monthlyAmount: newCost.monthlyAmount || 0, startMonth: newCost.startMonth || 0, endMonth: newCost.endMonth || 11 };
      setCostItems([...costItems, cost]);
      setIsAddCostOpen(false);
      setNewCost({ name: '', category: 'operations', description: '', monthlyAmount: 0, startMonth: 0, endMonth: 11 });
    }
  };

  const handleEditCost = (item: CostItem) => { setEditingCost({ ...item }); setIsEditCostOpen(true); };
  const handleSaveEditCost = () => { if (editingCost) { setCostItems(costItems.map(c => c.id === editingCost.id ? editingCost : c)); setIsEditCostOpen(false); setEditingCost(null); } };
  const handleDeleteCostClick = (item: CostItem) => { setDeletingCost(item); setIsDeleteCostOpen(true); };
  const handleConfirmDeleteCost = () => { if (deletingCost) { setCostItems(costItems.filter(c => c.id !== deletingCost.id)); setIsDeleteCostOpen(false); setDeletingCost(null); } };
  const handleOpenCostPlanning = (item: CostItem) => { setPlanningCost({ ...item }); setIsCostPlanningOpen(true); };
  const handleSaveCostPlanning = () => { if (planningCost) { setCostItems(costItems.map(c => c.id === planningCost.id ? planningCost : c)); setIsCostPlanningOpen(false); setPlanningCost(null); } };
  const handleUpdatePlanningPeriod = (startMonth: number, endMonth: number) => { if (planningCost) setPlanningCost({ ...planningCost, startMonth, endMonth }); };
  const handleUpdateMonthlyCost = (monthIndex: number, amount: number | undefined) => {
    if (planningCost) {
      const newMonthlyCosts = planningCost.monthlyCosts ? { ...planningCost.monthlyCosts } : {};
      if (amount === undefined || amount === planningCost.monthlyAmount) { delete newMonthlyCosts[monthIndex]; }
      else { newMonthlyCosts[monthIndex] = { amount }; }
      setPlanningCost({ ...planningCost, monthlyCosts: newMonthlyCosts });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kostenplanung</h1>
          <p className="text-muted-foreground">Planen Sie Ihre Kosten pro Monat und Kategorie</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Euro className="h-4 w-4" />Jahreskosten gesamt</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{formatCurrency(totalYearlyCosts)}</div><p className="text-xs text-muted-foreground">Geplante Gesamtkosten 2025</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4" />Ø Monatliche Kosten</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(totalMonthlyCostsAvg)}</div><p className="text-xs text-muted-foreground">Durchschnitt pro Monat</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Building2 className="h-4 w-4" />Personalkosten</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(costsByCategory.find(c => c.id === 'personnel')?.total || 0)}</div><p className="text-xs text-muted-foreground">{((costsByCategory.find(c => c.id === 'personnel')?.total || 0) / totalYearlyCosts * 100).toFixed(0)}% der Gesamtkosten</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Wallet className="h-4 w-4" />Kostenpositionen</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{costItems.length}</div><p className="text-xs text-muted-foreground">Aktive Positionen</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="costs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="costs" className="flex items-center gap-2"><Wallet className="h-4 w-4" />Kostenpositionen</TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2"><Briefcase className="h-4 w-4" />Nach Kategorie</TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2"><Calendar className="h-4 w-4" />Monatsübersicht</TabsTrigger>
        </TabsList>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Kostenpositionen</CardTitle><CardDescription>Alle geplanten Kosten mit Zeitraum und monatlicher Planung</CardDescription></div>
                <Dialog open={isAddCostOpen} onOpenChange={setIsAddCostOpen}>
                  <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Kostenposition hinzufügen</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>Neue Kostenposition</DialogTitle><DialogDescription>Fügen Sie eine neue Kostenposition hinzu</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2"><Label>Bezeichnung</Label><Input placeholder="z.B. Cloud Hosting" value={newCost.name || ''} onChange={(e) => setNewCost({ ...newCost, name: e.target.value })} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Kategorie</Label><Select value={newCost.category} onValueChange={(value) => setNewCost({ ...newCost, category: value })}><SelectTrigger><SelectValue placeholder="Kategorie wählen" /></SelectTrigger><SelectContent>{costCategories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Monatlicher Betrag (€)</Label><Input type="number" min="0" value={newCost.monthlyAmount || ''} onChange={(e) => setNewCost({ ...newCost, monthlyAmount: parseFloat(e.target.value) || 0 })} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Von (Startmonat)</Label><Select value={String(newCost.startMonth)} onValueChange={(value) => setNewCost({ ...newCost, startMonth: parseInt(value) })}><SelectTrigger><SelectValue placeholder="Monat wählen" /></SelectTrigger><SelectContent>{months.map((month, index) => (<SelectItem key={index} value={String(index)}>{month}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Bis (Endmonat)</Label><Select value={String(newCost.endMonth)} onValueChange={(value) => setNewCost({ ...newCost, endMonth: parseInt(value) })}><SelectTrigger><SelectValue placeholder="Monat wählen" /></SelectTrigger><SelectContent>{months.map((month, index) => (<SelectItem key={index} value={String(index)} disabled={index < (newCost.startMonth || 0)}>{month}</SelectItem>))}</SelectContent></Select></div>
                      </div>
                      <div className="space-y-2"><Label>Beschreibung (optional)</Label><Input placeholder="z.B. AWS, Azure, Google Cloud" value={newCost.description || ''} onChange={(e) => setNewCost({ ...newCost, description: e.target.value })} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setIsAddCostOpen(false)}>Abbrechen</Button><Button onClick={handleAddCost}>Hinzufügen</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Bezeichnung</TableHead><TableHead>Kategorie</TableHead><TableHead>Zeitraum</TableHead><TableHead className="text-right">Monatlich</TableHead><TableHead className="text-right">Jahreskosten</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {costItems.map((item) => {
                      const category = costCategories.find(c => c.id === item.category);
                      const yearlyAmount = getCostItemYearlyAmount(item);
                      const hasCustomCosts = item.monthlyCosts && Object.keys(item.monthlyCosts).length > 0;
                      return (
                        <TableRow key={item.id}>
                          <TableCell><div className="flex items-center gap-2"><CategoryIcon category={item.category} /><div><div className="font-medium">{item.name}</div>{item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}</div></div></TableCell>
                          <TableCell><div className="flex items-center gap-2"><Badge variant="outline">{category?.name}</Badge>{hasCustomCosts && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Individuell</Badge>}</div></TableCell>
                          <TableCell><div className="text-sm">{months[item.startMonth].substring(0, 3)} - {months[item.endMonth].substring(0, 3)}</div><div className="text-xs text-muted-foreground">{item.endMonth - item.startMonth + 1} Monate</div></TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.monthlyAmount)}</TableCell>
                          <TableCell className="text-right font-medium text-red-600">{formatCurrency(yearlyAmount)}</TableCell>
                          <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleOpenCostPlanning(item)} title="Monatliche Planung"><Calendar className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleEditCost(item)} title="Bearbeiten"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteCostClick(item)} title="Löschen"><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-medium"><TableCell colSpan={4}>Gesamt Jahreskosten</TableCell><TableCell className="text-right text-red-600">{formatCurrency(totalYearlyCosts)}</TableCell><TableCell></TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>

              <Dialog open={isEditCostOpen} onOpenChange={setIsEditCostOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader><DialogTitle>Kostenposition bearbeiten</DialogTitle><DialogDescription>Ändern Sie die Daten der Kostenposition</DialogDescription></DialogHeader>
                  {editingCost && (
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2"><Label>Bezeichnung</Label><Input value={editingCost.name} onChange={(e) => setEditingCost({ ...editingCost, name: e.target.value })} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Kategorie</Label><Select value={editingCost.category} onValueChange={(value) => setEditingCost({ ...editingCost, category: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{costCategories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Monatlicher Betrag (€)</Label><Input type="number" min="0" value={editingCost.monthlyAmount} onChange={(e) => setEditingCost({ ...editingCost, monthlyAmount: parseFloat(e.target.value) || 0 })} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Von (Startmonat)</Label><Select value={String(editingCost.startMonth)} onValueChange={(value) => setEditingCost({ ...editingCost, startMonth: parseInt(value) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{months.map((month, index) => (<SelectItem key={index} value={String(index)}>{month}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Bis (Endmonat)</Label><Select value={String(editingCost.endMonth)} onValueChange={(value) => setEditingCost({ ...editingCost, endMonth: parseInt(value) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{months.map((month, index) => (<SelectItem key={index} value={String(index)} disabled={index < editingCost.startMonth}>{month}</SelectItem>))}</SelectContent></Select></div>
                      </div>
                      <div className="space-y-2"><Label>Beschreibung</Label><Input value={editingCost.description} onChange={(e) => setEditingCost({ ...editingCost, description: e.target.value })} /></div>
                    </div>
                  )}
                  <DialogFooter><Button variant="outline" onClick={() => { setIsEditCostOpen(false); setEditingCost(null); }}>Abbrechen</Button><Button onClick={handleSaveEditCost}>Änderungen speichern</Button></DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteCostOpen} onOpenChange={setIsDeleteCostOpen}>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader><DialogTitle>Kostenposition löschen</DialogTitle><DialogDescription>Möchten Sie diese Kostenposition wirklich löschen?</DialogDescription></DialogHeader>
                  {deletingCost && (<div className="py-4"><div className="flex items-center gap-3 p-3 bg-muted rounded-lg"><CategoryIcon category={deletingCost.category} /><div><div className="font-medium">{deletingCost.name}</div><div className="text-sm text-muted-foreground">{formatCurrency(deletingCost.monthlyAmount)}/Monat</div></div></div></div>)}
                  <DialogFooter><Button variant="outline" onClick={() => { setIsDeleteCostOpen(false); setDeletingCost(null); }}>Abbrechen</Button><Button variant="destructive" onClick={handleConfirmDeleteCost}>Löschen</Button></DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isCostPlanningOpen} onOpenChange={setIsCostPlanningOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Kostenplanung: {planningCost?.name}</DialogTitle><DialogDescription>Planen Sie die Kosten pro Monat. Änderungen werden erst beim Speichern übernommen.</DialogDescription></DialogHeader>
                  {planningCost && (
                    <div className="space-y-6 py-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm font-medium mb-3 block">Aktiver Zeitraum</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label className="text-xs text-muted-foreground">Von</Label><Select value={String(planningCost.startMonth)} onValueChange={(value) => handleUpdatePlanningPeriod(parseInt(value), planningCost.endMonth)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{months.map((month, index) => (<SelectItem key={index} value={String(index)}>{month}</SelectItem>))}</SelectContent></Select></div>
                          <div className="space-y-2"><Label className="text-xs text-muted-foreground">Bis</Label><Select value={String(planningCost.endMonth)} onValueChange={(value) => handleUpdatePlanningPeriod(planningCost.startMonth, parseInt(value))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{months.map((month, index) => (<SelectItem key={index} value={String(index)} disabled={index < planningCost.startMonth}>{month}</SelectItem>))}</SelectContent></Select></div>
                        </div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm font-medium mb-3 block">Standard-Monatsbetrag</Label>
                        <div className="flex items-center gap-4"><Input type="number" className="w-40" value={planningCost.monthlyAmount} onChange={(e) => setPlanningCost({ ...planningCost, monthlyAmount: parseFloat(e.target.value) || 0 })} /><span className="text-sm text-muted-foreground">€ pro Monat (wenn nicht individuell überschrieben)</span></div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Monatliche Kosten</Label>
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader><TableRow><TableHead className="w-[100px]">Monat</TableHead><TableHead>Individueller Betrag (€)</TableHead><TableHead className="text-right w-[120px]">Kosten</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {months.map((month, monthIndex) => {
                                const isActive = monthIndex >= planningCost.startMonth && monthIndex <= planningCost.endMonth;
                                const override = planningCost.monthlyCosts?.[monthIndex];
                                const customAmount = override?.amount;
                                const amount = isActive ? getCostItemMonthlyAmount(planningCost, monthIndex) : 0;
                                return (
                                  <TableRow key={monthIndex} className={!isActive ? 'opacity-40 bg-muted/30' : ''}>
                                    <TableCell className="font-medium">{month.substring(0, 3)}</TableCell>
                                    <TableCell>{isActive ? (<Input type="number" className="h-8 w-40" placeholder={`${planningCost.monthlyAmount} (Standard)`} value={customAmount !== undefined ? customAmount : ''} onChange={(e) => { const value = e.target.value; if (value === '') { handleUpdateMonthlyCost(monthIndex, undefined); } else { handleUpdateMonthlyCost(monthIndex, parseFloat(value)); } }} />) : <span className="text-muted-foreground">-</span>}</TableCell>
                                    <TableCell className="text-right font-medium">{isActive ? (<span className={customAmount !== undefined ? 'text-blue-600' : 'text-red-600'}>{formatCurrency(amount)}</span>) : <span className="text-muted-foreground">-</span>}</TableCell>
                                  </TableRow>
                                );
                              })}
                              <TableRow className="bg-muted/50 font-medium"><TableCell colSpan={2}>Jahreskosten gesamt</TableCell><TableCell className="text-right text-red-600">{formatCurrency(getCostItemYearlyAmount(planningCost))}</TableCell></TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">💡 Tipp: Lassen Sie das Feld leer, um den Standard-Monatsbetrag zu verwenden.</p>
                      </div>
                    </div>
                  )}
                  <DialogFooter><Button variant="outline" onClick={() => { setIsCostPlanningOpen(false); setPlanningCost(null); }}>Abbrechen</Button><Button onClick={handleSaveCostPlanning}>Planung speichern</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {costsByCategory.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2"><CategoryIcon category={category.id} />{category.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm"><span className="font-medium text-red-600">{formatCurrency(category.total)}</span><Badge variant="outline">{((category.total / totalYearlyCosts) * 100).toFixed(0)}%</Badge></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Position</TableHead><TableHead>Zeitraum</TableHead><TableHead className="text-right">Monatlich</TableHead><TableHead className="text-right">Jahreskosten</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {category.items.map((item) => {
                        const yearlyAmount = getCostItemYearlyAmount(item);
                        return (
                          <TableRow key={item.id}>
                            <TableCell><div className="font-medium">{item.name}</div>{item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}</TableCell>
                            <TableCell><span className="text-sm">{months[item.startMonth].substring(0, 3)} - {months[item.endMonth].substring(0, 3)}</span></TableCell>
                            <TableCell className="text-right">{formatCurrency(item.monthlyAmount)}</TableCell>
                            <TableCell className="text-right font-medium text-red-600">{formatCurrency(yearlyAmount)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader><CardTitle>Monatliche Kostenentwicklung</CardTitle><CardDescription>Geplante Kosten pro Monat nach Kategorie</CardDescription></CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Monat</TableHead>{costsByCategory.map(cat => (<TableHead key={cat.id} className="text-right">{cat.name}</TableHead>))}<TableHead className="text-right font-bold">Gesamt</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {months.map((month, monthIndex) => {
                      const categoryTotals = costsByCategory.map(cat => ({ id: cat.id, total: cat.items.reduce((sum, item) => sum + getCostItemMonthlyAmount(item, monthIndex), 0) }));
                      const monthTotal = monthlyTotalCosts[monthIndex];
                      return (
                        <TableRow key={monthIndex}>
                          <TableCell className="font-medium">{month}</TableCell>
                          {categoryTotals.map(cat => (<TableCell key={cat.id} className="text-right text-muted-foreground">{cat.total > 0 ? formatCurrency(cat.total) : '-'}</TableCell>))}
                          <TableCell className="text-right font-medium text-red-600">{formatCurrency(monthTotal)}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-medium"><TableCell>Jahressumme</TableCell>{costsByCategory.map(cat => (<TableCell key={cat.id} className="text-right">{formatCurrency(cat.total)}</TableCell>))}<TableCell className="text-right text-red-600">{formatCurrency(totalYearlyCosts)}</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
