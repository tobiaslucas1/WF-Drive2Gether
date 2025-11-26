// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const { use } = require('react');
const prisma = new PrismaClient();

const userSelectFields = {
    UserID: true,
    FirstName: true,
    LastName: true,
    Email: true,
};



// ------------------------------
// [Get] trips
// return array of trips
// ------------------------------
router.get('/', async (req, res) => {
  const trips = await prisma.trip.findMany({
    include: {
      Car: true,
      Driver: {
        select : userSelectFields
      },
      Bookings: {
        include: {
          Passenger: {
              select: userSelectFields
          }
        }
      },
      Reviews: true
    }
  });
 }) 
res.json(trips);

// ------------------------------
// [Get]  /trips/:id
// return details of a specific trip
// ------------------------------
router.get('/:id', async (req, res) => {
  const tripId = parseInt(req.params.id);

  const trips = await prisma.trip.findMany({
    where: {TripID: tripId},
    include: {
      Car: true,
      Driver: {
        select : userSelectFields
      },
      Bookings: {
        include: {
          Passenger: {
              select: userSelectFields
          }
        }
      },
      Reviews: true
    }
  });

res.json(trips);

if (!trip) 
  {
    return res.json({ status: "Fout", message: `Rit met ID ${tripId} niet gevonden.` });
  }
});


// ------------------------------
// [Post] Trips
// return created trip 
// Moet nog bekijken met de Price en seatsoffered
// ------------------------------
router.post('/', async (req, res) => {
  const { DriverID, CarID, StartLocation, EndLocation, DepartureTime, Price, SeatsOffered, PaymentMethod } = req.body;
  
  const newTrip = await prisma.trip.create({
    data: {
      DriverID: parseInt(DriverID),
      CarID: parseInt(CarID),
      StartLocation,
      EndLocation,
      PaymentMethod,
      DepartureTime: new Date(DepartureTime),
      Price: parseFloat(Price),
      SeatsOffered: parseInt(SeatsOffered),
      SeatsBooked: 0, 
      TripStatus: 'Scheduled',
    },
    include: {
      Driver: {select: userSelectFields},
      Car: true
    }
  });
  
  res.json(newTrip);
});


// ------------------------------
// [Put] Trips
// Update trip
// Moet nog bekijken met de Price en seatsoffered
// ------------------------------
router.put('/:id', async (req, res) => {
  const tripId = req.params.id;
  const {StartLocation, EndLocation, DepartureTime, Price, SeatsOffered, TripStatus, PaymentMethod } = req.body;
  
  const updatedTrip = await prisma.trip.update({
    where: {
      TripID: parseInt(tripId)
    },
    data: {
      StartLocation,
      EndLocation,
      DepartureTime: new Date(DepartureTime),
      SeatsOffered,
      Price,
      TripStatus,
      PaymentMethod,
    },
    include: {
      Driver: {select : userSelectFields},
      Car: true
    }
  });
  
  res.json(updatedTrip);
});

// ------------------------------
// [Delete] trips
// Deletes/Cancelles a trip
//-------------------------------
router.delete('/:id', async (req, res) => {
  const tripId = req.params.id;
  
  const deletedTrip = await prisma.trip.delete({
    where: {
      TripID: parseInt(tripId)
    }
  });
  
  res.send(deletedTrip);
});




module.exports = router;