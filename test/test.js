const formatter = require('../formatter');
const assert = require('assert');

describe('Testing html', function() {
    describe('basic html test', function() {
        it(`should just return '<!doctype html>'`, function() {
            assert.equal(formatter.formatHtml('<!doctype html>'), '<!doctype html>\n');
        });
    });
});