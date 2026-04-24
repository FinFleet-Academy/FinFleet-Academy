import HelpTicket from '../models/HelpTicket.js';

export const createTicket = async (req, res) => {
  try {
    const { subject, description, screenshotUrl } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required' });
    }
    const ticket = await HelpTicket.create({
      userId: req.user?._id,
      name: req.user?.name,
      email: req.user?.email,
      subject,
      description,
      screenshotUrl: screenshotUrl || '',
    });
    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const tickets = await HelpTicket.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await HelpTicket.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email plan');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['open', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const ticket = await HelpTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
