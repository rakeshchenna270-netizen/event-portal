const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/my/registrations', protect, getMyRegistrations);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

// Registration & Attendees
router.post('/:id/rsvp', protect, rsvpEvent);
router.put('/:id/cancel', protect, cancelRSVP);
router.get('/:id/attendees', protect, adminOnly, getAttendees);
router.delete('/:id/attendees/:userId', protect, adminOnly, removeAttendee);
router.post('/:id/like', protect, toggleLikeEvent);

module.exports = router;
