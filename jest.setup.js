const { execSync } = require('child_process');

process.env.NODE_ENV = 'test';
console.log('NODE_ENV:', process.env.NODE_ENV); // Adicione esta linha para verificar o valor de NODE_ENV

// Rodar as migrações antes dos testes
execSync('npm run migrate:test', { stdio: 'inherit' });