/**
 * Utility functions for validating numeric input with decimal precision limits
 */

// Special token IDs that need 16 decimal places
const SPECIAL_TOKEN_IDS = [0, 59, 486, 3610, 506, 1019, 1515, 2610];

/**
 * Validates and formats numeric input based on token ID
 * @param value - The input value to validate
 * @param tokenId - The token ID to determine precision rules
 * @returns Object with isValid, formattedValue, and error message
 */
export function validateNumericInput(value: string, tokenId?: number | string): {
  isValid: boolean;
  formattedValue: string;
  error?: string;
} {
  if (!value || value === '') {
    return { isValid: true, formattedValue: '' };
  }

  // Convert tokenId to number if it's a string
  const numericTokenId = typeof tokenId === 'string' ? parseInt(tokenId, 10) : tokenId;
  
  // Determine decimal places based on token ID
  const decimalPlaces = numericTokenId !== undefined && SPECIAL_TOKEN_IDS.includes(numericTokenId) ? 16 : 6;
  
  // Remove any non-numeric characters except decimal point
  const cleanValue = value.replace(/[^0-9.]/g, '');
  
  // Check if it's a valid number
  if (cleanValue === '' || cleanValue === '.') {
    return { isValid: true, formattedValue: cleanValue };
  }
  
  const numValue = parseFloat(cleanValue);
  if (isNaN(numValue)) {
    return { 
      isValid: false, 
      formattedValue: cleanValue, 
      error: 'Invalid number format' 
    };
  }
  
  // Check if there are multiple decimal points
  const decimalCount = (cleanValue.match(/\./g) || []).length;
  if (decimalCount > 1) {
    return { 
      isValid: false, 
      formattedValue: cleanValue, 
      error: 'Multiple decimal points not allowed' 
    };
  }
  
  // Split by decimal point
  const [integerPart, decimalPart = ''] = cleanValue.split('.');
  
  // Check integer part (max 4 digits)
  if (integerPart.length > 4) {
    return { 
      isValid: false, 
      formattedValue: cleanValue, 
      error: 'Maximum 4 digits before decimal point' 
    };
  }
  
  // Check decimal part (max 6 or 16 digits based on token ID)
  if (decimalPart.length > decimalPlaces) {
    return { 
      isValid: false, 
      formattedValue: cleanValue, 
      error: `Maximum ${decimalPlaces} digits after decimal point` 
    };
  }
  
  return { 
    isValid: true, 
    formattedValue: cleanValue 
  };
}

/**
 * Formats a numeric value to the appropriate decimal places based on token ID
 * @param value - The value to format
 * @param tokenId - The token ID to determine precision
 * @returns Formatted string
 */
export function formatNumericValue(value: string | number, tokenId?: number | string): string {
  if (!value || value === '') return '';
  
  const numericTokenId = typeof tokenId === 'string' ? parseInt(tokenId, 10) : tokenId;
  const decimalPlaces = numericTokenId !== undefined && SPECIAL_TOKEN_IDS.includes(numericTokenId) ? 16 : 6;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '';
  
  return numValue.toFixed(decimalPlaces).replace(/\.?0+$/, '');
}
