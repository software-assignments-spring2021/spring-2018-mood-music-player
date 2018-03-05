function changeToRegister() {
	const registerButton = document.getElementById('register-button');
	const registerForm = document.getElementById('register');
	const loginButton = document.getElementById('login-button');
	const loginForm = document.getElementById('login');

	loginForm.style.display = 'none';
	loginButton.style.display = 'block';
	registerButton.style.display = 'none';
	registerForm.style.display = 'block';
}

function changeToLogin() {
	const registerButton = document.getElementById('register-button');
	const registerForm = document.getElementById('register');
	const loginButton = document.getElementById('login-button');
	const loginForm = document.getElementById('login');

	registerForm.style.display = 'none';
	registerButton.style.display = 'block';
	loginButton.style.display = 'none';
	loginForm.style.display = 'block';
}

function main() {
	const registerButton = document.getElementById('register-button');
	registerButton.addEventListener('click', changeToRegister);
	const loginButton = document.getElementById('login-button');
	loginButton.addEventListener('click', changeToLogin);
}

document.addEventListener('DOMContentLoaded', main);