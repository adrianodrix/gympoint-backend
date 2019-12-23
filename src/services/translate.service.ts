import i18n from 'i18n';
import { resolve } from 'path';

i18n.configure({
  objectNotation: true,
  locales: ['en', 'pt-br'],
  directory: resolve(__dirname, '..', 'resources', 'locales'),
});

export default i18n;
