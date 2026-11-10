module.exports = api => {
  const isDev = !api.env('production')

  return {
    presets: [
      ['@babel/preset-env', { targets: 'defaults' }],
      ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    plugins: isDev ? ['react-refresh/babel'] : []
  }
}
