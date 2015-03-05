var postbox = require('../index.js'),
	Composer = require('../lib/composer.js'),
	setup = require('./setup.json'),
	expect = require('expect.js');

describe('postbox', function() {
	describe('#config()', function() {

		it('should successfully configure postbox', function() {

			expect(postbox.options.templatePath).to.be('./templates/email');
			expect(postbox.options.cache).to.be(true);
			expect(postbox.options.globalContext.message).to.be(undefined);

			postbox.config({
				templatePath: './test/templates',
				cache: false,
				globalContext: {
					message: 'Sending a test email to '
				}
			});

			expect(postbox.options.templatePath).to.be('./test/templates');
			expect(postbox.options.cache).to.be(false);
			expect(postbox.options.globalContext.message).to.be('Sending a test email to ');

		});

	});

	describe('#addTransporter()', function() {

		it('should successfully add a transporter', function() {

			postbox.addTransporter('mailer', setup.provider);
			expect(postbox.transporters.mailer).not.to.be(undefined);

		});

	});
});

describe('composer', function() {
	describe('#compose()', function() {

		it('shoud return an instance of Composer', function() {

			expect(postbox.compose({})).to.be.a(Composer);

		});

		it('should select a template file and send email', function(done) {

			postbox.compose(setup.sendTo)
					.transporter('mailer')
					.template('welcome').with({ email: setup.sendTo.to })
					.send(function(err, info) {
						expect(err).to.be(null);
						expect(info).not.to.be(null);
						done();
					});

		});

	});
});