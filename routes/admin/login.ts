import rateLimit from 'express-rate-limit';
import safeCompare from 'safe-compare';

const ADMIN_PASS = process.env.ADMIN_PASS;

// Rate limiter: 10 requests per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after a minute',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

async function loginHandler(req: any, res: any) {
    try {
        const { password = null } = req.body || {}

        if (!password) return res.status(400).send('password required!')

        const passMatched = safeCompare(password, ADMIN_PASS)
        if (!passMatched) return res.status(404).send('password invalid')

        return res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
}

export default [loginLimiter, loginHandler];