export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return <main className="flex min-h-screen flex-col"></main>;
}
