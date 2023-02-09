module.exports = {
  extends: ['gitmoji'],
  rules: {
    'type-empty': [2, 'always']
  },
  parserPreset: {
    parserOpts: {
      // Test URL: https://regex101.com/r/YxXWi5/11
      headerPattern:
        /^(?::\w*:|(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])\s(?<subject>(?:(?!#).)*(?:(?!\s).))\s?(?<ticket>#\d*)?$/,
      headerCorrespondence: ['subject', 'ticket']
    }
  }
}
