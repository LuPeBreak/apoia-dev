import Image from 'next/image'
import Description from './description'
import Name from './name'

interface CardProfileProps {
  user: {
    id: string
    name?: string | null
    username?: string | null
    bio?: string | null
    image?: string | null
  }
}

export default function ProfileCard({ user }: CardProfileProps) {
  return (
    <section className="w-full flex flex-col items-center mx-auto px-4">
      <div className="">
        <Image
          src={user.image || 'http://github.com/lupebreak.png'}
          alt="Foto de perfil"
          width={104}
          height={104}
          priority
          quality={100}
          className="rounded-xl bg-gray-50 object-cover border-4 border-white hover:shadow-xl duration-300"
        />
      </div>
      <div>
        <Name InitialName={user.name || 'Digite seu nome...'} />
        <Description
          InitialDescription={user.bio || 'Digite sua descrição...'}
        />
      </div>
    </section>
  )
}
