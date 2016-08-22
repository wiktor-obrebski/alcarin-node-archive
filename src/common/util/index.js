import {log as _log} from './functions';

export const log = _log;
export const DEBUG = process.env.NODE_ENV === 'development';
