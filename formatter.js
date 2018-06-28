'use strict';

module.exports = {
    formatHtml
};

const tagsThatDoNotIndent = ['html','head','body'];

function formatHtml(htmlString) {
    let index = 0;
    let formattedString = '';
    let indentation = 0;
    let tags = [];

    while(index < htmlString.length) {
        consumeUntilNonWhitespace();
        if(previewNextCharacter() === '<') {
            parseElement();
        } else {
            throwParseErrorIfUnequal('<', previewNextCharacter());
        }
    }

    return formattedString;

    function parseElement() {
        previewExpectedCharacter('<');
        if(previewNextCharacterAwayFromCurrentIndex(1) === '!') {
            parseSpecialElement();
            return;
        }

        parseExpectedCharacter('<');
        // todo: finish this method
    }

    function isWhitespace(character) {
        return /\s/.test(character);
    }

    function parseSpecialElement() {
        previewExpectedString('<!');
        let nextCharacter = previewNextCharacterAwayFromCurrentIndex(2);
        switch(nextCharacter) {
            case '-': parseComment();
            break;
            case 'd': parseDoctype(); break;
            case 'D': parseDoctype(); break;
            default: throwParseErrorIfUnequal('-', nextCharacter);
        }
    }

    function consumeUntilNonWhitespace() {
        while(isWhitespace(previewNextCharacter())) {
            parseNextCharacter();
        }
    }

    function parseDoctype() {
        parseExpectedString('<!doctype');
        parseWhitespace();
        parseExpectedString('html');
        consumeUntilNonWhitespace();
        parseExpectedString('>');

        formattedString += '<!doctype html>\n';
    }

    function parseComment() {
        parseExpectedString('<!--');
        if(previewNextCharacter() === '>') {
            parseNextCharacter();
            return;
        }

        consumeUntilNonWhitespace();
        let commentText = '';
        while(!isNextString('-->')) {
            if(isNextCharacterWhitespace()) {
                commentText += ' ';
                consumeUntilNonWhitespace();
            } else {
                commentText += parseNextCharacter();
            }
        }

        if(!isWhitespace(commentText.charAt(commentText.length - 1))) {
            commentText += ' ';
        }

        parseExpectedString('-->');
        formattedString += `<!-- ${commentText}-->\n`;
    }

    function isNextString(string) {
        for(let i = 0; i < string.length; i++) {
            if(previewNextCharacterAwayFromCurrentIndex(i) !== string.charAt(i)) {
                return false;
            }
        }

        return true;
    }

    function previewNextCharacterAwayFromCurrentIndex(count) {
        return htmlString.charAt(index + count);
    }

    function previewNextCharacter() {
        return previewNextCharacterAwayFromCurrentIndex(0);
    }

    function parseNextCharacter() {
        let currentChar = previewNextCharacter();
        index++;
        return currentChar;
    }

    function throwParseErrorIfUnequal(expectedCharacter, actualCharacter) {
        if(actualCharacter.toLowerCase() !== expectedCharacter.toLowerCase()) {
            throw `Parse Error. Expected '${expectedCharacter}', but found '${actualCharacter}'`;
        }
    }

    function previewExpectedCharacter(expectedCharacter) {
        throwParseErrorIfUnequal(expectedCharacter, previewNextCharacter());
    }

    function previewExpectedCharacterAwayFromCurrentIndex(expectedCharacter, count) {
        throwParseErrorIfUnequal(expectedCharacter, previewNextCharacterAwayFromCurrentIndex(count));
    }

    function parseExpectedCharacter(expectedCharacter) {
        throwParseErrorIfUnequal(expectedCharacter, parseNextCharacter());
    }

    function parseNextExpectedWhitespaceCharacter() {
        let character = parseNextCharacter();
        if(!isWhitespace(character)) {
            throw `Parse Error. Expected a whitespace character, but found '${character}'`;
        }
    }

    function previewExpectedString(expectedString) {
        for (let i = 0; i < expectedString.length; i++) {
            previewExpectedCharacterAwayFromCurrentIndex(expectedString.charAt(i), i);
        }
    }

    function parseExpectedString(expectedString) {
        for (let character of expectedString) {
            parseExpectedCharacter(character);
        }
    }

    function isNextCharacterWhitespace() {
        return isWhitespace(previewNextCharacter());
    }

    // this asserts next character is whitespace
    // will consume all next characters
    function parseWhitespace() {
        parseNextExpectedWhitespaceCharacter();
        consumeUntilNonWhitespace();
    }
}

