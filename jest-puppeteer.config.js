module.exports = {
  launch: {
    headless: true,
    slowMo: 0,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  server: {
    command: 'npm run dev',
    port: 3000,
    launchTimeout: 20000,
    debug: true,
  },
};
