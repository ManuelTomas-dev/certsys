import type { MyLocation, AccountType, Currency } from "@/types/settings"

// Mock data for My Location
export const mockMyLocations: MyLocation[] = [
  {
    id: "1",
    name: "Sede Principal - Luanda",
    code: "LUA001",
    address: "Rua Kwame Nkrumah, 123",
    city: "Luanda",
    country: "Angola",
    timezone: "WAT",
    isActive: true,
    managedBy: ["admin-001", "supervisor-002"],
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    name: "Filial Benguela",
    code: "BEN001",
    address: "Avenida Norton de Matos, 456",
    city: "Benguela",
    country: "Angola",
    timezone: "WAT",
    isActive: true,
    managedBy: ["supervisor-003"],
    createdAt: "2024-01-20T09:30:00Z",
    updatedAt: "2024-01-20T09:30:00Z",
  },
  {
    id: "3",
    name: "Base Cabinda",
    code: "CAB001",
    address: "Rua Marien Ngouabi, 789",
    city: "Cabinda",
    country: "Angola",
    timezone: "WAT",
    isActive: true,
    managedBy: ["supervisor-004", "inspector-005"],
    createdAt: "2024-02-01T10:15:00Z",
    updatedAt: "2024-02-01T10:15:00Z",
  },
]

// Mock data for Account Types
export const mockAccountTypes: AccountType[] = [
  {
    id: "1",
    designation: "Super Administrador",
    code: "SUPER_ADMIN",
    description: "Acesso total ao sistema com todas as permissões",
    permissions: ["all"],
    level: "super-admin",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    designation: "Administrador",
    code: "ADMIN",
    description: "Acesso administrativo com permissões de gestão",
    permissions: ["manage_users", "manage_locations", "view_reports", "manage_qhse"],
    level: "admin",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    designation: "Supervisor",
    code: "SUPERVISOR",
    description: "Supervisão de operações e equipes",
    permissions: ["manage_team", "view_reports", "manage_inspections"],
    level: "supervisor",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    designation: "Inspetor",
    code: "INSPECTOR",
    description: "Realização de inspeções e auditorias",
    permissions: ["create_inspections", "view_reports", "manage_qhse_records"],
    level: "inspector",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

// Mock data for Currencies
export const mockCurrencies: Currency[] = [
  {
    id: "1",
    name: "Kwanza Angolano",
    code: "AOA",
    symbol: "Kz",
    exchangeRate: 1.0,
    isDefault: true,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Dólar Americano",
    code: "USD",
    symbol: "$",
    exchangeRate: 0.0012,
    isDefault: false,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Euro",
    code: "EUR",
    symbol: "€",
    exchangeRate: 0.0011,
    isDefault: false,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export function generateMyLocationMockData(count = 50): MyLocation[] {
  const locations = [...mockMyLocations]
  const cities = ["Luanda", "Benguela", "Huambo", "Lobito", "Cabinda", "Malanje", "Namibe", "Soyo"]

  for (let i = locations.length; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)]
    locations.push({
      id: (i + 1).toString(),
      name: `Base ${city} ${i + 1}`,
      code: `${city.substring(0, 3).toUpperCase()}${String(i + 1).padStart(3, "0")}`,
      address: `Rua ${i + 1}, Bairro Central`,
      city,
      country: "Angola",
      timezone: "WAT",
      isActive: Math.random() > 0.1,
      managedBy: [`user-${Math.floor(Math.random() * 10) + 1}`],
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
      updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
    })
  }

  return locations
}

export function generateAccountTypeMockData(count = 20): AccountType[] {
  const accountTypes = [...mockAccountTypes]
  const designations = ["Técnico", "Analista", "Coordenador", "Gerente", "Diretor"]
  const levels: AccountType["level"][] = ["user", "inspector", "supervisor", "admin"]

  for (let i = accountTypes.length; i < count; i++) {
    const designation = designations[Math.floor(Math.random() * designations.length)]
    accountTypes.push({
      id: (i + 1).toString(),
      designation: `${designation} ${i + 1}`,
      code: `${designation.toUpperCase()}_${i + 1}`,
      description: `Descrição do cargo ${designation} ${i + 1}`,
      permissions: ["view_reports"],
      level: levels[Math.floor(Math.random() * levels.length)],
      isActive: Math.random() > 0.1,
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
      updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
    })
  }

  return accountTypes
}

export function generateCurrencyMockData(count = 10): Currency[] {
  const currencies = [...mockCurrencies]
  const currencyData = [
    { name: "Real Brasileiro", code: "BRL", symbol: "R$" },
    { name: "Libra Esterlina", code: "GBP", symbol: "£" },
    { name: "Iene Japonês", code: "JPY", symbol: "¥" },
    { name: "Franco Suíço", code: "CHF", symbol: "CHF" },
    { name: "Dólar Canadense", code: "CAD", symbol: "C$" },
  ]

  for (let i = currencies.length; i < count && i - currencies.length < currencyData.length; i++) {
    const currency = currencyData[i - currencies.length]
    currencies.push({
      id: (i + 1).toString(),
      name: currency.name,
      code: currency.code,
      symbol: currency.symbol,
      exchangeRate: Math.random() * 2,
      isDefault: false,
      isActive: Math.random() > 0.2,
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
      updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
    })
  }

  return currencies
}
