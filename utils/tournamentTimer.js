const tournamentModel = require('../models/tournamentModel');
const { formatTimer } = require('./utils');
const constants = require('../data/constants');

const startTimer = async () => {
  if (global.tournamentTimerId) {
    clearInterval(global.tournamentTimerId);
  }

  const tournaments = await tournamentModel.getTournaments_Basic(
    constants.TOURNAMENT.LIVE
  );

  const removeTournament = async (id) => {
    const index = tournaments.findIndex((tourna) => tourna._id === id);
    if (index > -1) {
      tournaments.splice(index, 1);
      await tournamentModel.updateTournament(
        { _id: id },
        {
          status: constants.TOURNAMENT.ENDED
        }
      );
    }
  };

  if (tournaments && tournaments.length) {
    setTimeout(() => {
      global.tournamentTimerId = setInterval(() => {
        if (tournaments && tournaments.length) {
          const allTimes = tournaments.map((tournament) => {
            const leftTime = formatTimer(tournament.endDate);
            if (
              (leftTime &&
                leftTime.days === '00' &&
                leftTime.hours === '00' &&
                leftTime.minutes === '00' &&
                leftTime.seconds === '00') ||
              leftTime.days.includes('-') ||
              leftTime.hours.includes('-') ||
              leftTime.minutes.includes('-') ||
              leftTime.seconds.includes('-')
            ) {
              removeTournament(tournament._id);

              global.io.emit('tournamentEnd', {
                id: tournament._id
              });

              return {
                _id: tournament._id,
                time: {
                  days: '00',
                  hours: '00',
                  minutes: '00',
                  seconds: '00'
                }
              };
            }

            return {
              _id: tournament._id,
              time: leftTime
            };
          });
          global.io.emit('tournamentTimer', {
            allTimes
          });
        }
      }, 1000);
    }, 1000);
  }
};

exports.startTimer = startTimer;
