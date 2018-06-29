const formatter = require('../formatter');
const assert = require('assert');

describe('Testing html', function() {
    describe('<!doctype html>', function() {
        it(`should return '<!doctype html>'`, function() {
            assert.equal(formatter.formatHtml('<!doctype html>'), '<!doctype html>\n');
        });
    });
    describe('<!doctype   html>', function() {
        it(`should return '<!doctype html>'`, function() {
            assert.equal(formatter.formatHtml('<!doctype   html>'), '<!doctype html>\n');
        });
    });

    describe('empty comment', function() {
        it(`should return nothing`, function() {
            assert.equal(formatter.formatHtml('<!-->'), '');
        });
    });

    describe('<!-- comment -->', function() {
        it(`should return <!-- comment -->`, function() {
            assert.equal(formatter.formatHtml('<!-- comment -->'), '<!-- comment -->\n');
        });
    });

    describe('<!--comment-->', function() {
        it(`should return <!-- comment -->`, function() {
            assert.equal(formatter.formatHtml('<!--comment-->'), '<!-- comment -->\n');
        });
    });

    describe('<!-- comment   text   -->', function() {
        it(`should return <!-- comment   text   -->`, function() {
            assert.equal(formatter.formatHtml('<!-- comment   text   -->'), '<!-- comment text -->\n');
        });
    });

    describe('<head/>', function() {
        it(`should return <head/>`, function() {
            assert.equal(formatter.formatHtml('<head/>'), '<head/>\n');
        });
    });

    describe('<head  />', function() {
        it(`should return <head/>`, function() {
            assert.equal(formatter.formatHtml('<head  />'), '<head/>\n');
        });
    });

    describe('<head>', function() {
        it(`should return <head>`, function() {
            assert.equal(formatter.formatHtml('<head>'), '<head>');
        });
    });

    describe('<head  >', function() {
        it(`should return <head>`, function() {
            assert.equal(formatter.formatHtml('<head  >'), '<head>');
        });
    });
});