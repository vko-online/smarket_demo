type Player = {
  account_id: number
  name: string
  games_played: number
  wins: number
  is_current_team_member: boolean
};
interface Props {
  profile: Player
  onClick?: () => void
}
export default function Component({ profile, onClick }: Props) {
  return (
    <div>
      <img src={`https://www.opendota.com/assets/images/dota2/players/${profile.account_id}.png`} alt='profile' />
    </div>
  )
}
