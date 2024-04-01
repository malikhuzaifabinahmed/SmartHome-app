import { register } from "@/actions/Authenticate";

export default async function Home() {

  try {
    let response =  await register({
      email: "huzaifamalik3216@gmail.com",
      password: "password",
      role:"user",

    })
    
    
  } catch (error) {
    
  }
  return <main className="flex min-h-screen flex-col"></main>;
}
