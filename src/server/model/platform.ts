import Config from './config';
import Constants from './constants';
import SocketMessage from './socketMessage';
import Timer from '../classes/timer';
import User from './user';

import { performance } from 'perf_hooks';


class Platform {
	private config: Config;
	private socketMessage: SocketMessage;

	private lastUserId: number = 0;
	private socketIndex: any = {};
	private userList: number[] = [];
	private userOnline: number = 0;

	private timerWorldData: number = 0;
	private timerWaitProcess: Timer;

	private gameStatus: number = Constants.GAME_STOP;


	constructor(config: Config, socketMessage: SocketMessage) {
		this.config = config;
		this.socketMessage = socketMessage;

		this.timerWaitProcess = new Timer(120);
	}

	update(timeDelta: number): void {
		// TODO: change game status

		this.timerWorldData += timeDelta;

		if (this.timerWorldData >= this.config.getInterval()) {
			this.timerWorldData = 0;

			this.socketMessage.sendWorldData(this.getSocketData());
		}


		if (this.gameStatus === Constants.GAME_WAIT) {
			this.timerWaitProcess.update((time: number) => {
				this.socketMessage.sendClockData({ 'time': time });
			});
		}
	}

	startAnimation(timeLast = 0): void {
		setTimeout(() => {
			const timeNow = performance.now();

			this.update((timeNow - timeLast) * 0.001);
			this.startAnimation(timeNow);
		});
	}

	addUser(socketId: number) {
		if (Object.prototype.hasOwnProperty.call(this.socketIndex, socketId)) {
			return false;
		}

		this.socketIndex[socketId] = new User(++this.lastUserId);
		console.log('Platform::addUser ' + socketId);

		return true;
	}

	removeUser(socketId: number) {
		if (!Object.prototype.hasOwnProperty.call(this.socketIndex, socketId)) {
			return false;
		}

		delete this.socketIndex[socketId];
		console.log('Platform::removeUser ' + socketId);

		return true;
	}

	updateUserStatus() {
		let currentUserOnline = 0;

		// this.userList = [];

		for (const socketId in this.socketIndex) {
			if (this.socketIndex[socketId].isOnline()) {
				++currentUserOnline;

				/*
				this.userList.push({
					'name': '',
					'points': 0
				})
				*/
			}
		}

		if (currentUserOnline === 0) {
			this.timerWaitProcess.stop();
			this.gameStatus = Constants.GAME_STOP;
		}

		if (currentUserOnline > this.userOnline && this.userOnline === 0) {
			this.timerWaitProcess.start();

			this.gameStatus = Constants.GAME_WAIT;
		}

		this.userOnline = currentUserOnline;
	}


	getCreationPackage(socketId: number): any {
		if (!Object.prototype.hasOwnProperty.call(this.socketIndex, socketId)) {
			return [];
		}

		return this.socketIndex[socketId].getNetworkPackage();
	}

	getUserName(socketId: number): string {
		if (Object.prototype.hasOwnProperty.call(this.socketIndex, socketId)) {
			return this.socketIndex[socketId].getName();
		}

		return '';
	}

	setTransformData(socketId: number, position: number[], rotation: number[], state: string): void {
		if (Object.prototype.hasOwnProperty.call(this.socketIndex, socketId)) {
			this.socketIndex[socketId].setPosition(position);
			this.socketIndex[socketId].setRotation(rotation);
			this.socketIndex[socketId].setState(state);
		}
	}

	setUserData(socketId: number, name: string, gender: string): void {
		if (Object.prototype.hasOwnProperty.call(this.socketIndex, socketId)) {
			this.socketIndex[socketId].setName(name);
			this.socketIndex[socketId].setGender(gender);
			this.socketIndex[socketId].setOnline(true);
		}
	}


	private getSocketData(): any {
		const data: { user: any[] } = {
			user: []
		};

		for (const socketId in this.socketIndex) {
			if (this.socketIndex[socketId].isOnline()) {
				data.user.push(this.socketIndex[socketId].getNetworkPackage());
			}
		}

		return data;
	}
}

export = Platform;