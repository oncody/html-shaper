
class StringParser {
  constructor(input) {
    this.input = input;
    this.index = 0;
  }

  finished() {
    return this.index === this.input.length;
  }

  consumeNextWhitespace() {
    this.consumeNextString(this.previewNextMatchingCharacters(/\s/));
  }

  nextStringIsEqualTo(string) {
    for (let i = 0; i < string.length && this.index + i < this.input.length; i++) {
      if (string.charAt(i).toLowerCase() !== this.input.charAt(this.index + i).toLowerCase()) {
        return false;
      }
    }

    return true;
  }

  previewNextMatchingCharacters(regex) {
    let matchingCharacters = '';

    for (let i = 0; this.index + i < this.input.length && regex.test(this.input.charAt(this.index + i)); i++) {
      matchingCharacters += this.input.charAt(this.index + i);
    }

    return matchingCharacters;
  }

  previewNextCharacters(length) {
    if (this.index + length > this.input.length) {
      throw new Error('Parse Error. Requesting characters beyond end of input');
    }

    return this.input.substring(this.index, this.index + length);
  }

  assertNextString(expectedString) {
    if (this.previewNextCharacters(expectedString.length).toLowerCase() !== expectedString.toLowerCase()) {
      throw new Error(`Parse Error. Expected '${expectedString}', but found '${this.previewNextCharacters(expectedString.length)}'`);
    }
  }

  consumeNextString(expectedString) {
    for (const expectedCharacter of expectedString) {
      if (this.previewNextCharacters(1).toLowerCase() !== expectedCharacter.toLowerCase()) {
        throw new Error(`Parse Error. Expected '${expectedCharacter}', but found '${this.previewNextCharacters(1)}'`);
      }
      this.index++;
    }

    return expectedString;
  }
}

module.exports = StringParser;
