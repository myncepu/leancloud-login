import { Analytics, PageHit } from 'expo-analytics'

let google_analytics_id = 'UA-120220297-1'

let analytics = new Analytics(google_analytics_id)

let track = screen => analytics.hit(new PageHit(screen))

export default track
