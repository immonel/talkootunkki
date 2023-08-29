import axios from "axios";
import React, { SetStateAction } from "react";
import CurrentEvent from "./CurrentEvent";

type Props = {
  initData: string;
  setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}

const LoggedIn = ({ initData, setLoggedIn }: Props) => {
  const logout = async () => {
    await axios.post('/api/register/finish', { initData })
      .then(response => {
        console.log('Logged out user', response.data.id)
        setLoggedIn(false)
      })
      .catch(error => console.log('Error logging out', error))
  }
  
  return (
    <div className='flex flex-col gap-10 w-full items-center'>
      Logged in
      <button
        onClick={logout}
        className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-80"
      >
        Log out
      </button>
      <CurrentEvent />
    </div>
  )}

export default LoggedIn