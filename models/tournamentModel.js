const Tournament = require('../db/schemas/tournamentSchema');

exports.getTournaments = async (status) => {
  try {
    return await Tournament.find({ status }).populate('game').sort({ _id: -1 });
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getTournaments_Basic = async (status) => {
  try {
    return await Tournament.find({ status }, { endDate: 1 }).sort({ _id: -1 });
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.addTournament = async (tournamentData) => {
  try {
    return await Tournament.create(tournamentData);
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getTournamentDetails = async (tournamentId) => {
  try {
    return await Tournament.findById(tournamentId).populate('game');
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.updateTournament = async (query, updatedData) => {
  try {
    return await Tournament.updateOne(query, updatedData);
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.deleteTournament = async (tournamentId) => {
  try {
    return await Tournament.deleteOne({ _id: tournamentId });
  } catch (err) {
    console.log(err);
    return null;
  }
};
