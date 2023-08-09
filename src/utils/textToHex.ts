import { Buffer } from 'buffer';

const textToHex = (text) => Buffer.from(text, 'utf8').toString('hex');

export default textToHex;