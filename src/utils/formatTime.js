

const formatTime = (isoString, dateString) => {
  const d = new Date(isoString);
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const today = new Date().toISOString().split('T')[0];
  if (dateString === today) {
    return `Idag kl ${time}`;
  }

  return `${d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} kl ${time}`;
};

export default formatTime;
