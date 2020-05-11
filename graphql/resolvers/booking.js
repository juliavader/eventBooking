// retrieve Schema
const Event = require('../../models/event');
const Booking = require('../../models/booking');

const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (req) => {
        if (!req.isAuth) {
            throw new Error('unauthentificated ! ');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (error) {
            throw error
        }
    },
    bookEvent: async args => {
        if (!req.isAuth) {
            throw new Error('unauthentificated ! ');
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                event: fetchedEvent,
                user: req.userId
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (error) {
            throw error
        }
    },
    cancelBooking: async args => {
        if (!req.isAuth) {
            throw new Error('unauthentificated ! ');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            console.log(booking._doc.event.creator)
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId });
            return event
        } catch (error) {
            throw error;
        }
    }
};  