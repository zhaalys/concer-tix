// Sample event controller
const events = [
  { id: '1', title: 'Sheila On 7 Tour 2026', city: 'Jakarta', category: 'Music', price: 350000 },
  { id: '2', title: 'Coldplay Live in Bandung', city: 'Bandung', category: 'Music', price: 1200000 },
  { id: '3', title: 'Pesta Rakyat Soundrenaline', city: 'Surabaya', category: 'Festival', price: 250000 }
];

exports.getAllEvents = (req, res) => {
  res.json({
    success: true,
    data: events,
  });
};

exports.getEventById = (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  res.json({ success: true, data: event });
};
