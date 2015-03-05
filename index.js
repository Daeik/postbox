var _ = require('lodash'),
	nodemailer = require('nodemailer');

var Composer = require('./lib/composer.js');

(function() {

	"use strict";

	var postbox = {
		options: {
			templatePath: './templates/email',
			cache: true,
			globalContext: {}
		},
		transporters: {},
	};

	postbox.config = function(options) {
		postbox.options = _.merge(postbox.options, options);
	};

	postbox.addTransporter = function(transporterName, nodemailerTransporterOptions) {
		if (!transporterName || typeof transporterName !== "string") throw new Error("Transporter name not defined");
		if (!nodemailerTransporterOptions || typeof nodemailerTransporterOptions !== "object") throw new Error("Wrong nodemailer options passed");

		postbox.transporters[transporterName] = nodemailer.createTransport(nodemailerTransporterOptions);
	};

	postbox.compose = function(sendOptions) {
		return new Composer(sendOptions, postbox);
	};

	module.exports = postbox;

})();