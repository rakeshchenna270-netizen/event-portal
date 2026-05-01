const express = require('express');
const router = express.Router();
const {
  rsvpEvent,
  cancelRSVP,
  getMyRegistrations,
  getAttendees,
} = require('../controllers/registrationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyRegistrations);
router.post('/:eventId', protect, rsvpEvent);
router.put('/:eventId/cancel', protect, cancelRSVP);
router.get('/:eventId/attendees', protect, adminOnly, getAttendees);

module.exports = router;
