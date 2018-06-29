'use strict';

module.exports = {
    formatHtml
};

const tagsThatDoNotIndent = ['html','head','body'];

function formatHtml(htmlString) {
    let index = 0;
    let formattedHtml = '';
    let tags = [];

    while(index < htmlString.length) {
        let whitespace = previewNextMatchingCharacters(/\s/);
        consumeNextString(whitespace);
        assertNextString('<');
        parseElement(0);
    }

    return formattedHtml;

    function parseElement(indentation) {
        let attributes = {};

        assertNextString('<');
        if(nextStringIsEqualTo('<!')) {
            parseSpecialElement(indentation);
            return;
        }

        consumeNextString('<');
        let elementName = previewNextMatchingCharacters(/[-\w]/);
        consumeNextString(elementName);
        consumeNextString(previewNextMatchingCharacters(/\s/));

        if(nextStringIsEqualTo('/>')) {
            consumeNextString('/>');
            printIndentation();
            formattedHtml += `<${elementName}/>\n`;
            return;
        }

        if(nextStringIsEqualTo('>')) {
            consumeNextString('>');
            printIndentation(indentation);
            formattedHtml += `<${elementName}>`;
            if(Object.keys(attributes).length > 1) {
                formattedHtml += '\n';
            }
        }

        consumeNextString(previewNextMatchingCharacters(/\s/));
        let elementEndToken = `</${elementName}`;
        if(nextStringIsEqualTo('</')) {
            consumeNextString(elementEndToken);
            consumeNextString(previewNextMatchingCharacters(/\s/));
            consumeNextString('>');
            printIndentation(indentation);
            formattedHtml += elementEndToken + '>\n';
        }
    }

    function parseSpecialElement(indentation) {
        assertNextString('<!');
        switch(previewNextCharacters(3)) {
            case '<!-': parseComment(indentation); break;
            case '<!d': parseDoctype(); break;
            case '<!D': parseDoctype(); break;
            default: throw `Parse Error. Expected '<!-', '<!d', or '<!D', but found '${previewNextCharacters(3)}'`;
        }
    }

    function parseDoctype() {
        consumeNextString('<!doctype');
        let whitespace = previewNextMatchingCharacters(/\s/);
        if(whitespace.length === 0) {
            throw new `Parse Error. Expected whitespace after '<!doctype'`;
        }
        consumeNextString(whitespace);
        consumeNextString('html');
        consumeNextString(previewNextMatchingCharacters(/\s/));
        consumeNextString('>');

        formattedHtml += '<!doctype html>\n';
    }

    function parseComment(indentation) {
        consumeNextString('<!--');
        if(nextStringIsEqualTo('>')) {
            consumeNextString('>');
            return;
        }

        consumeNextString(previewNextMatchingCharacters(/\s/));
        let commentText = '';
        while(!nextStringIsEqualTo('-->')) {
            if(/\s/.test(previewNextCharacters(1))) {
                commentText += ' ';
                consumeNextString(previewNextMatchingCharacters(/\s/));
            } else {
                commentText += consumeNextString(previewNextCharacters(1));
            }
        }

        if(!/\s/.test(commentText.charAt(commentText.length - 1))) {
            commentText += ' ';
        }

        consumeNextString('-->');
        printIndentation(indentation);

        formattedHtml += `<!-- ${commentText}-->\n`;
    }

    function nextStringIsEqualTo(string) {
        for(let i = 0; (i < string.length) && ((index + i) < htmlString.length); i++) {
            if(string.charAt(i).toLowerCase() !== htmlString.charAt(index + i).toLowerCase()) {
                return false;
            }
        }

        return true;
    }

    function previewNextMatchingCharacters(regex) {
        let matchingCharacters = '';

        for(let i = 0; ((index + i) < htmlString.length) && regex.test(htmlString.charAt(index + i)); i++) {
            matchingCharacters += htmlString.charAt(index + i);
        }

        return matchingCharacters;
    }

    function previewNextCharacters(length) {
        if(index + length > htmlString.length) {
            throw new `Parse Error. Requesting characters beyond end of input`;
        }

        return htmlString.substring(index, index + length);
    }

    function assertNextString(expectedString) {
        if(previewNextCharacters(expectedString.length).toLowerCase() !== expectedString.toLowerCase()) {
            throw `Parse Error. Expected '${expectedString}', but found '${previewNextCharacters(expectedString.length)}'`;
        }
    }

    function consumeNextString(expectedString) {
        for (let expectedCharacter of expectedString) {
            if(previewNextCharacters(1).toLowerCase() !== expectedCharacter.toLowerCase()) {
                throw `Parse Error. Expected '${expectedCharacter}', but found '${previewNextCharacters(1)}'`;
            }
            index++;
        }

        return expectedString;
    }

    function printIndentation(indentation) {
        for(let i = 0; i < indentation; i++) {
            formattedHtml += '  ';
        }
    }
}

