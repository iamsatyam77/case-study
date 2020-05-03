const rp = require("request-promise");

module.exports = {
  sendEmail(user) {
    const emailData = {
      personalizations: [
        {
          to: [
            {
              email: user.email,
            },
          ],
          substitutions: {
            "-sitename-": "Case Study",
            "-fname-": user.firstName,
            "-lname-": user.lastName,
            "-verificationcode-": user.verificationCode,
          },
          subject: `Welcome to Case Study Application`,
        },
      ],
      templateId: process.env.SENDGRID.TEMPLATE_ID,
    };

    sendEmailBySendgrid(emailData);
  },
};

function sendEmailBySendgrid(params) {
  const emailData = {};
  emailData.from = {
    email: process.env.SENDGRID.FROM_EMAIL,
  };
  emailData.personalizations = params.personalizations;
  emailData.template_id = params.templateId;

  const requestData = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.SENDGRID.API_KEY}`,
    },
    uri: process.env.SENDGRID.API_URL + process.env.SENDGRID.SEND_MAIL_URL,
    body: emailData,
    json: true,
  };
  rp(requestData);
}
