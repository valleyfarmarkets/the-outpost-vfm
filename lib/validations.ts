export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
} {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface PerformerFormData {
  stageName: string;
  email: string;
  phone?: string;
  location: string;
  socialMedia?: string;
  genre: string;
  desiredRate?: string;
  message: string;
}

export function validatePerformerForm(data: PerformerFormData): {
  isValid: boolean;
  errors: Partial<Record<keyof PerformerFormData, string>>;
} {
  const errors: Partial<Record<keyof PerformerFormData, string>> = {};

  if (!data.stageName.trim()) {
    errors.stageName = "Stage name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  if (!data.location.trim()) {
    errors.location = "Location is required";
  }

  if (!data.genre.trim()) {
    errors.genre = "Genre/style is required";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
