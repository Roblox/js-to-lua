export default !!process.stdout.isTTY && process.env.TERM !== 'dumb' && !isCI;
