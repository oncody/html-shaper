const formatter = require('../src/index');
const assert = require('assert');

describe('Testing html', () => {
  describe('<!doctype html>', () => {
    it('should return \'<!doctype html>\'', () => {
      assert.equal(formatter.formatHtml('<!doctype html>'), '<!doctype html>\n');
    });
  });

  describe('<!doctype   html>', () => {
    it('should return \'<!doctype html>\'', () => {
      assert.equal(formatter.formatHtml('<!doctype   html>'), '<!doctype html>\n');
    });
  });

  describe('empty comment', () => {
    it('should return nothing', () => {
      assert.equal(formatter.formatHtml('<!-->'), '');
    });
  });

  describe('<!-- comment -->', () => {
    it('should return <!-- comment -->', () => {
      assert.equal(formatter.formatHtml('<!-- comment -->'), '<!-- comment -->\n');
    });
  });

  describe('<!--comment-->', () => {
    it('should return <!-- comment -->', () => {
      assert.equal(formatter.formatHtml('<!--comment-->'), '<!-- comment -->\n');
    });
  });

  describe('<!-- comment   text   -->', () => {
    it('should return <!-- comment   text   -->', () => {
      assert.equal(formatter.formatHtml('<!-- comment   text   -->'), '<!-- comment text -->\n');
    });
  });

  describe('<head></head>', () => {
    it('should return <head></head>\n', () => {
      assert.equal(formatter.formatHtml('<head></head>'), '<head></head>\n');
    });
  });

  describe('<head  ></head  >', () => {
    it('should return <head></head>\n', () => {
      assert.equal(formatter.formatHtml('<head  ></head  >'), '<head></head>\n');
    });
  });

  describe('<head attribute="value"></head>', () => {
    it('should return <head attribute="value"></head>\n', () => {
      assert.equal(formatter.formatHtml('<head attribute="value"></head>'), '<head attribute="value"></head>\n');
    });
  });

  describe('<head first-attribute="value1" second-attribute="value1"></head>', () => {
    it('should return <head first-attribute="value1"\n      second-attribute="value1">\n</head>\\n', () => {
      assert.equal(formatter.formatHtml('<head first-attribute="value1" second-attribute="value1"></head>'),
        '<head first-attribute="value1"\n      second-attribute="value1">\n</head>\n');
    });
  });

  describe('<head>text</head>', () => {
    it('should return <head>text</head>\n', () => {
      assert.equal(formatter.formatHtml('<head>text</head>'), '<head>text</head>\n');
    });
  });

  describe('<h1><h2></h2></h1>', () => {
    it('should return <h1>\n<h2></h2>\n</h1>\n', () => {
      assert.equal(formatter.formatHtml('<h1><h2></h2></h1>'), '<h1>\n  <h2></h2>\n</h1>\n');
    });
  });

  describe('<head attribute></head>', () => {
    it('should return <head attribute></head>\n', () => {
      assert.equal(formatter.formatHtml('<head attribute></head>'), '<head attribute></head>\n');
    });
  });

  describe('<br>', () => {
    it('should return <br>\n', () => {
      assert.equal(formatter.formatHtml('<br>'), '<br>\n');
    });
  });

  describe('<div>hi\n</div>', () => {
    it('should return <div>hi</div>', () => {
      assert.equal(formatter.formatHtml('<div>hi\n</div>'), '<div>hi</div>\n');
    });
  });

  // describe('test', function() {
  //     it(`test`, function() {
  //         let input = '<div id="app"></div>\n' +
  //             '<script src="./dist/main.js"></script>\n';
  //         assert.equal(formatter.formatHtml(input), 'test');
  //     });
  // });
});
