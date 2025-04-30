export interface TagDisplay {
  label: string;
  colorClass: string;
}

export function formatTag(key: string, value: string): TagDisplay | null {
  if (key === 'cuisine') {
    return {
      label: `${capitalize(value)} cuisine`,
      colorClass: 'bg-yellow-100 text-yellow-800',
    };
  }

  if (key.startsWith('diet:halal')) {
    if (value === 'yes') {
      return {
        label: 'Halal',
        colorClass: 'bg-green-100 text-green-800',
      };
    } else if (value === 'no'){
      return {
        label: 'Non-halal',
        colorClass: 'bg-gray-100 text-gray-800',
      }
    }
    return null;
  }

  if (['delivery', 'takeaway', 'outdoor_seating'].includes(key)) {
    if (value === 'yes') {
      return {
        label: humanizeKey(key),
        colorClass: 'bg-purple-100 text-purple-800',
      };
    }
    return null;
  }

  return null;
}

function humanizeKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
