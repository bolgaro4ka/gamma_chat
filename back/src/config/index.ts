export default () => (
    {
        JWT_SECRET: process.env.JWT_SECRET || 'secret',
        JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '1d',

    }
)