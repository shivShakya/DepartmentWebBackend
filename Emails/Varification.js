import { Router } from 'express'; // Import Router from express
import brevo from 'sib-api-v3-sdk';
import UserProfile from '../User/UserProfile.js';
import bcrypt from 'bcrypt';
import env from 'dotenv';
env.config();
const { ApiClient, SendSmtpEmail, TransactionalEmailsApi } = brevo;

const router = Router(); // Create a router instance
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


function Varification(Email, OTP){
  console.log({ApiClient, SendSmtpEmail, TransactionalEmailsApi});

  var defaultClient =brevo.ApiClient.instance;
  var apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.EMAIL_KEY;

  let apiInstance = new brevo.TransactionalEmailsApi();
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "My {{params.subject}}";
  sendSmtpEmail.htmlContent = `<html><body><h1> your otp number is : ${OTP}</h1></body></html>`;
  sendSmtpEmail.sender = { "name": "Shivam Shakya", "email": "shivdu2000@gmail.com" };
  sendSmtpEmail.to = [
    { "email": Email, "name": "Reciever" }
  ];
  sendSmtpEmail.replyTo = { "email": "shivdu2000@gmail.com", "name": "Shivam Shakya" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
       console.log( {"Success" :  JSON.stringify(data)});
       return  true;
  }, function (error) {
       console.log( {"Failed" :  error});
       return  false;
  });
}

function validateEmail(email) {
    return emailRegex.test(email);
};

router.post('/emailVarification', async (req, res) => {
    const { Email} = req.body;
    console.log({Email});
     if(Email != '' && validateEmail(Email)){
        try {

            const OTP =Math.round(100*Math.random());
            console.log({OTP})
            Varification(Email , OTP);
            res.json({message : "successfully send" , generatedOTP: OTP});
            console.log(OTP);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error Please try after some time" });
        }
     }else{
            res.status(500).json({message: "Email is not valid"});

     }
});

router.post('/forgetPassword', async (req, res) => {
  const { forEmail, newPassword, confPassword } = req.body;

  try {
    if (newPassword !== confPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and minimum 8 characters long" });
    }

    const userProfile = await UserProfile.findOne({ Email: forEmail });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    userProfile.Password = hashedPassword;
    await userProfile.save();
    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});


router.post('/otpMatch', (req,res)=> {
    const { userOTP, generatedOTP } = req.body;
    console.log({userOTP , generatedOTP});
    if (parseInt(userOTP,10) === generatedOTP) {
        console.log({ message: 'OTP verification successful' });
        res.json({ success : true ,  message: 'OTP verification successful' });
      } else {
        console.log({ message: 'OTP verification failed' });
        res.status(400).json({ success : false ,message: 'OTP verification failed' });
      }
});

export default router;
