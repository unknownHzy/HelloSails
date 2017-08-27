/**
 * CustomerController
 *
 * @description :: Server-side logic for managing customers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'new': function (req, res) {
		console.log(req.session);
	    res.view(); //jump to view which name is new.ejs
    },

	create: function (req, res, next) {
    	Customer.create(req.allParams(), function (err, customer) {
    		if (err) return next(err);

    		sails.log.info(`customer created --> id = ${customer.id}`);
			res.redirect(`/customer/show/${customer.id}`);
		});
	},
	
	show: function (req, res, next) {
		Customer.findOne(req.param('id'), function (err, customer) {
			sails.log.info(`show customer --> id = ${customer.id}`);

			if (err) return next(err);

			if (!customer) return next();

			res.view({customer});
		});
	},

	customers: function (req, res, next) {
		Customer.find(function (err, customers) {
			sails.log.info('list customers');

			if (err) return next(req);

			res.view({customers});
		});
	},

	edit: function (req, res, next) {
		Customer.findOne(req.param('id'), function (err, customer) {
			sails.log.info(`edit customer --> id = ${customer.id}`);

			if (err) return next(err);

			if (!customer) return next();

			res.view({customer});
		});
	},

	update: function (req, res, next) {
		const id = req.param('id');
		Customer.update(id, req.allParams(), function (err) {
			sails.log.info(`updated customer --> id = ${id}`);
			sails.log.info(JSON.stringify(req.allParams()));

			if (err) return next(err);

			res.redirect(`/customer/customers`);
		});
	},

	destroy: function (req, res) {
		Customer.destroy(req.param('id'))
			.exec(function () {
				res.redirect(`/customer/customers`);
			});
	},

	index: function (req, res) {
		res.view();
	},

	login: function (req, res) {
		const name = req.param('name');
		const password = req.param('password');
		sails.log.info(`req body ${JSON.stringify(req.body)}`);
		sails.log.info(`req session ${JSON.stringify(req.session)}`);
		if (!name || !password) return res.json(200, 'bad name or password!');

		Customer.findOne({name, password}, function (err, customer) {
			if (err) {
				sails.log.error(err);
				return res.json(500, 'unexpected error in server');
			}

			//customer is not existed
			if (!customer) return res.json(200, 'please register first');

			res.redirect('/customer/customers');
		});
	},

	broadcast: function (req, res) {
		if (!req.isSocket) {return res.badRequest();}

		const roomName = 'studio';
		const msg = `MESSAGE: Welcome ${Math.random()} to come here!!!`;
		const eventName = 'message';
		// sails.sockets.join(req, roomName);
		// sails.sockets.broadcast(roomName, eventName, {msg});
		return res.ok({msg});
	},

    test: function (req, res) {
    	res.view();
	}
};

