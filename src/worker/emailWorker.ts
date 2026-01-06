//bg worker that listens to 'email' queue

import {  Worker } from "bullmq"; //consumes job from queue
import redisConnection from "../config/redisConfig";
import nodemailer from "nodemailer";

interface EmailWorker {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER!, 
    pass: process.env.SMTP_PASS!,
  },
});
//test credentials before sending mail
transporter.verify((error) => {
  if (error) {
    console.error('Gmail connection error:', error);
  } else {
    console.log('Gmails will be sent via Nodemailer');
  }
});
//worker will run server separately
const worker = new Worker("email", async (job) => {
  const { to, subject, text, html }: EmailWorker = job.data;
  console.log("Processing job : ", job.id);

  //sending mail
  await transporter.sendMail({ //await is imp -> ensuring bullmq retries if failed
      from: `"Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent to", to);
  },
  {
    connection: redisConnection,
  }
);

//event listeners
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

export default worker;

