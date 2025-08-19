export interface MyLocation {
  id: string
  name: string
  code: string
  address: string
  city: string
  country: string
  timezone: string
  isActive: boolean
  managedBy: string[]
  createdAt: string
  updatedAt: string
}

export interface AccountType {
  id: string
  designation: string
  code: string
  description: string
  permissions: string[]
  level: "super-admin" | "admin" | "supervisor" | "inspector" | "user"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Currency {
  id: string
  name: string
  code: string
  symbol: string
  exchangeRate: number
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type SettingsModule = "my-location" | "account-type" | "currency"
