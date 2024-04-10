// Define a custom error formatter
const customErrorHandler = (errors, req, res, next) => {
    if (errors) {
        console.log(errors)
        // Send custom error response
        res.status(400).json({ error: errors.details.body[0].message });
    } else {
        next();
    }
};

export default customErrorHandler