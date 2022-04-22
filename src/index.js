import './styles/style.css'

const testMessage = document.createElement('div');
testMessage.textContent = 'Webpack is up and running.';
testMessage.classList.add('style-loader-test-class');

document.body.append(testMessage);