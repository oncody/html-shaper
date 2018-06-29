'use strict';

module.exports = {
    formatHtml
};

const tagsThatDoNotIndent = ['html','head','body'];

function formatHtml(htmlString) {
    let index = 0;
    let formattedHtml = '';

    while(index < htmlString.length) {
        consumeNextWhitespace();
        parseElement(0);
    }

    return formattedHtml;

    function parseElement(indentation) {
        assertNextString('<');
        if(nextStringIsEqualTo('<!')) {
            parseSpecialElement(indentation);
        } else {
            parseBasicElement(indentation);
        }
    }

    function parseBasicElement(indentation) {
        assertNextString('<');

        let name = parseElementStartTag();
        let attributes = parseAttributes();

        if(nextStringIsEqualTo('/>')) {
            consumeNextString('/>');
            printIndentation();
            appendToFormattedHtml('/>\n');
            return;
        }

        if(nextStringIsEqualTo('>')) {
            consumeNextString('>');
            printIndentation(indentation);
            appendToFormattedHtml('>');
            if(Object.keys(attributes).length > 1) {
                appendToFormattedHtml('\n');
            }
        }

        consumeNextWhitespace();
        let endToken = `</${name}`;
        if(nextStringIsEqualTo('</')) {
            consumeNextString(endToken);
            consumeNextWhitespace();
            consumeNextString('>');
            printIndentation(indentation);
            appendToFormattedHtml(endToken + '>\n');
        }
    }

    function parseElementStartTag() {
        consumeNextString('<');
        let name = previewNextMatchingCharacters(/[-\w]/);
        consumeNextString(name);
        consumeNextWhitespace();
        appendToFormattedHtml(`<${name}`);
        return name;
    }

    function parseAttributes() {
        let attributes = {};
        consumeNextWhitespace();
        if(previewNextMatchingCharacters(/[-\w]/).length > 0) {
            let name = parseAttributeName();
            consumeNextWhitespace();
            consumeNextString('=');
            consumeNextWhitespace();
            let value = parseAttributeValue();
            consumeNextWhitespace();
            attributes[name] = value;
        }

        Object.keys(attributes).forEach(key => {
            appendToFormattedHtml(` ${key}="${attributes[key]}"`);
        });

        return attributes;
    }

    function parseAttributeName() {
        let name = previewNextMatchingCharacters(/[-\w]/);
        if(name.length === 0) {
            throw `Parse Error. Expected an attribute name, but found '${previewNextCharacters(1)}'`;
        }
        consumeNextString(name);
        return name;
    }

    function parseAttributeValue() {
        parseQuoteCharacter();
        consumeNextWhitespace();
        let value = previewNextMatchingCharacters(/[-\w\s]/);
        consumeNextString(value);
        parseQuoteCharacter();
        return value;
    }

    function parseQuoteCharacter() {
        let nextString = previewNextMatchingCharacters(/['"]/);
        if(nextString.length === 0) {
            throw `Parse Error. Expected ' or ", but found '${previewNextCharacters(1)}'`;
        }
        consumeNextString(nextString.charAt(0));
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
        consumeNextWhitespace();
        consumeNextString('>');
        appendToFormattedHtml('<!doctype html>\n');
    }

    function parseComment(indentation) {
        consumeNextString('<!--');
        if(nextStringIsEqualTo('>')) {
            consumeNextString('>');
            return;
        }

        consumeNextWhitespace();
        let commentText = '';
        while(!nextStringIsEqualTo('-->')) {
            if(/\s/.test(previewNextCharacters(1))) {
                commentText += ' ';
                consumeNextWhitespace();
            } else {
                commentText += consumeNextString(previewNextCharacters(1));
            }
        }

        if(!/\s/.test(commentText.charAt(commentText.length - 1))) {
            commentText += ' ';
        }

        consumeNextString('-->');
        printIndentation(indentation);
        appendToFormattedHtml(`<!-- ${commentText}-->\n`);
    }

    function consumeNextWhitespace() {
        consumeNextString(previewNextMatchingCharacters(/\s/));
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
            appendToFormattedHtml('  ');
        }
    }

    function appendToFormattedHtml(string) {
        formattedHtml += string.toLowerCase().replace(`'`, `"`);
    }
}

