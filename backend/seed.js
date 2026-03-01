/**
 * Database Seeder
 * ────────────────
 * Populates the database with sample recruiters, job seekers, jobs, and applications.
 * Run:  npm run seed
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for Seeding...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();

    console.log("Old data cleared...");

    // Hash password
    const hashedPassword = await bcrypt.hash("123456", 12);

    // ------------------ USERS ------------------
    const recruiters = await User.insertMany([
      {
        name: "Rohit Sharma",
        email: "rohit@technova.com",
        password: hashedPassword,
        role: "recruiter",
      },
      {
        name: "Anjali Mehta",
        email: "anjali@codesphere.com",
        password: hashedPassword,
        role: "recruiter",
      },
      {
        name: "Vikram Reddy",
        email: "vikram@insightanalytics.com",
        password: hashedPassword,
        role: "recruiter",
      },
      {
        name: "Sneha Kapoor",
        email: "sneha@pixelcraft.com",
        password: hashedPassword,
        role: "recruiter",
      },
      {
        name: "Arjun Nair",
        email: "arjun@hireflow.io",
        password: hashedPassword,
        role: "recruiter",
      },
    ]);

    const jobSeekers = await User.insertMany(
      Array.from({ length: 10 }).map((_, i) => ({
        name: `Job Seeker ${i + 1}`,
        email: `seeker${i + 1}@gmail.com`,
        password: hashedPassword,
        role: "seeker",
      }))
    );

    console.log("Users inserted...");

    // ------------------ JOBS ------------------
    const jobTitles = [
      "Frontend Developer",
      "MERN Stack Developer",
      "Backend Developer",
      "Data Analyst",
      "UI/UX Designer",
      "DevOps Engineer",
      "QA Tester",
      "Python Developer",
      "AI/ML Intern",
      "Cloud Engineer",
      "React Native Developer",
      "Software Engineer",
      "Business Analyst",
      "Support Engineer",
      "Full Stack Intern",
      "Angular Developer",
      "HR Executive",
      "Digital Marketing Executive",
      "SEO Specialist",
      "Product Manager",
    ];

    const jobs = await Job.insertMany(
      jobTitles.map((title, index) => ({
        title,
        description: `We are hiring a passionate ${title} to join our growing team.`,
        company: recruiters[index % recruiters.length].name + "'s Company",
        location: ["Hyderabad", "Bangalore", "Mumbai", "Pune", "Remote"][
          index % 5
        ],
        salary: `${3 + index}-${5 + index} LPA`,
        createdBy: recruiters[index % recruiters.length]._id,
      }))
    );

    console.log("Jobs inserted...");

    // ------------------ APPLICATIONS ------------------
    const applicationsData = [];

    jobSeekers.forEach((seeker, i) => {
      applicationsData.push({
        job: jobs[i]._id,
        applicant: seeker._id,
        resume: "https://example.com/resume.pdf",
        status: "pending",
      });
    });

    await Application.insertMany(applicationsData);

    console.log("Applications inserted...");
    console.log("Database Seeded Successfully 🚀");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

(async () => {
  await connectDB();
  await seedData();
})();
