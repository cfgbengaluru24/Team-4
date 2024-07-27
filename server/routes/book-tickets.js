const express = require('express');
const router = express.Router();
const fs = require('fs');


const eventsFilePath = './events.json';

router.post('/', (req, res) => {
    const { trainer_name, from, to, date_of_booking } = req.body;
    console.log('Received trainer_name:', trainer_name);
    console.log('Received from:', from);
    console.log('Received to:', to);
    console.log('Received date_of_booking:', date_of_booking);

    if (!trainer_name || !from || !to || !date_of_booking) {
        return res.status(400).json({ message: 'Missing required fields', data: req.body });
    }

    fs.readFile(eventsFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading events file:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        const events = JSON.parse(data);
        const event = events.find(event => event.location === to);

        if (!event) {
            return res.status(404).json({ message: 'Event not found at the specified location' });
        }

        if (!event.trainers.includes(trainer_name)) {
            return res.status(400).json({ message: 'Trainer is not allotted for the selected event' });
        }

        const eventDate = new Date(event.date);
        const bookingDate = new Date(date_of_booking);

        if (bookingDate >= eventDate) {
            return res.status(400).json({ message: 'Booking date must be before the event date' });
        }

        const oneDayBeforeEvent = new Date(eventDate);
        oneDayBeforeEvent.setDate(oneDayBeforeEvent.getDate() - 1);

        if (bookingDate > oneDayBeforeEvent) {
            return res.status(400).json({ message: 'Booking must be at least one day before the event date' });
        }

        // If all conditions are satisfied, respond with success message
        return res.status(200).json({ message: 'Booking successful', event });
    });
});


module.exports=router;