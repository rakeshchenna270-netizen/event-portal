const Event = require('../models/Event');

// @desc    Get all events (with filtering)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { category, date, location, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create event (Admin only)
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, location } = req.body;
    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event (Admin only)
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event (Admin only)
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    RSVP for an event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered' });
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel RSVP
// @route   PUT /api/events/:id/cancel
// @access  Private
const cancelRSVP = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.attendees = event.attendees.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await event.save();

    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendees for an event (Admin)
// @route   GET /api/events/:id/attendees
// @access  Private/Admin
const getAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'attendees',
      'name email'
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event.attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my registrations
// @route   GET /api/events/my/registrations
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove attendee (Admin only)
// @route   DELETE /api/events/:id/attendees/:userId
// @access  Private/Admin
const removeAttendee = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.attendees = event.attendees.filter(
      (id) => id.toString() !== req.params.userId
    );
    await event.save();

    res.json({ message: 'Attendee removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like for an event
// @route   POST /api/events/:id/like
// @access  Private
const toggleLikeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isLiked = event.likes.includes(req.user._id);

    if (isLiked) {
      // Unlike
      event.likes = event.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      event.likes.push(req.user._id);
    }

    await event.save();
    res.json({ likes: event.likes, message: isLiked ? 'Unliked' : 'Liked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRSVP,
  getAttendees,
  getMyRegistrations,
  removeAttendee,
  toggleLikeEvent,
};
