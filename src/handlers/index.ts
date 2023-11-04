import {NubankHandler} from './nubank.js';
import {XpHandler} from './xp.js';

const handlers = [
	new XpHandler(),
	new NubankHandler(),
];

export default handlers;
