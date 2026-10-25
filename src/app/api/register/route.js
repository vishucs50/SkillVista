import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    let welcomeEmailSent = false;
    try {
      await sendWelcomeEmail({ name: user.name, email: user.email });
      welcomeEmailSent = true;
    } catch (emailError) {
      console.error("WELCOME EMAIL ERROR:", emailError);
    }

    return Response.json({ success: true, welcomeEmailSent }, { status: 201 });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
