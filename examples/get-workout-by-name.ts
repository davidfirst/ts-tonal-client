import 'dotenv/config'
import TonalClient from '../src/index'

const getWorkoutByName = async (searchName: string) => {
  try {
    const client = await TonalClient.create({
      username: process.env.TONAL_USERNAME!,
      password: process.env.TONAL_PASSWORD!,
    })

    console.log(`🔍 Searching for workouts matching: "${searchName}"\n`)

    // Fetch more workouts to increase chances of finding a match
    const workouts = await client.getUserWorkouts(0, 50)

    // Case-insensitive partial match search
    const matches = workouts.filter(w =>
      w.title.toLowerCase().includes(searchName.toLowerCase())
    )

    if (matches.length === 0) {
      console.log(`❌ No workouts found matching "${searchName}"`)
      console.log(`\nTip: Try a partial name or check your recent workouts with: npm run example:user-workouts`)
      process.exit(1)
    }

    if (matches.length === 1) {
      console.log(`✅ Found 1 matching workout:\n`)
      const workout = await client.getWorkoutById(matches[0].id)
      console.log(JSON.stringify(workout, null, 2))
    } else {
      console.log(`Found ${matches.length} matching workouts:\n`)
      matches.forEach((workout, index) => {
        console.log(`${index + 1}. ${workout.title}`)
        console.log(`   ID: ${workout.id}`)
        console.log(`   Created: ${new Date(workout.createdAt).toLocaleDateString()}`)
        console.log('')
      })
      console.log(`\nTip: Use a more specific search term or use the ID with: npm run example:workout:id <ID>`)
    }

  } catch (e) {
    console.error(e)
  }
}

// Example usage: Pass the workout name as a command line argument
const searchName = process.argv.slice(2).join(' ')
if (!searchName) {
  console.error('Please provide a workout name (or partial name) to search for')
  console.error('Example: npm run example:workout:name "Upper Body"')
  process.exit(1)
}

getWorkoutByName(searchName)
