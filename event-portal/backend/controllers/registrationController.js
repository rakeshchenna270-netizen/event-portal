const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    RSVP for an event
// @route   POST /api/registrations/:eventId
// @access  Private
const rsvpEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const existing = await Registration.findOne({
      userId: req.user._id,
      eventId,
    });

    if (existing) {
      if (existing.status === 'registered') {
        return res.status(400).json({ message: 'Already registered for this event' });
      }
      // Re-register if cancelled
      existing.status = 'registered';
      await existing.save();
      return res.json({ message: 'Re-registered successfully', registration: existing });
    }

    const registration = await Registration.create({
      userId: req.user._id,
      eventId,
    });

    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel RSVP
// @route   PUT /api/registrations/:eventId/cancel
// @access  Private
const cancelRSVP = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      userId: req.user._id,
      eventId: req.params.eventId,
      status: 'registered',
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = 'cancelled';
    await registration.save();
    res.json({ message: 'Registration cancelled', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.user._id,
      status: 'registered',
    }).populate('eventId');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendees for an event (Admin)
// @route   GET /api/registrations/:eventId/attendees
// @access  Private/Admin
const getAttendees = async (req, res) => {
  try {
    const attendees = await Registration.find({
      eventId: req.params.eventId,
      status: 'registered',
    }).populate('userId', 'name email');
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { rsvpEvent, cancelRSVP, getMyRegistrations, getAttendees };
