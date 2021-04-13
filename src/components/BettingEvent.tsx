import { Team } from '../services/opendota'
import './BettingEvent.css'
type Event = {
  start_datetime: Date;
  id: string;
  name: string;
  slug: string;
  teams: Array<Team | undefined>;
};
interface Props {
  onClick?: () => void;
  event: Event;
}

export default function BettingEvent({ onClick, event }: Props) {
  return (
    <div>
      <h1>{event.name}</h1>
      <div>
        {event?.teams?.map(v => (
          <div key={v?.team_id} className='event'>
            <img src={v?.logo_url} alt='team avatar' width={64} />
            <h3>{v?.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
