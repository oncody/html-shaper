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

    describe('<head></head>', function() {
        it(`should return <head></head>\n`, function() {
            assert.equal(formatter.formatHtml('<head></head>'), '<head></head>\n');
        });
    });

    describe('<head  ></head  >', function() {
        it(`should return <head></head>\n`, function() {
            assert.equal(formatter.formatHtml('<head  ></head  >'), '<head></head>\n');
        });
    });

    describe('<head attribute="value"></head>', function() {
        it(`should return <head attribute="value"></head>\n`, function() {
            assert.equal(formatter.formatHtml('<head attribute="value"></head>'), '<head attribute="value"></head>\n');
        });
    });

    describe('<head first-attribute="value1" second-attribute="value1"></head>', function() {
        it(`should return <head first-attribute="value1" second-attribute="value1"></head>\n`, function() {
            assert.equal(formatter.formatHtml('<head first-attribute="value1" second-attribute="value1"></head>'), '<head first-attribute="value1" second-attribute="value1"></head>\n');
        });
    });
});