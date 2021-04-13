import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Smarkets, { Event } from './services/smarkets'
import Opendota, { Team } from './services/opendota'
import BettingEvent from './components/BettingEvent'

const username = process.env.REACT_APP_SMARKETS_USERNAME
const password = process.env.REACT_APP_SMARKETS_PASSWORD
const apiKey = process.env.REACT_APP_OPENDOTA_KEY
const delimeter = ' vs '

function App() {

  const [events, setEvents] = useState<Event[]>([])
  const [teams, setTeams] = useState<Team[]>()

  const smarketsClient = useRef<Smarkets>()
  const opendotaClient = useRef<Opendota>(new Opendota(apiKey))

  const initSmarkets = useCallback(async () => {
    const token = 'WzM3ODc1Njk3LDE0MDE4NDcxNV0.0JuruMYmNA9oWwhDkfAHs73IRC8' // await retriveToken(username, password)
    const instance = new Smarkets(token)
    if (instance.ready) {
      smarketsClient.current = instance
    }
  }, [])

  useEffect(() => {
    initSmarkets()
  }, [initSmarkets])

  const smarketsReady = smarketsClient.current?.ready
  const opendotaReady = opendotaClient.current?.ready

  const loadEvents = useCallback(async () => {
    const remoteEvents = await smarketsClient.current?.getEvents()
    if (remoteEvents?.events) {
      setEvents(remoteEvents?.events)
    }
  }, [])

  const loadTeams = useCallback(async () => {
    const remoteTeams = await opendotaClient.current?.getTeams()
    setTeams(remoteTeams)
  }, [opendotaClient])

  useEffect(() => {
    if (smarketsReady) {
      loadEvents()
    }
  }, [smarketsReady, loadEvents])

  useEffect(() => {
    if (opendotaReady) {
      loadTeams()
    }
  }, [opendotaReady, loadTeams])

  return (
    <div className="App">
      <div className="App-video">
        <video autoPlay preload="auto" loop playsInline>
          <source type="video/webm" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/homepage/dota_montage_webm.webm" />
          <source type="video/mp4" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/homepage/dota_montage_02.mp4" />
        </video>
      </div>
      <ul>
        {
          events.map(event => {
            const potentialNames = event.name.split(delimeter)
            const team1 = teams?.find(v => v.name === potentialNames[0])
            const team2 = teams?.find(v => v.name === potentialNames[1])
            return (
              <li key={event.id}>
                <BettingEvent
                  event={{
                    id: event.id,
                    name: event.name,
                    slug: event.slug,
                    start_datetime: new Date(event.start_datetime),
                    teams: [team1, team2]
                  }}
                />
              </li>
            )
          })
        }
      </ul>
    </div>
  );
}

export default App;
