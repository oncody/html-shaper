
const StringParser = require('./string-parser');

module.exports = {
  formatHtml
};

const NON_INDENTATION_ELEMENTS = [
  'html',
  'body'
];

const VOID_ELEMENTS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

function formatHtml(htmlString) {
  const stringParser = new StringParser(htmlString);
  let formattedHtml = '';

  while (!stringParser.finished()) {
    stringParser.consumeNextWhitespace();
    parseElement(0);
    stringParser.consumeNextWhitespace();
  }

  return formattedHtml;

  function parseElement(indentation) {
    stringParser.assertNextString('<');
    if (stringParser.nextStringIsEqualTo('<!')) {
      parseSpecialElement(indentation);
    } else {
      parseBasicElement(indentation);
    }
  }

  function parseBasicElement(indentation) {
    stringParser.assertNextString('<');

    const name = parseElementStartTag(indentation);
    const attributes = parseAttributes(name, indentation);

    if (stringParser.nextStringIsEqualTo('/>')) {
      stringParser.consumeNextString('/>');
      appendToFormattedHtml('/>\n');
      return;
    }

    stringParser.assertNextString('>');
    stringParser.consumeNextString('>');
    appendToFormattedHtml('>');
    if (VOID_ELEMENTS.includes(name)) {
      appendToFormattedHtml('\n');
      return;
    }

    stringParser.consumeNextWhitespace();
    const hasSubElements = stringParser.nextStringIsEqualTo('<') && !stringParser.nextStringIsEqualTo('</');
    if (hasSubElements) {
      appendToFormattedHtml('\n');
    }

    while (!stringParser.nextStringIsEqualTo('</')) {
      if (stringParser.nextStringIsEqualTo('<')) {
        if (NON_INDENTATION_ELEMENTS.includes(name)) {
          parseElement(indentation);
        } else {
          parseElement(indentation + 1);
        }
      } else {
        parseText();
      }
      stringParser.consumeNextWhitespace();
    }

    const endToken = `</${name}`;
    if (stringParser.nextStringIsEqualTo('</')) {
      stringParser.consumeNextString(endToken);
      stringParser.consumeNextWhitespace();
      stringParser.consumeNextString('>');

      if (Object.keys(attributes).length > 1) {
        appendToFormattedHtml('\n');
      }
      if (hasSubElements || Object.keys(attributes).length > 1) {
        printIndentation(indentation);
      }
      appendToFormattedHtml(`${endToken}>\n`);
    }
  }

  // todo: comments inside text will not work
  function parseText() {
    stringParser.consumeNextWhitespace();
    let text = stringParser.previewNextMatchingCharacters(/[^<]/);
    stringParser.consumeNextString(text);
    text = text.replace(/\s+/, ' ');
    text = text.replace(/\s$/, '');
    appendToFormattedHtml(text);
  }

  function parseElementStartTag(indentation) {
    stringParser.consumeNextString('<');
    let name = stringParser.previewNextMatchingCharacters(/[-\w]/);
    stringParser.consumeNextString(name);
    stringParser.consumeNextWhitespace();
    printIndentation(indentation);
    name = name.toLowerCase();
    appendToFormattedHtml(`<${name}`);
    return name;
  }

  function parseAttributes(elementName, indentation) {
    const attributes = {};
    stringParser.consumeNextWhitespace();
    while (stringParser.previewNextMatchingCharacters(/[-\w]/).length > 0) {
      const name = parseAttributeName();
      stringParser.consumeNextWhitespace();
      let value = null;
      if (stringParser.previewNextCharacters(1) === '=') {
        stringParser.consumeNextString('=');
        stringParser.consumeNextWhitespace();
        value = parseAttributeValue();
        stringParser.consumeNextWhitespace();
      }
      attributes[name] = value;
    }

    printAttributes(elementName, attributes, indentation);

    return attributes;
  }

  function printAttributes(elementName, attributes, indentation) {
    for (let i = 0; i < Object.keys(attributes).length; i++) {
      if (i > 0) {
        printIndentation(indentation);
        elementName.split('').forEach(() => appendToFormattedHtml(' '));

        // append one extra space for the opening tag character '<'
        appendToFormattedHtml(' ');
      }

      appendToFormattedHtml(` ${Object.keys(attributes)[i]}`);
      if (attributes[Object.keys(attributes)[i]] !== null) {
        appendToFormattedHtml(`="${attributes[Object.keys(attributes)[i]]}"`);
      }

      if (i + 1 < Object.keys(attributes).length) {
        appendToFormattedHtml('\n');
      }
    }
  }

  function parseAttributeName() {
    const name = stringParser.previewNextMatchingCharacters(/[-\w]/);
    if (name.length === 0) {
      throw new Error(`Parse Error. Expected an attribute name, but found '${stringParser.previewNextCharacters(1)}'`);
    }
    stringParser.consumeNextString(name);
    return name;
  }

  function parseAttributeValue() {
    // todo: fix bug where single quote within double quote and vice-versa
    parseQuoteCharacter();
    stringParser.consumeNextWhitespace();
    const value = stringParser.previewNextMatchingCharacters(/[^'"]/);
    stringParser.consumeNextString(value);
    parseQuoteCharacter();
    return value;
  }

  function parseQuoteCharacter() {
    const nextString = stringParser.previewNextMatchingCharacters(/['"]/);
    if (nextString.length === 0) {
      throw new Error(`Parse Error. Expected ' or ", but found '${stringParser.previewNextCharacters(1)}'`);
    }
    stringParser.consumeNextString(nextString.charAt(0));
  }

  function parseSpecialElement(indentation) {
    stringParser.assertNextString('<!');
    switch (stringParser.previewNextCharacters(3)) {
      case '<!-':
        parseComment(indentation);
        break;
      case '<!d':
        parseDoctype();
        break;
      case '<!D':
        parseDoctype();
        break;
      default: throw new Error(`Parse Error. Expected '<!-', '<!d', or '<!D', but found '${stringParser.previewNextCharacters(3)}'`);
    }
  }

  function parseDoctype() {
    stringParser.consumeNextString('<!doctype');
    const whitespace = stringParser.previewNextMatchingCharacters(/\s/);
    if (whitespace.length === 0) {
      throw new Error('Parse Error. Expected whitespace after \'<!doctype\'');
    }
    stringParser.consumeNextString(whitespace);
    stringParser.consumeNextString('html');
    stringParser.consumeNextWhitespace();
    stringParser.consumeNextString('>');
    appendToFormattedHtml('<!doctype html>\n');
  }

  function parseComment(indentation) {
    stringParser.consumeNextString('<!--');
    if (stringParser.nextStringIsEqualTo('>')) {
      stringParser.consumeNextString('>');
      return;
    }

    stringParser.consumeNextWhitespace();
    let commentText = '';
    while (!stringParser.nextStringIsEqualTo('-->')) {
      if (/\s/.test(stringParser.previewNextCharacters(1))) {
        commentText += ' ';
        stringParser.consumeNextWhitespace();
      } else {
        commentText += stringParser.consumeNextString(stringParser.previewNextCharacters(1));
      }
    }

    if (!/\s/.test(commentText.charAt(commentText.length - 1))) {
      commentText += ' ';
    }

    stringParser.consumeNextString('-->');
    printIndentation(indentation);
    appendToFormattedHtml(`<!-- ${commentText}-->\n`);
  }

  function printIndentation(indentation) {
    for (let i = 0; i < indentation; i++) {
      appendToFormattedHtml('  ');
    }
  }

  function appendToFormattedHtml(string) {
    formattedHtml += string;
  }
}

