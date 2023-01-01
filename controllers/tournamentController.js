const tournamentModel = require('../models/tournamentModel');
const tournamentTimer = require('../utils/tournamentTimer');
const constants = require('../data/constants');

exports.getTournaments = async (req, res, next) => {
  try {
    const liveTournaments = await tournamentModel.getTournaments(
      constants.TOURNAMENT.LIVE
    );

    const endedTournaments = await tournamentModel.getTournaments(
      constants.TOURNAMENT.ENDED
    );

    // const overTournaments = await tournamentModel.getTournaments(
    //   constants.TOURNAMENT.OVER
    // );

    return res.json({
      success: true,
      data: {
        live: liveTournaments,
        ended: endedTournaments,
        over: []
      }
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: null
    });
  }
};

exports.addTournament = async (req, res, next) => {
  try {
    const { game, endDate, prizes, status, maxScorePerMinute } = req.body;

    if (game && endDate && prizes && maxScorePerMinute) {
      const tournament = await tournamentModel.addTournament({
        game,
        endDate,
        prizes,
        status,
        maxScorePerMinute
      });

      if (tournament) {
        tournamentTimer.startTimer();
        const data = await tournamentModel.getTournamentDetails(tournament._id);
        return res.json({
          status: 200,
          success: true,
          data
        });
      } else {
        return res.json({
          status: 500,
          success: false,
          msg: 'Unable to add new tournament!'
        });
      }
    } else {
      return res.json({
        status: 404,
        success: false,
        msg: 'Required params not found!'
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: 500,
      success: false,
      msg: 'Something went wrong!'
    });
  }
};

exports.getTournamentDetails = async (req, res, next) => {
  try {
    const tournamentId = req.params.tournamentId;
    if (tournamentId) {
      const tournamentData = await tournamentModel.getTournamentDetails(
        tournamentId
      );

      if (tournamentData) {
        return res.json({
          success: true,
          data: tournamentData
        });
      } else {
        return res.json({
          success: false,
          data: null
        });
      }
    } else {
      return res.json({
        success: false,
        data: null
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: null
    });
  }
};

exports.updateTournament = async (req, res, next) => {
  try {
    const tournamentId = req.params.tournamentId;
    if (tournamentId) {
      const { game, endDate, prizes, maxScorePerMinute, status } = req.body;

      if (game && endDate && prizes && maxScorePerMinute && status) {
        const tournamentData = {
          game,
          endDate,
          prizes,
          maxScorePerMinute,
          status
        };

        const result = await tournamentModel.updateTournament(
          { _id: tournamentId },
          tournamentData
        );

        if (result) {
          tournamentTimer.startTimer();
          const data = await tournamentModel.getTournamentDetails(tournamentId);
          if (data) {
            return res.json({
              success: true,
              data
            });
          } else {
            return res.json({
              success: false,
              data: null,
              msg: 'Tournament not found!'
            });
          }
        } else {
          return res.json({
            success: false,
            data: null,
            msg: 'Unable to update tournament!'
          });
        }
      } else {
        return res.json({
          success: false,
          data: null,
          msg: 'Some params missing!'
        });
      }
    } else {
      return res.json({
        success: false,
        data: null,
        msg: 'Some params missing!'
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: null,
      msg: 'Something went wrong!'
    });
  }
};

exports.deleteTournament = async (req, res, next) => {
  try {
    const tournamentId = req.params.tournamentId;
    if (tournamentId) {
      const result = await tournamentModel.deleteTournament(tournamentId);

      if (result) {
        return res.json({
          success: true,
          msg: 'Tournament deleted!'
        });
      } else {
        return res.json({
          success: false,
          data: null
        });
      }
    } else {
      return res.json({
        success: false,
        data: null
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: null
    });
  }
};
