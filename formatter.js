'use strict';

const stringUtils = require('./string-utils');

module.exports = {
    formatHtml
};

const tagsThatDoNotIndent = ['html','head','body'];

function formatHtml(htmlString) {
    let index = 0;
    let formattedHtml = '';
    let indentation = 0;
    let tags = [];

    while(index < htmlString.length) {
        consumeUntilNonWhitespace();
        if(previewNextString(1) === '<') {
            parseElement();
        } else {
            throwParseErrorIfUnequal('<', previewNextString(1));
        }
    }

    return formattedHtml;

    function parseElement() {
        previewExpectedString('<');
        if(isNextString('<!')) {
            parseSpecialElement();
            return;
        }

        parseExpectedString('<');
        let elementName = parseNonWhitespace();
        if(elementName.endsWith('/>')) {
            formattedHtml += `<${elementName}\n`;
            return;
        }

        if(elementName.endsWith('>')) {
            formattedHtml += `<${elementName}`
        }
    }

    function parseSpecialElement() {
        previewExpectedString('<!');
        let nextString = previewNextString(3);
        switch(nextString) {
            case '<!-': parseComment();
            break;
            case '<!d': parseDoctype(); break;
            case '<!D': parseDoctype(); break;
            default: throwParseErrorIfUnequal('<!', nextString);
        }
    }

    function consumeUntilNonWhitespace() {
        while((index < htmlString.length) && stringUtils.isWhitespace(previewNextString(1))) {
            parseNextCharacter();
        }
    }

    function parseDoctype() {
        parseExpectedString('<!doctype');
        parseWhitespace();
        parseExpectedString('html');
        consumeUntilNonWhitespace();
        parseExpectedString('>');

        formattedHtml += '<!doctype html>\n';
    }

    function parseComment() {
        parseExpectedString('<!--');
        if(previewNextString(1) === '>') {
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

        if(!stringUtils.isWhitespace(commentText.charAt(commentText.length - 1))) {
            commentText += ' ';
        }

        parseExpectedString('-->');
        formattedHtml += `<!-- ${commentText}-->\n`;
    }

    function isNextString(expectedString) {
        return htmlString.substring(index, index + expectedString.length) === expectedString;
    }

    function previewNextString(count) {
        return htmlString.substring(index, index + count);
    }

    function parseNextCharacter() {
        let currentChar = previewNextString(1);
        index++;
        return currentChar;
    }

    function throwParseErrorIfUnequal(expectedCharacter, actualCharacter) {
        if(actualCharacter.toLowerCase() !== expectedCharacter.toLowerCase()) {
            throw `Parse Error. Expected '${expectedCharacter}', but found '${actualCharacter}'`;
        }
    }

    function parseNextExpectedWhitespaceCharacter() {
        let character = parseNextCharacter();
        if(!stringUtils.isWhitespace(character)) {
            throw `Parse Error. Expected a whitespace character, but found '${character}'`;
        }
    }

    function previewExpectedString(expectedString) {
        throwParseErrorIfUnequal(expectedString, htmlString.substring(index, index + expectedString.length));
    }

    function parseExpectedString(expectedString) {
        previewExpectedString(expectedString);
        for (let character of expectedString) {
            parseNextCharacter();
        }
    }

    function isNextCharacterWhitespace() {
        return stringUtils.isWhitespace(previewNextString(1));
    }

    function parseNonWhitespace() {
        let string = '';
        while((index < htmlString.length) && !stringUtils.isWhitespace(previewNextString(1))) {
            string += parseNextCharacter();
        }

        return string;
    }

    // this asserts next character is whitespace
    // will consume all next characters
    function parseWhitespace() {
        parseNextExpectedWhitespaceCharacter();
        consumeUntilNonWhitespace();
    }
}

