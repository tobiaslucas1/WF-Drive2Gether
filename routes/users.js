// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// ------------------------------
// [Get] users
// return array of users
// ------------------------------
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { // never return password
      UserID: true,
      FirstName: true,
      LastName: true,
      Email: true,
      DateOfBirth: true,
      PhoneNumber: true,
      Address: true,
      CreatedAt: true,
    }
  });
  res.json(users);
});


// ------------------------------
// [Post] users 
// Registreert een nieuwe gebruiker
// ------------------------------
router.post('/', async (req, res) => {
  const { FirstName, LastName, DateOfBirth, PhoneNumber, Email, Address, Password,} = req.body;  
  // Check if user with this email already exists
  const checkUserExists = await prisma.user.findMany({
    where: {
      Email: Email
    }
  });
  
  const hashedPassword = Password; // placeholder ZONDER hashing!

  if (checkUserExists.length > 0) {
    res.json({
      "status": "user with this email already exists"
    });
  } else {
    const newUser = await prisma.user.create({
      data: {
        FirstName,
        LastName,
        DateOfBirth,
        PhoneNumber,
        Email,
        Address,
        PasswordHash: hashedPassword
      },
      select:{ // Never Returns the Password
        UserID: true,
        FirstName: true,
        Email:true,
        CreatedAt: true,
      }
    });
    res.json(newUser);
  }
});


// ------------------------------
// [Put] users 
// ------------------------------
router.put('/:id', async (req, res) => {
  let userId = req.params.id;
  let { FirstName, LastName, DateOfBirth, PhoneNumber, Email, Address, Password } = req.body;
  

  let updatedUser = await prisma.user.update({
    where: {
      UserID: parseInt(userId)
    },
    data: {
      FirstName,
      LastName,
      DateOfBirth,
      PhoneNumber,
      Email,
      Address
    },
    select: {
      UserID: true,
      FirstName: true,
      Email: true,
    }
  });
  
  res.json(updatedUser);
});

// ------------------------------
// [Delete] users
// ------------------------------
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  
  const deletedUser = await prisma.user.delete({
    where: {
      UserID: parseInt(userId)
    }
  });
  
  res.send(deletedUser);
});


module.exports = router;