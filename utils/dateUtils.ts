export function formatDate(dateString) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-US', options);
}

export function formatShortDate(dateString) {
  const options = { 
    month: 'short', 
    day: 'numeric'
  };
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-US', options);
}

export function isEventToday(dateString) {
  const eventDate = new Date(dateString);
  const today = new Date();
  
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
}

export function isEventUpcoming(dateString) {
  const eventDate = new Date(dateString);
  const today = new Date();
  
  return eventDate > today;
}

export function getRelativeTimeString(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Tomorrow';
  } else if (diffInDays > 1 && diffInDays < 7) {
    return `In ${diffInDays} days`;
  } else if (diffInDays >= 7 && diffInDays < 14) {
    return 'Next week';
  } else if (diffInDays >= 14 && diffInDays < 30) {
    return `In ${Math.floor(diffInDays / 7)} weeks`;
  } else if (diffInDays >= 30 && diffInDays < 365) {
    return `In ${Math.floor(diffInDays / 30)} months`;
  } else {
    return `In ${Math.floor(diffInDays / 365)} years`;
  }
} 