// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();


// ------------------------------
// [Get] cars
// return array of cars 
// ------------------------------
router.get('/', async (req, res) => {
  const cars = await prisma.car.findMany({
    include: {
      Owner: {
        select: {
          UserId: true,
          Firstname: true,
          LastName: true,
          Email: true,
        }
      }
    }
  });
  res.json(cars);
});

// ------------------------------
// [Post] cars
// return created car 
// ------------------------------
router.post('/', async (req, res) => {
  const { Model, Brand, LicensePlate, Color,Seats, OwnerID } = req.body;
  
  // Check if car with this license plate already exists
  const checkCarExists = await prisma.car.findMany({
    where: {
      LicensePlate: LicensePlate
    }
  });
  
  if (checkCarExists.length > 0) {
    res.json({
      "status": "car with this license plate already exists"
    });
  } else {
    const newCar = await prisma.car.create({
      data: {
        Model,
        Brand,
        LicensePlate,
        Seats: parseInt(Seats), // seats saved as an INT
        Color,
        OwnerID: parseInt(OwnerID)
      }
    });
    res.json(newCar);
  }
});

// ------------------------------
// [Put] Cars
// return updated car object
// ------------------------------
router.put('/:id', async (req, res) => {
  const carId = req.params.id;
  let { Model, Brand, LicensePlate, Color, Seats } = req.body;
  
  let updatedCar = await prisma.car.update({
    where: {
      CarID: parseInt(carId)
    },
    data: {
      Model,
      Brand,
      LicensePlate,
      Color,
      Seats,
    }
  });
  
  res.json(updatedCar);
});


// --------------------------------------------------------
// [DELETE] /cars/:id
// Delets a car.
// --------------------------------------------------------
router.delete('/:id', async (req, res) => {
  const carId = req.params.id;
  
  const deletedCar = await prisma.car.delete({
    where: {
      CarID: parseInt(carId)
    }
  });
  
  res.send(deletedCar);
});

module.exports = router;