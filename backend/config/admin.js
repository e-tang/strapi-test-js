module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '3320277a8dd886f94f4a81e7da88c336'),
  },
});
