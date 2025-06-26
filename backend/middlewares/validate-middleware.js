//higher order function that returns an asynchronous function
const validate = (schema) => async(req, res, next) => 
{
    try
    {
        const parseBody = await schema.parseAsync(req.body); //validate the request's body using parseAsync
        req.body = parseBody; //if it is validated, the body is set as the request's body else it moves to catch block
        next(); //to proceed to the next middleware function
    }
    catch(err)
    {
        const status = 422;
        const message = "Fill the required fields properly";
        const extraDetails = err?.errors?.[0]?.message || "Validation failed";
        const error = {
            status,
            message,
            extraDetails,
        };
        //res.status(400).json({msg:message});
        console.log(error);
        next(error);
    }
}

module.exports = validate;
