import { toTimeString } from "@/src/utils";

type Props = {
  first_name: string;
  last_name: string | null;
  username: string | null;
  email: string | null;
  association: string | null;
  elapsedTime: number;
}

const LoginInfoCard = (props: Props) => {
  const {
    first_name,
    last_name,
    username,
    email,
    association,
    elapsedTime
  } = props

  const timeString = toTimeString(elapsedTime, 'HHMMSS')
  
  return (
    <div className="flex p-4 w-11/12 rounded-xl justify-between items-center shadow-md
      bg-gray-200 dark:bg-gray-700 dark:shadow-black">
      <div>
        <p className="text-sm">{first_name} {last_name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{username ? `@${username}` : email}</p>
      </div>
      <div className="text-end">
        <p className="text-sm">{association || 'No association'}</p>
        <p className="text-sm">{timeString}</p>
      </div>
    </div>
  )
}

export default LoginInfoCard
