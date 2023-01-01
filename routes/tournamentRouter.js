const express = require('express');

const router = express.Router();

const tournamentController = require('../controllers/tournamentController');
const authController = require('../controllers/authController');

router.get('/', tournamentController.getTournaments);

router.post('/', authController.isAdmin, tournamentController.addTournament); 

router.patch('/:tournamentId', authController.isAdmin, tournamentController.updateTournament);

router.delete('/:tournamentId', authController.isAdmin, tournamentController.deleteTournament);

router.get('/:tournamentId', tournamentController.getTournamentDetails);

module.exports = router;
