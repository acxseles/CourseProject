export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(value);
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const truncateText = (text: string, length: number = 100): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};
