'use strict';

module.exports = {
    isWhitespace
};

function isWhitespace(character) {
    return /\s/.test(character);
}