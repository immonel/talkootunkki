import axios from "axios";
import React, { MouseEvent, SetStateAction } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

type Props = {
  initData: string;
  setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}


const LoggedIn = ({ initData, setLoggedIn }: Props) => {
  const logout = async (event: MouseEvent<HTMLButtonElement>) => {
    await axios.post(`${baseUrl}/api/register/finish`, { initData })
      .then(response => {
        console.log('Logged out user', response.data.id)
        setLoggedIn(false)
      })
      .catch(error => console.log('Error logging out', error))
  }
  
  return (
    <>
      Logged in
      <button
        onClick={logout}
        className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4"
      >
        Log out
      </button>
    </>
  )}

export default LoggedIn