'use strict';

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
        let whitespace = previewNextMatchingTokens(/\s/);
        consumeNextString(whitespace);
        assertNextString('<');
        parseElement();
    }

    return formattedHtml;

    function parseElement() {
        assertNextString('<');
        if(previewNextString(2) === '<!') {
            parseSpecialElement();
            return;
        }

        consumeNextString('<');
        let elementName = previewNextMatchingTokens(/\S/);
        consumeNextString(elementName);
        if(elementName.endsWith('/>')) {
            formattedHtml += `<${elementName}\n`;
            return;
        }

        if(elementName.endsWith('>')) {
            formattedHtml += `<${elementName}`
        }
    }

    function parseSpecialElement() {
        assertNextString('<!');
        switch(previewNextString(3)) {
            case '<!-': parseComment();
            break;
            case '<!d': parseDoctype(); break;
            case '<!D': parseDoctype(); break;
            default: throw `Parse Error. Expected '<!-', '<!d', or '<!D', but found '${previewNextString(3)}'`;
        }
    }

    function parseDoctype() {
        consumeNextString('<!doctype');
        let whitespace = previewNextMatchingTokens(/\s/);
        if(whitespace.length === 0) {
            throw new `Parse Error. Expected whitespace after '<!doctype'`;
        }
        consumeNextString(whitespace);
        consumeNextString('html');
        consumeNextString(previewNextMatchingTokens(/\s/));
        consumeNextString('>');

        formattedHtml += '<!doctype html>\n';
    }

    function parseComment() {
        consumeNextString('<!--');
        if(previewNextString(1) === '>') {
            consumeNextString('>');
            return;
        }

        consumeNextString(previewNextMatchingTokens(/\s/));
        let commentText = '';
        while(previewNextString(3) !== '-->') {
            if(/\s/.test(previewNextString(1))) {
                commentText += ' ';
                consumeNextString(previewNextMatchingTokens(/\s/));
            } else {
                commentText += consumeNextString(previewNextString(1));
            }
        }

        if(!/\s/.test(commentText.charAt(commentText.length - 1))) {
            commentText += ' ';
        }

        consumeNextString('-->');
        formattedHtml += `<!-- ${commentText}-->\n`;
    }

    function previewNextMatchingTokens(regex) {
        let matchingString = '';

        for(let i = 0; ((index + i) < htmlString.length) && regex.test(htmlString.charAt(index + i)); i++) {
            matchingString += htmlString.charAt(index + i);
        }

        return matchingString;
    }

    function previewNextString(length) {
        if(index + length > htmlString.length) {
            throw new `Parse Error. Requesting characters beyond end of input`;
        }

        return htmlString.substring(index, index + length);
    }

    function assertNextString(expectedString) {
        if(previewNextString(expectedString.length).toLowerCase() !== expectedString.toLowerCase()) {
            throw `Parse Error. Expected '${expectedString}', but found '${previewNextString(expectedString.length)}'`;
        }
    }

    function consumeNextString(expectedString) {
        for (let expectedCharacter of expectedString) {
            if(previewNextString(1).toLowerCase() !== expectedCharacter.toLowerCase()) {
                throw `Parse Error. Expected '${expectedCharacter}', but found '${previewNextString(1)}'`;
            }
            index++;
        }

        return expectedString;
    }
}

