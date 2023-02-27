const express = require("express");
const { check } = require("express-validator");
const router = require('express').Router();
const { handleValidationErrors } = require('./validation');
const { Event } = require('../db/models');
// const { setTokenCookie } = require("./auth");
// const { User } = require("../../db/models");

  // const validateSignUp = [
  //   check('firstName')
  //     .exists( {checkFalsy: true })
  //     .notEmpty()
  //     .isString()
  //     .withMessage('First name is required'),
  //   check('lastName')
  //     .exists( {checkFalsy: true })
  //     .notEmpty()
  //     .isString()
  //     .withMessage('Last name is required'),
  //   check('email')
  //     .exists( {checkFalsy: true })
  //     .notEmpty()
  //     .isEmail()
  //     .isString()
  //     .withMessage("Invalid email"),
  //     handleValidationErrors
  // ]


 const validateGroupBody = [
    check('name')
      .trim()
      .exists( {checkFalsy: true })
      .notEmpty()
      .isString()
      .isLength({min: 1, max: 60})
      .withMessage('Name must be 60 characters or less'),
    check('about')
      .trim()
      .exists( {checkFalsy: true })
      .isString()
      .notEmpty()
      .isLength({min: 50, max: 1000})
      .withMessage("About must be 50 characters or more"),
    check('type')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isString()
      .isIn(["Online", "In person"])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .exists( {checkFalsy: true })
      .notEmpty()
      .not()
      .isString()
      .withMessage("Private must be a boolean"),
    check('city')
      .exists({ checkFalsy: true })
      .isString()
      .notEmpty()
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .isString()
      .notEmpty()
      .isLength({min:2, max:2})
      .withMessage("State is required"),
      handleValidationErrors
];

const validateVenueBody = [
    check('address')
      .exists( {checkFalsy: true })
      .isString()
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .isString()
      .notEmpty()
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true})
      .isString()
      .notEmpty()
      .isLength({min: 2, max: 2})
      .withMessage('State is required'),
    check('lat')
      .exists({ checkFalsy: true})
      .notEmpty()
      .not()
      .isString()
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true})
      .notEmpty()
      .not()
      .isString()
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
      .isString()
      .isLength({min: 5, max: 50})
      .notEmpty()
      .withMessage("Name must be at least 5 characters"),
     check('type')
      .exists( {checkFalsy: true})
      .isString()
      .isIn(["Online", "In person"])
      .notEmpty()
      .withMessage("Type must be Online or In person"),
     check('capacity')
      .exists( {checkFalsy: true})
      .notEmpty()
      .not()
      .isString()
      .withMessage("Capacity must be an integer"),
     check('price')
      .exists( {checkFalsy: true})
      .notEmpty()
      .not()
      .isString()
      .withMessage("Price is invalid"),
     check('description')
      .exists( {checkFalsy: true})
      .isString()
      .notEmpty()
      .withMessage("Description is required"),
     check('startDate')
      .exists( {checkFalsy: true})
      .notEmpty()
      .custom((value, { req }) => {
        if (Date.parse(value) <= Date.now()) {
          return false;
        } else {
          return true;
        }
      })
      .withMessage("Start date must be in the future"),
     check('endDate')
      .exists( {checkFalsy: true})
      .notEmpty()
      .custom((value, { req }) => {
        if (Date.parse(value) <= Date.parse(req.body.startDate)) {
          return false;
        } else {
          return true;
        }
      })
      .withMessage("End date is less than start date"),
      handleValidationErrors
];

const validateMemberBody = [
      check('memberId')
        .exists()
        .notEmpty()
        .not()
        .isString()
        .withMessage("memberId must be a valid memberId"),
      check('status')
        .exists()
        .notEmpty()
        .isString()
        .withMessage("status is required"),
        handleValidationErrors
]

module.exports = { validateGroupBody, validateVenueBody, validateEventBody, validateMemberBody } ;
