// ========================================
// EDURA — Form Validation (Zod-compatible API)
// ========================================
// Lightweight validation that mirrors Zod's .parse()/.safeParse() API
// so migration to real Zod is a one-line import swap.

// --- Schema Builders ---

const string = () => new StringValidator();

class StringValidator {
  constructor() {
    this._rules = [];
    this._label = 'Value';
  }

  label(name) {
    this._label = name;
    return this;
  }

  min(n, msg) {
    this._rules.push((v) => v.length >= n ? null : (msg || `${this._label} must be at least ${n} characters`));
    return this;
  }

  max(n, msg) {
    this._rules.push((v) => v.length <= n ? null : (msg || `${this._label} must be at most ${n} characters`));
    return this;
  }

  email(msg) {
    this._rules.push((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : (msg || 'Invalid email format'));
    return this;
  }

  regex(pattern, msg) {
    this._rules.push((v) => pattern.test(v) ? null : (msg || `${this._label} format is invalid`));
    return this;
  }

  nonempty(msg) {
    this._rules.push((v) => v.trim().length > 0 ? null : (msg || `${this._label} is required`));
    return this;
  }

  validate(value) {
    for (const rule of this._rules) {
      const err = rule(value || '');
      if (err) return err;
    }
    return null;
  }
}

const object = (shape) => new ObjectSchema(shape);

class ObjectSchema {
  constructor(shape) {
    this._shape = shape;
  }

  safeParse(data) {
    const errors = {};
    let hasErrors = false;

    for (const [key, validator] of Object.entries(this._shape)) {
      const error = validator.validate(data[key]);
      if (error) {
        errors[key] = error;
        hasErrors = true;
      }
    }

    return hasErrors
      ? { success: false, errors }
      : { success: true, data };
  }

  // Validate a single field
  validateField(field, value) {
    const validator = this._shape[field];
    if (!validator) return null;
    return validator.validate(value);
  }
}

// --- Schemas for Auth ---

export const loginSchema = object({
  username: string().label('Username').nonempty('Username or email is required'),
  password: string().label('Password').nonempty('Password is required'),
});

export const signupSchema = object({
  username: string()
    .label('Username')
    .nonempty('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  email: string()
    .label('Email')
    .nonempty('Email is required')
    .email('Please enter a valid email address'),
  password: string()
    .label('Password')
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// --- Password Strength Calculator ---

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '#333' };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const levels = [
    { score: 0, label: '', color: '#333' },
    { score: 1, label: 'Very Weak', color: '#ef4444' },
    { score: 2, label: 'Weak', color: '#f97316' },
    { score: 3, label: 'Fair', color: '#eab308' },
    { score: 4, label: 'Strong', color: '#22c55e' },
    { score: 5, label: 'Very Strong', color: '#06b6d4' },
  ];

  return levels[score] || levels[0];
};

export const z = { string, object };
