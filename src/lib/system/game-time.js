import {redis} from '../../common/redis'
import * as R from 'ramda'
import * as Kefir from 'kefir'

const parseDecInt  = R.curryN(2, parseInt)(R.__, 10);
const parseDecInt$ = R.compose(Kefir.constant, parseDecInt);

// this module need refactoring.
// three time values should be stored in one object, so we can faster
// get and set new time

const DAY_SEC = 60 * 60 * 24 * 4;

export default {
    /**
     * return number of seconds since begining of game world
     * @type {int}
     */
    currentTimestamp: getCurrentTimestamp,

    /**
     * pause game time. every action dependent from time will be stoped.
     */
    pause: pauseTime,

    /**
     * resume game time (after pause)
     */
    resume: resumeTime,

    /**
     * check if game time has been paused
     * @type {boolean}
     */
    freezed: fetchFreeze,

    /**
     * return current time as helper GameTime object
     * @type {GameTime}
     */
    now: nowGameTime,

    /**
     * return given timestamp as helper GameTime object
     * @type {[type]}
     */
    fromTimestamp: gameTimeFromTimestamp,
};

/**
 * GameTime is package for timestamp value that can be used to calculate parts
 * of time, like current day, hour etc.
 * @type {Object}
 */
var GameTime = {
    hour:    getHour
};

function getHour(floating) {
    var hours = (this.timestamp % DAY_SEC) / (60 * 60);
    if (!floating) {
        hours = Math.floor(hours);
    }
    return hours;
}

function getCurrentTimestamp() {
    const freezed$ = fetchFreeze();
    const lastGameTime$ = fetchGameTime();
    return Kefir.combine(
        [freezed$, lastGameTime$],
        (freezed, lastGameTime) => freezed ? lastGameTime : currGameTime(lastGameTime)
    ).flatMap();

    function currGameTime(lastGameTime) {
        return fetchLastRealTime().map(
            (lastRealTime) => lastGameTime + currentRealTime() - lastRealTime
        );
    }
}

function currentRealTime() {
    return Math.round(new Date().getTime() / 1000);
}

function fetchFreeze() {
    return redis().hget('gametime', 'freeze')
        .map(R.equals('true'));
}

function fetchLastRealTime() {
    return redis().hget('gametime', 'last_real_timestamp')
        .map(R.ifElse(R.isEmpty, initRealTime, parseDecInt$))
        .flatMap();

    function initRealTime() {
        const currRealTime = currentRealTime();
        return redis().hset('gametime', 'last_real_timestamp', currRealTime)
            .map(R.always(currRealTime));
    }
}

function fetchGameTime() {
    return redis().hget('gametime', 'last_game_timestamp')
        .map((game) => {
            if (game) {
                return parseInt(game, 10);
            }
            return 0;
        });
}

async function pauseTime() {
    var freezed = await this.freezed();
    if (!freezed) {
        var lastGame = await fetchGameTime();
        var lastReal = await fetchLastRealTime();
        var currentGameTime = lastGame + currentRealTime() - lastReal;

        await redis().hsetAsync(
            'gametime', 'freeze', true
        );
        await redis().hsetAsync(
            'gametime', 'last_game_timestamp', currentGameTime
        );
    }
}

async function resumeTime() {
    var freezed = await this.freezed();
    if (freezed) {
        await redis().hsetAsync(
            'gametime', 'last_real_timestamp', currentRealTime()
        );
        await redis().hsetAsync(
            'gametime', 'freeze', false
        );
    }
}

function nowGameTime() {
    return getCurrentTimestamp();
    // return _.create(GameTime, {
    //     timestamp: src
    // });
}
function gameTimeFromTimestamp(timestamp) {
    // return _.create(GameTime, {
    //     timestamp: timestamp
    // });
}

// light intensity, from 0-1
// lighting: ->
//     switch
//     hour = @hour false
//         when hour > 92 or hour <= 4
//             _intensity = ((hour + 4) % 96) / 8
//             _timeofday = 'morning'
//         when hour > 4 and hour <= 44
//             _intensity = 1
//             _timeofday = 'day'
//         when hour > 44 and hour <= 52
//             _intensity = 1 - (hour % 44) / 8
//             _timeofday = 'evening'
//         when hour > 52 and hour <= 92
//             _intensity = 0
//             _timeofday = 'night'
//         else throw Error "Can not choose lighting system. Wrong hour: #{hour}"
//     return {
//         intensity: _intensity
//         timeofday: _timeofday
//     }
