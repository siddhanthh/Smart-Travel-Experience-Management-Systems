const tripService = require('../services/tripService');

exports.createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.body, req.user.id);
    res.status(201).json({ message: 'Trip created successfully', data: trip });
  } catch (err) {
    next(err);
  }
};

exports.getTrips = async (req, res, next) => {
  try {
    const result = await tripService.getTrips({ ...req.query, userId: req.user?.id });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    res.status(200).json({ data: trip });
  } catch (err) {
    next(err);
  }
};

exports.joinTrip = async (req, res, next) => {
  try {
    const result = await tripService.joinTrip(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.cancelTrip = async (req, res, next) => {
  try {
    const result = await tripService.cancelTrip(req.params.id, req.user.id, req.user.role);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getTripMembers = async (req, res, next) => {
  try {
    const result = await tripService.getTripMembers(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const result = await tripService.updateTrip(req.params.id, req.body, req.user.id, req.user.role);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const result = await tripService.deleteTrip(req.params.id, req.user.id, req.user.role);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};