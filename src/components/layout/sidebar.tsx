'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Users,
  Calculator,
  LineChart,
  Wallet,
  Settings,
  ChevronDown,
  BookOpen,
  FileText,
  Building2,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'KPI-Tracking',
    href: '/kpi-tracking',
    icon: TrendingUp,
  },
  {
    title: 'Preismodelle',
    href: '/preismodelle',
    icon: CreditCard,
  },
  {
    title: 'Kundenplanung',
    href: '/kundenplanung',
    icon: Users,
  },
  {
    title: 'Kostenplanung',
    href: '/budgetplanung',
    icon: Calculator,
  },
  {
    title: 'Forecasting',
    href: '/forecasting',
    icon: LineChart,
  },
  {
    title: 'Cash-Flow',
    href: '/cashflow',
    icon: Wallet,
  },
];

const accountingItems: NavItem[] = [
  {
    title: 'Buchhaltung',
    href: '/buchhaltung',
    icon: BookOpen,
  },
  {
    title: 'Rechnungen',
    href: '/rechnungen',
    icon: FileText,
  },
  {
    title: 'Kunden',
    href: '/kunden',
    icon: Building2,
  },
];

const settingsItems: NavItem[] = [
  {
    title: 'Einstellungen',
    href: '/einstellungen',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isAccountingOpen, setIsAccountingOpen] = useState(true);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            B
          </div>
          <div>
            <span className="font-semibold">BenchTrust</span>
            <span className="ml-1 text-sm text-muted-foreground">Budget</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {/* Hauptnavigation */}
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Planung
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Buchhaltung Section */}
        <div className="mt-6 space-y-1">
          <button
            onClick={() => setIsAccountingOpen(!isAccountingOpen)}
            className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
          >
            Buchhaltung
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isAccountingOpen && 'rotate-180'
              )}
            />
          </button>
          {isAccountingOpen && (
            <div className="space-y-1">
              {accountingItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Einstellungen */}
        <div className="mt-6 space-y-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            System
          </div>
          {settingsItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">BenchTrust GmbH</p>
            <p className="truncate text-xs text-muted-foreground">Startup Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
