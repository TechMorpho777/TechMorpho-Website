// Shared types and utilities

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  service: string
  message: string
}

export interface ContactResponse {
  success: boolean
  message: string
  data?: {
    id: string
    name: string
    email: string
  }
}

export type ServiceType = 
  | 'website'
  | 'application'
  | 'seo'
  | 'design'
  | 'hosting'
  | 'qa'
  | 'other'

