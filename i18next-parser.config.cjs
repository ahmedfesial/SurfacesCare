module.exports = {
  locales: ['en', 'ar'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  defaultNamespace: 'translation',
  defaultValue: '',
  useKeysAsDefaultValue: false,
  keepRemoved: true,
  verbose: true
};
