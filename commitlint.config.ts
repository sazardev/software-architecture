import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
  },
};

export default config;
