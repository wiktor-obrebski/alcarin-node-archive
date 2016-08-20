import gameApi from '../api/game'
import locationApi from '../api/location'
import charApi from '../api/char'
import authApi from '../api/player/auth'
import playerApi from '../api/player/player'
import adminPlayersApi from '../api/admin/players'

export default {
    'game.gametime':       gameApi.gametime,
    'game.playable-races': gameApi.playableRaces,

    'player.create':      playerApi.create,
    'player.create-char': playerApi.createChar,
    'player.fetch-chars': playerApi.fetchChars,

    // link current connection with specific character - if it belong to current player.
    // now events around character will be broadcast by this connection.
    'char.activate': charApi.activate,
    'char.events':   charApi.events,
    'char.say':      charApi.say,

    'auth.login':       authApi.login,
    'auth.verifyToken': authApi.verifyToken,

    'loc.details': locationApi.details,

    'admin.players': adminPlayersApi.fetch,
    'admin.update-permissions': adminPlayersApi.updatePermissions
}
