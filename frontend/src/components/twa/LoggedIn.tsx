import CurrentEvent from "./CurrentEvent";

const LoggedIn = () => (
  <div className='flex flex-col gap-10 w-full items-center'>
    Logged in
    <a
      href='/twa/finish'
      className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-80 text-center"
    >
      Log out
    </a>
    <CurrentEvent />
  </div>
)

export default LoggedIn