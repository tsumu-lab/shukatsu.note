import { auth, signIn, signOut } from "@/auth";

export default async function AuthButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit" className="text-sm bg-gray-800 text-white px-3 py-1 rounded">
          Googleでログイン
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">{session.user.name}</span>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit" className="text-blue-600 underline">
          ログアウト
        </button>
      </form>
    </div>
  );
}