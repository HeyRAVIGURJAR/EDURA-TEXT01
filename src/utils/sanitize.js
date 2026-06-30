import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks.
 * Strips all HTML tags and potentially dangerous content.
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip ALL HTML tags
    ALLOWED_ATTR: [],
  }).trim();
};

/**
 * Sanitize HTML content — allows safe tags for rich content display.
 * Useful for admin CMS content that may contain formatting.
 */
export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h3', 'h4'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};
