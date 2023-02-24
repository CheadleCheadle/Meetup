const express = require("express");
const { check } = require("express-validator");
const router = require('express').Router();
const { handleValidationErrors } = require('./validation');
// const { setTokenCookie } = require("./auth");
// const { User } = require("../../db/models");

// const validateLogin = [
//     check('credential')
//       .exists({ checkFalsy: true})
//       .notEmpty()
//       .withMessage('Please provide a valid email or username.'),
//     check('password')
//     .exists({ checkFalsy: true })
//     .withMessage('Please provide a password.'),
//     handleValidationErrors
// ];

 const validateGroupBody = [
    check('name')
      .exists( {checkFalsy: true })
      .notEmpty()
      .withMessage('Name must be 60 characters or less'),
    check('about')
      .exists( {checkFalsy: true })
      .notEmpty()
      .withMessage("About must be 50 characters or more"),
    check('type')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .exists( {checkFalsy: true })
      .notEmpty()
      .withMessage("Private must be a boolean"),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("State is required"),
      handleValidationErrors
];

const validateVenueBody = [
    check('address')
      .exists( {checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true})
      .notEmpty()
      .withMessage('State is required'),
    check('lat')
      .exists({ checkFalsy: true})
      .notEmpty()
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true})
      .notEmpty()
      .withMessage('Longitude is not valid'),
      handleValidationErrors
];

const validateEventBody = [
    check('venueId')
      .exists({ checkFalsy: true})
      .notEmpty()
      .withMessage("Venue does not exist"),
    check('name')
      .exists( {checkFalsy: true})
      .notEmpty()
      .withMessage("Name must be at least 5 characters"),
     check('type')
      .exists( {checkFalsy: true})
      .notEmpty()
      .withMessage("Type must be Online or In person"),
     check('capacity')
      .exists( {checkFalsy: true})
      .notEmpty()
      .withMessage("Capacity must be an integer"),
     check('price')
      .exists( {checkFalsy: true})
      .notEmpty()
      .withMessage("Price is invalid"),
     check('description')
      .exists( {checkFalsy: true})
      .notEmpty()
      .withMessage("Description is required"),
     check('startDate')
      .exists( {checkFalsy: true})
      .notEmpty()
      .withMessage("Start date must be in the future"),
     check('endDate')
      .exists( {checkFalsy: true})
      .notEmpty()
      .withMessage("End date is less than start date"),
      handleValidationErrors
];

// const validateEventQuery = [
//   check('page')
//     // .exists({checkFalsy: false})
//     // .notEmpty()
//     .withMessage("Page must be greater than or equal to 1"),
//   check('size')
//     // .exists({checkFalsy: false})
//     // .notEmpty()
//     .withMessage("Size must be greater than or equal to 1"),
//   check('name')
//     // .exists({checkFalsy: false})
//     // .notEmpty()
//     .withMessage("Name must be a string"),
//   check('type')
//     // .exists({checkFalsy: false})
//     // .notEmpty()
//     .withMessage("Type must be 'Online' or 'In Person'"),
//   check('startDate')
//     // .exists({checkFalsy: false})
//     // .notEmpty()
//     .withMessage("State date must be a valid datetime"),
//   handleValidationErrors
// ];

module.exports = { validateGroupBody, validateVenueBody, validateEventBody } ;
