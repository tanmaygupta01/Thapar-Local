const Product = require('./models/product');
const { productSchema, reviewSchema } = require('./schemas');

module.exports.validateProduct = (req, res, next) => {
    const { name, img, desc, price } = req.body;
    const { error } = productSchema.validate({ name, img, desc, price });

    if (error) {
        const msg = error.details.map((err) => err.message).join(',');
        return res.render('error', { err: msg });
    }

    next();
}

module.exports.IsLoggedIn = (req, res, next) => {

    req.session.returnUrl = req.originalUrl;

    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to login first to do that!');
        return res.redirect('/login');
    }
    next();
}
module.exports.isSeller = (req, res, next) => {

    if (!(req.user.role && req.user.role === 'Seller')) {
        req.flash('error', 'You dont have permissions to do that');
        return res.redirect('/products');
    }

    next();
}

module.exports.isProductAuthor = async(req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!(product.author && product.author.equals(req.user._id))) {
        req.flash('error', 'You dont have permissions to do that');
        return res.redirect(`/products/${id}`);
    }
    next();
}