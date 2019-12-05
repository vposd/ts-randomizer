import { v4 as uuid } from 'uuid';
import { random } from 'lodash';

export const createString = (): string => uuid();
export const createNumber = (): number => random(0, 1e10);
export const createBoolean = (): boolean => Boolean(random(0, 1));
export const createFunction = (): Function => () => { };
export const createObject = (): object => ({});
export const createAny = () => [createObject, createNumber, createBoolean, createString][random(0, 3)].call(null);
