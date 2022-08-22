const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

//return stripe to front end
exports.sendStripeAPI = async (req, res) => {
    res.status(200).json({ stripeAPIKey: process.env.STRIPE_API_KEY })
}
// processing payment
exports.processPayment = async (req, res) => {
    console.log(req.body.amount)
    const PaymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        // amount: 10000,
        currency: 'npr',
        metadata: { integration_check: "accept_a_payment" }
    })
    res.status(200).json({
        client_secret: PaymentIntent.client_secret
    })
}
