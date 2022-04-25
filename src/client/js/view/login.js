import Observable from '../interface/observable.js';

class Login extends Observable {
	constructor() {
		super();

		this._obj = document.getElementById('login');

		document.getElementById('ip').value = location.host;
		document.getElementById('connect').addEventListener('click', event => {
			let ip = document.getElementById('ip').value;
			let nickname = document.getElementById('nickname').value;

			this.emit('connectAction', {
				'ip': ip,
				'nickname' : nickname
			});
		});
	}

	show() {
		this._obj.style.display = '';
	}

	hide() {
		this._obj.style.display = 'none';
	}

	setErrorMessage(message) {
		document.getElementById('errorMessage').innerText = message;
	}
}

export default Login;