export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface SiteInfo {
  businessName: string;
  tagline: string;
  hours: BusinessHours[];
  contact: ContactInfo;
  social: SocialMedia;
}
