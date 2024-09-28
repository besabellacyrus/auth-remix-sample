import {
  json,
  redirect,
  ActionFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { prisma } from "utils/prisma.server";

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return json<ActionData>({ error: "Invalid form data" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log({ hashedPassword, email });

  try {
    await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return redirect("/login");
  } catch (error) {
    console.log({ error });
    return json<ActionData>({ error: "User already exists" }, { status: 400 });
  }
};

export default function RegisterPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Register</h1>
      <Form method="post">
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" required />
        </div>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <button type="submit">Register</button>
      </Form>
    </div>
  );
}
