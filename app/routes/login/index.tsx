import { json, redirect, ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "~/utils/prisma.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json({ error: "Invalid email or password" }, { status: 400 });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Set token in cookies
  return redirect("/", {
    headers: {
      "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
    },
  });
};

export default function LoginPage() {
  const actionData = useActionData();

  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" required />
        </div>
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
