const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const {transformEvent} = require('./merge');  

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event)
            });
        } catch (error) {
            throw error
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: '5eae7b2bc7543c071a773afb'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result)
            const creator = await User.findById('5eae7b2bc7543c071a773afb');

            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (error) {
            throw error
        }

    },
    
};  