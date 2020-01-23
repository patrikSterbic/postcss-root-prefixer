const postcss = require('postcss');

const checkParentHasPrefix = (rule, prefix) => {
  if (rule.parent.selector) {
    return checkParentHasPrefix(rule.parent, prefix);
  }

  return rule.selector.includes(prefix);
};

module.exports = postcss.plugin('postcss-sass-prefix-selector', (opts = {}) => {
  const { prefix, fileNamePattern } = opts;
  if (!prefix) {
    throw new Error('Option "prefix" is missed!');
  }
  
  if (typeof prefix !== 'string') {
    throw new Error('Option "prefix" must be a string!');
  }

  return (root, result) => {
    const filePath = result.opts.to;

    if (fileNamePattern && !fileNamePattern.test(filePath)) {
      return;
    }
    
    root.walkRules(rule => {
      if (rule.parent.selector && checkParentHasPrefix(rule, prefix)) {
        return rule;
      }

      if (rule.selector && rule.selector[0] === '.') {
        rule.selector = [prefix, rule.selector].join(' ');
      }
    });
  };
});
