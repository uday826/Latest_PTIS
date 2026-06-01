import { ValidationSchema } from "./basic-info-validation-schemas";

/**
 * Generic validator function that validates a form data object against a given ValidationSchema.
 * Returns an error map containing error messages for fields that failed validation.
 */
export function validateForm<T>(
  formData: T,
  schema: ValidationSchema<T>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const key in schema) {
    const rule = schema[key];
    if (!rule) continue;

    const rawValue = formData[key];
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

    // Check required
    if (rule.required) {
      if (value === undefined || value === null || value === "") {
        errors[key] = rule.requiredMessage || `${String(key)} is required.`;
        continue;
      }
    }

    // If empty and not required, skip other checks
    if (value === undefined || value === null || value === "") {
      continue;
    }

    // Check minLength
    if (rule.minLength !== undefined && typeof value === "string") {
      if (value.length < rule.minLength) {
        errors[key] =
          rule.minLengthMessage ||
          `${String(key)} must be at least ${rule.minLength} characters.`;
        continue;
      }
    }

    // Check maxLength
    if (rule.maxLength !== undefined && typeof value === "string") {
      if (value.length > rule.maxLength) {
        errors[key] =
          rule.maxLengthMessage ||
          `${String(key)} cannot exceed ${rule.maxLength} characters.`;
        continue;
      }
    }

    // Check pattern (regex)
    if (rule.pattern && typeof value === "string") {
      if (!rule.pattern.test(value)) {
        errors[key] = rule.patternMessage || `${String(key)} is invalid.`;
        continue;
      }
    }

    // Check custom validation
    if (rule.custom) {
      const customError = rule.custom(rawValue, formData);
      if (customError) {
        errors[key] = customError;
        continue;
      }
    }
  }

  return errors;
}
