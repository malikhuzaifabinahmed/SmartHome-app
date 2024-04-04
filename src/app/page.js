import { register } from "@/actions/Authenticate";
import { con } from "@/actions/test";

export default async function Home() {

  try {
    // let response =  await register({
    //   firstName :"huzaifa",
    //   lastName: "bin Ahmed",
    //   email: "huzaifamalik32as2216@gmail.com",
    //   password: "password",
    //   role:"user",

    // })
    con();
    
  } catch (error) {
    
  }
  return <main className="flex min-h-screen flex-col"></main>;
}
