var Path = require('path'),
	_ = require('lodash'),
	jade = require('jade'),
	juice = require('juice');

var Composer = function(sendOptions, postbox) {
	if (!sendOptions || typeof sendOptions !== "object") throw new Error("Send options must be passed into postbox.compose(sendOptions) function");

	this.postbox = postbox;
	this.transport = null;
	this.templateName = "";
	this.variables = {};
	this.sendOptions = sendOptions;
};

Composer.prototype.transporter = function(transporterName) {
	if (!(transporterName in this.postbox.transporters)) throw new Error("Transporter '" + transporterName + "' not defined.");
	this.transport = this.postbox.transporters[transporterName];
	return this;
};

Composer.prototype.template = function(templateName) {
	this.templateName = templateName;
	return this;
};

Composer.prototype.with = function(variables) {
	if (typeof variables !== "object") throw new Error("Template variables must be an object.");
	this.variables = variables;
	return this;
};

Composer.prototype.send = function(callback) {
	
	var templateFile = Path.join(this.postbox.options.templatePath, this.templateName + '.jade'),
		template = jade.compileFile(templateFile, { cache: this.postbox.options.cache }),
		context = _.merge(this.postbox.options.globalContext, this.variables),
		juiceOptions = { removeStyleTags: true },
		html = juice(template(context), juiceOptions);

	this.sendOptions.html = html;
	this.transport.sendMail(this.sendOptions, callback);
};

module.exports = Composer;