import { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuthCookie } from "utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  let userId = await requireAuthCookie(request);
  return null;
}

export default function Home() {
  return <div>Home page</div>;
}
