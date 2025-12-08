import { Link } from 'react-router-dom'
import { User } from 'lucide-react'

const Home = () => {
  return (
    <div className='min-h-screen bg-light dark:bg-dark-bg'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white dark:bg-dark-card rounded-xl shadow-md p-8'>
          <h2 className='text-3xl font-bold text-primary-dark dark:text-dark-text mb-4'>Your Movies</h2>
          <p className='text-primary-dark/70 dark:text-dark-text/70 text-lg mb-6'>
            Movie list functionality coming soon...
          </p>

          <Link
            to='/profile'
            className='inline-flex items-center gap-2 bg-accent-orange hover:bg-accent-orange/90
                     text-light font-semibold px-6 py-3 rounded-lg transition-colors'
          >
            <User size={20} />
            <span>View Profile</span>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
