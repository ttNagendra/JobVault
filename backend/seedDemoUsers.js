/**
 * Seed Demo Users
 * ────────────────
 * Creates the two demo accounts used by the Login page's
 * quick-login buttons (Job Seeker & Recruiter).
 *
 * Usage:  node seedDemoUsers.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
const User = require("./models/User");

// Use Google DNS (same as db.js)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const demoUsers = [
    {
        name: "Demo Seeker",
        email: "seeker1@gmail.com",
        password: "123456",
        role: "seeker",
        phone: "9876543210",
    },
    {
        name: "Rohit Sharma",
        email: "rohit@technova.com",
        password: "123456",
        role: "recruiter",
        phone: "9876543211",
    },
];

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        for (const u of demoUsers) {
            const exists = await User.findOne({ email: u.email });
            if (exists) {
                console.log(`⏭️  ${u.email} already exists — skipping`);
            } else {
                await User.create(u);
                console.log(`✅ Created demo user: ${u.email} (${u.role})`);
            }
        }

        console.log("\n🎉 Done! Demo accounts are ready.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
})();
