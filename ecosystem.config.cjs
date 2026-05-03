module.exports = {
  apps: [
    {
      name: 'certmin-blog',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/home/ubuntu/projects/certmin-s-blog',
      interpreter: '/home/ubuntu/.nvm/versions/node/v22.22.2/bin/node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
