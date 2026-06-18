import LoginForm from "@/components/pat/login-form";

export default function PatLoginPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center py-10">
      <div className="w-full rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold">Pat login</h1>
          <p className="text-sm text-muted-foreground">
            Enter the simple admin credentials to open the blog editor.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}